import { define } from './motion-kit.mjs';
const m = (id, title, icon, concept, mechanism, compose) =>
  define(
    {
      id,
      title,
      icon,
      concept,
      mechanism,
      category: 'fisica',
      duration: 6.8,
      cost: 'media',
    },
    compose
  );
export const PHYSICS_MODELS = [
  m(
    'queda-elastica',
    'Queda elástica',
    'javascript',
    'A peça cai, comprime o contato e recupera o volume em três amortecimentos.',
    'gravidade + squash-and-stretch + sombra',
    c => {
      c.k(
        'core',
        '0%,8%,93%,100%{transform:translateY(0) scale(1)}24%{transform:translateY(-45px) scale(.94,1.08)}43%{transform:translateY(18px) scale(1.16,.76)}58%{transform:translateY(-15px) scale(.94,1.06)}70%{transform:translateY(6px) scale(1.04,.95)}83%{transform:translateY(0) scale(1)}'
      );
      c.k(
        'shadow',
        '0%,10%,94%,100%{opacity:0;transform:scaleX(.5)}25%{opacity:.15;transform:scaleX(.6)}43%{opacity:.45;transform:scaleX(1.15)}80%{opacity:.15;transform:scaleX(.8)}'
      );
      return (
        c.shape('ellipse', 'shadow', {
          cx: 128,
          cy: 224,
          rx: 64,
          ry: 5,
          fill: 'var(--sk-accent)',
        }) + c.base()
      );
    }
  ),
  m(
    'estilingue',
    'Estilingue elástico',
    'svelte',
    'Uma âncora segura a peça antes de soltá-la em uma trajetória de retorno.',
    'tensão horizontal + tether + overshoot',
    c => {
      c.k(
        'core',
        '0%,8%,94%,100%{transform:translateX(0) scale(1)}30%{transform:translateX(-38px) scale(.8,1.12)}43%{transform:translateX(38px) scale(1.1,.92)}60%{transform:translateX(-10px)}78%{transform:translateX(0)}'
      );
      c.k(
        'tether',
        '0%,12%,53%,100%{opacity:0;transform:scaleX(.1)}30%{opacity:1;transform:scaleX(1)}47%{opacity:.5;transform:scaleX(.2)}'
      );
      c.k('anchor', '0%,12%,70%,100%{opacity:0}22%,48%{opacity:1}');
      return (
        c.line('tether', 'M28 128Q74 100 116 128', { 'stroke-width': 3 }) +
        c.shape('circle', 'anchor', {
          cx: 28,
          cy: 128,
          r: 6,
          fill: 'none',
          stroke: 'var(--sk-accent)',
          'stroke-width': 3,
        }) +
        c.base()
      );
    }
  ),
  m(
    'bandeira-flexivel',
    'Bandeira flexível',
    'flutter',
    'Faixas da arte recebem uma onda de tecido presa à margem esquerda.',
    'recortes verticais + defasagem de tecido',
    c => {
      c.k('core', '0%,8%,93%,100%{opacity:1}16%,83%{opacity:0}');
      c.k(
        'cloth',
        '0%,12%,90%,100%{opacity:0;transform:translateY(0) skewY(0deg)}32%{opacity:1;transform:translateY(calc(var(--lift)*-1px)) skewY(4deg)}60%{opacity:1;transform:translateY(calc(var(--lift)*1px)) skewY(-4deg)}81%{opacity:1;transform:translateY(0)}'
      );
      let strips = '';
      for (let i = 0; i < 8; i++)
        strips += c.part('cloth', i * 32, 0, 32, 256, {
          style: `--lift:${i * 1.3};--sk-delay:${i * 0.012}`,
        });
      return c.base() + strips;
    }
  ),
  m(
    'boia-liquida',
    'Boia líquida',
    'flask',
    'Uma superfície de líquido cresce, faz a arte flutuar e deixa bolhas subirem.',
    'superfície ondulada + empuxo + bolhas',
    c => {
      c.k(
        'core',
        '0%,10%,94%,100%{transform:translateY(0) rotate(0deg)}35%{transform:translateY(-10px) rotate(-6deg)}63%{transform:translateY(-7px) rotate(5deg)}82%{transform:translateY(0)}'
      );
      c.k(
        'water',
        '0%,14%,93%,100%{opacity:0;transform:translate(-24px,35px)}30%,72%{opacity:.3;transform:translate(8px,0)}'
      );
      c.k(
        'bubble',
        '0%,22%,83%,100%{opacity:0;transform:translateY(25px) scale(.4)}42%{opacity:.75;transform:translateY(-25px) scale(1)}70%{opacity:0;transform:translateY(-75px) scale(.6)}'
      );
      return (
        c.group(
          'water',
          '<path d="M-5 192Q30 172 65 190T135 190T205 190T275 190V229H-5Z" fill="var(--sk-accent)"/>'
        ) +
        c.base() +
        [70, 155, 191]
          .map((x, i) =>
            c.shape('circle', 'bubble', {
              cx: x,
              cy: 189,
              r: 3 + i,
              fill: 'none',
              stroke: 'var(--sk-accent)',
              style: `--sk-delay:${i * 0.04}`,
            })
          )
          .join('')
      );
    }
  ),
  m(
    'colisao-simetrica',
    'Colisão simétrica',
    'ruby',
    'Duas réplicas reduzidas colidem, trocam impulso e voltam a formar uma peça.',
    'duas massas + colisão + ondas de impacto',
    c => {
      c.k('core', '0%,8%,93%,100%{opacity:1}18%,82%{opacity:0}');
      c.k(
        'a',
        '0%,10%,90%,100%{opacity:0;transform:scale(1)}24%{opacity:1;transform:translateX(-59px) scale(.43)}46%{opacity:1;transform:translateX(-22px) scale(.43,.5)}64%{opacity:1;transform:translateX(-42px) scale(.4)}82%{opacity:1;transform:scale(1)}'
      );
      c.k(
        'b',
        '0%,10%,90%,100%{opacity:0;transform:scale(1)}24%{opacity:1;transform:translateX(59px) scale(.43)}46%{opacity:1;transform:translateX(22px) scale(.43,.5)}64%{opacity:1;transform:translateX(42px) scale(.4)}82%{opacity:0;transform:scale(1)}'
      );
      c.k(
        'impact',
        '0%,42%,76%,100%{opacity:0;transform:scale(.2)}50%{opacity:.7;transform:scale(.6)}70%{opacity:0;transform:scale(1)}'
      );
      return (
        c.base() +
        c.copy('a') +
        c.copy('b') +
        c.ring('impact', 69, { 'stroke-dasharray': '3 7' })
      );
    }
  ),
  m(
    'balanca-giroscopica',
    'Balança giroscópica',
    'blender',
    'A peça se estabiliza entre três aros em planos diferentes.',
    'gimbal triplo + estabilização',
    c => {
      c.k(
        'core',
        '0%,10%,94%,100%{transform:scale(1) rotate(0deg)}35%{transform:scale(.7) rotate(-12deg)}65%{transform:scale(.7) rotate(8deg)}82%{transform:scale(1)}'
      );
      c.k(
        'yaw',
        '0%,12%,92%,100%{opacity:0;transform:rotate(0deg)}30%{opacity:.85;transform:rotate(20deg)}76%{opacity:.85;transform:rotate(160deg)}'
      );
      c.k(
        'pitch',
        '0%,16%,92%,100%{opacity:0;transform:rotate(0deg)}35%{opacity:.7;transform:rotate(-15deg)}76%{opacity:.7;transform:rotate(-115deg)}'
      );
      c.k(
        'axis',
        '0%,22%,90%,100%{opacity:0;transform:scale(.4)}40%,75%{opacity:.7;transform:scale(1)}'
      );
      return (
        c.shape('ellipse', 'yaw', {
          cx: 128,
          cy: 128,
          rx: 104,
          ry: 42,
          fill: 'none',
          stroke: 'var(--sk-accent)',
          'stroke-width': 2,
        }) +
        c.shape('ellipse', 'pitch', {
          cx: 128,
          cy: 128,
          rx: 39,
          ry: 100,
          fill: 'none',
          stroke: 'var(--sk-accent)',
          'stroke-width': 2,
        }) +
        c.line('axis', 'M21 128H235M128 21V235', {
          'stroke-dasharray': '3 9',
        }) +
        c.base()
      );
    }
  ),
  m(
    'dobra-papel',
    'Dobra de papel',
    'markdown',
    'Uma dobra diagonal passa pela folha, revela o verso e se desfaz.',
    'dobra triangular + vinco + verso',
    c => {
      c.k('core', '0%,10%,93%,100%{opacity:1}30%,72%{opacity:.25}');
      c.k(
        'fold',
        '0%,14%,90%,100%{opacity:0;transform:translate(0,0) skew(0deg)}38%{opacity:1;transform:translate(-18px,17px) skew(-12deg,8deg)}65%{opacity:1;transform:translate(-5px,4px)}'
      );
      c.k(
        'crease',
        '0%,18%,90%,100%{opacity:0;stroke-dashoffset:230}43%,72%{opacity:.9;stroke-dashoffset:0}'
      );
      const clip = c.clip('<polygon points="32,32 224,32 32,224"/>');
      return (
        c.base() +
        c.copy('fold', { 'clip-path': clip }) +
        c.line('crease', 'M34 222L222 34', { 'stroke-dasharray': 270 }) +
        c.shape('polygon', 'fold', {
          points: '90,92 221,35 34,222',
          fill: 'var(--sk-accent)',
          'fill-opacity': 0.13,
        })
      );
    }
  ),
  m(
    'transmissao-engrenagens',
    'Transmissão de engrenagens',
    'rust',
    'A engrenagem central aciona duas coroas menores com contato visível.',
    'trem de engrenagens + dentes + transmissão',
    c => {
      c.k(
        'core',
        '0%,10%,93%,100%{transform:scale(1) rotate(0deg)}30%{transform:scale(.68) rotate(20deg)}75%{transform:scale(.68) rotate(200deg)}'
      );
      c.k(
        'gear',
        '0%,15%,92%,100%{opacity:0;transform:rotate(0deg)}28%{opacity:.85;transform:rotate(-30deg)}79%{opacity:.85;transform:rotate(-300deg)}',
        'linear'
      );
      const cog = (x, y) =>
        `<g transform="translate(${x} ${y})"><circle r="23" fill="none" stroke="var(--sk-accent)" stroke-width="7" stroke-dasharray="5 5"/><circle r="7" fill="none" stroke="var(--sk-accent)" stroke-width="3"/></g>`;
      return (
        c.base() +
        c.group('gear', cog(49, 57), { style: 'transform-origin:49px 57px' }) +
        c.group('gear', cog(207, 199), {
          style: 'transform-origin:207px 199px',
        })
      );
    }
  ),
];
