import { AxeBuilder } from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

// Projetos (Parte 5.4 §7): filtros com aria-pressed e anúncio do número de resultados;
// diálogo acessível; sem JavaScript, todos os projetos visíveis e nenhum <dialog>.

test('filtros: aria-pressed, grelha filtrada e anúncio dos resultados', async ({ page }) => {
  await page.goto('./#projetos')
  await page.waitForSelector('html[data-hydrated]')
  const section = page.locator('#projetos')
  const total = await section.locator('li[data-project]').count()
  expect(total).toBe(7)
  const kitchens = section.getByRole('button', { name: 'Cozinhas', exact: true })
  await kitchens.click()
  await expect(kitchens).toHaveAttribute('aria-pressed', 'true')
  await expect(section.getByRole('button', { name: 'Todos', exact: true })).toHaveAttribute('aria-pressed', 'false')
  await expect(section.locator('li[data-project]')).toHaveCount(1)
  await expect(section.locator('[aria-live="polite"]')).toContainText('1')
})

test('diálogo aberto sem violações graves do axe', async ({ page }) => {
  await page.goto('./#projetos')
  await page.waitForSelector('html[data-hydrated]')
  await page.locator('#projetos').getByRole('button', { name: /Ver antes e depois/ }).first().click()
  await expect(page.locator('dialog[open]')).toBeVisible()
  const r = await new AxeBuilder({ page }).include('dialog[open]').withTags(['wcag2a', 'wcag2aa', 'wcag22aa']).analyze()
  const serious = r.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
  expect(serious.map((v) => v.id)).toEqual([])
})

test.describe('sem JavaScript', () => {
  test.use({ javaScriptEnabled: false })
  test('todos os projetos visíveis e nenhum diálogo no HTML', async ({ page }) => {
    await page.goto('./')
    await expect(page.locator('#projetos li[data-project]')).toHaveCount(7)
    await expect(page.locator('dialog')).toHaveCount(0)
  })
})
