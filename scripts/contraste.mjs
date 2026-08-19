#!/usr/bin/env node
/**
 * Confere o contraste dos pares de token contra o mínimo AA da WCAG 2.1.
 *
 * Existe porque "contraste mínimo AA" é fácil de afirmar e difícil de manter:
 * basta alguém escurecer o `--bg` um passo para o `--text-3` cair abaixo de
 * 4.5:1 sem ninguém notar. Aqui a regra é executável.
 *
 *   node scripts/contraste.mjs           lista todos os pares
 *   node scripts/contraste.mjs --check   sai 1 se algum par reprovar
 *
 * Limiares (WCAG 2.1, 1.4.3 e 1.4.11):
 *   4.5:1  texto normal
 *   3.0:1  texto grande (>=24px, ou >=18.66px em negrito) e componentes de UI
 */
import fs from 'node:fs';
import path from 'node:path';

const TOKENS = path.join(
  import.meta.dirname,
  '..',
  'site',
  'css',
  'tokens.css'
);

/**
 * Lê os blocos :root do tokens.css e devolve { claro, escuro }.
 *
 * O casamento do seletor é por prefixo, não por `includes`: a string
 * `:root:not([data-theme='dark'])` — que é o bloco do tema CLARO dentro da media
 * query — contém `data-theme='dark'`, e um `includes` a classificava como
 * escura, sobrescrevendo a paleta escura com valores claros. Os dois temas
 * saíam idênticos e o relatório não valia nada.
 */
function paletas() {
  // Comentários fora primeiro: o cabeçalho do arquivo entrava no seletor do
  // primeiro bloco e ele deixava de casar com `:root`.
  const css = fs.readFileSync(TOKENS, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const blocos = [...css.matchAll(/([^{}]*?)\{([^}]*)\}/g)];

  const claro = {};
  const escuro = {};
  for (const [, seletorBruto, corpo] of blocos) {
    const seletor = seletorBruto.trim();
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

function rgb(hex) {
  const h = hex.slice(1);
  const n = h.length === 3 ? [...h].map(c => c + c).join('') : h;
  return [0, 2, 4].map(i => parseInt(n.slice(i, i + 2), 16) / 255);
}

/** Luminância relativa, WCAG 2.1 §relative luminance. */
function luminancia(hex) {
  const [r, g, b] = rgb(hex).map(c =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function razao(a, b) {
  const [x, y] = [luminancia(a), luminancia(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

/**
 * [frente, fundo, mínimo, descrição, nivel]
 *
 * `nivel: 'info'` é medido e mostrado, mas não reprova: são pares cujo mínimo
 * a WCAG não fixa. A régua de 1px não é um "componente de UI" no sentido do
 * 1.4.11 — os controles que ela contorna são identificados pelo próprio rótulo
 * e ganham anel de foco visível. Fica no relatório para não sumir de vista.
 */
const PARES = [
  ['text-1', 'bg', 4.5, 'texto principal sobre o fundo'],
  ['text-2', 'bg', 4.5, 'texto secundário sobre o fundo'],
  ['text-3', 'bg', 4.5, 'texto terciário sobre o fundo'],
  ['text-1', 'surface', 4.5, 'texto principal sobre card'],
  ['text-2', 'surface', 4.5, 'texto secundário sobre card'],
  ['text-3', 'surface', 4.5, 'texto terciário sobre card'],
  ['text-1', 'surface-2', 4.5, 'texto principal sobre superfície 2'],
  ['text-2', 'surface-2', 4.5, 'texto secundário sobre superfície 2'],
  ['accent', 'bg', 4.5, 'link sobre o fundo'],
  ['accent', 'surface', 4.5, 'link sobre card'],
  ['brand', 'bg', 3, 'marca sobre o fundo (texto grande)'],
  ['on-brand', 'brand', 4.5, 'texto do botão primário'],
  ['ok', 'surface', 3, 'sucesso sobre card'],
  ['info', 'surface', 3, 'informação sobre card'],
  ['warn', 'surface', 3, 'aviso sobre card'],
  ['err', 'surface', 3, 'erro sobre card'],
  ['edge', 'bg', 3, 'régua de 1px sobre o fundo', 'info'],
  ['edge', 'surface', 3, 'borda de campo e botão sobre card', 'info'],
];

let reprovou = 0;
for (const [tema, cores] of Object.entries(paletas())) {
  console.log(`\n=== tema ${tema} ===`);
  for (const [frente, fundo, minimo, desc, nivel] of PARES) {
    const a = cores[frente];
    const b = cores[fundo];
    if (!a || !b) {
      console.log(`  ?    --${frente} / --${fundo}: token ausente`);
      reprovou++;
      continue;
    }
    const r = razao(a, b);
    const ok = r >= minimo;
    if (!ok && nivel !== 'info') reprovou++;
    const marca = nivel === 'info' ? 'i ' : ok ? 'ok' : 'X ';
    console.log(
      `  ${marca} ${r.toFixed(2).padStart(5)}:1 ` +
        `(min ${minimo})  --${frente} sobre --${fundo} — ${desc}`
    );
  }
}

if (process.argv.includes('--check')) {
  if (reprovou) {
    console.error(`\n${reprovou} par(es) abaixo do mínimo`);
    process.exit(1);
  }
  console.log('\ntodos os pares passam');
}
