const fs = require('fs');

const iconsDir = fs.readdirSync('./icons');
const icons = {};
for (const icon of iconsDir) {
  const name = icon.replace('.svg', '').toLowerCase();
  icons[name] = String(fs.readFileSync(`./icons/${icon}`));
}

if (!fs.existsSync('./dist')) fs.mkdirSync('./dist');
const json = JSON.stringify(icons);
fs.writeFileSync('./dist/icons.json', json);

// Módulo ESM além do JSON: importar .json exigiria import attributes no Node da
// Vercel, enquanto um módulo JS comum funciona no bundler do wrangler e no Node
// puro sem nenhuma cerimônia. As duas entradas (index.js e api/*.mjs) usam este.
fs.writeFileSync(
  './dist/icons.mjs',
  `// GERADO por build.js — não editar.\nexport default ${json};\n`
);

console.log(
  `dist/icons.json + dist/icons.mjs (${Object.keys(icons).length} arquivos, ` +
    `${new Set(Object.keys(icons).map(i => i.split('-')[0])).size} IDs)`
);
