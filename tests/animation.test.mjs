import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { animateSvg, MOTION_STYLE } from '../lib/animation.mjs';
import { motionProfile, MOTION_PROFILES } from '../lib/motion-profiles.mjs';
import { generateSvg, handle, icons } from '../lib/icons.mjs';

test('todo o catálogo tem versão animada sem modificar o original', () => {
  const files = fs.readdirSync(new URL('../icons/', import.meta.url));
  for (const file of files.filter(f => f.endsWith('.svg'))) {
    const source = fs.readFileSync(
      new URL(`../icons/${file}`, import.meta.url),
      'utf8'
    );
    const result = animateSvg(source, file);
    assert.match(result, /class="si-motion-art si-motion-\w+"/);
    assert.ok(result.includes(MOTION_STYLE));
    // Preserva integralmente cada tag do desenho (attrs, transforms, cores,
    // referências, imagens embutidas), acrescentando somente style e grupos.
    const tags = source.match(/<(?:[^"'>]|"[^"]*"|'[^']*')*>/g);
    let cursor = 0;
    for (const tag of tags) {
      const at = result.indexOf(tag, cursor);
      assert.ok(
        at >= cursor,
        `${file}: tag original perdida: ${tag.slice(0, 80)}`
      );
      cursor = at + tag.length;
    }
  }
});

test('arte move em conjunto e fundo permanece fora da animação', () => {
  const svg =
    '<svg><rect width="256" height="256"/><path d="M1 1"/><g transform="translate(2)"><path d="M2 2"/></g><defs><mask id="x"/></defs></svg>';
  const result = animateSvg(svg, 'Example-Dark.svg');
  assert.ok(
    result.indexOf('<rect') < result.indexOf('<g class="si-motion-art')
  );
  assert.match(
    result,
    /<g transform="translate\(2\)"><path d="M2 2"\/><\/g><\/g><\/g><defs>/
  );
});

test('fundos dentro de clips e paths especiais são preservados', () => {
  for (const [id, staticPaths] of [
    ['sqlite', 2],
    ['webassembly', 1],
  ]) {
    const source = icons[id];
    const result = animateSvg(source, id);
    const before = result.slice(0, result.indexOf('<g class="si-motion-art'));
    assert.equal((before.match(/<path\b/g) ?? []).length, staticPaths);
  }
  const rocket = animateSvg(icons.rocket, 'rocket');
  assert.match(
    rocket,
    /<g clip-path=[^>]+><rect[^>]+\/><g class="si-motion-entry"><g class="si-motion-art/s
  );
  assert.match(
    animateSvg(icons.robloxstudio, 'robloxstudio'),
    /si-motion-glow/
  );
});

test('pares temáticos compartilham movimento; cada símbolo mantém seu perfil', () => {
  for (const [id, mode] of [
    ['react', 'orbit'],
    ['javascript', 'pulse'],
    ['python', 'swing'],
  ]) {
    const key = icons[id] ? id : `${id}-dark`;
    const result = animateSvg(icons[key], key);
    assert.match(result, new RegExp(`si-motion-art si-motion-${mode}`));
    if (icons[`${id}-light`]) {
      const light = animateSvg(icons[`${id}-light`], `${id}-light`);
      assert.equal(
        result.match(/--si-motion-cycle:([^";]+)/)[1],
        light.match(/--si-motion-cycle:([^";]+)/)[1]
      );
    }
  }
});

test('CSS oferece redução de movimento sem scripts ou filtros novos', () => {
  assert.match(MOTION_STYLE, /prefers-reduced-motion:reduce/);
  assert.match(MOTION_STYLE, /animation:none!important/);
  assert.doesNotMatch(MOTION_STYLE, /<script|filter:/);
});

test('API mantém saída estática padrão e permite animação explícita', async () => {
  const request = query =>
    handle(
      new Request(`https://example.test/icons?i=js,react,python&${query}`)
    );
  const plain = await request('');
  const off = await request('animation=false');
  assert.equal(plain.status, 200);
  assert.equal(await plain.text(), await off.text());
  const on = await request('animation=true');
  const body = await on.text();
  assert.equal(on.status, 200);
  assert.equal((body.match(/<style>/g) ?? []).length, 1);
  assert.equal((body.match(/class="si-motion-art/g) ?? []).length, 3);
  assert.equal((await request('animation=unknown')).status, 400);
  for (const id of ['constructor', '__proto__', 'toString']) {
    const invalid = await handle(
      new Request(`https://example.test/icons?i=${id}&animation=true`)
    );
    assert.equal(invalid.status, 400);
  }
});

test('composição conserva dimensões, ordem e repetições', () => {
  const names = ['react-dark', 'javascript', 'react-dark'];
  const plain = generateSvg(names, 2);
  const animated = generateSvg(names, 2, true);
  assert.equal(plain.match(/<svg[^>]+>/)[0], animated.match(/<svg[^>]+>/)[0]);
  assert.equal(
    (animated.match(/si-motion-art si-motion-orbit/g) ?? []).length,
    2
  );
  assert.ok(
    animated.indexOf('si-motion-art si-motion-orbit') <
      animated.indexOf('si-motion-art si-motion-pulse')
  );
});

test('doze famílias cobrem o catálogo com perfis determinísticos e pares iguais', () => {
  const assigned = new Set();
  for (const spec of Object.values(MOTION_PROFILES)) {
    for (const id of spec.ids.split(' ').filter(Boolean)) {
      assert.ok(!assigned.has(id), `perfil duplicado: ${id}`);
      assigned.add(id);
      assert.ok(
        icons[id] || icons[`${id}-dark`],
        `perfil para ID inexistente: ${id}`
      );
    }
  }
  const modes = new Set();
  for (const key of Object.keys(icons)) {
    const profile = motionProfile(key);
    modes.add(profile.mode);
    assert.ok(MOTION_PROFILES[profile.mode]);
    assert.ok(profile.duration >= 3 && profile.duration < 16);
    assert.deepEqual(profile, motionProfile(key));
    const base = profile.id;
    if (icons[`${base}-light`])
      assert.deepEqual(
        motionProfile(`${base}-light`),
        motionProfile(`${base}-dark`)
      );
  }
  assert.equal(modes.size, 12);
});

test('camadas específicas têm acentos sem duplicar a geometria', () => {
  for (const [id, detail] of [
    ['react-dark', 'orbit'],
    ['python-dark', 'weave'],
    ['prettier-dark', 'scan'],
    ['gemini-dark', 'radiance'],
    ['motion-dark', 'flow'],
  ]) {
    const output = animateSvg(icons[id], id);
    assert.match(output, new RegExp(`si-motion-detail si-detail-${detail}`));
    assert.equal(
      (output.match(/<path\b/g) ?? []).length,
      (icons[id].match(/<path\b/g) ?? []).length
    );
  }
  const glow = animateSvg(icons.robloxstudio, 'robloxstudio');
  assert.match(glow, /si-motion-entry-glow/);
  assert.doesNotMatch(glow, /class="si-motion-detail/);
});
