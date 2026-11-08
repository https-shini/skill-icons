import { define } from './motion-kit.mjs';
const m = (id, title, icon, concept, mechanism, compose) =>
  define(
    {
      id,
      title,
      icon,
      concept,
      mechanism,
      category: 'cinema',
      duration: 7.8,
      cost: 'media',
    },
    compose
  );
export const CINEMA_MODELS = [
  m(
    'foco-iris',
    'Foco de íris',
    'photoshop',
    'Marcas de foco procuram nitidez enquanto uma abertura circular fecha e abre.',
    'autofoco + diafragma por máscara circular',
    c => {
      c.k(
        'core',
        '0%,10%,95%,100%{filter:none;transform:none}28%{filter:blur(2px);transform:scale(1.08)}43%{filter:blur(0);transform:scale(.95)}'
      );
      c.k(
        'focus',
        '0%,15%,94%,100%{opacity:0;transform:scale(1.15)}38%{opacity:.9;transform:scale(.72)}68%{opacity:.7;transform:scale(.85)}'
      );
      c.k(
        'iris',
        '0%,18%,94%,100%{opacity:0;stroke-width:0}51%{opacity:.95;stroke-width:92}72%{opacity:.6;stroke-width:5}'
      );
      return (
        c.base() +
        c.line(
          'focus',
          'M44 76V44H76M180 44H212V76M212 180V212H180M76 212H44V180M117 128H139M128 117V139',
          { 'stroke-width': 2 }
        ) +
        c.ring('iris', 129, { stroke: 'var(--sk-paper)' })
      );
    }
  ),
  m(
    'travelling',
    'Travelling de câmera',
    'vercel',
    'A câmera avança entre trilhos de perspectiva e apresenta o triângulo no horizonte.',
    'dolly sobre trilhos + ponto de fuga',
    c => {
      c.k(
        'core',
        '0%,10%,95%,100%{transform:none}28%{transform:translateY(-25px) scale(.25)}65%{transform:translateY(8px) scale(1.08)}82%{transform:none}'
      );
      c.k(
        'rails',
        '0%,16%,93%,100%{opacity:0;transform:translateY(-12px)}33%,70%{opacity:.6;transform:translateY(15px)}'
      );
      c.k(
        'ties',
        '0%,18%,93%,100%{opacity:0;transform:translateY(-10px) scale(.6)}39%{opacity:.8;transform:translateY(34px) scale(1.15)}75%{opacity:0;transform:translateY(70px) scale(1.3)}'
      );
      return (
        c.line('rails', 'M128 106L15 256M128 106L241 256M22 145H234', {
          'stroke-width': 1.5,
        }) +
        c.line('ties', 'M107 136H149M85 164H171M55 203H201M22 244H234') +
        c.base()
      );
    }
  ),
  m(
    'claquete',
    'Claquete de estreia',
    'premiere',
    'A haste articulada fecha a claquete e libera uma transição diagonal.',
    'claquete com dobradiça + wipe diagonal',
    c => {
      c.k(
        'core',
        '0%,10%,95%,100%{transform:none}30%,68%{transform:translateY(17px) scale(.76)}'
      );
      c.k('board', '0%,15%,93%,100%{opacity:0}28%,78%{opacity:.9}');
      c.k(
        'clapper',
        '0%,15%,93%,100%{opacity:0;transform:rotate(-28deg)}28%{opacity:1;transform:rotate(-28deg)}42%,76%{opacity:1;transform:rotate(0)}'
      );
      c.k(
        'wipe',
        '0%,41%,90%,100%{opacity:0;transform:translateX(-250px)}51%{opacity:.7;transform:translateX(0)}70%{opacity:0;transform:translateX(250px)}'
      );
      return (
        c.base() +
        c.shape('rect', 'board', {
          x: 37,
          y: 58,
          width: 182,
          height: 18,
          rx: 3,
          fill: 'var(--sk-paper)',
          stroke: 'var(--sk-accent)',
        }) +
        c.group(
          'clapper',
          '<path d="M37 57H219V39H37Z" fill="var(--sk-paper)" stroke="var(--sk-accent)"/><path d="M50 40L65 56M83 40L98 56M116 40L131 56M149 40L164 56M182 40L197 56" stroke="var(--sk-accent)" stroke-width="8"/>',
          { style: 'transform-origin:37px 57px' }
        ) +
        c.shape('path', 'wipe', {
          d: 'M30 20H110L226 236H146Z',
          fill: '#fff',
          mask: c.alpha(),
        })
      );
    }
  ),
  m(
    'longa-exposicao',
    'Longa exposição',
    'angular',
    'Traços luminosos registram caminhos orbitais enquanto a peça mantém o centro da cena.',
    'rastros fotográficos + exposição acumulada',
    c => {
      c.k(
        'core',
        '0%,10%,95%,100%{transform:none}38%,69%{transform:scale(.8)}'
      );
      c.k(
        'exposure',
        '0%,15%,94%,100%{opacity:0;stroke-dashoffset:700}50%{opacity:.85;stroke-dashoffset:250}78%{opacity:0;stroke-dashoffset:0}',
        'linear'
      );
      c.k('flash', '0%,68%,86%,100%{opacity:0}73%{opacity:.7}');
      return (
        c.base() +
        c.line(
          'exposure',
          'M32 208C-32 113 112-18 207 48C291 108 174 274 71 210C6 169 92 41 185 92',
          {
            'stroke-dasharray': '150 600',
            'stroke-width': 4,
            stroke: '#fda4af',
            filter: c.filter('glow'),
          }
        ) +
        c.line(
          'exposure',
          'M31 82C109-24 277 118 214 203C158 278 6 173 73 79',
          {
            'stroke-dasharray': '90 650',
            'stroke-width': 2,
            stroke: '#fbbf24',
            style: '--sk-delay:.04',
          }
        ) +
        c.ring('flash', 101, { 'stroke-width': 2 })
      );
    }
  ),
  m(
    'holofote',
    'Holofote de palco',
    'heroku',
    'Um cone de luz varre a cena e ilumina apenas a parte da arte que atravessa.',
    'cone rotativo + iluminação alfa',
    c => {
      c.k('core', '0%,10%,95%,100%{opacity:1}27%,77%{opacity:.3}');
      c.k(
        'light',
        '0%,16%,94%,100%{opacity:0;transform:rotate(-39deg)}29%{opacity:.8;transform:rotate(-30deg)}70%{opacity:.8;transform:rotate(30deg)}83%{opacity:0;transform:rotate(39deg)}'
      );
      c.k('lamp', '0%,18%,92%,100%{opacity:0}31%,76%{opacity:.9}');
      const beam = '<path d="M128 8L32 243H224Z" fill="#fef3c7"/>';
      return (
        c.base() +
        c.group('light', beam, {
          mask: c.alpha(),
          style: 'transform-origin:128px 8px',
        }) +
        c.shape('path', 'lamp', {
          d: 'M116 11H140L147 28H109Z',
          fill: 'var(--sk-accent)',
        })
      );
    }
  ),
  m(
    'brilho-vidro',
    'Brilho de vidro',
    'apple',
    'Uma lâmina de reflexo percorre o vidro e deixa dois pontos especulares.',
    'reflexo especular + lâmina de vidro',
    c => {
      c.k(
        'core',
        '0%,10%,95%,100%{filter:none}50%{filter:brightness(1.22) saturate(.85)}'
      );
      c.k(
        'glass',
        '0%,17%,94%,100%{opacity:0;transform:translateX(-210px)}33%{opacity:.9;transform:translateX(-65px)}69%{opacity:.6;transform:translateX(125px)}83%{opacity:0;transform:translateX(210px)}'
      );
      c.k(
        'glint',
        '0%,32%,72%,100%{opacity:0;transform:scale(.1) rotate(0)}48%{opacity:.9;transform:scale(1) rotate(45deg)}'
      );
      return (
        c.base() +
        c.group(
          'glass',
          '<path d="M48 0H72L208 256H184Z" fill="#fff" fill-opacity=".7"/><path d="M82 0H89L225 256H218Z" fill="#fff" fill-opacity=".35"/>',
          { mask: c.alpha() }
        ) +
        c.line('glint', 'M179 51V73M168 62H190M63 183V195M57 189H69', {
          'stroke-width': 2,
        })
      );
    }
  ),
  m(
    'rebobinar-fita',
    'Rebobinar a fita',
    'spotify',
    'Dois carretéis rebobinam uma fita e recolocam o símbolo na posição de reprodução.',
    'carretéis contrarrotativos + transporte de fita',
    c => {
      c.k(
        'core',
        '0%,10%,95%,100%{transform:none}34%,69%{transform:translateY(43px) scale(.48)}'
      );
      c.k(
        'deck',
        '0%,15%,94%,100%{opacity:0;transform:scaleY(.2)}32%,76%{opacity:.9;transform:none}'
      );
      c.k(
        'reel',
        '0%,18%,93%,100%{opacity:0;transform:rotate(0deg)}36%{opacity:1;transform:rotate(calc(var(--angle)*.2))}76%{opacity:1;transform:rotate(var(--angle))}',
        'linear'
      );
      c.k(
        'tape',
        '0%,23%,91%,100%{opacity:0;stroke-dashoffset:100}39%,76%{opacity:.8;stroke-dashoffset:0}',
        'linear'
      );
      const reel = (x, angle) =>
        c.group(
          'reel',
          `<circle cx="${x}" cy="98" r="30" fill="none" stroke="var(--sk-accent)" stroke-width="3"/><path d="M${x - 23} 98H${x + 23}M${x} 75V121" stroke="var(--sk-accent)" stroke-width="3"/>`,
          { style: `transform-origin:${x}px 98px;--angle:${angle}deg` }
        );
      return (
        c.shape('rect', 'deck', {
          x: 28,
          y: 52,
          width: 200,
          height: 146,
          rx: 18,
          fill: 'var(--sk-paper)',
          stroke: 'var(--sk-accent)',
        }) +
        c.line('tape', 'M79 98V153H177V98', { 'stroke-dasharray': '5 5' }) +
        reel(79, 360) +
        reel(177, -360) +
        c.base()
      );
    }
  ),
  m(
    'dupla-exposicao',
    'Dupla exposição',
    'instagram',
    'Uma paisagem noturna dissolve-se dentro da silhueta sem perder a fotografia original.',
    'paisagem mascarada + dissolução fotográfica',
    c => {
      c.k('core', '0%,10%,95%,100%{opacity:1}38%,69%{opacity:.35}');
      c.k(
        'landscape',
        '0%,18%,93%,100%{opacity:0;transform:translateY(24px)}40%,70%{opacity:.9;transform:translateY(-8px)}'
      );
      c.k(
        'moon',
        '0%,25%,92%,100%{opacity:0;transform:translateY(40px)}48%,73%{opacity:1;transform:none}'
      );
      return (
        c.base() +
        c.tag(
          'g',
          { mask: c.alpha() },
          c.group(
            'landscape',
            '<path d="M0 207L62 87L111 164L170 69L256 192V256H0Z" fill="#818cf8"/><path d="M0 238L98 157L151 219L205 143L256 212V256H0Z" fill="#312e81"/>'
          ) +
            c.shape('circle', 'moon', {
              cx: 175,
              cy: 66,
              r: 25,
              fill: '#fef3c7',
            })
        )
      );
    }
  ),
];
