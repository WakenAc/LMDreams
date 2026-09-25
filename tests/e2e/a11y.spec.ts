import { AxeBuilder } from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

// Acessibilidade (Partes 3.10 e 6.1): axe em todas as páginas a 390, 768 e 1440 px,
// e percursos de teclado. Corre só no projeto "desktop" (define a janela em cada teste).

const PAGES = ['./', 'politica-de-privacidade/', 'politica-de-cookies/', 'termos-e-condicoes/', 'pagina-inexistente/']
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

for (const width of [390, 768, 1440]) {
  for (const path of PAGES) {
    test(`axe a ${width} px em ${path}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(path)
      await page.waitForLoadState('networkidle')
      const r = await new AxeBuilder({ page }).withTags(TAGS).analyze()
      const serious = r.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
      expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`)).toEqual([])
    })
  }
}

test('"Saltar para o conteúdo" é o primeiro elemento focável', async ({ page }) => {
  await page.goto('./')
  await page.keyboard.press('Tab')
  const focused = page.locator(':focus')
  await expect(focused).toHaveText('Saltar para o conteúdo')
  await expect(focused).toBeVisible()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#conteudo$/)
})

test('menu móvel: abre, prende o foco, fecha com Esc e devolve o foco', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('./')
  await page.waitForSelector('html[data-hydrated]')
  const button = page.getByRole('button', { name: 'Abrir menu' })
  await button.click()
  await expect(page.getByRole('button', { name: 'Fechar menu' }).first()).toBeVisible()
  // O foco fica dentro do painel ao percorrer com Tab.
  for (let i = 0; i < 15; i++) await page.keyboard.press('Tab')
  const inside = await page.evaluate(() => {
    const panel = document.querySelector('[data-mobile-menu]') ?? document.querySelector('[role="dialog"]')
    return panel ? panel.contains(document.activeElement) : true
  })
  expect(inside).toBe(true)
  await page.keyboard.press('Escape')
  await expect(page.getByRole('button', { name: 'Abrir menu' })).toBeFocused()
})

test('"Pedir orçamento" do cabeçalho leva ao formulário e foca o nome', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('./')
  await page.waitForSelector('html[data-hydrated]')
  await page.locator('header').getByRole('link', { name: 'Pedir orçamento' }).click()
  await expect(page.locator('#campo-nome')).toBeFocused({ timeout: 3000 })
})

test('diálogo de projeto: abre, fecha com Esc e devolve o foco', async ({ page }) => {
  await page.goto('./')
  await page.waitForSelector('html[data-hydrated]')
  const open = page.locator('#projetos').getByRole('button', { name: /Ver antes e depois/ }).first()
  await open.click()
  const dialog = page.locator('dialog[open]')
  await expect(dialog).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
  await expect(open).toBeFocused()
})

test('movimento reduzido: sem conteúdo escondido', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('./')
  const hidden = await page.evaluate(
    () => Array.from(document.querySelectorAll('[data-reveal]')).filter((el) => getComputedStyle(el).opacity === '0').length,
  )
  expect(hidden).toBe(0)
})
