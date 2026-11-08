import { define } from './motion-kit.mjs';
const m = (id, title, icon, concept, mechanism, compose) =>
  define(
    {
      id,
      title,
      icon,
      concept,
      mechanism,
      category: 'construcao',
      duration: 8.4,
      cost: 'media',
    },
    compose
  );
export const CONSTRUCTION_MODELS = [
  m(
    'montagem-voxel',
    'Montagem voxel',
    'godot',
    'Blocos separados ocupam posições em uma grade e recompõem a face.',
    'mosaico 4×4 + montagem espacial',
    c => {
      c.k('core', '0%,8%,95%,100%{opacity:1}18%,85%{opacity:0}');
      c.k(
        'block',
        '0%,11%,94%,100%{opacity:0;transform:none}29%{opacity:.8;transform:translate(var(--x),var(--y)) scale(.35) rotate(20deg)}65%,84%{opacity:1;transform:none}'
      );
      let out = c.base();
      for (let row = 0; row < 4; row++)
        for (let col = 0; col < 4; col++)
          out += c.part('block', col * 64, row * 64, 64, 64, {
            style: `--x:${(col - 1.5) * 23}px;--y:${(row - 1.5) * 23}px;--sk-delay:${(row + col) * 0.018}`,
          });
      return out;
    }
  ),
  m(
    'planta-tecnica',
    'Planta técnica',
    'autocad',
    'Cotas e eixos desenham a área de construção antes da materialização da peça.',
    'dimensionamento + contorno projetado',
    c => {
      c.k(
        'core',
        '0%,9%,96%,100%{opacity:1;transform:none}26%{opacity:.1;transform:translate(8px,-8px)}66%{opacity:1;transform:none}'
      );
      c.k(
        'draft',
        '0%,14%,93%,100%{opacity:0;stroke-dashoffset:900}40%,76%{opacity:.8;stroke-dashoffset:0}'
      );
      c.k(
        'ghost',
        '0%,19%,90%,100%{opacity:0;transform:translate(12px,-12px)}40%{opacity:.25;transform:translate(12px,-12px)}68%{opacity:0;transform:none}'
      );
      return (
        c.copy('ghost') +
        c.base() +
        c.line(
          'draft',
          'M34 24V232M222 24V232M24 34H232M24 222H232M38 18H218M38 14V22M218 14V22M238 38V218M234 38H242M234 218H242M28 128H228M128 28V228',
          { 'stroke-width': 1, 'stroke-dasharray': 900 }
        ) +
        c.shape(
          'text',
          'draft',
          {
            x: 115,
            y: 15,
            'font-size': 10,
            fill: 'var(--sk-accent)',
            stroke: 'none',
          },
          '180'
        )
      );
    }
  ),
  m(
    'domino-mosaico',
    'Dominó de placas',
    'windows',
    'Quatro placas tombam em cadeia e se assentam sobre o plano da janela.',
    'cadeia de dobradiças horizontais',
    c => {
      c.k('core', '0%,8%,96%,100%{opacity:1}17%,84%{opacity:0}');
      c.k(
        'tile',
        '0%,11%,95%,100%{opacity:0;transform:none}28%{opacity:1;transform:translateY(-27px) scaleY(.12) skewX(-22deg)}55%,84%{opacity:1;transform:none}'
      );
      return (
        c.base() +
        [
          [0, 0],
          [128, 0],
          [0, 128],
          [128, 128],
        ]
          .map(([x, y], i) =>
            c.part('tile', x, y, 128, 128, {
              style: `--sk-delay:${i * 0.045};transform-origin:${x + 64}px ${y + 128}px`,
            })
          )
          .join('')
      );
    }
  ),
  m(
    'gravacao-laser',
    'Gravação a laser',
    'lucide',
    'Uma cabeça ótica percorre linhas alternadas enquanto grava a silhueta.',
    'varredura serpentina + revelação por recorte',
    c => {
      c.k('core', '0%,8%,95%,100%{opacity:1}18%,78%{opacity:.12}');
      c.k(
        'reveal',
        '0%,16%{transform:translateY(-220px)}73%,100%{transform:translateY(0)}',
        'linear'
      );
      c.k('etched', '0%,14%,94%,100%{opacity:0}25%,85%{opacity:1}');
      c.k(
        'head',
        '0%,16%,88%,100%{opacity:0;transform:translate(34px,32px)}24%{opacity:1;transform:translate(220px,55px)}34%{opacity:1;transform:translate(34px,83px)}44%{opacity:1;transform:translate(220px,111px)}54%{opacity:1;transform:translate(34px,139px)}64%{opacity:1;transform:translate(220px,167px)}74%{opacity:1;transform:translate(34px,201px)}',
        'linear'
      );
      return (
        c.base() +
        c.copy('etched', {
          'clip-path': c.clip(
            c.defShape('rect', 'reveal', {
              x: 0,
              y: 0,
              width: 256,
              height: 256,
            })
          ),
        }) +
        c.group(
          'head',
          '<path d="M-10 0H10M0-10V10" stroke="#f87171" stroke-width="1.5"/><circle r="3" fill="#fff"/>',
          { filter: c.filter('glow') }
        )
      );
    }
  ),
  m(
    'costura-zipper',
    'Costura e zíper',
    'gitlab',
    'Duas metades se afastam e um cursor fecha a costura central dente a dente.',
    'fecho longitudinal + duas metades + cursor',
    c => {
      c.k('core', '0%,8%,96%,100%{opacity:1}18%,84%{opacity:0}');
      c.k(
        'left',
        '0%,11%,94%,100%{opacity:0;transform:none}30%{opacity:1;transform:translateX(-24px)}72%,85%{opacity:1;transform:none}'
      );
      c.k(
        'right',
        '0%,11%,94%,100%{opacity:0;transform:none}30%{opacity:1;transform:translateX(24px)}72%,85%{opacity:1;transform:none}'
      );
      c.k(
        'teeth',
        '0%,24%,92%,100%{opacity:0;stroke-dashoffset:220}72%{opacity:1;stroke-dashoffset:0}'
      );
      c.k(
        'cursor',
        '0%,24%,91%,100%{opacity:0;transform:translateY(-88px)}35%{opacity:1;transform:translateY(-70px)}74%{opacity:1;transform:translateY(84px)}'
      );
      return (
        c.base() +
        c.part('left', 0, 0, 128, 256) +
        c.part('right', 128, 0, 128, 256) +
        c.line('teeth', 'M124 35V221M132 35V221', {
          'stroke-dasharray': '3 4',
          'stroke-width': 3,
        }) +
        c.shape('rect', 'cursor', {
          x: 121,
          y: 119,
          width: 14,
          height: 20,
          rx: 4,
          fill: 'var(--sk-paper)',
          stroke: 'var(--sk-accent)',
          'stroke-width': 2,
        })
      );
    }
  ),
  m(
    'ordenacao-pixels',
    'Ordenação de pixels',
    'prettier',
    'Colunas da arte saem de ordem, percorrem alturas diferentes e se alinham.',
    'ordenação por colunas discretas',
    c => {
      c.k('core', '0%,8%,95%,100%{opacity:1}18%,84%{opacity:0}');
      c.k(
        'column',
        '0%,11%,94%,100%{opacity:0;transform:none}31%{opacity:1;transform:translateY(var(--y))}55%{opacity:1;transform:translateY(calc(var(--y)*-.4))}77%,85%{opacity:1;transform:none}',
        'steps(6,end)'
      );
      const heights = [-35, 20, -12, 40, -24, 8, -40, 29];
      return (
        c.base() +
        heights
          .map((y, i) =>
            c.part('column', i * 32, 0, 32, 256, {
              style: `--y:${y}px;--sk-delay:${i * 0.009}`,
            })
          )
          .join('')
      );
    }
  ),
  m(
    'tecido-cruzado',
    'Tecido cruzado',
    'tailwindcss',
    'Fios horizontais e verticais entrelaçam a silhueta com alternância sobre e sob.',
    'urdume/trama + mosaico entrelaçado',
    c => {
      c.k('core', '0%,8%,95%,100%{opacity:1}18%,84%{opacity:0}');
      c.k(
        'weft',
        '0%,11%,94%,100%{opacity:0;transform:translateX(-200px)}52%,84%{opacity:1;transform:none}'
      );
      c.k(
        'warp',
        '0%,11%,94%,100%{opacity:0;transform:translateY(200px)}60%,84%{opacity:1;transform:none}'
      );
      let out = c.base();
      for (let y = 0; y < 8; y++)
        for (let x = 0; x < 8; x++)
          out += c.part((x + y) % 2 ? 'weft' : 'warp', x * 32, y * 32, 32, 32, {
            style: `--sk-delay:${(x + y) * 0.008}`,
          });
      return out;
    }
  ),
  m(
    'impressora-camadas',
    'Impressora de camadas',
    'html',
    'Uma barra deposita camadas horizontais até completar o escudo.',
    'extrusão por camadas + cabeçote oscilante',
    c => {
      c.k('core', '0%,8%,96%,100%{opacity:1}18%,84%{opacity:.12}');
      c.k(
        'layer',
        '0%,14%,94%,100%{opacity:0;transform:translateY(16px)}29%,85%{opacity:1;transform:none}'
      );
      c.k(
        'nozzle',
        '0%,15%,92%,100%{opacity:0;transform:translateY(85px)}27%{opacity:1;transform:translateY(62px)}72%{opacity:1;transform:translateY(-85px)}',
        'linear'
      );
      c.k(
        'extruder',
        '0%,100%{transform:translateX(-22px)}50%{transform:translateX(22px)}',
        'linear'
      );
      return (
        c.base() +
        Array.from({ length: 10 }, (_, i) =>
          c.part('layer', 0, 230 - i * 22, 256, 22, {
            style: `--sk-delay:${i * 0.045}`,
          })
        ).join('') +
        c.group(
          'nozzle',
          '<path d="M30 120H226" stroke="var(--sk-accent)" stroke-width="2"/>' +
            c.shape('path', 'extruder', {
              d: 'M115 107H141V117L132 125H124L115 117Z',
              fill: 'var(--sk-accent)',
              style: 'opacity:1',
            })
        )
      );
    }
  ),
];
