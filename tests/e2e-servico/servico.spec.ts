import { expect, test, type Page, type Request } from '@playwright/test'

// Formulário com serviço de formulários ativo (build de npm run build:servico, com
// VITE_FORM_ENDPOINT de teste e VITE_FORM_ACCEPTS_FILES=true). Os pedidos ao endereço de
// teste são intercetados: confirmam o que o serviço (o Formward, em produção) recebe e como o
// formulário reage às respostas documentadas em formward.eu/docs/responses.

const ENDPOINT = 'https://formulario.exemplo.test/f/teste'
const ORIGEM = 'http://localhost:4175'
const CORS = {
  'access-control-allow-origin': ORIGEM,
  'access-control-allow-methods': 'POST, OPTIONS',
  'access-control-allow-headers': 'content-type',
  vary: 'Origin',
}

type Resposta = { status: number; body: unknown } | 'falha-de-rede'

/** Interceta o endereço de envio; devolve a lista dos pedidos POST recebidos. */
async function intercetar(page: Page, resposta: Resposta = { status: 200, body: { ok: true, id: 'teste', files: [] } }) {
  const pedidos: Request[] = []
  await page.route(`${ENDPOINT}**`, async (route) => {
    const pedido = route.request()
    if (pedido.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS })
    pedidos.push(pedido)
    if (resposta === 'falha-de-rede') return route.abort('failed')
    return route.fulfill({
      status: resposta.status,
      headers: { ...CORS, 'content-type': 'application/json' },
      body: JSON.stringify(resposta.body),
    })
  })
  return pedidos
}

async function formularioHidratado(page: Page) {
  await page.goto('./#contactos')
  await page.waitForSelector('html[data-hydrated]')
  const form = page.locator('form[data-lead-form]')
  await expect(form).toHaveJSProperty('noValidate', true)
  return form
}

async function preencher(page: Page, contacto: { email?: string; telefone?: string } = { email: 'maria@exemplo.pt' }) {
  await page.locator('#campo-nome').fill('Maria Teste')
  if (contacto.telefone) await page.locator('#campo-telefone').fill(contacto.telefone)
  if (contacto.email) await page.locator('#campo-email').fill(contacto.email)
  await page.locator('#campo-localizacao').fill('Leiria')
  await page.locator('#campo-mensagem').fill('Remodelação de uma casa de banho com cerca de 6 m².')
  await page.locator('#campo-privacidade').check()
}

const imagem = (name: string, mimeType: string, bytes = 2048) => ({ name, mimeType, buffer: Buffer.alloc(bytes, 1) })

test('envio em JSON: campos, assunto, "Responder a" e mensagem de sucesso', async ({ page }) => {
  const pedidos = await intercetar(page)
  const form = await formularioHidratado(page)
  await preencher(page)
  await form.locator('[data-lead-submit]').click()
  await expect(page.locator('#contactos [role="status"]').first()).toContainText('Recebemos o seu pedido')

  expect(pedidos).toHaveLength(1)
  const pedido = pedidos[0]!
  expect(pedido.method()).toBe('POST')
  expect(pedido.headers()['content-type']).toBe('application/json')
  expect(pedido.headers()['accept']).toBe('application/json')
  const corpo = pedido.postDataJSON() as Record<string, string>
  expect(corpo).toMatchObject({
    _subject: 'Pedido de orçamento pelo site',
    subject: 'Pedido de orçamento pelo site',
    _replyto: 'maria@exemplo.pt',
    name: 'Maria Teste',
    email: 'maria@exemplo.pt',
    location: 'Leiria',
    message: 'Remodelação de uma casa de banho com cerca de 6 m².',
  })
  // Nem a caixa da Política de privacidade, nem o campo-armadilha, nem campos vazios.
  expect(Object.keys(corpo).sort()).toEqual(['_replyto', '_subject', 'email', 'location', 'message', 'name', 'subject'])
})

test('só com telefone: sem "Responder a"', async ({ page }) => {
  const pedidos = await intercetar(page)
  const form = await formularioHidratado(page)
  await preencher(page, { telefone: '912 345 678' })
  await form.locator('[data-lead-submit]').click()
  await expect(page.locator('#contactos [role="status"]').first()).toContainText('Recebemos o seu pedido')
  const corpo = pedidos[0]!.postDataJSON() as Record<string, string>
  expect(corpo.phone).toBe('912 345 678')
  expect(corpo).not.toHaveProperty('_replyto')
  expect(corpo).not.toHaveProperty('email')
})

for (const [caso, resposta] of [
  ['quota esgotada (402)', { status: 402, body: { ok: false, error: 'quota exceeded' } }],
  ['200 com ok: false', { status: 200, body: { ok: false, error: 'rejected' } }],
  ['falha de rede', 'falha-de-rede'],
] as const) {
  test(`erro do serviço, ${caso}: mensagem de erro com as alternativas`, async ({ page }) => {
    const pedidos = await intercetar(page, resposta)
    const form = await formularioHidratado(page)
    await preencher(page)
    await form.locator('[data-lead-submit]').click()
    await expect(form.locator('[role="alert"]').first()).toContainText('Não foi possível enviar o pedido')
    await expect(form.locator('a[href^="tel:"]')).toBeVisible()
    await expect(page.locator('#contactos')).not.toContainText('Recebemos o seu pedido')
    expect(pedidos).toHaveLength(1)
  })
}

test('campo-armadilha preenchido: nada é enviado', async ({ page }) => {
  const pedidos = await intercetar(page)
  const form = await formularioHidratado(page)
  await preencher(page)
  await page.locator('[name="campo_k7x"]').fill('robô', { force: true })
  await form.locator('[data-lead-submit]').click()
  await expect(page.locator('#contactos [role="status"]').first()).toContainText('Recebemos o seu pedido')
  expect(pedidos).toHaveLength(0)
})

test('fotografias: multipart com um campo attachment por fotografia', async ({ page }) => {
  const pedidos = await intercetar(page)
  const form = await formularioHidratado(page)
  await preencher(page)
  const campo = page.locator('#campo-fotografias')
  await expect(campo).toHaveAttribute('accept', 'image/jpeg,image/png,image/webp')
  await campo.setInputFiles([imagem('cozinha.jpg', 'image/jpeg'), imagem('sala.png', 'image/png')])
  await expect(form.getByRole('button', { name: 'Remover cozinha.jpg' })).toBeVisible()
  await expect(form.getByRole('button', { name: 'Remover sala.png' })).toBeVisible()
  await form.locator('[data-lead-submit]').click()
  await expect(page.locator('#contactos [role="status"]').first()).toContainText('Recebemos o seu pedido')

  const pedido = pedidos[0]!
  expect(pedido.headers()['content-type']).toMatch(/^multipart\/form-data; boundary=/)
  const corpo = pedido.postDataBuffer()?.toString('latin1') ?? ''
  expect(corpo).toContain('name="attachment"; filename="cozinha.jpg"')
  expect(corpo).toContain('name="attachment"; filename="sala.png"')
  expect(corpo).toContain('Content-Type: image/jpeg')
  expect(corpo).toContain('name="_replyto"')
  expect(corpo).not.toContain('name="privacidade"')
})

test('fotografias HEIC recusadas no navegador (o serviço recusaria o pedido inteiro)', async ({ page }) => {
  const form = await formularioHidratado(page)
  await page.locator('#campo-fotografias').setInputFiles([imagem('quarto.heic', 'image/heic')])
  await expect(form).toContainText('O ficheiro “quarto.heic” não está num formato aceite. Use JPG, PNG ou WebP.')
  await expect(form.getByRole('button', { name: 'Remover quarto.heic' })).toHaveCount(0)
})

test('fotografias acima de 25 MB no total: a que passa do limite fica de fora', async ({ page }) => {
  const form = await formularioHidratado(page)
  const noveMB = 9 * 1024 * 1024
  await page
    .locator('#campo-fotografias')
    .setInputFiles([imagem('a.jpg', 'image/jpeg', noveMB), imagem('b.jpg', 'image/jpeg', noveMB), imagem('c.jpg', 'image/jpeg', noveMB)])
  await expect(form).toContainText('A fotografia “c.jpg” ficou de fora: no total, as fotografias não podem passar de 25 MB.')
  await expect(form.getByRole('button', { name: 'Remover a.jpg' })).toBeVisible()
  await expect(form.getByRole('button', { name: 'Remover b.jpg' })).toBeVisible()
  await expect(form.getByRole('button', { name: 'Remover c.jpg' })).toHaveCount(0)
})

test('Política de privacidade e aviso RGPD descrevem o serviço de formulários', async ({ page }) => {
  await page.goto('politica-de-privacidade/')
  const main = page.locator('main')
  await expect(main).toContainText('Formward, serviço da EGF Fastighetsservice AB (Suécia)')
  await expect(main).toContainText('o pedido e as fotografias seguem do seu navegador diretamente para o Formward')
  await expect(main).toContainText('No Formward, os pedidos e as fotografias são apagados automaticamente ao fim de 90 dias.')
  await expect(main).toContainText('Fotografias do espaço, se as anexar')
  await expect(main).not.toContainText('quando o formulário aceita ficheiros')
  await expect(main).not.toContainText('Serviço de formulários: nenhum')

  await page.goto('./#contactos')
  await expect(page.locator('[data-rgpd-notice]')).toContainText('a Formward, na Suécia, que recebe o formulário')
})
