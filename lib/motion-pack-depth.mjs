import { define } from './motion-kit.mjs';
const m = (id, title, icon, concept, mechanism, compose) =>
  define(
    {
      id,
      title,
      icon,
      concept,
      mechanism,
      category: 'profundidade',
      duration: 8,
      cost: 'media',
    },
    compose
  );
export const DEPTH_MODELS = [
  m(
    'palco-isometrico',
    'Palco isométrico',
    'vscode',
    'Uma plataforma abre em perspectiva e apresenta a peça em uma volta de exposição.',
    'palco em losango + projeção isométrica',
    c => {
      c.k(
        'core',
        '0%,8%,95%,100%{transform:none}30%{transform:translateY(-20px) skewY(-12deg) scale(.78,.85)}65%{transform:translateY(-20px) skewY(12deg) scale(.78,.85)}85%{transform:none}'
      );
      c.k(
        'stage',
        '0%,12%,94%,100%{opacity:0;transform:translateY(25px) scale(.2)}30%,72%{opacity:.75;transform:none}'
      );
      return (
        c.group(
          'stage',
          '<path d="M22 190L128 151L234 190L128 235Z" fill="var(--sk-accent)" fill-opacity=".14" stroke="var(--sk-accent)"/><path d="M22 190V201L128 246L234 201V190M128 235V246" fill="none" stroke="var(--sk-accent)"/>'
        ) + c.base()
      );
    }
  ),
  m(
    'holograma',
    'Holograma volumétrico',
    'golang',
    'Um projetor captura a arte em bandas luminosas com separação cromática.',
    'fatias de leitura + matriz de projeção',
    c => {
      c.k(
        'core',
        '0%,10%,95%,100%{opacity:1;transform:none}30%,72%{opacity:.45;transform:translateY(-9px) scale(.9)}'
      );
      c.k(
        'band',
        '0%,14%,92%,100%{opacity:0;transform:translateY(12px)}35%{opacity:.8;transform:translate(-7px,-10px)}58%{opacity:.9;transform:translate(5px,-7px)}80%{opacity:0;transform:none}'
      );
      c.k(
        'grid',
        '0%,12%,92%,100%{opacity:0;transform:scaleX(.1)}29%,76%{opacity:.4;transform:scaleX(1)}'
      );
      let bands = '';
      for (let i = 0; i < 6; i++)
        bands += c.part('band', 24, 32 + i * 32, 208, 14, {
          style: `--sk-delay:${i * 0.018}`,
          filter: c.filter('glow'),
        });
      return (
        c.line(
          'grid',
          'M32 224L128 192L224 224M64 232L128 208L192 232M128 192V240M32 224H224'
        ) +
        c.base() +
        bands
      );
    }
  ),
  m(
    'cubo-origami',
    'Cubo origami',
    'unity',
    'Quatro faces se abrem a partir do centro e voltam a formar a superfície original.',
    'faces articuladas + profundidade por escala',
    c => {
      c.k('core', '0%,8%,95%,100%{opacity:1}18%,84%{opacity:0}');
      c.k(
        'face',
        '0%,10%,93%,100%{opacity:0;transform:none}35%,64%{opacity:1;transform:translate(var(--x),var(--y)) scale(.7) skew(var(--a),var(--b))}84%{opacity:1;transform:none}'
      );
      const p = [
        [0, 0, '-24px', '-24px', '0deg', '14deg'],
        [128, 0, '24px', '-24px', '0deg', '-14deg'],
        [0, 128, '-24px', '24px', '14deg', '0deg'],
        [128, 128, '24px', '24px', '-14deg', '0deg'],
      ];
      return (
        c.base() +
        p
          .map(([x, y, dx, dy, a, b]) =>
            c.part('face', x, y, 128, 128, {
              style: `--x:${dx};--y:${dy};--a:${a};--b:${b}`,
            })
          )
          .join('')
      );
    }
  ),
  m(
    'tunel-portal',
    'Túnel de portais',
    'nextjs',
    'A peça atravessa portais retangulares que se afastam em profundidade.',
    'perspectiva concêntrica + travessia de plano',
    c => {
      c.k(
        'core',
        '0%,10%,95%,100%{opacity:1;transform:scale(1)}42%{opacity:.3;transform:scale(.08)}56%{opacity:0;transform:scale(.08)}72%{opacity:1;transform:scale(1.08)}85%{transform:scale(1)}'
      );
      c.k(
        'portal',
        '0%,14%,92%,100%{opacity:0;transform:scale(.18)}35%{opacity:.7;transform:scale(.65)}70%{opacity:0;transform:scale(1.15)}',
        'linear'
      );
      return (
        [0, 0.05, 0.1, 0.15]
          .map(d =>
            c.shape('rect', 'portal', {
              x: 32,
              y: 32,
              width: 192,
              height: 192,
              rx: 28,
              fill: 'none',
              stroke: 'var(--sk-accent)',
              'stroke-width': 3,
              style: `--sk-delay:${d}`,
            })
          )
          .join('') + c.base()
      );
    }
  ),
  m(
    'carta-dupla',
    'Carta de duas faces',
    'css',
    'A carta gira sobre a aresta, mostra um verso geométrico e retorna à frente.',
    'troca frente/verso + escorço de cartão',
    c => {
      c.k(
        'core',
        '0%,12%,94%,100%{opacity:1;transform:scaleX(1)}36%{opacity:1;transform:scaleX(.025)}37%,62%{opacity:0;transform:scaleX(.025)}84%{opacity:1;transform:scaleX(1)}'
      );
      c.k(
        'back',
        '0%,35%,85%,100%{opacity:0;transform:scaleX(.02)}48%,58%{opacity:1;transform:scaleX(1)}72%{opacity:0;transform:scaleX(.02)}'
      );
      return (
        c.base() +
        c.group(
          'back',
          '<rect x="38" y="38" width="180" height="180" rx="18" fill="var(--sk-paper)" stroke="var(--sk-accent)" stroke-width="3"/><path d="M56 128L128 56L200 128L128 200Z M80 128L128 80L176 128L128 176Z" fill="none" stroke="var(--sk-accent)" stroke-width="3"/><circle cx="128" cy="128" r="8" fill="var(--sk-accent)"/>'
        )
      );
    }
  ),
  m(
    'paisagem-paralaxe',
    'Paisagem em paralaxe',
    'threejs',
    'Planos de relevo atravessam o primeiro plano em velocidades independentes.',
    'oclusão entre três planos + deslocamento de câmera',
    c => {
      c.k(
        'core',
        '0%,8%,96%,100%{transform:none}35%{transform:translate(-12px,-9px) scale(.82)}69%{transform:translate(12px,-5px) scale(.82)}'
      );
      c.k(
        'far',
        '0%,13%,93%,100%{opacity:0;transform:translateX(16px)}32%,72%{opacity:.3;transform:translateX(-12px)}'
      );
      c.k(
        'near',
        '0%,18%,92%,100%{opacity:0;transform:translateX(-25px)}35%,72%{opacity:.9;transform:translateX(25px)}'
      );
      return (
        c.shape('path', 'far', {
          d: 'M8 164L62 75L112 156L174 56L247 169V224H8Z',
          fill: 'var(--sk-accent)',
        }) +
        c.base() +
        c.shape('path', 'near', {
          d: 'M-20 235L45 181L100 220L179 173L278 232Z',
          fill: 'var(--sk-paper)',
          stroke: 'var(--sk-accent)',
          'stroke-width': 2,
        })
      );
    }
  ),
  m(
    'prisma-cromatico',
    'Prisma cromático',
    'figma',
    'Um feixe entra no prisma e sai dividido em cores sobre a silhueta.',
    'refração por prisma + leque espectral',
    c => {
      c.k('core', '0%,10%,95%,100%{opacity:1}35%,73%{opacity:.45}');
      c.k(
        'beam',
        '0%,16%,91%,100%{opacity:0;stroke-dashoffset:260}35%,72%{opacity:.9;stroke-dashoffset:0}'
      );
      c.k(
        'spectrum',
        '0%,27%,92%,100%{opacity:0;transform:scaleX(.1)}47%,74%{opacity:.75;transform:scaleX(1)}'
      );
      let fan = '';
      ['#fb7185', '#fbbf24', '#4ade80', '#38bdf8', '#a78bfa'].forEach(
        (color, i) =>
          (fan += `<path d="M119 125L233 ${53 + i * 34}" stroke="${color}" stroke-width="12"/>`)
      );
      return (
        c.base() +
        c.line('beam', 'M15 132H111', {
          'stroke-dasharray': 260,
          'stroke-width': 4,
        }) +
        c.group('spectrum', fan, {
          mask: c.alpha(),
          style: 'transform-origin:119px 125px',
        }) +
        c.line('beam', 'M76 183L127 67L183 183Z', { 'stroke-dasharray': 400 })
      );
    }
  ),
  m(
    'espiral-infinita',
    'Espiral infinita',
    'unrealengine',
    'Setores da arte espiralam em profundidades diferentes antes de se encaixarem.',
    'vórtice segmentado + escala radial',
    c => {
      c.k('core', '0%,8%,95%,100%{opacity:1}19%,84%{opacity:0}');
      c.k(
        'wedge',
        '0%,11%,94%,100%{opacity:0;transform:none}38%{opacity:.85;transform:rotate(var(--turn)) scale(.28)}65%{opacity:1;transform:rotate(calc(var(--turn)*-0.5)) scale(.76)}85%{opacity:1;transform:none}'
      );
      let out = c.base();
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4,
          b = a + Math.PI / 4;
        out += c.copy('wedge', {
          'clip-path': c.clip(
            `<path d="M128 128L${128 + 190 * Math.cos(a)} ${128 + 190 * Math.sin(a)}A190 190 0 0 1 ${128 + 190 * Math.cos(b)} ${128 + 190 * Math.sin(b)}Z"/>`
          ),
          style: `--turn:${120 + i * 25}deg;--sk-delay:${i * 0.009}`,
        });
      }
      return out;
    }
  ),
];
