/** 64 storyboards autorais. Variantes de tempo/tema não contam como modelos. */
import { context, BASE_MOTION_CSS, REDUCED_MOTION_CSS } from './motion-kit.mjs';
import { BRAND_MODELS } from './motion-pack-brand.mjs';
import { PHYSICS_MODELS } from './motion-pack-physics.mjs';
import { DEPTH_MODELS } from './motion-pack-depth.mjs';
import { ENERGY_MODELS } from './motion-pack-energy.mjs';
import { CONSTRUCTION_MODELS } from './motion-pack-construction.mjs';
import { ORGANIC_MODELS } from './motion-pack-organic.mjs';
import { CINEMA_MODELS } from './motion-pack-cinema.mjs';
import { TECHNOLOGY_MODELS } from './motion-pack-technology.mjs';
export const MOTION_CATEGORIES = Object.freeze({
  marca: 'Marca',
  fisica: 'Física',
  profundidade: 'Profundidade',
  energia: 'Energia',
  construcao: 'Construção',
  organicos: 'Orgânicos',
  cinema: 'Cinema',
  tecnologia: 'Tecnologia',
});
export const MOTION_MODELS = Object.freeze([
  ...BRAND_MODELS,
  ...PHYSICS_MODELS,
  ...DEPTH_MODELS,
  ...ENERGY_MODELS,
  ...CONSTRUCTION_MODELS,
  ...ORGANIC_MODELS,
  ...CINEMA_MODELS,
  ...TECHNOLOGY_MODELS,
]);
const models = new Map(MOTION_MODELS.map(m => [m.id, m]));
if (models.size !== 64)
  throw new Error('A biblioteca deve conter 64 IDs únicos');
export const animationManifest = () =>
  MOTION_MODELS.map(({ compose, ...meta }) => meta);
export const getMotionModel = id => models.get(id);
const defaults = new Map(MOTION_MODELS.map(m => [m.icon, m.id]));
// Preferências explícitas das marcas com mais de uma composição exclusiva.
for (const [id, model] of Object.entries({
  robloxstudio: 'brilho-vidro',
  gcruz: 'assinatura-vetorial',
  gc: 'fusao-monograma',
  gctag: 'portal-brackets',
  motion: 'estilingue',
  openrouter: 'fila-eventos',
  socketio: 'circuito-relampago',
  ruff: 'gravacao-laser',
  biome: 'vinha-crescimento',
  radon: 'planta-tecnica',
  golangci: 'compilacao-tipos',
  jinja: 'tecido-cruzado',
}))
  defaults.set(id, model);
const FALLBACK = [
  'queda-elastica',
  'palco-isometrico',
  'brilho-vidro',
  'foco-iris',
  'holograma',
  'lago-ondas',
  'planta-tecnica',
  'aurora',
];
export function motionProfile(name) {
  const id = name
    .replace(/\.svg$/i, '')
    .toLowerCase()
    .replace(/-(dark|light)$/, '');
  let hash = 2166136261;
  for (const char of id)
    hash = Math.imul(hash ^ char.charCodeAt(0), 16777619) >>> 0;
  const model = getMotionModel(
    defaults.get(id) ?? FALLBACK[hash % FALLBACK.length]
  );
  return {
    id,
    mode: model.id,
    duration: model.duration,
    personalized: defaults.has(id),
  };
}
const styles = new Map(
  MOTION_MODELS.map(model => {
    const c = context(model, 'style', 'art');
    model.compose(c);
    return [model.id, c.css()];
  })
);
/** Uma folha por resposta e apenas os modelos usados, nunca os 64 por ícone. */
export function motionStyles(ids) {
  const selected = [...new Set(ids)];
  return `<style>${BASE_MOTION_CSS}\n@media(prefers-reduced-motion:no-preference){\n${selected
    .map(id => {
      if (!styles.has(id)) throw new Error(`Modelo desconhecido: ${id}`);
      return styles.get(id);
    })
    .join('\n')}\n}\n${REDUCED_MOTION_CSS}</style>`;
}
