import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import siteConfig from '../../site.config.mjs';

const withBase = (path: string) => `${siteConfig.basePath === '/' ? '' : siteConfig.basePath}${path}`;
const pages = ['/', '/empresa/', '/servicos/', '/projetos/', '/contactos/'];

for (const target of pages) {
  test(`@a11y ${target} has no serious accessibility issues`, async ({ page }) => {
    await page.goto(withBase(target));
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((violation) =>
      ['serious', 'critical'].includes(violation.impact || '')
    );
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
  });
}
