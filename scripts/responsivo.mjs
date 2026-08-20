#!/usr/bin/env node
/**
 * Auditoria de responsividade das páginas publicadas.
 *
 *   npm run dev:web            (noutro terminal)
 *   node scripts/responsivo.mjs [--base http://localhost:4173]
 *
 * Afirma três coisas em cada combinação de página × largura × tema:
 *
 *   1. o `body` não rola na horizontal — o que é largo por natureza (tabela,
 *      bloco de código, preview do SVG composto) tem de rolar dentro do próprio
 *      container, nunca empurrando a página;
 *   2. nenhum elemento transborda a largura da viewport;
 *   3. na faixa de toque, todo alvo interativo tem pelo menos 44×44 px —
 *      exceto o link inline dentro de texto corrido, que a WCAG 2.5.8 isenta.
 *
 * Falha vira lista de seletores, não impressão.
 *
 * O playwright-core NÃO é dependência do projeto: um repositório com duas
 * devDependencies não vai ganhar a terceira por causa de um script de
 * verificação. Ele é resolvido em tempo de execução; se não estiver instalado,
 * o script avisa como instalar e sai com 0, em vez de reprovar um build que não
 * tem nada a ver com isso.
 *
 *   npm i --no-save playwright-core
 *   PLAYWRIGHT_CORE=/caminho/para/playwright-core node scripts/responsivo.mjs
 */

async function carregarPlaywright() {
  const candidatos = [
    process.env.PLAYWRIGHT_CORE,
    'playwright-core',
    'playwright',
  ].filter(Boolean);

  for (const c of candidatos) {
    try {
      const m = await import(c);
      return m.chromium ?? m.default?.chromium;
    } catch {
      /* tenta o próximo */
    }
  }
  return null;
}

const chromium = await carregarPlaywright();
if (!chromium) {
  console.log(
    'playwright-core não encontrado — auditoria de responsividade pulada.\n' +
      '  npm i --no-save playwright-core   (ou aponte PLAYWRIGHT_CORE)'
  );
  process.exit(0);
}

const BASE =
  process.argv.find(a => a.startsWith('--base='))?.slice(7) ??
  'http://localhost:4173';

const PAGINAS = [
  '/',
  '/design-system',
  '/marca',
  '/changelog',
  '/sobre',
  '/rota-inexistente',
];

/** [rótulo, largura, altura]. A faixa de toque é tudo abaixo de 820px. */
const TELAS = [
  ['celular pequeno', 320, 640],
  ['celular pequeno', 360, 740],
  ['celular', 390, 844],
  ['celular', 414, 896],
  ['celular grande', 430, 932],
  ['celular deitado', 844, 390],
  ['tablet retrato', 768, 1024],
  ['tablet retrato', 834, 1112],
  ['tablet deitado', 1024, 768],
  ['tablet deitado', 1180, 820],
  ['desktop', 1280, 900],
  ['desktop', 1440, 900],
  ['desktop', 1680, 1050],
  ['tela larga', 1920, 1080],
  ['tela larga', 2560, 1400],
];

const LARGURA_TOQUE = 820;
const ALVO_MIN = 44;

const nav = await chromium.launch({
  executablePath:
    process.env.CHROMIUM ??
    '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox'],
});

const problemas = [];
let checagens = 0;

for (const [rotulo, largura, altura] of TELAS) {
  for (const tema of ['dark', 'light']) {
    const ctx = await nav.newContext({
      viewport: { width: largura, height: altura },
      colorScheme: tema,
      hasTouch: largura < LARGURA_TOQUE,
    });
    const p = await ctx.newPage();

    for (const rota of PAGINAS) {
      await p.goto(BASE + rota, { waitUntil: 'networkidle' });
      checagens++;

      const achados = await p.evaluate(
        ([largura, alvoMin, exigirToque]) => {
          const ruins = [];
          const identifica = el =>
            el.tagName.toLowerCase() +
            (el.id ? '#' + el.id : '') +
            (el.className && typeof el.className === 'string'
              ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.')
              : '');

          if (document.documentElement.scrollWidth > largura + 1)
            ruins.push(
              `a página rola na horizontal: ${document.documentElement.scrollWidth}px de conteúdo`
            );

          for (const el of document.body.querySelectorAll('*')) {
            const r = el.getBoundingClientRect();
            if (r.width === 0 && r.height === 0) continue;
            // Só conta transbordo para fora da viewport; rolagem interna é o
            // comportamento pedido, não um defeito.
            if (
              r.right > largura + 1 &&
              getComputedStyle(el).position !== 'fixed'
            ) {
              // Procura um container de rolagem em QUALQUER ancestral, não só no
              // pai: numa tabela larga dentro de `.tabela-rolavel`, o pai de um
              // `<td>` é o `<tr>`, e olhar só um nível acima acusava como
              // transbordo exatamente o padrão que o site deve usar.
              let rolavel = false;
              for (
                let a = el.parentElement;
                a && a !== document.body;
                a = a.parentElement
              )
                if (
                  ['auto', 'scroll'].includes(getComputedStyle(a).overflowX)
                ) {
                  rolavel = true;
                  break;
                }
              if (!rolavel)
                ruins.push(
                  `transborda: ${identifica(el)} até ${Math.round(r.right)}px`
                );
            }
          }

          if (exigirToque) {
            const vistos = new Set();
            for (const el of document.querySelectorAll(
              'a[href], button:not([disabled]), input, select, [role="checkbox"]'
            )) {
              const r = el.getBoundingClientRect();
              if (r.width === 0 || r.height === 0) continue;
              if (el.closest('[hidden], .modal, .drawer')) continue;

              // WCAG 2.5.8 isenta explicitamente o alvo "numa sentença ou cujo
              // tamanho é limitado pela entrelinha do texto que não é alvo".
              // Link dentro de parágrafo, célula de tabela ou item de lista é
              // esse caso: forçá-lo a 44px quebraria a linha do texto para
              // resolver um problema que a norma não considera problema.
              const cs = getComputedStyle(el);
              if (
                el.tagName === 'A' &&
                cs.display.startsWith('inline') &&
                el.closest('p, td, li, .t-small, .footer-note')
              )
                continue;
              if (r.height + 0.5 < alvoMin || r.width + 0.5 < alvoMin) {
                const chave = identifica(el);
                if (vistos.has(chave)) continue;
                vistos.add(chave);
                ruins.push(
                  `alvo pequeno: ${chave} ${Math.round(r.width)}x${Math.round(r.height)}`
                );
              }
            }
          }
          return ruins;
        },
        [largura, ALVO_MIN, largura < LARGURA_TOQUE]
      );

      for (const a of achados)
        problemas.push(`${largura}px ${tema} ${rota} — ${a}`);
    }
    await ctx.close();
  }
}

await nav.close();

console.log(
  `${checagens} combinações verificadas (${PAGINAS.length} páginas × ${TELAS.length} larguras × 2 temas)`
);

if (!problemas.length) {
  console.log(
    'nenhum transbordo, nenhuma rolagem horizontal, nenhum alvo abaixo de 44px'
  );
  process.exit(0);
}

// agrupa por sintoma, senão a mesma quebra aparece 30 vezes
const porSintoma = new Map();
for (const p of problemas) {
  const chave = p.slice(p.indexOf('— ') + 2);
  if (!porSintoma.has(chave)) porSintoma.set(chave, []);
  porSintoma.get(chave).push(p.slice(0, p.indexOf(' — ')));
}

console.error(
  `\n${porSintoma.size} sintoma(s) distintos em ${problemas.length} ocorrências:\n`
);
for (const [sintoma, onde] of [...porSintoma].sort(
  (a, b) => b[1].length - a[1].length
)) {
  console.error(`  ${sintoma}`);
  console.error(`    ${onde.length}x, ex.: ${onde.slice(0, 3).join(' | ')}`);
}
process.exit(1);
