// Testes dos formulários sobre a pasta dist/, com o Apps Script simulado (nada é enviado ao Google).
// Uso, na raiz do repositório:
//   node scripts/publicar.cjs
//   node docs/formularios/testar-formularios.mjs
// Precisa do Playwright e do axe (node_modules/@playwright/test, node_modules/@axe-core/playwright).

import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { chromium } from '@playwright/test'
import { AxeBuilder } from '@axe-core/playwright'

const DIST = path.resolve('dist')
const PORTA = 5598
const BASE = `http://127.0.0.1:${PORTA}/`
// Endereço fictício: os testes intercetam-no (o formato é o de uma aplicação Web real).
const ENDPOINT_TESTE = 'https://script.google.com/macros/s/AKfycbTESTE0000000000000000000000000000000/exec'

if (!fs.existsSync(path.join(DIST, 'index.html'))) {
  console.error('Falta dist/: corra primeiro node scripts/publicar.cjs')
  process.exit(1)
}

const TIPOS = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json', '.xml': 'application/xml', '.txt': 'text/plain' }
const servidor = http.createServer((req, res) => {
  let ficheiro = path.join(DIST, decodeURIComponent(new URL(req.url, BASE).pathname))
  if (!ficheiro.startsWith(DIST)) { res.writeHead(403); return res.end() }
  if (fs.existsSync(ficheiro) && fs.statSync(ficheiro).isDirectory()) ficheiro = path.join(ficheiro, 'index.html')
  if (!fs.existsSync(ficheiro)) { res.writeHead(404, { 'content-type': TIPOS['.html'] }); return res.end(fs.readFileSync(path.join(DIST, '404.html'))) }
  res.writeHead(200, { 'content-type': TIPOS[path.extname(ficheiro)] || 'application/octet-stream' })
  res.end(fs.readFileSync(ficheiro))
})
await new Promise((r) => servidor.listen(PORTA, '127.0.0.1', r))

const resultados = []
const registar = (nome, ok, detalhe = '') => {
  resultados.push({ nome, ok })
  console.log(`${ok ? 'OK   ' : 'FALHA'} ${nome}${detalhe ? `: ${detalhe}` : ''}`)
}
const browser = await chromium.launch()

/** Página com o formularios.js a usar o endereço de teste e o Apps Script simulado. */
async function abrir(caminho, resposta = { status: 200, body: { ok: true } }, { comEndpoint = true, js = true, largura = 1440 } = {}) {
  const contexto = await browser.newContext({ javaScriptEnabled: js, viewport: { width: largura, height: 900 }, locale: 'pt-PT' })
  const page = await contexto.newPage()
  const pedidos = []
  const erros = []
  page.on('pageerror', (e) => erros.push(e.message))
  // O formularios.js é sempre servido com o endereço de teste (ou vazio): nunca se envia nada para o
  // script verdadeiro, mesmo depois de o ENDPOINT real estar no ficheiro.
  await page.route('**/assets/js/formularios.js*', async (route) => {
    const original = fs.readFileSync(path.join(DIST, 'assets/js/formularios.js'), 'utf8')
    const corpo = original.replace(/const ENDPOINT = '[^']*';/, `const ENDPOINT = '${comEndpoint ? ENDPOINT_TESTE : ''}';`)
    if (corpo === original && !original.includes("const ENDPOINT = '" + (comEndpoint ? ENDPOINT_TESTE : '') + "';")) throw new Error('não consegui trocar o ENDPOINT')
    await route.fulfill({ contentType: 'text/javascript', body: corpo })
  })
  // Rede de segurança: qualquer pedido ao Apps Script verdadeiro é bloqueado.
  await page.route(/script.google.com/, (route) => (route.request().url().startsWith(ENDPOINT_TESTE) ? route.fallback() : route.abort('blockedbyclient')))
  await page.route(`${ENDPOINT_TESTE}*`, async (route) => {
    pedidos.push(route.request())
    if (resposta === 'falha') return route.abort('failed')
    return route.fulfill({ status: resposta.status, headers: { 'access-control-allow-origin': '*', 'content-type': 'application/json' }, body: JSON.stringify(resposta.body) })
  })
  await page.goto(BASE + caminho)
  return { page, pedidos, erros, fechar: () => contexto.close() }
}

async function preencherOrcamento(page, { telefone = '912 345 678', email = '' } = {}) {
  await page.fill('#orc-nome', 'Maria Teste')
  await page.fill('#orc-localidade', 'Seixal')
  if (telefone) await page.fill('#orc-telefone', telefone)
  if (email) await page.fill('#orc-email', email)
  await page.selectOption('#orc-servico', 'Remodelação de cozinhas')
  await page.selectOption('#orc-inicio', 'Dentro de 1 a 3 meses')
  await page.fill('#orc-descricao', 'Remodelação completa de uma cozinha com cerca de 12 m².')
  await page.check('#orc-privacidade')
  await page.waitForTimeout(4200) // tempo de preenchimento realista
}

const estado = (page, sel) => page.locator(`${sel} [data-estado]`).textContent()

// 1. Orçamento: validação
{
  const { page, pedidos, erros, fechar } = await abrir('#contactos')
  const form = 'form[data-formulario="orcamento"]'
  await page.locator(`${form} .form__enviar`).click()
  const focado = await page.evaluate(() => document.activeElement && document.activeElement.id)
  const visiveis = await page.locator(`${form} .form__erro:not([hidden])`).count()
  registar('Orçamento vazio: erros nos campos e foco no primeiro', focado === 'orc-nome' && visiveis >= 6 && pedidos.length === 0, `foco ${focado}, ${visiveis} erros`)
  await page.fill('#orc-email', 'nao-e-email')
  await page.locator(`${form} .form__enviar`).click()
  registar('Orçamento: e-mail inválido', (await page.locator('#orc-email-erro').textContent()).includes('não parece válido'))
  registar('Sem erros de JavaScript', erros.length === 0, erros.join(' | '))
  await fechar()
}

// 2. Orçamento: envio com sucesso
{
  const { page, pedidos, fechar } = await abrir('#contactos')
  await preencherOrcamento(page)
  await page.click('form[data-formulario="orcamento"] .form__enviar')
  await page.waitForFunction(() => /Recebemos/.test(document.querySelector('form[data-formulario="orcamento"] [data-estado]').textContent))
  const p = pedidos[0]
  const corpo = Object.fromEntries(new URLSearchParams(p.postData()))
  const tipo = p.headers()['content-type'] || ''
  registar('Orçamento: um envio, POST, corpo urlencoded e sem cabeçalhos próprios',
    pedidos.length === 1 && p.method() === 'POST' && tipo.startsWith('application/x-www-form-urlencoded') && !Object.keys(p.headers()).some((h) => h.startsWith('x-') || h === 'authorization'), tipo)
  registar('Orçamento: campos enviados',
    corpo.formulario === 'orcamento' && corpo.nome === 'Maria Teste' && corpo.telefone === '912 345 678' && !('email' in corpo) && corpo.servico === 'Remodelação de cozinhas' && corpo.inicio === 'Dentro de 1 a 3 meses' && corpo.privacidade === 'sim' && Number(corpo.t) >= 4000 && !('campo_k7x' in corpo),
    JSON.stringify(corpo))
  registar('Orçamento: formulário limpo depois do sucesso', (await page.inputValue('#orc-nome')) === '' && !(await page.isChecked('#orc-privacidade')))
  registar('Orçamento: o foco fica no botão depois de enviar', await page.evaluate(() => document.activeElement && document.activeElement.classList.contains('form__enviar')))
  await fechar()
}

// 3. Orçamento: erros do servidor e da rede
for (const [caso, resposta] of [['ok:false do script', { status: 200, body: { ok: false, codigo: 'invalido' } }], ['falha de rede', 'falha']]) {
  const { page, fechar } = await abrir('#contactos', resposta)
  await preencherOrcamento(page)
  await page.click('form[data-formulario="orcamento"] .form__enviar')
  await page.waitForFunction(() => /Não foi possível/.test(document.querySelector('form[data-formulario="orcamento"] [data-estado]').textContent))
  const t = await estado(page, 'form[data-formulario="orcamento"]')
  registar(`Orçamento, ${caso}: erro com telefone (e nota da chamada) e e-mail`, t.includes('+351 919 233 372 (chamada para a rede móvel nacional)') && t.includes('mendes3pm@gmail.com'))
  registar(`Orçamento, ${caso}: dados mantidos para tentar de novo`, (await page.inputValue('#orc-nome')) === 'Maria Teste')
  await fechar()
}

// 3b. Respostas de erro do script: campos recusados e formulário desligado
{
  const { page, fechar } = await abrir('#contactos', { status: 200, body: { ok: false, codigo: 'invalido', campos: ['localidade'] } })
  await preencherOrcamento(page)
  await page.click('form[data-formulario="orcamento"] .form__enviar')
  await page.waitForFunction(() => !document.querySelector('#orc-localidade-erro').hidden)
  const foco = await page.evaluate(() => document.activeElement && document.activeElement.id)
  registar('Orçamento, campos recusados pelo script: erro no campo e foco nele', foco === 'orc-localidade', `foco ${foco}`)
  await fechar()
}
{
  const { page, fechar } = await abrir('#contactos', { status: 200, body: { ok: false, codigo: 'indisponivel' } })
  await preencherOrcamento(page)
  await page.click('form[data-formulario="orcamento"] .form__enviar')
  await page.waitForFunction(() => /De momento/.test(document.querySelector('form[data-formulario="orcamento"] [data-estado]').textContent))
  const t = await estado(page, 'form[data-formulario="orcamento"]')
  registar('Orçamento, formulário desligado no script: mensagem sem "tente novamente"', !t.includes('Tente novamente') && t.includes('(chamada para a rede móvel nacional)'))
  await fechar()
}

// 4. Candidatura
{
  const { page, pedidos, erros, fechar } = await abrir('trabalhe-connosco/')
  const form = 'form[data-formulario="candidatura"]'
  await page.locator(`${form} .form__enviar`).click()
  registar('Candidatura vazia: telefone obrigatório', (await page.locator('#cand-telefone-erro').textContent()).includes('Indique o seu telefone') && pedidos.length === 0)
  await page.fill('#cand-nome', 'João Teste')
  await page.fill('#cand-telefone', '+351 912 345 678')
  await page.selectOption('#cand-profissao', 'Pintor/a')
  await page.fill('#cand-zona', 'Seixal e Almada')
  await page.selectOption('#cand-experiencia', '5 a 10 anos')
  await page.selectOption('#cand-disponibilidade', 'Imediata')
  await page.check('#cand-privacidade')
  await page.waitForTimeout(4200)
  await page.locator(`${form} .form__enviar`).click()
  await page.waitForFunction(() => /candidatura/.test(document.querySelector('form[data-formulario="candidatura"] [data-estado]').textContent))
  const corpo = Object.fromEntries(new URLSearchParams(pedidos[0].postData()))
  registar('Candidatura: campos enviados (sem mensagem, que é opcional)',
    corpo.formulario === 'candidatura' && corpo.profissao === 'Pintor/a' && corpo.experiencia === '5 a 10 anos' && !('mensagem' in corpo) && corpo.privacidade === 'sim', JSON.stringify(corpo))
  registar('Candidatura: mensagem de sucesso própria', (await estado(page, form)).includes('Recebemos a sua candidatura'))
  registar('Candidatura: sem erros de JavaScript', erros.length === 0, erros.join(' | '))
  await fechar()
}

// 5. Sem endereço (o formularios.js real, com ENDPOINT vazio) e sem JavaScript
for (const [caso, opcoes] of [['sem endereço', { comEndpoint: false }], ['sem JavaScript', { comEndpoint: false, js: false }]]) {
  for (const caminho of ['#contactos', 'trabalhe-connosco/']) {
    const { page, fechar } = await abrir(caminho, undefined, opcoes)
    const botao = await page.locator('form[data-formulario] .form__enviar').isVisible()
    const nota = await page.locator('form[data-formulario] .form__nojs').isVisible()
    registar(`${caso}, ${caminho}: botão escondido e nota com os contactos`, !botao && nota)
    await fechar()
  }
}

// 6. Campo-armadilha, acessibilidade (axe) e largura de telemóvel
for (const caminho of ['', 'trabalhe-connosco/']) {
  const { page, fechar } = await abrir(caminho, undefined, { largura: 390 })
  const armadilha = await page.locator('input[name="campo_k7x"]').evaluate((el) => {
    const r = el.getBoundingClientRect()
    return { foraDoEcra: r.right < 0 || r.left > innerWidth, tabindex: el.tabIndex }
  })
  registar(`${caminho || 'página inicial'}: campo-armadilha fora do ecrã e fora do teclado`, armadilha.foraDoEcra && armadilha.tabindex === -1)
  const largura = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  registar(`${caminho || 'página inicial'}: sem deslocamento horizontal a 390 px`, largura <= 0, `${largura} px`)
  const axe = await new AxeBuilder({ page }).include('form[data-formulario]').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()
  const graves = axe.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
  registar(`${caminho || 'página inicial'}: axe sem violações graves no formulário`, graves.length === 0, graves.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`).join(' | '))
  await fechar()
}

await browser.close()
servidor.close()
const falhas = resultados.filter((r) => !r.ok).length
console.log(`\n${resultados.length - falhas} de ${resultados.length} verificações certas.`)
process.exit(falhas ? 1 : 0)
