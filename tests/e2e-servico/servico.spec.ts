import { expect, test, type Page, type Request } from '@playwright/test'

// Formulário com serviço de formulários ativo (build de npm run build:servico, com
// VITE_FORM_ENDPOINT de teste e VITE_FORM_ACCEPTS_FILES=true). Os pedidos ao endereço de
// teste são intercetados: confirmam o que o serviço (o Formward, em produção) recebe e como o
// formulário reage às respostas documentadas em formward.eu/docs/responses.

const ENDPOINT = 'https://formulario.exemplo.test/f/teste'
const ORIGEM = 'http://localhost:4175'
// Cabeçalho da resposta simulada: o Chromium confirma o CORS na resposta ao POST. A
// verificação prévia (OPTIONS) é respondida pelo próprio Playwright quando há interceção,
// por isso os cabeçalhos que o site envia são testados diretamente (cabecalhosDoSite).
const CORS = { 'access-control-allow-origin': ORIGEM, vary: 'Origin' }

// Cabeçalhos que o Formward aceita na verificação prévia (formward.eu/docs/ingest:
// "Access-Control-Allow-Headers: content-type").
const PERMITIDOS_PELO_SERVICO = ['content-type']

// Cabeçalhos que o próprio navegador põe (não contam para o CORS).
const DO_NAVEGADOR = new Set(['accept-encoding', 'accept-language', 'connection', 'content-length', 'cookie', 'host', 'origin', 'referer', 'user-agent'])

/** Cabeçalhos do pedido postos pelo código do site (sem os do navegador). */
function cabecalhosDoSite(pedido: Request): Record<string, string> {
  return Object.fromEntries(
    Object.entries(pedido.headers()).filter(([nome]) => !DO_NAVEGADOR.has(nome) && !nome.startsWith('sec-')),
  )
}

/**
 * Cabeçalhos que obrigam a verificação prévia do CORS (fora da lista "CORS-safelisted" da
 * norma Fetch). Têm de estar todos em PERMITIDOS_PELO_SERVICO, senão o navegador recusa o envio.
 */
function exigemVerificacaoPrevia(cabecalhos: Record<string, string>): string[] {
  return Object.entries(cabecalhos)
    .filter(([nome, valor]) => {
      if (nome === 'accept' || nome === 'accept-language' || nome === 'content-language') return false
      if (nome === 'content-type') {
        return !/^(application\/x-www-form-urlencoded|multipart\/form-data|text\/plain)(;|$)/i.test(valor)
      }
      return true
    })
    .map(([nome]) => nome)
}

type Resposta = { status: number; body: unknown } | 'falha-de-rede'

/** Interceta o endereço de envio; devolve a lista dos pedidos recebidos. */
async function intercetar(page: Page, resposta: Resposta = { status: 200, body: { ok: true, id: 'teste', files: [] } }) {
  const pedidos: Request[] = []
  await page.route(`${ENDPOINT}**`, async (route) => {
    const pedido = route.request()
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
  expect(Object.keys(corpo).toSorted()).toEqual(['_replyto', '_subject', 'email', 'location', 'message', 'name', 'subject'])
})

test('cabeçalhos do envio: só os que o serviço aceita no CORS, sem cookies', async ({ page }) => {
  const pedidos = await intercetar(page)
  const form = await formularioHidratado(page)

  // JSON: Accept e Content-Type; o application/json pede verificação prévia, que o serviço aceita.
  await preencher(page)
  await form.locator('[data-lead-submit]').click()
  await expect(page.locator('#contactos [role="status"]').first()).toContainText('Recebemos o seu pedido')
  const json = cabecalhosDoSite(pedidos[0]!)
  expect(Object.keys(json).toSorted()).toEqual(['accept', 'content-type'])
  for (const nome of exigemVerificacaoPrevia(json)) expect(PERMITIDOS_PELO_SERVICO).toContain(nome)
  expect(pedidos[0]!.headers()).not.toHaveProperty('cookie')

  // Com fotografias: multipart/form-data, sem verificação prévia.
  await preencher(page)
  await page.locator('#campo-fotografias').setInputFiles([imagem('cozinha.jpg', 'image/jpeg')])
  await expect(form.getByRole('button', { name: 'Remover cozinha.jpg' })).toBeVisible()
  await form.locator('[data-lead-submit]').click()
  await expect.poll(() => pedidos.length).toBe(2)
  const multipart = cabecalhosDoSite(pedidos[1]!)
  expect(Object.keys(multipart).toSorted()).toEqual(['accept', 'content-type'])
  expect(exigemVerificacaoPrevia(multipart)).toEqual([])
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
    const alerta = form.locator('[role="alert"]').first()
    await expect(alerta).toContainText('Não foi possível enviar o pedido. Tente novamente')
    // Sem fotografias, a mensagem não fala delas.
    await expect(alerta).not.toContainText('fotografias')
    await expect(form.locator('a[href^="tel:"]')).toBeVisible()
    await expect(page.locator('#contactos')).not.toContainText('Recebemos o seu pedido')
    expect(pedidos).toHaveLength(1)
  })
}

test('erro do serviço com fotografias: a mensagem sugere enviar sem elas', async ({ page }) => {
  await intercetar(page, { status: 413, body: { ok: false, error: 'payload too large' } })
  const form = await formularioHidratado(page)
  await preencher(page)
  await page.locator('#campo-fotografias').setInputFiles([imagem('cozinha.jpg', 'image/jpeg')])
  await expect(form.getByRole('button', { name: 'Remover cozinha.jpg' })).toBeVisible()
  await form.locator('[data-lead-submit]').click()
  const alerta = form.locator('[role="alert"]').first()
  await expect(alerta).toContainText('Não foi possível enviar o pedido com as fotografias. Retire as fotografias e tente novamente')
  await expect(alerta).toContainText('(chamada para a rede móvel nacional)')
})

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

test('fotografia grande reduzida no navegador antes do envio (JPEG, 2000 px no lado maior)', async ({ page }) => {
  const pedidos = await intercetar(page)
  const form = await formularioHidratado(page)
  test.setTimeout(90_000)
  await preencher(page)
  // PNG com ruído criado na própria página (passá-lo pelo Playwright era lento).
  const tamanhoOriginal = await escolherPngGrande(page)
  expect(tamanhoOriginal).toBeGreaterThan(10 * 1024 * 1024)

  await expect(form.getByRole('button', { name: 'Remover obra.jpg' })).toBeVisible()
  await expect(form.locator('[data-photos-preparing]')).toHaveCount(0)
  await form.locator('[data-lead-submit]').click()
  await expect(page.locator('#contactos [role="status"]').first()).toContainText('Recebemos o seu pedido')

  // A parte "attachment" do multipart: JPEG, mais pequena e com 2000 px no lado maior.
  const corpo = pedidos[0]!.postDataBuffer()!
  const cabecalho = 'name="attachment"; filename="obra.jpg"'
  const inicio = corpo.indexOf(cabecalho)
  expect(inicio).toBeGreaterThan(-1)
  const dados = corpo.indexOf('\r\n\r\n', inicio) + 4
  const fronteira = corpo.indexOf('\r\n--', dados)
  expect(corpo.subarray(inicio, dados).toString('latin1')).toContain('Content-Type: image/jpeg')
  const jpeg = corpo.subarray(dados, fronteira)
  expect(jpeg.length).toBeLessThan(tamanhoOriginal)
  const lados = await page.evaluate(async (base64) => {
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
    const bitmap = await createImageBitmap(new Blob([bytes], { type: 'image/jpeg' }))
    return [bitmap.width, bitmap.height]
  }, jpeg.toString('base64'))
  expect(lados).toEqual([2000, 1333])
})

/** PNG com ruído (3000 × 2000 px, mais de 10 MB) criado na página e posto no campo. */
async function escolherPngGrande(page: Page, nome = 'obra.png'): Promise<number> {
  return page.locator('#campo-fotografias').evaluate(async (campo: HTMLInputElement, nomeFicheiro: string) => {
    const tela = document.createElement('canvas')
    tela.width = 3000
    tela.height = 2000
    const contexto = tela.getContext('2d')!
    const pixeis = contexto.createImageData(3000, 2000)
    let x = 2463534242
    for (let i = 0; i < pixeis.data.length; i += 4) {
      for (let c = 0; c < 3; c += 1) {
        x ^= x << 13
        x ^= x >>> 17
        x ^= x << 5
        pixeis.data[i + c] = x & 255
      }
      pixeis.data[i + 3] = 255
    }
    contexto.putImageData(pixeis, 0, 0)
    const blob = await new Promise<Blob>((resolve) => tela.toBlob((b) => resolve(b!), 'image/png'))
    const transferencia = new DataTransfer()
    for (const atual of Array.from(campo.files ?? [])) transferencia.items.add(atual)
    transferencia.items.add(new File([blob], nomeFicheiro, { type: 'image/png' }))
    campo.files = transferencia.files
    campo.dispatchEvent(new Event('change', { bubbles: true }))
    return blob.size
  }, nome)
}

test('envio logo a seguir à escolha: espera pela redução e leva a fotografia reduzida', async ({ page }) => {
  test.setTimeout(90_000)
  const pedidos = await intercetar(page)
  const form = await formularioHidratado(page)
  await preencher(page)
  await escolherPngGrande(page)
  // Sem esperar pela lista: a preparação ainda está a decorrer no clique.
  await expect(form.locator('[data-photos-preparing]')).toBeVisible()
  await form.locator('[data-lead-submit]').click()
  await expect(page.locator('#contactos [role="status"]').first()).toContainText('Recebemos o seu pedido')
  expect(pedidos).toHaveLength(1)
  const corpo = pedidos[0]!.postDataBuffer()!.toString('latin1')
  const inicio = corpo.indexOf('name="attachment"; filename="obra.jpg"')
  expect(inicio).toBeGreaterThan(-1)
  expect(corpo.slice(inicio, corpo.indexOf('\r\n\r\n', inicio))).toContain('Content-Type: image/jpeg')
})

test('recusas que chegam depois do clique: o envio não segue e a recusa fica à vista', async ({ page }) => {
  test.setTimeout(90_000)
  const pedidos = await intercetar(page)
  const form = await formularioHidratado(page)
  await preencher(page)
  // Uma fotografia grande (ainda a ser reduzida no clique) e um HEIC, escolhidos de uma vez.
  await page.locator('#campo-fotografias').evaluate((campo: HTMLInputElement) => {
    const transferencia = new DataTransfer()
    transferencia.items.add(new File([new Uint8Array(2048).fill(1)], 'quarto.heic', { type: 'image/heic' }))
    campo.files = transferencia.files
  })
  await escolherPngGrande(page)
  await form.locator('[data-lead-submit]').click()
  await expect(form).toContainText('O ficheiro “quarto.heic” não está num formato aceite.')
  await expect(page.locator('#campo-fotografias')).toBeFocused()
  await expect(page.locator('#contactos')).not.toContainText('Recebemos o seu pedido')
  expect(pedidos).toHaveLength(0)
  // Visto o aviso, um segundo clique envia o pedido com a fotografia que entrou.
  await form.locator('[data-lead-submit]').click()
  await expect(page.locator('#contactos [role="status"]').first()).toContainText('Recebemos o seu pedido')
  expect(pedidos).toHaveLength(1)
})

test('durante o envio, o campo de fotografias e os botões de remover ficam desativados', async ({ page }) => {
  const responder: Array<() => void> = []
  const resposta = new Promise<void>((resolve) => responder.push(resolve))
  await page.route(`${ENDPOINT}**`, async (route) => {
    await resposta
    await route.fulfill({
      status: 200,
      headers: { ...CORS, 'content-type': 'application/json' },
      body: JSON.stringify({ ok: true, id: 'teste', files: [] }),
    })
  })
  const form = await formularioHidratado(page)
  await preencher(page)
  await page.locator('#campo-fotografias').setInputFiles([imagem('cozinha.jpg', 'image/jpeg')])
  await expect(form.getByRole('button', { name: 'Remover cozinha.jpg' })).toBeEnabled()
  await form.locator('[data-lead-submit]').click()
  await expect(form.locator('[data-lead-submit]')).toContainText('A enviar')
  await expect(page.locator('#campo-fotografias')).toBeDisabled()
  await expect(form.getByRole('button', { name: 'Remover cozinha.jpg' })).toBeDisabled()
  responder[0]!()
  await expect(page.locator('#contactos [role="status"]').first()).toContainText('Recebemos o seu pedido')
  await expect(page.locator('#campo-fotografias')).toBeEnabled()
})

test('fotografia sem tipo indicado pelo navegador: segue com o tipo da extensão', async ({ page }) => {
  const pedidos = await intercetar(page)
  const form = await formularioHidratado(page)
  await preencher(page)
  // Ficheiro sem tipo (como alguns navegadores entregam certas fotografias): só o DataTransfer o cria.
  await page.locator('#campo-fotografias').evaluate((campo: HTMLInputElement) => {
    const transferencia = new DataTransfer()
    transferencia.items.add(new File([new Uint8Array(2048).fill(1)], 'semtipo.jpg', { type: '' }))
    campo.files = transferencia.files
    campo.dispatchEvent(new Event('change', { bubbles: true }))
  })
  await expect(form.getByRole('button', { name: 'Remover semtipo.jpg' })).toBeVisible()
  await form.locator('[data-lead-submit]').click()
  await expect(page.locator('#contactos [role="status"]').first()).toContainText('Recebemos o seu pedido')
  const corpo = pedidos[0]!.postDataBuffer()!.toString('latin1')
  const inicio = corpo.indexOf('name="attachment"; filename="semtipo.jpg"')
  expect(inicio).toBeGreaterThan(-1)
  expect(corpo.slice(inicio, corpo.indexOf('\r\n\r\n', inicio))).toContain('Content-Type: image/jpeg')
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
  await expect(main).toContainText('Fotografias do espaço, se as anexar')
  await expect(main).not.toContainText('quando o formulário aceita ficheiros')
  await expect(main).not.toContainText('Serviço de formulários: nenhum')
  await expect(main).toContainText('regista também o endereço IP de onde o pedido foi enviado, em forma pseudonimizada')
  await expect(main).toContainText('com o endereço IP pseudonimizado que o Formward regista. Fundamento: interesse legítimo')
  await expect(main).toContainText('os pedidos, as fotografias e os endereços IP pseudonimizados são apagados automaticamente ao fim de 90 dias')
  // Uma data por página: só a Política de privacidade muda com o serviço.
  await expect(main.locator('p').filter({ hasText: 'Última atualização:' }).first()).toContainText('8 de outubro de 2026')
  for (const pagina of ['politica-de-cookies/', 'termos-e-condicoes/']) {
    await page.goto(pagina)
    await expect(page.locator('main p').filter({ hasText: 'Última atualização:' }).first()).toContainText('29 de setembro de 2026')
  }

  await page.goto('./#contactos')
  await expect(page.locator('[data-rgpd-notice]')).toContainText('a Formward, na Suécia, que recebe o formulário')
})
