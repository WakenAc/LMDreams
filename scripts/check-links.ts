// Gate "Ligações e assets" (Partes 3.12 e 6.1). Lê a pasta de saída sem servidor e
// resolve cada URL como o navegador o faria no base path: ligações, âncoras, assets
// (HTML, CSS, JSON-LD), site.webmanifest, sitemap.xml e robots.txt.
//
// Uso: tsx scripts/check-links.ts [--dir dist] [--base /LMDreams/] [--site https://…]

import fs from 'node:fs'
import path from 'node:path'
import { parse, type HTMLElement } from 'node-html-parser'
import { PAGES } from '../src/lib/pages.ts'
import { argValue, DEFAULT_BASE, DEFAULT_SITE_URL, isMainModule, normalizeBase } from './serve-dist.ts'

// ---------------------------------------------------------------------------
// Auxiliares exportados (também usados pelo check-budget.ts)
// ---------------------------------------------------------------------------

export interface SrcsetCandidate {
  url: string
  /** Descritor tal como escrito ("640w", "2x" ou ""). */
  descriptor: string
  w?: number
  x?: number
}

/** Candidatos de um `srcset` (algoritmo simplificado do HTML: URL e descritor até à vírgula). */
export function parseSrcset(value: string): SrcsetCandidate[] {
  const out: SrcsetCandidate[] = []
  let i = 0
  while (i < value.length) {
    while (i < value.length && /[\s,]/.test(value.charAt(i))) i++
    if (i >= value.length) break
    let start = i
    while (i < value.length && !/\s/.test(value.charAt(i))) i++
    let url = value.slice(start, i)
    let descriptor = ''
    if (url.endsWith(',')) {
      url = url.replace(/,+$/, '')
    } else {
      start = i
      while (i < value.length && value.charAt(i) !== ',') i++
      descriptor = value.slice(start, i).trim()
    }
    const candidate: SrcsetCandidate = { url, descriptor }
    const w = /^(\d+)w$/.exec(descriptor)
    const x = /^(\d+(?:\.\d+)?)x$/.exec(descriptor)
    if (w?.[1]) candidate.w = Number(w[1])
    else if (x?.[1]) candidate.x = Number(x[1])
    else if (descriptor === '') candidate.x = 1
    out.push(candidate)
  }
  return out
}

/** URL (no base path) de um ficheiro da pasta de saída: "a/index.html" → "<base>a/". */
export function urlOfFile(base: string, rel: string): string {
  if (rel === 'index.html') return base
  if (rel.endsWith('/index.html')) return base + rel.slice(0, -'index.html'.length)
  return base + rel
}

/** Todos os ficheiros e pastas, com caminhos relativos em "/" (distingue maiúsculas). */
export function walk(root: string): { files: Set<string>; dirs: Set<string> } {
  const files = new Set<string>()
  const dirs = new Set<string>()
  const visit = (abs: string, rel: string) => {
    for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
      const childRel = rel ? `${rel}/${entry.name}` : entry.name
      if (entry.isDirectory()) {
        dirs.add(childRel)
        visit(path.join(abs, entry.name), childRel)
      } else if (entry.isFile()) {
        files.add(childRel)
      }
    }
  }
  visit(root, '')
  return { files, dirs }
}

/** Valores de `url(…)` e `@import "…"` de uma folha de estilos. */
export function cssUrls(css: string): string[] {
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, '')
  const out: string[] = []
  for (const m of clean.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)\s]*))\s*\)/gi)) {
    const value = m[1] ?? m[2] ?? m[3] ?? ''
    if (value) out.push(value)
  }
  for (const m of clean.matchAll(/@import\s+(?:"([^"]*)"|'([^']*)')/gi)) {
    const value = m[1] ?? m[2] ?? ''
    if (value) out.push(value)
  }
  return out
}

// ---------------------------------------------------------------------------
// Verificação
// ---------------------------------------------------------------------------

export interface Problem {
  file: string
  value: string
  message: string
}

export interface LinkReport {
  dir: string
  base: string
  siteUrl: string
  pages: number
  links: number
  assets: number
  external: number
  cssFiles: number
  manifestIcons: number
  sitemapUrls: number
  errors: Problem[]
  warnings: Problem[]
}

interface Ref {
  /** Ficheiro onde o valor aparece (relativo à pasta). */
  from: string
  /** URL desse ficheiro no base path (para resolver valores relativos). */
  fromUrl: string
  /** Onde aparece, por exemplo "a[href]" ou "img[srcset]". */
  label: string
  value: string
  kind: 'link' | 'asset'
  /** Verifica a âncora no ficheiro de destino. */
  fragments: boolean
  /** Tem de ser um URL absoluto do próprio site (canónico, og:image…). */
  absolute?: boolean
}

type Resolution = { file: string } | { error: string }

const IGNORED_SCHEMES = /^(mailto|tel|sms|data|blob|about):/i
const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.svg', '.ico'])
const ABSOLUTE_META = new Set(['og:image', 'og:image:url', 'og:image:secure_url', 'twitter:image', 'og:url'])
/** Ficheiros que podem existir sem serem referenciados por nenhuma página. */
const ROOT_FILES = new Set(['sitemap.xml', 'robots.txt', 'favicon.ico', '.nojekyll'])

class LinkChecker {
  readonly errors: Problem[] = []
  readonly warnings: Problem[] = []
  readonly referenced = new Set<string>()
  readonly counts = { links: 0, assets: 0, external: 0 }
  readonly ids = new Map<string, Set<string>>()

  readonly root: string
  readonly base: string
  readonly site: URL
  readonly files: Set<string>
  readonly dirs: Set<string>
  private readonly lowerCase = new Map<string, string>()

  constructor(root: string, base: string, site: URL, files: Set<string>, dirs: Set<string>) {
    this.root = root
    this.base = base
    this.site = site
    this.files = files
    this.dirs = dirs
    for (const file of files) this.lowerCase.set(file.toLowerCase(), file)
  }

  error(file: string, value: string, message: string): void {
    this.errors.push({ file, value, message })
  }

  warn(file: string, value: string, message: string): void {
    this.warnings.push({ file, value, message })
  }

  /** Ids de um ficheiro HTML (já lidos) ou SVG (lidos a pedido). */
  private idsOf(file: string): Set<string> | undefined {
    const known = this.ids.get(file)
    if (known) return known
    if (!file.endsWith('.svg')) return undefined
    const svg = parse(fs.readFileSync(path.join(this.root, file), 'utf8'))
    const ids = new Set(svg.querySelectorAll('[id]').map((el) => el.id))
    this.ids.set(file, ids)
    return ids
  }

  private resolveFile(rel: string): Resolution {
    const caseHint = (file: string) => {
      const other = this.lowerCase.get(file.toLowerCase())
      return other ? `não existe; existe "${other}" (o GitHub Pages distingue maiúsculas)` : undefined
    }
    if (rel === '' || rel.endsWith('/')) {
      const file = `${rel}index.html`
      if (this.files.has(file)) return { file }
      if (this.dirs.has(rel.slice(0, -1)) || rel === '') return { error: `a pasta "${rel || '/'}" não tem index.html` }
      return { error: caseHint(file) ?? 'página não existe' }
    }
    if (this.files.has(rel)) return { file: rel }
    if (this.dirs.has(rel)) {
      return { error: this.files.has(`${rel}/index.html`) ? 'falta a barra final' : 'aponta para uma pasta sem index.html' }
    }
    const hint = caseHint(rel)
    if (hint) return { error: hint }
    if (path.posix.extname(rel) === '') return { error: 'página não existe (sem extensão nem barra final)' }
    return { error: 'ficheiro não existe' }
  }

  check(ref: Ref): void {
    const value = ref.value.trim()
    const fail = (message: string) => this.error(ref.from, `${ref.label}="${ref.value}"`, message)

    if (value === '') return fail('valor vazio')
    if (/^javascript:/i.test(value)) return fail('javascript: não é permitido')
    if (IGNORED_SCHEMES.test(value)) return
    if (value === '#') return fail('âncora vazia ("#")')

    const hasScheme = /^[a-z][a-z\d+.-]*:/i.test(value) || value.startsWith('//')
    if (ref.absolute && !hasScheme) return fail(`tem de ser um URL absoluto que comece por ${this.siteUrl}`)

    let resolved: URL
    if (hasScheme) {
      let abs: URL
      try {
        abs = new URL(value, `${this.site.protocol}//${this.site.host}/`)
      } catch {
        return fail('URL inválido')
      }
      if (abs.protocol !== 'http:' && abs.protocol !== 'https:') return fail(`esquema não suportado (${abs.protocol})`)
      if (abs.host !== this.site.host) {
        if (ref.absolute) return fail(`aponta para outro domínio (esperado ${this.siteUrl})`)
        this.counts.external++
        return
      }
      if (abs.protocol !== this.site.protocol) return fail(`protocolo diferente do SITE_URL (${this.siteUrl})`)
      // URL do próprio site: troca o SITE_URL pelo base path e verifica no disco.
      const sitePath = this.site.pathname
      let local: string
      if (abs.pathname === sitePath.slice(0, -1)) local = this.base.slice(0, -1)
      else if (abs.pathname.startsWith(sitePath)) local = this.base + abs.pathname.slice(sitePath.length)
      else return fail(`está no domínio do site mas fora do SITE_URL (${this.siteUrl})`)
      resolved = new URL(`http://site.invalid${local}${abs.search}${abs.hash}`)
      if (local === this.base.slice(0, -1)) {
        this.count(ref)
        return fail('falta a barra final')
      }
    } else {
      if (value.startsWith('/')) {
        if (!value.startsWith(this.base)) {
          this.count(ref)
          const bare = value.split(/[?#]/)[0] ?? value
          return fail(`${bare}/` === this.base ? 'falta a barra final' : `caminho absoluto sem o base path (${this.base})`)
        }
      } else if (ref.from === '404.html' && !value.startsWith('#') && !value.startsWith('?')) {
        this.count(ref)
        return fail('caminho relativo na 404.html (é servida em qualquer URL; usa o base path)')
      }
      try {
        resolved = new URL(value, `http://site.invalid${ref.fromUrl}`)
      } catch {
        return fail('URL inválido')
      }
    }

    this.count(ref)
    let pathname: string
    try {
      pathname = decodeURIComponent(resolved.pathname)
    } catch {
      return fail('URL mal codificado')
    }
    if (!pathname.startsWith(this.base)) return fail(`sai do base path (${this.base})`)

    const target = this.resolveFile(pathname.slice(this.base.length))
    if ('error' in target) return fail(target.error)
    this.referenced.add(target.file)

    if (!ref.fragments) return
    if (value.endsWith('#')) return fail('âncora vazia ("#")')
    if (!resolved.hash) return
    let id: string
    try {
      id = decodeURIComponent(resolved.hash.slice(1))
    } catch {
      return fail('âncora mal codificada')
    }
    const ids = this.idsOf(target.file)
    if (ids && !ids.has(id)) fail(`a âncora #${id} não existe em ${target.file}`)
  }

  private count(ref: Ref): void {
    if (ref.kind === 'link') this.counts.links++
    else this.counts.assets++
  }

  get siteUrl(): string {
    return (this.site.origin + this.site.pathname).replace(/\/$/, '')
  }

  /** Converte um URL absoluto do site num caminho relativo à pasta (ou undefined). */
  siteRelative(value: string): string | undefined {
    if (!value.startsWith(`${this.siteUrl}/`)) return undefined
    return value.slice(this.siteUrl.length + 1)
  }

  exists(rel: string): boolean {
    return 'file' in this.resolveFile(rel)
  }
}

function relList(el: HTMLElement): string[] {
  return (el.getAttribute('rel') ?? '').toLowerCase().split(/\s+/).filter(Boolean)
}

/** Recolhe as referências de uma página HTML. */
function htmlRefs(doc: HTMLElement, from: string, fromUrl: string, checker: LinkChecker): Ref[] {
  const refs: Ref[] = []
  const add = (label: string, value: string, kind: Ref['kind'], fragments: boolean, absolute = false) =>
    refs.push({ from, fromUrl, label, value, kind, fragments, absolute })

  for (const el of doc.querySelectorAll('*')) {
    const tag = el.tagName.toLowerCase()
    const attrs = el.attrs
    const rel = tag === 'link' ? relList(el) : []
    const pageLink = tag === 'a' || tag === 'area' || rel.includes('canonical') || rel.includes('alternate')

    for (const name of ['href', 'xlink:href']) {
      const value = attrs[name]
      if (value !== undefined) add(`${tag}[${name}]`, value, pageLink ? 'link' : 'asset', true, rel.includes('canonical'))
    }
    if (attrs.src !== undefined) add(`${tag}[src]`, attrs.src, 'asset', false)
    if (attrs.poster !== undefined) add(`${tag}[poster]`, attrs.poster, 'asset', false)
    for (const name of ['srcset', 'imagesrcset']) {
      const value = attrs[name]
      if (value === undefined) continue
      const candidates = parseSrcset(value)
      if (candidates.length === 0) checker.error(from, `${tag}[${name}]="${value}"`, 'srcset vazio')
      for (const c of candidates) {
        if (c.w === undefined && c.x === undefined) {
          checker.error(from, `${tag}[${name}]="${value}"`, `descritor inválido "${c.descriptor}"`)
        }
        add(`${tag}[${name}]`, c.url, 'asset', false)
      }
    }
    for (const name of ['action', 'formaction']) {
      const value = attrs[name]
      if (value !== undefined && value.trim() !== '') add(`${tag}[${name}]`, value, 'link', false)
    }
    if (attrs.style) {
      for (const url of cssUrls(attrs.style)) if (!url.startsWith('#')) add(`${tag}[style]`, url, 'asset', false)
    }
    if (tag === 'meta') {
      const property = (attrs.property ?? attrs.name ?? '').toLowerCase()
      if (ABSOLUTE_META.has(property) && attrs.content !== undefined) {
        add(`meta[${property}]`, attrs.content, property === 'og:url' ? 'link' : 'asset', property === 'og:url', true)
      }
    }
    if (tag === 'style') {
      for (const url of cssUrls(el.rawText)) if (!url.startsWith('#')) add('style', url, 'asset', false)
    }
    // Carregador diferido das ilhas (scripts/prerender.ts): data-src e data-preload.
    if (tag === 'script' && attrs['data-lmd-loader'] !== undefined) {
      if (attrs['data-src']) add('script[data-src]', attrs['data-src'], 'asset', false)
      for (const u of (attrs['data-preload'] ?? '').split(' ').filter(Boolean)) add('script[data-preload]', u, 'asset', false)
    }
    if (tag === 'script' && (attrs.type ?? '').toLowerCase() === 'application/ld+json') {
      let data: unknown
      try {
        data = JSON.parse(el.rawText)
      } catch {
        checker.error(from, 'script[type="application/ld+json"]', 'JSON-LD inválido')
        continue
      }
      // Só os URLs do próprio site; os externos (schema.org, redes sociais) ficam de fora.
      for (const [key, value] of jsonStrings(data)) {
        if (/^https?:\/\//i.test(value)) add(`JSON-LD ${key}`, value.replace(/#.*$/, ''), 'asset', false)
      }
    }
  }
  return refs
}

/** Pares [caminho, texto] de todas as cadeias de um valor JSON (caminhos como "icons[0].src"). */
function jsonStrings(value: unknown, at = ''): [string, string][] {
  if (typeof value === 'string') return [[at, value]]
  if (Array.isArray(value)) return value.flatMap((v, i) => jsonStrings(v, `${at}[${i}]`))
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) => jsonStrings(v, at ? `${at}.${k}` : k))
  }
  return []
}

function checkManifest(checker: LinkChecker): number {
  const file = 'site.webmanifest'
  if (!checker.files.has(file)) {
    checker.error(file, '', 'ficheiro em falta')
    return 0
  }
  let data: unknown
  try {
    data = JSON.parse(fs.readFileSync(path.join(checker.root, file), 'utf8'))
  } catch (error) {
    checker.error(file, '', `JSON inválido (${error instanceof Error ? error.message : String(error)})`)
    return 0
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    checker.error(file, '', 'o manifesto tem de ser um objeto JSON')
    return 0
  }

  for (const [key, value] of jsonStrings(data)) {
    if (!value.startsWith('/')) continue
    checker.error(file, `${key}="${value}"`, 'caminho começado por "/" (usa caminhos relativos ao manifesto)')
    // O ficheiro é referido (só o caminho está mal): não o assinala também como órfão.
    if (value.startsWith(checker.base)) checker.referenced.add(value.slice(checker.base.length).split(/[?#]/)[0] ?? '')
  }

  const manifest = data as Record<string, unknown>
  const fromUrl = urlOfFile(checker.base, file)
  const relative = (key: string, value: unknown, kind: Ref['kind']) => {
    if (typeof value !== 'string') {
      checker.error(file, key, 'em falta ou não é texto')
      return
    }
    if (value.startsWith('/')) return // já assinalado acima
    if (/^[a-z][a-z\d+.-]*:/i.test(value) || value.startsWith('//')) {
      checker.error(file, `${key}="${value}"`, 'tem de ser relativo ao manifesto (por exemplo "./")')
      return
    }
    checker.check({ from: file, fromUrl, label: key, value, kind, fragments: false })
  }

  relative('start_url', manifest.start_url, 'link')
  if (typeof manifest.scope === 'string' && !manifest.scope.startsWith('/')) {
    const scope = new URL(manifest.scope, `http://site.invalid${fromUrl}`).pathname
    if (!scope.startsWith(checker.base) || !scope.endsWith('/')) {
      checker.error(file, `scope="${manifest.scope}"`, `tem de ser uma pasta dentro do base path (${checker.base})`)
    }
  } else if (typeof manifest.scope !== 'string') {
    checker.error(file, 'scope', 'em falta (usa "./")')
  }

  const icons = manifest.icons
  if (!Array.isArray(icons) || icons.length === 0) {
    checker.error(file, 'icons', 'em falta ou vazio')
    return 0
  }
  icons.forEach((icon: unknown, i) => {
    const src = icon && typeof icon === 'object' ? (icon as Record<string, unknown>).src : undefined
    relative(`icons[${i}].src`, src, 'asset')
  })
  if (Array.isArray(manifest.screenshots)) {
    manifest.screenshots.forEach((shot: unknown, i) => {
      const src = shot && typeof shot === 'object' ? (shot as Record<string, unknown>).src : undefined
      relative(`screenshots[${i}].src`, src, 'asset')
    })
  }
  return icons.length
}

function checkSitemapAndRobots(checker: LinkChecker): number {
  const siteUrl = checker.siteUrl
  let count = 0
  if (!checker.files.has('sitemap.xml')) {
    checker.error('sitemap.xml', '', 'ficheiro em falta')
  } else {
    const xml = fs.readFileSync(path.join(checker.root, 'sitemap.xml'), 'utf8')
    if (!/<urlset[\s>]/.test(xml)) checker.error('sitemap.xml', '', 'sem elemento <urlset>')
    const seen = new Set<string>()
    for (const m of xml.matchAll(/<loc>\s*([^<]*?)\s*<\/loc>/g)) {
      const loc = (m[1] ?? '').replace(/&amp;/g, '&')
      count++
      const fail = (message: string) => checker.error('sitemap.xml', `<loc>${loc}</loc>`, message)
      if (seen.has(loc)) fail('URL repetido')
      seen.add(loc)
      if (!/^https?:\/\//.test(loc)) {
        fail('tem de ser um URL absoluto')
        continue
      }
      const rel = checker.siteRelative(loc)
      if (rel === undefined) {
        fail(`não começa por ${siteUrl}/`)
        continue
      }
      if (!loc.endsWith('/')) {
        fail('falta a barra final')
        continue
      }
      if (!checker.exists(rel)) fail('não corresponde a nenhuma página da pasta')
    }
    if (count === 0) checker.error('sitemap.xml', '', 'nenhum <loc>')
    for (const page of PAGES) {
      const expected = `${siteUrl}/${page.path}`
      if (page.indexable && !seen.has(expected)) checker.error('sitemap.xml', expected, `falta a página "${page.id}"`)
      if (!page.indexable && seen.has(expected)) checker.error('sitemap.xml', expected, `a página "${page.id}" não é indexável`)
    }
  }

  if (!checker.files.has('robots.txt')) {
    checker.error('robots.txt', '', 'ficheiro em falta')
  } else {
    const robots = fs.readFileSync(path.join(checker.root, 'robots.txt'), 'utf8')
    const expected = `${siteUrl}/sitemap.xml`
    const lines = [...robots.matchAll(/^\s*sitemap\s*:\s*(\S+)\s*$/gim)].map((m) => m[1] ?? '')
    if (!lines.includes(expected)) {
      checker.error('robots.txt', lines.length ? lines.join(', ') : '(sem linha Sitemap)', `falta "Sitemap: ${expected}"`)
    }
  }
  return count
}

function checkOrphans(checker: LinkChecker, jsText: string): void {
  const pageFiles = new Set(PAGES.map((p) => p.file))
  for (const file of checker.files) {
    if (checker.referenced.has(file) || pageFiles.has(file) || ROOT_FILES.has(file)) continue
    // Referências feitas só em JavaScript (por exemplo, imagens carregadas em tempo de execução).
    if (jsText.includes(path.posix.basename(file))) continue
    if (IMAGE_EXT.has(path.posix.extname(file).toLowerCase())) {
      checker.error(file, '', 'imagem publicada sem uso (Parte 4.8: nenhum ficheiro de imagem sem uso no build)')
    } else {
      checker.warn(file, '', 'ficheiro publicado sem referência')
    }
  }
}

export function checkLinks(options: { dir: string; base: string; site?: string }): LinkReport {
  const root = path.resolve(options.dir)
  const base = normalizeBase(options.base)
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
    throw new Error(`A pasta "${options.dir}" não existe. Corre primeiro o build.`)
  }
  const { files, dirs } = walk(root)
  const htmlFiles = [...files].filter((f) => f.endsWith('.html')).toSorted()

  // Lê todas as páginas primeiro (os ids são precisos para as âncoras entre páginas).
  // Só script e style ficam como texto: o conteúdo de <pre> e <noscript> também é verificado.
  const docs = new Map<string, HTMLElement>()
  for (const file of htmlFiles) {
    const html = fs.readFileSync(path.join(root, file), 'utf8')
    docs.set(file, parse(html, { comment: false, blockTextElements: { script: true, style: true } }))
  }

  // SITE_URL: --site; senão o canónico da página principal; senão a variável SITE_URL.
  const canonical = docs.get('index.html')?.querySelector('link[rel="canonical"]')?.getAttribute('href')
  const siteRaw = (options.site ?? canonical ?? process.env.SITE_URL ?? DEFAULT_SITE_URL).trim().replace(/\/+$/, '')
  let site: URL
  try {
    site = new URL(`${siteRaw}/`)
  } catch {
    throw new Error(`SITE_URL inválido: ${siteRaw}`)
  }
  if (!/^https?:$/.test(site.protocol) || site.search || site.hash) throw new Error(`SITE_URL inválido: ${siteRaw}`)

  const checker = new LinkChecker(root, base, site, files, dirs)
  if (docs.has('index.html') && !canonical && !options.site) {
    checker.error('index.html', 'link[rel="canonical"]', `canónico em falta; a usar SITE_URL ${checker.siteUrl}`)
  }
  if (decodeURIComponent(site.pathname) !== base) {
    checker.error('(configuração)', checker.siteUrl, `o caminho do SITE_URL não corresponde ao base path ${base}`)
  }
  for (const page of PAGES) if (!files.has(page.file)) checker.error(page.file, '', `página "${page.id}" em falta`)

  for (const [file, doc] of docs) {
    const ids = new Set<string>()
    for (const el of doc.querySelectorAll('[id]')) {
      if (ids.has(el.id)) checker.error(file, `id="${el.id}"`, 'id repetido')
      ids.add(el.id)
    }
    for (const el of doc.querySelectorAll('a[name]')) ids.add(el.getAttribute('name') ?? '')
    checker.ids.set(file, ids)
  }
  for (const [file, doc] of docs) {
    for (const ref of htmlRefs(doc, file, urlOfFile(base, file), checker)) checker.check(ref)
  }

  const cssFiles = [...files].filter((f) => f.endsWith('.css'))
  for (const file of cssFiles) {
    const css = fs.readFileSync(path.join(root, file), 'utf8')
    for (const url of cssUrls(css)) {
      if (url.startsWith('#')) continue
      checker.check({ from: file, fromUrl: urlOfFile(base, file), label: 'url()', value: url, kind: 'asset', fragments: false })
    }
  }

  const manifestIcons = checkManifest(checker)
  const sitemapUrls = checkSitemapAndRobots(checker)
  const jsText = [...files]
    .filter((f) => /\.m?js$/.test(f))
    .map((f) => fs.readFileSync(path.join(root, f), 'utf8'))
    .join('\n')
  checkOrphans(checker, jsText)

  return {
    dir: options.dir,
    base,
    siteUrl: checker.siteUrl,
    pages: htmlFiles.length,
    links: checker.counts.links,
    assets: checker.counts.assets,
    external: checker.counts.external,
    cssFiles: cssFiles.length,
    manifestIcons,
    sitemapUrls,
    errors: checker.errors,
    warnings: checker.warnings,
  }
}

function printProblems(title: string, problems: Problem[]): void {
  if (problems.length === 0) return
  console.log(`\n${title} (${problems.length}):`)
  const byFile = new Map<string, Problem[]>()
  for (const p of problems) byFile.set(p.file, [...(byFile.get(p.file) ?? []), p])
  for (const [file, list] of byFile) {
    console.log(`  ${file}`)
    for (const p of list) console.log(`    - ${p.value ? `${p.value}: ` : ''}${p.message}`)
  }
}

function main(): void {
  const dir = argValue('dir') ?? process.env.OUT_DIR ?? 'dist'
  const base = argValue('base') ?? process.env.BASE_PATH ?? DEFAULT_BASE
  const report = checkLinks({ dir, base, site: argValue('site') })

  console.log(`check:links: pasta ${report.dir}, base ${report.base}, SITE_URL ${report.siteUrl}`)
  console.log(`  Páginas HTML: ${report.pages}`)
  console.log(`  Ligações internas verificadas: ${report.links}`)
  console.log(`  Assets verificados: ${report.assets} (inclui ${report.cssFiles} ficheiro(s) CSS)`)
  console.log(`  Ligações externas ignoradas: ${report.external}`)
  console.log(`  site.webmanifest: ${report.manifestIcons} ícone(s)`)
  console.log(`  sitemap.xml: ${report.sitemapUrls} URL(s)`)

  printProblems('Avisos', report.warnings)
  printProblems('Erros', report.errors)

  if (report.errors.length > 0) {
    console.log(`\ncheck:links FALHOU: ${report.errors.length} erro(s).`)
    process.exit(1)
  }
  console.log('\ncheck:links passou: 0 ligações, âncoras, assets ou caminhos do manifesto partidos.')
}

if (isMainModule(import.meta.url)) {
  try {
    main()
  } catch (error) {
    console.error(`check:links: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(1)
  }
}
