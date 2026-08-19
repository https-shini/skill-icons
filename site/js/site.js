/**
 * Entrada única de todas as páginas: tema, menu mobile e, quando a página tem
 * as seções correspondentes, o builder e o catálogo.
 *
 * Builder e catálogo entram por import dinâmico — a página do changelog e a de
 * 404 não pagam por código que não usam.
 */
import { iniciarTema } from './tema.js';
import { toast } from './toast.js';

/**
 * Sobreposição com foco preso: serve o drawer do menu e os modais.
 *
 * Os dois têm exatamente o mesmo comportamento — abre, prende o foco dentro,
 * `Esc` fecha, o fundo para de rolar e o foco volta para quem abriu. O que muda
 * é só de onde o painel entra, e isso é CSS. Duplicar a lógica seria garantir
 * que um dos dois ficasse para trás na primeira correção.
 */
function sobreposicao(el, gatilho) {
  let ultimoFoco = null;

  const focaveis = () =>
    [
      ...el.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
      ),
    ].filter(x => x.offsetParent !== null);

  function definir(aberto) {
    if (aberto) el.hidden = false;
    el.dataset.open = String(aberto);
    gatilho?.setAttribute('aria-expanded', String(aberto));
    document.body.style.overflow = aberto ? 'hidden' : '';

    if (aberto) {
      ultimoFoco = document.activeElement;
      focaveis()[0]?.focus();
    } else {
      // Esconder só depois da transição, senão o painel some antes de sair.
      const espera = matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 0
        : 280;
      setTimeout(() => {
        if (el.dataset.open === 'false') el.hidden = true;
      }, espera);
      ultimoFoco?.focus();
    }
  }

  el.addEventListener('keydown', e => {
    if (e.key === 'Escape') return definir(false);
    if (e.key !== 'Tab') return;
    // Prende o Tab: sem isto o foco escapa para a página atrás, que está
    // visualmente coberta e inacessível ao mouse.
    const lista = focaveis();
    if (!lista.length) return;
    const primeiro = lista[0];
    const ultimo = lista[lista.length - 1];
    if (e.shiftKey && document.activeElement === primeiro) {
      e.preventDefault();
      ultimo.focus();
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault();
      primeiro.focus();
    }
  });

  for (const b of el.querySelectorAll('[data-fecha], .scrim'))
    b.addEventListener('click', () => definir(false));
  for (const a of el.querySelectorAll('a[href]'))
    a.addEventListener('click', () => definir(false));

  return { abrir: () => definir(true), fechar: () => definir(false), definir };
}

function iniciarMenu() {
  const drawer = document.getElementById('menu-mobile');
  const abre = document.querySelector('[data-menu-abre]');
  if (!drawer || !abre) return;

  const ctrl = sobreposicao(drawer, abre);
  abre.addEventListener('click', () =>
    ctrl.definir(drawer.dataset.open !== 'true')
  );
}

/** Modais declarativos: `data-modal-abre="id"` abre `#id`. */
function iniciarModais() {
  for (const alvo of document.querySelectorAll('.modal')) {
    const gatilho = document.querySelector(`[data-modal-abre="${alvo.id}"]`);
    const ctrl = sobreposicao(alvo, gatilho);
    gatilho?.addEventListener('click', () => ctrl.abrir());
  }
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
iniciarModais();
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
