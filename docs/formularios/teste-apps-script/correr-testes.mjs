// Corre os testes da aplicação Web do Apps Script (Codigo.gs) a partir de uma página noutro
// domínio, como fará o site. Uso, na raiz do repositório:
//   node docs/formularios/teste-apps-script/correr-testes.mjs https://script.google.com/macros/s/…/exec
// Só envia dados fictícios. Precisa do Playwright (node_modules/@playwright/test).

import http from 'node:http'
import { randomUUID } from 'node:crypto'
import { chromium } from '@playwright/test'

const URL_SCRIPT = process.argv[2]
if (!URL_SCRIPT || !/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(URL_SCRIPT)) {
  console.error('Indique o endereço da aplicação Web: https://script.google.com/macros/s/…/exec')
  process.exit(1)
}

const resultados = []
const registar = (teste, ok, detalhe) => {
  resultados.push({ teste, ok, detalhe })
  console.log(`${ok ? 'OK   ' : 'FALHA'} ${teste}${detalhe ? `: ${detalhe}` : ''}`)
}

// 1. Sem navegador: o caminho do pedido (302 para script.googleusercontent.com) e os cabeçalhos CORS.
async function cabecalhos() {
  const primeiro = await fetch(`${URL_SCRIPT}?acao=ping`, { redirect: 'manual' })
  const destino = primeiro.headers.get('location') ?? ''
  registar(
    'GET: resposta 302 com Access-Control-Allow-Origin',
    primeiro.status === 302 && primeiro.headers.get('access-control-allow-origin') === '*',
    `${primeiro.status}, ACAO=${primeiro.headers.get('access-control-allow-origin')}, destino ${new URL(destino || 'https://x').host}`,
  )
  if (destino) {
    const final = await fetch(destino, { redirect: 'manual' })
    registar(
      'GET: resposta final com Access-Control-Allow-Origin',
      final.status === 200 && final.headers.get('access-control-allow-origin') === '*',
      `${final.status}, ACAO=${final.headers.get('access-control-allow-origin')}, tipo ${final.headers.get('content-type')}`,
    )
  }
  const preflight = await fetch(URL_SCRIPT, {
    method: 'OPTIONS',
    headers: { Origin: 'http://127.0.0.1:5599', 'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'content-type' },
    redirect: 'manual',
  })
  registar(
    'OPTIONS (verificação prévia): não suportado, como esperado',
    !preflight.headers.get('access-control-allow-origin'),
    `${preflight.status}, ACAO=${preflight.headers.get('access-control-allow-origin')}`,
  )
}

// 2. No navegador, a partir de outra origem (http://127.0.0.1:5599), como o site.
async function navegador() {
  const servidor = http.createServer((_, res) => {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
    res.end('<!doctype html><meta charset="utf-8"><title>Teste</title><p>Teste do Apps Script</p>')
  })
  await new Promise((resolve) => servidor.listen(5599, '127.0.0.1', resolve))
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto('http://127.0.0.1:5599/')

  const pedir = (opcoes) =>
    page.evaluate(
      async ({ url, opcoes }) => {
        const inicio = performance.now()
        try {
          const init = { method: opcoes.metodo }
          if (opcoes.corpo === 'urlsearchparams') init.body = new URLSearchParams(opcoes.campos)
          if (opcoes.corpo === 'formdata') {
            const dados = new FormData()
            for (const [k, v] of Object.entries(opcoes.campos)) dados.append(k, v)
            init.body = dados
          }
          if (opcoes.corpo === 'texto-json') init.body = JSON.stringify(opcoes.campos)
          if (opcoes.corpo === 'json-com-cabecalho') {
            init.body = JSON.stringify(opcoes.campos)
            init.headers = { 'Content-Type': 'application/json' }
          }
          const destino = opcoes.metodo === 'GET' ? `${url}?${new URLSearchParams(opcoes.campos)}` : url
          const resposta = await fetch(destino, init)
          const texto = await resposta.text()
          let json = null
          try {
            json = JSON.parse(texto)
          } catch {
            // não é JSON
          }
          return { lido: true, status: resposta.status, json, inicioTexto: json ? null : texto.slice(0, 120), ms: Math.round(performance.now() - inicio) }
        } catch (erro) {
          return { lido: false, erro: String(erro), ms: Math.round(performance.now() - inicio) }
        }
      },
      { url: URL_SCRIPT, opcoes },
    )

  // Envio normal (URLSearchParams): lê a resposta e grava exatamente uma linha.
  const id = randomUUID()
  const envio = await pedir({ metodo: 'POST', corpo: 'urlsearchparams', campos: { acao: 'gravar', teste_id: id, nome: 'Teste Fictício', mensagem: '=1+1 texto de teste' } })
  registar('POST URLSearchParams: resposta lida pelo site', envio.lido && envio.json?.ok === true, `${envio.ms} ms, ${JSON.stringify(envio.json ?? envio.erro ?? envio.inicioTexto)}`)
  const contagem = await pedir({ metodo: 'GET', campos: { acao: 'contar', teste_id: id } })
  registar('Um envio grava exatamente uma linha', contagem.json?.linhas === 1, `linhas com este identificador: ${contagem.json?.linhas}`)

  // Outros formatos: a resposta tem de ser lida e os campos têm de chegar à folha.
  for (const [nomeFormato, corpo] of [['FormData', 'formdata'], ['texto com JSON', 'texto-json']]) {
    const idFormato = randomUUID()
    const resposta = await pedir({ metodo: 'POST', corpo, campos: { acao: 'gravar', teste_id: idFormato, nome: `Teste ${nomeFormato}` } })
    const linhas = (await pedir({ metodo: 'GET', campos: { acao: 'contar', teste_id: idFormato } })).json?.linhas
    const campos = resposta.json?.campos ?? ''
    registar(
      `POST ${nomeFormato}: resposta lida e campos gravados`,
      resposta.lido && resposta.json?.ok === true && linhas === 1 && campos.includes('nome') && !campos.includes('_corpo_invalido'),
      `${resposta.ms} ms, tipo ${resposta.json?.tipo}, campos ${campos}, linhas ${linhas}`,
    )
  }

  const comCabecalho = await pedir({ metodo: 'POST', corpo: 'json-com-cabecalho', campos: { acao: 'gravar', teste_id: randomUUID() } })
  registar('POST com Content-Type application/json: falha, como esperado (não usar)', !comCabecalho.lido, comCabecalho.erro ?? JSON.stringify(comCabecalho.json))

  const tratado = await pedir({ metodo: 'POST', corpo: 'urlsearchparams', campos: { acao: 'erro-tratado' } })
  registar('Erro tratado no script: o site lê {ok:false}', tratado.lido && tratado.json?.ok === false, JSON.stringify(tratado.json ?? tratado.erro))

  const naoTratado = await pedir({ metodo: 'POST', corpo: 'urlsearchparams', campos: { acao: 'erro-nao-tratado' } })
  registar(
    'Erro não tratado: o que o site vê (informativo)',
    true,
    naoTratado.lido ? `lido, status ${naoTratado.status}, ${naoTratado.json ? JSON.stringify(naoTratado.json) : `não é JSON: ${naoTratado.inicioTexto}`}` : `não lido: ${naoTratado.erro}`,
  )

  const formulas = await pedir({ metodo: 'POST', corpo: 'urlsearchparams', campos: { acao: 'formulas' } })
  if (formulas.json?.metodos) {
    for (const [metodo, linhas] of Object.entries(formulas.json.metodos)) {
      const comFormula = linhas.filter((l) => l.formula)
      const esperado = metodo === 'sem-protecao' ? comFormula.length > 0 : comFormula.length === 0
      registar(
        `Fórmulas, método ${metodo}: ${metodo === 'sem-protecao' ? 'confirma o risco' : 'nenhuma fórmula guardada'}`,
        esperado,
        linhas.map((l) => `${JSON.stringify(l.enviado)} → ${l.formula ? `FÓRMULA ${l.formula}` : `texto ${JSON.stringify(l.mostrado)}`}`).join(' | '),
      )
    }
  } else {
    registar('Fórmulas', false, JSON.stringify(formulas.json ?? formulas.erro))
  }

  const regex = await pedir({ metodo: 'GET', campos: { acao: 'regex' } })
  registar(
    'Expressões por alfabeto (\\p{Script=…}) no Apps Script',
    regex.json?.ok === true && regex.json.latinoEmPortugues && !regex.json.cirilicoEmPortugues && regex.json.cirilicoEmRusso,
    JSON.stringify(regex.json),
  )

  const token = await pedir({ metodo: 'GET', campos: { acao: 'token' } })
  registar('Senha assinada (HMAC-SHA256) no Apps Script', token.json?.ok === true && token.json.assinaturaEstavel === true, `${token.ms} ms`)

  // Tempos de resposta (5 pedidos seguidos).
  const tempos = []
  for (let i = 0; i < 5; i += 1) tempos.push((await pedir({ metodo: 'GET', campos: { acao: 'ping' } })).ms)
  registar('Tempo de resposta (GET, 5 pedidos)', true, `${tempos.join(', ')} ms`)

  await browser.close()
  servidor.close()
}

await cabecalhos()
await navegador()
const falhas = resultados.filter((r) => !r.ok)
console.log(`\n${resultados.length - falhas.length} de ${resultados.length} verificações certas.`)
process.exit(falhas.length ? 1 : 0)
