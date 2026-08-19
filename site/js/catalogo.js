/**
 * Catálogo: os 257 IDs agrupados por categoria, para navegar em vez de buscar.
 *
 * É seção da mesma página do builder — os links do rodapé apontam para
 * #catalogo, e uma página separada custaria um carregamento inteiro para
 * mostrar a mesma lista.
 *
 * Renderiza depois do builder e com `loading="lazy"` nas imagens: são 257
 * requisições ao estático, e nenhuma delas invoca função.
 */
import { catalogo, arquivoDe } from './dados.js';
import { copiar } from './toast.js';
import { temaAtual, aoMudarTema } from './tema.js';

export async function iniciarCatalogo() {
  const alvo = document.querySelector('#catalogo-lista');
  if (!alvo) return;

  const { icones, categorias } = await catalogo();
  const porCategoria = new Map(categorias.map(c => [c.slug, []]));
  for (const i of icones) porCategoria.get(i.cat)?.push(i);

  function render() {
    const tema = temaAtual();
    alvo.innerHTML = categorias
      .map(c => {
        const lista = porCategoria.get(c.slug) ?? [];
        if (!lista.length) return '';
        const titulo = c.titulo.replace(/`/g, '');
        return `
        <section class="cat" aria-labelledby="cat-${c.slug}">
          <div class="cat-head">
            <h3 class="t-h3" id="cat-${c.slug}">${titulo}</h3>
            <span class="t-label">${lista.length}</span>
          </div>
          <div class="tiles tiles-cat">
            ${lista
              .map(
                i => `<button
                    class="tile"
                    type="button"
                    data-copiar="${i.id}"
                    aria-label="Copiar o ID ${i.id}"
                    data-tip="Copiar ID"
                  >
                    <img src="/svg/${arquivoDe(i, tema)}" alt="" width="48" height="48" loading="lazy" decoding="async" />
                    <span class="tile-id">${i.id}</span>
                  </button>`
              )
              .join('')}
          </div>
        </section>`;
      })
      .join('');
  }

  alvo.addEventListener('click', e => {
    const b = e.target.closest('[data-copiar]');
    if (b) copiar(b.dataset.copiar, `ID "${b.dataset.copiar}" copiado`);
  });

  aoMudarTema(render);
  render();
}
