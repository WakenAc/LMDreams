import { expect, test } from '@playwright/test';
import siteConfig from '../../site.config.mjs';

const withBase = (path: string) => `${siteConfig.basePath === '/' ? '' : siteConfig.basePath}${path}`;
const routes = [
  '/',
  '/empresa/',
  '/servicos/',
  '/servicos/construcao-remodelacao/',
  '/projetos/',
  '/contactos/',
  '/privacidade/',
  '/404.html'
];

const breakpoints = [
  { name: 'mobile', width: 320, height: 640 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 900 }
];

for (const breakpoint of breakpoints) {
  test(`all public routes avoid horizontal overflow at ${breakpoint.name}`, async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: breakpoint.width, height: breakpoint.height }
    });
    const page = await context.newPage();

    for (const route of routes) {
      await page.goto(`http://127.0.0.1:${process.env.PLAYWRIGHT_PORT || '4322'}${withBase(route)}`);
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const tolerance = breakpoint.name === 'mobile' ? 2 : 1;
      expect(scrollWidth).toBeLessThanOrEqual(breakpoint.width + tolerance);
    }

    await context.close();
  });
}

test('primary interactive targets remain at least 44px high on mobile', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 320, height: 640 } });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:${process.env.PLAYWRIGHT_PORT || '4322'}${withBase('/')}`);

  const menuButton = page.getByRole('button', { name: 'Abrir menu principal' });
  const ctaButton = page.getByRole('link', { name: 'Pedir orçamento' }).first();

  const menuBox = await menuButton.boundingBox();
  const ctaBox = await ctaButton.boundingBox();

  expect(menuBox?.height ?? 0).toBeGreaterThanOrEqual(44);
  expect(ctaBox?.height ?? 0).toBeGreaterThanOrEqual(44);

  await context.close();
});
