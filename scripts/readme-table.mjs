#!/usr/bin/env node
/**
 * Gera a tabela "Icons List" do readme.md a partir do conteúdo de ./icons.
 *
 * Existia uma defasagem: ícones eram adicionados em ./icons sem a linha
 * correspondente na tabela (julia, spotify e verilog ficaram de fora). Este
 * script torna a tabela derivada dos arquivos, não escrita à mão.
 *
 *   node scripts/readme-table.mjs           reescreve readme.md
 *   node scripts/readme-table.mjs --check   falha se estiver defasado (CI)
 *
 * O ID exibido de um ícone já presente na tabela é preservado — a tabela usa
 * o alias quando existe um (`ae` em vez de `aftereffects`), e trocar isso
 * quebraria os links que as pessoas já copiaram.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.join(import.meta.dirname, '..');
const README = path.join(ROOT, 'readme.md');
const ICONS_DIR = path.join(ROOT, 'icons');

const HEADER = ['Icon ID', 'Icon'];

/** id canônico -> nome do arquivo preferido para exibição */
function iconFiles() {
  const byId = new Map();
  for (const file of fs.readdirSync(ICONS_DIR).sort()) {
    if (!file.endsWith('.svg')) continue;
    const id = file.replace('.svg', '').toLowerCase().split('-')[0];
    const isDark = /-dark\.svg$/i.test(file);
    // prefere a variante Dark (tema padrão da API); senão o arquivo único
    if (!byId.has(id) || isDark) byId.set(id, file);
  }
  return byId;
}

/** alias -> id canônico, lido do shortNames do index.js */
function shortNames() {
  const src = fs.readFileSync(path.join(ROOT, 'index.js'), 'utf8');
  const start = src.indexOf('shortNames = {');
  const block = src.slice(start, src.indexOf('};', start));
  const map = new Map();
  for (const m of block.matchAll(/^\s*([a-z0-9]+):\s*'([a-z0-9]+)'/gm))
    map.set(m[1], m[2]);
  return map;
}

/** IDs já exibidos na tabela atual, na ordem em que aparecem */
function currentIds(readme) {
  return [...readme.matchAll(/^\|\s*`([a-z0-9]+)`\s*\|/gm)].map(m => m[1]);
}

function renderTable(rows) {
  const widths = HEADER.map((h, i) =>
    Math.max(h.length, ...rows.map(r => r[i].length))
  );
  const center = (s, w) => {
    const left = Math.floor((w - s.length) / 2);
    return ' '.repeat(left) + s + ' '.repeat(w - s.length - left);
  };
  const line = cells => `| ${cells.join(' | ')} |`;
  return [
    line(HEADER.map((h, i) => center(h, widths[i]))),
    line(widths.map(w => `:${'-'.repeat(w - 2)}:`)),
    ...rows.map(r => line(r.map((c, i) => center(c, widths[i])))),
  ].join('\n');
}

function build() {
  const files = iconFiles();
  const aliases = shortNames();
  const displayed = currentIds(fs.readFileSync(README, 'utf8'));

  // um id canônico está representado se ele próprio ou um de seus aliases
  // já aparece na tabela
  const represented = new Set();
  for (const id of displayed) represented.add(aliases.get(id) ?? id);

  // mantém o ID exibido hoje; para ícones ainda não listados, usa o canônico
  const ids = new Set(displayed);
  for (const id of files.keys()) if (!represented.has(id)) ids.add(id);

  const rows = [...ids].sort().map(id => {
    const file = files.get(aliases.get(id) ?? id);
    if (!file) throw new Error(`sem arquivo SVG para o ID "${id}"`);
    return [`\`${id}\``, `<img src="./icons/${file}" width="48">`];
  });

  return { table: renderTable(rows), count: rows.length };
}

function splice(readme, table) {
  // substitui o bloco da tabela que segue o cabeçalho "# Icons List"
  const re = /(^# Icons List\n[\s\S]*?\n\n)(\|[\s\S]*?)(?=\n\n|\n---)/m;
  if (!re.test(readme))
    throw new Error('bloco da tabela não encontrado no readme');
  return readme.replace(re, (_, head) => head + table);
}

const { table, count } = build();
const current = fs.readFileSync(README, 'utf8');
const next = splice(current, table);

if (process.argv.includes('--check')) {
  if (next !== current) {
    console.error(
      'readme.md está defasado em relação a ./icons — rode: npm run readme'
    );
    process.exit(1);
  }
  console.log(`readme.md em dia (${count} ícones)`);
} else {
  fs.writeFileSync(README, next);
  console.log(`readme.md atualizado (${count} ícones)`);
}
