import { expect, test, type Page } from '@playwright/test'

// Navegação (Partes 3.4, 3.5 e 3.14): âncoras, páginas legais e 404 em qualquer profundidade.

const NAV_ITEMS = [
  ['Sobre nós', 'sobre'],
  ['Serviços', 'servicos'],
  ['Método de trabalho', 'metodo'],
  ['Projetos', 'projetos'],
  ['Contactos', 'contactos'],
  ['Início', 'inicio'],
] as const

/** O título da secção fica visível e abaixo do cabeçalho fixo (e não por baixo dele). */
async function headingBelowHeader(page: Page, id: string): Promise<void> {
  const heading = page.locator(`#${id}-titulo`)
  await expect(heading).toBeInViewport()
  await expect
    .poll(async () => {
      const header = await page.locator('header').first().boundingBox()
      const headerBottom = header ? header.y + header.height : 0
      const box = await heading.boundingBox()
      return box ? Math.round(box.y - headerBottom) : -1
    }, { message: `título de #${id} abaixo do cabeçalho` })
    .toBeGreaterThanOrEqual(0)
}

test('navegação principal: cada ligação leva à sua secção', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('./')
  const nav = page.getByRole('navigation', { name: 'Navegação principal' })
  for (const [label, id] of NAV_ITEMS) {
    await nav.getByRole('link', { name: label, exact: true }).click()
    await expect(page).toHaveURL(new RegExp(`#${id}$`))
    await expect(page.locator(`#${id}`)).toBeInViewport()
    await headingBelowHeader(page, id)
  }
})

test('menu móvel: cada ligação leva à sua secção, abaixo do cabeçalho', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('./')
  await page.waitForSelector('html[data-hydrated]')
  for (const [label, id] of NAV_ITEMS) {
    await page.getByRole('button', { name: 'Abrir menu' }).click()
    const panel = page.locator('[data-mobile-menu-panel]')
    await expect(panel).toBeVisible()
    await panel.getByRole('link', { name: label, exact: true }).click()
    await expect(panel).toBeHidden()
    await expect(page).toHaveURL(new RegExp(`#${id}$`))
    await headingBelowHeader(page, id)
  }
})

test('a partir de uma página legal, a navegação leva às secções da página principal', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('politica-de-privacidade/')
  await page.getByRole('navigation', { name: 'Navegação principal' }).getByRole('link', { name: 'Sobre nós', exact: true }).click()
  await expect(page).toHaveURL(/\/LMDreams\/#sobre$/)
  await headingBelowHeader(page, 'sobre')
})

test('rodapé: páginas legais abrem e voltam à página principal', async ({ page }) => {
  await page.goto('./')
  for (const [label, path] of [
    ['Política de privacidade', 'politica-de-privacidade/'],
    ['Política de cookies', 'politica-de-cookies/'],
    ['Termos e condições', 'termos-e-condicoes/'],
  ] as const) {
    await page.locator('footer').getByRole('link', { name: label, exact: true }).click()
    await expect(page).toHaveURL(new RegExp(`/LMDreams/${path}$`))
    await expect(page.locator('h1')).toHaveText(label)
    await page.goto('./')
  }
})

test('404 em profundidade: estilos carregam e as ligações funcionam', async ({ page }) => {
  const response = await page.goto('a/b/c/pagina-inexistente/')
  expect(response?.status()).toBe(404)
  await expect(page.locator('h1')).toHaveText('Página não encontrada')
  const bg = await page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor)
  expect(bg).not.toBe('rgba(0, 0, 0, 0)')
  await page.getByRole('link', { name: 'Voltar ao início', exact: true }).click()
  await expect(page).toHaveURL(/\/LMDreams\/$/)
})

test('sem barra final: redireciona para a página com barra', async ({ page }) => {
  await page.goto('politica-de-privacidade')
  await expect(page).toHaveURL(/politica-de-privacidade\/$/)
})
