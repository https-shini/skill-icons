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
      duration: 7.8,
      cost: 'media',
    },
    compose
  );
export const ARSENAL_CRAFT_MODELS = [
  m(
    'mysql-mergulho',
    'MySQL · salto do golfinho',
    'mysql',
    'O golfinho arqueia o corpo em um salto, cruza a superfície e deixa uma coroa de gotas.',
    'arco balístico do golfinho + entrada na água + gotas tangenciais',
    c => {
      c.k(
        'core',
        '0%,3%,95%,100%{transform:none}19%{transform:translate(-15px,13px) rotate(-14deg) scale(.78)}39%{transform:translate(7px,-28px) rotate(18deg) scale(.8)}61%{transform:translate(17px,13px) rotate(27deg) scale(.76)}83%{transform:none}'
      );
      c.k(
        'surface',
        '0%,7%,93%,100%{opacity:0;stroke-dashoffset:240}27%,76%{opacity:.55;stroke-dashoffset:0}'
      );
      c.k(
        'splash',
        '0%,52%,91%,100%{opacity:0;transform:translate(0,0) scale(.3)}63%{opacity:.9;transform:translate(var(--x),var(--y)) scale(1)}82%{opacity:0;transform:translate(calc(var(--x)*1.5),16px) scale(.4)}'
      );
      return (
        c.line('surface', 'M17 207Q43 198 69 207T121 207T173 207T239 207', {
          'stroke-dasharray': 240,
          stroke: '#7dd3fc',
        }) +
        c.base() +
        [-55, -30, -13, 15, 34, 56]
          .map((x, i) =>
            c.shape('path', 'splash', {
              d: 'M145 197Q139 187 145 184Q151 187 145 197Z',
              fill: '#7dd3fc',
              style: `--x:${x}px;--y:${-27 - (i % 3) * 13}px;transform-origin:145px 195px;--sk-delay:${i * 0.008}`,
            })
          )
          .join('')
      );
    }
  ),
  m(
    'oracle-transacao',
    'Oracle · transação confirmada',
    'oracle',
    'Páginas de dados giram no log circular, convergem em um commit e devolvem a assinatura Oracle.',
    'log circular segmentado + páginas de redo + commit atômico',
    c => {
      c.k(
        'core',
        '0%,3%,95%,100%{transform:none}24%{transform:translateY(-29px) scale(.8)}56%,75%{transform:translateY(-29px) scale(.8)}'
      );
      c.k(
        'log',
        '0%,7%,93%,100%{opacity:0;transform:rotate(-80deg) scale(.4)}26%{opacity:.7;transform:rotate(0deg) scale(1)}68%{opacity:.7;transform:rotate(170deg) scale(1)}'
      );
      c.k(
        'page',
        '0%,13%,92%,100%{opacity:0;transform:translate(var(--x),var(--y)) rotate(var(--a)) scale(.5)}35%{opacity:.9;transform:translate(var(--x),var(--y)) rotate(var(--a)) scale(1)}64%{opacity:.9;transform:translate(0,0) rotate(0deg) scale(.8)}81%{opacity:0;transform:none}'
      );
      c.k(
        'commit',
        '0%,58%,91%,100%{opacity:0;stroke-dashoffset:58}75%,83%{opacity:1;stroke-dashoffset:0}'
      );
      return (
        c.ring('log', 91, {
          'stroke-dasharray': '34 10',
          'stroke-width': 2,
          stroke: '#fecaca',
        }) +
        [-1, 0, 1]
          .map((side, i) =>
            c.group(
              'page',
              '<rect x="113" y="158" width="30" height="35" rx="3" fill="var(--sk-paper)" stroke="#fff" stroke-width="2"/><path d="M119 167H137M119 175H133" stroke="#fff" stroke-width="2"/>',
              {
                style: `--x:${side * 50}px;--y:${Math.abs(side) * -4}px;--a:${side * 17}deg;transform-origin:128px 175px;--sk-delay:${i * 0.02}`,
              }
            )
          )
          .join('') +
        c.base() +
        c.line('commit', 'M112 176L124 188L148 161', {
          'stroke-dasharray': 58,
          stroke: '#86efac',
          'stroke-width': 4,
        })
      );
    }
  ),
  m(
    'obsidian-cristal',
    'Obsidian · cristal de conhecimento',
    'obsidian',
    'Veios percorrem as faces do cristal enquanto três lascas se abrem e revelam conexões de conhecimento.',
    'faces minerais + veios luminosos + ligações de notas',
    c => {
      c.k('core', '0%,3%,95%,100%{opacity:1}13%,83%{opacity:0}');
      c.k(
        'facet',
        '0%,5%,94%,100%{opacity:0;transform:none}27%{opacity:1;transform:translate(var(--x),var(--y)) skewY(var(--a)) scale(.92)}58%{opacity:1;transform:translate(calc(var(--x)*.5),calc(var(--y)*-.6)) skewY(calc(var(--a)*-.4)) scale(.96)}81%{opacity:1;transform:none}'
      );
      c.k(
        'vein',
        '0%,10%,91%,100%{opacity:0;stroke-dashoffset:390}38%{opacity:.95;stroke-dashoffset:130}76%{opacity:0;stroke-dashoffset:-170}',
        'linear'
      );
      c.k(
        'notes',
        '0%,25%,92%,100%{opacity:0;transform:scale(.1)}49%,72%{opacity:.7;transform:scale(1)}'
      );
      const parts = [
        ['32,32 136,24 113,168 27,227', -12, -7, -6],
        ['136,24 232,34 230,226 113,168', 12, -4, 6],
        ['27,227 113,168 230,226 128,256', 0, 14, 0],
      ];
      return (
        c.base() +
        parts
          .map(([points, x, y, a]) =>
            c.copy('facet', {
              'clip-path': c.clip(`<polygon points="${points}"/>`),
              style: `--x:${x}px;--y:${y}px;--a:${a}deg`,
            })
          )
          .join('') +
        c.line(
          'vein',
          'M140 31L105 113L128 164L175 198M105 113L72 184M128 164L112 224',
          {
            'stroke-dasharray': '52 390',
            'stroke-width': 3,
            stroke: '#ddd6fe',
            filter: c.filter('glow'),
          }
        ) +
        c.group(
          'notes',
          '<path d="M29 105L47 132L28 162M222 91L209 126L230 153" stroke="#a78bfa" fill="none"/><circle cx="29" cy="105" r="3" fill="#c4b5fd"/><circle cx="28" cy="162" r="3" fill="#c4b5fd"/><circle cx="222" cy="91" r="3" fill="#c4b5fd"/><circle cx="230" cy="153" r="3" fill="#c4b5fd"/>'
        )
      );
    }
  ),
  m(
    'notion-paginas',
    'Notion · páginas conectadas',
    'notion',
    'O bloco N abre um caderno de páginas, revela linhas e vira a folha superior antes de fechar.',
    'caderno articulado + folha virada + blocos de conteúdo',
    c => {
      c.k(
        'core',
        '0%,3%,95%,100%{transform:none}23%{transform:translate(-13px,-9px) rotate(-8deg) scale(.75)}51%{transform:translate(8px,-11px) rotate(5deg) scale(.78)}79%{transform:none}'
      );
      c.k(
        'pages',
        '0%,7%,93%,100%{opacity:0;transform:scale(.5) rotate(0deg)}26%{opacity:.9;transform:translate(var(--x),var(--y)) rotate(var(--a)) scale(.82)}67%{opacity:.9;transform:translate(calc(var(--x)*.5),var(--y)) rotate(calc(var(--a)*-.3)) scale(.88)}'
      );
      c.k(
        'turn',
        '0%,27%,92%,100%{opacity:0;transform:scaleX(.05) skewY(-20deg)}43%{opacity:.9;transform:scaleX(1) skewY(0deg)}69%{opacity:0;transform:scaleX(.05) skewY(20deg)}'
      );
      c.k(
        'blocks',
        '0%,19%,91%,100%{opacity:0;stroke-dashoffset:160}47%,72%{opacity:.8;stroke-dashoffset:0}'
      );
      return (
        [-1, 1]
          .map((s, i) =>
            c.group(
              'pages',
              '<rect x="51" y="44" width="155" height="174" rx="8" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>',
              {
                style: `--x:${s * 16}px;--y:${i * 12}px;--a:${s * 12}deg;--sk-delay:${i * 0.025}`,
              }
            )
          )
          .join('') +
        c.base() +
        c.shape('path', 'turn', {
          d: 'M168 55L204 91H168Z',
          fill: '#cbd5e1',
          stroke: '#64748b',
          'stroke-width': 1,
          style: 'transform-origin:168px 55px',
        }) +
        c.line('blocks', 'M59 202H96M59 213H125M175 205H210', {
          'stroke-dasharray': 160,
          'stroke-width': 3,
          stroke: '#64748b',
        })
      );
    }
  ),
  m(
    'linux-tux',
    'Linux · Tux em ação',
    'linux',
    'Tux bate os pés alternadamente, acompanha o ritmo com os olhos e pisca sem desmontar o corpo.',
    'pés originais em contraponto + pupilas + piscada',
    c => {
      c.k('core', '0%,3%,95%,100%{opacity:1}13%,84%{opacity:0}');
      c.k('body', '0%,5%,94%,100%{opacity:0}19%,84%{opacity:1}');
      c.k(
        'foot',
        '0%,5%,94%,100%{opacity:0;transform:none}23%{opacity:1;transform:rotate(var(--a)) translateY(-7px)}42%{opacity:1;transform:none}60%{opacity:1;transform:rotate(calc(var(--a)*-.7)) translateY(-4px)}82%{opacity:1;transform:none}'
      );
      c.k(
        'pupil',
        '0%,5%,94%,100%{opacity:0;transform:none}22%{opacity:1;transform:translateX(-2px)}38%{opacity:1;transform:translateX(2px)}48%,57%{opacity:1;transform:scaleY(1)}52%{opacity:1;transform:scaleY(.05)}72%{opacity:1;transform:translateX(-2px)}83%{opacity:1;transform:none}'
      );
      return (
        c.base() +
        c.layers('body', i =>
          [6, 7].includes(i)
            ? {
                class: 'sk-fx sk-foot',
                style: `--a:${i === 6 ? -13 : 13}deg;transform-origin:${i === 6 ? 179 : 77}px 190px;--sk-delay:${i === 6 ? 0 : 0.05}`,
              }
            : [4, 5].includes(i)
              ? {
                  class: 'sk-fx sk-pupil',
                  style: `transform-origin:${i === 4 ? 111 : 137}px 66px`,
                }
              : {}
        )
      );
    }
  ),
  m(
    'sass-caligrafia',
    'Sass · caligrafia em laço',
    'sass',
    'Uma pena percorre o laço do S e desenha o restante da assinatura com tinta que se alonga na saída.',
    'máscara curva de caligrafia + pena em Bézier + cauda de tinta',
    c => {
      c.k('core', '0%,3%,95%,100%{opacity:1}13%,82%{opacity:0}');
      c.k('script', '0%,5%,94%,100%{opacity:0}16%,83%{opacity:1}');
      c.k(
        'inkpath',
        '0%,9%{stroke-dashoffset:680}76%,100%{stroke-dashoffset:0}',
        'linear'
      );
      c.k(
        'pen',
        '0%,9%,88%,100%{opacity:0;transform:translate(0,0)}15%{opacity:1;transform:translate(0,0)}29%{opacity:1;transform:translate(-50px,22px)}43%{opacity:1;transform:translate(-9px,93px)}58%{opacity:1;transform:translate(65px,66px)}76%{opacity:0;transform:translate(125px,95px)}',
        'linear'
      );
      c.k(
        'tail',
        '0%,56%,93%,100%{opacity:0;stroke-dashoffset:160}78%{opacity:.9;stroke-dashoffset:0}'
      );
      const mask = c.mask(
        c.defShape('path', 'inkpath', {
          d: 'M152 75C106 28 13 107 70 137C127 161 85 211 50 185C27 162 106 124 114 168C133 196 138 120 146 151C153 179 164 137 174 154C184 172 219 160 227 186',
          fill: 'none',
          stroke: '#fff',
          'stroke-width': 72,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-dasharray': 680,
        })
      );
      return (
        c.base() +
        c.copy('script', { mask }) +
        c.shape('path', 'pen', {
          d: 'M146 64L156 69L149 82L142 78Z',
          fill: '#fce7f3',
        }) +
        c.line('tail', 'M111 207Q158 184 215 211', {
          'stroke-dasharray': 160,
          'stroke-width': 3,
          stroke: '#fce7f3',
        })
      );
    }
  ),
];
