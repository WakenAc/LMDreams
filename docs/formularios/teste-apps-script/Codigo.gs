/** @OnlyCurrentDoc */

/**
 * LMDreams: TESTE da ligação entre o site e uma folha de cálculo (Google Apps Script).
 *
 * Só para teste. Grava dados fictícios nos separadores "Testes" e "Testes-formulas"
 * desta folha e responde em JSON. Serve para confirmar, antes de construir os formulários:
 *   1. que o site consegue enviar e ler a resposta (CORS);
 *   2. que cada envio grava exatamente uma linha;
 *   3. que um texto começado por "=" fica gravado como texto e não como fórmula;
 *   4. o que o site recebe quando o script dá erro;
 *   5. que funcionam as peças da proteção anti-spam (expressões por alfabeto, assinatura HMAC).
 *
 * O endereço da aplicação Web é público enquanto o teste estiver publicado: o script nunca
 * grava mais de MAX_LINHAS linhas e não envia e-mails. No fim do teste, arquive a implementação
 * (Implementar → Gerir implementações → Arquivar).
 */

const SEPARADOR_TESTES = 'Testes'
const SEPARADOR_FORMULAS = 'Testes-formulas'
const MAX_LINHAS = 300

// Valores perigosos numa folha de cálculo (OWASP, injeção de fórmulas).
const VALORES_DE_RISCO = [
  '=1+1',
  '=HYPERLINK("https://exemplo.invalid","clique aqui")',
  '=IMPORTXML("https://exemplo.invalid","//a")',
  '+351919233372',
  '@teste',
  '-1+1',
  '＝1+1', // sinal de igual de largura total
  '\t=1+1',
]

/** Corra esta função uma vez no editor: cria os separadores e pede as autorizações. */
function prepararFolha() {
  obterSeparador_(SEPARADOR_TESTES, ['Data', 'Identificador', 'Teste', 'Tipo do pedido', 'Campos recebidos', 'Nome', 'Mensagem'])
  obterSeparador_(SEPARADOR_FORMULAS, ['Método', 'Valor enviado', 'Fórmula guardada', 'Valor mostrado'])
  Logger.log('Separadores prontos.')
}

function doGet(e) {
  return responder_(function () {
    const p = parametros_(e)
    const acao = p.acao || 'ping'
    if (acao === 'ping') return { ok: true, acao: acao, metodo: 'GET', hora: new Date().toISOString() }
    if (acao === 'contar') return { ok: true, acao: acao, linhas: contarLinhas_(p.teste_id) }
    if (acao === 'regex') return testarRegex_()
    if (acao === 'token') return testarToken_()
    return { ok: false, codigo: 'acao-desconhecida', acao: acao }
  })
}

function doPost(e) {
  const p = parametros_(e)
  // Erro fora do try/catch, de propósito: mostra o que o navegador recebe nesse caso.
  if (p.acao === 'erro-nao-tratado') throw new Error('Erro de teste não tratado')
  return responder_(function () {
    const acao = p.acao
    if (!acao) return { ok: false, codigo: 'sem-acao', tipo: (e && e.postData && e.postData.type) || '(sem corpo)' }
    if (acao === 'erro-tratado') return { ok: false, codigo: 'erro-de-teste' }
    if (acao === 'gravar') return gravar_(p, e)
    if (acao === 'formulas') return testarFormulas_()
    return { ok: false, codigo: 'acao-desconhecida', acao: acao }
  })
}

// ---------------------------------------------------------------------------

/** Campos do pedido: os do formulário (e.parameter) e, num corpo de texto, os de um JSON. */
function parametros_(e) {
  const p = {}
  if (e && e.parameter) Object.keys(e.parameter).forEach(function (k) { p[k] = e.parameter[k] })
  const corpo = e && e.postData
  if (corpo && corpo.type && corpo.type.indexOf('text/plain') === 0 && corpo.contents) {
    try {
      const json = JSON.parse(corpo.contents)
      if (json && typeof json === 'object') Object.keys(json).forEach(function (k) { p[k] = String(json[k]) })
    } catch (erro) {
      p._corpo_invalido = 'sim'
    }
  }
  return p
}

/** Resposta sempre em JSON (só o ContentService pode ser lido pelo site noutro domínio). */
function responder_(fn) {
  const inicio = Date.now()
  let resultado
  try {
    resultado = fn()
  } catch (erro) {
    resultado = { ok: false, codigo: 'erro', mensagem: String(erro) }
  }
  resultado.duracaoMs = Date.now() - inicio
  return ContentService.createTextOutput(JSON.stringify(resultado)).setMimeType(ContentService.MimeType.JSON)
}

function obterSeparador_(nome, cabecalho) {
  const folha = SpreadsheetApp.getActiveSpreadsheet()
  let separador = folha.getSheetByName(nome)
  if (!separador) {
    separador = folha.insertSheet(nome)
    separador.getRange(1, 1, 1, cabecalho.length).setValues([cabecalho]).setFontWeight('bold')
    separador.setFrozenRows(1)
  }
  return separador
}

/** Texto seguro para a folha: um valor começado por = + - @ (ou equivalentes) ganha um apóstrofo. */
function textoSeguro_(valor) {
  const texto = String(valor == null ? '' : valor).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
  return /^[=+\-@\t\r\n＝＋－＠]/.test(texto) ? "'" + texto : texto
}

function gravar_(p, e) {
  const bloqueio = LockService.getScriptLock()
  if (!bloqueio.tryLock(10000)) return { ok: false, codigo: 'ocupado' }
  try {
    const separador = obterSeparador_(SEPARADOR_TESTES, ['Data', 'Identificador', 'Teste', 'Tipo do pedido', 'Campos recebidos', 'Nome', 'Mensagem'])
    if (separador.getLastRow() >= MAX_LINHAS) return { ok: false, codigo: 'limite-do-teste' }
    const id = Utilities.getUuid()
    const tipo = (e && e.postData && e.postData.type) || '(sem corpo)'
    const campos = Object.keys(p).sort().join(', ')
    const linha = [new Date(), id, p.teste_id || '', tipo, campos, p.nome || '', p.mensagem || ''].map(function (v, i) {
      return i === 0 ? v : textoSeguro_(v)
    })
    separador.getRange(separador.getLastRow() + 1, 1, 1, linha.length).setValues([linha])
    return { ok: true, acao: 'gravar', id: id, tipo: tipo, campos: campos }
  } finally {
    bloqueio.releaseLock()
  }
}

function contarLinhas_(testeId) {
  if (!testeId) return 0
  const separador = obterSeparador_(SEPARADOR_TESTES, ['Data', 'Identificador', 'Teste', 'Tipo do pedido', 'Campos recebidos', 'Nome', 'Mensagem'])
  const ultima = separador.getLastRow()
  if (ultima < 2) return 0
  return separador.getRange(2, 3, ultima - 1, 1).getValues().filter(function (l) { return l[0] === testeId }).length
}

/** Grava os valores de risco de três formas e lê o que ficou: fórmula ou texto. */
function testarFormulas_() {
  const separador = obterSeparador_(SEPARADOR_FORMULAS, ['Método', 'Valor enviado', 'Fórmula guardada', 'Valor mostrado'])
  if (separador.getLastRow() > 1) separador.getRange(2, 1, separador.getLastRow() - 1, 4).clearContent()
  const metodos = [
    { nome: 'sem-protecao', preparar: function (v) { return v }, formatoTexto: false },
    { nome: 'apostrofo', preparar: textoSeguro_, formatoTexto: false },
    { nome: 'formato-texto', preparar: function (v) { return v }, formatoTexto: true },
  ]
  const resultado = { ok: true, acao: 'formulas', metodos: {} }
  let linha = 2
  metodos.forEach(function (m) {
    const inicio = linha
    VALORES_DE_RISCO.forEach(function (v) {
      const celula = separador.getRange(linha, 2)
      if (m.formatoTexto) celula.setNumberFormat('@')
      separador.getRange(linha, 1).setValue(m.nome)
      celula.setValues([[m.preparar(v)]])
      linha += 1
    })
    SpreadsheetApp.flush()
    const intervalo = separador.getRange(inicio, 2, VALORES_DE_RISCO.length, 1)
    const formulas = intervalo.getFormulas()
    const mostrados = intervalo.getDisplayValues()
    resultado.metodos[m.nome] = VALORES_DE_RISCO.map(function (v, i) {
      separador.getRange(inicio + i, 3, 1, 2).setValues([[textoSeguro_(formulas[i][0]), textoSeguro_(mostrados[i][0])]])
      return { enviado: v, formula: formulas[i][0], mostrado: mostrados[i][0] }
    })
  })
  return resultado
}

/** As expressões por alfabeto (\p{Script=…}) funcionam no Apps Script? */
function testarRegex_() {
  try {
    const latino = /\p{Script=Latin}/u
    const cirilico = /\p{Script=Cyrillic}/u
    return {
      ok: true,
      acao: 'regex',
      latinoEmPortugues: latino.test('Remodelação de cozinha'),
      cirilicoEmPortugues: cirilico.test('Remodelação de cozinha'),
      cirilicoEmRusso: cirilico.test('Ремонт кухни'),
    }
  } catch (erro) {
    return { ok: false, acao: 'regex', codigo: 'regex-nao-suportada', mensagem: String(erro) }
  }
}

/** Assinatura HMAC-SHA256 com uma chave guardada nas propriedades do script (senha assinada). */
function testarToken_() {
  const propriedades = PropertiesService.getScriptProperties()
  let chave = propriedades.getProperty('CHAVE_TESTE')
  if (!chave) {
    chave = Utilities.getUuid() + Utilities.getUuid()
    propriedades.setProperty('CHAVE_TESTE', chave)
  }
  const carga = String(Date.now()) + '.' + Utilities.getUuid()
  const assinatura = Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(carga, chave))
  const confirmacao = Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(carga, chave))
  return { ok: true, acao: 'token', token: carga + '.' + assinatura, assinaturaEstavel: assinatura === confirmacao }
}
