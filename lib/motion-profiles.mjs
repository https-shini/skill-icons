/** Perfis visuais sem dependência do catálogo ou de APIs do navegador. */
export const MOTION_PROFILES = Object.freeze({
  orbit: { seconds: 14, ids: 'react atom kubernetes redux graphql' },
  wave: { seconds: 4.2, ids: 'docker' },
  launch: { seconds: 3.8, ids: 'rocket astro postman vite firebase elysia' },
  flow: {
    seconds: 3.6,
    ids: 'motion openrouter githubactions git rabbitmq kafka',
  },
  signal: {
    seconds: 4,
    ids: 'socketio websocket expressjs nginx workers cloudflare aws gcp azure vercel netlify render jwt',
  },
  scan: {
    seconds: 4.6,
    ids: 'prettier biome ruff eslint bandit golangci radon testinglibrary jest vitest playwright cypress selenium husky regex',
  },
  swing: {
    seconds: 5,
    ids: 'python golang rust github gitlab discord discordjs discordbots godot linux bsd',
  },
  bloom: {
    seconds: 5.2,
    ids: 'claude gemini jupyter lucide jinja figma sketchup blender svg svelte solidjs vuejs angular flutter',
  },
  balance: {
    seconds: 5.4,
    ids: 'postgresql mysql mongodb sql sqlite oracle cassandra dynamodb elasticsearch hibernate sequelize prisma supabase planetscale gc gcruz gctag',
  },
  pulse: {
    seconds: 4.4,
    ids: 'javascript typescript html css java c cpp cs kotlin swift php bash powershell ruby perl scala fortran nim zig dart deno bun',
  },
  float: { seconds: 5.6, ids: '' },
  glow: { seconds: 4.8, ids: 'robloxstudio' },
});

const modeById = new Map(
  Object.entries(MOTION_PROFILES).flatMap(([mode, profile]) =>
    profile.ids
      .split(' ')
      .filter(Boolean)
      .map(id => [id, mode])
  )
);
const FALLBACKS = ['float', 'pulse', 'swing', 'balance'];
const DETAILS = new Map([
  ['react', 'orbit'],
  ['python', 'weave'],
  ['prettier', 'scan'],
  ['gemini', 'radiance'],
  ['claude', 'radiance'],
  ['jupyter', 'radiance'],
  ['lucide', 'radiance'],
  ['motion', 'flow'],
  ['openrouter', 'flow'],
]);

export function motionProfile(name) {
  const id = name
    .replace(/\.svg$/i, '')
    .toLowerCase()
    .split('-')[0];
  let hash = 2166136261;
  for (const char of id)
    hash = Math.imul(hash ^ char.charCodeAt(0), 16777619) >>> 0;
  const mode = modeById.get(id) ?? FALLBACKS[hash % FALLBACKS.length];
  return {
    id,
    mode,
    duration: Number(
      (MOTION_PROFILES[mode].seconds + (hash % 9) * 0.12).toFixed(2)
    ),
    direction: mode === 'orbit' && hash % 2 ? 'reverse' : 'normal',
    detail: DETAILS.get(id) ?? null,
  };
}
