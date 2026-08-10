#!/usr/bin/env node
/**
 * Popula public/ com o que a página estática consome. Roda no build da Vercel,
 * depois do build.js.
 *
 *   public/svg/<Arquivo>.svg   cópia de icons/ — a galeria usa estes, servidos
 *                              pela CDN com loading="lazy", então navegar a
 *                              galeria não invoca nenhuma função
 *   public/brand/              cópia de brand/, incluindo o documento do DS
 *   public/manifest.json       ID -> arquivo por tema
 *
 * Os SVGs ficam em /svg/ e não em /icons/ de propósito: /icons é a rota da
 * função, e assim não dependemos da ordem de precedência entre filesystem e
 * rewrite na Vercel.
 */
import fs from 'node:fs';
import path from 'node:path';
import { manifest, iconNameList } from '../lib/icons.mjs';

const ROOT = path.join(import.meta.dirname, '..');
const PUBLIC = path.join(ROOT, 'public');

function copyDir(from, to) {
  fs.rmSync(to, { recursive: true, force: true });
  fs.cpSync(from, to, { recursive: true });
  return fs.readdirSync(to).length;
}

const svgs = copyDir(path.join(ROOT, 'icons'), path.join(PUBLIC, 'svg'));
const brand = copyDir(path.join(ROOT, 'brand'), path.join(PUBLIC, 'brand'));

// mapa de ID -> nome de arquivo real, que o manifest do lib não conhece
const files = new Map();
for (const file of fs.readdirSync(path.join(ROOT, 'icons'))) {
  if (file.endsWith('.svg'))
    files.set(file.replace('.svg', '').toLowerCase(), file);
}

const entries = manifest().map(m => ({
  id: m.id,
  themed: m.themed,
  dark: files.get(m.dark),
  light: files.get(m.light),
}));

const missing = entries.filter(e => !e.dark || !e.light);
if (missing.length) {
  console.error('manifest incompleto para:', missing.map(m => m.id).join(', '));
  process.exit(1);
}

fs.writeFileSync(
  path.join(PUBLIC, 'manifest.json'),
  JSON.stringify({ count: iconNameList.length, icons: entries })
);

console.log(
  `public/: ${svgs} svg + ${brand} arquivos de marca + manifest com ${entries.length} IDs`
);
