/** Storyboards autorais e assinaturas do arsenal. Temas/tempos não contam como modelos. */
import { context, BASE_MOTION_CSS, REDUCED_MOTION_CSS } from './motion-kit.mjs';
import { ARSENAL_BINDINGS } from './arsenal.mjs';
import { ARSENAL_WEB_MODELS } from './motion-pack-arsenal-web.mjs';
import { ARSENAL_CRAFT_MODELS } from './motion-pack-arsenal-craft.mjs';
import { ARSENAL_QUALITY_MODELS } from './motion-pack-arsenal-quality.mjs';
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
export const MOTION_MODELS = Object.freeze(
  [
    ...BRAND_MODELS,
    ...PHYSICS_MODELS,
    ...DEPTH_MODELS,
    ...ENERGY_MODELS,
    ...CONSTRUCTION_MODELS,
    ...ORGANIC_MODELS,
    ...CINEMA_MODELS,
    ...TECHNOLOGY_MODELS,
    ...ARSENAL_WEB_MODELS,
    ...ARSENAL_CRAFT_MODELS,
    ...ARSENAL_QUALITY_MODELS,
  ].map(model =>
    Object.freeze({
      ...model,
      collections: ARSENAL_BINDINGS[model.icon] === model.id ? ['arsenal'] : [],
      defaultFor: ARSENAL_BINDINGS[model.icon] === model.id ? model.icon : null,
    })
  )
);
const models = new Map(MOTION_MODELS.map(m => [m.id, m]));
if (models.size !== MOTION_MODELS.length || models.size < 64)
  throw new Error('Modelos precisam de IDs únicos e pelo menos 64 entradas');
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
for (const [id, model] of Object.entries(ARSENAL_BINDINGS)) {
  if (!models.has(model) || models.get(model).icon !== id)
    throw new Error(`Assinatura inválida: ${id}/${model}`);
  defaults.set(id, model);
}
const owners = new Map(
  Object.entries(ARSENAL_BINDINGS).map(([id, model]) => [model, id])
);
if (owners.size !== Object.keys(ARSENAL_BINDINGS).length)
  throw new Error('Assinaturas do arsenal devem ser exclusivas');
const FALLBACK = [
  'queda-elastica',
  'palco-isometrico',
  'brilho-vidro',
  'foco-iris',
  'holograma',
  'lago-ondas',
  'planta-tecnica',
  'aurora',
].filter(model => !owners.has(model));
export function motionProfile(name) {
  const id = name
    .replace(/\.svg$/i, '')
    .toLowerCase()
    .replace(/-(dark|light)$/, '');
  let hash = 2166136261;
  for (const char of id)
    hash = Math.imul(hash ^ char.charCodeAt(0), 16777619) >>> 0;
  const candidate = defaults.get(id);
  const reserved = owners.get(candidate);
  const model = getMotionModel(
    candidate && (!reserved || reserved === id)
      ? candidate
      : FALLBACK[hash % FALLBACK.length]
  );
  return {
    id,
    mode: model.id,
    duration: model.duration,
    personalized: defaults.get(id) === model.id,
    exclusive: owners.get(model.id) === id,
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
