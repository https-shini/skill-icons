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
import { CATEGORIES } from './categories.mjs';

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

/**
 * alias -> id canônico, lido do shortNames de lib/icons.mjs.
 *
 * Lido por regex, e não por `import`, de propósito: lib/icons.mjs importa
 * dist/icons.mjs, que só existe depois do build — e este script roda antes dele
 * no CI. Parsear o texto mantém a checagem independente da ordem.
 */
function shortNames() {
  const src = fs.readFileSync(path.join(ROOT, 'lib', 'icons.mjs'), 'utf8');
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

/** valida que as categorias particionam os IDs: total e sem repetição */
function checkPartition(ids) {
  const seen = new Map();
  const problems = [];
  for (const c of CATEGORIES)
    for (const id of c.ids) {
      if (seen.has(id))
        problems.push(`"${id}" está em "${seen.get(id)}" e em "${c.slug}"`);
      seen.set(id, c.slug);
      if (!ids.has(id))
        problems.push(`"${id}" (${c.slug}) não existe em icons/`);
    }
  for (const id of ids)
    if (!seen.has(id))
      problems.push(
        `"${id}" não está em nenhuma categoria de scripts/categories.mjs`
      );
  if (problems.length)
    throw new Error(
      'categorias inconsistentes:\n  - ' + problems.join('\n  - ')
    );
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

  // o ID exibido pode ser um alias; a categoria é sempre pelo ID canônico
  const canonical = new Map([...ids].map(id => [aliases.get(id) ?? id, id]));
  checkPartition(new Set(canonical.keys()));

  const blocks = [];
  let count = 0;
  for (const cat of CATEGORIES) {
    const rows = cat.ids
      .map(canon => canonical.get(canon))
      .filter(Boolean)
      .sort()
      .map(id => {
        const file = files.get(aliases.get(id) ?? id);
        if (!file) throw new Error(`sem arquivo SVG para o ID "${id}"`);
        return [`\`${id}\``, `<img src="./icons/${file}" width="48">`];
      });
    count += rows.length;
    blocks.push(
      `### ${cat.title}\n\n` +
        (cat.note ? `${cat.note}\n\n` : '') +
        renderTable(rows)
    );
  }

  return { table: blocks.join('\n\n'), count };
}

/** Cabeçalho que delimita o bloco gerado. Mudar aqui e no readme juntos. */
const HEADING = '## Lista de ícones';

function splice(readme, table) {
  // Do cabeçalho até a primeira linha em branco vem a introdução, escrita à mão
  // e preservada; daí até o próximo "## " é tudo gerado.
  //
  // Sem a flag `m` de propósito: com ela `$` casa fim de LINHA, e a lookahead
  // fechava na primeira linha — o grupo saía vazio e a tabela nova era inserida
  // sem remover a antiga, duplicando a seção. `(?![\s\S])` é o fim de string.
  const re = new RegExp(
    `(\\n${HEADING}\\n[\\s\\S]*?\\n\\n)([\\s\\S]*?)(?=\\n## |(?![\\s\\S]))`
  );
  if (!re.test(readme))
    throw new Error(
      `bloco da tabela não encontrado: o readme precisa ter "${HEADING}" ` +
        'seguido de um parágrafo e uma linha em branco'
    );
  return readme.replace(re, (_, head) => head + table + '\n');
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
