/** Primitivas SVG: geometria compartilhada por <use>, IDs locais e CSS sem JS por frame. */
const escape = value =>
  String(value).replace(
    /[&"<>]/g,
    c => ({ '&': '&amp;', '"': '&quot;', '<': '&lt;', '>': '&gt;' })[c]
  );
export function attrs(values = {}) {
  return Object.entries(values)
    .map(([key, value]) => ` ${key}="${escape(value)}"`)
    .join('');
}
export function define(meta, compose) {
  return Object.freeze({ ...meta, compose });
}
export function context(model, uid, geometry, layers = [geometry]) {
  const definitions = [];
  const tracks = new Map();
  const filters = new Map();
  let sequence = 0;
  let alphaId;
  const next = kind => `${uid}-${kind}-${sequence++}`;
  const tag = (type, values, content = '') =>
    `<${type}${attrs(values)}>${content}</${type}>`;
  const use = values =>
    `<use href="#${geometry}" xlink:href="#${geometry}"${attrs(values)}/>`;
  const c = {
    uid,
    model,
    definitions,
    tracks,
    tag,
    k(name, frames, timing = 'cubic-bezier(.4,0,.2,1)') {
      if (tracks.has(name))
        throw new Error(`Track duplicado: ${model.id}/${name}`);
      tracks.set(name, { frames, timing });
    },
    base(values = {}) {
      return use({ class: 'sk-rest sk-core', ...values });
    },
    bare(values = {}) {
      return use(values);
    },
    layers(name, values) {
      return layers
        .map(
          (id, i) =>
            `<use href="#${id}" xlink:href="#${id}"${attrs({ class: `sk-fx sk-${name}`, ...values(i) })}/>`
        )
        .join('');
    },
    copy(name, values = {}) {
      return use({ class: `sk-fx sk-${name}`, ...values });
    },
    shape(type, name, values = {}, content = '') {
      return tag(type, { class: `sk-fx sk-${name}`, ...values }, content);
    },
    group(name, content, values = {}) {
      return tag('g', { class: `sk-fx sk-${name}`, ...values }, content);
    },
    defShape(type, name, values = {}) {
      return tag(type, { class: `sk-${name}`, ...values });
    },
    clip(content) {
      const id = next('clip');
      definitions.push(
        tag('clipPath', { id, clipPathUnits: 'userSpaceOnUse' }, content)
      );
      return `url(#${id})`;
    },
    mask(content) {
      const id = next('mask');
      definitions.push(
        tag(
          'mask',
          {
            id,
            maskUnits: 'userSpaceOnUse',
            x: 0,
            y: 0,
            width: 256,
            height: 256,
            'mask-type': 'alpha',
            style: 'mask-type:alpha',
          },
          content
        )
      );
      return `url(#${id})`;
    },
    rect(x, y, width, height) {
      return c.clip(tag('rect', { x, y, width, height }));
    },
    part(name, x, y, width, height, values = {}) {
      return c.copy(name, {
        'clip-path': c.rect(x, y, width, height),
        ...values,
      });
    },
    alpha() {
      if (!alphaId) {
        alphaId = next('alpha');
        definitions.push(
          tag(
            'mask',
            {
              id: alphaId,
              maskUnits: 'userSpaceOnUse',
              x: 0,
              y: 0,
              width: 256,
              height: 256,
              'mask-type': 'alpha',
              style: 'mask-type:alpha',
            },
            use()
          )
        );
      }
      return `url(#${alphaId})`;
    },
    filter(kind) {
      if (filters.has(kind)) return filters.get(kind);
      const id = next(kind);
      const body =
        kind === 'goo'
          ? '<feGaussianBlur stdDeviation="4"/><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 18 -7"/>'
          : '<feGaussianBlur stdDeviation="1.8" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>';
      definitions.push(
        tag(
          'filter',
          {
            id,
            x: '-25%',
            y: '-25%',
            width: '150%',
            height: '150%',
            'color-interpolation-filters': 'sRGB',
          },
          body
        )
      );
      const reference = `url(#${id})`;
      filters.set(kind, reference);
      return reference;
    },
    ring(name, r = 85, values = {}) {
      return c.shape('circle', name, {
        cx: 128,
        cy: 128,
        r,
        fill: 'none',
        stroke: 'var(--sk-accent)',
        'stroke-width': 2,
        ...values,
      });
    },
    line(name, d, values = {}) {
      return c.shape('path', name, {
        d,
        fill: 'none',
        stroke: 'var(--sk-accent)',
        'stroke-width': 2,
        'stroke-linecap': 'round',
        ...values,
      });
    },
    dots(name, count, radius = 78, values = {}) {
      return Array.from({ length: count }, (_, i) => {
        const angle = (i * 2 * Math.PI) / count;
        return c.shape('circle', name, {
          cx: 128,
          cy: 128,
          r: 2.5,
          fill: 'var(--sk-accent)',
          style: `--dx:${(Math.cos(angle) * radius).toFixed(2)}px;--dy:${(Math.sin(angle) * radius).toFixed(2)}px;--slot:${i}`,
          ...values,
        });
      }).join('');
    },
    css() {
      return [...tracks]
        .map(
          ([name, t]) =>
            `.sk-model-${model.id} .sk-${name}{animation:sk-${model.id}-${name} var(--sk-duration) ${t.timing} infinite both;animation-delay:calc(var(--sk-duration)*var(--sk-delay,0))}\n@keyframes sk-${model.id}-${name}{${t.frames}}`
        )
        .join('\n');
    },
  };
  return c;
}
export const BASE_MOTION_CSS = `.sk-scene{--sk-accent:#7dd3fc;--sk-paper:#242938}.sk-fx{opacity:0;pointer-events:none}.sk-rest{opacity:1}.sk-scene use,.sk-scene g,.sk-scene path,.sk-scene circle,.sk-scene rect,.sk-scene ellipse,.sk-scene polygon{transform-box:view-box;transform-origin:128px 128px}`;
export const REDUCED_MOTION_CSS = `@media(prefers-reduced-motion:reduce){.sk-scene *{animation:none!important}.sk-scene .sk-fx{display:none!important}.sk-scene .sk-rest{opacity:1!important;transform:none!important;filter:none!important;clip-path:none!important}}`;
