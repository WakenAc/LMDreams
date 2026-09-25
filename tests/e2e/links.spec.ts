import { expect, test } from '@playwright/test'

// Navegação (Partes 3.4, 3.5 e 3.14): âncoras, páginas legais e 404 em qualquer profundidade.

test('navegação principal: cada ligação leva à sua secção', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('./')
  const nav = page.getByRole('navigation', { name: 'Navegação principal' })
  for (const [label, id] of [
    ['Sobre nós', 'sobre'],
    ['Serviços', 'servicos'],
    ['Método de trabalho', 'metodo'],
    ['Projetos', 'projetos'],
    ['Contactos', 'contactos'],
  ] as const) {
    await nav.getByRole('link', { name: label, exact: true }).click()
    await expect(page).toHaveURL(new RegExp(`#${id}$`))
    await expect(page.locator(`#${id}`)).toBeInViewport()
  }
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
