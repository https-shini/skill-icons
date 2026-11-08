/** Movimento interno com transição, carregamento sob demanda e pausa fora da tela. */
import { store } from './store.js';
import { assetUrl } from './assets.js';

const media = matchMedia('(prefers-reduced-motion: reduce)');
const ouvintes = new Set();
const estados = new Map();
const SAIDA_MS = 240;
let permitido = store.get('animacao', 'true') !== 'false';
let iniciado = false;
let visibilidade;

export function animacoesAtivas() {
  return permitido && !media.matches;
}

export function aoMudarAnimacao(fn) {
  ouvintes.add(fn);
  return () => ouvintes.delete(fn);
}

function fontes(img) {
  if (img.hasAttribute('data-motion-overlay')) return null;
  const src = img.getAttribute('src') ?? '';
  if (img.dataset.motionSrc)
    return { estatico: src, animado: img.dataset.motionSrc, preview: false };
  if (src.startsWith('/svg/')) {
    const file = src.replace(/^\/svg\/(?:animated\/)?/, '');
    return {
      estatico: assetUrl(`/svg/${file}`),
      animado: assetUrl(`/svg/animated/${file}`),
      preview: false,
    };
  }
  const url = new URL(src, location.origin);
  if (url.origin !== location.origin || url.pathname !== '/icons') return null;
  url.searchParams.delete('animation');
  const estatico = url.href;
  url.searchParams.set('animation', 'true');
  return { estatico, animado: url.href, preview: true };
}

function interagindo(img) {
  const tile = img.closest('button');
  return (
    tile?.matches(':hover, :focus-visible') ||
    tile?.getAttribute('aria-checked') === 'true' ||
    tile?.getAttribute('aria-pressed') === 'true' ||
    img.closest('.peca-previa')?.matches(':hover') ||
    img.closest('#preview')
  );
}

function removerOverlay(estado) {
  clearTimeout(estado.timer);
  cancelAnimationFrame(estado.frame);
  estado.timer = null;
  if (estado.overlay) {
    estado.overlay.onload = estado.overlay.onerror = null;
    estado.overlay.remove();
    estado.overlay = null;
  }
}

function atualizar(estado) {
  const { img, estatico, animado, preview } = estado;
  const podeMover = animacoesAtivas() && !document.hidden && estado.visivel;
  const ativo = podeMover && !!interagindo(img);
  estado.ativo = ativo;

  // A imagem composta preserva seu layout/semântica e usa o mesmo mecanismo
  // de pausa. Tiles individuais recebem um overlay para a volta suave ao repouso.
  if (preview) {
    const src = ativo ? animado : estatico;
    if (img.src !== src) img.src = src;
    return;
  }

  if (!ativo) {
    estado.falhou = false;
    if (estado.palco) estado.palco.dataset.motionActive = 'false';
    if (!podeMover) removerOverlay(estado);
    else if (estado.overlay && !estado.timer) {
      estado.timer = setTimeout(() => removerOverlay(estado), SAIDA_MS);
    }
    return;
  }

  clearTimeout(estado.timer);
  estado.timer = null;
  if (estado.falhou) return;
  if (!estado.palco) {
    const palco = document.createElement('span');
    palco.className = 'si-icon-stage';
    img.before(palco);
    palco.appendChild(img);
    estado.palco = palco;
  }
  if (estado.overlay) {
    if (estado.overlay.complete && estado.overlay.naturalWidth)
      estado.palco.dataset.motionActive = 'true';
    return;
  }

  const overlay = img.cloneNode(false);
  overlay.removeAttribute('id');
  overlay.removeAttribute('loading');
  overlay.setAttribute('data-motion-overlay', '');
  overlay.setAttribute('aria-hidden', 'true');
  overlay.alt = '';
  estado.overlay = overlay;
  overlay.onload = () => {
    if (!estado.ativo || estado.overlay !== overlay) return;
    // Uma medição na entrada estabelece a opacidade inicial. Não há laço JS
    // por frame; o movimento e a interpolação são exclusivamente CSS.
    void overlay.offsetWidth;
    estado.frame = requestAnimationFrame(() => {
      if (estado.ativo && estado.overlay === overlay)
        estado.palco.dataset.motionActive = 'true';
    });
  };
  overlay.onerror = () => {
    estado.falhou = true;
    estado.palco.dataset.motionActive = 'false';
    removerOverlay(estado);
  };
  estado.palco.appendChild(overlay);
  overlay.src = animado;
}

function sincronizar() {
  for (const [img, estado] of estados) {
    if (!img.isConnected) {
      removerOverlay(estado);
      visibilidade?.unobserve(img);
      estados.delete(img);
    }
  }
  for (const img of document.querySelectorAll(
    'img:not([data-motion-overlay])'
  )) {
    if (estados.has(img)) continue;
    const source = fontes(img);
    if (!source) continue;
    const estado = { ...source, img, visivel: !visibilidade };
    estados.set(img, estado);
    // O original fica visível durante o carregamento, inclusive em falhas.
    if (img.src !== new URL(source.estatico, location.origin).href)
      img.src = source.estatico;
    visibilidade?.observe(img);
  }
  for (const estado of estados.values()) atualizar(estado);

  const controle = document.getElementById('animar-icones');
  if (controle) {
    controle.checked = permitido;
    controle.disabled = media.matches;
  }
  const ajuda = document.getElementById('animacao-ajuda');
  const mensagem = media.matches
    ? 'Movimento reduzido ativado no seu dispositivo. Os ícones ficam estáticos.'
    : 'Movimentos internos com entrada e saída suaves ao interagir. Ícones selecionados animam enquanto visíveis. SVG mantém a animação; PNG e WebP são estáticos.';
  if (ajuda && ajuda.textContent !== mensagem) ajuda.textContent = mensagem;
}

export function iniciarAnimacoes() {
  if (iniciado) return;
  iniciado = true;
  if ('IntersectionObserver' in window) {
    visibilidade = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const estado = estados.get(entry.target);
        if (!estado) continue;
        estado.visivel = entry.isIntersecting;
        atualizar(estado);
      }
    });
  }
  const controle = document.getElementById('animar-icones');
  controle?.addEventListener('change', () => {
    permitido = controle.checked;
    store.set('animacao', String(permitido));
    sincronizar();
    for (const fn of ouvintes) fn(animacoesAtivas());
  });
  media.addEventListener('change', () => {
    sincronizar();
    for (const fn of ouvintes) fn(animacoesAtivas());
  });
  document.addEventListener('visibilitychange', sincronizar);

  for (const evento of ['pointerover', 'pointerout', 'focusin', 'focusout']) {
    document.addEventListener(evento, e => {
      const alvo = e.target.closest?.('button, .peca-previa');
      if (!alvo || alvo.contains(e.relatedTarget)) return;
      const atualizarAlvo = () => {
        for (const img of alvo.querySelectorAll(
          'img:not([data-motion-overlay])'
        )) {
          const estado = estados.get(img);
          if (estado) atualizar(estado);
        }
      };
      if (evento === 'focusout') queueMicrotask(atualizarAlvo);
      else atualizarAlvo();
    });
  }

  // Não observa src nem atributos de animação: evita ciclos no reconciliador.
  const observer = new MutationObserver(sincronizar);
  for (const id of [
    'montador',
    'catalogo-lista',
    'marca-lista',
    'motion-grid',
  ]) {
    const el = document.getElementById(id);
    if (el)
      observer.observe(el, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['aria-checked', 'aria-pressed'],
      });
  }
  sincronizar();
}
