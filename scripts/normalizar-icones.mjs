#!/usr/bin/env node
/**
 * Normaliza duas inconsistências do conjunto de ícones.
 *
 *   node scripts/normalizar-icones.mjs           aplica
 *   node scripts/normalizar-icones.mjs --check   falha se houver algo a aplicar
 *   node scripts/normalizar-icones.mjs --dry     só lista o que mudaria
 *
 * 1. FUNDO FORA DO TOKEN
 *    O campo neutro é `#F4F2ED` no tema claro e `#242938` no escuro. Alguns
 *    arquivos trazem variações de um dígito (`#F4F4ED`, `#F4F2EE`) e alguns
 *    trazem `white`/`black` — diferença de tom visível quando dois ficam lado a
 *    lado dentro do mesmo SVG composto, que é o modo normal de uso.
 *
 *    Só o elemento de FUNDO é reescrito. `fill` de arte nunca é tocado: recolorir
 *    marca de terceiro seria outro problema, não a correção deste.
 *
 *    Ficam de fora, de propósito:
 *      - os 81 arquivos sem tema, cujo fundo é a cor da própria marca;
 *      - os ícones da marca `<gcruz.dev/>`, cujo fundo (#070d19 / #f2f4f8) é
 *        token de identidade e não campo neutro.
 *
 * 2. DUAS FORMAS DE ARREDONDAR O CANTO
 *    373 arquivos usam `<rect width="256" height="256" rx="60">`. Outros 60 —
 *    exportados do Figma de outro jeito — desenham o mesmo canto à mão, num
 *    `<path>`, dentro de um `<g clip-path>` cujo clipPath é um quadrado SEM `rx`
 *    (ou seja: o clip não arredonda nada, é só um recorte na moldura).
 *
 *    O `d` desses 60 é sempre o mesmo, e o `26.8629` dele é exatamente
 *    60 × (1 − 0.5523) — a aproximação de Bézier de um arco de raio 60.
 *
 *    A troca NÃO é pixel a pixel idêntica, e vale registrar o número em vez da
 *    impressão: medido nos 60, a 48px (o tamanho em que o endpoint renderiza),
 *    mudam 75 px de 2304 — 3,3%, todos na curva do canto —, com diferença média
 *    de 14/255 de cobertura e máxima de 58/255. O `rx` desenha um arco elíptico
 *    de verdade; o `path` desenha a aproximação cúbica dele. A silhueta é a
 *    mesma; o que muda é o antialiasing da borda. Sem ampliação, a 48px, os dois
 *    são indistinguíveis — conferido lado a lado, não só medido.
 *
 *    O `<g clip-path>` removido, esse sim, não altera nenhum pixel: o clipe era
 *    um quadrado do tamanho exato do viewBox, ou seja, não recortava nada.
 */
import fs from 'node:fs';
import path from 'node:path';

const ICONS = path.join(import.meta.dirname, '..', 'icons');

/** O `d` do canto arredondado desenhado à mão. */
const D_CANTO =
  'M196 0H60C26.8629 0 0 26.8629 0 60V196C0 229.137 26.8629 256 60 256H196C229.137 256 256 229.137 256 196V60C256 26.8629 229.137 0 196 0Z';

const CAMPO_CLARO = '#F4F2ED';
const CAMPO_ESCURO = '#242938';

/** Fundos a normalizar, por tema. Chave em minúsculas. */
const TROCAS = {
  light: { '#f4f4ed': CAMPO_CLARO, '#f4f2ee': CAMPO_CLARO, white: CAMPO_CLARO },
  dark: { black: CAMPO_ESCURO },
};

/** Fundos que são identidade da marca, não campo neutro. */
const PRESERVAR = new Set(['#070d19', '#f2f4f8']);

/**
 * Converte o canto desenhado à mão em `<rect rx="60">` e descarta o recorte
 * quadrado que sobra sem função.
 *
 * A forma dos 60 é uniforme — `<svg>` com exatamente dois filhos, `<g clip-path>`
 * e `<defs>` — e o script confere isso antes de mexer. Qualquer arquivo fora da
 * forma é pulado e reportado, em vez de adivinhado.
 */
function converterCanto(texto) {
  if (!texto.includes(D_CANTO)) return null;

  const linhas = texto.split('\n');
  const abre = linhas[1]?.match(/^<g clip-path="url\(#([^)]+)\)">$/);
  if (!abre) return null;
  const idClip = abre[1];

  const fecha = linhas.lastIndexOf('</g>');
  const inicioDefs = linhas.indexOf('<defs>');
  if (fecha === -1 || inicioDefs === -1 || fecha > inicioDefs) return null;

  // o clipPath tem de ser o quadrado sem rx; se for outra coisa, não é este caso
  const bloco = texto.slice(texto.indexOf('<defs>'));
  const clip = bloco.match(
    new RegExp(
      `<clipPath id="${idClip}">\\s*<rect width="256" height="256"[^>]*/>\\s*</clipPath>`
    )
  );
  if (!clip) return null;

  let saida = texto
    .replace(
      new RegExp(
        `<path d="${D_CANTO.replace(/[.*+?^$()|[\\]\\\\]/g, '\\\\$&')}" fill="([^"]+)"/>`
      ),
      (_, cor) => `<rect width="256" height="256" rx="60" fill="${cor}"/>`
    )
    .replace(clip[0] + '\n', '')
    .replace(clip[0], '');

  // remove o <g clip-path> e o </g> correspondente
  const l = saida.split('\n');
  const i = l.findIndex(x => x === `<g clip-path="url(#${idClip})">`);
  if (i === -1) return null;
  l.splice(i, 1);
  const j = l.lastIndexOf('</g>');
  const d = l.indexOf('<defs>');
  if (j === -1 || (d !== -1 && j > d)) return null;
  l.splice(j, 1);
  saida = l.join('\n');

  // <defs> vazio não serve para nada
  saida = saida.replace(/<defs>\s*<\/defs>\n?/, '');
  return saida;
}

/**
 * Reescreve o fill do rect de fundo, se ele estiver fora do token.
 *
 * A varredura é independente da ordem dos atributos: `VueJS-Light.svg` escreve
 * `fill` antes de `rx` e escapava de um casamento posicional.
 */
function normalizarFundo(texto, tema) {
  const trocas = TROCAS[tema];
  if (!trocas) return null;

  for (const m of texto.matchAll(/<rect\b[^>]*\/?>/g)) {
    const tag = m[0];
    const attr = n => tag.match(new RegExp(`\\b${n}="([^"]*)"`))?.[1];
    if (attr('width') !== '256' || attr('height') !== '256') continue;
    if (attr('rx') !== '60') continue;

    const cor = attr('fill');
    if (!cor) continue;
    const atual = cor.trim().toLowerCase();
    if (PRESERVAR.has(atual)) return null;
    const nova = trocas[atual];
    if (!nova) return null;

    return (
      texto.slice(0, m.index) +
      tag.replace(`fill="${cor}"`, `fill="${nova}"`) +
      texto.slice(m.index + tag.length)
    );
  }
  return null;
}

function tema(arquivo) {
  if (/-dark\.svg$/i.test(arquivo)) return 'dark';
  if (/-light\.svg$/i.test(arquivo)) return 'light';
  return null; // sem tema: o fundo é a cor da marca, não se toca
}

const mudanças = [];
const pulados = [];

for (const arquivo of fs.readdirSync(ICONS).sort()) {
  if (!arquivo.endsWith('.svg')) continue;
  const alvo = path.join(ICONS, arquivo);
  const original = fs.readFileSync(alvo, 'utf8');
  let texto = original;
  const feitas = [];

  if (texto.includes(D_CANTO)) {
    const convertido = converterCanto(texto);
    if (convertido) {
      texto = convertido;
      feitas.push('canto → rx=60');
    } else {
      pulados.push(`${arquivo}: canto fora da forma conhecida`);
    }
  }

  const t = tema(arquivo);
  if (t) {
    const recolorido = normalizarFundo(texto, t);
    if (recolorido) {
      texto = recolorido;
      feitas.push('fundo → token');
    }
  }

  if (texto !== original) {
    mudanças.push({ arquivo, alvo, texto, feitas });
  }
}

const modo = process.argv.includes('--check')
  ? 'check'
  : process.argv.includes('--dry')
    ? 'dry'
    : 'aplicar';

for (const p of pulados) console.error(`  pulado — ${p}`);

if (!mudanças.length) {
  console.log('ícones já normalizados');
  process.exit(pulados.length ? 1 : 0);
}

for (const m of mudanças) console.log(`  ${m.arquivo}: ${m.feitas.join(', ')}`);
console.log(`${mudanças.length} arquivo(s)`);

if (modo === 'check') {
  console.error('rode: node scripts/normalizar-icones.mjs');
  process.exit(1);
}
if (modo === 'aplicar') {
  for (const m of mudanças) fs.writeFileSync(m.alvo, m.texto);
  console.log('aplicado');
}
