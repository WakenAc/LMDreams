import { expect, test } from '@playwright/test'

// Conteúdo completo e visível sem JavaScript (Parte 1.4, regra 10).
test.use({ javaScriptEnabled: false })

const SECTIONS = [
  'inicio',
  'sobre',
  'diferenciacao',
  'servicos',
  'metodo',
  'projetos',
  'transparencia',
  'testemunhos',
  'orcamento',
  'contactos',
]

test('página principal sem JavaScript: todas as secções e o formulário', async ({ page }) => {
  await page.goto('./')
  await expect(page.locator('h1')).toHaveCount(1)
  for (const id of SECTIONS) {
    await expect(page.locator(`#${id}`)).toBeVisible()
  }
  await expect(page.locator('form[data-lead-form]')).toHaveCount(1)
  // Sem JavaScript, o navegador valida os campos obrigatórios e a caixa da Política de
  // privacidade antes de abrir o programa de e-mail.
  await expect(page.locator('form[data-lead-form]')).toHaveJSProperty('noValidate', false)
  // Nada fica escondido à espera de JavaScript.
  const hidden = await page.evaluate(() =>
    Array.from(document.querySelectorAll('main *'))
      .filter((el) => {
        const s = getComputedStyle(el)
        return (el.textContent ?? '').trim().length > 0 && (s.opacity === '0' || s.visibility === 'hidden')
      })
      .filter((el) => !el.closest('dialog, [aria-hidden="true"], .sr-only'))
      .map((el) => el.tagName)
      .slice(0, 10),
  )
  expect(hidden).toEqual([])
})

for (const path of ['politica-de-privacidade/', 'politica-de-cookies/', 'termos-e-condicoes/']) {
  test(`${path} sem JavaScript: índice e secções`, async ({ page }) => {
    await page.goto(path)
    await expect(page.locator('h1')).toHaveCount(1)
    expect(await page.locator('main h2').count()).toBeGreaterThan(3)
  })
}
