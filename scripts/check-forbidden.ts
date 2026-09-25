// Gate de proibições e de conformidade estática (Partes 1.4, 5.5, 5.6 e 6.1).
// 1) Texto visível de cada página gerada: palavras e fórmulas proibidas, brasileirismos,
//    travessões e alegações de experiência diferentes de 30 anos.
// 2) Código: h-screen, "higgsfield" e APIs de armazenamento (cookies, localStorage,
//    sessionStorage) no código-fonte e nos ficheiros gerados.
// 3) Conformidade em todas as páginas, pelos marcadores data-* do contrato do build.
//
// Uso: npm run check:forbidden [-- --dir <pasta>] [--root <projeto>]
//   --dir   pasta de saída (por omissão OUT_DIR ou "dist")
//   --root  raiz onde estão src/ e public/ (por omissão, a raiz deste projeto)

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { NodeType, parse, type HTMLElement, type Node } from 'node-html-parser'
import { PAGES, type PageDef, type PageId } from '../src/lib/pages.ts'

// ---------------------------------------------------------------------------
// Configuração

function lerArgumento(nome: string): string | undefined {
  const argv = process.argv.slice(2)
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === `--${nome}`) return argv[i + 1]
    if (arg?.startsWith(`--${nome}=`)) return arg.slice(nome.length + 3)
  }
  return undefined
}

const RAIZ_PROJETO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PASTA = path.resolve(process.cwd(), lerArgumento('dir') ?? process.env.OUT_DIR ?? 'dist')
const RAIZ = path.resolve(process.cwd(), lerArgumento('root') ?? RAIZ_PROJETO)

const PAGINAS_LEGAIS: ReadonlySet<PageId> = new Set(['privacy', 'cookies', 'terms'])

const LEGENDA_IA = 'Imagem ilustrativa gerada por IA'
const NOTA_TELEFONE = '(chamada para a rede móvel nacional)'
const LIVRO_RECLAMACOES = 'https://www.livroreclamacoes.pt/inicio'
const ODR = 'ec.europa.eu/consumers/odr'
const FRASE_PROVISORIA = 'Esta secção vai reunir obras realizadas pela LMDreams'
const FRASE_OBRAS_REAIS =
  'Fotografias de obras realizadas pela LMDreams, publicadas com autorização dos clientes'

// ---------------------------------------------------------------------------
// Listas (Partes 5.5 e 6.1). Procuradas por palavra inteira, sem distinguir maiúsculas.

const PALAVRAS = ['lorem', 'você', 'vocês']
const SO_MAIUSCULAS = ['TODO', 'FIXME']

/** Lista fechada da linha "Proibições" (nunca acrescentar palavras corretas em PT-PT). */
const BRASILEIRISMOS = [
  'banheiro', 'encanador', 'encanamento', 'equipe', 'celular', 'contato', 'contatar',
  'recepção', 'registro', 'usuário', 'lajota', 'assoalho', 'geladeira', 'esquadria',
  'serralheria', 'drywall', 'térreo', 'sobrado', 'prefeitura', 'CEP', 'CPF', 'CNPJ',
  'nota fiscal', 'planejar', 'planejamento', 'gerenciar', 'gerenciamento', 'lavanderia',
  'canteiro de obras', 'de fato',
]

/** Fórmulas da Parte 5.5, como expressões completas ("n.º 1" tem regra própria). */
const FORMULAS = [
  'orçamento gratuito', 'orçamentos gratuitos', 'grátis', 'sem compromisso', 'sem custos',
  'visita gratuita', 'em 24 horas', 'sustentável', 'sustentáveis', 'ecológico', 'ecológica',
  'ecológicos', 'ecológicas', 'amigo do ambiente', 'transformamos sonhos', 'construímos sonhos',
  'soluções à medida', 'excelência', 'inovador', 'inovadora', 'jornada', 'experiência única',
  'mais do que uma empresa', 'parceiro de confiança', 'tudo o que precisa num só lugar',
  'sem complicações', 'fazer a diferença', 'paixão', 'qualidade inigualável', 'descubra',
  'explore', 'clique aqui', 'o melhor', 'a melhor', 'líder', 'garantimos', 'sem imprevistos',
  'garantia total',
]

// ---------------------------------------------------------------------------
// Falhas

interface Falha {
  onde: string
  regra: string
  excerto: string
}

const falhas: Falha[] = []

function falhar(onde: string, regra: string, detalhe = ''): void {
  falhas.push({ onde, regra, excerto: detalhe })
}

function excerto(texto: string, inicio: number, fim: number, margem = 30): string {
  const a = Math.max(0, inicio - margem)
  const b = Math.min(texto.length, fim + margem)
  const miolo = texto.slice(a, b).replace(/\s+/g, ' ')
  return `${a > 0 ? '…' : ''}${miolo}${b < texto.length ? '…' : ''}`
}

function resumoElemento(el: HTMLElement): string {
  const html = el.outerHTML.replace(/\s+/g, ' ')
  return html.length > 120 ? `${html.slice(0, 120)}…` : html
}

// ---------------------------------------------------------------------------
// Utilitários de HTML

const IGNORAR = new Set(['script', 'style', 'template'])
const BLOCOS = new Set([
  'address', 'article', 'aside', 'blockquote', 'dd', 'details', 'dialog', 'div', 'dl',
  'dt', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4',
  'h5', 'h6', 'header', 'hr', 'li', 'main', 'nav', 'ol', 'option', 'p', 'pre', 'section',
  'summary', 'table', 'td', 'th', 'tr', 'ul',
])

function tagDe(no: Node): string {
  return no.nodeType === NodeType.ELEMENT_NODE ? (no.rawTagName ?? '').toLowerCase() : ''
}

function paiDe(el: HTMLElement): HTMLElement | null {
  return (el.parentNode as HTMLElement | null | undefined) ?? null
}

function normalizar(texto: string): string {
  return texto
    .replace(/[^\S\n]+/gu, ' ')
    .replace(/ *\n\s*/gu, '\n')
    .trim()
}

/** Texto que o visitante vê sem JavaScript (sem script, style e template; noscript conta). */
function textoVisivel(el: HTMLElement): string {
  const partes: string[] = []
  const visitar = (no: Node): void => {
    if (no.nodeType === NodeType.TEXT_NODE) {
      partes.push(no.text)
      return
    }
    if (no.nodeType !== NodeType.ELEMENT_NODE) return
    const tag = tagDe(no)
    if (IGNORAR.has(tag)) return
    const bloco = BLOCOS.has(tag)
    if (bloco || tag === 'br') partes.push('\n')
    for (const filho of no.childNodes) visitar(filho)
    if (bloco) partes.push('\n')
  }
  visitar(el)
  return normalizar(partes.join(''))
}

/** Elementos por ordem do documento, sem descer em script, style e template. */
function elementosPorOrdem(raiz: HTMLElement): HTMLElement[] {
  const lista: HTMLElement[] = []
  const visitar = (no: Node): void => {
    if (no.nodeType !== NodeType.ELEMENT_NODE) return
    const el = no as HTMLElement
    if (IGNORAR.has(tagDe(el))) return
    lista.push(el)
    for (const filho of el.childNodes) visitar(filho)
  }
  visitar(raiz)
  return lista
}

/** Nós de texto visíveis, com o elemento pai. */
function nosDeTexto(raiz: HTMLElement): Array<{ texto: string; pai: HTMLElement }> {
  const lista: Array<{ texto: string; pai: HTMLElement }> = []
  const visitar = (no: Node, pai: HTMLElement): void => {
    if (no.nodeType === NodeType.TEXT_NODE) {
      lista.push({ texto: no.text, pai })
      return
    }
    if (no.nodeType !== NodeType.ELEMENT_NODE) return
    const el = no as HTMLElement
    if (IGNORAR.has(tagDe(el))) return
    for (const filho of el.childNodes) visitar(filho, el)
  }
  visitar(raiz, raiz)
  return lista
}

const CLASSES_OCULTAS = new Set(['sr-only', 'visually-hidden', 'hidden', 'invisible', 'opacity-0'])

/**
 * Motivo por que o elemento não é visível, ou null. As classes, o atributo hidden e o
 * estilo verificam-se até ao `limite` (exclusive); aria-hidden em qualquer antepassado.
 */
function motivoOculto(el: HTMLElement, limite: HTMLElement | null): string | null {
  for (let atual: HTMLElement | null = el; atual && atual !== limite; atual = paiDe(atual)) {
    if (atual.hasAttribute('hidden')) return `atributo hidden em <${tagDe(atual)}>`
    const classe = (atual.getAttribute('class') ?? '').split(/\s+/).find((c) => CLASSES_OCULTAS.has(c))
    if (classe) return `classe "${classe}" em <${tagDe(atual)}>`
    const estilo = (atual.getAttribute('style') ?? '').replace(/\s+/g, '').toLowerCase()
    if (/display:none|visibility:hidden|opacity:0(?![.\d])/.test(estilo)) {
      return `estilo "${estilo}" em <${tagDe(atual)}>`
    }
  }
  for (let atual: HTMLElement | null = el; atual; atual = paiDe(atual)) {
    if (atual.getAttribute('aria-hidden') === 'true') return `aria-hidden em <${tagDe(atual)}>`
  }
  return null
}

function contar(texto: string, padrao: RegExp): number {
  return [...texto.matchAll(padrao)].length
}

// ---------------------------------------------------------------------------
// 1) Texto visível

interface Segmento {
  origem: string
  texto: string
}

const ATRIBUTOS_TEXTO = ['alt', 'title', 'aria-label', 'placeholder']

function segmentosDaPagina(doc: HTMLElement): Segmento[] {
  const segmentos: Segmento[] = []
  const body = doc.querySelector('body') ?? doc
  segmentos.push({ origem: 'texto', texto: textoVisivel(body) })

  const titulo = doc.querySelector('head title')
  if (titulo) segmentos.push({ origem: '<title>', texto: normalizar(titulo.text) })

  for (const el of elementosPorOrdem(doc)) {
    const tag = tagDe(el)
    for (const atributo of ATRIBUTOS_TEXTO) {
      const valor = el.getAttribute(atributo)
      if (valor?.trim()) segmentos.push({ origem: `${atributo} de <${tag}>`, texto: normalizar(valor) })
    }
    // O value dos botões <input> também é texto visível.
    const tipo = (el.getAttribute('type') ?? '').toLowerCase()
    if (tag === 'input' && ['submit', 'button', 'reset'].includes(tipo)) {
      const valor = el.getAttribute('value')
      if (valor?.trim()) segmentos.push({ origem: 'value de <input>', texto: normalizar(valor) })
    }
  }

  for (const meta of doc.querySelectorAll('meta')) {
    const chave = (meta.getAttribute('property') ?? meta.getAttribute('name') ?? '').toLowerCase()
    if (chave === 'description' || chave.startsWith('og:') || chave.startsWith('twitter:')) {
      const valor = meta.getAttribute('content')
      if (valor?.trim()) segmentos.push({ origem: `meta ${chave}`, texto: normalizar(valor) })
    }
  }
  return segmentos
}

interface RegraTexto {
  regra: string
  padrao: RegExp
  /** Devolve true para ignorar uma ocorrência (usos corretos da mesma sequência). */
  ignorar?: (texto: string, inicio: number, fim: number) => boolean
}

function escapar(texto: string): string {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Palavra ou expressão inteira, com limites de palavra Unicode. */
function porPalavra(termo: string, distinguirMaiusculas = false): RegExp {
  const corpo = termo.trim().split(/\s+/).map(escapar).join('\\s+')
  return new RegExp(`(?<![\\p{L}\\p{N}])${corpo}(?![\\p{L}\\p{N}])`, distinguirMaiusculas ? 'gu' : 'giu')
}

/** "n.º 1" em referências legais ("art. 6.º, n.º 1, al. b)") é correto. */
function referenciaLegal(texto: string, inicio: number, fim: number): boolean {
  const antes = texto.slice(Math.max(0, inicio - 40), inicio)
  const depois = texto.slice(fim, fim + 40)
  return (
    /\bart(?:igo)?s?\.?\s*\d+\.?\s*[º°]?\s*,?\s*$/iu.test(antes) ||
    /^\s*,?\s*(?:al(?:ínea|\.)|do\s+art|da\s+lei|do\s+decreto|[ea]\s+\d)/iu.test(depois)
  )
}

const REGRAS_TEXTO: RegraTexto[] = [
  ...PALAVRAS.map((p) => ({ regra: `palavra proibida "${p}"`, padrao: porPalavra(p) })),
  ...SO_MAIUSCULAS.map((p) => ({ regra: `marcador "${p}"`, padrao: porPalavra(p, true) })),
  { regra: 'travessão "—"', padrao: /—/gu },
  { regra: 'meia-risca entre espaços " – "', padrao: / – /gu },
  ...BRASILEIRISMOS.map((p) => ({ regra: `brasileirismo "${p}"`, padrao: porPalavra(p) })),
  ...FORMULAS.map((p) => ({ regra: `fórmula proibida "${p}"`, padrao: porPalavra(p) })),
  {
    regra: 'fórmula proibida "n.º 1"',
    padrao: /(?<![\p{L}\p{N}])n\.?\s?[º°]\s?1(?![\p{L}\p{N}/])/giu,
    ignorar: referenciaLegal,
  },
]

const REGRAS_EXPERIENCIA = [
  /(?<![\p{L}\p{N}])(\d+)\s+anos\s+de\s+experiência(?![\p{L}\p{N}])/giu,
  /(?<![\p{L}\p{N}])há\s+mais\s+de\s+(\d+)\s+anos(?![\p{L}\p{N}])/giu,
]

function verificarTexto(page: PageDef, doc: HTMLElement, html: string): void {
  const onde = page.file
  const segmentos = segmentosDaPagina(doc)

  for (const { origem, texto } of segmentos) {
    for (const { regra, padrao, ignorar } of REGRAS_TEXTO) {
      for (const m of texto.matchAll(padrao)) {
        const fim = m.index + m[0].length
        if (ignorar?.(texto, m.index, fim)) continue
        falhar(onde, regra, `${origem}: «${excerto(texto, m.index, fim)}»`)
      }
    }

    if (PAGINAS_LEGAIS.has(page.id)) continue
    for (const padrao of REGRAS_EXPERIENCIA) {
      for (const m of texto.matchAll(padrao)) {
        if (Number(m[1]) === 30) continue
        falhar(
          onde,
          `alegação de experiência com ${m[1]} anos (só "30" é permitido)`,
          `${origem}: «${excerto(texto, m.index, m.index + m[0].length)}»`,
        )
      }
    }
  }

  // O estado de sucesso do formulário só existe no JavaScript. Na página do formulário
  // nenhum "Recebemos" pode vir no HTML; nas outras, a frase de sucesso.
  // Sem scripts e sem os comentários que o React insere entre nós de texto.
  const semScripts = html.replace(/<script\b[\s\S]*?<\/script>/gi, ' ').replace(/<!--[\s\S]*?-->/g, '')
  const temFormulario = page.id === 'home' || doc.querySelector('form[data-lead-form]') !== null
  const padraoRecebemos = temFormulario ? porPalavra('recebemos') : porPalavra('recebemos o seu pedido')
  for (const m of semScripts.matchAll(padraoRecebemos)) {
    falhar(
      onde,
      '"Recebemos" no HTML pré-renderizado (o estado de sucesso só existe no JavaScript)',
      `«${excerto(semScripts, m.index, m.index + m[0].length)}»`,
    )
  }
}

// ---------------------------------------------------------------------------
// 2) Código-fonte e ficheiros gerados

const EXT_SAIDA = new Set(['.html', '.js', '.css', '.json', '.xml', '.txt', '.webmanifest', '.svg'])
const EXT_FONTE = new Set([
  ...EXT_SAIDA, '.ts', '.tsx', '.mts', '.cts', '.jsx', '.mjs', '.cjs', '.md', '.yml', '.yaml',
])

function listarFicheiros(pasta: string): string[] {
  if (!fs.existsSync(pasta)) return []
  const lista: string[] = []
  for (const entrada of fs.readdirSync(pasta, { withFileTypes: true })) {
    if (entrada.name === 'node_modules' || entrada.name === '.git') continue
    const caminho = path.join(pasta, entrada.name)
    if (entrada.isDirectory()) lista.push(...listarFicheiros(caminho))
    else if (entrada.isFile()) lista.push(caminho)
  }
  return lista
}

function relativo(ficheiro: string): string {
  return path.relative(process.cwd(), ficheiro).split(path.sep).join('/')
}

function procurarNoFicheiro(ficheiro: string, padrao: RegExp, regra: string): void {
  const texto = fs.readFileSync(ficheiro, 'utf8')
  const ocorrencias = [...texto.matchAll(padrao)]
  for (const m of ocorrencias.slice(0, 5)) {
    const linha = texto.slice(0, m.index).split('\n').length
    falhar('código', regra, `${relativo(ficheiro)}:${linha}: «${excerto(texto, m.index, m.index + m[0].length)}»`)
  }
  if (ocorrencias.length > 5) {
    falhar('código', regra, `${relativo(ficheiro)}: mais ${ocorrencias.length - 5} ocorrência(s)`)
  }
}

function extensao(ficheiro: string): string {
  return path.extname(ficheiro).toLowerCase()
}

function comExtensao(ficheiros: string[], ...extensoes: string[]): string[] {
  return ficheiros.filter((f) => extensoes.includes(extensao(f)))
}

function verificarCodigo(): void {
  const src = path.join(RAIZ, 'src')
  if (!fs.existsSync(src)) falhar('código', 'pasta src/ não encontrada', relativo(src))
  const fonte = listarFicheiros(src)
  const publico = listarFicheiros(path.join(RAIZ, 'public'))
  const saida = listarFicheiros(PASTA)

  // h-screen: TSX do código-fonte e CSS gerado.
  for (const ficheiro of [...comExtensao(fonte, '.tsx'), ...comExtensao(saida, '.css')]) {
    procurarNoFicheiro(ficheiro, /h-screen/g, '"h-screen" (usar alturas dvh/svh)')
  }

  // higgsfield: src/, public/ e pasta de saída (conteúdo dos ficheiros de texto e nomes).
  const candidatos: Array<[string, Set<string>]> = [
    ...[...fonte, ...publico].map((f): [string, Set<string>] => [f, EXT_FONTE]),
    ...saida.map((f): [string, Set<string>] => [f, EXT_SAIDA]),
  ]
  for (const [ficheiro, extensoes] of candidatos) {
    if (/higgsfield/i.test(path.basename(ficheiro))) {
      falhar('código', '"higgsfield" no nome de um ficheiro', relativo(ficheiro))
    }
    if (extensoes.has(extensao(ficheiro))) {
      procurarNoFicheiro(ficheiro, /higgsfield/gi, '"higgsfield" no conteúdo')
    }
  }

  // APIs de armazenamento: src/**/*.ts(x) fora de src/content/ e JS gerado. Exige-se um
  // identificador a seguir ao ponto (uso da API), para não confundir com texto corrido.
  const armazenamento = /document\.cookie(?![\w$])|localStorage\.[A-Za-z_$]|sessionStorage\.[A-Za-z_$]/g
  const pastaConteudo = path.join(src, 'content') + path.sep
  const fonteTs = comExtensao(fonte, '.ts', '.tsx').filter((f) => !f.startsWith(pastaConteudo))
  for (const ficheiro of [...fonteTs, ...comExtensao(saida, '.js')]) {
    procurarNoFicheiro(ficheiro, armazenamento, 'uso de document.cookie, localStorage ou sessionStorage')
  }
}

// ---------------------------------------------------------------------------
// 3) Conformidade (marcadores do contrato do build)

function legendasVisiveis(ambito: HTMLElement): HTMLElement[] {
  return ambito
    .querySelectorAll('figcaption, [data-ai-caption]')
    .filter((el) => textoVisivel(el).includes(LEGENDA_IA) && motivoOculto(el, ambito) === null)
}

function verificarImagensIA(onde: string, doc: HTMLElement): void {
  for (const img of doc.querySelectorAll('img[data-ilustrativa="true"]')) {
    const contentor = img.closest('[data-ai-image]')
    if (contentor && legendasVisiveis(contentor).length > 0) continue

    // Imagem de fundo (CTA): legenda [data-ai-caption] na própria secção.
    const seccao = img.closest('section')
    const daSeccao = seccao
      ? legendasVisiveis(seccao).filter((l) => {
          const dono = l.closest('[data-ai-image]')
          return dono === null || dono === seccao
        })
      : []
    if (daSeccao.length > 0) continue

    const regra = contentor
      ? `imagem ilustrativa sem a legenda visível "${LEGENDA_IA}" no seu [data-ai-image]`
      : `imagem ilustrativa fora de figure[data-ai-image] e sem legenda [data-ai-caption] na secção`
    falhar(onde, regra, resumoElemento(img))
  }

  // Nenhuma legenda de IA escondida (aria-hidden, hidden, sr-only, só em hover). O limite
  // é o contentor da imagem: se o contentor inteiro estiver oculto, a imagem também está.
  const legendas = [
    ...doc.querySelectorAll('[data-ai-caption]'),
    ...doc
      .querySelectorAll('[data-ai-image] figcaption')
      .filter((f) => !f.hasAttribute('data-ai-caption') && textoVisivel(f).includes(LEGENDA_IA)),
  ]
  for (const legenda of legendas) {
    const limite = legenda.closest('[data-ai-image]') ?? legenda.closest('section')
    const motivo = motivoOculto(legenda, limite === legenda ? paiDe(legenda) : limite)
    if (motivo) falhar(onde, `legenda de IA escondida (${motivo})`, resumoElemento(legenda))
    else if (!textoVisivel(legenda).includes(LEGENDA_IA)) {
      falhar(onde, `[data-ai-caption] sem o texto "${LEGENDA_IA}"`, resumoElemento(legenda))
    }
  }
}

function verificarTelefone(onde: string, body: HTMLElement): void {
  const numero = /919\s?233\s?372/gu
  const candidatosTag = new Set(['p', 'li', 'dd', 'div', 'a', 'span'])
  const blocosTag = new Set(['p', 'li', 'dd', 'dt', 'div', 'td', 'th', 'address', 'figcaption', 'label', 'blockquote'])
  const nota = new RegExp(escapar(NOTA_TELEFONE), 'gu')

  for (const { texto, pai } of nosDeTexto(body)) {
    if (!/919\s?233\s?372/u.test(texto)) continue
    let proximo: HTMLElement | null = pai
    while (proximo && !candidatosTag.has(tagDe(proximo))) proximo = paiDe(proximo)
    let bloco: HTMLElement | null = pai
    while (bloco && !blocosTag.has(tagDe(bloco))) bloco = paiDe(bloco)

    const candidatos = [proximo, proximo ? paiDe(proximo) : null, bloco].filter(
      (c): c is HTMLElement => c !== null,
    )
    const acompanhado = candidatos.some((c) => {
      const t = textoVisivel(c)
      const notas = contar(t, nota)
      return notas > 0 && notas >= contar(t, numero)
    })
    if (!acompanhado) {
      const contexto = proximo ? textoVisivel(proximo) : normalizar(texto)
      const i = contexto.search(/919\s?233\s?372/u)
      falhar(
        onde,
        `"919 233 372" sem "${NOTA_TELEFONE}" no mesmo elemento`,
        `«${excerto(contexto, Math.max(0, i), Math.max(0, i) + 11)}»`,
      )
    }
  }
}

function verificarRodape(onde: string, doc: HTMLElement, siteTemIlustrativas: boolean): void {
  const rodapes = doc.querySelectorAll('footer')
  const noRodape = (seletor: string): HTMLElement[] => rodapes.flatMap((f) => f.querySelectorAll(seletor))

  const blocosLegais = noRodape('[data-legal-info]')
  if (blocosLegais.length === 0) {
    falhar(onde, 'rodapé sem o bloco [data-legal-info]')
  } else if (!blocosLegais.some((b) => textoVisivel(b).includes('Informação legal'))) {
    falhar(onde, 'bloco [data-legal-info] sem o título "Informação legal"', resumoElemento(blocosLegais[0] as HTMLElement))
  }

  const livro = noRodape('a[href]').some(
    (a) => (a.getAttribute('href') ?? '').trim().replace(/\/+$/, '') === LIVRO_RECLAMACOES,
  )
  if (!livro) falhar(onde, `rodapé sem ligação para ${LIVRO_RECLAMACOES}`)

  const ral = noRodape('[data-ral]')
  if (!ral.some((el) => textoVisivel(el).includes('CNIACC'))) {
    falhar(onde, 'rodapé sem informação RAL ([data-ral] com "CNIACC")', ral[0] ? resumoElemento(ral[0]) : '')
  }

  // Nota geral de IA: existe se, e só se, o site tiver imagens ilustrativas.
  const avisos = doc.querySelectorAll('[data-ai-notice]')
  const avisosRodape = avisos.filter((a) => a.closest('footer') !== null)
  if (siteTemIlustrativas) {
    if (avisosRodape.length === 0) {
      falhar(onde, 'rodapé sem a nota [data-ai-notice] (o site tem img[data-ilustrativa="true"])')
    }
    for (const aviso of avisosRodape) {
      const motivo = motivoOculto(aviso, aviso.closest('footer'))
      if (motivo) falhar(onde, `nota [data-ai-notice] escondida (${motivo})`, resumoElemento(aviso))
      else if (!textoVisivel(aviso)) falhar(onde, 'nota [data-ai-notice] sem texto', resumoElemento(aviso))
    }
  } else if (avisos.length > 0) {
    falhar(
      onde,
      '[data-ai-notice] presente sem nenhuma img[data-ilustrativa="true"] no site',
      resumoElemento(avisos[0] as HTMLElement),
    )
  }

  for (const el of doc.querySelectorAll('[href]')) {
    if ((el.getAttribute('href') ?? '').toLowerCase().includes(ODR)) {
      falhar(onde, 'ligação à antiga plataforma europeia de litígios (encerrada)', resumoElemento(el))
    }
  }
}

function verificarFormulario(onde: string, doc: HTMLElement): void {
  const formularios = doc.querySelectorAll('form[data-lead-form]')
  const form = formularios[0]
  if (formularios.length !== 1 || !form) {
    falhar(onde, 'exatamente um form[data-lead-form] na página principal', `${formularios.length} encontrado(s)`)
    return
  }

  const caixas = form
    .querySelectorAll('input')
    .filter((i) => (i.getAttribute('type') ?? '').toLowerCase() === 'checkbox')
  const caixa = caixas[0]
  if (caixas.length !== 1 || !caixa) {
    falhar(onde, 'formulário com exatamente uma caixa de verificação (sem caixa de marketing)', `${caixas.length} encontrada(s)`)
  } else {
    if (!caixa.hasAttribute('required')) falhar(onde, 'caixa de verificação sem "required"', resumoElemento(caixa))
    if (caixa.hasAttribute('checked')) falhar(onde, 'caixa de verificação pré-marcada ("checked")', resumoElemento(caixa))
    const id = caixa.getAttribute('id')
    const etiqueta =
      caixa.closest('label') ??
      (id ? (doc.querySelectorAll('label').find((l) => l.getAttribute('for') === id) ?? null) : null)
    if (!etiqueta) {
      falhar(onde, 'caixa de verificação sem <label>', resumoElemento(caixa))
    } else if (
      !etiqueta.querySelectorAll('a').some((a) => (a.getAttribute('href') ?? '').includes('politica-de-privacidade/'))
    ) {
      falhar(onde, '<label> da caixa sem ligação para politica-de-privacidade/', resumoElemento(etiqueta))
    }
  }

  const aviso = form.querySelector('[data-rgpd-notice]')
  const botoes = form.querySelectorAll('button, input')
  const envio =
    botoes.find((b) => (b.getAttribute('type') ?? '').toLowerCase() === 'submit') ??
    botoes.find((b) => tagDe(b) === 'button' && !b.hasAttribute('type'))
  if (!aviso) falhar(onde, 'formulário sem o aviso RGPD [data-rgpd-notice]')
  if (!envio) falhar(onde, 'formulário sem botão type="submit"')
  if (aviso && envio) {
    const ordem = new Map(elementosPorOrdem(doc).map((el, i): [HTMLElement, number] => [el, i]))
    if ((ordem.get(aviso) ?? 0) > (ordem.get(envio) ?? 0)) {
      falhar(onde, 'aviso RGPD [data-rgpd-notice] depois do botão de envio', resumoElemento(aviso))
    }
    const motivo = motivoOculto(aviso, form)
    if (motivo) falhar(onde, `aviso RGPD escondido (${motivo})`, resumoElemento(aviso))
  }
}

function verificarProjetos(onde: string, doc: HTMLElement): void {
  const seccao = doc.querySelector('#projetos')
  if (!seccao) {
    falhar(onde, 'secção #projetos em falta na página principal')
    return
  }
  const projetos = doc.querySelectorAll('[data-project]')
  for (const p of projetos) {
    if (!['true', 'false'].includes(p.getAttribute('data-placeholder') ?? '')) {
      falhar(onde, 'cartão [data-project] sem data-placeholder="true|false"', resumoElemento(p))
    }
  }
  if (!projetos.every((p) => p.getAttribute('data-placeholder') === 'true')) return

  const texto = textoVisivel(seccao)
  if (!texto.includes(FRASE_PROVISORIA)) {
    falhar(onde, `projetos todos provisórios e #projetos sem a frase "${FRASE_PROVISORIA}"`, `«${excerto(texto, 0, 0, 60)}»`)
  }
  const i = texto.indexOf(FRASE_OBRAS_REAIS)
  if (i >= 0) {
    falhar(
      onde,
      'projetos todos provisórios e #projetos com a frase das fotografias de obras reais',
      `«${excerto(texto, i, i + FRASE_OBRAS_REAIS.length)}»`,
    )
  }
}

// ---------------------------------------------------------------------------
// Execução

interface PaginaLida {
  page: PageDef
  html: string
  doc: HTMLElement
}

function main(): void {
  console.log(`check:forbidden  pasta: ${relativo(PASTA) || '.'}  código: ${relativo(RAIZ) || '.'}\n`)
  if (!fs.existsSync(PASTA)) {
    console.error(`FALHA  A pasta de saída não existe: ${PASTA}. Corra primeiro o build.`)
    process.exitCode = 1
    return
  }

  const lidas: PaginaLida[] = []
  for (const page of PAGES) {
    const ficheiro = path.join(PASTA, page.file)
    if (!fs.existsSync(ficheiro)) {
      falhar(page.file, 'página gerada em falta', relativo(ficheiro))
      continue
    }
    const html = fs.readFileSync(ficheiro, 'utf8')
    const doc = parse(html, { comment: false, blockTextElements: { script: true, style: true } })
    lidas.push({ page, html, doc })
  }

  const siteTemIlustrativas = lidas.some(({ doc }) => doc.querySelector('img[data-ilustrativa="true"]') !== null)

  for (const { page, html, doc } of lidas) {
    const onde = page.file
    verificarTexto(page, doc, html)
    verificarImagensIA(onde, doc)
    verificarTelefone(onde, doc.querySelector('body') ?? doc)
    verificarRodape(onde, doc, siteTemIlustrativas)
    if (page.id === 'home') {
      verificarFormulario(onde, doc)
      verificarProjetos(onde, doc)
    }
  }
  verificarCodigo()

  // Relatório por página e, no fim, o código.
  const grupos = [...PAGES.map((p) => p.file), 'código']
  for (const grupo of grupos) {
    const doGrupo = falhas.filter((f) => f.onde === grupo)
    const nome = grupo === 'código' ? 'código-fonte e ficheiros gerados' : grupo
    if (doGrupo.length === 0) {
      console.log(`ok     ${nome}`)
      continue
    }
    console.log(`FALHA  ${nome}: ${doGrupo.length} falha(s)`)
    for (const f of doGrupo) console.log(`         - ${f.regra}${f.excerto ? `\n           ${f.excerto}` : ''}`)
  }

  console.log('')
  console.log(
    `Imagens ilustrativas no site: ${siteTemIlustrativas ? 'sim (a nota do rodapé é obrigatória)' : 'não (a nota do rodapé não pode existir)'}.`,
  )
  if (falhas.length === 0) {
    console.log(`check:forbidden passou: ${lidas.length} páginas e o código sem proibições.`)
  } else {
    console.log(`check:forbidden falhou: ${falhas.length} falha(s).`)
    process.exitCode = 1
  }
}

main()
