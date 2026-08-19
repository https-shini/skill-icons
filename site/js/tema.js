/**
 * Tema claro/escuro. A escolha explícita vence a preferência do sistema, e é o
 * mesmo valor usado no parâmetro `theme` do preview — por isso mora aqui e não
 * dentro do builder.
 *
 * A aplicação inicial acontece no <head>, antes do primeiro paint; aqui só
 * ficam o toggle e a sincronização dos controles.
 */
import { store } from './store.js';

const ouvintes = new Set();

/** 'dark' | 'light' — resolve a preferência do sistema quando não há escolha. */
export function temaAtual() {
  const escolhido = document.documentElement.dataset.theme;
  if (escolhido === 'dark' || escolhido === 'light') return escolhido;
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function aoMudarTema(fn) {
  ouvintes.add(fn);
  return () => ouvintes.delete(fn);
}

export function definirTema(tema) {
  document.documentElement.dataset.theme = tema;
  store.set('tema', tema);
  sincronizar();
  for (const fn of ouvintes) fn(tema);
}

/**
 * Só os botões do toggle. O logotipo é um <symbol> inline com as cores em
 * token, então ele acompanha o tema sozinho, pelo CSS.
 */
function sincronizar() {
  const tema = temaAtual();
  for (const b of document.querySelectorAll('[data-tema]'))
    b.setAttribute('aria-pressed', String(b.dataset.tema === tema));
}

export function iniciarTema() {
  for (const b of document.querySelectorAll('[data-tema]'))
    b.addEventListener('click', () => definirTema(b.dataset.tema));

  // Sem escolha explícita, seguir o sistema quando ele mudar.
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (!document.documentElement.dataset.theme) {
      sincronizar();
      for (const fn of ouvintes) fn(temaAtual());
    }
  });

  sincronizar();
}
