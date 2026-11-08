import { define } from './motion-kit.mjs';
const m = (id, title, icon, concept, mechanism, compose) =>
  define(
    {
      id,
      title,
      icon,
      concept,
      mechanism,
      category: 'tecnologia',
      duration: 8,
      cost: 'media',
    },
    compose
  );
export const TECHNOLOGY_MODELS = [
  m(
    'reator-atomico',
    'Reator atômico',
    'react',
    'Três orbitais giram em planos independentes, liberando elétrons do núcleo.',
    'orbitais articulados + emissão nuclear',
    c => {
      c.k('core', '0%,10%,95%,100%{opacity:1}20%,84%{opacity:0}');
      c.k(
        'atom',
        '0%,12%,94%,100%{opacity:0;transform:none}30%{opacity:1;transform:rotate(calc(var(--a)*.2)) scale(.9)}76%{opacity:1;transform:rotate(var(--a)) scale(.9)}84%{opacity:1;transform:none}'
      );
      c.k(
        'electron',
        '0%,18%,93%,100%{opacity:0;transform:rotate(0deg)}35%{opacity:1;transform:rotate(40deg)}77%{opacity:1;transform:rotate(330deg)}',
        'linear'
      );
      // Os orbitais já presentes na marca são separados por ordem de pintura.
      return (
        c.base() +
        c.layers('atom', i => ({
          style: `--a:${i % 2 ? -90 : 90}deg;--sk-delay:${i * 0.01}`,
        })) +
        c.group(
          'electron',
          '<circle cx="214" cy="128" r="4" fill="#61dafb"/><circle cx="72" cy="67" r="3" fill="#61dafb"/>'
        )
      );
    }
  ),
  m(
    'serpentes-entrelacadas',
    'Serpentes entrelaçadas',
    'python',
    'As duas serpentes se soltam, perseguem uma à outra e voltam ao encaixe.',
    'segmentos originais em perseguição complementar',
    c => {
      c.k('core', '0%,8%,95%,100%{opacity:1}18%,84%{opacity:0}');
      c.k(
        'snake',
        '0%,11%,94%,100%{opacity:0;transform:none}35%{opacity:1;transform:translate(var(--x),var(--y)) rotate(var(--a))}61%{opacity:1;transform:translate(calc(var(--x)*-1),calc(var(--y)*-1)) rotate(calc(var(--a)*-1))}84%{opacity:1;transform:none}'
      );
      return (
        c.base() +
        c.layers('snake', i => ({
          style: `--x:${i % 2 ? 18 : -18}px;--y:${i % 2 ? -13 : 13}px;--a:${i % 2 ? 14 : -14}deg`,
        }))
      );
    }
  ),
  m(
    'carga-containers',
    'Carga de contêineres',
    'docker',
    'A baleia sustenta o convés enquanto um guindaste posiciona as caixas em sequência.',
    'guindaste + caixas recortadas sobre convés fixo',
    c => {
      c.k('core', '0%,8%,95%,100%{opacity:1}18%,84%{opacity:0}');
      c.k('hull', '0%,11%,94%,100%{opacity:0}23%,85%{opacity:1}');
      c.k(
        'cargo',
        '0%,11%,94%,100%{opacity:0;transform:translateY(-80px)}37%,85%{opacity:1;transform:none}'
      );
      c.k(
        'crane',
        '0%,15%,92%,100%{opacity:0;transform:translateX(-30px)}27%{opacity:.7;transform:translateX(-30px)}68%{opacity:.7;transform:translateX(45px)}'
      );
      let out =
        c.base() +
        c.copy('hull', {
          'clip-path': c.clip(
            '<path d="M0 0H256V256H0Z M40 49H185V136H40Z" fill-rule="evenodd" clip-rule="evenodd"/>'
          ),
        }) +
        c.line('crane', 'M85 12V31H170V66M162 66Q170 78 178 66', {
          'stroke-width': 2,
        });
      for (let row = 0; row < 3; row++)
        for (let col = 0; col < 5; col++)
          out += c.part('cargo', 40 + col * 29, 49 + row * 29, 29, 29, {
            style: `--sk-delay:${(2 - row) * 0.06 + col * 0.012}`,
          });
      return out;
    }
  ),
  m(
    'historico-commits',
    'Histórico de commits',
    'git',
    'A marca abre um histórico com ramificação, pacotes e união de branches.',
    'grafo de commits + bifurcação + merge',
    c => {
      c.k(
        'core',
        '0%,10%,95%,100%{transform:none}32%,76%{transform:translate(-61px,-64px) scale(.3)}'
      );
      c.k(
        'branch',
        '0%,19%,93%,100%{opacity:0;stroke-dashoffset:420}59%,80%{opacity:.85;stroke-dashoffset:0}'
      );
      c.k(
        'commit',
        '0%,22%,93%,100%{opacity:0;transform:scale(.1)}40%,80%{opacity:1;transform:scale(1)}'
      );
      c.k(
        'packet',
        '0%,34%,90%,100%{opacity:0;transform:translate(92px,79px)}48%{opacity:1;transform:translate(166px,120px)}66%{opacity:1;transform:translate(92px,194px)}'
      );
      return (
        c.base() +
        c.line('branch', 'M92 77V217M92 94Q166 94 166 139V160Q166 198 92 198', {
          'stroke-dasharray': 420,
          'stroke-width': 4,
        }) +
        [
          [92, 110],
          [92, 154],
          [92, 198],
          [166, 139],
        ]
          .map(([x, y], i) =>
            c.shape('circle', 'commit', {
              cx: x,
              cy: y,
              r: 7,
              fill: 'var(--sk-paper)',
              stroke: '#fb923c',
              'stroke-width': 3,
              style: `transform-origin:${x}px ${y}px;--sk-delay:${i * 0.04}`,
            })
          )
          .join('') +
        c.shape('circle', 'packet', { cx: 0, cy: 0, r: 4, fill: '#fde68a' })
      );
    }
  ),
  m(
    'chuva-contribuicoes',
    'Chuva de contribuições',
    'github',
    'Uma grade de contribuições acende em ondas e o Octocat espreita por trás dela.',
    'matriz de contribuições + aparição do mascote',
    c => {
      c.k(
        'core',
        '0%,10%,95%,100%{transform:none}33%,69%{transform:translateY(-38px) scale(.65)}'
      );
      c.k(
        'cell',
        '0%,17%,94%,100%{opacity:0;transform:translateY(-50px)}35%{opacity:.8;transform:none}67%{opacity:.3;transform:none}83%{opacity:0;transform:translateY(20px)}'
      );
      let out = c.base();
      for (let row = 0; row < 4; row++)
        for (let col = 0; col < 9; col++)
          out += c.shape('rect', 'cell', {
            x: 29 + col * 23,
            y: 135 + row * 23,
            width: 17,
            height: 17,
            rx: 3,
            fill: ['#22c55e', '#86efac', '#15803d'][(row + col) % 3],
            style: `--sk-delay:${((col * 3 + row) % 11) * 0.012}`,
          });
      return out;
    }
  ),
  m(
    'compilacao-tipos',
    'Compilação de tipos',
    'typescript',
    'Tokens entram em um editor, passam pela validação e dão lugar ao resultado tipado.',
    'tokens de código + compilação + confirmação',
    c => {
      c.k(
        'core',
        '0%,10%,95%,100%{transform:none}30%,73%{transform:translate(58px,37px) scale(.38)}'
      );
      c.k(
        'editor',
        '0%,16%,94%,100%{opacity:0;transform:scale(.75)}32%,78%{opacity:.9;transform:none}'
      );
      c.k(
        'token',
        '0%,22%,93%,100%{opacity:0;stroke-dashoffset:130}48%,76%{opacity:.9;stroke-dashoffset:0}'
      );
      c.k(
        'check',
        '0%,57%,93%,100%{opacity:0;stroke-dashoffset:60}72%,81%{opacity:1;stroke-dashoffset:0}'
      );
      return (
        c.group(
          'editor',
          '<rect x="25" y="42" width="206" height="172" rx="12" fill="var(--sk-paper)" stroke="var(--sk-accent)"/><path d="M25 68H231" stroke="var(--sk-accent)"/><circle cx="40" cy="55" r="3" fill="#fb7185"/><circle cx="51" cy="55" r="3" fill="#fbbf24"/>'
        ) +
        c.line(
          'token',
          'M43 90H73M84 90H135M43 108H59M70 108H146M43 126H106M43 144H79M90 144H126',
          { 'stroke-dasharray': 130, 'stroke-width': 5, stroke: '#93c5fd' }
        ) +
        c.line('check', 'M51 178L64 191L89 164', {
          'stroke-dasharray': 60,
          'stroke-width': 5,
          stroke: '#86efac',
        }) +
        c.base()
      );
    }
  ),
  m(
    'fila-eventos',
    'Fila de eventos',
    'nodejs',
    'Mensagens deixam uma fila, percorrem o laço de eventos e retornam como resultados.',
    'fila FIFO + event loop + passagem de pacote',
    c => {
      c.k(
        'core',
        '0%,10%,95%,100%{transform:none}34%,73%{transform:translateX(29px) scale(.55)}'
      );
      c.k(
        'queue',
        '0%,17%,93%,100%{opacity:0;transform:translateY(-12px)}34%,78%{opacity:.8;transform:none}'
      );
      c.k(
        'loop',
        '0%,22%,92%,100%{opacity:0;stroke-dashoffset:500}52%,78%{opacity:.75;stroke-dashoffset:0}'
      );
      c.k(
        'message',
        '0%,28%,94%,100%{opacity:0;transform:translate(48px,62px)}39%{opacity:1;transform:translate(48px,155px)}54%{opacity:1;transform:translate(170px,202px)}70%{opacity:1;transform:translate(216px,110px)}82%{opacity:0;transform:translate(164px,54px)}',
        'linear'
      );
      return (
        c.base() +
        c.group(
          'queue',
          [0, 1, 2, 3]
            .map(
              i =>
                `<rect x="28" y="${39 + i * 29}" width="39" height="21" rx="4" fill="none" stroke="var(--sk-accent)"/>`
            )
            .join('')
        ) +
        c.line('loop', 'M48 152Q84 229 172 207Q244 181 217 99Q202 50 161 53', {
          'stroke-dasharray': 500,
          'stroke-width': 2,
        }) +
        c.shape('rect', 'message', {
          x: -5,
          y: -5,
          width: 10,
          height: 10,
          rx: 3,
          fill: '#86efac',
        })
      );
    }
  ),
  m(
    'orquestracao-pods',
    'Orquestração de pods',
    'kubernetes',
    'O scheduler distribui sete pods e reconecta a rede ao redor da roda.',
    'fan-out de implantação + rede de sete pods',
    c => {
      c.k(
        'core',
        '0%,10%,95%,100%{transform:none}33%,74%{transform:scale(.46) rotate(26deg)}'
      );
      c.k(
        'network',
        '0%,19%,93%,100%{opacity:0;stroke-dashoffset:110}47%,78%{opacity:.6;stroke-dashoffset:0}'
      );
      c.k(
        'pod',
        '0%,20%,94%,100%{opacity:0;transform:translate(var(--x),var(--y)) scale(.1)}44%,78%{opacity:1;transform:none}'
      );
      let out = '';
      for (let i = 0; i < 7; i++) {
        const a = -Math.PI / 2 + (i * Math.PI * 2) / 7,
          x = 128 + 89 * Math.cos(a),
          y = 128 + 89 * Math.sin(a);
        out +=
          c.line('network', `M128 128L${x} ${y}`, {
            'stroke-dasharray': 110,
            style: `--sk-delay:${i * 0.018}`,
          }) +
          c.shape('path', 'pod', {
            d: `M${x} ${y - 13}l12 7v13l-12 7-12-7v-13Z`,
            fill: 'var(--sk-paper)',
            stroke: '#93c5fd',
            'stroke-width': 2,
            style: `--x:${128 - x}px;--y:${128 - y}px;transform-origin:${x}px ${y}px;--sk-delay:${i * 0.018}`,
          });
      }
      return out + c.base();
    }
  ),
];
