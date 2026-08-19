#!/usr/bin/env node
/**
 * Compõe as páginas estáticas: site/pages/*.html + site/partials/* -> public/.
 *
 * Por que existe: até aqui o site era um único public/index.html de 991 linhas
 * com o CSS e o JS inline. Com mais de uma página, cabeçalho e rodapé teriam de
 * ser copiados à mão em cada arquivo — e divergiriam na primeira alteração.
 *
 * Composição em build time, e não no cliente: o HTML chega pronto, sem salto de
 * layout e sem depender de JS para desenhar a navegação.
 *
 * Cada página declara seus metadados numa primeira linha de comentário:
 *
 *   <!--pagina {"titulo":"...","descricao":"...","nav":"builder"}-->
 *
 * `nav` marca qual link do cabeçalho recebe aria-current="page".
 */
import fs from 'node:fs';
import path from 'node:path';
import { iconNameList } from '../lib/icons.mjs';
import { grupos, paletas, razao } from './tokens.mjs';

const ROOT = path.join(import.meta.dirname, '..');
const SITE = path.join(ROOT, 'site');
const PUBLIC = path.join(ROOT, 'public');

const ler = (...p) => fs.readFileSync(path.join(...p), 'utf8');

const partials = {
  head: ler(SITE, 'partials', 'head.html'),
  header: ler(SITE, 'partials', 'header.html'),
  footer: ler(SITE, 'partials', 'footer.html'),
};

/**
 * O logotipo vira um <symbol> inline, com as cores trocadas por tokens.
 *
 * Antes era um <img> apontando para brand/wordmark-{tema}.svg, trocado por JS.
 * Dois problemas: em tema claro a página pintava com a variante escura (nome em
 * slate-50, invisível sobre fundo claro) até o script rodar, e eram duas
 * requisições por página. Como <symbol>, ele acompanha o tema pelo próprio CSS,
 * instantaneamente, e o rodapé o reaproveita com <use> sem custo nenhum.
 */
function simboloMarca() {
  const svg = ler(ROOT, 'brand', 'wordmark-dark.svg');
  const viewBox = svg.match(/viewBox="([^"]+)"/)[1];
  const corpo = svg
    .slice(svg.indexOf('>') + 1, svg.lastIndexOf('</svg>'))
    .replace(/fill="#f43f5e"/g, 'fill="var(--brand)"')
    .replace(/fill="#f8fafc"/g, 'fill="var(--text-1)"')
    .replace(/fill="#818cf8"/g, 'fill="var(--accent)"')
    // O fontTools emite coordenadas com toda a precisão de ponto flutuante
    // ("44.800000000000004"). Duas casas num viewBox de 704.8 já é abaixo de um
    // décimo de pixel na maior renderização da página, e corta 44% do arquivo.
    .replace(/-?\d+\.\d+/g, m => String(Math.round(parseFloat(m) * 100) / 100))
    .trim();
  return (
    `<svg style="display:none" aria-hidden="true">` +
    `<symbol id="marca-gcruz" viewBox="${viewBox}">${corpo}</symbol></svg>`
  );
}

const globais = {
  ano: String(new Date().getFullYear()),
  totalIcones: String(iconNameList.length),
  marca: simboloMarca(),
};

/** Troca {{chave}} pelos valores dados. Não recursivo de propósito. */
function preencher(texto, valores) {
  return texto.replace(/\{\{(\w+)\}\}/g, (m, chave) =>
    chave in valores ? valores[chave] : m
  );
}

/** Marca o link de navegação da página atual, no cabeçalho e no drawer. */
function marcarNav(html, nav) {
  if (!nav) return html;
  return html.replaceAll(
    `data-nav="${nav}"`,
    `data-nav="${nav}" aria-current="page"`
  );
}

function copiarDir(de, para) {
  fs.rmSync(para, { recursive: true, force: true });
  fs.cpSync(de, para, { recursive: true });
  return fs.readdirSync(para).length;
}

/**
 * Junta os quatro CSS num arquivo só e tira os comentários.
 *
 * A ordem importa: tokens define as variáveis que os outros três consomem.
 *
 * São 4 requisições a menos e, medido, 8027 -> 5311 B gzip: arquivos pequenos
 * comprimidos em separado repetem o dicionário, e os comentários deste projeto
 * são longos de propósito. Eles seguem no fonte, em site/css/, que é onde se
 * lê e se edita — public/ é saída de build.
 */
const ORDEM_CSS = ['tokens', 'base', 'components', 'paginas'];

function juntarCss(destino) {
  const junto = ORDEM_CSS.map(n => ler(SITE, 'css', `${n}.css`)).join('\n');
  const enxuto = junto
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, enxuto + '\n');
  return enxuto.length;
}

/** Escapa texto que vai virar HTML. */
function escapar(s) {
  return s.replace(
    /[&<>"]/g,
    c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]
  );
}

/**
 * Renderiza site/changelog.json na marcação que a página do changelog espera.
 *
 * `versao` é escapado — títulos como "Badge <gc/>" seriam parseados como tag
 * desconhecida e sumiriam da página. `descricao` NÃO é: ali a marcação é
 * intencional (<code>, <em>), e o arquivo é nosso, não entrada de usuário.
 */
function changelog() {
  const dados = JSON.parse(ler(SITE, 'changelog.json'));
  const rotulo = {
    added: ['Adicionado', 'ok'],
    changed: ['Alterado', 'info'],
    fixed: ['Corrigido', 'warn'],
    removed: ['Removido', 'err'],
  };
  return dados
    .map(entrada => {
      const itens = entrada.mudancas
        .map(m => {
          const [texto, cor] = rotulo[m.tipo] ?? ['Outro', 'info'];
          return `
          <li>
            <span class="cl-tipo" data-cor="${cor}">${texto}</span>
            <span>${m.descricao}</span>
          </li>`;
        })
        .join('');
      return `
      <article class="cl-entrada">
        <div class="cl-meta">
          <h2 class="t-h3">${escapar(entrada.versao)}</h2>
          <time class="t-label" datetime="${entrada.data}">${entrada.data}</time>
        </div>
        <ul class="cl-lista">${itens}
        </ul>
      </article>`;
    })
    .join('\n');
}

/* ------------------------------------------------------------------------
   Página de Design System, gerada a partir de site/css/tokens.css.

   O requisito é que o styleguide mostre o token que o código usa. Ler o mesmo
   arquivo que o navegador carrega é a única forma de isso continuar verdadeiro
   depois do primeiro ajuste de paleta — uma tabela digitada à mão começa certa
   e envelhece calada.
   ------------------------------------------------------------------------ */

/** Amostra de cor + valor, do jeito que a tabela de tokens repete. */
function celulaCor(valor) {
  return `<span class="amostra" style="--c: ${valor}"></span><code>${valor}</code>`;
}

function secaoCor() {
  const { claro, escuro } = paletas();
  const nomes = Object.keys(claro);

  const linhas = nomes
    .map(n => {
      // O contraste que interessa é o do token contra o fundo do próprio tema.
      const par = n === 'bg' ? null : 'bg';
      const c = par ? razao(claro[n], claro[par]).toFixed(2) : '—';
      const e = par ? razao(escuro[n], escuro[par]).toFixed(2) : '—';
      return `<tr>
            <td><code>--${n}</code></td>
            <td>${celulaCor(claro[n])}</td>
            <td>${celulaCor(escuro[n])}</td>
            <td class="t-code">${c === '—' ? '—' : `${c}:1 · ${e}:1`}</td>
          </tr>`;
    })
    .join('\n');

  return `<div class="tabela-rolavel">
          <table class="params">
            <thead>
              <tr><th>Token</th><th>Claro</th><th>Escuro</th><th>Contraste sobre <code>--bg</code></th></tr>
            </thead>
            <tbody>
${linhas}
            </tbody>
          </table>
        </div>`;
}

function secaoTipografia() {
  const tip = grupos().find(g => g.titulo === 'tipografia');
  const mapa = Object.fromEntries(tip.tokens.map(t => [t.nome, t.valor]));

  const familias = ['font-mono', 'font-sans']
    .map(
      n =>
        `<tr><td><code>--${n}</code></td><td class="t-code">${mapa[n].replace(/</g, '&lt;')}</td></tr>`
    )
    .join('\n');

  // os 8 tokens da escala saem dos próprios nomes, sem lista paralela
  const escala = [
    ...new Set(
      tip.tokens.map(t => t.nome.match(/^text-(.+)-size$/)?.[1]).filter(Boolean)
    ),
  ];

  const espécimes = escala
    .map(k => {
      const v = p => mapa[`text-${k}-${p}`];
      return `<div class="ds-tipo">
            <div class="ds-tipo-numeros">
              <code>--text-${k}</code>
              <span class="t-small">${v('size')} · peso ${v('weight')} · entrelinha ${v('lh')} · tracking ${v('ls')}</span>
            </div>
            <p class="t-${k}" style="margin:0">Ícones de tecnologia num único SVG</p>
          </div>`;
    })
    .join('\n');

  return `<div class="tabela-rolavel">
          <table class="params">
            <thead><tr><th>Família</th><th>Pilha</th></tr></thead>
            <tbody>
${familias}
            </tbody>
          </table>
        </div>
        <div class="ds-tipos">
${espécimes}
        </div>`;
}

function secaoEspaco() {
  const g = grupos().find(x => x.titulo === 'espaço e grid');
  const barras = g.tokens
    .filter(t => t.nome.startsWith('space-'))
    .map(
      t => `<div class="ds-espaco">
            <code>--${t.nome}</code>
            <span class="ds-barra" style="--w: ${t.valor}"></span>
            <span class="t-small">${t.valor}</span>
          </div>`
    )
    .join('\n');

  const outros = g.tokens
    .filter(t => !t.nome.startsWith('space-'))
    .map(
      t =>
        `<tr><td><code>--${t.nome}</code></td><td class="t-code">${t.valor}</td></tr>`
    )
    .join('\n');

  return `<div class="ds-espacos">
${barras}
        </div>
        <div class="tabela-rolavel">
          <table class="params">
            <thead><tr><th>Token</th><th>Valor</th></tr></thead>
            <tbody>
${outros}
            </tbody>
          </table>
        </div>
        <p class="t-small">A grade de 12 colunas, com o gutter do token:</p>
        <div class="grid ds-grade">${'<span></span>'.repeat(12)}</div>`;
}

function secaoSuperficie() {
  const g = grupos().find(x => x.titulo === 'superfície e elevação');
  const linhas = g.tokens
    .map(
      t =>
        `<tr><td><code>--${t.nome}</code></td><td class="t-code">${t.valor.replace(/</g, '&lt;')}</td></tr>`
    )
    .join('\n');
  return `<div class="tabela-rolavel">
          <table class="params">
            <thead><tr><th>Token</th><th>Valor</th></tr></thead>
            <tbody>
${linhas}
            </tbody>
          </table>
        </div>`;
}

function secaoMotion() {
  const g = grupos().find(x => x.titulo === 'motion');
  const durs = g.tokens.filter(t => t.nome.startsWith('dur-'));
  const demos = durs
    .map(t => {
      const chave = t.nome.replace('dur-', '');
      return `<div class="ds-motion">
            <div class="ds-motion-numeros">
              <code>--dur-${chave}</code>
              <span class="t-small">${t.valor} · <code>--ease-${chave}</code></span>
            </div>
            <div class="ds-pista"><span style="--d: var(--dur-${chave}); --e: var(--ease-${chave})"></span></div>
          </div>`;
    })
    .join('\n');
  const usos = {
    fast: 'hover, foco, chips',
    base: 'tabs, toast, tooltip',
    slow: 'drawer, modal',
    lazy: 'entrada de grade, preview',
  };
  const tabela = durs
    .map(t => {
      const k = t.nome.replace('dur-', '');
      return `<tr><td><code>--dur-${k}</code></td><td class="t-code">${t.valor}</td><td>${usos[k] ?? ''}</td></tr>`;
    })
    .join('\n');
  return `<div class="ds-motions">
${demos}
        </div>
        <div class="tabela-rolavel">
          <table class="params">
            <thead><tr><th>Token</th><th>Duração</th><th>Onde se aplica</th></tr></thead>
            <tbody>
${tabela}
            </tbody>
          </table>
        </div>
        <p class="t-small">
          Sob <code>prefers-reduced-motion: reduce</code> os quatro tokens vão a
          <code>0.01ms</code> de uma vez, no próprio <code>tokens.css</code> — nenhum
          componente precisa lembrar da media query.
        </p>`;
}

const SECOES_DS = {
  '{{dsCor}}': secaoCor,
  '{{dsTipografia}}': secaoTipografia,
  '{{dsEspaco}}': secaoEspaco,
  '{{dsSuperficie}}': secaoSuperficie,
  '{{dsMotion}}': secaoMotion,
};

const paginas = fs
  .readdirSync(path.join(SITE, 'pages'))
  .filter(f => f.endsWith('.html'));

fs.mkdirSync(PUBLIC, { recursive: true });

const escritas = [];
for (const arquivo of paginas) {
  const bruto = ler(SITE, 'pages', arquivo);
  const meta = bruto.match(/^<!--pagina\s+([\s\S]*?)-->\n?/);
  if (!meta)
    throw new Error(
      `site/pages/${arquivo} não declara <!--pagina {...}--> na primeira linha`
    );

  const { titulo, descricao, nav } = JSON.parse(meta[1]);
  const corpo = bruto.slice(meta[0].length);
  const valores = { ...globais, titulo, descricao };

  const html = `<!doctype html>
<html lang="pt-BR">
  <head>
${preencher(partials.head, valores)
  .trimEnd()
  .split('\n')
  .map(l => (l ? '    ' + l : l))
  .join('\n')}
  </head>
  <body>
    ${globais.marca}
${marcarNav(preencher(partials.header, valores), nav)}
    <main id="conteudo">
${preencher(
  Object.entries(SECOES_DS).reduce(
    (txt, [marca, gerar]) =>
      txt.includes(marca) ? txt.replace(marca, gerar) : txt,
    corpo.replace('{{changelog}}', changelog)
  ),
  valores
).trimEnd()}
    </main>
${marcarNav(preencher(partials.footer, valores), nav)}
  </body>
</html>
`;

  fs.writeFileSync(path.join(PUBLIC, arquivo), html);
  escritas.push(arquivo);
}

fs.rmSync(path.join(PUBLIC, 'css'), { recursive: true, force: true });
const css = juntarCss(path.join(PUBLIC, 'css', 'site.css'));
const js = copiarDir(path.join(SITE, 'js'), path.join(PUBLIC, 'js'));
const fontes = copiarDir(path.join(SITE, 'fonts'), path.join(PUBLIC, 'fonts'));

console.log(
  `public/: ${escritas.length} páginas (${escritas.join(', ')}) + ` +
    `css ${css}B + ${js} js + ${fontes} fontes`
);
