/** E2E opcional e estrito: requer servidor ativo e Playwright/Chromium disponíveis. */
import assert from 'node:assert/strict';

const candidates = [
  process.env.PLAYWRIGHT_CORE,
  'playwright-core',
  'playwright',
].filter(Boolean);
let chromium;
for (const candidate of candidates) {
  try {
    const module = await import(candidate);
    chromium = module.chromium ?? module.default?.chromium;
    if (chromium) break;
  } catch {
    /* tenta o próximo */
  }
}
if (!chromium)
  throw new Error(
    'Instale Playwright ou aponte PLAYWRIGHT_CORE para o módulo; a validação não foi executada.'
  );
const base =
  process.argv.find(a => a.startsWith('--base='))?.slice(7) ??
  'http://localhost:4173';
const browser = await chromium.launch({
  ...(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {}),
  args: ['--no-sandbox'],
});
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: 'no-preference',
  });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(base, { waitUntil: 'networkidle' });
  const manifest = await (
    await page.request.get(base + '/manifest.json')
  ).json();
  assert.equal(await page.locator('#resultados .tile').count(), manifest.count);
  // A Vercel precisa resolver as URLs públicas sem extensão das páginas.
  const navigation = await page.evaluate(async () => {
    const paths = [
      ...new Set(
        [...document.querySelectorAll('.site-nav a[href]')].map(
          a => new URL(a.href).pathname
        )
      ),
    ];
    return Promise.all(
      paths.map(async path => ({ path, status: (await fetch(path)).status }))
    );
  });
  for (const route of navigation)
    assert.equal(route.status, 200, `Navegação: ${route.path}`);
  const queries = {
    'lucide-react': 'lucide',
    'golangci-lint': 'golangci',
    'Framer Motion': 'motion',
    'Socket.IO': 'socketio',
    'Jupyter Notebook': 'jupyter',
    'PL/pgSQL': 'postgresql',
    Dockerfile: 'docker',
    'GitHub OAuth': 'github',
    Procfile: 'heroku',
    'Docker Compose': 'docker',
    HTML5: 'html',
    CSS3: 'css',
    'Node.js': 'nodejs',
    Claude: 'claude',
    Gemini: 'gemini',
    Radon: 'radon',
    Bandit: 'bandit',
  };
  for (const [query, id] of Object.entries(queries)) {
    await page.locator('#busca').fill(query);
    assert.equal(
      await page.locator('#resultados .tile').first().getAttribute('data-id'),
      id,
      query
    );
  }
  await page.locator('#busca').fill('<img src=x onerror="window.auditXss=1">');
  assert.equal(await page.locator('#resultados img').count(), 0);
  assert.equal(await page.evaluate(() => window.auditXss), undefined);
  assert.match(await page.locator('#resultados').textContent(), /<img/);
  await page.evaluate(() => {
    localStorage.setItem('si:selecao', '{}');
    localStorage.setItem('si:categoria', 'linguagens');
    localStorage.setItem('si:perline', 'Infinity');
    localStorage.setItem('si:formato', 'garbage');
  });
  await page.reload({ waitUntil: 'networkidle' });
  assert.ok((await page.locator('#resultados .tile').count()) > 0);
  assert.equal(
    await page
      .locator('#filtros [aria-pressed="true"]')
      .getAttribute('data-cat'),
    'linguagens'
  );
  assert.equal(await page.locator('#perline').inputValue(), '15');
  assert.equal(await page.locator('#formato').inputValue(), 'svg');
  await page.locator('#filtros [data-cat=""]').click();
  await page.locator('#resultados .tile').first().focus();
  await page.keyboard.press('End');
  await page.locator('#filtros [data-cat="linguagens"]').click();
  assert.equal(await page.locator('#resultados [tabindex="0"]').count(), 1);
  await page.locator('#resultados [data-id="python"]').focus();
  await page.evaluate(() =>
    document.querySelector('[data-tema="dark"]').click()
  );
  assert.equal(
    await page.evaluate(() => document.activeElement.dataset.id),
    'python'
  );
  await page.locator('#filtros [data-cat=""]').click();
  await page.locator('#busca').fill('bandit');
  await page.locator('#resultados .tile').click();
  await page.waitForFunction(
    () =>
      document.querySelector('#preview img')?.complete &&
      document.querySelector('#preview img').naturalWidth > 0
  );
  assert.match(
    await page.locator('#saida').textContent(),
    /bandit.*animation=true/
  );
  const pendingDownload = page.waitForEvent('download');
  await page.locator('#baixar-lote').click();
  const download = await pendingDownload;
  assert.equal(download.suggestedFilename(), 'bandit-animated.svg');
  assert.equal(await download.failure(), null);
  await page.locator('#animar-icones').uncheck();
  assert.doesNotMatch(
    await page.locator('#saida').textContent(),
    /animation=true/
  );
  await page.locator('#animar-icones').check();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForFunction(
    () =>
      !document.querySelector('#saida').textContent.includes('animation=true')
  );
  assert.equal(await page.locator('#animar-icones').isDisabled(), true);
  // Choreografia do site: uma camada por ícone, apenas enquanto visível.
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.mouse.move(0, 0);
  const bandit = page.locator('#resultados [data-id="bandit"]');
  await bandit.scrollIntoViewIfNeeded();
  await page.waitForFunction(() =>
    document.querySelector(
      '#resultados [data-id="bandit"] [data-motion-overlay]'
    )
  );
  assert.equal(await bandit.locator('[data-motion-overlay]').count(), 1);
  assert.equal(
    await bandit.locator('[data-motion-overlay]').getAttribute('aria-hidden'),
    'true'
  );
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  assert.equal(await page.locator('[data-motion-overlay]').count(), 0);
  await page.evaluate(() => {
    delete document.hidden;
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.waitForFunction(() =>
    document.querySelector(
      '#resultados [data-id="bandit"] [data-motion-overlay]'
    )
  );
  await page.locator('#api').scrollIntoViewIfNeeded();
  await page.waitForFunction(
    () =>
      !document.querySelector(
        '#resultados [data-id="bandit"] [data-motion-overlay]'
      )
  );
  await bandit.scrollIntoViewIfNeeded();
  await page.waitForFunction(() =>
    document.querySelector(
      '#resultados [data-id="bandit"] [data-motion-overlay]'
    )
  );
  await page.locator('#limpar').click();
  await page.mouse.move(0, 0);
  await page.waitForFunction(
    () => !document.querySelector('#resultados [data-motion-overlay]')
  );
  const ready = page.waitForResponse(r =>
    new URL(r.url()).pathname.endsWith('/svg/animated/Ruff-Dark.svg')
  );
  let failures = 0;
  await page.route('**/svg/animated/Ruff-Dark.svg*', route => {
    failures++;
    return route.fulfill({ status: 404, body: 'missing' });
  });
  await page.locator('#busca').fill('ruff');
  const ruff = page.locator('#resultados [data-id="ruff"]');
  await ruff.hover();
  await ready;
  await page.waitForFunction(() => {
    const tile = document.querySelector('#resultados [data-id="ruff"]');
    const img = tile?.querySelector('img:not([data-motion-overlay])');
    return (
      !tile?.querySelector('[data-motion-overlay]') &&
      img?.complete &&
      img.naturalWidth > 0
    );
  });
  assert.equal(await ruff.locator('[data-motion-overlay]').count(), 0);
  assert.equal(
    await ruff
      .locator('img')
      .evaluate(img => img.complete && img.naturalWidth > 0),
    true
  );
  assert.equal(failures, 1);

  // Galeria: pesquisa, comparação, URL, pin único, teclado, pausa e redução.
  await page.goto(base + '/animacoes', { waitUntil: 'networkidle' });
  await page.waitForSelector('.motion-card');
  assert.equal(await page.locator('.motion-card').count(), 85);
  assert.equal(await page.locator('[data-motion-overlay]').count(), 0);
  await page.locator('#motion-category').selectOption('marca');
  assert.equal(await page.locator('.motion-card').count(), 8);
  await page.locator('#motion-search').fill('fusão');
  assert.equal(await page.locator('.motion-card').count(), 1);
  await page
    .locator('#motion-search')
    .fill('<img src=x onerror="window.auditXss=1">');
  assert.equal(await page.locator('.motion-card').count(), 0);
  assert.equal(await page.evaluate(() => window.auditXss), undefined);
  await page.locator('#motion-search').fill('');
  await page.locator('#motion-category').selectOption('tecnologia');
  await page.locator('#motion-icon').selectOption('gemini');
  const card = page.locator('[data-model="reator-atomico"]');
  assert.match(
    await card.locator('a[download]').getAttribute('href'),
    /i=gemini.*model=reator-atomico/
  );
  const button = card.locator('.motion-preview');
  await button.focus();
  await page.keyboard.press('Enter');
  assert.equal(await button.getAttribute('aria-pressed'), 'true');
  await page.waitForFunction(
    () =>
      document.querySelector(
        '[data-model="reator-atomico"] [data-motion-overlay]'
      )?.naturalWidth > 0
  );
  const other = page.locator(
    '[data-model="serpentes-entrelacadas"] .motion-preview'
  );
  await other.click();
  assert.equal(await button.getAttribute('aria-pressed'), 'false');
  assert.equal(
    await page.locator('.motion-preview[aria-pressed="true"]').count(),
    1
  );
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForFunction(
    () => !document.querySelector('[data-motion-overlay]')
  );
  assert.equal(await page.locator('#animar-icones').isDisabled(), true);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.locator('#animar-icones').uncheck();
  assert.equal(await page.locator('[data-motion-overlay]').count(), 0);
  await page.locator('#animar-icones').check();

  // Coleção do usuário: associação exclusiva, aliases e URL compartilhável.
  await page.locator('[data-motion-collection="arsenal"]').click();
  assert.equal(await page.locator('.motion-card').count(), 46);
  assert.ok(new URL(page.url()).searchParams.get('colecao') === 'arsenal');
  await page.locator('#motion-search').fill('Docker Compose');
  assert.equal(await page.locator('.motion-card').count(), 1);
  assert.match(
    await page.locator('.motion-card').getAttribute('data-model'),
    /carga-containers/
  );
  await page.locator('#motion-search').fill('');
  await page.reload({ waitUntil: 'networkidle' });
  assert.equal(await page.locator('.motion-card').count(), 46);
  const arsenalModels = await page
    .locator('.motion-card')
    .evaluateAll(cards => cards.map(c => c.dataset.model));
  assert.equal(new Set(arsenalModels).size, 46);
  const bulkUrl = new URL(
    await page.locator('#motion-download-arsenal').getAttribute('href'),
    base
  );
  assert.equal(bulkUrl.searchParams.get('i').split(',').length, 46);
  assert.equal(bulkUrl.searchParams.get('animation'), 'true');
  assert.equal(bulkUrl.searchParams.has('model'), false);
  const bulkPending = page.waitForEvent('download');
  await page.locator('#motion-download-arsenal').click();
  const bulkDownload = await bulkPending;
  assert.equal(bulkDownload.suggestedFilename(), 'meu-arsenal-animado.svg');
  assert.equal(await bulkDownload.failure(), null);

  await page.locator('#motion-category').selectOption('marca');
  assert.equal(await page.locator('.motion-card').count(), 3);
  await page.locator('[data-motion-collection=""]').click();
  assert.equal(await page.locator('.motion-card').count(), 85);

  // CSS realmente executado e parado em cada SVG independente.
  const library = await page.evaluate(async () =>
    (await fetch('/animations.json')).json()
  );
  for (const model of library.models) {
    await page.goto(`${base}/motion/${model.id}-dark.svg`);
    const changed = await page
      .locator('.sk-scene')
      .evaluate((scene, duration) => {
        const animations = document.getAnimations();
        if (!animations.length) return false;
        for (const a of animations) {
          a.pause();
          a.currentTime = 0;
        }
        const nodes = [...scene.querySelectorAll('[class]')];
        const snapshot = () =>
          nodes
            .map(el => {
              const s = getComputedStyle(el);
              return [
                s.transform,
                s.opacity,
                s.strokeDashoffset,
                s.strokeWidth,
                s.filter,
              ].join('|');
            })
            .join(';');
        const before = snapshot();
        for (const phase of [0.32, 0.55, 0.73]) {
          for (const a of animations) a.currentTime = duration * 1000 * phase;
          if (snapshot() !== before) return true;
        }
        return false;
      }, model.duration);
    assert.equal(changed, true, model.id);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert.equal(
      await page.evaluate(() => document.getAnimations().length),
      0,
      model.id
    );
    assert.equal(
      await page
        .locator('.sk-rest')
        .evaluate(el => getComputedStyle(el).opacity),
      '1'
    );
    await page.emulateMedia({ reducedMotion: 'no-preference' });
  }
  assert.deepEqual(errors, []);
  console.log(
    `E2E passou: ${manifest.count} ícones, aliases, HTML literal, estado inválido, filtros, teclado, preview, SVG, movimento reduzido, pausa fora da tela, fallback, galeria, arsenal exclusivo e os ${library.models.length} modelos animados.`
  );
} finally {
  await browser.close();
}
