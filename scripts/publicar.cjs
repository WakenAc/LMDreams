// Prepara a pasta dist/ só com o que o site precisa e gera o sitemap.xml.
// Publica SEMPRE a pasta dist/, nunca a raiz do projeto: rss/ tem os PNG originais (centenas de MB)
// e as fotografias do WhatsApp por tratar, com o catálogo de privacidade.
// Uso: node scripts/publicar.cjs   (depois: node scripts/verificar.cjs)
const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')

const root = path.resolve(__dirname, '..')
const dist = path.join(root, 'dist')
const SITE_URL = 'https://www.lmdreams.pt/'

// Tudo o que é publicado. Uma página nova tem de entrar nesta lista.
const SITE = [
  'index.html',
  '404.html',
  'robots.txt',
  'site.webmanifest',
  'og-image.jpg',
  'assets',
  'obras',
  'politica-de-privacidade',
  'politica-de-cookies',
  'termos-e-condicoes',
  'trabalhe-connosco',
]

fs.rmSync(dist, { recursive: true, force: true })
fs.mkdirSync(dist)
for (const item of SITE) {
  const from = path.join(root, item)
  if (!fs.existsSync(from)) throw new Error(`Falta ${item}`)
  fs.cpSync(from, path.join(dist, item), { recursive: true })
}

// sitemap.xml: todas as páginas HTML publicadas (menos a 404), com a data da última alteração
// (data do último commit que mexeu no ficheiro; sem git, a data do ficheiro)
const lastmod = (file) => {
  try {
    const d = execFileSync('git', ['log', '-1', '--format=%cs', '--', file], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
    if (d) return d
  } catch {}
  return fs.statSync(path.join(root, file)).mtime.toISOString().slice(0, 10)
}
const pages = []
const walkHtml = (dir) => fs.readdirSync(path.join(dist, dir), { withFileTypes: true }).forEach((e) => {
  const rel = path.posix.join(dir, e.name)
  if (e.isDirectory()) walkHtml(rel)
  else if (e.name === 'index.html') pages.push(rel)
})
pages.push('index.html')
for (const d of ['obras', 'politica-de-privacidade', 'politica-de-cookies', 'termos-e-condicoes', 'trabalhe-connosco']) walkHtml(d)
const urls = pages.map((f) => {
  const loc = SITE_URL + f.replace(/index\.html$/, '')
  return `  <url><loc>${loc}</loc><lastmod>${lastmod(f)}</lastmod></url>`
})
fs.writeFileSync(path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`)

let bytes = 0
let files = 0
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).forEach((e) => {
  const p = path.join(dir, e.name)
  if (e.isDirectory()) walk(p)
  else { bytes += fs.statSync(p).size; files += 1 }
})
walk(dist)
console.log(`dist/ pronta: ${files} ficheiros, ${(bytes / 1024 / 1024).toFixed(1)} MB, ${pages.length} páginas no sitemap`)
