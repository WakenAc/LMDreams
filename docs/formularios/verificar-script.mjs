// Verifica a aplicação Web do Apps Script publicada (o endereço de assets/js/formularios.js).
// Uso, na raiz do repositório:
//   node docs/formularios/verificar-script.mjs            (só verificações que não gravam nada)
//   node docs/formularios/verificar-script.mjs --gravar   (também envia, pelo próprio site, um pedido de
//                                                          orçamento e uma candidatura de teste, um envio
//                                                          repetido e um suspeito; depois apagar as linhas)
// Precisa do Playwright (node_modules/@playwright/test) e de dist/ (node scripts/publicar.cjs).

import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { chromium } from '@playwright/test'

const GRAVAR = process.argv.includes('--gravar')
const DIST = path.resolve('dist')
const ENDPOINT = (fs.readFileSync('assets/js/formularios.js', 'utf8').match(/const ENDPOINT = '([^']*)'/) || [])[1]
if (!ENDPOINT) {
  console.error('assets/js/formularios.js não tem ENDPOINT.')
  process.exit(1)
}
if (GRAVAR && !fs.existsSync(path.join(DIST, 'index.html'))) {
  console.error('Falta dist/: corra primeiro node scripts/publicar.cjs')
  process.exit(1)
}

const resultados = []
const registar = (nome, ok, detalhe = '') => {
  resultados.push(ok)
  console.log(`${ok ? 'OK   ' : 'FALHA'} ${nome}${detalhe ? `: ${detalhe}` : ''}`)
}
const MARCA = `TESTE LMDreams ${new Date().toISOString().slice(0, 16)} (apagar)`

// 1. Sem navegador: o caminho do pedido e os cabeçalhos CORS.
{
  const primeiro = await fetch(ENDPOINT, { redirect: 'manual' })
  const destino = primeiro.headers.get('location') || ''
  registar('GET: 302 com Access-Control-Allow-Origin *', primeiro.status === 302 && primeiro.headers.get('access-control-allow-origin') === '*', `${primeiro.status}`)
  if (destino) {
    const final = await fetch(destino)
    const json = await final.json().catch(() => null)
    registar('GET: resposta final em JSON, com CORS, do script dos formulários',
      final.headers.get('access-control-allow-origin') === '*' && json && json.ok === true && json.servico === 'formularios-lmdreams', JSON.stringify(json))
  }
}

// 2. No navegador, a partir de outra origem, como o site.
const TIPOS = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.ico': 'image/x-icon' }
const servidor = http.createServer((req, res) => {
  let f = path.join(DIST, decodeURIComponent(new URL(req.url, 'http://x').pathname))
  if (!fs.existsSync(DIST)) { res.writeHead(200, { 'content-type': TIPOS['.html'] }); return res.end('<!doctype html><title>Teste</title>') }
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html')
  if (!fs.existsSync(f)) { res.writeHead(404); return res.end() }
  res.writeHead(200, { 'content-type': TIPOS[path.extname(f)] || 'application/octet-stream' })
  res.end(fs.readFileSync(f))
})
await new Promise((r) => servidor.listen(5596, '127.0.0.1', r))
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
await page.goto('http://127.0.0.1:5596/')

const enviar = (campos) =>
  page.evaluate(async ({ url, campos }) => {
    const inicio = performance.now()
    try {
      const r = await fetch(url, { method: 'POST', body: new URLSearchParams(campos) })
      return { json: await r.json(), ms: Math.round(performance.now() - inicio) }
    } catch (erro) {
      return { erro: String(erro), ms: Math.round(performance.now() - inicio) }
    }
  }, { url: ENDPOINT, campos })

const vazio = await enviar({ formulario: 'orcamento', privacidade: 'nao' })
registar('Orçamento vazio: recusado com os campos em falta (nada gravado)',
  vazio.json && vazio.json.ok === false && vazio.json.codigo === 'invalido' && ['nome', 'localidade', 'servico', 'inicio', 'descricao', 'contacto', 'privacidade'].every((c) => vazio.json.campos.includes(c)),
  `${vazio.ms} ms, ${JSON.stringify(vazio.json || vazio.erro)}`)

const desconhecido = await enviar({ formulario: 'orcamento', nome: 'x', campo_estranho: '1' })
registar('Campo desconhecido: recusado', desconhecido.json && desconhecido.json.codigo === 'invalido', JSON.stringify(desconhecido.json || desconhecido.erro))

const formularioErrado = await enviar({ formulario: 'outro' })
registar('Formulário desconhecido: recusado', formularioErrado.json && formularioErrado.json.codigo === 'invalido', JSON.stringify(formularioErrado.json || formularioErrado.erro))

const listaErrada = await enviar({ formulario: 'orcamento', nome: 'Teste', telefone: '912345678', localidade: 'Seixal', servico: 'Serviço inventado', inicio: 'Ainda não sei', descricao: 'Descrição de teste com mais de dez caracteres.', privacidade: 'sim', t: '6000' })
registar('Opção fora da lista: recusada', listaErrada.json && listaErrada.json.codigo === 'invalido' && listaErrada.json.campos.includes('servico'), JSON.stringify(listaErrada.json || listaErrada.erro))

const armadilha = await enviar({ formulario: 'orcamento', nome: MARCA, telefone: '912345678', localidade: 'Seixal', servico: 'Outro', inicio: 'Ainda não sei', descricao: 'Pedido de teste com o campo-armadilha preenchido.', privacidade: 'sim', t: '6000', campo_k7x: 'robô' })
registar('Campo-armadilha preenchido: resposta de sucesso (e nada gravado)', armadilha.json && armadilha.json.ok === true, JSON.stringify(armadilha.json || armadilha.erro))

if (GRAVAR) {
  // 3. Envios reais pelo próprio site (formularios.js com o ENDPOINT verdadeiro).
  await page.goto('http://127.0.0.1:5596/#contactos')
  await page.waitForTimeout(800)
  await page.fill('#orc-nome', MARCA)
  await page.fill('#orc-localidade', 'Seixal')
  await page.fill('#orc-telefone', '00351 912 345 678')
  await page.selectOption('#orc-servico', 'Outro')
  await page.selectOption('#orc-inicio', 'Ainda não sei')
  await page.fill('#orc-descricao', '=1+1 Pedido de teste do site: apagar esta linha.')
  await page.check('#orc-privacidade')
  await page.waitForTimeout(4500)
  await page.click('form[data-formulario="orcamento"] .form__enviar')
  await page.waitForFunction(() => /Recebemos|Não foi possível|De momento/.test(document.querySelector('form[data-formulario="orcamento"] [data-estado]').textContent), null, { timeout: 30000 })
  const orc = await page.locator('form[data-formulario="orcamento"] [data-estado]').textContent()
  registar('Pedido de orçamento real pelo site: "Recebemos"', orc.includes('Recebemos'), orc)

  await page.goto('http://127.0.0.1:5596/trabalhe-connosco/')
  await page.waitForTimeout(800)
  await page.fill('#cand-nome', MARCA)
  await page.fill('#cand-telefone', '+351 912 345 678')
  await page.selectOption('#cand-profissao', 'Outra')
  await page.fill('#cand-zona', 'Seixal')
  await page.selectOption('#cand-experiencia', '1 a 3 anos')
  await page.selectOption('#cand-disponibilidade', 'Mais tarde')
  await page.fill('#cand-mensagem', 'Candidatura de teste do site: apagar esta linha.')
  await page.check('#cand-privacidade')
  await page.waitForTimeout(4500)
  await page.click('form[data-formulario="candidatura"] .form__enviar')
  await page.waitForFunction(() => /Recebemos|Não foi possível|De momento/.test(document.querySelector('form[data-formulario="candidatura"] [data-estado]').textContent), null, { timeout: 30000 })
  const cand = await page.locator('form[data-formulario="candidatura"] [data-estado]').textContent()
  registar('Candidatura real pelo site: "Recebemos"', cand.includes('Recebemos'), cand)

  const suspeito = await enviar({ formulario: 'orcamento', nome: MARCA, telefone: '912345678', localidade: 'Seixal', servico: 'Outro', inicio: 'Ainda não sei', descricao: 'Pedido suspeito de teste com ligação https://exemplo.invalid', privacidade: 'sim', t: '6000' })
  registar('Envio com ligação: resposta de sucesso (vai para "Suspeitos", sem aviso)', suspeito.json && suspeito.json.ok === true, `${suspeito.ms} ms`)
  const repetido = await enviar({ formulario: 'orcamento', nome: MARCA, telefone: '912345678', localidade: 'Seixal', servico: 'Outro', inicio: 'Ainda não sei', descricao: 'Pedido suspeito de teste com ligação https://exemplo.invalid', privacidade: 'sim', t: '6000' })
  registar('O mesmo envio repetido: resposta de sucesso (ignorado, sem linha nova)', repetido.json && repetido.json.ok === true, `${repetido.ms} ms`)

  console.log(`\nNa folha devem estar 3 linhas com "${MARCA}": 1 em "Orçamentos" (telefone 00351…, descrição a começar por "=1+1" como texto), 1 em "Candidaturas" e 1 em "Suspeitos". Os avisos por e-mail são 2 (orçamento e candidatura). Depois de confirmar, apague as 3 linhas.`)
}

await browser.close()
servidor.close()
const falhas = resultados.filter((ok) => !ok).length
console.log(`\n${resultados.length - falhas} de ${resultados.length} verificações certas.`)
process.exit(falhas ? 1 : 0)
