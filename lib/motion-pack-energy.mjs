import { define } from './motion-kit.mjs';
const m = (id, title, icon, concept, mechanism, compose) =>
  define(
    {
      id,
      title,
      icon,
      concept,
      mechanism,
      category: 'energia',
      duration: 7.4,
      cost: 'alta',
    },
    compose
  );
export const ENERGY_MODELS = [
  m(
    'explosao-reconstroi',
    'Explosão e reconstrução',
    'gemini',
    'Fragmentos triangulares dispersam-se com faíscas e se reencaixam na estrela.',
    'fratura triangular + dispersão balística',
    c => {
      c.k('core', '0%,10%,95%,100%{opacity:1}20%,84%{opacity:0}');
      c.k(
        'shard',
        '0%,13%,94%,100%{opacity:0;transform:none}37%{opacity:1;transform:translate(var(--dx),var(--dy)) rotate(var(--rot)) scale(.65)}62%{opacity:.7;transform:translate(calc(var(--dx)*.7),calc(var(--dy)*.7)) rotate(var(--rot)) scale(.7)}84%{opacity:1;transform:none}'
      );
      c.k(
        'spark',
        '0%,26%,78%,100%{opacity:0;transform:scale(.1)}42%{opacity:1;transform:translate(var(--dx),var(--dy)) scale(1)}70%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(.1)}'
      );
      let shards = '';
      for (let i = 0; i < 16; i++) {
        let a = (i * Math.PI) / 8,
          b = a + Math.PI / 8;
        shards += c.copy('shard', {
          'clip-path': c.clip(
            `<path d="M128 128L${128 + 190 * Math.cos(a)} ${128 + 190 * Math.sin(a)}L${128 + 190 * Math.cos(b)} ${128 + 190 * Math.sin(b)}Z"/>`
          ),
          style: `--dx:${Math.cos(a) * 44}px;--dy:${Math.sin(a) * 44}px;--rot:${i % 2 ? 28 : -28}deg`,
        });
      }
      return c.base() + shards + c.dots('spark', 16, 105);
    }
  ),
  m(
    'meteoro',
    'Rastro de meteoro',
    'postman',
    'Um cometa curva a trajetória e deixa um rastro de pontos incandescentes.',
    'trajetória parabólica + cauda com atraso',
    c => {
      c.k(
        'core',
        '0%,9%,95%,100%{transform:none}28%{transform:translate(-37px,31px) scale(.55) rotate(-25deg)}55%{transform:translate(32px,-34px) scale(.65) rotate(15deg)}81%{transform:none}'
      );
      c.k(
        'tail',
        '0%,15%,91%,100%{opacity:0;stroke-dashoffset:300}35%,62%{opacity:.7;stroke-dashoffset:0}'
      );
      c.k(
        'ember',
        '0%,20%,87%,100%{opacity:0;transform:translate(5px,175px) scale(.1)}42%{opacity:.9;transform:translate(110px,84px) scale(1)}68%{opacity:0;transform:translate(200px,28px) scale(.1)}'
      );
      return (
        c.line('tail', 'M24 218Q95 90 218 39', {
          'stroke-dasharray': 300,
          'stroke-width': 7,
        }) +
        Array.from({ length: 7 }, (_, i) =>
          c.shape('circle', 'ember', {
            cx: 0,
            cy: 0,
            r: 2 + i * 0.4,
            fill: 'var(--sk-accent)',
            style: `--sk-delay:${i * 0.018}`,
          })
        ).join('') +
        c.base()
      );
    }
  ),
  m(
    'circuito-relampago',
    'Circuito relâmpago',
    'vite',
    'Pulsos percorrem trilhas ortogonais e convergem em uma descarga central.',
    'rede ortogonal + descarga elétrica',
    c => {
      c.k(
        'core',
        '0%,10%,94%,100%{transform:none;filter:none}48%{transform:scale(.86);filter:brightness(1.5)}62%{transform:scale(1.06)}'
      );
      c.k(
        'circuit',
        '0%,12%,92%,100%{opacity:0;stroke-dashoffset:500}35%,68%{opacity:.85;stroke-dashoffset:0}'
      );
      c.k(
        'bolt',
        '0%,40%,74%,100%{opacity:0;transform:scaleY(.1)}49%,56%{opacity:1;transform:scaleY(1)}'
      );
      return (
        c.line(
          'circuit',
          'M12 72H65V112H118M244 185H194V143H137M26 220V170H80M228 24V64H175',
          { 'stroke-dasharray': 500, 'stroke-width': 3 }
        ) +
        c.base() +
        c.line('bolt', 'M150 54L105 127H147L108 202', {
          'stroke-width': 5,
          filter: c.filter('glow'),
        })
      );
    }
  ),
  m(
    'aurora',
    'Aurora de luz',
    'azure',
    'Cortinas de luz se dobram em ondas largas sobre a arte.',
    'três cortinas curvas + mistura de cores',
    c => {
      c.k('core', '0%,10%,95%,100%{opacity:1}35%,73%{opacity:.65}');
      c.k(
        'ribbon',
        '0%,15%,92%,100%{opacity:0;transform:translateY(100px) skewX(-18deg)}38%{opacity:.7;transform:translateY(-20px) skewX(16deg)}68%{opacity:.8;transform:translateY(-45px) skewX(-10deg)}'
      );
      return (
        c.base() +
        c.group(
          'ribbon',
          '<path d="M-20 195Q50 35 132 137T285 85" fill="none" stroke="#34d399" stroke-width="28"/><path d="M-20 223Q60 70 142 167T285 105" fill="none" stroke="#a78bfa" stroke-width="20"/><path d="M-20 240Q60 100 152 190T285 130" fill="none" stroke="#38bdf8" stroke-width="14"/>',
          { mask: c.alpha() }
        )
      );
    }
  ),
  m(
    'toro-plasma',
    'Toro de plasma',
    'firebase',
    'Um anel inclinado envolve a chama e transporta partículas em sua órbita.',
    'anel com oclusão frontal/traseira + plasma',
    c => {
      c.k(
        'core',
        '0%,10%,94%,100%{transform:none}32%,72%{transform:scale(.78) translateY(-5px)}'
      );
      c.k(
        'torus',
        '0%,15%,92%,100%{opacity:0;transform:rotate(-30deg) scale(.4)}34%{opacity:.8;transform:rotate(-30deg) scale(1)}72%{opacity:.8;transform:rotate(30deg) scale(1)}'
      );
      c.k(
        'charge',
        '0%,19%,91%,100%{opacity:0;transform:rotate(0deg)}40%{opacity:1;transform:rotate(70deg)}74%{opacity:1;transform:rotate(330deg)}',
        'linear'
      );
      const ring =
        '<ellipse cx="128" cy="128" rx="110" ry="42" fill="none" stroke="var(--sk-accent)" stroke-width="5"/>';
      return (
        c.group('torus', ring, { 'clip-path': c.rect(0, 0, 256, 128) }) +
        c.base() +
        c.group('torus', ring, { 'clip-path': c.rect(0, 128, 256, 128) }) +
        c.group(
          'charge',
          '<circle cx="212" cy="64" r="5" fill="#fde68a"/><circle cx="44" cy="192" r="3" fill="#fb923c"/>',
          { filter: c.filter('glow') }
        )
      );
    }
  ),
  m(
    'tinta-viva',
    'Tinta viva',
    'illustrator',
    'Gotas viscosas se unem, cobrem o desenho e revelam a arte ao escoar.',
    'metaballs + cobertura orgânica',
    c => {
      c.k('core', '0%,9%,95%,100%{opacity:1}40%,52%{opacity:.3}');
      c.k(
        'ink',
        '0%,14%,93%,100%{opacity:0;transform:translate(var(--dx),-130px) scale(.2)}40%{opacity:.9;transform:translate(var(--dx),0) scale(1.2)}67%{opacity:.65;transform:translate(var(--dx),90px) scale(.8)}84%{opacity:0;transform:translate(var(--dx),150px) scale(.2)}'
      );
      return (
        c.base() +
        c.tag(
          'g',
          { filter: c.filter('goo'), mask: c.alpha() },
          [-55, -18, 22, 55]
            .map((x, i) =>
              c.shape('circle', 'ink', {
                cx: 128,
                cy: 128,
                r: 36,
                fill: ['#f97316', '#fbbf24', '#fb7185', '#f97316'][i],
                style: `--dx:${x}px;--sk-delay:${i * 0.025}`,
              })
            )
            .join('')
        )
      );
    }
  ),
  m(
    'eclipse-solar',
    'Eclipse solar',
    'eclipse',
    'Um disco escuro cruza a arte e acende uma coroa no alinhamento.',
    'ocultação orbital + coroa solar',
    c => {
      c.k(
        'core',
        '0%,10%,95%,100%{transform:none}35%,73%{transform:scale(.82)}'
      );
      c.k(
        'moon',
        '0%,14%,94%,100%{opacity:0;transform:translateX(-210px)}26%{opacity:1;transform:translateX(-150px)}49%{opacity:1;transform:translateX(0)}76%{opacity:1;transform:translateX(150px)}86%{opacity:0;transform:translateX(210px)}',
        'linear'
      );
      c.k(
        'corona',
        '0%,32%,72%,100%{opacity:0;transform:scale(.65)}49%{opacity:1;transform:scale(1)}'
      );
      return (
        c.base() +
        c.ring('corona', 86, { 'stroke-width': 6, filter: c.filter('glow') }) +
        c.shape('circle', 'moon', {
          cx: 128,
          cy: 128,
          r: 79,
          fill: 'var(--sk-paper)',
        })
      );
    }
  ),
  m(
    'vortice-cometas',
    'Vórtice de cometas',
    'jupyter',
    'Dois cometas descrevem espirais em sentidos opostos e são absorvidos pelo núcleo.',
    'espirais entrelaçadas + convergência',
    c => {
      c.k(
        'core',
        '0%,12%,94%,100%{transform:none}40%{transform:scale(.66)}75%{transform:scale(1.04)}'
      );
      c.k(
        'spiral',
        '0%,14%,94%,100%{opacity:0;stroke-dashoffset:700}38%{opacity:.9;stroke-dashoffset:310}73%{opacity:0;stroke-dashoffset:-150}',
        'linear'
      );
      c.k(
        'nucleus',
        '0%,40%,85%,100%{opacity:0;transform:scale(.1)}66%{opacity:.9;transform:scale(.9)}'
      );
      return (
        c.line(
          'spiral',
          'M26 202C-4 25 239 -10 231 138C222 244 46 223 63 107C79 37 190 67 178 140C164 195 87 164 112 120L128 128',
          { 'stroke-dasharray': '25 12 4 9 4 650', 'stroke-width': 4 }
        ) +
        c.line(
          'spiral',
          'M230 54C260 231 17 266 25 118C34 12 210 33 193 149C177 219 66 189 78 116C92 61 169 92 144 136L128 128',
          {
            'stroke-dasharray': '25 12 4 9 4 650',
            'stroke-width': 3,
            stroke: '#fbbf24',
          }
        ) +
        c.base() +
        c.ring('nucleus', 45, { 'stroke-width': 6 })
      );
    }
  ),
];
