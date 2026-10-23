/** @OnlyCurrentDoc */

/**
 * LMDreams: formulários do site (pedido de orçamento e candidatura) gravados nesta folha de cálculo.
 *
 * Instalação e manutenção: docs/formularios/apps-script/GUIA.md (repositório do site).
 * O site envia os campos como application/x-www-form-urlencoded (sem cabeçalhos próprios, para não
 * haver verificação prévia do CORS) e lê a resposta em JSON (ContentService).
 *
 * Proteção contra spam e abusos (o Apps Script não vê o IP nem a origem dos pedidos):
 *  A. gravação segura: um valor começado por = + - @ (e equivalentes) ganha um apóstrofo;
 *  B. campo-armadilha: se vier preenchido, nada é gravado e a resposta é de sucesso;
 *  C. validação estrita: campos conhecidos, tamanhos, formatos e listas fixas (LISTAS);
 *  D. pontuação de spam: os pedidos suspeitos vão para o separador "Suspeitos", sem aviso por e-mail;
 *  E. repetidos (30 minutos) e limites globais (por hora e por dia);
 *  F. avisos por e-mail só para a empresa, só para pedidos limpos e sem dados pessoais (só o tipo
 *     de pedido e a ligação para a folha); nunca para o visitante;
 *  G. interruptor (FORMULARIOS_ATIVOS) e apagamento automático (limparAntigos).
 */

// ---------------------------------------------------------------------------
// Configuração

// Opções aceites nas listas dos formulários. Têm de ser iguais às do site: o scripts/verificar.cjs
// compara-as com o HTML publicado (por isso o objeto está escrito em JSON, com aspas duplas).
const LISTAS = {
  "servico": ["Construção civil", "Remodelação de cozinhas", "Remodelação de casas de banho", "Pavimentos e revestimentos", "Recuperação de imóveis", "Trabalhos exteriores", "Outro"],
  "inicio": ["O mais cedo possível", "Dentro de 1 a 3 meses", "Dentro de 3 a 6 meses", "Daqui a mais de 6 meses", "Ainda não sei"],
  "profissao": ["Pedreiro/a", "Pintor/a", "Carpinteiro/a", "Ladrilhador/a", "Canalizador/a", "Eletricista", "Estucador/a ou pladurista", "Serralheiro/a", "Servente", "Outra"],
  "experiencia": ["Menos de 1 ano", "1 a 3 anos", "3 a 5 anos", "5 a 10 anos", "Mais de 10 anos"],
  "disponibilidade": ["Imediata", "Dentro de 2 semanas", "Dentro de 1 mês", "Mais tarde"]
}

const FORMULARIOS = {
  orcamento: {
    separador: 'Orçamentos',
    assunto: 'Novo pedido de orçamento no site',
    // [campo, rótulo, obrigatório]
    campos: [
      ['nome', 'Nome', true],
      ['telefone', 'Telefone', false],
      ['email', 'E-mail', false],
      ['localidade', 'Localidade da obra', true],
      ['servico', 'Tipo de serviço', true],
      ['inicio', 'Início pretendido', true],
      ['descricao', 'Descrição', true],
    ],
    conservacaoDias: 365,
  },
  candidatura: {
    separador: 'Candidaturas',
    assunto: 'Nova candidatura no site',
    campos: [
      ['nome', 'Nome', true],
      ['telefone', 'Telefone', true],
      ['profissao', 'Profissão', true],
      ['zona', 'Zona onde pode trabalhar', true],
      ['experiencia', 'Experiência', true],
      ['disponibilidade', 'Disponibilidade', true],
      ['mensagem', 'Mensagem', false],
    ],
    conservacaoDias: 365,
  },
}

const SEPARADOR_SUSPEITOS = 'Suspeitos'
const CONSERVACAO_SUSPEITOS_DIAS = 29 // a limpeza corre uma vez por dia: fica dentro dos 30 dias da política
const CAMPO_ARMADILHA = 'campo_k7x'
// Campos que o site envia além dos do formulário.
const CAMPOS_TECNICOS = ['formulario', 'privacidade', 't', CAMPO_ARMADILHA]

const TAMANHOS = {
  nome: [2, 80], telefone: [0, 30], email: [0, 254], localidade: [2, 80], zona: [2, 120],
  descricao: [10, 2000], mensagem: [0, 1500],
}
const CORPO_MAXIMO = 20000 // bytes

const PONTUACAO_SUSPEITA = 3
const LIMITE_POR_HORA = 5 // pedidos limpos por hora (os dois formulários juntos); acima, vão para "Suspeitos"
const LIMITE_POR_DIA = 20 // pedidos limpos por dia; acima, vão para "Suspeitos"
const LIMITE_GRAVACOES_POR_DIA = 150 // linhas gravadas por dia (limpas e suspeitas); acima, o script para
const REPETIDO_SEGUNDOS = 30 * 60
const TEMPO_MINIMO_MS = 4000
// Linhas acrescentadas de cada vez quando um separador fica sem espaço.
const LINHAS_A_ACRESCENTAR = 200

const PALAVRAS_SPAM = ['seo', 'backlink', 'backlinks', 'crypto', 'bitcoin', 'viagra', 'porn', 'forex', 'loan', 'escort', 'betting']

// ---------------------------------------------------------------------------
// Pedidos

function doGet() {
  // Verificação de funcionamento (não grava nada).
  return json_({ ok: true, servico: 'formularios-lmdreams' })
}

function doPost(e) {
  try {
    return json_(tratarPedido_(e))
  } catch (erro) {
    console.error(String(erro && erro.stack ? erro.stack : erro))
    return json_({ ok: false, codigo: 'erro' })
  }
}

function tratarPedido_(e) {
  const propriedades = PropertiesService.getScriptProperties()
  if (propriedades.getProperty('FORMULARIOS_ATIVOS') === 'nao') return { ok: false, codigo: 'indisponivel' }
  if (!e || !e.parameter || (e.contentLength && e.contentLength > CORPO_MAXIMO)) return { ok: false, codigo: 'invalido' }

  const p = e.parameter
  // B. Campo-armadilha: um robô preencheu-o. Nada é gravado e a resposta parece de sucesso.
  if (p[CAMPO_ARMADILHA]) return { ok: true }

  const config = FORMULARIOS[p.formulario]
  if (!config) return { ok: false, codigo: 'invalido' }

  // C. Validação estrita.
  const dados = {}
  const permitidos = config.campos.map(function (c) { return c[0] }).concat(CAMPOS_TECNICOS)
  const desconhecidos = Object.keys(p).filter(function (k) { return permitidos.indexOf(k) < 0 })
  if (desconhecidos.length) return { ok: false, codigo: 'invalido' }
  config.campos.forEach(function (c) { dados[c[0]] = limpar_(p[c[0]]) })
  const erros = validar_(p.formulario, dados, p.privacidade)
  if (erros.length) return { ok: false, codigo: 'invalido', campos: erros }

  const bloqueio = LockService.getScriptLock()
  if (!bloqueio.tryLock(10000)) return { ok: false, codigo: 'ocupado' }
  let aviso = null
  let alerta = null
  try {
    const cache = CacheService.getScriptCache()
    const agora = new Date()
    const dia = Utilities.formatDate(agora, 'Europe/Lisbon', 'yyyyMMdd')
    const chaveHora = 'h:' + Utilities.formatDate(agora, 'Europe/Lisbon', 'yyyyMMddHH')
    // Contadores do dia nas propriedades do script: a cache do Google guarda valores 6 horas, no máximo.
    const contadores = PropertiesService.getScriptProperties()
    const chaveLimpos = 'CONTA_LIMPOS_' + dia
    const chaveGravacoes = 'CONTA_GRAVACOES_' + dia

    // E. Limite de gravações por dia: acima dele, o script deixa de gravar até ao dia seguinte.
    const gravacoes = numero_(contadores.getProperty(chaveGravacoes))
    if (gravacoes >= LIMITE_GRAVACOES_POR_DIA) {
      alerta = ['limite-diario', 'Os formulários do site atingiram o limite de ' + LIMITE_GRAVACOES_POR_DIA + ' pedidos hoje e deixaram de gravar até amanhã. Pode ser um ataque de spam: veja o separador "Suspeitos".']
      return { ok: false, codigo: 'indisponivel' }
    }

    // E. Repetidos: o mesmo pedido nos últimos 30 minutos é ignorado (duplo clique, reenvio).
    const impressao = 'r:' + resumo_([p.formulario, dados.nome, dados.telefone, dados.email, dados.descricao || dados.mensagem || ''].join('|'))
    if (cache.get(impressao)) return { ok: true }

    // D. Pontuação de spam.
    const motivos = motivosDeSuspeita_(p.formulario, dados, p.t)
    const pontos = motivos.reduce(function (soma, m) { return soma + m[1] }, 0)
    let suspeito = pontos >= PONTUACAO_SUSPEITA

    // E. Picos: acima dos limites por hora ou por dia, os pedidos limpos também ficam em quarentena.
    const limposHora = numero_(cache.get(chaveHora))
    const limposDia = numero_(contadores.getProperty(chaveLimpos))
    if (!suspeito && (limposHora >= LIMITE_POR_HORA || limposDia >= LIMITE_POR_DIA)) {
      suspeito = true
      motivos.push(['pico de pedidos', 0])
      alerta = ['pico', 'Os formulários do site receberam muitos pedidos num curto período. Os pedidos seguintes ficaram no separador "Suspeitos" para revisão.']
    }

    if (suspeito) {
      gravarSuspeito_(p.formulario, motivos, pontos, dados, agora)
    } else {
      gravarLinha_(config, dados, agora)
      cache.put(chaveHora, String(limposHora + 1), 3600)
      contadores.setProperty(chaveLimpos, String(limposDia + 1))
      aviso = config
    }
    contadores.setProperty(chaveGravacoes, String(gravacoes + 1))
    // Só depois de gravado: um reenvio depois de um erro volta a ser tentado.
    cache.put(impressao, '1', REPETIDO_SEGUNDOS)
    return { ok: true }
  } finally {
    bloqueio.releaseLock()
    // Os e-mails ficam fora do bloqueio e nunca mudam a resposta ao site.
    if (aviso) avisar_(aviso)
    if (alerta) alertar_(alerta[0], alerta[1])
  }
}

// ---------------------------------------------------------------------------
// Validação e pontuação

function limpar_(valor) {
  return String(valor == null ? '' : valor)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/\r\n?/g, '\n')
    .trim()
}

function telefoneNormalizado_(valor) {
  return valor.replace(/[\s().-]/g, '').replace(/^(\+351|00351)/, '')
}

function telefonePortugues_(valor) {
  return /^(2\d{8}|9[1236]\d{7})$/.test(telefoneNormalizado_(valor))
}

function telefoneValido_(valor) {
  return telefonePortugues_(valor) || /^\+?\d{9,15}$/.test(valor.replace(/[\s().-]/g, ''))
}

function emailValido_(valor) {
  return valor.length <= 254 && /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(valor)
}

function validar_(formulario, dados, privacidade) {
  const erros = []
  const config = FORMULARIOS[formulario]
  config.campos.forEach(function (c) {
    const nome = c[0]
    const valor = dados[nome]
    if (c[2] && !valor) { erros.push(nome); return }
    if (!valor) return
    const tamanho = TAMANHOS[nome]
    if (tamanho && (valor.length < tamanho[0] || valor.length > tamanho[1])) { erros.push(nome); return }
    if (LISTAS[nome] && LISTAS[nome].indexOf(valor) < 0) { erros.push(nome); return }
    if (nome === 'telefone' && !telefoneValido_(valor)) erros.push(nome)
    if (nome === 'email' && !emailValido_(valor)) erros.push(nome)
  })
  if (formulario === 'orcamento' && !dados.telefone && !dados.email) erros.push('contacto')
  if (privacidade !== 'sim') erros.push('privacidade')
  return erros
}

/** Lista de [motivo, pontos]. */
function motivosDeSuspeita_(formulario, dados, tempo) {
  const motivos = []
  const texto = [dados.descricao, dados.mensagem, dados.localidade, dados.zona].filter(Boolean).join(' ')
  if (/https?:\/\/|www\./i.test(texto)) motivos.push(['ligação no texto', 3])
  else if (/\b[a-z0-9-]+\.(com|net|org|info|biz|ru|cn|xyz|top|io)(?=[\s/]|$)/.test(texto)) motivos.push(['domínio no texto', 2])
  if (/<[a-z/!][^>]*>|\[\/?(url|link|b|img)\b/i.test(texto)) motivos.push(['HTML ou BBCode', 5])
  PALAVRAS_SPAM.forEach(function (palavra) {
    if (new RegExp('\\b' + palavra + '\\b', 'i').test(texto)) motivos.push(['palavra "' + palavra + '"', 2])
  })
  const letras = texto.match(/\p{L}/gu) || []
  if (letras.length >= 20) {
    const naoLatinas = letras.filter(function (l) { return !/\p{Script=Latin}/u.test(l) }).length
    if (naoLatinas / letras.length > 0.3) motivos.push(['alfabeto não latino', formulario === 'orcamento' ? 3 : 1])
    const maiusculas = letras.filter(function (l) { return l === l.toUpperCase() && l !== l.toLowerCase() }).length
    if (maiusculas / letras.length > 0.8) motivos.push(['texto todo em maiúsculas', 1])
  }
  if (/https?:|www\./i.test(dados.nome)) motivos.push(['ligação no nome', 3])
  else if (/\d/.test(dados.nome)) motivos.push(['números no nome', 1])
  if (dados.telefone && !telefonePortugues_(dados.telefone)) motivos.push(['telefone estrangeiro', 1])
  const ms = Number(tempo)
  if (tempo === undefined || tempo === '' || !isFinite(ms)) motivos.push(['sem tempo de preenchimento', 3])
  else if (ms < TEMPO_MINIMO_MS) motivos.push(['preenchido em menos de 4 segundos', 2])
  return motivos
}

// ---------------------------------------------------------------------------
// Gravação

/**
 * A. Texto seguro para a folha: todo o texto vindo do formulário ganha um apóstrofo no início, que o
 * Google Sheets esconde. Fica sempre como texto: nem fórmula (=, +, -, @), nem número ou data
 * ("00351…" não perde os zeros). Testado a 23 de outubro de 2026.
 */
function textoSeguro_(valor) {
  const texto = String(valor == null ? '' : valor)
  return texto ? "'" + texto : ''
}

/** Garante uma linha livre no fim do separador (a grelha não cresce sozinha com getRange). */
function proximaLinha_(separador) {
  const linha = separador.getLastRow() + 1
  if (linha > separador.getMaxRows()) separador.insertRowsAfter(separador.getMaxRows(), LINHAS_A_ACRESCENTAR)
  return linha
}

function cabecalho_(config) {
  return ['Data'].concat(config.campos.map(function (c) { return c[1] })).concat(['Estado'])
}

function separador_(nome, cabecalho) {
  const folha = SpreadsheetApp.getActiveSpreadsheet()
  let separador = folha.getSheetByName(nome)
  if (!separador) {
    separador = folha.insertSheet(nome)
    separador.getRange(1, 1, 1, cabecalho.length).setValues([cabecalho]).setFontWeight('bold')
    separador.setFrozenRows(1)
  }
  return separador
}

function gravarLinha_(config, dados, data) {
  const separador = separador_(config.separador, cabecalho_(config))
  const linha = [data].concat(config.campos.map(function (c) { return textoSeguro_(dados[c[0]]) })).concat([''])
  separador.getRange(proximaLinha_(separador), 1, 1, linha.length).setValues([linha])
}

function gravarSuspeito_(formulario, motivos, pontos, dados, data) {
  const separador = separador_(SEPARADOR_SUSPEITOS, ['Data', 'Formulário', 'Motivos', 'Pontos', 'Dados'])
  const descricao = motivos.map(function (m) { return m[0] }).join('; ')
  const linha = [data, textoSeguro_(formulario), textoSeguro_(descricao), pontos, textoSeguro_(JSON.stringify(dados))]
  separador.getRange(proximaLinha_(separador), 1, 1, linha.length).setValues([linha])
}

// ---------------------------------------------------------------------------
// Avisos por e-mail (F)

function destinatarios_() {
  return (PropertiesService.getScriptProperties().getProperty('DESTINATARIOS') || '').split(',').map(function (s) { return s.trim() }).filter(Boolean)
}

/**
 * Aviso de pedido novo, sem dados pessoais: só o tipo de pedido e a ligação para a folha (a folha
 * apaga os pedidos pelos prazos da Política de privacidade; os e-mails não guardam cópias). Um erro
 * no envio fica registado e não muda a resposta ao site.
 */
function avisar_(config) {
  try {
    const para = destinatarios_()
    if (!para.length || MailApp.getRemainingDailyQuota() < para.length) return
    MailApp.sendEmail({
      to: para.join(','),
      subject: config.assunto,
      body: config.assunto + '.\n\nVeja os dados no separador "' + config.separador + '" da folha:\n' + SpreadsheetApp.getActiveSpreadsheet().getUrl(),
    })
  } catch (erro) {
    console.error('Aviso por e-mail não enviado: ' + erro)
  }
}

/** Alerta para a empresa, no máximo uma vez por hora por tipo. Um erro no envio só fica registado. */
function alertar_(tipo, mensagem) {
  try {
    const cache = CacheService.getScriptCache()
    if (cache.get('a:' + tipo)) return
    cache.put('a:' + tipo, '1', 3600)
    const para = destinatarios_()
    if (!para.length || MailApp.getRemainingDailyQuota() < para.length) return
    MailApp.sendEmail({ to: para.join(','), subject: 'Alerta nos formulários do site', body: mensagem })
  } catch (erro) {
    console.error('Alerta por e-mail não enviado: ' + erro)
  }
}

// ---------------------------------------------------------------------------
// Manutenção (G): corra prepararFolha e instalarLimpeza uma vez, no editor.

/** Cria os separadores com os cabeçalhos. */
function prepararFolha() {
  Object.keys(FORMULARIOS).forEach(function (k) { separador_(FORMULARIOS[k].separador, cabecalho_(FORMULARIOS[k])) })
  separador_(SEPARADOR_SUSPEITOS, ['Data', 'Formulário', 'Motivos', 'Pontos', 'Dados'])
  Logger.log('Separadores prontos.')
}

/** Instala a limpeza diária (apaga os pedidos mais antigos do que os prazos da Política de privacidade). */
function instalarLimpeza() {
  ScriptApp.getProjectTriggers()
    .filter(function (g) { return g.getHandlerFunction() === 'limparAntigos' })
    .forEach(function (g) { ScriptApp.deleteTrigger(g) })
  ScriptApp.newTrigger('limparAntigos').timeBased().everyDays(1).atHour(3).create()
  Logger.log('Limpeza diária instalada (por volta das 3h00).')
}

function limparAntigos() {
  Object.keys(FORMULARIOS).forEach(function (k) { apagarAntesDe_(FORMULARIOS[k].separador, FORMULARIOS[k].conservacaoDias) })
  apagarAntesDe_(SEPARADOR_SUSPEITOS, CONSERVACAO_SUSPEITOS_DIAS)
  const propriedades = PropertiesService.getScriptProperties()
  const hoje = Utilities.formatDate(new Date(), 'Europe/Lisbon', 'yyyyMMdd')
  propriedades.getKeys()
    .filter(function (k) { return /^CONTA_(LIMPOS|GRAVACOES)_\d{8}$/.test(k) && k.slice(-8) < hoje })
    .forEach(function (k) { propriedades.deleteProperty(k) })
}

function apagarAntesDe_(nome, dias) {
  const separador = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(nome)
  if (!separador || separador.getLastRow() < 2) return
  const limite = new Date(Date.now() - dias * 24 * 3600 * 1000)
  const datas = separador.getRange(2, 1, separador.getLastRow() - 1, 1).getValues()
  // Os pedidos são acrescentados no fim, por ordem de chegada: os antigos estão no topo.
  let antigos = 0
  while (antigos < datas.length && datas[antigos][0] instanceof Date && datas[antigos][0] < limite) antigos += 1
  if (antigos > 0) separador.deleteRows(2, antigos)
  // Linhas fora da ordem (por exemplo, copiadas à mão de "Suspeitos"): apagadas uma a uma.
  const resto = separador.getLastRow() < 2 ? [] : separador.getRange(2, 1, separador.getLastRow() - 1, 1).getValues()
  for (let i = resto.length - 1; i >= 0; i -= 1) {
    if (resto[i][0] instanceof Date && resto[i][0] < limite) separador.deleteRow(i + 2)
  }
}

// ---------------------------------------------------------------------------
// Utilidades

function json_(objeto) {
  return ContentService.createTextOutput(JSON.stringify(objeto)).setMimeType(ContentService.MimeType.JSON)
}

function numero_(valor) {
  const n = Number(valor)
  return isFinite(n) ? n : 0
}

function resumo_(texto) {
  return Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, texto, Utilities.Charset.UTF_8))
}
