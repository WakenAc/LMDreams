// Pré-renderização (Parte 3.4): escreve o HTML completo de cada página, sem depender
// de JavaScript. Corre depois de `vite build` e `vite build --ssr`.
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { PAGES, type PageId } from '../src/lib/pages.ts'

interface ManifestChunk {
  file: string
  imports?: string[]
  css?: string[]
  isEntry?: boolean
  isDynamicEntry?: boolean
}
type Manifest = Record<string, ManifestChunk>

interface ServerModule {
  render: (page: PageId) => { html: string; head: string }
  PAGE_SOURCES: Record<PageId, string>
}

const outDir = path.resolve(process.env.OUT_DIR ?? 'dist')
const ssrDir = path.resolve('dist-ssr')
const rawBase = process.env.BASE_PATH ?? '/LMDreams/'
const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`

function fail(msg: string): never {
  console.error(`prerender: ${msg}`)
  process.exit(1)
}

const templatePath = path.join(outDir, 'index.html')
if (!fs.existsSync(templatePath)) fail(`não encontrei ${templatePath}; corra primeiro o vite build`)
const template = fs.readFileSync(templatePath, 'utf8')
if (!template.includes('<!--app-head-->') || !template.includes('<!--app-html-->')) {
  fail('o index.html gerado não tem os marcadores <!--app-head--> e <!--app-html-->')
}

const manifestPath = path.join(outDir, '.vite', 'manifest.json')
if (!fs.existsSync(manifestPath)) fail('falta o manifest do Vite (build.manifest)')
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as Manifest

const entryFile = path.join(ssrDir, 'entry-server.js')
if (!fs.existsSync(entryFile)) fail(`não encontrei ${entryFile}; corra primeiro o build SSR`)
// No Windows, um caminho absoluto direto no import() falha: usar um URL file://.
const server = (await import(pathToFileURL(entryFile).href)) as ServerModule

/** Ficheiros JS de um chunk e dos seus imports estáticos (para modulepreload). */
function collectImports(key: string, seen = new Set<string>()): string[] {
  const chunk = manifest[key]
  if (!chunk || seen.has(key)) return []
  seen.add(key)
  const files = [chunk.file]
  for (const imp of chunk.imports ?? []) files.push(...collectImports(imp, seen))
  return files
}

const entryKey = Object.keys(manifest).find((k) => manifest[k]?.isEntry)
const entryImports = new Set(entryKey ? collectImports(entryKey) : [])

// Pré-carregar a fonte dos títulos (H1 e LCP), se existir no CSS gerado.
const cssFiles = Object.values(manifest).flatMap((c) => c.css ?? [])
let fontPreload = ''
for (const css of new Set(cssFiles)) {
  const content = fs.readFileSync(path.join(outDir, css), 'utf8')
  const match = content.match(/url\(([^)]*schibsted-grotesk-latin-wght-normal[^)]*\.woff2)\)/)
  if (match?.[1]) {
    const href = match[1].replace(/^["']|["']$/g, '')
    fontPreload = `<link rel="preload" href="${href}" as="font" type="font/woff2" crossorigin>`
    break
  }
}

let count = 0
for (const page of PAGES) {
  const { html, head } = server.render(page.id)
  const source = server.PAGE_SOURCES[page.id]
  const preloads = collectImports(source)
    .filter((f) => !entryImports.has(f))
    .map((f) => `<link rel="modulepreload" crossorigin href="${base}${f}">`)
  const extraCss = (manifest[source]?.css ?? []).map(
    (f) => `<link rel="stylesheet" crossorigin href="${base}${f}">`,
  )
  const headHtml = [head, fontPreload, ...preloads, ...extraCss].filter(Boolean).join('\n    ')

  const out = template
    .replace('<!--app-head-->', headHtml)
    .replace('<!--app-html-->', html)
    .replace('<body>', `<body data-page="${page.id}">`)

  if (out.includes('<!--app-')) fail(`marcadores por substituir na página ${page.id}`)
  const target = path.join(outDir, page.file)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, out)
  count++
  console.log(`prerender: ${page.file}`)
}

// Limpeza: o bundle SSR e o manifest não são publicados.
fs.rmSync(ssrDir, { recursive: true, force: true })
fs.rmSync(path.join(outDir, '.vite'), { recursive: true, force: true })
console.log(`prerender: ${count} páginas escritas em ${path.relative(process.cwd(), outDir) || '.'}`)
