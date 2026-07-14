import { expect, test } from '@playwright/test';
import siteConfig from '../../site.config.mjs';

const withBase = (path: string) => `${siteConfig.basePath === '/' ? '' : siteConfig.basePath}${path}`;

test('homepage loads and exposes primary calls to action', async ({ page }) => {
  await page.goto(withBase('/'));
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Construímos com experiência');
  await expect(page.getByRole('link', { name: 'Pedir orçamento' }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Conhecer os serviços' })).toBeVisible();
});

test('main navigation routes are reachable directly', async ({ page }) => {
  const routes = ['/', '/empresa/', '/servicos/', '/projetos/', '/contactos/', '/privacidade/'];
  for (const route of routes) {
    await page.goto(withBase(route));
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  }
});

test('projects page uses honest empty state', async ({ page }) => {
  await page.goto(withBase('/projetos/'));
  await expect(page.getByText('Projetos em preparação')).toBeVisible();
});

test('404 route renders recovery actions', async ({ page }) => {
  await page.goto(withBase('/404.html'));
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Página não encontrada');
});

test('robots and main assets are reachable under the configured base path', async ({ request }) => {
  const robots = await request.get(withBase('/robots.txt'));
  expect(robots.ok()).toBe(true);
  await expect(robots.text()).resolves.toContain('Sitemap:');

  const asset = await request.get(withBase('/brand/lmdreams-logo.png'));
  expect(asset.ok()).toBe(true);
});

test('mobile navigation works on small viewport', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 320, height: 640 } });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:${process.env.PLAYWRIGHT_PORT || '4325'}${withBase('/')}`);
  await page.getByRole('button', { name: 'Abrir menu principal' }).click();
  await expect(page.locator('[data-nav-panel]').getByRole('link', { name: 'Serviços' })).toBeVisible();
  await context.close();
});

test('contact information placeholders are visible', async ({ page }) => {
  await page.goto(withBase('/contactos/'));
  await expect(page.getByText('[TELEFONE A CONFIRMAR]').first()).toBeVisible();
  await expect(page.getByText('[EMAIL A CONFIRMAR]').first()).toBeVisible();
});

test('contact form shows validation summary', async ({ page }) => {
  await page.goto(withBase('/contactos/'));
  await page.getByRole('button', { name: 'Enviar pedido' }).click();
  await expect(page.locator('[data-form-summary]')).toBeVisible();
});

test('contact form success state can be tested with mock endpoint', async ({ page }) => {
  await page.goto(withBase('/contactos/'));
  await page.evaluate(() => {
    const form = document.querySelector('[data-contact-form]') as HTMLFormElement;
    form.dataset.endpoint = 'https://mock.endpoint/success';
    form.action = 'https://mock.endpoint/success';
    const button = form.querySelector('[data-submit-button]') as HTMLButtonElement;
    button.disabled = false;
    const dev = document.querySelector('[data-form-dev-mode]') as HTMLElement | null;
    if (dev) dev.hidden = true;
  });

  await page.route('https://mock.endpoint/success', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });

  await page.getByLabel('Nome').fill('Ana Silva');
  await page.getByLabel('Email').fill('ana@exemplo.pt');
  await page.getByLabel('Telefone').fill('+351912345678');
  await page.getByLabel('Localidade da obra').fill('Lisboa');
  await page.getByLabel('Tipo de trabalho').selectOption('outro');
  await page.getByLabel('Descrição da necessidade').fill('Preciso de apoio para uma remodelação completa do apartamento.');
  await page.getByRole('checkbox', { name: 'Li a informação de privacidade e autorizo o tratamento do pedido.' }).check();
  await page.getByRole('button', { name: 'Enviar pedido' }).click();

  await expect(page.locator('[data-form-success]')).toBeVisible();
});

test('contact form error state can be tested with mock endpoint', async ({ page }) => {
  await page.goto(withBase('/contactos/'));
  await page.evaluate(() => {
    const form = document.querySelector('[data-contact-form]') as HTMLFormElement;
    form.dataset.endpoint = 'https://mock.endpoint/fail';
    form.action = 'https://mock.endpoint/fail';
    const button = form.querySelector('[data-submit-button]') as HTMLButtonElement;
    button.disabled = false;
    const dev = document.querySelector('[data-form-dev-mode]') as HTMLElement | null;
    if (dev) dev.hidden = true;
  });

  await page.route('https://mock.endpoint/fail', async (route) => {
    await route.fulfill({ status: 422, contentType: 'application/json', body: '{}' });
  });

  await page.getByLabel('Nome').fill('Ana Silva');
  await page.getByLabel('Email').fill('ana@exemplo.pt');
  await page.getByLabel('Telefone').fill('+351912345678');
  await page.getByLabel('Localidade da obra').fill('Porto');
  await page.getByLabel('Tipo de trabalho').selectOption('outro');
  await page.getByLabel('Descrição da necessidade').fill('Procuro orçamento para reparações e melhorias.');
  await page.getByRole('checkbox', { name: 'Li a informação de privacidade e autorizo o tratamento do pedido.' }).check();
  await page.getByRole('button', { name: 'Enviar pedido' }).click();

  await expect(page.locator('[data-form-error]')).toBeVisible();
});

test('keyboard navigation reaches skip link and main content', async ({ page }) => {
  await page.goto(withBase('/'));
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Saltar para o conteúdo principal' })).toBeFocused();
});
