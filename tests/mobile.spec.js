import { test, expect } from '@playwright/test';

test('Pages assets, mobile geometry, source/build visual parity, and theme behavior', async ({ page, context, request }, testInfo) => {
  const errors = [];
  const assets = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('requestfailed', request => errors.push(request.url()));
  page.on('response', response => {
    if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
    if (['stylesheet', 'script', 'font'].includes(response.request().resourceType())) assets.push(response.url());
  });
  await page.goto('./');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('html')).toHaveAttribute('data-theme', testInfo.project.use.colorScheme);

  expect((await request.get('/assets/missing.css')).status()).toBe(404);
  expect((await request.get('/vaishnavi-portfolio/assets/missing.css')).status()).toBe(404);
  expect(assets.filter(url => url.endsWith('.woff2'))).toHaveLength(3);
  for (const asset of assets) {
    const url = new URL(asset);
    expect(url.origin).toBe('http://127.0.0.1:4173');
    expect(url.pathname).toMatch(/^\/vaishnavi-portfolio\/assets\/.+-[\w-]{8,}\.(css|js|woff2)$/);
  }
  const fonts = await page.evaluate(() => [...document.fonts].map(font => ({ family: font.family, status: font.status })));
  expect(fonts.map(font => font.family).sort()).toEqual(['Inter', 'JetBrains Mono', 'Space Grotesk']);
  expect(fonts.every(font => font.status === 'loaded')).toBe(true);

  const geometry = await page.evaluate(() => {
    const visible = element => !element.closest('[aria-hidden="true"]') && element.getClientRects().length > 0;
    const controls = [...document.querySelectorAll('a, button')]
      .filter(element => visible(element) && !element.classList.contains('skip-link'));
    const smallTargets = controls.filter(element => {
      const rect = element.getBoundingClientRect();
      return rect.width < 44 || rect.height < 44;
    }).map(element => element.outerHTML);
    // Curved stamp lettering and the redundant photo registration mark are decorative.
    const smallText = [...document.querySelectorAll('body *')].filter(element =>
      visible(element) && !['SCRIPT', 'STYLE'].includes(element.tagName) &&
      [...element.childNodes].some(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim()) &&
      parseFloat(getComputedStyle(element).fontSize) < 14,
    ).map(element => element.outerHTML);
    const stamps = [...document.querySelectorAll('.stampboard .stamp')].map(element => element.getBoundingClientRect());
    const stampCollision = stamps.some((a, index) => stamps.slice(index + 1).some(b =>
      a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top,
    ));
    return {
      overflow: document.documentElement.scrollWidth > innerWidth,
      smallTargets, smallText, stampCollision,
      clippedStamp: stamps.some(rect => rect.left < 0 || rect.right > innerWidth),
    };
  });
  expect(geometry).toEqual({ overflow: false, smallTargets: [], smallText: [], stampCollision: false, clippedStamp: false });

  // Compare against the unbundled source in the same browser/OS, avoiding
  // platform-dependent font rasterization baselines and catching build drift.
  const reference = await context.newPage();
  await reference.goto('/reference/');
  await reference.evaluate(() => document.fonts.ready);
  const sourceImage = await reference.screenshot({ fullPage: true, animations: 'disabled' });
  const builtImage = await page.screenshot({ fullPage: true, animations: 'disabled' });
  await testInfo.attach('source', { body: sourceImage, contentType: 'image/png' });
  await testInfo.attach('production', { body: builtImage, contentType: 'image/png' });
  expect(builtImage.equals(sourceImage), 'Built pixels must match unbundled source').toBe(true);
  await reference.close();

  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await page.locator('#theme-toggle').tap();
  const nextTheme = testInfo.project.use.colorScheme === 'dark' ? 'light' : 'dark';
  await expect(page.locator('html')).toHaveAttribute('data-theme', nextTheme);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', nextTheme);
  for (const id of ['about', 'skills', 'projects', 'achievements', 'contact']) {
    await page.locator(`.topbar__nav a[href="#${id}"]`).tap();
    const top = await page.locator(`#${id}`).evaluate(element => element.getBoundingClientRect().top);
    expect(top).toBeGreaterThanOrEqual(0);
    expect(top).toBeLessThan(testInfo.project.use.viewport.height);
  }
  expect(errors).toEqual([]);
});
