/**
 * Biblioteca de logotipos: renderiza cada variação nos dois temas e copia o
 * SVG no clique.
 *
 * A lista fica aqui, e não no HTML, porque cada peça vira quatro nós (nome,
 * prévia escura, prévia clara, link) — escrever isso à mão para 16 variações
 * seria 300 linhas de marcação repetida que divergiriam na primeira adição.
 */
import { toast } from './toast.js';

const GRUPOS = [
  {
    titulo: 'Canônicas',
    nota: 'Definidas no design system. São a marca oficial.',
    pecas: [
      [
        'wordmark',
        'Lockup principal, <code>&lt;gcruz.dev/&gt;</code> em peso 700',
      ],
      ['wordmark-600', 'O mesmo em peso 600, para display a partir de 40px'],
      ['compact', 'Variante compacta, <code>&lt;gc/&gt;</code> em peso 700'],
      [
        'app-tile',
        'Compacta sobre tile quadrado de 256px, <strong>com fundo</strong>',
        96,
      ],
      ['favicon', 'Compacta em canvas de 64px, <strong>com fundo</strong>', 64],
    ],
  },
  {
    titulo: 'Família curta',
    nota: 'Mesmos contornos, mesma escala e mesmos tokens das canônicas — por isso saem como continuação da marca, e não como peça avulsa.',
    pecas: [
      ['gc-dev', 'Versão curta completa, <code>&lt;gc.dev/&gt;</code>'],
      ['gcruz-tag', 'Baseada no nome, <code>&lt;gcruz/&gt;</code>'],
      [
        'gc',
        'Monograma <code>gc</code> — a peça mínima, para avatar e favicon',
      ],
    ],
  },
  {
    titulo: 'Propostas',
    nota: 'Sugestões para aprovar ou descartar. Não fazem parte da marca oficial.',
    pecas: [
      [
        'proposta-vertical',
        '<code>&lt;gcruz</code> sobre <code>.dev/&gt;</code>, empilhado',
      ],
      ['proposta-brackets', '<code>&lt;/&gt;</code> — a marca sem texto'],
    ],
  },
  {
    titulo: 'Escala de pesos',
    nota: 'O mesmo lockup nos quatro pesos, para comparar.',
    pecas: [
      ['peso-400', 'Regular'],
      ['peso-500', 'Medium'],
      ['peso-600', 'SemiBold — o peso de display'],
      ['peso-700', 'Bold — o peso padrão da marca'],
    ],
  },
];

/** Os três que também existem como ícone da API. */
const BADGES = [
  ['gcruz', 'GCruz', '<code>&lt;gcruz/&gt;</code> — o badge principal'],
  [
    'gctag',
    'GCTag',
    '<code>&lt;gc/&gt;</code> — a compacta, legível a partir de 24px',
  ],
  ['gc', 'GC', 'O monograma, legível até 16px'],
];

export function iniciarMarca() {
  const alvo = document.querySelector('#marca-lista');
  if (!alvo) return;

  // `lado` só é passado nas peças quadradas (tile, favicon): sem ele o
  // max-height de 44px as encolheria a um quadradinho ilegível.
  const peca = (base, desc, lado) => {
    const dim = lado ? ` width="${lado}" height="${lado}"` : '';
    return `
    <div class="peca">
      <div class="peca-previa" data-fundo="dark">
        <img src="/brand/${base}-dark.svg" alt="${base} na variante escura"${dim} loading="lazy" />
      </div>
      <div class="peca-previa" data-fundo="light">
        <img src="/brand/${base}-light.svg" alt="${base} na variante clara"${dim} loading="lazy" />
      </div>
      <div class="peca-meta">
        <code class="peca-nome">${base}-{dark,light}.svg</code>
        <span class="t-small">${desc}</span>
        <div class="row">
          <button class="btn btn-sm" type="button" data-svg="/brand/${base}-dark.svg">
            Copiar SVG escuro
          </button>
          <button class="btn btn-sm" type="button" data-svg="/brand/${base}-light.svg">
            Copiar SVG claro
          </button>
        </div>
      </div>
    </div>`;
  };

  alvo.innerHTML =
    GRUPOS.map(
      g => `
      <section class="cat">
        <div class="cat-head"><h3 class="t-h3">${g.titulo}</h3></div>
        <p class="t-small">${g.nota}</p>
        <div class="pecas">${g.pecas.map(([b, d, l]) => peca(b, d, l)).join('')}</div>
      </section>`
    ).join('') +
    `
    <section class="cat">
      <div class="cat-head"><h3 class="t-h3">Como ícone da API</h3></div>
      <p class="t-small">
        Três das variações também são ícones de <code>/icons</code>, com fundo e
        canto arredondado como os demais.
      </p>
      <div class="pecas">
        ${BADGES.map(
          ([id, arquivo, desc]) => `
          <div class="peca">
            <div class="peca-previa" data-fundo="dark">
              <img src="/svg/${arquivo}-Dark.svg" alt="badge ${id} escuro" width="72" height="72" loading="lazy" />
            </div>
            <div class="peca-previa" data-fundo="light">
              <img src="/svg/${arquivo}-Light.svg" alt="badge ${id} claro" width="72" height="72" loading="lazy" />
            </div>
            <div class="peca-meta">
              <code class="peca-nome">?i=${id}</code>
              <span class="t-small">${desc}</span>
              <div class="row">
                <button class="btn btn-sm" type="button" data-texto="${location.origin}/icons?i=${id}">
                  Copiar URL
                </button>
              </div>
            </div>
          </div>`
        ).join('')}
      </div>
    </section>`;

  alvo.addEventListener('click', async e => {
    const svg = e.target.closest('[data-svg]');
    if (svg) {
      try {
        const r = await fetch(svg.dataset.svg);
        await navigator.clipboard.writeText(await r.text());
        toast('SVG copiado');
      } catch {
        toast('Não foi possível copiar', 'err');
      }
      return;
    }
    const texto = e.target.closest('[data-texto]');
    if (texto) {
      try {
        await navigator.clipboard.writeText(texto.dataset.texto);
        toast('URL copiada');
      } catch {
        toast('Não foi possível copiar', 'err');
      }
    }
  });
}
