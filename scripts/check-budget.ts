// Gate "Peso" (Partes 3.11, 4.8 e 6.1) da página principal: JavaScript e CSS iniciais
// em gzip, peso das imagens na variante que o navegador escolhe e peso aproximado do
// primeiro carregamento em telemóvel (informativo).
//
// Uso: tsx scripts/check-budget.ts [--dir dist] [--base /LMDreams/]
//
// Método e unidades:
// - O brief (Partes 3.11 e 6.1) dá os limites em "KB" sem definir a unidade. Este gate usa
//   KiB (1 KiB = 1024 bytes) e escreve-o assim na saída, com os bytes ao lado.
// - JavaScript e CSS: cada ficheiro é comprimido à parte com gzip de nível 9 e os tamanhos
//   somam-se. O JavaScript inicial é o do carregador (data-src e data-preload), dos
//   <script type="module"> e dos modulepreload da página principal.
// - A coluna "gzip" do Vite no fim do build usa kB (1000 bytes) e a compressão do próprio
//   Vite: a soma dos mesmos ficheiros não coincide com este total e não é o valor do gate.
// - Acima de 95% de um limite, o gate passa com um aviso: os dados reais (projetos,
//   fotografias, dados legais) ainda vão fazer crescer o JavaScript das ilhas.

import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import { parse, type HTMLElement } from 'node-html-parser'
import { cssUrls, parseSrcset, type SrcsetCandidate } from './check-links.ts'
import { argValue, DEFAULT_BASE, isMainModule, normalizeBase } from './serve-dist.ts'

const KIB = 1024
export const LIMITS = {
  js: 100 * KIB,
  css: 30 * KIB,
  heroDesktop: 250 * KIB,
  mediaVariant: 120 * KIB,
  image: 120 * KIB,
  firstLoad: 1.2 * KIB * KIB,
} as const

/** Fração de um limite a partir da qual o gate avisa (passa, mas com pouca folga). */
const WARN_RATIO = 0.95

const HERO_VIEWPORT = 1440
const MOBILE_VIEWPORT = 390
const MOBILE_DPR = 2
const ROOT_FONT_PX = 16

// ---------------------------------------------------------------------------
// Avaliadores simples de media queries, `sizes` e `srcset`
// ---------------------------------------------------------------------------

function toPx(value: string, unit: string): number {
  return unit === 'px' ? Number(value) : Number(value) * ROOT_FONT_PX
}

function matchQuery(query: string, viewport: number): boolean | undefined {
  for (const raw of query.replace(/^only\s+/, '').split(/\s+and\s+/)) {
    const part = raw.trim()
    if (part === 'all' || part === 'screen') continue
    if (part === 'print') return false
    const minMax = /^\(\s*(min|max)-width\s*:\s*(\d+(?:\.\d+)?)(px|em|rem)\s*\)$/.exec(part)
    if (minMax) {
      const px = toPx(minMax[2] ?? '0', minMax[3] ?? 'px')
      if (minMax[1] === 'min' ? viewport < px : viewport > px) return false
      continue
    }
    const range = /^\(\s*width\s*(>=|<=|>|<)\s*(\d+(?:\.\d+)?)(px|em|rem)\s*\)$/.exec(part)
    if (range) {
      const px = toPx(range[2] ?? '0', range[3] ?? 'px')
      const op = range[1]
      const ok = op === '>=' ? viewport >= px : op === '<=' ? viewport <= px : op === '>' ? viewport > px : viewport < px
      if (!ok) return false
      continue
    }
    return undefined
  }
  return true
}

/** Avalia uma media query simples (min/max-width, width >= N); undefined se não for suportada. */
export function matchMedia(media: string | null | undefined, viewport: number): boolean | undefined {
  if (!media?.trim()) return true
  let result = false
  for (const query of media.toLowerCase().split(',')) {
    const match = matchQuery(query.trim(), viewport)
    if (match === undefined) return undefined
    result ||= match
  }
  return result
}

function lengthPx(token: string, viewport: number): number | undefined {
  if (token === '0') return 0
  const m = /^(\d+(?:\.\d+)?)(px|vw|em|rem)$/.exec(token)
  if (!m) return undefined
  const n = Number(m[1])
  if (m[2] === 'px') return n
  if (m[2] === 'vw') return (n * viewport) / 100
  return n * ROOT_FONT_PX
}

/**
 * Largura do espaço (px CSS) segundo o atributo `sizes`: lista de "(condição) comprimento"
 * com um valor final. Sem `sizes`, 100vw. `supported` é falso quando o avaliador não
 * percebe uma entrada (calc(), auto…): nesse caso usa 100vw, o caso mais pesado.
 */
export function evaluateSizes(sizes: string | undefined, viewport: number): { px: number; supported: boolean } {
  if (!sizes?.trim()) return { px: viewport, supported: true }
  for (const raw of sizes.split(',')) {
    const entry = raw.trim()
    if (!entry) continue
    const m = /^(.*?)\s*([^\s()]+)$/.exec(entry)
    if (!m) return { px: viewport, supported: false }
    const condition = m[1] ?? ''
    if (condition) {
      const match = matchMedia(condition, viewport)
      if (match === undefined) return { px: viewport, supported: false }
      if (!match) continue
    }
    const px = lengthPx(m[2] ?? '', viewport)
    return px === undefined ? { px: viewport, supported: false } : { px, supported: true }
  }
  return { px: viewport, supported: true }
}

/**
 * Candidato que o navegador escolhe: o de menor densidade que cobre o DPR (ou o maior).
 * Os navegadores podem ficar um pouco abaixo; esta regra é a mais conservadora.
 */
export function pickCandidate<T extends { w?: number; x?: number }>(candidates: T[], slotPx: number, dpr: number): T | undefined {
  const rated = candidates
    .map((c) => ({ c, density: c.w !== undefined ? c.w / Math.max(slotPx, 1) : (c.x ?? 1) }))
    .toSorted((a, b) => a.density - b.density)
  return (rated.find((r) => r.density >= dpr - 1e-6) ?? rated.at(-1))?.c
}

function largest<T extends { w?: number; x?: number }>(candidates: T[]): T | undefined {
  return candidates.toSorted((a, b) => (a.w ?? a.x ?? 1) - (b.w ?? b.x ?? 1)).at(-1)
}

// ---------------------------------------------------------------------------
// Leitura da pasta de saída
// ---------------------------------------------------------------------------

type Format = 'avif' | 'webp' | 'jpeg' | 'png' | 'gif' | 'svg' | 'outro'

interface Candidate {
  url: string
  rel: string
  bytes: number
  w?: number
  x?: number
}

interface SourceSet {
  from: 'source' | 'img'
  format: Format
  media: string | null
  sizes: string | undefined
  candidates: Candidate[]
}

export interface ImageRow {
  image: string
  variant: string
  width: string
  avif: string
  webp: string
  jpeg: string
  ok: boolean
}

export interface BudgetReport {
  dir: string
  base: string
  js: { files: { rel: string; gzip: number }[]; total: number }
  css: { files: { rel: string; gzip: number }[]; total: number }
  images: ImageRow[]
  firstLoad: {
    html: number
    js: number
    css: number
    fonts: { rel: string; bytes: number }[]
    fontsIgnored: number
    images: { rel: string; bytes: number }[]
    total: number
  }
  errors: string[]
  warnings: string[]
}

const FORMAT_BY_TYPE: Readonly<Record<string, Format>> = {
  'image/avif': 'avif',
  'image/webp': 'webp',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpeg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
}

const FORMAT_BY_EXT: Readonly<Record<string, Format>> = {
  '.avif': 'avif',
  '.webp': 'webp',
  '.jpg': 'jpeg',
  '.jpeg': 'jpeg',
  '.png': 'png',
  '.gif': 'gif',
  '.svg': 'svg',
}

function kb(bytes: number): string {
  return `${(bytes / KIB).toFixed(1).replace('.', ',')} KiB`
}

/** Bytes com separador de milhares (espaço), para a folga exata. */
function bytesText(bytes: number): string {
  return `${String(Math.round(bytes)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} B`
}

/** Aviso quando um total passa WARN_RATIO do limite sem o ultrapassar. */
function nearLimit(what: string, total: number, limit: number): string | null {
  if (total > limit || total <= limit * WARN_RATIO) return null
  const pct = ((total / limit) * 100).toFixed(1).replace('.', ',')
  return `${what} a ${pct}% do limite (${kb(total)} de ${kb(limit)}; folga de ${bytesText(limit - total)} em gzip)`
}

function limitCell(bytes: number, limit: number): string {
  return `${kb(bytes)} ${bytes <= limit ? '≤' : '>'} ${kb(limit)}`
}

function rels(el: HTMLElement): string[] {
  return (el.getAttribute('rel') ?? '').toLowerCase().split(/\s+/).filter(Boolean)
}

/** Candidatos do `srcset`, ou o `src` como candidato único (1x). */
function srcsetOrSrc(srcset: string | undefined, src: string | undefined): SrcsetCandidate[] {
  if (srcset?.trim()) return parseSrcset(srcset)
  if (src?.trim()) return [{ url: src, descriptor: '', x: 1 }]
  return []
}

class Budget {
  readonly errors: string[] = []
  readonly warnings: string[] = []
  readonly root: string
  readonly base: string
  private readonly gzipCache = new Map<string, number>()
  /** Cada URL problemático só é assinalado uma vez (o mesmo <img> é lido em várias medições). */
  private readonly reported = new Set<string>()

  constructor(root: string, base: string) {
    this.root = root
    this.base = base
  }

  /**
   * Caminho relativo à pasta de um URL local; undefined para data: ou quando falha
   * (o erro fica registado com a origem).
   */
  resolve(value: string, fromUrl: string, where: string): string | undefined {
    const v = value.trim()
    const fail = (message: string) => {
      if (!this.reported.has(v)) this.errors.push(`${where}: "${v}" ${message}`)
      this.reported.add(v)
      return undefined
    }
    if (!v || /^data:/i.test(v)) return undefined
    if (/^[a-z][a-z\d+.-]*:/i.test(v) || v.startsWith('//')) {
      return fail('é externo e não pode ser medido (o site não faz pedidos a terceiros)')
    }
    let pathname: string
    try {
      pathname = decodeURIComponent(new URL(v, `http://site.invalid${fromUrl}`).pathname)
    } catch {
      return fail('é um URL inválido')
    }
    if (!pathname.startsWith(this.base)) return fail(`está fora do base path ${this.base}`)
    let rel = pathname.slice(this.base.length)
    if (rel === '' || rel.endsWith('/')) rel += 'index.html'
    const abs = path.join(this.root, rel)
    if (!fs.existsSync(abs) || !fs.statSync(abs).isFile()) return fail('não existe na pasta de saída')
    return rel
  }

  bytes(rel: string): number {
    return fs.statSync(path.join(this.root, rel)).size
  }

  gzip(rel: string): number {
    let size = this.gzipCache.get(rel)
    if (size === undefined) {
      size = zlib.gzipSync(fs.readFileSync(path.join(this.root, rel)), { level: 9 }).length
      this.gzipCache.set(rel, size)
    }
    return size
  }

  read(rel: string): string {
    return fs.readFileSync(path.join(this.root, rel), 'utf8')
  }

  /** Conjunto de candidatos de um <source> ou <img>. */
  sourceSet(el: HTMLElement, from: SourceSet['from'], imgSizes: string | undefined, where: string): SourceSet {
    const parsed = srcsetOrSrc(el.getAttribute('srcset'), el.getAttribute('src'))
    const candidates: Candidate[] = []
    for (const c of parsed) {
      const rel = this.resolve(c.url, this.base, where)
      if (rel === undefined) continue
      const candidate: Candidate = { url: c.url, rel, bytes: this.bytes(rel) }
      if (c.w !== undefined) candidate.w = c.w
      else candidate.x = c.x ?? 1
      candidates.push(candidate)
    }
    const type = (el.getAttribute('type') ?? '').toLowerCase().trim()
    const firstUrl = parsed[0]?.url.split(/[?#]/)[0] ?? ''
    const format =
      FORMAT_BY_TYPE[type] ??
      (/^data:image\/svg/i.test(firstUrl) ? 'svg' : FORMAT_BY_EXT[path.posix.extname(firstUrl).toLowerCase()]) ??
      'outro'
    return {
      from,
      format,
      media: el.getAttribute('media')?.trim() || null,
      sizes: el.getAttribute('sizes') ?? imgSizes,
      candidates,
    }
  }
}

function imageLabel(img: HTMLElement, sets: SourceSet[], index: number): string {
  const explicit = img.getAttribute('data-image-id') ?? img.getAttribute('data-image')
  if (explicit) return explicit
  // O <img> (último conjunto) é a imagem predefinida; a primeira fonte pode ser a de telemóvel.
  const file = sets.at(-1)?.candidates[0]?.rel ?? sets.find((s) => s.candidates.length > 0)?.candidates[0]?.rel
  if (file) {
    const name = path.posix.basename(file, path.posix.extname(file)).replace(/-[A-Za-z0-9_-]{8}$/, '')
    return `#${index} ${name}`
  }
  return `#${index} ${(img.getAttribute('alt') ?? '').slice(0, 24) || 'imagem'}`
}

/** Candidato da mesma largura noutro formato (o <img> sem srcset é o maior, como no vite-imagetools). */
function sameWidth(set: SourceSet | undefined, chosen: Candidate, chosenIsLargest: boolean): Candidate | undefined {
  if (!set) return undefined
  const exact = set.candidates.find((c) => c.w !== undefined && c.w === chosen.w)
  if (exact) return exact
  const only = set.candidates.length === 1 ? set.candidates[0] : undefined
  if (only && only.w === undefined && (chosenIsLargest || chosen.w === undefined)) return only
  return undefined
}

function checkPictures(doc: HTMLElement, budget: Budget): ImageRow[] {
  const rows: ImageRow[] = []
  let index = 0

  for (const picture of doc.querySelectorAll('picture')) {
    index++
    const img = picture.querySelector('img')
    if (!img) {
      budget.errors.push(`<picture> #${index} sem <img>`)
      continue
    }
    const imgSizes = img.getAttribute('sizes')
    const sets = picture
      .querySelectorAll('source')
      .map((s) => budget.sourceSet(s, 'source', imgSizes, `<picture> #${index} <source>`))
    sets.push(budget.sourceSet(img, 'img', undefined, `<picture> #${index} <img>`))
    const label = imageLabel(img, sets, index)
    const hero = (img.getAttribute('fetchpriority') ?? picture.getAttribute('fetchpriority')) === 'high'

    const raster = sets.filter((s) => s.format !== 'svg' && s.candidates.length > 0)
    if (raster.length === 0) {
      rows.push({ image: label, variant: 'placeholder SVG (não medido)', width: '—', avif: '—', webp: '—', jpeg: '—', ok: true })
      continue
    }

    const medias = [null, ...new Set(sets.filter((s) => s.from === 'source' && s.media).map((s) => s.media))]
    for (const media of medias) {
      const group = sets.filter((s) => s.media === media)
      const avif = group.find((s) => s.from === 'source' && s.format === 'avif' && s.candidates.length > 0)
      const webp = group.find((s) => s.from === 'source' && s.format === 'webp')
      const jpeg = group.find((s) => s.format === 'jpeg')
      if (!avif) {
        if (group.some((s) => s.format !== 'svg' && s.candidates.length > 0)) {
          rows.push({ image: label, variant: media ?? 'predefinida', width: '—', avif: 'sem fonte AVIF', webp: '—', jpeg: '—', ok: false })
        }
        continue
      }

      let chosen: Candidate | undefined
      let variant: string
      let limit: number
      if (media !== null) {
        chosen = largest(avif.candidates)
        variant = `${media}, maior`
        limit = LIMITS.mediaVariant
      } else if (hero) {
        const slot = evaluateSizes(avif.sizes, HERO_VIEWPORT)
        if (!slot.supported) budget.warnings.push(`${label}: sizes "${avif.sizes}" não suportado pelo avaliador; usado 100vw`)
        chosen = pickCandidate(avif.candidates, slot.px, 1)
        variant = `hero a ${HERO_VIEWPORT} px (espaço ${Math.round(slot.px)} px)`
        limit = LIMITS.heroDesktop
      } else {
        chosen = largest(avif.candidates)
        variant = 'maior largura'
        limit = LIMITS.image
      }
      if (!chosen) continue

      const isLargest = chosen === largest(avif.candidates)
      const webpMatch = sameWidth(webp, chosen, isLargest)
      const jpegMatch = sameWidth(jpeg, chosen, isLargest)
      const fallbackLimit = chosen.bytes * 2
      const ok =
        chosen.bytes <= limit &&
        (!webpMatch || webpMatch.bytes <= fallbackLimit) &&
        (!jpegMatch || jpegMatch.bytes <= fallbackLimit)
      rows.push({
        image: label,
        variant,
        width: chosen.w !== undefined ? `${chosen.w}w` : `${chosen.x ?? 1}x`,
        avif: limitCell(chosen.bytes, limit),
        webp: webpMatch ? limitCell(webpMatch.bytes, fallbackLimit) : '—',
        jpeg: jpegMatch ? limitCell(jpegMatch.bytes, fallbackLimit) : '—',
        ok,
      })
    }
  }

  // Imagens raster fora de <picture>: mesmo objetivo das restantes imagens.
  for (const img of doc.querySelectorAll('img')) {
    if (img.closest('picture')) continue
    index++
    const set = budget.sourceSet(img, 'img', undefined, `<img> #${index}`)
    if (set.format === 'svg' || set.candidates.length === 0) continue
    const chosen = largest(set.candidates)
    if (!chosen) continue
    rows.push({
      image: imageLabel(img, [set], index),
      variant: `fora de <picture> (${set.format})`,
      width: chosen.w !== undefined ? `${chosen.w}w` : `${chosen.x ?? 1}x`,
      avif: limitCell(chosen.bytes, LIMITS.image),
      webp: '—',
      jpeg: '—',
      ok: chosen.bytes <= LIMITS.image,
    })
  }

  if (!doc.querySelector('img[fetchpriority="high"]') && doc.querySelector('picture')) {
    budget.warnings.push('nenhuma imagem com fetchpriority="high" (o hero deve tê-lo, Parte 3.7)')
  }
  return rows
}

/** Imagens AVIF de fundo (atributos style da página e CSS inicial), como a da CTA: até 120 KiB. */
function checkBackgrounds(doc: HTMLElement, cssFiles: Iterable<string>, budget: Budget): ImageRow[] {
  const found = new Map<string, string>()
  const collect = (css: string, fromUrl: string, where: string) => {
    for (const url of cssUrls(css)) {
      if (url.startsWith('#') || !/\.avif(?:[?#]|$)/i.test(url)) continue
      const rel = budget.resolve(url, fromUrl, where)
      if (rel && !found.has(rel)) found.set(rel, where)
    }
  }
  for (const el of doc.querySelectorAll('[style]')) collect(el.getAttribute('style') ?? '', budget.base, 'atributo style')
  for (const rel of cssFiles) collect(budget.read(rel), `${budget.base}${rel}`, rel)
  return [...found].map(([rel, where]) => {
    const bytes = budget.bytes(rel)
    return {
      image: path.posix.basename(rel, '.avif').replace(/-[A-Za-z0-9_-]{8}$/, ''),
      variant: `fundo (${where})`,
      width: '—',
      avif: limitCell(bytes, LIMITS.image),
      webp: '—',
      jpeg: '—',
      ok: bytes <= LIMITS.image,
    }
  })
}

/** Ficheiros woff2 de @font-face que cobrem o latim básico (os outros subconjuntos não são descarregados). */
function latinFonts(css: string, cssUrl: string, budget: Budget, where: string): { fonts: string[]; ignored: number } {
  const fonts: string[] = []
  let ignored = 0
  for (const m of css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/@font-face\s*\{([^}]*)\}/gi)) {
    const block = m[1] ?? ''
    const woff2 = cssUrls(block).find((u) => /\.woff2(?:[?#]|$)/i.test(u))
    if (!woff2) continue
    const range = /unicode-range\s*:\s*([^;]+)/i.exec(block)?.[1]
    if (range && !coversLatin(range)) {
      ignored++
      continue
    }
    const rel = budget.resolve(woff2, cssUrl, where)
    if (rel) fonts.push(rel)
  }
  return { fonts, ignored }
}

function coversLatin(range: string): boolean {
  const probe = 0x61 // "a"
  return range.split(',').some((part) => {
    const m = /^\s*u\+([0-9a-f?]+)(?:-([0-9a-f]+))?\s*$/i.exec(part)
    if (!m?.[1]) return false
    const start = parseInt(m[1].replace(/\?/g, '0'), 16)
    const end = m[2] ? parseInt(m[2], 16) : parseInt(m[1].replace(/\?/g, 'f'), 16)
    return probe >= start && probe <= end
  })
}

/** Imagem que o telemóvel (390 px, DPR 2) descarrega para um <img> ou <link rel="preload">. */
function mobileChoice(img: HTMLElement, budget: Budget, where: string): string | undefined {
  const picture = img.closest('picture')
  let set: SourceSet | undefined
  if (picture) {
    for (const source of picture.querySelectorAll('source')) {
      if (matchMedia(source.getAttribute('media'), MOBILE_VIEWPORT) !== true) continue
      const candidate = budget.sourceSet(source, 'source', img.getAttribute('sizes'), where)
      if (candidate.format !== 'outro' && candidate.candidates.length > 0) {
        set = candidate
        break
      }
    }
  }
  set ??= budget.sourceSet(img, 'img', undefined, where)
  const slot = evaluateSizes(set.sizes, MOBILE_VIEWPORT)
  return pickCandidate(set.candidates, slot.px, MOBILE_DPR)?.rel
}

export function checkBudget(options: { dir: string; base?: string }): BudgetReport {
  const root = path.resolve(options.dir)
  const home = path.join(root, 'index.html')
  if (!fs.existsSync(home)) throw new Error(`"${path.join(options.dir, 'index.html')}" não existe. Corre primeiro o build.`)
  const html = fs.readFileSync(home, 'utf8')
  const doc = parse(html, { comment: false, blockTextElements: { script: true, style: true } })

  // Base: --base; senão BASE_PATH; senão o caminho do <link rel="manifest">; senão /LMDreams/.
  const manifestHref = doc.querySelector('link[rel="manifest"]')?.getAttribute('href') ?? ''
  const detected = /^\/.*site\.webmanifest$/.test(manifestHref) ? manifestHref.slice(0, -'site.webmanifest'.length) : undefined
  const base = normalizeBase(options.base ?? process.env.BASE_PATH ?? detected ?? DEFAULT_BASE)
  const budget = new Budget(root, base)

  // JavaScript inicial: <script src> (módulos) e <link rel="modulepreload">.
  const jsFiles = new Set<string>()
  for (const script of doc.querySelectorAll('script')) {
    const src = script.getAttribute('src')
    const type = (script.getAttribute('type') ?? '').toLowerCase()
    if (!src || !['', 'module', 'text/javascript', 'application/javascript'].includes(type)) continue
    const rel = budget.resolve(src, base, 'script[src]')
    if (rel) jsFiles.add(rel)
  }
  // Carregador diferido (scripts/prerender.ts): o JavaScript das ilhas só é pedido depois
  // do evento load, mas conta na mesma para o orçamento do JavaScript inicial.
  for (const loader of doc.querySelectorAll('script[data-lmd-loader]')) {
    const urls = [loader.getAttribute('data-src') ?? '', ...(loader.getAttribute('data-preload') ?? '').split(' ')]
    for (const u of urls.filter(Boolean)) {
      const rel = budget.resolve(u, base, 'script[data-lmd-loader]')
      if (rel) jsFiles.add(rel)
    }
  }
  const cssFiles = new Set<string>()
  for (const link of doc.querySelectorAll('link')) {
    const r = rels(link)
    const href = link.getAttribute('href')
    if (!href) continue
    if (r.includes('modulepreload') || (r.includes('preload') && link.getAttribute('as') === 'script')) {
      const rel = budget.resolve(href, base, 'link[rel="modulepreload"]')
      if (rel) jsFiles.add(rel)
    }
    if (r.includes('stylesheet')) {
      const rel = budget.resolve(href, base, 'link[rel="stylesheet"]')
      if (rel) cssFiles.add(rel)
    }
  }
  const js = [...jsFiles].map((rel) => ({ rel, gzip: budget.gzip(rel) }))
  const css = [...cssFiles].map((rel) => ({ rel, gzip: budget.gzip(rel) }))
  const jsTotal = js.reduce((sum, f) => sum + f.gzip, 0)
  const cssTotal = css.reduce((sum, f) => sum + f.gzip, 0)
  if (js.length === 0) budget.warnings.push('a página principal não tem JavaScript inicial (<script type="module" src>)')
  if (css.length === 0) budget.warnings.push('a página principal não tem <link rel="stylesheet">')

  const images = [...checkPictures(doc, budget), ...checkBackgrounds(doc, cssFiles, budget)]

  // Primeiro carregamento em telemóvel (informativo).
  const fonts = new Set<string>()
  let fontsIgnored = 0
  for (const rel of cssFiles) {
    const found = latinFonts(budget.read(rel), `${base}${rel}`, budget, `${rel} @font-face`)
    found.fonts.forEach((f) => fonts.add(f))
    fontsIgnored += found.ignored
  }
  for (const link of doc.querySelectorAll('link')) {
    const href = link.getAttribute('href')
    if (href && rels(link).includes('preload') && link.getAttribute('as') === 'font') {
      const rel = budget.resolve(href, base, 'link[rel="preload"][as="font"]')
      if (rel) fonts.add(rel)
    }
  }
  const eagerImages = new Set<string>()
  doc.querySelectorAll('img').forEach((img, i) => {
    if ((img.getAttribute('loading') ?? '').toLowerCase() === 'lazy') return
    const rel = mobileChoice(img, budget, `<img> eager #${i + 1}`)
    if (rel) eagerImages.add(rel)
  })
  for (const link of doc.querySelectorAll('link')) {
    if (!rels(link).includes('preload') || link.getAttribute('as') !== 'image') continue
    if (matchMedia(link.getAttribute('media'), MOBILE_VIEWPORT) !== true) continue
    const list = srcsetOrSrc(link.getAttribute('imagesrcset'), link.getAttribute('href'))
    const slot = evaluateSizes(link.getAttribute('imagesizes'), MOBILE_VIEWPORT)
    const pick = pickCandidate(list, slot.px, MOBILE_DPR)
    const rel = pick ? budget.resolve(pick.url, base, 'link[rel="preload"][as="image"]') : undefined
    if (rel) eagerImages.add(rel)
  }

  const htmlGzip = budget.gzip('index.html')
  const fontList = [...fonts].map((rel) => ({ rel, bytes: budget.bytes(rel) }))
  const imageList = [...eagerImages].map((rel) => ({ rel, bytes: budget.bytes(rel) }))
  const total =
    htmlGzip +
    jsTotal +
    cssTotal +
    fontList.reduce((s, f) => s + f.bytes, 0) +
    imageList.reduce((s, f) => s + f.bytes, 0)

  if (jsTotal > LIMITS.js) budget.errors.push(`JavaScript inicial com ${kb(jsTotal)} em gzip (limite ${kb(LIMITS.js)})`)
  if (cssTotal > LIMITS.css) budget.errors.push(`CSS com ${kb(cssTotal)} em gzip (limite ${kb(LIMITS.css)})`)
  for (const near of [nearLimit('JavaScript inicial', jsTotal, LIMITS.js), nearLimit('CSS', cssTotal, LIMITS.css)]) {
    if (near) budget.warnings.push(near)
  }
  for (const row of images) if (!row.ok) budget.errors.push(`imagem ${row.image} (${row.variant}) acima do objetivo`)
  if (total > LIMITS.firstLoad) {
    budget.warnings.push(`primeiro carregamento em telemóvel com cerca de ${kb(total)} (objetivo: até cerca de 1,2 MiB)`)
  }

  return {
    dir: options.dir,
    base,
    js: { files: js, total: jsTotal },
    css: { files: css, total: cssTotal },
    images,
    firstLoad: { html: htmlGzip, js: jsTotal, css: cssTotal, fonts: fontList, fontsIgnored, images: imageList, total },
    errors: budget.errors,
    warnings: budget.warnings,
  }
}

// ---------------------------------------------------------------------------
// Saída
// ---------------------------------------------------------------------------

function printTable(headers: string[], rows: string[][]): void {
  const widths = headers.map((h, i) => Math.max(h.length, ...rows.map((r) => (r[i] ?? '').length)))
  const line = (cells: string[]) => `  ${cells.map((c, i) => c.padEnd(widths[i] ?? 0)).join('  ')}`.trimEnd()
  console.log(line(headers))
  console.log(`  ${widths.map((w) => '-'.repeat(w)).join('  ')}`)
  for (const row of rows) console.log(line(row))
}

function printFiles(title: string, files: { rel: string; gzip: number }[], total: number, limit: number): void {
  console.log(`\n${title}`)
  const rows = files.map((f) => [f.rel, kb(f.gzip)])
  rows.push([
    'Total',
    `${kb(total)} / ${kb(limit)} (${bytesText(total)} de ${bytesText(limit)})  ${total <= limit ? 'OK' : 'FALHA'}`,
  ])
  printTable(['Ficheiro', 'gzip (nível 9; 1 KiB = 1024 B)'], rows)
}

function main(): void {
  const dir = argValue('dir') ?? process.env.OUT_DIR ?? 'dist'
  const report = checkBudget({ dir, base: argValue('base') })

  console.log(`check:budget: página principal de ${report.dir} (base ${report.base})`)
  printFiles('JavaScript inicial (script type="module" e modulepreload)', report.js.files, report.js.total, LIMITS.js)
  printFiles('CSS (link rel="stylesheet")', report.css.files, report.css.total, LIMITS.css)

  console.log('\nImagens (Parte 4.8; WebP e JPEG até ao dobro do AVIF da mesma largura)')
  if (report.images.length === 0) {
    console.log('  Nenhuma <picture> nem imagem raster na página principal.')
  } else {
    printTable(
      ['Imagem', 'Variante', 'Largura', 'AVIF', 'WebP', 'JPEG', 'Estado'],
      report.images.map((r) => [r.image, r.variant, r.width, r.avif, r.webp, r.jpeg, r.ok ? 'OK' : 'FALHA']),
    )
  }

  const f = report.firstLoad
  console.log(`\nPrimeiro carregamento em telemóvel (${MOBILE_VIEWPORT} px, DPR ${MOBILE_DPR}; informativo; texto em gzip)`)
  const rows = [
    ['HTML', kb(f.html)],
    ['JavaScript inicial', kb(f.js)],
    ['CSS', kb(f.css)],
    [
      `Fontes woff2 com latim: ${f.fonts.length}${f.fontsIgnored ? ` (outros subconjuntos, não contados: ${f.fontsIgnored})` : ''}`,
      kb(f.fonts.reduce((s, x) => s + x.bytes, 0)),
    ],
    ...f.fonts.map((x) => [`  ${x.rel}`, kb(x.bytes)]),
    [`Imagens sem loading="lazy" (${f.images.length})`, kb(f.images.reduce((s, x) => s + x.bytes, 0))],
    ...f.images.map((x) => [`  ${x.rel}`, kb(x.bytes)]),
    ['Total aproximado', `${kb(f.total)} (objetivo: até cerca de 1,2 MiB)`],
  ]
  printTable(['Parte', 'Peso'], rows)

  if (report.warnings.length > 0) {
    console.log(`\nAvisos (${report.warnings.length}):`)
    for (const w of report.warnings) console.log(`  - ${w}`)
  }
  if (report.errors.length > 0) {
    console.log(`\nErros (${report.errors.length}):`)
    for (const e of report.errors) console.log(`  - ${e}`)
    console.log(`\ncheck:budget FALHOU: ${report.errors.length} erro(s).`)
    process.exit(1)
  }
  console.log('\ncheck:budget passou: JavaScript, CSS e imagens dentro do orçamento.')
}

if (isMainModule(import.meta.url)) {
  try {
    main()
  } catch (error) {
    console.error(`check:budget: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(1)
  }
}
