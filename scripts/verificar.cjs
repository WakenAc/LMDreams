// Verifica a pasta dist/ antes de publicar. Falha (código 1) se encontrar:
//  1. ligações, imagens ou âncoras locais que não existem (HTML, srcset, CSS, meta, JSON-LD, sitemap);
//  2. recursos carregados de servidores de terceiros (a Política de cookies garante que não há nenhum);
//  3. ficheiros de rss/ ou das fotografias originais;
//  4. páginas sem a informação legal obrigatória no rodapé, ou com marcas "POR DEFINIR";
//  5. imagens demasiado pesadas.
// Uso: node scripts/verificar.cjs   (corre depois de node scripts/publicar.cjs)
const fs = require('fs')
const path = require('path')

const SITE = 'https://www.lmdreams.pt/'
const MAX_IMG = 1.5 * 1024 * 1024
// Informação legal que tem de estar em todas as páginas (CSC art. 171.º, DL 7/2004, Lei 144/2015, DL 59/2021)
const LEGAL = [
  'LMDreams, Unipessoal Lda.',
  'Rua António Silva, Lote 2037 B, 2975-257 Quinta do Conde',
  '516383370',
  'Conservatória do Registo Comercial',
  'Capital social',
  '101097-PAR',
  '(chamada para a rede móvel nacional)',
  'livroreclamacoes.pt',
  'centroarbitragemlisboa.pt',
  'cniacc.pt',
  'consumidor.gov.pt',
  'geradas por IA',
]

const dist = path.resolve(__dirname, '..', 'dist')
if (!fs.existsSync(dist)) { console.error('Falta dist/: corre primeiro node scripts/publicar.cjs'); process.exit(1) }

const files = []
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).forEach((e) => {
  const p = path.join(dir, e.name)
  if (e.isDirectory()) walk(p)
  else files.push(p)
})
walk(dist)

const problems = []
const rel = (p) => path.relative(dist, p).split(path.sep).join('/')
const exists = (p) => fs.existsSync(p)

// 3. nada de originais
files.filter((f) => /(^|\/)(rss|fotos-originais)(\/|$)/i.test(rel(f))).forEach((f) => problems.push(`ficheiro proibido: ${rel(f)}`))

// 5. peso das imagens
files.filter((f) => /\.(webp|jpe?g|png|avif)$/i.test(f)).forEach((f) => {
  const s = fs.statSync(f).size
  if (s > MAX_IMG) problems.push(`imagem pesada (${(s / 1024 / 1024).toFixed(1)} MB): ${rel(f)}`)
})

const idsCache = new Map()
const idsOf = (file) => {
  if (!idsCache.has(file)) {
    const html = exists(file) ? fs.readFileSync(file, 'utf8') : ''
    idsCache.set(file, new Set([...html.matchAll(/\sid\s*=\s*["']?([^"'\s>]+)/g)].map((m) => m[1])))
  }
  return idsCache.get(file)
}
const attrsOf = (raw) => Object.fromEntries([...raw.matchAll(/([\w:-]+)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/g)]
  .map((m) => [m[1].toLowerCase(), m[2].replace(/^["']|["']$/g, '')]))

// Resolve um caminho local (relativo ao ficheiro ou absoluto ao site) e verifica-o
function checkLocal(url, from, where) {
  if (!url || /^(mailto:|tel:|data:|javascript:)/i.test(url)) return
  const [pathPart, hash] = url.split('#')
  const clean = decodeURI(pathPart.split('?')[0])
  let target = from
  if (clean) {
    target = clean.startsWith('/') ? path.join(dist, clean) : path.resolve(path.dirname(from), clean)
    if (clean.endsWith('/')) target = path.join(target, 'index.html')
    if (!exists(target)) { problems.push(`não existe (${where}): ${url}`); return }
    if (fs.statSync(target).isDirectory()) target = path.join(target, 'index.html')
  }
  if (hash && target.endsWith('.html') && !idsOf(target).has(hash)) problems.push(`âncora em falta (${where}): ${url}`)
}
// URLs absolutas do próprio site (canonical, og:image, JSON-LD, sitemap) têm de existir em dist/
function checkOwnAbsolute(url, where) {
  if (!url.startsWith(SITE)) return
  checkLocal(`/${url.slice(SITE.length)}`, path.join(dist, 'index.html'), where)
}
const isExternal = (u) => /^(https?:)?\/\//i.test(u)
const LOADS = new Set(['stylesheet', 'preconnect', 'preload', 'modulepreload', 'dns-prefetch', 'icon', 'apple-touch-icon', 'manifest', 'prefetch'])

function checkCss(css, from, where) {
  for (const m of css.matchAll(/@import\s+(?:url\()?\s*['"]?([^'")\s;]+)|url\(\s*['"]?([^'")]+?)['"]?\s*\)/g)) {
    const u = (m[1] || m[2] || '').trim()
    if (!u || u.startsWith('data:') || u.startsWith('#')) continue
    if (isExternal(u)) problems.push(`recurso de terceiros (${where}): ${u}`)
    else checkLocal(u, from, where)
  }
}

for (const file of files.filter((f) => f.endsWith('.html'))) {
  const html = fs.readFileSync(file, 'utf8')
  const where = rel(file)

  // 4. informação legal e marcas de trabalho
  LEGAL.filter((t) => !html.includes(t)).forEach((t) => problems.push(`falta no rodapé de ${where}: "${t}"`))
  if (/POR DEFINIR/i.test(html)) problems.push(`marca "POR DEFINIR" em ${where}`)

  for (const tag of html.matchAll(/<(a|link|script|img|use|source|iframe|video|audio|object|embed|meta)\b([^>]*)>/gi)) {
    const name = tag[1].toLowerCase()
    const a = attrsOf(tag[2])
    if (name === 'meta') {
      if (/^(og:image|og:url|twitter:image)$/.test(a.property || a.name || '') && a.content) checkOwnAbsolute(a.content, where)
      continue
    }
    const urls = [a.src, a.href, a.data, a['xlink:href']].filter(Boolean)
    for (const s of [a.srcset, a.imagesrcset].filter(Boolean)) urls.push(...s.split(',').map((c) => c.trim().split(/\s+/)[0]))
    for (const url of urls) {
      if (isExternal(url)) {
        // 2. só as ligações <a> e o canonical podem apontar para fora
        const rels = (a.rel || '').toLowerCase().split(/\s+/)
        const loads = name !== 'a' && !(name === 'link' && !rels.some((r) => LOADS.has(r)))
        if (loads && !url.startsWith(SITE)) problems.push(`recurso de terceiros (${where}): ${url}`)
        if (url.startsWith(SITE)) checkOwnAbsolute(url, where)
        continue
      }
      checkLocal(url, file, where)
    }
  }
  // estilos embutidos
  for (const m of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) checkCss(m[1], file, `${where} <style>`)
  for (const m of html.matchAll(/\sstyle\s*=\s*"([^"]*)"/gi)) checkCss(m[1], file, `${where} style=""`)
  // imagens carregadas pelo JavaScript a partir de data-img
  for (const m of html.matchAll(/\sdata-img\s*=\s*"([^"]+)"/g)) {
    if (!exists(path.join(dist, 'assets', 'img', `${m[1]}.webp`))) problems.push(`imagem em falta (${where}): assets/img/${m[1]}.webp`)
  }
  // JSON-LD
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    for (const u of m[1].match(/https:\/\/www\.lmdreams\.pt\/[^"]*/g) || []) checkOwnAbsolute(u, `${where} JSON-LD`)
  }
}

for (const file of files.filter((f) => f.endsWith('.css'))) checkCss(fs.readFileSync(file, 'utf8'), file, rel(file))

// scripts do site (as bibliotecas em assets/vendor têm URLs nos comentários de licença)
for (const file of files.filter((f) => f.endsWith('.js') && !rel(f).startsWith('assets/vendor/'))) {
  const js = fs.readFileSync(file, 'utf8')
  for (const m of js.matchAll(/["'`](https?:\/\/[^"'`\s]+)["'`]/g)) {
    // o link do perfil no Google (avaliações) é uma ligação, não um recurso carregado
    if (/^https:\/\/((www\.)?google\.[a-z.]+\/maps|maps\.app\.goo\.gl|g\.page)\//.test(m[1])) continue
    problems.push(`URL externa em ${rel(file)}: ${m[1]}`)
  }
}

// manifesto e sitemap
const manifest = path.join(dist, 'site.webmanifest')
if (exists(manifest)) JSON.parse(fs.readFileSync(manifest, 'utf8')).icons.forEach((i) => checkLocal(i.src, manifest, 'site.webmanifest'))
const sitemap = path.join(dist, 'sitemap.xml')
if (exists(sitemap)) for (const m of fs.readFileSync(sitemap, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)) checkOwnAbsolute(m[1], 'sitemap.xml')

if (problems.length) {
  console.error(`verificar: ${problems.length} problema(s)`)
  problems.forEach((p) => console.error(`  - ${p}`))
  process.exit(1)
}
console.log(`verificar: ok (${files.length} ficheiros; ligações, informação legal e recursos verificados)`)
