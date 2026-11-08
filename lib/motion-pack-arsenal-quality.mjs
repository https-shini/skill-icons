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
      duration: 7.4,
      cost: 'media',
    },
    compose
  );
export const ARSENAL_QUALITY_MODELS = [
  m(
    'ruff-diagnostico',
    'Ruff · limpeza em alta velocidade',
    'ruff',
    'O R acelera entre diagnósticos, apaga os avisos e deixa marcas verdes de código revisado.',
    'passagem em três impulsos + diagnóstico apagado + trilhas de lint',
    c => {
      c.k(
        'core',
        '0%,3%,95%,100%{transform:none}19%{transform:translateX(-16px) skewX(-9deg) scale(.82)}34%{transform:translateX(19px) skewX(8deg) scale(.82)}47%{transform:translateX(-9px) skewX(-5deg) scale(.9)}65%{transform:translateX(5px) scale(.96)}83%{transform:none}'
      );
      c.k(
        'warning',
        '0%,7%,52%,100%{opacity:0;transform:scale(.2)}16%,31%{opacity:.8;transform:scale(1)}43%{opacity:0;transform:translateX(22px) scale(.2)}'
      );
      c.k(
        'trail',
        '0%,11%,91%,100%{opacity:0;stroke-dashoffset:220}29%{opacity:.9;stroke-dashoffset:0}61%{opacity:0;stroke-dashoffset:-160}',
        'linear'
      );
      c.k(
        'clean',
        '0%,45%,92%,100%{opacity:0;stroke-dashoffset:55}66%,80%{opacity:1;stroke-dashoffset:0}'
      );
      return (
        c.line('trail', 'M9 79H73M15 99H52M182 162H246M202 182H238', {
          'stroke-dasharray': '24 12 4 180',
          'stroke-width': 3,
          stroke: '#bef264',
        }) +
        c.base() +
        c.group(
          'warning',
          '<path d="M207 43L219 65H195ZM37 184L49 206H25Z" fill="none" stroke="#fb7185" stroke-width="2"/><path d="M207 50V56M207 60V61M37 191V197M37 201V202" stroke="#fb7185" stroke-width="2"/>'
        ) +
        c.line('clean', 'M184 203L195 214L220 187', {
          'stroke-dasharray': 55,
          'stroke-width': 4,
          stroke: '#bef264',
        })
      );
    }
  ),
  m(
    'radon-complexidade',
    'Radon · mapa de complexidade',
    'radon',
    'A assinatura acompanha um grafo de decisões que se abre, fecha os ciclos e organiza barras de métricas.',
    'grafo ciclomático + ligação de retorno + barras discretas',
    c => {
      c.k(
        'core',
        '0%,3%,95%,100%{transform:none}24%,70%{transform:translateY(-40px) scale(.83)}'
      );
      c.k(
        'graph',
        '0%,7%,93%,100%{opacity:0;stroke-dashoffset:350}38%,75%{opacity:.8;stroke-dashoffset:0}'
      );
      c.k(
        'node',
        '0%,13%,92%,100%{opacity:0;transform:scale(.1)}30%,77%{opacity:.9;transform:scale(1)}'
      );
      c.k(
        'bar',
        '0%,29%,92%,100%{opacity:0;transform:scaleY(.05)}60%,77%{opacity:.8;transform:scaleY(var(--h))}'
      );
      c.k(
        'return',
        '0%,37%,91%,100%{opacity:0;stroke-dashoffset:180}67%,78%{opacity:.9;stroke-dashoffset:0}'
      );
      let graph = c.line(
        'graph',
        'M127 121L83 150L127 181L172 150Z M127 110V121M127 181V195',
        { 'stroke-dasharray': 350, stroke: '#c4b5fd' }
      );
      for (const [i, [x, y]] of [
        [127, 121],
        [83, 150],
        [172, 150],
        [127, 181],
      ].entries())
        graph += c.shape('rect', 'node', {
          x: x - 5,
          y: y - 5,
          width: 10,
          height: 10,
          rx: 2,
          fill: 'var(--sk-paper)',
          stroke: '#c4b5fd',
          'stroke-width': 2,
          style: `transform-origin:${x}px ${y}px;--sk-delay:${i * 0.025}`,
        });
      return (
        c.base() +
        graph +
        c.line('return', 'M79 150H56V110H119', {
          'stroke-dasharray': 180,
          stroke: '#a78bfa',
          'stroke-width': 2,
        }) +
        [0.55, 0.9, 0.7, 1, 0.4]
          .map((h, i) =>
            c.shape('rect', 'bar', {
              x: 172 + i * 10,
              y: 195 - 25,
              width: 5,
              height: 25,
              rx: 2,
              fill: '#a78bfa',
              style: `--h:${h};transform-origin:${174 + i * 10}px 195px;--sk-delay:${i * 0.02}`,
            })
          )
          .join('')
      );
    }
  ),
  m(
    'biome-topografia',
    'Biome · topografia viva',
    'biome',
    'Curvas de nível percorrem a montanha triangular e a base se organiza como um ecossistema de linhas.',
    'curvas topográficas mascaradas + relevo triangular + base em equilíbrio',
    c => {
      c.k(
        'core',
        '0%,3%,95%,100%{transform:none}25%{transform:translateY(-9px) scale(.84)}57%{transform:translateY(-4px) scale(.9)}82%{transform:none}'
      );
      c.k(
        'terrain',
        '0%,8%,93%,100%{opacity:0;stroke-dashoffset:400}33%{opacity:.9;stroke-dashoffset:110}75%{opacity:.4;stroke-dashoffset:-180}',
        'linear'
      );
      c.k(
        'bed',
        '0%,14%,92%,100%{opacity:0;transform:translateY(19px) scaleX(.3)}36%{opacity:.75;transform:translateY(0) scaleX(1)}70%{opacity:.45;transform:translateY(3px) scaleX(.9)}'
      );
      return (
        c.base() +
        c.line(
          'terrain',
          'M19 185Q80 120 144 161T245 131M15 155Q85 82 150 129T250 96M19 121Q83 48 151 95T244 63M29 87Q83 16 159 62T227 32',
          {
            'stroke-dasharray': '120 35 6 320',
            'stroke-width': 4,
            stroke: '#bfdbfe',
            mask: c.alpha(),
          }
        ) +
        c.group(
          'bed',
          '<path d="M39 222H217M61 232H195M83 241H173" stroke="#60a5fa" stroke-width="2"/><path d="M37 218L47 203L57 218M199 218L209 201L219 218" fill="none" stroke="#86efac" stroke-width="2"/>'
        )
      );
    }
  ),
  m(
    'golangci-inspecao',
    'golangci-lint · inspeção do Gopher',
    'golangci',
    'O Gopher inspeciona três diagnósticos em uma prancheta e confirma cada verificação em sequência.',
    'mascote com acompanhamento + prancheta tripla + checks escalonados',
    c => {
      c.k(
        'core',
        '0%,3%,95%,100%{transform:none}22%{transform:translate(-33px,1px) rotate(-5deg) scale(.72)}49%{transform:translate(-30px,-4px) rotate(4deg) scale(.72)}74%{transform:translate(-31px,2px) rotate(-2deg) scale(.72)}'
      );
      c.k(
        'board',
        '0%,7%,93%,100%{opacity:0;transform:translateX(45px) rotate(9deg)}28%,77%{opacity:.95;transform:none}'
      );
      c.k(
        'check',
        '0%,23%,92%,100%{opacity:0;stroke-dashoffset:45}46%,78%{opacity:1;stroke-dashoffset:0}'
      );
      c.k(
        'antenna',
        '0%,14%,91%,100%{opacity:0;transform:scaleX(.1)}38%,72%{opacity:.75;transform:scaleX(1)}'
      );
      return (
        c.base() +
        c.group(
          'board',
          '<rect x="150" y="73" width="74" height="125" rx="7" fill="var(--sk-paper)" stroke="#67e8f9" stroke-width="2"/><rect x="172" y="65" width="30" height="16" rx="4" fill="#67e8f9"/><path d="M180 106H210M180 140H210M180 174H210" stroke="#67e8f9" stroke-width="3"/>'
        ) +
        [103, 137, 171]
          .map((y, i) =>
            c.line('check', `M158 ${y}L164 ${y + 6}L175 ${y - 8}`, {
              'stroke-dasharray': 45,
              'stroke-width': 3,
              stroke: '#86efac',
              style: `--sk-delay:${i * 0.075}`,
            })
          )
          .join('') +
        c.line('antenna', 'M115 112Q130 95 145 111', {
          'stroke-dasharray': '2 5',
          stroke: '#67e8f9',
        })
      );
    }
  ),
  m(
    'openrouter-roteamento',
    'OpenRouter · escolha de rotas',
    'openrouter',
    'As setas selecionam três saídas alternativas; um pacote percorre a bifurcação e confirma a rota ativa.',
    'três rotas de inferência + pacote em bifurcação + seleção de saída',
    c => {
      c.k(
        'core',
        '0%,3%,95%,100%{transform:none}22%,70%{transform:translateX(-22px) scale(.6)}'
      );
      c.k(
        'routes',
        '0%,7%,93%,100%{opacity:0;stroke-dashoffset:380}30%,78%{opacity:.7;stroke-dashoffset:0}'
      );
      c.k(
        'packet',
        '0%,13%,92%,100%{opacity:0;transform:translate(101px,128px)}21%{opacity:1;transform:translate(101px,128px)}38%{opacity:1;transform:translate(151px,128px)}57%{opacity:1;transform:translate(203px,var(--y))}74%{opacity:0;transform:translate(218px,var(--y))}',
        'linear'
      );
      c.k(
        'destination',
        '0%,32%,94%,100%{opacity:0;transform:scale(.3)}53%{opacity:1;transform:scale(1.25)}72%{opacity:.55;transform:scale(1)}'
      );
      let out = c.line(
        'routes',
        'M102 128H153Q165 128 165 99V62H204M153 128H204M153 128Q165 128 165 157V194H204',
        { 'stroke-dasharray': 380, 'stroke-width': 2 }
      );
      for (const [i, y] of [62, 128, 194].entries())
        out +=
          c.shape('circle', 'packet', {
            cx: 0,
            cy: 0,
            r: 4,
            fill: ['#c4b5fd', '#7dd3fc', '#fda4af'][i],
            style: `--y:${y}px;--sk-delay:${i * 0.065}`,
          }) +
          c.shape('rect', 'destination', {
            x: 199,
            y: y - 8,
            width: 16,
            height: 16,
            rx: 4,
            fill: 'var(--sk-paper)',
            stroke: ['#c4b5fd', '#7dd3fc', '#fda4af'][i],
            'stroke-width': 2,
            style: `transform-origin:207px ${y}px;--sk-delay:${i * 0.065}`,
          });
      return c.base() + out;
    }
  ),
  m(
    'pydantic-validacao',
    'Pydantic · fronteira de validação',
    'pydantic',
    'Dados desalinhados atravessam o escudo e saem normalizados; o check confirma o último campo.',
    'campos desalinhados + fronteira de schema + saída normalizada',
    c => {
      c.k(
        'core',
        '0%,3%,95%,100%{transform:none}23%{transform:scale(.7) rotate(-5deg)}57%{transform:scale(.78) rotate(4deg)}81%{transform:none}'
      );
      c.k(
        'input',
        '0%,7%,93%,100%{opacity:0;transform:translate(0,0) rotate(var(--a))}23%{opacity:.9;transform:translateX(15px) rotate(var(--a))}49%{opacity:0;transform:translateX(68px) rotate(0deg)}'
      );
      c.k(
        'output',
        '0%,34%,93%,100%{opacity:0;transform:translateX(-30px) scaleX(.2)}58%{opacity:.95;transform:none}77%{opacity:0;transform:translateX(18px)}'
      );
      c.k(
        'boundary',
        '0%,12%,92%,100%{opacity:0;stroke-dashoffset:200}39%{opacity:.8;stroke-dashoffset:0}72%{opacity:0;stroke-dashoffset:-200}',
        'linear'
      );
      c.k(
        'approval',
        '0%,57%,91%,100%{opacity:0;transform:scale(.3)}72%{opacity:.85;transform:scale(1.05)}84%{opacity:0;transform:scale(1.2)}'
      );
      let out = c.base();
      for (let i = 0; i < 3; i++) {
        let y = 87 + i * 34;
        out +=
          c.shape('rect', 'input', {
            x: 22,
            y,
            width: 22 + i * 3,
            height: 13,
            rx: 3,
            fill: ['#fb7185', '#fbbf24', '#a78bfa'][i],
            style: `--a:${[14, -18, 9][i]}deg;transform-origin:33px ${y + 6}px;--sk-delay:${i * 0.035}`,
          }) +
          c.line('output', `M193 ${y + 6}H229`, {
            stroke: '#86efac',
            'stroke-width': 5,
            style: `--sk-delay:${i * 0.035}`,
          });
      }
      return (
        out +
        c.line('boundary', 'M128 31V225', {
          'stroke-dasharray': '30 180',
          stroke: '#f0abfc',
          'stroke-width': 2,
        }) +
        c.ring('approval', 85, { stroke: '#f0abfc', 'stroke-width': 3 })
      );
    }
  ),
  m(
    'jwt-assinatura',
    'JWT · três partes e assinatura',
    'jwt',
    'Header, payload e assinatura se alinham sob o selo; uma chave percorre a fechadura e sela o token.',
    'três segmentos de token + chave móvel + selo criptográfico',
    c => {
      c.k(
        'core',
        '0%,3%,95%,100%{transform:none}24%,70%{transform:translateY(-19px) scale(.73)}'
      );
      c.k(
        'segments',
        '0%,8%,93%,100%{opacity:0;transform:translate(var(--x),25px) rotate(var(--a))}35%{opacity:.9;transform:none}68%{opacity:.95;transform:none}'
      );
      c.k(
        'key',
        '0%,24%,91%,100%{opacity:0;transform:translate(44px,20px) rotate(35deg) scale(.7)}41%{opacity:1;transform:translate(0,0) rotate(0deg) scale(.7)}60%{opacity:1;transform:translate(0,0) rotate(90deg) scale(.7)}78%{opacity:0;transform:translate(35px,10px) rotate(90deg) scale(.7)}'
      );
      c.k(
        'seal',
        '0%,48%,92%,100%{opacity:0;stroke-dashoffset:500}71%,81%{opacity:.9;stroke-dashoffset:0}'
      );
      return (
        c.base() +
        [-1, 0, 1]
          .map((side, i) =>
            c.shape('rect', 'segments', {
              x: 44 + i * 58,
              y: 207,
              width: 51,
              height: 12,
              rx: 4,
              fill: ['#d63aff', '#a78bfa', '#fb015b'][i],
              style: `--x:${side * 20}px;--a:${side * 22}deg;transform-origin:${69 + i * 58}px 213px;--sk-delay:${i * 0.035}`,
            })
          )
          .join('') +
        c.group(
          'key',
          '<circle cx="128" cy="101" r="10" fill="none" stroke="#fde68a" stroke-width="4"/><path d="M128 111V151H141M128 139H139" fill="none" stroke="#fde68a" stroke-width="4"/>',
          { style: 'transform-origin:128px 101px' }
        ) +
        c.line('seal', 'M128 40L204 84V172L128 216L52 172V84Z', {
          'stroke-dasharray': 500,
          stroke: '#f0abfc',
          'stroke-width': 2,
        })
      );
    }
  ),
];
