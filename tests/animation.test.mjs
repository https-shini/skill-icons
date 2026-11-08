import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { animateSvg, motionStyles } from '../lib/animation.mjs';
import {
  MOTION_MODELS,
  MOTION_CATEGORIES,
  motionProfile,
  animationManifest,
} from '../lib/motion-library.mjs';
import { generateSvg, handle, icons } from '../lib/icons.mjs';
const geometryTags = svg =>
  svg.match(/<(?:path|rect|circle|ellipse|polygon|polyline|image)\b[^>]*>/g) ??
  [];

test('64 storyboards com conceitos, mecanismos, CSS e composições distintos em oito universos', () => {
  assert.equal(MOTION_MODELS.length, 64);
  assert.equal(Object.keys(MOTION_CATEGORIES).length, 8);
  for (const field of ['id', 'title', 'concept', 'mechanism'])
    assert.equal(new Set(MOTION_MODELS.map(m => m[field])).size, 64, field);
  const css = new Set(),
    compositions = new Set();
  for (const model of MOTION_MODELS) {
    assert.match(model.id, /^[a-z]+(?:-[a-z]+)*$/);
    assert.ok(icons[model.icon] || icons[`${model.icon}-dark`], model.icon);
    assert.ok(model.duration >= 6 && model.duration <= 10);
    // Retira o nome do modelo: renomear a mesma animação não passa este teste.
    css.add(motionStyles([model.id]).replaceAll(model.id, 'MODEL'));
    const rendered = animateSvg(icons['react-dark'], 'react-dark', {
      model: model.id,
    });
    compositions.add(
      rendered
        .slice(rendered.indexOf('data-motion-model'))
        .replaceAll(model.id, 'MODEL')
        .replace(/<style>[\s\S]*?<\/style>/g, '')
    );
  }
  assert.equal(css.size, 64);
  assert.equal(compositions.size, 64);
  for (const category of Object.keys(MOTION_CATEGORIES))
    assert.equal(MOTION_MODELS.filter(m => m.category === category).length, 8);
  assert.ok(animationManifest().every(m => !('compose' in m)));
});

test('todo o catálogo preserva sua geometria de origem uma vez, inclusive imagens e transforms', () => {
  for (const [name, source] of Object.entries(icons)) {
    const out = animateSvg(source, name);
    assert.match(out, /data-motion-model="[a-z-]+"/);
    // Só o namespace muda: cores, referências e transforms são preservados.
    const profile = motionProfile(name);
    const prefix = `sk-${profile.id.replace(/[^a-z0-9]/g, '')}-${profile.mode}-0-`;
    const renderedTags = geometryTags(out).map(tag =>
      tag.replaceAll(prefix, '')
    );
    for (const tag of geometryTags(source))
      assert.ok(
        renderedTags.includes(tag),
        `${name}: tag original perdida ${tag.slice(0, 80)}`
      );
    const ids = [...out.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
    assert.equal(new Set(ids).size, ids.length, `${name}: ID repetido`);
    for (const ref of out.matchAll(/(?:url\(#|(?:xlink:)?href="#)([^)" ]+)/g))
      assert.ok(ids.includes(ref[1]), `${name}: referência quebrada ${ref[1]}`);
    const embedded = (source.match(/data:image\//g) ?? []).length;
    assert.equal(
      (out.match(/data:image\//g) ?? []).length,
      embedded,
      `${name}: imagem duplicada`
    );
    assert.equal((out.match(/<style>/g) ?? []).length, 1);
  }
});

test('fundos ficam fora do palco e paths de fundo especiais permanecem fixos', () => {
  for (const name of ['react-dark', 'rocket', 'sqlite', 'webassembly']) {
    const out = animateSvg(icons[name], name, { includeStyle: false });
    const before = out.slice(0, out.indexOf('<defs><g id='));
    if (['sqlite', 'webassembly'].includes(name))
      assert.ok(
        (before.match(/<path\b/g) ?? []).length >= (name === 'sqlite' ? 2 : 1)
      );
    else assert.match(before, /<rect\b/);
    assert.doesNotMatch(before, /sk-scene/);
  }
});

test('perfis são determinísticos, compartilham temas e tratam marcas explicitamente', () => {
  for (const key of Object.keys(icons)) {
    const profile = motionProfile(key);
    assert.deepEqual(profile, motionProfile(key));
    assert.ok(MOTION_MODELS.some(m => m.id === profile.mode));
    assert.deepEqual(profile, motionProfile(profile.id + '-light'));
  }
  for (const [id, model] of [
    ['gcruz', 'assinatura-vetorial'],
    ['gctag', 'portal-brackets'],
    ['gc', 'fusao-monograma'],
    ['react', 'reator-atomico'],
    ['python', 'serpentes-entrelacadas'],
    ['docker', 'carga-containers'],
    ['bandit', 'guaxinim-vivo'],
  ])
    assert.equal(motionProfile(id).mode, model);
});

test('todos os modelos aceitam arte simples, grupos, gradientes e imagem embutida', () => {
  for (const model of MOTION_MODELS)
    for (const name of ['javascript', 'python-dark', 'sqlite', 'bandit-dark']) {
      const source = icons[name];
      assert.ok(source, name);
      const out = animateSvg(source, name, { model: model.id });
      const ids = [...out.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
      assert.equal(
        new Set(ids).size,
        ids.length,
        `${model.id}/${name}: ID repetido`
      );
      for (const m of out.matchAll(/(?:url\(#|(?:xlink:)?href="#)([^)" ]+)/g))
        assert.ok(
          ids.includes(m[1]),
          `${model.id}: referência ${m[1]} quebrada`
        );
      assert.doesNotMatch(out, /<script|\bon\w+=|NaN|undefined/);
    }
});

test('saída reduzida restaura a arte e CSS é seletivo por modelo', () => {
  const css = motionStyles(['reator-atomico', 'reator-atomico']);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /animation:none!important/);
  assert.match(
    css,
    /\.sk-scene \.sk-rest\{opacity:1!important;transform:none!important/
  );
  assert.doesNotMatch(css, /sk-meteoro/);
  assert.equal(
    (css.match(/@keyframes sk-reator-atomico-core\{/g) ?? []).length,
    1
  );
  assert.throws(() => motionStyles(['invalid']));
});

test('composição animada isola IDs em repetições e preserva dimensões e ordem', () => {
  const names = ['python-dark', 'react-dark', 'python-dark'];
  const plain = generateSvg(names, 2),
    out = generateSvg(names, 2, true);
  assert.equal(plain.match(/<svg[^>]+>/)[0], out.match(/<svg[^>]+>/)[0]);
  assert.equal((out.match(/<style>/g) ?? []).length, 1);
  const ids = [...out.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal((out.match(/data-motion-model=/g) ?? []).length, 3);
  const a = out.indexOf('data-motion-model="serpentes-entrelacadas"'),
    b = out.indexOf('data-motion-model="reator-atomico"');
  assert.ok(a < b);
  assert.equal(
    (out.match(/@keyframes sk-serpentes-entrelacadas-core\{/g) ?? []).length,
    1
  );
});

test('API preserva padrão estático, expõe catálogo e seleciona cada um dos 64 modelos', async () => {
  const request = q =>
    handle(new Request('https://example.test/icons?i=js,react,python&' + q));
  assert.equal(
    await (await request('')).text(),
    await (await request('animation=false')).text()
  );
  for (const model of MOTION_MODELS) {
    const r = await request('animation=true&model=' + model.id);
    assert.equal(r.status, 200);
    assert.equal((await r.text()).match(/data-motion-model=/g).length, 3);
  }
  for (const q of [
    'animation=unknown',
    'animation=true&model=constructor',
    'animation=true&model=__proto__',
    'animation=true&model=%3Cscript%3E',
  ])
    assert.equal((await request(q)).status, 400);
  assert.equal((await request('animation=true&model=')).status, 200);
  for (const id of ['constructor', '__proto__', 'toString'])
    assert.equal(
      (
        await handle(
          new Request(`https://example.test/icons?i=${id}&animation=true`)
        )
      ).status,
      400
    );
  const r = await handle(new Request('https://example.test/api/animations'));
  assert.equal(r.status, 200);
  assert.deepEqual(await r.json(), animationManifest());
});

test('SVGs originais versionados continuam idênticos ao catálogo gerado', () => {
  for (const file of fs
    .readdirSync(new URL('../icons/', import.meta.url))
    .filter(n => n.endsWith('.svg'))) {
    const key = file.replace(/\.svg$/, '').toLowerCase();
    assert.equal(
      fs
        .readFileSync(new URL('../icons/' + file, import.meta.url), 'utf8')
        .trim(),
      icons[key].trim()
    );
  }
});
