/**
 * Lógica compartilhada entre as duas entradas: o Cloudflare Worker (index.js) e
 * as funções da Vercel (api/*.mjs).
 *
 * `handle()` devolve `null` quando a rota não é reconhecida — quem chama decide
 * o que fazer com isso. O Worker faz passthrough para a origem; a Vercel devolve
 * 404, porque lá os estáticos já são servidos antes das funções e refazer
 * `fetch(request)` viraria laço.
 */
import icons from '../dist/icons.mjs';

const iconNameList = [...new Set(Object.keys(icons).map(i => i.split('-')[0]))];
const shortNames = {
  js: 'javascript',
  ts: 'typescript',
  py: 'python',
  tailwind: 'tailwindcss',
  vue: 'vuejs',
  nuxt: 'nuxtjs',
  go: 'golang',
  cf: 'cloudflare',
  wasm: 'webassembly',
  postgres: 'postgresql',
  k8s: 'kubernetes',
  next: 'nextjs',
  mongo: 'mongodb',
  md: 'markdown',
  ps: 'photoshop',
  ai: 'illustrator',
  pr: 'premiere',
  ae: 'aftereffects',
  scss: 'sass',
  sc: 'scala',
  net: 'dotnet',
  gatsbyjs: 'gatsby',
  gql: 'graphql',
  vlang: 'v',
  amazonwebservices: 'aws',
  bots: 'discordbots',
  express: 'expressjs',
  googlecloud: 'gcp',
  mui: 'materialui',
  windi: 'windicss',
  unreal: 'unrealengine',
  nest: 'nestjs',
  ktorio: 'ktor',
  pwsh: 'powershell',
  au: 'audition',
  rollup: 'rollupjs',
  rxjs: 'reactivex',
  rxjava: 'reactivex',
  ghactions: 'githubactions',
  sklearn: 'scikitlearn',
  rr: 'reactrouter',
  fa: 'fontawesome',
  ws: 'websocket',
  rtl: 'testinglibrary',
};
const themedIcons = [
  ...Object.keys(icons)
    .filter(i => i.includes('-light') || i.includes('-dark'))
    .map(i => i.split('-')[0]),
];

const ICONS_PER_LINE = 15;
const ONE_ICON = 48;
const SCALE = ONE_ICON / (300 - 44);

/** SVG é imutável entre deploys; a CDN revalida sozinha depois de um dia. */
const SVG_CACHE =
  'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800';
const JSON_CACHE = 'public, max-age=600, s-maxage=86400';

export { icons, iconNameList, shortNames, themedIcons };

export function generateSvg(iconNames, perLine) {
  const iconSvgList = iconNames.map(i => icons[i]);

  const length = Math.min(perLine * 300, iconNames.length * 300) - 44;
  const height = Math.ceil(iconSvgList.length / perLine) * 300 - 44;
  const scaledHeight = height * SCALE;
  const scaledWidth = length * SCALE;

  return `
  <svg width="${scaledWidth}" height="${scaledHeight}" viewBox="0 0 ${length} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
    ${iconSvgList
      .map(
        (i, index) =>
          `
        <g transform="translate(${(index % perLine) * 300}, ${
          Math.floor(index / perLine) * 300
        })">
          ${i}
        </g>
        `
      )
      .join(' ')}
  </svg>
  `;
}

export function parseShortNames(names, theme = 'dark') {
  const parsed = [];
  const unknown = [];

  for (const name of names) {
    if (iconNameList.includes(name))
      parsed.push(name + (themedIcons.includes(name) ? `-${theme}` : ''));
    else if (name in shortNames)
      parsed.push(
        shortNames[name] +
          (themedIcons.includes(shortNames[name]) ? `-${theme}` : '')
      );
    else unknown.push(name);
  }

  return { parsed, unknown };
}

/**
 * Descreve cada ícone e qual arquivo usar por tema. A página consome isso para
 * montar a galeria a partir dos estáticos, sem invocar a função por ícone.
 */
export function manifest() {
  return iconNameList
    .map(id => {
      const themed = themedIcons.includes(id);
      return {
        id,
        themed,
        dark: themed ? `${id}-dark` : id,
        light: themed ? `${id}-light` : id,
      };
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}

/** @returns {Promise<Response|null>} null = rota não reconhecida */
export async function handle(request) {
  const { pathname, searchParams } = new URL(request.url);
  const path = pathname.replace(/^\/|\/$/g, '');

  if (path === 'icons') {
    const iconParam = searchParams.get('i') || searchParams.get('icons');
    if (!iconParam)
      return new Response("You didn't specify any icons!", { status: 400 });

    const theme = searchParams.get('t') || searchParams.get('theme');
    if (theme && theme !== 'dark' && theme !== 'light')
      return new Response('Theme must be either "light" or "dark"', {
        status: 400,
      });

    const perLine = Number(searchParams.get('perline') ?? ICONS_PER_LINE);
    if (!Number.isInteger(perLine) || perLine < 1 || perLine > 50)
      return new Response('Icons per line must be a number between 1 and 50', {
        status: 400,
      });

    const iconShortNames =
      iconParam === 'all' ? iconNameList : iconParam.split(',');

    const { parsed: iconNames, unknown } = parseShortNames(
      iconShortNames,
      theme || undefined
    );
    if (unknown.length)
      return new Response(
        `Unknown icon${unknown.length > 1 ? 's' : ''}: ${unknown.join(', ')}`,
        { status: 400 }
      );
    if (!iconNames.length)
      return new Response("You didn't specify any icons!", { status: 400 });

    return new Response(generateSvg(iconNames, perLine), {
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': SVG_CACHE,
      },
    });
  }

  if (path === 'api/icons') {
    return new Response(JSON.stringify(iconNameList), {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
        'Cache-Control': JSON_CACHE,
      },
    });
  }

  if (path === 'api/manifest') {
    return new Response(JSON.stringify(manifest()), {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
        'Cache-Control': JSON_CACHE,
      },
    });
  }

  if (path === 'api/svgs') {
    return new Response(JSON.stringify(icons), {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
        'Cache-Control': JSON_CACHE,
      },
    });
  }

  return null;
}
