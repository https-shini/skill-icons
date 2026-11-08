/**
 * Anima somente a arte dos SVGs conhecidos do catálogo. Os originais continuam
 * estáticos; site, API e download compartilham esta transformação sem biblioteca
 * de runtime nem cópia adicional do catálogo dentro do Worker.
 */
import { motionProfile } from './motion-profiles.mjs';

export const MOTION_STYLE = `<style>
.si-motion-entry,.si-motion-art,.si-motion-detail{transform-box:view-box;transform-origin:128px 128px}
@media(prefers-reduced-motion:no-preference){
.si-motion-entry{animation:si-icon-arrive .64s cubic-bezier(.16,1,.3,1) both}
.si-motion-entry-glow{animation:none}
.si-motion-art{animation-duration:var(--si-motion-cycle);animation-timing-function:cubic-bezier(.45,0,.25,1);animation-iteration-count:infinite}
.si-motion-orbit{animation-name:si-icon-orbit;animation-timing-function:linear;animation-direction:var(--si-motion-direction)}
.si-motion-float{animation-name:si-icon-float}
.si-motion-pulse{animation-name:si-icon-pulse}
.si-motion-wave{animation-name:si-icon-wave;transform-origin:128px 154px}
.si-motion-launch{animation-name:si-icon-launch}
.si-motion-flow{animation-name:si-icon-flow}
.si-motion-signal{animation-name:si-icon-signal}
.si-motion-scan{animation-name:si-icon-scan}
.si-motion-swing{animation-name:si-icon-swing;transform-origin:128px 148px}
.si-motion-bloom{animation-name:si-icon-bloom}
.si-motion-balance{animation-name:si-icon-balance}
.si-motion-glow{animation-name:si-icon-glow}
.si-motion-detail{animation-duration:var(--si-motion-cycle);animation-delay:calc(var(--si-motion-cycle) * var(--si-motion-phase));animation-timing-function:ease-in-out;animation-iteration-count:infinite}
.si-detail-orbit{animation-name:si-detail-orbit}
.si-detail-weave{animation-name:si-detail-weave}
.si-detail-scan{animation-name:si-detail-scan}
.si-detail-radiance{animation-name:si-detail-radiance}
.si-detail-flow{animation-name:si-detail-flow}
@keyframes si-icon-arrive{0%,100%{transform:scale(1)}35%{transform:scale(.97)}72%{transform:scale(1.015)}}
@keyframes si-icon-orbit{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes si-icon-float{0%,100%{transform:translate(0,0) rotate(0deg)}25%{transform:translate(2px,-6px) rotate(-2deg)}60%{transform:translate(-2px,2px) rotate(1.5deg)}}
@keyframes si-icon-pulse{0%,100%{transform:scale(1)}32%{transform:translateY(-2px) scale(1.025)}65%{transform:translateY(1px) scale(.97)}}
@keyframes si-icon-wave{0%,100%{transform:translate(0,0) rotate(0deg)}24%{transform:translate(-3px,-3px) rotate(-3deg)}55%{transform:translate(3px,1px) rotate(3deg)}80%{transform:translate(1px,-2px) rotate(1deg)}}
@keyframes si-icon-launch{0%,100%{transform:translate(0,0) rotate(0deg)}18%{transform:translate(-2px,3px) rotate(-2deg)}48%{transform:translate(5px,-7px) rotate(3deg)}75%{transform:translate(1px,-2px) rotate(0deg)}}
@keyframes si-icon-flow{0%,100%{transform:translateX(0) scaleX(1)}20%{transform:translateX(-3px) scaleX(.97)}52%{transform:translateX(6px) scaleX(1.02)}78%{transform:translateX(-1px) scaleX(1)}}
@keyframes si-icon-signal{0%,22%,70%,100%{transform:translateY(0) scale(1)}38%{transform:translateY(-3px) scale(1.035)}53%{transform:translateY(1px) scale(.985)}}
@keyframes si-icon-scan{0%,100%{transform:translateX(0)}28%{transform:translateX(3px)}58%{transform:translateX(-2px)}78%{transform:translateX(1px)}}
@keyframes si-icon-swing{0%,100%{transform:rotate(0deg) translateY(0)}27%{transform:rotate(-3deg) translateY(-2px)}65%{transform:rotate(3deg) translateY(-3px)}}
@keyframes si-icon-bloom{0%,100%{transform:scale(1) rotate(0deg)}38%{transform:scale(1.035) rotate(5deg)}72%{transform:scale(.97) rotate(-3deg)}}
@keyframes si-icon-balance{0%,100%{transform:translateY(0) scale(1)}30%{transform:translateY(-4px) scale(1.015)}68%{transform:translateY(2px) scale(.99)}}
@keyframes si-icon-glow{0%,100%{opacity:1}45%{opacity:.78}70%{opacity:.94}}
@keyframes si-detail-orbit{0%,100%{transform:rotate(0deg);opacity:1}50%{transform:rotate(5deg);opacity:.84}}
@keyframes si-detail-weave{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
@keyframes si-detail-scan{0%,18%,100%{transform:translateX(0);opacity:1}48%{transform:translateX(4px);opacity:.8}72%{transform:translateX(-1px);opacity:1}}
@keyframes si-detail-radiance{0%,100%{transform:scale(1) rotate(0deg)}45%{transform:scale(1.012) rotate(2deg)}72%{transform:scale(.995) rotate(-1deg)}}
@keyframes si-detail-flow{0%,100%{transform:translateX(0)}50%{transform:translateX(2px)}}
}
@media(prefers-reduced-motion:reduce){.si-motion-entry,.si-motion-art,.si-motion-detail{animation:none!important;transform:none!important;opacity:1!important}}
</style>`;

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

/**
 * Mantém grupos de clipping e definições intactos, reunindo a arte em um grupo
 * novo para não sobrescrever transforms de paths/grupos existentes.
 */
export function animateSvg(svg, name, { includeStyle = true } = {}) {
  const root = tree(svg);
  const { id, mode, duration, direction, detail } = motionProfile(name);
  let groups = 0;
  let layer = 0;

  function render(container) {
    let output = svg.slice(container.start, container.open);
    let cursor = container.open;
    let art = '';
    function flush() {
      if (!art) return;
      output += `<g class="si-motion-entry${mode === 'glow' ? ' si-motion-entry-glow' : ''}"><g class="si-motion-art si-motion-${mode}" style="--si-motion-cycle:${duration}s;--si-motion-direction:${direction}">${art}</g></g>`;
      groups++;
      art = '';
    }
    for (const [index, child] of container.children.entries()) {
      const gap = svg.slice(cursor, child.start);
      // SQLite incorpora o fundo nos dois primeiros paths; WebAssembly no
      // primeiro. Roblox não tem arte separável: anima opacidade, sem deslocar
      // sua silhueta. Os demais fundos são rects, inclusive dentro de clips.
      const fixedPath =
        container !== root &&
        child.tag === 'path' &&
        ((id === 'sqlite' && index < 2) ||
          (id === 'webassembly' && index === 0));
      if (NON_VISUAL.has(child.tag) || background(child) || fixedPath) {
        flush();
        output += gap + svg.slice(child.start, child.end);
      } else if (
        (child.tag === 'g' && child.children.some(background)) ||
        (child.tag === 'g' &&
          container === root &&
          ['sqlite', 'webassembly'].includes(id))
      ) {
        flush();
        output += gap + render(child);
      } else {
        const original = svg.slice(child.start, child.end);
        // Somente perfis revisados recebem movimento relativo entre camadas.
        // A maioria mantém o desenho inteiro coeso; nunca altera transforms
        // originais nem anima definições/máscaras/fundos.
        const accent = detail && !(id === 'react' && layer === 0);
        art +=
          gap +
          (accent
            ? `<g class="si-motion-detail si-detail-${detail}" style="--si-motion-phase:${((layer % 8) * 0.08).toFixed(2)}">${original}</g>`
            : original);
        layer++;
      }
      cursor = child.end;
    }
    flush();
    return output + svg.slice(cursor, container.end);
  }

  const result = render(root);
  if (!groups) throw new Error(`Nenhuma arte animável em ${name}`);
  return result.replace(
    /<svg\b[^>]*>/,
    tag => tag + (includeStyle ? MOTION_STYLE : '')
  );
}
