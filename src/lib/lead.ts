// Pedido de orçamento (Parte 3.8): validação, rascunho do e-mail e envio.
//
// Serviço de formulários (configuração em src/lib/form-config.ts): em produção, o Formward
// (formward.eu), escolhido a 4 de outubro de 2026.
//
// Campos enviados ao serviço (JSON ou multipart/form-data): access_key (opcional), _subject e
// subject (assunto do aviso por e-mail; cada serviço lê um deles), _replyto (o e-mail do
// visitante, para o aviso ter "Responder a"), name, phone, email, location, service, budget,
// message e, com ficheiros, um ou mais `attachment`. Os campos opcionais vazios não seguem.
//
// Sem serviço ativo (modo por e-mail): o site não envia nem guarda nada. Abre o programa de
// e-mail do visitante com o pedido preenchido e nunca afirma que o pedido foi recebido.
//
// Nada dos dados do formulário vai para URLs de servidores, armazenamento do navegador ou
// consola.

import { company } from '../content/company'
import { contact } from '../content/contact'
import { FORM_ACCESS_KEY, FORM_ENDPOINT, formAcceptsFiles, formServiceActive } from './form-config'

export { formAcceptsFiles, formServiceActive }

// ---------------------------------------------------------------------------
// Fotografias: os limites do Formward (plano Professional): 5 ficheiros, 10 MiB cada e
// 25 MiB por pedido; JPEG, PNG, GIF e WebP (sem HEIC: recusa o pedido inteiro com 415).
// Sem HEIC no `accept`, o iPhone envia as fotografias convertidas em JPEG.

export const LEAD_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const
/** Valor do atributo `accept` do campo de fotografias. */
export const LEAD_FILE_ACCEPT = LEAD_FILE_TYPES.join(',')
export const LEAD_MAX_FILES = 5
export const LEAD_MAX_FILE_BYTES = 10 * 1024 * 1024
/** Soma das fotografias de um pedido. */
export const LEAD_MAX_TOTAL_BYTES = 25 * 1024 * 1024

/** Limite de tempo do envio ao serviço de formulários. */
const TIMEOUT_MS = 15_000
/** Comprimento máximo aproximado do URL mailto: completo, já codificado. */
const MAILTO_MAX_LENGTH = 1_800
/** Tempo em que a mensagem "Vamos abrir o seu programa de e-mail…" fica à vista antes de abrir. */
const MAILTO_DELAY_MS = 800

// Tipo pela extensão, quando o navegador não o indica.
const TIPO_POR_EXTENSAO: Readonly<Record<string, (typeof LEAD_FILE_TYPES)[number]>> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
}

function tipoPelaExtensao(nome: string): string | undefined {
  const extensao = /\.([a-z0-9]+)$/i.exec(nome)?.[1]?.toLowerCase()
  return extensao ? TIPO_POR_EXTENSAO[extensao] : undefined
}

// ---------------------------------------------------------------------------
// Tipos

/** Dados do pedido, tal como seguem para o serviço ou para o e-mail. */
export interface LeadData {
  name: string
  phone: string
  email: string
  location: string
  service: string
  budget: string
  message: string
  /** Campo-armadilha anti-spam: fica vazio quando é uma pessoa a preencher. */
  trap: string
}

/** Valores do formulário (os dados mais a caixa da Política de privacidade). */
export interface LeadValues extends LeadData {
  privacy: boolean
}

export type LeadErrorKey = 'name' | 'phone' | 'email' | 'contact' | 'location' | 'message' | 'privacy'
export type LeadErrors = Partial<Record<LeadErrorKey, string>>

export type LeadResult =
  /** Serviço de formulários: `ok` só com resposta de sucesso (ou campo-armadilha preenchido). */
  | { mode: 'service'; ok: boolean }
  /** Modo por e-mail: o site não sabe se o e-mail foi enviado. `request` é o texto para copiar. */
  | { mode: 'email'; request: string; truncated: boolean }

// ---------------------------------------------------------------------------
// Validação (mensagens de src/content/contact.ts)

/** Telefone tolerante: 9 a 15 dígitos, com "+" inicial e espaços (também hífenes, pontos e parênteses). */
export function isValidPhone(valor: string): boolean {
  const compacto = valor.replace(/[\s().-]/g, '')
  return /^\+?\d{9,15}$/.test(compacto)
}

export function isValidEmail(valor: string): boolean {
  return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(valor.trim())
}

/** Erros do formulário, por campo. Objeto vazio quando está tudo certo. */
export function validateLead(v: LeadValues): LeadErrors {
  const erros: LeadErrors = {}
  const telefone = v.phone.trim()
  const email = v.email.trim()
  if (!v.name.trim()) erros.name = contact.errors.name
  if (!telefone && !email) erros.contact = contact.errors.contact
  if (telefone && !isValidPhone(telefone)) erros.phone = contact.errors.phone
  if (email && !isValidEmail(email)) erros.email = contact.errors.email
  if (!v.location.trim()) erros.location = contact.errors.location
  if (!v.message.trim()) erros.message = contact.errors.message
  if (!v.privacy) erros.privacy = contact.errors.privacy
  return erros
}

function comNome(modelo: string, nome: string): string {
  return modelo.replaceAll('{nome}', nome)
}

function tipoAceite(ficheiro: File): boolean {
  if ((LEAD_FILE_TYPES as readonly string[]).includes(ficheiro.type)) return true
  // Alguns navegadores não indicam o tipo: vale a extensão.
  return ficheiro.type === '' && tipoPelaExtensao(ficheiro.name) !== undefined
}

function mesmoFicheiro(a: File, b: File): boolean {
  return a.name === b.name && a.size === b.size && a.lastModified === b.lastModified
}

/**
 * Junta as fotografias escolhidas às que já estavam, validando no cliente: formato, 10 MB por
 * fotografia, 5 no máximo e 25 MB no total. As recusadas não entram e cada recusa tem a sua
 * mensagem.
 */
export function addLeadFiles(
  atuais: readonly File[],
  novos: readonly File[],
): { files: File[]; errors: string[] } {
  const files = [...atuais]
  const errors: string[] = []
  let excesso = false
  for (const ficheiro of novos) {
    if (!tipoAceite(ficheiro)) {
      errors.push(comNome(contact.errors.fileType, ficheiro.name))
    } else if (ficheiro.size > LEAD_MAX_FILE_BYTES) {
      errors.push(comNome(contact.errors.fileTooBig, ficheiro.name))
    } else if (files.some((f) => mesmoFicheiro(f, ficheiro))) {
      // Repetido: fica só uma vez.
    } else if (files.length >= LEAD_MAX_FILES) {
      excesso = true
    } else if (files.reduce((soma, f) => soma + f.size, 0) + ficheiro.size > LEAD_MAX_TOTAL_BYTES) {
      errors.push(comNome(contact.errors.filesTotalTooBig, ficheiro.name))
    } else {
      files.push(ficheiro)
    }
  }
  if (excesso) errors.push(contact.errors.tooManyFiles)
  return { files, errors }
}

// ---------------------------------------------------------------------------
// Rascunho do e-mail (modo por e-mail)

function linhasDoPedido(d: LeadData, mensagem: string): string[] {
  const r = contact.emailDraft.labels
  const linhas = [contact.emailDraft.greeting, '']
  const juntar = (rotulo: string, valor: string): void => {
    const limpo = valor.trim()
    if (limpo) linhas.push(`${rotulo}: ${limpo}`)
  }
  juntar(r.name, d.name)
  juntar(r.phone, d.phone)
  juntar(r.email, d.email)
  juntar(r.location, d.location)
  juntar(r.service, d.service)
  juntar(r.budget, d.budget)
  linhas.push('', `${r.message}:`, mensagem)
  return linhas
}

function urlMailto(corpo: string): string {
  return (
    `mailto:${company.email}` +
    `?subject=${encodeURIComponent(contact.emailDraft.subject)}` +
    `&body=${encodeURIComponent(corpo)}`
  )
}

function mensagemEncurtada(caracteres: readonly string[], n: number): string {
  return `${caracteres.slice(0, n).join('').trimEnd()}\r\n\r\n${contact.states.truncated}`
}

/**
 * URL mailto: com assunto e corpo preenchidos, até cerca de 1 800 caracteres depois de
 * codificado. Se passar, encurta a mensagem e acrescenta a nota de mensagem encurtada.
 * `request` é o pedido completo (sem cortes), para o botão "Copiar pedido".
 */
export function buildLeadMailto(d: LeadData): { url: string; request: string; truncated: boolean } {
  const mensagem = d.message.trim()
  const request = [contact.emailDraft.subject, '', ...linhasDoPedido(d, mensagem)].join('\n')
  const corpo = (m: string): string => linhasDoPedido(d, m).join('\r\n')

  const completo = urlMailto(corpo(mensagem))
  if (completo.length <= MAILTO_MAX_LENGTH) return { url: completo, request, truncated: false }

  // Pesquisa binária do maior início da mensagem que cabe (por pontos de código).
  const caracteres = Array.from(mensagem)
  let min = 0
  let max = caracteres.length
  while (min < max) {
    const meio = Math.ceil((min + max) / 2)
    if (urlMailto(corpo(mensagemEncurtada(caracteres, meio))).length <= MAILTO_MAX_LENGTH) min = meio
    else max = meio - 1
  }
  return { url: urlMailto(corpo(mensagemEncurtada(caracteres, min))), request, truncated: true }
}

// ---------------------------------------------------------------------------
// Envio

function esperar(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

function camposDoServico(d: LeadData): Record<string, string> {
  const campos: Record<string, string> = {}
  if (FORM_ACCESS_KEY) campos.access_key = FORM_ACCESS_KEY
  campos['_subject'] = contact.emailDraft.subject
  campos.subject = contact.emailDraft.subject
  // "Responder a" no aviso por e-mail: o e-mail do visitante, se o indicou.
  if (d.email.trim()) campos['_replyto'] = d.email.trim()
  const juntar = (chave: string, valor: string): void => {
    const limpo = valor.trim()
    if (limpo) campos[chave] = limpo
  }
  juntar('name', d.name)
  juntar('phone', d.phone)
  juntar('email', d.email)
  juntar('location', d.location)
  juntar('service', d.service)
  juntar('budget', d.budget)
  juntar('message', d.message)
  return campos
}

/** Alguns serviços respondem 200 com `success: false` ou `ok: false` no JSON. */
function respostaRecusada(corpo: unknown): boolean {
  if (typeof corpo !== 'object' || corpo === null) return false
  const r = corpo as { success?: unknown; ok?: unknown }
  return r.success === false || r.ok === false
}

async function enviarAoServico(d: LeadData, ficheiros: readonly File[]): Promise<boolean> {
  const campos = camposDoServico(d)
  const controlador = new AbortController()
  const limite = window.setTimeout(() => controlador.abort(), TIMEOUT_MS)
  try {
    let pedido: RequestInit
    if (formAcceptsFiles && ficheiros.length > 0) {
      const dados = new FormData()
      for (const [chave, valor] of Object.entries(campos)) dados.append(chave, valor)
      for (const ficheiro of ficheiros) {
        // Sem tipo, o ficheiro seguiria como application/octet-stream, que o serviço recusa.
        const tipo = ficheiro.type || tipoPelaExtensao(ficheiro.name)
        const parte = ficheiro.type || !tipo ? ficheiro : new File([ficheiro], ficheiro.name, { type: tipo })
        dados.append('attachment', parte, ficheiro.name)
      }
      // Sem Content-Type: o navegador define o multipart/form-data com o separador.
      pedido = { method: 'POST', body: dados, headers: { Accept: 'application/json' } }
    } else {
      pedido = {
        method: 'POST',
        body: JSON.stringify(campos),
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      }
    }
    const resposta = await fetch(FORM_ENDPOINT, {
      ...pedido,
      signal: controlador.signal,
      credentials: 'omit',
      cache: 'no-store',
      referrerPolicy: 'strict-origin-when-cross-origin',
    })
    if (!resposta.ok) return false
    const corpo: unknown = await resposta.json().catch(() => null)
    return !respostaRecusada(corpo)
  } catch {
    // Rede, limite de tempo ou resposta inválida: o formulário mostra o erro com alternativas.
    return false
  } finally {
    window.clearTimeout(limite)
  }
}

/**
 * Envia o pedido de orçamento.
 * - Com serviço ativo: POST (JSON, ou multipart/form-data com ficheiros), limite de 15 s.
 *   Com o campo-armadilha preenchido não envia nada e devolve sucesso.
 * - Sem serviço ativo: modo por e-mail. Espera um instante (o formulário mostra entretanto
 *   `contact.states.mailtoBefore`), abre o mailto: e devolve o texto do pedido para copiar.
 *   O campo-armadilha é ignorado (o site não envia nada).
 */
export async function submitLead(dados: LeadData, ficheiros: readonly File[] = []): Promise<LeadResult> {
  if (!formServiceActive) {
    const { url, request, truncated } = buildLeadMailto(dados)
    await esperar(MAILTO_DELAY_MS)
    window.location.href = url
    return { mode: 'email', request, truncated }
  }
  if (dados.trap.trim()) return { mode: 'service', ok: true }
  return { mode: 'service', ok: await enviarAoServico(dados, ficheiros) }
}
