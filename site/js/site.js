/**
 * Entrada única de todas as páginas: tema, menu mobile e, quando a página tem
 * as seções correspondentes, o builder e o catálogo.
 *
 * Builder e catálogo entram por import dinâmico — a página do changelog e a de
 * 404 não pagam por código que não usam.
 */
import { iniciarTema } from './tema.js';
import { toast } from './toast.js';

function iniciarMenu() {
  const drawer = document.getElementById('menu-mobile');
  const abre = document.querySelector('[data-menu-abre]');
  if (!drawer || !abre) return;

  let ultimoFoco = null;

  function definir(aberto) {
    if (aberto) drawer.hidden = false;
    drawer.dataset.open = String(aberto);
    abre.setAttribute('aria-expanded', String(aberto));
    document.body.style.overflow = aberto ? 'hidden' : '';

    if (aberto) {
      ultimoFoco = document.activeElement;
      drawer.querySelector('a, button')?.focus();
    } else {
      // Esconder só depois da transição, senão o painel some antes de deslizar.
      const espera = matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 0
        : 280;
      setTimeout(() => {
        if (drawer.dataset.open === 'false') drawer.hidden = true;
      }, espera);
      ultimoFoco?.focus();
    }
  }

  abre.addEventListener('click', () => definir(drawer.dataset.open !== 'true'));
  for (const b of drawer.querySelectorAll('[data-menu-fecha]'))
    b.addEventListener('click', () => definir(false));
  for (const a of drawer.querySelectorAll('a'))
    a.addEventListener('click', () => definir(false));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer.dataset.open === 'true') definir(false);
  });
}

/** Botões de cópia declarativos: data-copia aponta para o id do elemento. */
function iniciarCopias() {
  for (const b of document.querySelectorAll('[data-copia]')) {
    if (b.id === 'copiar-saida') continue; // o builder cuida do seu
    b.addEventListener('click', async () => {
      const fonte = document.getElementById(b.dataset.copia);
      if (!fonte) return;
      const { copiar } = await import('./toast.js');
      copiar(fonte.textContent.trim(), 'Copiado');
    });
  }
}

iniciarTema();
iniciarMenu();
iniciarCopias();

if (document.querySelector('#montador')) {
  import('./builder.js')
    .then(m => m.iniciarBuilder())
    .catch(e => {
      console.error(e);
      toast('Não foi possível carregar o catálogo de ícones', 'err');
    });
}

if (document.querySelector('#catalogo-lista')) {
  import('./catalogo.js')
    .then(m => m.iniciarCatalogo())
    .catch(e => console.error(e));
}

if (document.querySelector('#marca-lista')) {
  import('./marca.js').then(m => m.iniciarMarca()).catch(e => console.error(e));
}
