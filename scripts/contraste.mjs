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
 * A leitura dos tokens vem de scripts/tokens.mjs, a mesma que a página de
 * Design System usa — os dois têm de estar olhando para os mesmos valores.
 *
 * Limiares (WCAG 2.1, 1.4.3 e 1.4.11):
 *   4.5:1  texto normal
 *   3.0:1  texto grande (>=24px, ou >=18.66px em negrito) e componentes de UI
 */
import { paletas, razao } from './tokens.mjs';

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
