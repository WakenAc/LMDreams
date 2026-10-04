// Gate de SEO e de HTML pré-renderizado (Partes 3.9, 3.10 e 6.1).
// Lê cada página gerada, sem JavaScript, e confirma as meta tags, o canónico, o Open
// Graph, a estrutura do HTML (root, main, H1, hierarquia de títulos) e o JSON-LD da
// página principal.
//
// Uso: npm run check:seo [-- --dir <pasta>] [--site <url>] [--verbose]
//   --dir      pasta de saída (por omissão OUT_DIR ou "dist")
//   --site     URL público do site (por omissão SITE_URL ou https://wakenac.github.io/LMDreams)
//   --verbose  lista também as verificações que passaram

import fs from 'node:fs'
import path from 'node:path'
import { NodeType, parse, type HTMLElement, type Node } from 'node-html-parser'
import { PAGES, type PageDef } from '../src/lib/pages.ts'

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

const PASTA = path.resolve(process.cwd(), lerArgumento('dir') ?? process.env.OUT_DIR ?? 'dist')
const SITE_URL = (
  lerArgumento('site') ??
  process.env.SITE_URL ??
  'https://wakenac.github.io/LMDreams'
).replace(/\/+$/, '')
const VERBOSE = process.argv.includes('--verbose')

const TITULO_MAX = 60
const DESCRICAO_MAX = 155
const MAIN_MIN_PRINCIPAL = 200
const TELEFONE = '+351919233372'
const PLACEHOLDER = '[A CONFIRMAR'

// ---------------------------------------------------------------------------
// Utilitários de HTML

const IGNORAR = new Set(['script', 'style', 'template'])
const BLOCOS = new Set([
  'address', 'article', 'aside', 'blockquote', 'dd', 'details', 'dialog', 'div', 'dl',
  'dt', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4',
  'h5', 'h6', 'header', 'hr', 'li', 'main', 'nav', 'ol', 'p', 'pre', 'section',
  'summary', 'table', 'td', 'th', 'tr', 'ul',
])

function tagDe(no: Node): string {
  return no.nodeType === NodeType.ELEMENT_NODE ? (no.rawTagName ?? '').toLowerCase() : ''
}

function normalizar(texto: string): string {
  return texto
    .replace(/[^\S\n]+/gu, ' ')
    .replace(/ *\n\s*/gu, '\n')
    .trim()
}

/** Texto que o visitante vê sem JavaScript (sem script, style e template). */
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

function temRel(link: HTMLElement, valor: string): boolean {
  const rel = (link.getAttribute('rel') ?? '').toLowerCase().split(/\s+/)
  return rel.includes(valor)
}

/** Meta tags pelo nome ou pela propriedade (og:* pode vir em qualquer um dos dois). */
function metas(doc: HTMLElement, chave: string): HTMLElement[] {
  return doc.querySelectorAll('meta').filter((m) => {
    const nome = (m.getAttribute('property') ?? m.getAttribute('name') ?? '').toLowerCase()
    return nome === chave
  })
}

function conteudoMeta(doc: HTMLElement, chave: string): string | undefined {
  return metas(doc, chave)[0]?.getAttribute('content')?.trim()
}

function comprimento(texto: string): number {
  return [...texto].length
}

function ehUrlAbsoluto(valor: unknown): valor is string {
  if (typeof valor !== 'string' || !/^https?:\/\//.test(valor)) return false
  try {
    return new URL(valor).host !== ''
  } catch {
    return false
  }
}

function citar(valor: string | undefined, max = 90): string {
  if (valor === undefined) return '(em falta)'
  const limpo = valor.replace(/\s+/g, ' ')
  return `"${limpo.length > max ? `${limpo.slice(0, max)}…` : limpo}"`
}

/** Valor JSON para as mensagens, encurtado. */
function json(valor: unknown): string {
  const texto = JSON.stringify(valor) ?? '(em falta)'
  return texto.length > 90 ? `${texto.slice(0, 90)}…` : texto
}

function plural(n: number, um: string, varios: string): string {
  return `${n} ${n === 1 ? um : varios}`
}

// ---------------------------------------------------------------------------
// Relatório

interface Verificacao {
  ok: boolean
  regra: string
  detalhe?: string
}

class Relatorio {
  readonly itens: Verificacao[] = []

  verificar(ok: boolean, regra: string, detalhe?: string): boolean {
    this.itens.push({ ok, regra, detalhe })
    return ok
  }

  falhar(regra: string, detalhe?: string): void {
    this.verificar(false, regra, detalhe)
  }

  get falhas(): Verificacao[] {
    return this.itens.filter((i) => !i.ok)
  }
}

// ---------------------------------------------------------------------------
// Head: título, descrição, canónico, robots, Open Graph, Twitter, ícones

function urlEsperado(page: PageDef): string {
  return page.path ? `${SITE_URL}/${page.path}` : `${SITE_URL}/`
}

function verificarHead(doc: HTMLElement, page: PageDef, r: Relatorio): void {
  const head = doc.querySelector('head')
  if (!head) {
    r.falhar('<head> presente')
    return
  }

  // Título
  const titulos = head.querySelectorAll('title')
  const titulo = titulos[0]?.text.trim() ?? ''
  r.verificar(titulos.length === 1, 'um só <title>', `${titulos.length} encontrado(s)`)
  if (r.verificar(titulo.length > 0, '<title> com texto', citar(titulo || undefined))) {
    r.verificar(
      comprimento(titulo) <= TITULO_MAX,
      `<title> até ${TITULO_MAX} caracteres`,
      `${comprimento(titulo)} caracteres: ${citar(titulo)}`,
    )
  }

  // Descrição
  const descricoes = metas(head, 'description').filter((m) => m.getAttribute('name') !== undefined)
  const descricao = descricoes[0]?.getAttribute('content')?.trim() ?? ''
  r.verificar(descricoes.length === 1, 'uma só meta description', `${descricoes.length} encontrada(s)`)
  if (r.verificar(descricao.length > 0, 'meta description com texto', citar(descricao || undefined))) {
    r.verificar(
      comprimento(descricao) <= DESCRICAO_MAX,
      `meta description até ${DESCRICAO_MAX} caracteres`,
      `${comprimento(descricao)} caracteres: ${citar(descricao)}`,
    )
  }

  // Canónico
  const canonicos = head.querySelectorAll('link').filter((l) => temRel(l, 'canonical'))
  const canonico = canonicos[0]?.getAttribute('href')?.trim()
  if (page.indexable) {
    r.verificar(canonicos.length === 1, 'um só link canonical', `${canonicos.length} encontrado(s)`)
    r.verificar(
      canonico === urlEsperado(page),
      'canonical absoluto com SITE_URL e barra final',
      `esperado "${urlEsperado(page)}", encontrado ${citar(canonico)}`,
    )
  } else if (canonicos.length > 0) {
    r.verificar(canonicos.length === 1, 'no máximo um link canonical', `${canonicos.length} encontrados`)
    r.verificar(
      ehUrlAbsoluto(canonico) && canonico.startsWith(`${SITE_URL}/`),
      'canonical (opcional na 404) absoluto com SITE_URL',
      citar(canonico),
    )
  }

  // Robots
  const robots = metas(head, 'robots')
  const robotsValor = (robots[0]?.getAttribute('content') ?? '').replace(/\s+/g, '').toLowerCase()
  r.verificar(robots.length === 1, 'uma só meta robots', `${robots.length} encontrada(s)`)
  if (page.indexable) {
    r.verificar(robotsValor === 'index,follow', 'robots "index,follow"', citar(robotsValor || undefined))
  } else {
    r.verificar(robotsValor.split(',').includes('noindex'), 'robots com "noindex"', citar(robotsValor || undefined))
  }

  // Open Graph
  const fixos: Array<[string, string]> = [
    ['og:type', 'website'],
    ['og:locale', 'pt_PT'],
    ['og:site_name', 'LMDreams'],
    ['twitter:card', 'summary_large_image'],
    ['og:image:width', '1200'],
    ['og:image:height', '630'],
  ]
  for (const [chave, esperado] of fixos) {
    const valor = conteudoMeta(head, chave)
    r.verificar(valor === esperado, `${chave} "${esperado}"`, `encontrado ${citar(valor)}`)
  }
  for (const chave of ['og:title', 'og:description', 'og:image:alt']) {
    const valor = conteudoMeta(head, chave)
    r.verificar(Boolean(valor), `${chave} com texto`, citar(valor))
  }

  const ogUrl = conteudoMeta(head, 'og:url')
  if (page.indexable) {
    r.verificar(ogUrl === urlEsperado(page), 'og:url igual ao canonical', `esperado "${urlEsperado(page)}", encontrado ${citar(ogUrl)}`)
  } else if (canonico !== undefined) {
    r.verificar(ogUrl === canonico, 'og:url igual ao canonical', `canonical ${citar(canonico)}, og:url ${citar(ogUrl)}`)
  } else if (ogUrl !== undefined) {
    r.verificar(ehUrlAbsoluto(ogUrl) && ogUrl.startsWith(`${SITE_URL}/`), 'og:url absoluto com SITE_URL', citar(ogUrl))
  }

  const ogImagem = conteudoMeta(head, 'og:image')
  if (
    r.verificar(
      ehUrlAbsoluto(ogImagem) && ogImagem.endsWith('/og-image.jpg'),
      'og:image absoluto e terminado em og-image.jpg',
      citar(ogImagem),
    ) &&
    ogImagem?.startsWith(`${SITE_URL}/`)
  ) {
    const local = path.join(PASTA, decodeURIComponent(ogImagem.slice(SITE_URL.length + 1)))
    r.verificar(fs.existsSync(local), 'og:image existe na pasta de saída', path.relative(PASTA, local))
  }

  // Tema, manifesto e ícones
  const temas = metas(head, 'theme-color').filter((m) => m.getAttribute('name') !== undefined)
  r.verificar(
    temas.length > 0 && temas.every((m) => Boolean(m.getAttribute('content')?.trim())),
    'meta theme-color',
    `${temas.length} encontrada(s)`,
  )
  const manifesto = head.querySelectorAll('link').find((l) => temRel(l, 'manifest'))
  const hrefManifesto = manifesto?.getAttribute('href')
  r.verificar(
    Boolean(hrefManifesto?.endsWith('site.webmanifest')),
    'link rel="manifest" para site.webmanifest',
    citar(hrefManifesto),
  )
  const icone = head.querySelectorAll('link').find((l) => temRel(l, 'icon') && Boolean(l.getAttribute('href')))
  r.verificar(icone !== undefined, 'link rel="icon"', icone ? citar(icone.getAttribute('href')) : '(em falta)')

  // Nenhum placeholder no título, nas meta tags nem no JSON-LD
  const comPlaceholder: string[] = []
  if (titulo.includes(PLACEHOLDER)) comPlaceholder.push('<title>')
  for (const meta of doc.querySelectorAll('meta')) {
    if (meta.getAttribute('content')?.includes(PLACEHOLDER)) {
      comPlaceholder.push(`meta ${meta.getAttribute('property') ?? meta.getAttribute('name') ?? '?'}`)
    }
  }
  for (const script of scriptsJsonLd(doc)) {
    if (script.rawText.includes(PLACEHOLDER)) comPlaceholder.push('JSON-LD')
  }
  if (comPlaceholder.length === 0 && head.toString().includes(PLACEHOLDER)) comPlaceholder.push('<head>')
  r.verificar(comPlaceholder.length === 0, `nenhum "${PLACEHOLDER}" no <head>`, comPlaceholder.join(', '))
}

// ---------------------------------------------------------------------------
// HTML pré-renderizado

function verificarCorpo(doc: HTMLElement, page: PageDef, r: Relatorio): void {
  const html = doc.querySelector('html')
  r.verificar(html?.getAttribute('lang') === 'pt-PT', '<html lang="pt-PT">', citar(html?.getAttribute('lang')))

  const body = doc.querySelector('body')
  if (!body) {
    r.falhar('<body> presente')
    return
  }
  r.verificar(
    body.getAttribute('data-page') === page.id,
    `<body data-page="${page.id}">`,
    citar(body.getAttribute('data-page')),
  )

  const root = body.querySelector('#root')
  const textoRoot = root ? textoVisivel(root) : ''
  r.verificar(
    root !== null && root.children.length > 0 && textoRoot.length > 0,
    '#root pré-renderizado (não vazio)',
    root === null ? '#root em falta' : `${root.children.length} elemento(s), ${textoRoot.length} caracteres`,
  )

  // Marcos
  const mains = body.querySelectorAll('main')
  const conteudo = body.querySelector('main#conteudo')
  r.verificar(
    mains.length === 1 && conteudo !== null,
    'um só <main id="conteudo">',
    `${mains.length} <main>, #conteudo ${conteudo ? 'presente' : 'em falta'}`,
  )
  const minimo = page.id === 'home' ? MAIN_MIN_PRINCIPAL : 0
  const textoMain = conteudo ? textoVisivel(conteudo) : ''
  r.verificar(
    textoMain.length > minimo,
    minimo > 0 ? `<main> com mais de ${minimo} caracteres de texto` : '<main> com texto',
    `${textoMain.length} caracteres`,
  )
  r.verificar(body.querySelector('header') !== null, '<header> presente')
  const navs = body.querySelectorAll('nav').filter((n) => n.getAttribute('aria-label') === 'Navegação principal')
  r.verificar(navs.length > 0, '<nav aria-label="Navegação principal"> presente')
  r.verificar(body.querySelector('footer') !== null, '<footer> presente')

  // Títulos
  const elementos = elementosPorOrdem(body)
  const titulos = elementos.filter((el) => /^h[1-6]$/.test(tagDe(el)))
  const h1s = titulos.filter((el) => tagDe(el) === 'h1')
  const textoH1 = h1s[0] ? textoVisivel(h1s[0]) : ''
  r.verificar(h1s.length === 1, 'exatamente um <h1>', `${h1s.length} encontrado(s)`)
  r.verificar(textoH1.length > 0, '<h1> com texto', citar(textoH1 || undefined))
  if (h1s[0] && conteudo) {
    r.verificar(h1s[0].closest('main') === conteudo, '<h1> dentro de <main id="conteudo">')
  }

  const vazios = titulos.filter((el) => textoVisivel(el).length === 0).map((el) => `<${tagDe(el)}>`)
  r.verificar(vazios.length === 0, 'todos os títulos com texto', vazios.join(', '))

  // Sem saltos ao descer: h1 → h2 → h3 (subir de nível é sempre permitido).
  const saltos: string[] = []
  let anterior = 1
  for (const el of titulos) {
    const nivel = Number(tagDe(el).slice(1))
    if (nivel > anterior + 1) {
      saltos.push(`<h${nivel}> ${citar(textoVisivel(el), 50)} depois de <h${anterior}>`)
    }
    anterior = nivel
  }
  r.verificar(saltos.length === 0, 'hierarquia de títulos sem saltos', saltos.join('; '))
}

// ---------------------------------------------------------------------------
// JSON-LD

type Json = null | boolean | number | string | Json[] | { [chave: string]: Json }
type ObjetoJson = { [chave: string]: Json }

function textoPreenchido(valor: unknown): boolean {
  return typeof valor === 'string' && valor.trim() !== ''
}

function ehObjeto(valor: unknown): valor is ObjetoJson {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor)
}

function scriptsJsonLd(doc: HTMLElement): HTMLElement[] {
  return doc
    .querySelectorAll('script')
    .filter((s) => (s.getAttribute('type') ?? '').trim().toLowerCase() === 'application/ld+json')
}

function temTipo(obj: ObjetoJson, tipo: string): boolean {
  const valor = obj['@type']
  return valor === tipo || (Array.isArray(valor) && valor.includes(tipo))
}

/** Percorre o JSON e devolve os caminhos com chaves proibidas ou placeholders. */
function procurarProibidos(valor: Json, caminho: string, saida: string[]): void {
  if (typeof valor === 'string') {
    if (valor.includes(PLACEHOLDER)) saida.push(`${caminho} contém "${PLACEHOLDER}"`)
    return
  }
  if (Array.isArray(valor)) {
    valor.forEach((v, i) => procurarProibidos(v, `${caminho}[${i}]`, saida))
    return
  }
  if (!ehObjeto(valor)) return
  for (const [chave, filho] of Object.entries(valor)) {
    if (['aggregateRating', 'review', 'reviews', 'priceRange'].includes(chave)) {
      saida.push(`${caminho}.${chave} não é permitido`)
    }
    procurarProibidos(filho, `${caminho}.${chave}`, saida)
  }
}

function urlDaImagem(valor: Json | undefined): string | undefined {
  if (typeof valor === 'string') return valor
  if (ehObjeto(valor) && typeof valor.url === 'string') return valor.url
  return undefined
}

function verificarJsonLd(doc: HTMLElement, page: PageDef, r: Relatorio): void {
  const scripts = scriptsJsonLd(doc)
  if (page.id !== 'home') {
    r.verificar(scripts.length === 0, 'sem JSON-LD fora da página principal', `${scripts.length} bloco(s)`)
    return
  }
  if (!r.verificar(scripts.length > 0, 'JSON-LD presente na página principal')) return

  const entidades: Array<{ obj: ObjetoJson; contexto: Json | undefined }> = []
  scripts.forEach((script, i) => {
    let dados: Json
    try {
      dados = JSON.parse(script.rawText) as Json
    } catch (erro) {
      r.falhar(`JSON-LD n.º ${i + 1} é JSON válido`, (erro as Error).message)
      return
    }
    r.verificar(true, `JSON-LD n.º ${i + 1} é JSON válido`)

    const proibidos: string[] = []
    procurarProibidos(dados, '$', proibidos)
    r.verificar(
      proibidos.length === 0,
      `JSON-LD n.º ${i + 1} sem aggregateRating, review, priceRange nem placeholders`,
      proibidos.join('; '),
    )

    const topo = Array.isArray(dados) ? dados : [dados]
    for (const item of topo) {
      if (!ehObjeto(item)) continue
      const grafo = Array.isArray(item['@graph']) ? item['@graph'] : [item]
      for (const no of grafo) {
        if (ehObjeto(no)) entidades.push({ obj: no, contexto: no['@context'] ?? item['@context'] })
      }
    }
  })

  const empresas = entidades.filter((e) => temTipo(e.obj, 'GeneralContractor'))
  const primeira = empresas[0]
  if (empresas.length !== 1 || !primeira) {
    r.falhar('um só @type GeneralContractor', `${empresas.length} encontrado(s)`)
    return
  }
  r.verificar(true, 'um só @type GeneralContractor')
  const { obj: empresa, contexto } = primeira

  r.verificar(
    contexto === 'https://schema.org' || contexto === 'https://schema.org/',
    '@context "https://schema.org"',
    json(contexto),
  )
  const texto = (chave: string): string | undefined => {
    const v = empresa[chave]
    return typeof v === 'string' && v.trim() ? v : undefined
  }
  r.verificar(texto('name') !== undefined, 'JSON-LD name', citar(texto('name')))
  r.verificar(empresa.url === `${SITE_URL}/`, 'JSON-LD url = SITE_URL + "/"', `esperado "${SITE_URL}/", encontrado ${json(empresa.url)}`)
  r.verificar(empresa.telephone === TELEFONE, `JSON-LD telephone "${TELEFONE}"`, json(empresa.telephone))
  r.verificar(
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texto('email') ?? ''),
    'JSON-LD email',
    json(empresa.email),
  )
  r.verificar(texto('description') !== undefined, 'JSON-LD description', citar(texto('description')))

  const area = empresa.areaServed
  r.verificar(
    ehObjeto(area) && area['@type'] === 'AdministrativeArea' && area.name === 'Portugal continental',
    'JSON-LD areaServed {AdministrativeArea, "Portugal continental"}',
    json(area),
  )

  if ('address' in empresa) {
    const a = empresa.address
    r.verificar(
      ehObjeto(a) &&
        a['@type'] === 'PostalAddress' &&
        textoPreenchido(a.streetAddress) &&
        typeof a.postalCode === 'string' &&
        /^\d{4}-\d{3}$/.test(a.postalCode) &&
        textoPreenchido(a.addressLocality) &&
        a.addressCountry === 'PT',
      'JSON-LD address é PostalAddress (rua, código postal 0000-000, localidade, PT)',
      json(a),
    )
  }

  for (const chave of ['image', 'logo']) {
    const url = urlDaImagem(empresa[chave])
    r.verificar(ehUrlAbsoluto(url), `JSON-LD ${chave} absoluto`, citar(url))
  }

  if ('knowsAbout' in empresa) {
    const lista = empresa.knowsAbout
    r.verificar(
      Array.isArray(lista) && lista.length > 0 && lista.every((v) => typeof v === 'string' && v.trim() !== ''),
      'JSON-LD knowsAbout é uma lista de textos',
      json(lista),
    )
  }
  if ('sameAs' in empresa) {
    const valor = empresa.sameAs
    const lista = Array.isArray(valor) ? valor : [valor]
    const invalidos = lista.filter((v) => {
      if (typeof v !== 'string') return true
      try {
        return new URL(v).protocol !== 'https:'
      } catch {
        return true
      }
    })
    r.verificar(
      lista.length > 0 && invalidos.length === 0,
      'JSON-LD sameAs só com URLs https',
      json(valor),
    )
  }
}

// ---------------------------------------------------------------------------
// Execução

function verificarPagina(page: PageDef): Relatorio {
  const r = new Relatorio()
  const ficheiro = path.join(PASTA, page.file)
  if (!r.verificar(fs.existsSync(ficheiro), 'ficheiro gerado', `${page.file} não existe`)) return r

  const doc = parse(fs.readFileSync(ficheiro, 'utf8'), {
    comment: false,
    blockTextElements: { script: true, style: true },
  })
  verificarHead(doc, page, r)
  verificarCorpo(doc, page, r)
  verificarJsonLd(doc, page, r)
  return r
}

function main(): void {
  console.log(`check:seo  pasta: ${path.relative(process.cwd(), PASTA) || '.'}  SITE_URL: ${SITE_URL}\n`)
  if (!fs.existsSync(PASTA)) {
    console.error(`FALHA  A pasta de saída não existe: ${PASTA}. Corra primeiro o build.`)
    process.exitCode = 1
    return
  }

  let total = 0
  let falhas = 0
  const paginasComFalhas: string[] = []

  for (const page of PAGES) {
    const r = verificarPagina(page)
    const nFalhas = r.falhas.length
    total += r.itens.length
    falhas += nFalhas
    if (nFalhas > 0) paginasComFalhas.push(page.file)

    const estado = nFalhas === 0 ? 'ok   ' : 'FALHA'
    console.log(`${estado}  ${page.file} (${page.id}): ${plural(r.itens.length, 'verificação', 'verificações')}, ${plural(nFalhas, 'falha', 'falhas')}`)
    for (const item of r.itens) {
      if (item.ok && !VERBOSE) continue
      const detalhe = item.detalhe ? `: ${item.detalhe}` : ''
      console.log(`       ${item.ok ? 'ok   ' : 'FALHA'}  ${item.regra}${item.ok ? '' : detalhe}`)
    }
  }

  console.log('')
  if (falhas === 0) {
    console.log(`check:seo passou: ${PAGES.length} páginas, ${total} verificações, 0 falhas.`)
  } else {
    console.log(
      `check:seo falhou: ${falhas} falha(s) em ${total} verificações (${paginasComFalhas.join(', ')}).`,
    )
    process.exitCode = 1
  }
}

main()
