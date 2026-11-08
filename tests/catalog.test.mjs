import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { ICON_ALIASES } from '../lib/catalog.mjs';
import { CATEGORIES } from '../scripts/categories.mjs';
import { icons, iconNameList, parseShortNames, handle } from '../lib/icons.mjs';
import { normalizarEstado } from '../site/js/estado.js';

const added = [
  'lucide',
  'ruff',
  'bandit',
  'radon',
  'biome',
  'golangci',
  'gemini',
  'claude',
  'openrouter',
  'motion',
  'socketio',
  'jupyter',
  'jinja',
];

test('novos ícones têm par temático, categoria exclusiva e API estática/animada', async () => {
  for (const id of added) {
    assert.equal(CATEGORIES.filter(c => c.ids.includes(id)).length, 1, id);
    for (const theme of ['dark', 'light']) {
      assert.ok(icons[`${id}-${theme}`], `${id} ${theme}`);
      for (const animation of ['true', 'false']) {
        const response = await handle(
          new Request(
            `https://example.test/icons?i=${id}&theme=${theme}&animation=${animation}`
          )
        );
        assert.equal(response.status, 200, id);
        const body = await response.text();
        assert.doesNotMatch(body, /undefined/);
        assert.equal(
          body.includes('class="si-motion-art'),
          animation === 'true'
        );
      }
    }
  }
});

test('todos os aliases resolvem para ícones existentes, inclusive nomes pontuados', () => {
  for (const [alias, canonical] of Object.entries(ICON_ALIASES)) {
    assert.ok(iconNameList.includes(canonical), alias);
    for (const theme of ['dark', 'light']) {
      const resolved = parseShortNames([alias], theme);
      assert.deepEqual(resolved.unknown, [], alias);
      assert.equal(resolved.parsed.length, 1);
      assert.ok(icons[resolved.parsed[0]], alias);
    }
  }
  for (const name of ['__proto__', 'constructor', 'toString'])
    assert.deepEqual(parseShortNames([name]).unknown, [name]);
});

test('novos assets têm licença, origem fixa, hash e conteúdo autônomo', () => {
  const metadata = JSON.parse(
    fs.readFileSync(new URL('../assets/icon-sources.json', import.meta.url))
  );
  assert.deepEqual(new Set(metadata.icons.map(i => i.id)), new Set(added));
  for (const item of metadata.icons) {
    assert.ok(fs.existsSync(new URL('../' + item.license, import.meta.url)));
    assert.ok(item.source && item.adaptations);
    for (const variant of item.variants) {
      const bytes = fs.readFileSync(
        new URL('../' + variant.file, import.meta.url)
      );
      assert.equal(
        crypto.createHash('sha256').update(bytes).digest('hex'),
        variant.sha256
      );
      const svg = bytes.toString();
      assert.match(svg, /viewBox="0 0 256 256"/);
      assert.doesNotMatch(
        svg,
        /<script\b|<foreignObject\b|<text\b|<style\b|\son\w+\s*=|(?:href|src)="https?:\/\//i
      );
    }
  }
  assert.match(
    metadata.icons.find(i => i.id === 'radon').adaptations,
    /não é logomarca oficial/
  );
});

test('estado inválido recupera defaults e preserva apenas IDs únicos conhecidos', () => {
  const ids = new Set(['react', 'python']);
  for (const selecao of [null, {}, 'react', 7]) {
    const state = normalizarEstado(
      {
        selecao,
        perline: 'Infinity',
        lado: 'NaN',
        formato: 'exe',
        categoria: 'inexistente',
      },
      ids,
      ['linguagens']
    );
    assert.deepEqual(state, {
      selecao: [],
      termo: '',
      perline: 15,
      lado: 256,
      formato: 'svg',
      categoria: null,
    });
  }
  const state = normalizarEstado(
    {
      selecao: ['python', 'react', 'python', 'unknown', 42],
      perline: '7',
      lado: '1200',
      formato: 'webp',
      categoria: 'linguagens',
    },
    ids,
    ['linguagens']
  );
  assert.deepEqual(state, {
    selecao: ['python', 'react'],
    termo: '',
    perline: 7,
    lado: 1024,
    formato: 'webp',
    categoria: 'linguagens',
  });
});

test('manifesto compartilha fetch em voo e permite retry depois de falhar', async () => {
  const original = globalThis.fetch;
  let calls = 0;
  const data = {
    count: 1,
    categorias: [{ slug: 'front-end', titulo: 'Front-end' }],
    icons: [{ id: 'react', cat: 'front-end', alias: ['reactjs'] }],
  };
  const module = await import('../site/js/dados.js?catalog-cache-test');
  try {
    globalThis.fetch = async () => {
      calls++;
      throw new Error('offline');
    };
    const first = module.catalogo();
    const second = module.catalogo();
    assert.equal(first, second);
    await assert.rejects(first, /offline/);
    assert.equal(calls, 1);
    globalThis.fetch = async () => {
      calls++;
      return new Response(JSON.stringify(data));
    };
    const [a, b] = await Promise.all([module.catalogo(), module.catalogo()]);
    assert.equal(a, b);
    assert.equal(calls, 2);
    assert.equal(module.buscar(a.icones, 'reactjs')[0].id, 'react');
  } finally {
    globalThis.fetch = original;
  }
});
