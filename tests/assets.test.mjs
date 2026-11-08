import test from 'node:test';
import assert from 'node:assert/strict';
import { assetUrl } from '../site/js/assets.js';

test('recursos funcionam sem DOM, inclusive em ferramentas e testes Node', () => {
  assert.equal(assetUrl('/manifest.json'), '/manifest.json');
});

test('versão conserva queries, vírgulas e fragmentos sem duplicar o parâmetro', () => {
  const previous = globalThis.document;
  globalThis.document = { querySelector: () => ({ content: 'abc123' }) };
  try {
    assert.equal(assetUrl('/manifest.json'), '/manifest.json?v=abc123');
    assert.equal(
      assetUrl('/icons?i=react,python&animation=true'),
      '/icons?i=react,python&animation=true&v=abc123'
    );
    assert.equal(
      assetUrl('/svg/React-Dark.svg?v=old#view'),
      '/svg/React-Dark.svg?v=abc123#view'
    );
    assert.equal(
      assetUrl(assetUrl('/manifest.json')),
      '/manifest.json?v=abc123'
    );
  } finally {
    if (previous === undefined) delete globalThis.document;
    else globalThis.document = previous;
  }
});
