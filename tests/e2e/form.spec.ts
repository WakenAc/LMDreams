import { expect, test } from '@playwright/test'

// Formulário sobre um build com VITE_FORM_ENDPOINT vazio (Parte 3.8): validação,
// foco no primeiro erro e alternativa por e-mail, que nunca mostra "Recebemos".

test('validação: erros anunciados e foco no primeiro campo com erro', async ({ page }) => {
  await page.goto('./#contactos')
  const form = page.locator('form[data-lead-form]')
  await form.locator('button[type="submit"]').click()
  await expect(page.locator('#campo-nome')).toBeFocused()
  await expect(page.locator('#campo-nome')).toHaveAttribute('aria-invalid', 'true')
  await expect(form).toContainText('Indique o seu nome.')
  await expect(form).toContainText('Indique um telefone ou um e-mail para podermos entrar em contacto consigo.')
  await expect(form).toContainText('Confirme que tomou conhecimento da Política de privacidade.')
})

test('modo por e-mail: abre o rascunho, oferece "Copiar pedido" e nunca diz "Recebemos"', async ({ page }) => {
  await page.goto('./#contactos')
  // O Chromium sem interface ignora o mailto: (não há programa de e-mail associado).
  const form = page.locator('form[data-lead-form]')
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
