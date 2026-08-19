#!/usr/bin/env node
/**
 * Leitor único de `site/css/tokens.css`.
 *
 * Existe para que a checagem de contraste e a página de Design System leiam os
 * mesmos valores da mesma fonte. O requisito do styleguide é justamente esse:
 * mostrar o token que o código usa, não uma cópia digitada na página — que
 * envelheceria no primeiro ajuste de paleta.
 */
import fs from 'node:fs';
import path from 'node:path';

const TOKENS = path.join(import.meta.dirname, '..', 'site', 'css', 'tokens.css');

const semComentarios = css => css.replace(/\/\*[\s\S]*?\*\//g, '');

function fonte() {
  return fs.readFileSync(TOKENS, 'utf8');
}

/**
 * Blocos `seletor { corpo }` do arquivo, já sem comentários.
 *
 * Regex e não parser de CSS de verdade porque o arquivo é escrito por nós e tem
 * forma conhecida; trazer um parser para isto seria a primeira dependência de
 * runtime do projeto.
 */
function blocos() {
  return [...semComentarios(fonte()).matchAll(/([^{}]*?)\{([^}]*)\}/g)].map(
    ([, seletor, corpo]) => ({ seletor: seletor.trim(), corpo })
  );
}

/**
 * `{ claro, escuro }` com os tokens de COR de cada tema.
 *
 * O casamento do seletor é por prefixo, não por `includes`: a string
 * `:root:not([data-theme='dark'])` — que é o bloco do tema CLARO dentro da media
 * query — contém `data-theme='dark'`, e um `includes` a classificava como
 * escura, sobrescrevendo a paleta escura com valores claros. Os dois temas saíam
 * idênticos e o relatório não valia nada.
 */
export function paletas() {
  const claro = {};
  const escuro = {};
  for (const { seletor, corpo } of blocos()) {
    let destino = null;
    if (seletor === ':root') destino = claro;
    else if (seletor.startsWith(":root[data-theme='dark']")) destino = escuro;
    if (!destino) continue;
    for (const [, nome, valor] of corpo.matchAll(
      /--([\w-]+):\s*(#[0-9a-fA-F]{3,8})\s*;/g
    ))
      destino[nome] = valor;
  }
  if (!Object.keys(claro).length || !Object.keys(escuro).length)
    throw new Error('não encontrei os dois blocos de tema em tokens.css');
  return { claro, escuro: { ...claro, ...escuro } };
}

/**
 * Os tokens do `:root` agrupados pelos marcadores de seção do arquivo
 * (`/* ---- cor ---- *\/`, `tipografia`, `espaço e grid`, …), preservando a
 * ordem de declaração.
 *
 * @returns {{titulo: string, tokens: {nome: string, valor: string}[]}[]}
 */
export function grupos() {
  const css = fonte();
  const inicio = css.indexOf(':root {');
  const corpo = css.slice(inicio, css.indexOf('\n}', inicio));

  // `--font-mono` e `--font-sans` quebram em várias linhas; sem juntar a
  // declaração antes de casar, as duas sumiam do grupo de tipografia.
  //
  // O comentário de fim de linha sai antes da checagem: `--dur-fast: 120ms;
  // /* hover *\/` termina em `*\/`, não em `;`, e sem isso a linha seguinte era
  // colada nela — os quatro tokens de easing sumiam do grupo de motion.
  const aberta = l => {
    const sem = l.replace(/\/\*.*?\*\/\s*$/, '').trimEnd();
    return /^\s*--[\w-]+:/.test(sem) && !sem.endsWith(';');
  };
  const linhas = [];
  for (const bruta of corpo.split('\n')) {
    const i = linhas.length - 1;
    if (i >= 0 && aberta(linhas[i]))
      linhas[i] = linhas[i].trimEnd() + ' ' + bruta.trim();
    else linhas.push(bruta);
  }

  const saida = [];
  let atual = { titulo: 'outros', tokens: [] };

  for (const linha of linhas) {
    const marcador = linha.match(/\/\*\s*-{3,}\s*([^-*]+?)\s*(?:-*\*\/|$)/);
    if (marcador) {
      if (atual.tokens.length) saida.push(atual);
      atual = { titulo: marcador[1].trim(), tokens: [] };
      continue;
    }
    const token = linha.match(/^\s*--([\w-]+):\s*(.+?);\s*(?:\/\*.*)?$/);
    if (token) atual.tokens.push({ nome: token[1], valor: token[2].trim() });
  }
  if (atual.tokens.length) saida.push(atual);
  return saida;
}

function canais(hex) {
  const h = hex.slice(1);
  const n = h.length === 3 ? [...h].map(c => c + c).join('') : h;
  return [0, 2, 4].map(i => parseInt(n.slice(i, i + 2), 16) / 255);
}

/** Luminância relativa, WCAG 2.1 §relative luminance. */
export function luminancia(hex) {
  const [r, g, b] = canais(hex).map(c =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Razão de contraste entre duas cores, de 1:1 a 21:1. */
export function razao(a, b) {
  const [x, y] = [luminancia(a), luminancia(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}
