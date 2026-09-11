import { defineConfig } from '@playwright/test';

const viewports = [
  { width: 320, height: 780 },
  { width: 375, height: 780 },
  { width: 390, height: 780 },
  { width: 430, height: 780 },
  { width: 780, height: 390 },
];

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    browserName: 'chromium',
    // Optional local Chrome; CI uses Playwright's pinned Chromium download.
    channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
    baseURL: 'http://127.0.0.1:4173/vaishnavi-portfolio/',
    reducedMotion: 'reduce',
    isMobile: true,
    hasTouch: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: ['light', 'dark'].flatMap(colorScheme =>
    viewports.map(viewport => ({
      name: `${colorScheme}-${viewport.width}x${viewport.height}`,
      use: { viewport, colorScheme },
    })),
  ),
  webServer: {
    command: 'node tests/serve.mjs',
    url: 'http://127.0.0.1:4173/vaishnavi-portfolio/',
    reuseExistingServer: false,
  },
});
