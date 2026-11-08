/** Verificação visual determinística opcional. Requer build web, servidor e Playwright. */
import assert from 'node:assert/strict';
const module = await import(process.env.PLAYWRIGHT_CORE || 'playwright-core');
const chromium = module.chromium ?? module.default.chromium;
const base =
  process.argv.find(a => a.startsWith('--base='))?.slice(7) ??
  'http://localhost:4173';
const browser = await chromium.launch({
  ...(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {}),
  args: ['--no-sandbox'],
});
try {
  const page = await browser.newPage({ reducedMotion: 'no-preference' });
  await page.goto(base);
  const report = await page.evaluate(async () => {
    const [manifest, library] = await Promise.all(
      ['/manifest.json', '/animations.json'].map(async p =>
        (await fetch(p)).json()
      )
    );
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 64;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    async function pixels(src) {
      const img = new Image();
      img.src = src;
      await img.decode();
      ctx.clearRect(0, 0, 64, 64);
      ctx.drawImage(img, 0, 0, 64, 64);
      return ctx.getImageData(0, 0, 64, 64).data;
    }
    const mean = (a, b) =>
      a.reduce((sum, v, i) => sum + Math.abs(v - b[i]), 0) / a.length;
    let originals = 0,
      previews = 0,
      worst = 0;
    const failures = [];
    const parser = new DOMParser();
    const valid = svg =>
      !parser
        .parseFromString(svg, 'image/svg+xml')
        .querySelector('parsererror');
    const files = [...new Set(manifest.icons.flatMap(i => [i.dark, i.light]))];
    for (const file of files) {
      const original = await pixels('/svg/' + file),
        animated = await pixels('/svg/animated/' + file);
      const mae = mean(original, animated);
      worst = Math.max(worst, mae);
      originals++;
      if (mae > 0.35)
        failures.push({ file, reason: 'primeiro quadro alterado', mae });
      if (!valid(await (await fetch('/svg/animated/' + file)).text()))
        failures.push({ file, reason: 'XML inválido' });
    }
    for (const model of library.models)
      for (const theme of ['dark', 'light']) {
        const file = manifest.icons.find(i => i.id === model.icon)[theme];
        const source = await (
          await fetch(`/motion/${model.id}-${theme}.svg`)
        ).text();
        if (!valid(source))
          failures.push({ model: model.id, theme, reason: 'XML inválido' });
        // Congela imagens SVG em três quadros reais. O desenho fica em <use>,
        // sem replicar payloads; tolerância apenas para rasterização subpixel.
        const freeze = phase =>
          URL.createObjectURL(
            new Blob(
              [
                source.replace(
                  '</svg>',
                  `<style>.sk-scene *{animation-play-state:paused!important;animation-delay:calc(var(--sk-duration) * (var(--sk-delay,0) - ${phase}))!important}</style></svg>`
                ),
              ],
              { type: 'image/svg+xml' }
            )
          );
        const start = freeze(0);
        const initial = await pixels(start);
        URL.revokeObjectURL(start);
        const mae = mean(initial, await pixels('/svg/' + file));
        if (mae > 0.35)
          failures.push({
            model: model.id,
            theme,
            reason: 'repouso alterado',
            mae,
          });
        let movement = 0;
        for (const phase of [0.32, 0.55, 0.73]) {
          const url = freeze(phase);
          movement = Math.max(movement, mean(initial, await pixels(url)));
          URL.revokeObjectURL(url);
        }
        if (movement < 0.5)
          failures.push({
            model: model.id,
            theme,
            reason: 'sem movimento visual perceptível',
            movement,
          });
        previews++;
      }
    return { originals, previews, worstMeanError: worst, failures };
  });
  assert.deepEqual(report.failures, []);
  console.log(JSON.stringify(report));
} finally {
  await browser.close();
}
