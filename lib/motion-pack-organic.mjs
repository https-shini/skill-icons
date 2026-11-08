import { define } from './motion-kit.mjs';
const m = (id, title, icon, concept, mechanism, compose) =>
  define(
    {
      id,
      title,
      icon,
      concept,
      mechanism,
      category: 'organicos',
      duration: 8.2,
      cost: 'media',
    },
    compose
  );
export const ORGANIC_MODELS = [
  m(
    'lago-ondas',
    'Lago de ondas',
    'postgresql',
    'A arte toca a superfície, produz reflexo comprimido e ondas elípticas.',
    'reflexo vertical + propagação na superfície',
    c => {
      c.k(
        'core',
        '0%,10%,95%,100%{transform:none}37%{transform:translateY(13px) scale(.84)}60%{transform:translateY(-10px) scale(.84)}'
      );
      c.k(
        'reflection',
        '0%,20%,92%,100%{opacity:0;transform:translateY(180px) scale(.8,-.2)}37%,74%{opacity:.2;transform:translateY(170px) scale(.8,-.25)}'
      );
      c.k(
        'ripple',
        '0%,30%,93%,100%{opacity:0;transform:scale(.2)}42%{opacity:.7;transform:scale(.5)}78%{opacity:0;transform:scale(1.1)}'
      );
      return (
        c.copy('reflection') +
        c.base() +
        [0, 0.07, 0.14]
          .map(d =>
            c.shape('ellipse', 'ripple', {
              cx: 128,
              cy: 215,
              rx: 97,
              ry: 17,
              fill: 'none',
              stroke: 'var(--sk-accent)',
              'stroke-width': 2,
              style: `--sk-delay:${d};transform-origin:128px 215px`,
            })
          )
          .join('')
      );
    }
  ),
  m(
    'flor-petalas',
    'Flor de pétalas',
    'claude',
    'Os raios da estrela se abrem como pétalas e se recolhem ao centro.',
    'oito pétalas radiais + expansão floral',
    c => {
      c.k('core', '0%,8%,95%,100%{opacity:1}18%,84%{opacity:0}');
      c.k(
        'petal',
        '0%,11%,94%,100%{opacity:0;transform:none}36%,61%{opacity:1;transform:translate(var(--x),var(--y)) rotate(var(--rot)) scale(.85)}84%{opacity:1;transform:none}'
      );
      let out = c.base();
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4,
          b = a + Math.PI / 4;
        out += c.copy('petal', {
          'clip-path': c.clip(
            `<path d="M128 128L${128 + 190 * Math.cos(a)} ${128 + 190 * Math.sin(a)}L${128 + 190 * Math.cos(b)} ${128 + 190 * Math.sin(b)}Z"/>`
          ),
          style: `--x:${Math.cos(a + 0.39) * 20}px;--y:${Math.sin(a + 0.39) * 20}px;--rot:${i % 2 ? 12 : -12}deg;--sk-delay:${i * 0.012}`,
        });
      }
      return out;
    }
  ),
  m(
    'membrana-gel',
    'Membrana de gel',
    'bun',
    'Uma película elástica expande em torno da peça e transfere sua oscilação ao desenho.',
    'membrana orgânica + amortecimento volumétrico',
    c => {
      c.k(
        'core',
        '0%,10%,95%,100%{transform:none}33%{transform:scale(1.12,.82) skewX(5deg)}48%{transform:scale(.88,1.08) skewX(-4deg)}64%{transform:scale(1.04,.96)}80%{transform:none}'
      );
      c.k(
        'gel',
        '0%,15%,93%,100%{opacity:0;transform:scale(.65)}33%{opacity:.45;transform:scale(1.05,.85) rotate(12deg)}48%{opacity:.4;transform:scale(.87,1.07) rotate(-8deg)}76%{opacity:0;transform:scale(1.15)}'
      );
      return (
        c.shape('path', 'gel', {
          d: 'M35 104C20 38 101 12 145 31C209 21 247 85 222 137C245 207 164 245 119 222C46 245 11 170 35 104Z',
          fill: 'var(--sk-accent)',
          'fill-opacity': 0.2,
          stroke: 'var(--sk-accent)',
          'stroke-width': 3,
        }) + c.base()
      );
    }
  ),
  m(
    'guaxinim-vivo',
    'Guaxinim vivo',
    'bandit',
    'O Bandit olha para os lados, pisca duas vezes e ergue as sobrancelhas.',
    'olhar + pálpebras + sobrancelhas do Bandit',
    c => {
      c.k(
        'core',
        '0%,10%,95%,100%{transform:none}30%{transform:rotate(-4deg)}62%{transform:rotate(4deg)}'
      );
      c.k(
        'eyes',
        '0%,12%,94%,100%{opacity:0;transform:translateX(0)}29%{opacity:.9;transform:translateX(-3px)}61%{opacity:.9;transform:translateX(3px)}'
      );
      c.k(
        'blink',
        '0%,33%,41%,62%,70%,100%{opacity:0;transform:scaleY(.02)}36%,66%{opacity:1;transform:scaleY(1)}'
      );
      c.k(
        'brow',
        '0%,16%,92%,100%{opacity:0;transform:translateY(0)}35%,68%{opacity:.8;transform:translateY(-4px)}'
      );
      return c.tag(
        'g',
        { class: 'sk-core' },
        c.base({ class: 'sk-rest' }) +
          c.group(
            'eyes',
            '<circle cx="100" cy="110" r="3.5" fill="#171717"/><circle cx="158" cy="110" r="3.5" fill="#171717"/>'
          ) +
          c.group(
            'blink',
            '<ellipse cx="100" cy="110" rx="10" ry="7" fill="#484440"/><ellipse cx="158" cy="110" rx="10" ry="7" fill="#484440"/>',
            { style: 'transform-origin:128px 110px' }
          ) +
          c.line('brow', 'M89 96Q99 89 109 95M149 95Q159 89 169 96', {
            'stroke-width': 3,
            stroke: '#45413d',
          })
      );
    }
  ),
  m(
    'enxame-vagalumes',
    'Enxame de vagalumes',
    'mongodb',
    'Pontos luminosos percorrem arcos independentes e pousam ao redor da folha.',
    'enxame em trajetórias curvas + pouso',
    c => {
      c.k(
        'core',
        '0%,10%,95%,100%{transform:none}40%{transform:rotate(-5deg) scale(.88)}70%{transform:rotate(3deg) scale(.94)}'
      );
      c.k(
        'firefly',
        '0%,12%,95%,100%{opacity:0;transform:translate(var(--x),100px) scale(.2)}35%{opacity:.9;transform:translate(calc(var(--x)*-1),-44px) scale(1)}60%{opacity:.65;transform:translate(var(--x),var(--y)) scale(.7)}78%{opacity:0;transform:translate(0,-20px) scale(.1)}'
      );
      return (
        c.base() +
        c.tag(
          'g',
          { filter: c.filter('glow') },
          Array.from({ length: 12 }, (_, i) =>
            c.shape('circle', 'firefly', {
              cx: 128,
              cy: 128,
              r: 2 + (i % 3),
              fill: i % 2 ? '#a3e635' : '#fde68a',
              style: `--x:${Math.cos(i * 2.4) * 80}px;--y:${Math.sin(i * 2.4) * 70}px;--sk-delay:${i * 0.012}`,
            })
          ).join('')
        )
      );
    }
  ),
  m(
    'asas-borboleta',
    'Asas de borboleta',
    'vuejs',
    'As duas asas dobram sobre o eixo vertical e acompanham um voo em arco.',
    'asas articuladas + trajetória de voo',
    c => {
      c.k('core', '0%,8%,95%,100%{opacity:1}18%,84%{opacity:0}');
      c.k(
        'wing',
        '0%,11%,94%,100%{opacity:0;transform:none}28%{opacity:1;transform:translateY(-18px) scaleX(.32)}42%{opacity:1;transform:translateY(-25px) scaleX(1)}55%{opacity:1;transform:translateY(-19px) scaleX(.3)}69%{opacity:1;transform:translateY(-8px) scaleX(1)}84%{opacity:1;transform:none}'
      );
      c.k(
        'antenna',
        '0%,18%,91%,100%{opacity:0;transform:translateY(-18px)}37%,68%{opacity:.8;transform:translateY(-22px)}'
      );
      return (
        c.base() +
        c.part('wing', 0, 0, 128, 256) +
        c.part('wing', 128, 0, 128, 256, { style: '--sk-delay:.025' }) +
        c.line('antenna', 'M128 85Q108 52 99 66M128 85Q148 52 157 66')
      );
    }
  ),
  m(
    'vinha-crescimento',
    'Vinha em crescimento',
    'spring',
    'Duas vinhas sobem em volta do broto, desenrolam folhas e recuam.',
    'crescimento por caminho + abertura de folhas',
    c => {
      c.k(
        'core',
        '0%,10%,96%,100%{transform:none}40%,73%{transform:scale(.83)}'
      );
      c.k(
        'vine',
        '0%,15%,95%,100%{opacity:0;stroke-dashoffset:470}60%,78%{opacity:.8;stroke-dashoffset:0}'
      );
      c.k(
        'leaf',
        '0%,35%,93%,100%{opacity:0;transform:scale(.1)}60%,78%{opacity:.85;transform:scale(1)}'
      );
      return (
        c.base() +
        c.line(
          'vine',
          'M120 234C30 235 9 163 58 117C-2 58 78 10 124 31M136 234C226 235 247 163 198 117C258 58 178 10 132 31',
          { 'stroke-dasharray': 470, 'stroke-width': 3 }
        ) +
        [
          [48, 173, -30],
          [205, 173, 30],
          [56, 71, -55],
          [201, 71, 55],
        ]
          .map(([x, y, a], i) =>
            c.group(
              'leaf',
              `<path d="M0 0Q-22-29-35-14Q-33 9 0 0Z" fill="#86efac" transform="translate(${x} ${y}) rotate(${a})"/>`,
              {
                style: `transform-origin:${x}px ${y}px;--sk-delay:${i * 0.035}`,
              }
            )
          )
          .join('')
      );
    }
  ),
  m(
    'dupla-helice',
    'Dupla hélice',
    'anaconda',
    'Duas cadeias de pontos se cruzam com profundidade alternada e pontes móveis.',
    'hélice dupla + oclusão alternada',
    c => {
      c.k(
        'core',
        '0%,10%,95%,100%{opacity:1;transform:none}35%,73%{opacity:.45;transform:scale(.68)}'
      );
      c.k(
        'helix',
        '0%,15%,94%,100%{opacity:0;transform:translateX(0)}36%{opacity:.9;transform:translateX(var(--x))}67%{opacity:.9;transform:translateX(calc(var(--x)*-1))}'
      );
      let out = c.base();
      for (let i = 0; i < 9; i++) {
        const y = 38 + i * 22,
          x = Math.sin(i * 0.7) * 52;
        out += c.line('helix', `M${128 - x} ${y}H${128 + x}`, {
          'stroke-width': 1,
          style: `--x:0px;--sk-delay:${i * 0.009}`,
        });
        for (let side of [-1, 1])
          out += c.shape('circle', 'helix', {
            cx: 128 + side * x,
            cy: y,
            r: 4 + (i % 2),
            fill: side < 0 ? '#86efac' : '#7dd3fc',
            style: `--x:${side * 35}px;--sk-delay:${i * 0.009}`,
          });
      }
      return out;
    }
  ),
];
