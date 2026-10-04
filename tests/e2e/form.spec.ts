import { expect, test, type Page } from '@playwright/test'

// Formulário sobre um build com VITE_FORM_ENDPOINT vazio (Parte 3.8): validação,
// foco no primeiro erro e alternativa por e-mail, que nunca mostra "Recebemos".

// Sem JavaScript (e até à hidratação), a validação é a nativa; a própria só assume quando
// o formulário passa a ter `novalidate`.
async function hydratedForm(page: Page) {
  await page.waitForSelector('html[data-hydrated]')
  const form = page.locator('form[data-lead-form]')
  await expect(form).toHaveJSProperty('noValidate', true)
  return form
}

test('com JavaScript: botão de envio visível, nota escondida e sem action', async ({ page }) => {
  await page.goto('./#contactos')
  const form = await hydratedForm(page)
  await expect(form.locator('[data-lead-submit]')).toBeVisible()
  const nota = form.locator('[data-lead-nojs]')
  await expect(nota).toHaveCount(1)
  await expect(nota).toBeHidden()
  await expect(form).not.toHaveAttribute('action')
})

test('se a ilha do formulário não carregar: nota com o e-mail no lugar do botão', async ({ page }) => {
  await page.route('**/assets/contact-*.js', (route) => route.abort())
  await page.goto('./#contactos')
  await page.waitForSelector('html[data-lead-failed]', { state: 'attached' })
  const form = page.locator('form[data-lead-form]')
  await expect(form.locator('[data-lead-submit]')).toBeHidden()
  const nota = form.locator('[data-lead-nojs]')
  await expect(nota).toBeVisible()
  await expect(nota.locator('a[href^="mailto:mendes3pm@gmail.com?subject="]')).toHaveText('mendes3pm@gmail.com')
  // As outras ilhas continuam a funcionar; a marca de hidratação completa não é posta.
  await expect(page.locator('html[data-hydrated]')).toHaveCount(0)
})

test('validação: erros anunciados e foco no primeiro campo com erro', async ({ page }) => {
  await page.goto('./#contactos')
  const form = await hydratedForm(page)
  await form.locator('button[type="submit"]').click()
  await expect(page.locator('#campo-nome')).toBeFocused()
  await expect(page.locator('#campo-nome')).toHaveAttribute('aria-invalid', 'true')
  await expect(form).toContainText('Indique o seu nome.')
  await expect(form).toContainText('Indique um telefone ou um e-mail para podermos entrar em contacto consigo.')
  await expect(form).toContainText('Confirme que tomou conhecimento da Política de privacidade.')
})

// O carregador só pede o JavaScript depois do evento load (scripts/prerender.ts): até lá, o
// formulário do HTML pré-renderizado já aceita texto. O que foi escrito antes da hidratação
// tem de continuar lá depois dela, e contar para a validação própria.
test('o que se escreve antes da hidratação continua no formulário depois dela', async ({ page }) => {
  let release: (() => void) | undefined
  const gate = new Promise<void>((resolve) => {
    release = resolve
  })
  // Retém o chunk de entrada (index-<hash>.js) até o formulário estar preenchido.
  await page.route('**/assets/index-*.js', async (route) => {
    await gate
    await route.continue()
  })
  await page.goto('./#contactos')
  const form = page.locator('form[data-lead-form]')
  await page.locator('#campo-nome').fill('Maria Teste')
  await page.locator('#campo-email').fill('maria@exemplo.pt')
  await page.locator('#campo-localizacao').fill('Leiria')
  await page.locator('#campo-servico').selectOption({ index: 2 })
  const service = await page.locator('#campo-servico').inputValue()
  expect(service).not.toBe('')
  await page.locator('#campo-mensagem').fill('Remodelação de uma casa de banho com cerca de 6 m².')
  await page.locator('#campo-privacidade').check()
  // Ainda sem JavaScript: validação nativa e nenhuma marca de hidratação.
  await expect(page.locator('html[data-hydrated]')).toHaveCount(0)
  await expect(form).toHaveJSProperty('noValidate', false)

  release?.()
  await hydratedForm(page)
  await expect(page.locator('#campo-nome')).toHaveValue('Maria Teste')
  await expect(page.locator('#campo-email')).toHaveValue('maria@exemplo.pt')
  await expect(page.locator('#campo-localizacao')).toHaveValue('Leiria')
  await expect(page.locator('#campo-servico')).toHaveValue(service)
  await expect(page.locator('#campo-mensagem')).toHaveValue('Remodelação de uma casa de banho com cerca de 6 m².')
  await expect(page.locator('#campo-privacidade')).toBeChecked()

  // O estado do formulário tem os mesmos valores: o envio não acusa campos vazios.
  await form.locator('button[type="submit"]').click()
  await expect(page.locator('#contactos [role="status"]').first()).toContainText(/programa de e-mail/)
  await expect(form).not.toContainText('Indique o seu nome.')
  await expect(form).not.toContainText('Confirme que tomou conhecimento da Política de privacidade.')
})

test('modo por e-mail: abre o rascunho, oferece "Copiar pedido" e nunca diz "Recebemos"', async ({ page }) => {
  await page.goto('./#contactos')
  // O Chromium sem interface ignora o mailto: (não há programa de e-mail associado).
  const form = await hydratedForm(page)
  await page.locator('#campo-nome').fill('Maria Teste')
  await form.locator('input[type="email"]').fill('maria@exemplo.pt')
  await form.locator('input[autocomplete="address-level2"]').fill('Leiria')
  await form.locator('textarea').fill('Remodelação de uma casa de banho com cerca de 6 m².')
  await form.locator('input[type="checkbox"]').check()
  await form.locator('button[type="submit"]').click()
  await expect(page.locator('#contactos')).toContainText('mendes3pm@gmail.com')
  await expect(page.getByRole('button', { name: 'Copiar pedido' })).toBeVisible()
  await expect(page.locator('#contactos')).not.toContainText('Recebemos')
  const status = page.locator('#contactos [role="status"]')
  await expect(status.first()).toContainText(/programa de e-mail/)
})

test('modo por e-mail: a Política de privacidade e o aviso RGPD não falam de serviço de formulários', async ({ page }) => {
  await page.goto('politica-de-privacidade/')
  const main = page.locator('main')
  await expect(main).toContainText('Serviço de formulários: nenhum')
  await expect(main).not.toContainText('Formward')
  await expect(main).not.toContainText('pseudonimizad')
  await expect(main.locator('p').filter({ hasText: 'Última atualização:' }).first()).toContainText('29 de setembro de 2026')
  await page.goto('./#contactos')
  await expect(page.locator('[data-rgpd-notice]')).not.toContainText('Formward')
  // Sem serviço, o formulário não tem campo de fotografias.
  await expect(page.locator('#campo-fotografias')).toHaveCount(0)
})
