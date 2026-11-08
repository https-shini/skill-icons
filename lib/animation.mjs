/** Renderiza SVGs confiáveis do catálogo. Não aceita SVG arbitrário do usuário. */
import {
  motionProfile,
  getMotionModel,
  motionStyles,
} from './motion-library.mjs';
import { context } from './motion-kit.mjs';
export { motionStyles } from './motion-library.mjs';
const NON_VISUAL = new Set([
  'defs',
  'mask',
  'clipPath',
  'title',
  'desc',
  'metadata',
]);

/** Leitor estrutural restrito a assets versionados, não um sanitizador XML. */
function tree(svg) {
  const stack = [];
  let root;
  const tags =
    /<!--[\s\S]*?-->|<\?(?:[\s\S]*?)\?>|<(?:[^"'>]|"[^"]*"|'[^']*')*>/g;
  for (const token of svg.matchAll(tags)) {
    const tag = token[0];
    if (tag.startsWith('<!--') || tag.startsWith('<?')) continue;
    if (tag.startsWith('</')) {
      const node = stack.pop();
      if (!node || tag.slice(2, -1).trim() !== node.tag)
        throw new Error('SVG com fechamento inválido');
      node.close = token.index;
      node.end = token.index + tag.length;
      continue;
    }
    const name = tag.match(/^<([\w:-]+)/)?.[1];
    if (!name) throw new Error('Declaração SVG não suportada');
    const node = {
      tag: name,
      start: token.index,
      open: token.index + tag.length,
      close: token.index + tag.length,
      end: token.index + tag.length,
      attrs: tag,
      children: [],
    };
    if (stack.length) stack.at(-1).children.push(node);
    else if (!root) root = node;
    else throw new Error('SVG com mais de uma raiz');
    if (!tag.endsWith('/>')) stack.push(node);
  }
  if (stack.length || root?.tag !== 'svg') throw new Error('SVG incompleto');
  return root;
}

function background(node) {
  return (
    node.tag === 'rect' &&
    /\bwidth=["']256["']/.test(node.attrs) &&
    /\bheight=["']256["']/.test(node.attrs)
  );
}

/** Isola todos os IDs de origem, inclusive gradientes/máscaras e imagens xlink. */
function namespace(svg, prefix) {
  const ids = new Map(
    [...svg.matchAll(/\bid=["']([^"']+)["']/g)].map(m => [
      m[1],
      `${prefix}-${m[1]}`,
    ])
  );
  return svg
    .replace(
      /\bid=(["'])([^"']+)\1/g,
      (all, q, id) => `id=${q}${ids.get(id)}${q}`
    )
    .replace(/url\(#([^)]*)\)/g, (all, id) =>
      ids.has(id) ? `url(#${ids.get(id)})` : all
    )
    .replace(/((?:xlink:)?href=)(["'])#([^"']+)\2/g, (all, key, q, id) =>
      ids.has(id) ? `${key}${q}#${ids.get(id)}${q}` : all
    );
}
export function animateSvg(
  source,
  name,
  { includeStyle = true, model: selected, instance = 0 } = {}
) {
  const profile = motionProfile(name);
  const model = getMotionModel(selected ?? profile.mode);
  if (!model) throw new Error(`Modelo desconhecido: ${selected}`);
  if (!Number.isSafeInteger(instance) || instance < 0)
    throw new Error('Instância inválida');
  const uid = `sk-${profile.id.replace(/[^a-z0-9]/g, '')}-${model.id}-${instance}`;
  const svg = namespace(source, uid);
  const root = tree(svg);
  const fragments = [];
  let nested = false;
  // Extrai a arte preservando os transforms e clips de seus ancestrais. Fundos
  // ficam fora do palco; geometria, imagens e gradientes são armazenados uma vez.
  function extract(container) {
    let fixed = '',
      art = '';
    for (const [index, child] of container.children.entries()) {
      const original = svg.slice(child.start, child.end);
      const fixedPath =
        container !== root &&
        child.tag === 'path' &&
        ((profile.id === 'sqlite' && index < 2) ||
          (profile.id === 'webassembly' && index === 0));
      if (NON_VISUAL.has(child.tag) || background(child) || fixedPath)
        fixed += original;
      else if (
        child.tag === 'g' &&
        (child.children.some(background) ||
          (container === root &&
            ['sqlite', 'webassembly'].includes(profile.id)))
      ) {
        nested = true;
        const inner = extract(child);
        const open = svg.slice(child.start, child.open),
          close = svg.slice(child.close, child.end);
        fixed += open + inner.fixed + close;
        art += open + inner.art + close;
      } else {
        const layer = `${uid}-layer-${fragments.length}`;
        fragments.push(layer);
        art += `<g id="${layer}">${original}</g>`;
      }
    }
    return { fixed, art };
  }
  const { fixed, art } = extract(root);
  if (!art) throw new Error(`Nenhuma arte animável em ${name}`);
  const geometry = `${uid}-geometry`;
  const c = context(model, uid, geometry, nested ? [geometry] : fragments);
  const composition = model.compose(c);
  const boundary = c.clip(
    c.tag('rect', {
      x: 0,
      y: 0,
      width: 256,
      height: 256,
      rx: profile.id === 'robloxstudio' ? 0 : 60,
    })
  );
  let open = svg.slice(root.start, root.open);
  if (!/xmlns:xlink=/.test(open))
    open = open.replace(/>$/, ' xmlns:xlink="http://www.w3.org/1999/xlink">');
  const light = /-light(?:\.svg)?$/i.test(name);
  return (
    open +
    (includeStyle ? motionStyles([model.id]) : '') +
    fixed +
    `<defs><g id="${geometry}">${art}</g></defs><g clip-path="${boundary}"><g class="sk-scene sk-model-${model.id}" data-motion-model="${model.id}" style="--sk-duration:${model.duration}s;--sk-accent:${light ? '#4f46e5' : '#7dd3fc'};--sk-paper:${light ? '#f4f2ed' : '#242938'}"><defs>${c.definitions.join('')}</defs>${composition}</g></g></svg>`
  );
}
