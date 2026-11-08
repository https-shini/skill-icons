import { define } from './motion-kit.mjs';
const m = (id, title, icon, concept, mechanism, compose) =>
  define(
    {
      id,
      title,
      icon,
      concept,
      mechanism,
      category: 'marca',
      duration: 7.6,
      cost: 'media',
    },
    compose
  );
export const BRAND_MODELS = [
  m(
    'assinatura-vetorial',
    'Assinatura vetorial',
    'gcruz',
    'Uma caneta luminosa escreve a assinatura e fecha com um sublinhado.',
    'máscara de escrita + caneta + traço',
    c => {
      c.k('core', '0%,10%,91%,100%{opacity:1}18%,80%{opacity:0}');
      c.k('ink', '0%,12%,88%,100%{opacity:0}20%,80%{opacity:1}');
      c.k(
        'reveal',
        '0%,18%{transform:translateX(-256px)}72%,100%{transform:translateX(0)}',
        'linear'
      );
      c.k(
        'pen',
        '0%,18%,80%,100%{opacity:0;transform:translateX(-85px)}22%{opacity:1;transform:translateX(-85px)}72%{opacity:1;transform:translateX(86px)}'
      );
      c.k(
        'underline',
        '0%,64%,94%,100%{opacity:0;stroke-dashoffset:180}78%,87%{opacity:1;stroke-dashoffset:0}'
      );
      const clip = c.clip(
        c.defShape('rect', 'reveal', { x: 0, y: 0, width: 256, height: 256 })
      );
      return (
        c.base() +
        c.copy('ink', { 'clip-path': clip }) +
        c.shape('circle', 'pen', {
          cx: 128,
          cy: 151,
          r: 3,
          fill: 'var(--sk-accent)',
          filter: c.filter('glow'),
        }) +
        c.line('underline', 'M42 165H216', {
          'stroke-dasharray': 180,
          'stroke-dashoffset': 180,
        })
      );
    }
  ),
  m(
    'portal-brackets',
    'Portal de brackets',
    'gctag',
    'Os brackets abrem um portão enquanto a assinatura central atravessa a abertura.',
    'três recortes independentes + portão',
    c => {
      c.k('core', '0%,8%,92%,100%{opacity:1}17%,80%{opacity:0}');
      c.k(
        'left',
        '0%,10%,90%,100%{opacity:0;transform:translateX(0)}22%,65%{opacity:1;transform:translateX(-26px) rotate(-8deg)}80%{opacity:1;transform:translateX(0)}'
      );
      c.k(
        'right',
        '0%,10%,90%,100%{opacity:0;transform:translateX(0)}22%,65%{opacity:1;transform:translateX(26px) rotate(8deg)}80%{opacity:1;transform:translateX(0)}'
      );
      c.k(
        'center',
        '0%,22%,90%,100%{opacity:0;transform:scaleX(.05)}42%,76%{opacity:1;transform:scaleX(1)}'
      );
      c.k(
        'threshold',
        '0%,17%,80%,100%{opacity:0;transform:scaleY(.05)}32%,60%{opacity:.7;transform:scaleY(1)}'
      );
      return (
        c.base() +
        c.part('left', 0, 0, 68, 256) +
        c.part('right', 188, 0, 68, 256) +
        c.part('center', 68, 0, 120, 256) +
        c.line('threshold', 'M68 74V182M188 74V182', {
          'stroke-dasharray': '4 5',
        })
      );
    }
  ),
  m(
    'fusao-monograma',
    'Fusão do monograma',
    'gc',
    'Duas metades percorrem arcos opostos, se encaixam e liberam um halo.',
    'metades em trajetórias curvas + encaixe',
    c => {
      c.k('core', '0%,8%,92%,100%{opacity:1}16%,82%{opacity:0}');
      c.k(
        'a',
        '0%,10%,90%,100%{opacity:0;transform:translate(0,0)}25%{opacity:1;transform:translate(-26px,-27px) rotate(-22deg)}55%{opacity:1;transform:translate(22px,-15px) rotate(8deg)}76%{opacity:1;transform:translate(0,0)}'
      );
      c.k(
        'b',
        '0%,10%,90%,100%{opacity:0;transform:translate(0,0)}25%{opacity:1;transform:translate(26px,27px) rotate(22deg)}55%{opacity:1;transform:translate(-22px,15px) rotate(-8deg)}76%{opacity:1;transform:translate(0,0)}'
      );
      c.k(
        'halo',
        '0%,68%,94%,100%{opacity:0;transform:scale(.2)}77%{opacity:.85;transform:scale(.65)}91%{opacity:0;transform:scale(1.15)}'
      );
      return (
        c.base() +
        c.part('a', 0, 0, 128, 256) +
        c.part('b', 128, 0, 128, 256) +
        c.ring('halo', 91)
      );
    }
  ),
  m(
    'terminal-assinatura',
    'Terminal da assinatura',
    'gcruz',
    'A marca vira o comando de um terminal que inicializa e devolve o resultado.',
    'janela + prompt + saída em etapas',
    c => {
      c.k(
        'core',
        '0%,8%,94%,100%{transform:translate(0,0) scale(1)}28%,78%{transform:translate(0,-16px) scale(.66)}'
      );
      c.k(
        'window',
        '0%,12%,91%,100%{opacity:0;transform:scaleY(.05)}25%,82%{opacity:1;transform:scaleY(1)}'
      );
      c.k(
        'prompt',
        '0%,25%,88%,100%{opacity:0;stroke-dashoffset:240}46%,78%{opacity:1;stroke-dashoffset:0}'
      );
      c.k(
        'result',
        '0%,48%,88%,100%{opacity:0;transform:translateY(8px) scaleX(.1)}64%,80%{opacity:1;transform:translateY(0) scaleX(1)}'
      );
      const frame =
        '<rect x="33" y="57" width="190" height="143" rx="12" fill="none" stroke="var(--sk-accent)" stroke-width="2"/><path d="M33 82H223" stroke="var(--sk-accent)"/><circle cx="47" cy="70" r="3" fill="var(--sk-accent)"/><circle cx="59" cy="70" r="3" fill="var(--sk-accent)"/>';
      return (
        c.base() +
        c.group('window', frame) +
        c.line('prompt', 'M48 137L57 145L48 153M67 153H187', {
          'stroke-dasharray': 240,
        }) +
        c.line('result', 'M52 173L59 180L73 165M85 174H180', {
          'stroke-width': 3,
        })
      );
    }
  ),
  m(
    'trama-binaria',
    'Trama binária',
    'gc',
    'Bits em duas correntes atravessam a silhueta e recompõem o monograma.',
    'alfabeto de bits + máscara alfa + correntes',
    c => {
      c.k('core', '0%,10%,91%,100%{opacity:1}28%,70%{opacity:.2}');
      c.k(
        'bits',
        '0%,15%,87%,100%{opacity:0;transform:translateY(-22px)}30%{opacity:1;transform:translateY(-18px)}69%{opacity:1;transform:translateY(28px)}'
      );
      c.k(
        'stream',
        '0%,12%,85%,100%{opacity:0;transform:translateX(-45px)}28%{opacity:.7;transform:translateX(-32px)}66%{opacity:.7;transform:translateX(32px)}'
      );
      let bits = '';
      for (let y = 60; y < 205; y += 17)
        for (let x = 45; x < 220; x += 16)
          bits += `<path d="${(x + y) % 3 ? 'M' + x + ' ' + y + 'v10' : 'M' + x + ' ' + y + 'h7v10h-7z'}" fill="none" stroke="var(--sk-accent)" stroke-width="2"/>`;
      return (
        c.base() +
        c.group('bits', bits, { mask: c.alpha() }) +
        c.line('stream', 'M28 86H86M164 174H227', { 'stroke-dasharray': '3 7' })
      );
    }
  ),
  m(
    'constelacao-marca',
    'Constelação da marca',
    'gcruz',
    'Pontos se conectam como um mapa celeste e materializam a assinatura.',
    'rede de estrelas + revelação radial',
    c => {
      c.k(
        'core',
        '0%,7%,92%,100%{opacity:1;transform:scale(1)}22%,60%{opacity:0;transform:scale(.8)}81%{opacity:1;transform:scale(1)}'
      );
      c.k(
        'stars',
        '0%,12%,90%,100%{opacity:0;transform:scale(.2) rotate(-20deg)}30%,65%{opacity:1;transform:scale(1) rotate(0deg)}'
      );
      c.k(
        'links',
        '0%,27%,90%,100%{opacity:0;stroke-dashoffset:420}55%,70%{opacity:.8;stroke-dashoffset:0}'
      );
      let stars = '';
      for (const [x, y] of [
        [42, 140],
        [78, 92],
        [110, 145],
        [146, 106],
        [184, 150],
        [216, 112],
      ])
        stars += `<path d="M${x - 4} ${y}h8M${x} ${y - 4}v8" stroke="var(--sk-accent)" stroke-width="2"/>`;
      return (
        c.base() +
        c.group('stars', stars) +
        c.line('links', 'M42 140L78 92L110 145L146 106L184 150L216 112', {
          'stroke-dasharray': 420,
        })
      );
    }
  ),
  m(
    'selo-prensado',
    'Selo prensado',
    'gc',
    'Um selo desce, comprime a marca e dissipa poeira no impacto.',
    'prensa + lacre octogonal + poeira',
    c => {
      c.k(
        'core',
        '0%,10%,91%,100%{transform:scale(1)}29%{transform:translateY(-35px) scale(.8)}47%{transform:translateY(9px) scale(1.08,.84)}62%{transform:scale(1)}'
      );
      c.k(
        'seal',
        '0%,30%,91%,100%{opacity:0;transform:scale(.55)}48%,73%{opacity:.85;transform:scale(1)}'
      );
      c.k(
        'dust',
        '0%,43%,85%,100%{opacity:0;transform:translate(0,0) scale(.3)}50%{opacity:.8;transform:translate(calc(var(--dx)*.6),calc(var(--dy)*.3))}78%{opacity:0;transform:translate(var(--dx),calc(var(--dy)*.4)) scale(.2)}'
      );
      return (
        c.base() +
        c.shape('polygon', 'seal', {
          points: '77,38 179,38 218,77 218,179 179,218 77,218 38,179 38,77',
          fill: 'none',
          stroke: 'var(--sk-accent)',
          'stroke-width': 2,
        }) +
        c.dots('dust', 12, 98)
      );
    }
  ),
  m(
    'solda-neon',
    'Solda de neon',
    'gctag',
    'Uma ponta de solda percorre os brackets e acende as junções.',
    'percurso retangular + faixa de solda + faíscas',
    c => {
      c.k('core', '0%,12%,92%,100%{opacity:1}20%,72%{opacity:.3}');
      c.k(
        'weld',
        '0%,15%,87%,100%{opacity:0;stroke-dashoffset:440}35%,78%{opacity:1;stroke-dashoffset:0}'
      );
      c.k(
        'tip',
        '0%,15%,85%,100%{opacity:0;transform:translate(-82px,-60px)}20%{opacity:1;transform:translate(-82px,-60px)}38%{opacity:1;transform:translate(-82px,55px)}60%{opacity:1;transform:translate(84px,55px)}78%{opacity:1;transform:translate(84px,-60px)}'
      );
      c.k(
        'spark',
        '0%,28%,87%,100%{opacity:0;transform:scale(.1)}40%,62%{opacity:.8;transform:scale(1)}'
      );
      return (
        c.base() +
        c.line('weld', 'M46 68V183H212V68', {
          'stroke-dasharray': 440,
          filter: c.filter('glow'),
          'stroke-width': 3,
        }) +
        c.shape('circle', 'tip', {
          cx: 128,
          cy: 128,
          r: 3,
          fill: 'var(--sk-accent)',
        }) +
        c.line(
          'spark',
          'M34 177L23 186M40 194L36 208M218 184L232 190M222 67L235 56'
        )
      );
    }
  ),
];
