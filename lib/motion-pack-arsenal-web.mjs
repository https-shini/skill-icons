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
      duration: 7.2,
      cost: 'media',
    },
    compose
  );
export const ARSENAL_WEB_MODELS = [
  m(
    'html-forja-escudo',
    'HTML · forja do escudo',
    'html',
    'O escudo é forjado entre tags de abertura e fechamento; suas duas faces recebem um golpe de luz.',
    'tags em oposição + forja biplanar + centelha de fechamento',
    c => {
      c.k('core', '0%,3%,95%,100%{opacity:1;transform:none}14%,81%{opacity:0}');
      c.k(
        'left',
        '0%,5%,94%,100%{opacity:0;transform:none}23%{opacity:1;transform:translate(-19px,-9px) skewY(-8deg)}43%{opacity:1;transform:translate(-3px,2px) skewY(3deg)}62%,82%{opacity:1;transform:none}'
      );
      c.k(
        'right',
        '0%,5%,94%,100%{opacity:0;transform:none}23%{opacity:1;transform:translate(19px,-9px) skewY(8deg)}43%{opacity:1;transform:translate(3px,2px) skewY(-3deg)}62%,82%{opacity:1;transform:none}'
      );
      c.k(
        'tags',
        '0%,7%,92%,100%{opacity:0;stroke-dashoffset:160}24%,72%{opacity:.85;stroke-dashoffset:0}'
      );
      c.k(
        'weld',
        '0%,42%,88%,100%{opacity:0;transform:scaleY(.1)}52%{opacity:.9;transform:scaleY(1)}78%{opacity:0;transform:scaleY(1.25)}'
      );
      return (
        c.base() +
        c.part('left', 0, 0, 128, 256) +
        c.part('right', 128, 0, 128, 256) +
        c.line(
          'tags',
          'M43 89L25 108L43 127M213 89L231 108L213 127M151 18L135 37',
          { 'stroke-dasharray': 160, 'stroke-width': 3, stroke: '#fff' }
        ) +
        c.line('weld', 'M128 39V210M121 206L128 216L135 206', {
          stroke: '#fde68a',
          'stroke-width': 3,
          filter: c.filter('glow'),
        })
      );
    }
  ),
  m(
    'css-cascata',
    'CSS · cascata de camadas',
    'css',
    'Três folhas de estilo deslizam em profundidade e a regra vencedora veste o escudo.',
    'folhas deslocadas + cascata diagonal + regra vencedora',
    c => {
      c.k(
        'core',
        '0%,3%,95%,100%{transform:none}22%{transform:translate(-14px,-12px) scale(.77)}53%{transform:translate(9px,-8px) scale(.82)}79%{transform:none}'
      );
      c.k(
        'sheet',
        '0%,6%,93%,100%{opacity:0;transform:translate(0,0) scale(.7)}24%{opacity:.6;transform:translate(var(--x),var(--y)) scale(.77)}56%{opacity:.75;transform:translate(calc(var(--x)*.4),calc(var(--y)*.4)) scale(.9)}80%{opacity:0;transform:none}'
      );
      c.k(
        'rule',
        '0%,20%,91%,100%{opacity:0;stroke-dashoffset:170}50%,72%{opacity:1;stroke-dashoffset:0}'
      );
      return (
        [-1, 1]
          .map((side, i) =>
            c.group(
              'sheet',
              '<path d="M60 43H196V190L128 215L60 190Z" fill="var(--sk-paper)" stroke="#7dd3fc" stroke-width="3"/><path d="M80 83H162M80 101H175M80 119H147" stroke="#7dd3fc" stroke-width="3"/>',
              {
                style: `--x:${side * 23}px;--y:${side * 16}px;--sk-delay:${i * 0.035}`,
              }
            )
          )
          .join('') +
        c.base() +
        c.line('rule', 'M49 206H102L118 222L147 193H207', {
          'stroke-dasharray': 170,
          'stroke-width': 4,
          stroke: '#bae6fd',
        })
      );
    }
  ),
  m(
    'javascript-promessas',
    'JavaScript · promessa resolvida',
    'javascript',
    'J e S se separam enquanto uma chamada sai da pilha, percorre uma microtarefa e resolve a promessa.',
    'glifos J/S + pilha LIFO + microtarefa resolvida',
    c => {
      c.k('core', '0%,3%,95%,100%{opacity:1}13%,83%{opacity:0}');
      c.k(
        'glyph',
        '0%,5%,94%,100%{opacity:0;transform:none}25%{opacity:1;transform:translate(var(--x),-17px) rotate(var(--a)) scale(.86)}53%{opacity:1;transform:translate(calc(var(--x)*-.4),-8px) rotate(0deg) scale(.86)}80%{opacity:1;transform:none}'
      );
      c.k(
        'stack',
        '0%,7%,91%,100%{opacity:0;transform:translateY(-18px)}22%,66%{opacity:.75;transform:none}'
      );
      c.k(
        'job',
        '0%,15%,89%,100%{opacity:0;transform:translate(54px,67px)}22%{opacity:1;transform:translate(54px,67px)}39%{opacity:1;transform:translate(205px,67px)}56%{opacity:1;transform:translate(205px,39px)}72%{opacity:0;transform:translate(128px,39px)}',
        'linear'
      );
      c.k(
        'resolve',
        '0%,60%,91%,100%{opacity:0;stroke-dashoffset:55}77%,84%{opacity:1;stroke-dashoffset:0}'
      );
      return (
        c.base() +
        c.part('glyph', 0, 0, 143, 256, { style: '--x:-12px;--a:-7deg' }) +
        c.part('glyph', 143, 0, 113, 256, { style: '--x:12px;--a:7deg' }) +
        c.group(
          'stack',
          '<path d="M38 47H72V58H38ZM38 66H72V77H38Z" fill="none" stroke="#323330" stroke-width="2"/><path d="M85 67H203V39H131" fill="none" stroke="#323330" stroke-dasharray="3 5"/>'
        ) +
        c.shape('rect', 'job', {
          x: -5,
          y: -5,
          width: 10,
          height: 10,
          rx: 3,
          fill: '#323330',
        }) +
        c.line('resolve', 'M112 39L123 50L145 27', {
          'stroke-dasharray': 55,
          'stroke-width': 4,
          stroke: '#323330',
        })
      );
    }
  ),
  m(
    'vscode-intellisense',
    'VS Code · lente de código',
    'vscode',
    'As faces azuis se abrem como uma lente; sugestões de código chegam e uma linha é aceita.',
    'faces originais articuladas + menu IntelliSense + cursor',
    c => {
      c.k('core', '0%,3%,95%,100%{opacity:1}13%,83%{opacity:0}');
      c.k(
        'panel',
        '0%,5%,94%,100%{opacity:0;transform:none}25%{opacity:1;transform:translate(var(--x),var(--y)) rotate(var(--a)) scale(.78)}57%{opacity:1;transform:translate(calc(var(--x)*.65),var(--y)) rotate(calc(var(--a)*-.3)) scale(.78)}81%{opacity:1;transform:none}'
      );
      c.k(
        'menu',
        '0%,17%,90%,100%{opacity:0;transform:translate(32px,18px) scale(.2)}36%,69%{opacity:.95;transform:none}'
      );
      c.k(
        'suggestion',
        '0%,27%,88%,100%{opacity:0;stroke-dashoffset:90}51%,73%{opacity:1;stroke-dashoffset:0}'
      );
      c.k(
        'cursor',
        '0%,40%,87%,100%{opacity:0;transform:translateY(0)}47%{opacity:1;transform:translateY(0)}62%{opacity:1;transform:translateY(16px)}74%{opacity:0;transform:translateY(16px)}'
      );
      return (
        c.base() +
        c.layers('panel', i => ({
          style: `--x:${i === 3 ? 18 : -13}px;--y:${i % 2 ? -7 : 7}px;--a:${i === 3 ? 9 : -7}deg`,
        })) +
        c.group(
          'menu',
          '<rect x="108" y="151" width="119" height="64" rx="7" fill="var(--sk-paper)" stroke="#38bdf8" stroke-width="2"/>'
        ) +
        c.line('suggestion', 'M135 169H207M135 185H192M135 201H175', {
          'stroke-dasharray': 90,
          'stroke-width': 3,
          stroke: '#7dd3fc',
        }) +
        c.shape('path', 'cursor', {
          d: 'M117 164L123 169L117 174',
          fill: 'none',
          stroke: '#fbbf24',
          'stroke-width': 2,
        })
      );
    }
  ),
  m(
    'fastapi-acelerador',
    'FastAPI · acelerador de requisições',
    'fastapi',
    'O raio abre um corredor de alta velocidade e recebe duas requisições que se fundem na resposta.',
    'raio tracejado + corredores convergentes + resposta acelerada',
    c => {
      c.k(
        'core',
        '0%,3%,95%,100%{transform:none}22%{transform:scale(.79) rotate(-9deg)}44%{transform:scale(.9) rotate(5deg)}67%{transform:scale(.83)}84%{transform:none}'
      );
      c.k(
        'lane',
        '0%,6%,93%,100%{opacity:0;stroke-dashoffset:320}29%{opacity:.7;stroke-dashoffset:130}70%{opacity:0;stroke-dashoffset:-130}',
        'linear'
      );
      c.k(
        'voltage',
        '0%,9%,92%,100%{opacity:0;stroke-dashoffset:190}30%{opacity:.9;stroke-dashoffset:0}56%{opacity:.45;stroke-dashoffset:-100}78%{opacity:0;stroke-dashoffset:-190}',
        'linear'
      );
      c.k(
        'response',
        '0%,40%,91%,100%{opacity:0;transform:translateX(-45px) scaleX(.2)}55%{opacity:1;transform:translateX(20px) scaleX(1)}78%{opacity:0;transform:translateX(90px) scaleX(.25)}'
      );
      return (
        c.line('lane', 'M13 70H54L83 110H111M13 186H54L83 146H111', {
          'stroke-dasharray': '30 14 5 270',
          'stroke-width': 3,
          stroke: '#a7f3d0',
        }) +
        c.base() +
        c.line('voltage', 'M140 59L103 129H143L118 191', {
          'stroke-dasharray': '50 180',
          'stroke-width': 4,
          stroke: '#fef3c7',
          filter: c.filter('glow'),
        }) +
        c.line('response', 'M158 127H211L201 117M211 127L201 137', {
          'stroke-width': 4,
          stroke: '#ecfdf5',
        })
      );
    }
  ),
  m(
    'php-hipertexto',
    'PHP · hipertexto em movimento',
    'php',
    'Os três glifos desenrolam uma faixa de hipertexto entre os delimitadores da linguagem.',
    'glifos independentes + faixa ondulada + delimitadores PHP',
    c => {
      c.k('core', '0%,3%,95%,100%{opacity:1}13%,83%{opacity:0}');
      c.k(
        'letter',
        '0%,5%,94%,100%{opacity:0;transform:none}24%{opacity:1;transform:translate(var(--x),var(--y)) skewX(-8deg) scale(.83)}49%{opacity:1;transform:translate(calc(var(--x)*-.4),calc(var(--y)*-.6)) skewX(7deg) scale(.9)}80%{opacity:1;transform:none}'
      );
      c.k(
        'ribbon',
        '0%,8%,92%,100%{opacity:0;stroke-dashoffset:240}32%,67%{opacity:.7;stroke-dashoffset:0}'
      );
      c.k(
        'delimiters',
        '0%,17%,91%,100%{opacity:0;transform:scaleX(.3)}38%,73%{opacity:.95;transform:none}'
      );
      return (
        c.line('ribbon', 'M25 181Q80 204 128 183T231 179', {
          'stroke-dasharray': 240,
          'stroke-width': 4,
          stroke: '#a78bfa',
        }) +
        c.base() +
        c.layers('letter', i => ({
          style: `--x:${(i - 1) * 12}px;--y:${i === 1 ? -23 : 10}px;--sk-delay:${i * 0.018}`,
        })) +
        c.line(
          'delimiters',
          'M43 57L28 69L43 81M52 56Q66 48 67 59Q68 64 60 67V73M60 81V82M194 57Q209 53 207 65M210 73L224 85L210 97',
          { 'stroke-width': 3, stroke: '#c4b5fd' }
        )
      );
    }
  ),
  m(
    'java-vapor',
    'Java · café em ebulição',
    'java',
    'A xícara mantém o peso enquanto o vapor laranja se desprende em duas espirais e um aroma luminoso.',
    'vapor original desacoplado + convecção + superfície do café',
    c => {
      c.k('core', '0%,3%,95%,100%{opacity:1}13%,84%{opacity:0}');
      c.k(
        'cup',
        '0%,5%,94%,100%{opacity:0;transform:none}23%{opacity:1;transform:translateY(3px) rotate(-2deg)}57%{opacity:1;transform:translateY(-2px) rotate(2deg)}82%{opacity:1;transform:none}'
      );
      c.k(
        'steam',
        '0%,5%,94%,100%{opacity:0;transform:none}19%{opacity:1;transform:translate(0,-8px) scale(.94,1.07)}43%{opacity:.75;transform:translate(8px,-18px) skewX(-7deg)}66%{opacity:.85;transform:translate(-7px,-10px) skewX(6deg)}83%{opacity:1;transform:none}'
      );
      c.k(
        'aroma',
        '0%,13%,91%,100%{opacity:0;stroke-dashoffset:170}38%{opacity:.8;stroke-dashoffset:40}74%{opacity:0;stroke-dashoffset:-170}',
        'linear'
      );
      c.k(
        'coffee',
        '0%,17%,92%,100%{opacity:0;transform:scaleX(.35)}37%{opacity:.6;transform:scaleX(1)}66%{opacity:0;transform:scaleX(1.2)}'
      );
      return (
        c.base() +
        c.layers('cup', i =>
          i === 1
            ? { class: 'sk-fx sk-steam', style: 'transform-origin:128px 140px' }
            : {}
        ) +
        c.line(
          'aroma',
          'M88 122C62 98 113 85 97 62C89 47 102 28 121 20M159 119C183 96 141 85 165 60',
          { 'stroke-dasharray': '45 160', stroke: '#fdba74', 'stroke-width': 3 }
        ) +
        c.shape('ellipse', 'coffee', {
          cx: 126,
          cy: 160,
          rx: 32,
          ry: 4,
          fill: 'none',
          stroke: '#fb923c',
          'stroke-width': 2,
          style: 'transform-origin:126px 160px',
        })
      );
    }
  ),
  m(
    'uvicorn-canais',
    'Uvicorn · canais ASGI',
    'uvicorn',
    'Requisição e resposta percorrem as duas hastes do U e atravessam a curva em direções complementares.',
    'corredor U bidirecional + handshake + pacotes ASGI',
    c => {
      c.k(
        'core',
        '0%,3%,95%,100%{transform:none}25%{transform:scale(.83,.91)}58%{transform:scale(.91,.85)}83%{transform:none}'
      );
      c.k(
        'request',
        '0%,7%,93%,100%{opacity:0;stroke-dashoffset:390}25%{opacity:1;stroke-dashoffset:220}70%{opacity:0;stroke-dashoffset:-110}',
        'linear'
      );
      c.k(
        'answer',
        '0%,17%,93%,100%{opacity:0;stroke-dashoffset:390}40%{opacity:.9;stroke-dashoffset:170}79%{opacity:0;stroke-dashoffset:-110}',
        'linear'
      );
      c.k(
        'ports',
        '0%,8%,92%,100%{opacity:0;transform:scale(.3)}28%,72%{opacity:.8;transform:scale(1)}'
      );
      return (
        c.base() +
        c.line('request', 'M79 53V144Q79 190 128 190T177 144V53', {
          'stroke-dasharray': '30 370',
          'stroke-width': 5,
          stroke: '#a7f3d0',
          filter: c.filter('glow'),
        }) +
        c.line('answer', 'M184 53V144Q184 199 128 199T72 144V53', {
          'stroke-dasharray': '20 390',
          'stroke-width': 3,
          stroke: '#7dd3fc',
        }) +
        c.group(
          'ports',
          '<path d="M68 44L79 33L90 44M166 34L177 45L188 34" fill="none" stroke="#a7f3d0" stroke-width="3"/>'
        )
      );
    }
  ),
];
