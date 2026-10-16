// Verifica a pasta dist/ antes de publicar. Falha (código 1) se encontrar:
//  1. ligações ou ficheiros locais que não existem (incluindo âncoras #id);
//  2. recursos carregados de servidores de terceiros (tipos de letra, scripts, folhas de estilo,
//     imagens): a Política de cookies garante que o site não carrega nenhum;
//  3. qualquer ficheiro de rss/ ou das fotografias originais.
// Uso: node scripts/verificar.cjs   (corre depois de node scripts/publicar.cjs)
const fs = require('fs')
const path = require('path')

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

// 3. nada de originais
files.filter((f) => /(^|\/)(rss|fotos-originais)(\/|$)/i.test(rel(f))).forEach((f) => problems.push(`ficheiro proibido: ${rel(f)}`))

const ids = new Map()
const idsOf = (file) => {
  if (!ids.has(file)) {
    const html = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : ''
    ids.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])))
  }
  return ids.get(file)
}
const LOADS = new Set(['stylesheet', 'preconnect', 'preload', 'modulepreload', 'dns-prefetch', 'icon', 'apple-touch-icon', 'manifest'])

for (const file of files.filter((f) => f.endsWith('.html'))) {
  const html = fs.readFileSync(file, 'utf8')
  for (const tag of html.matchAll(/<(a|link|script|img|use|source|iframe|video|audio)\b([^>]*)>/gi)) {
    const name = tag[1].toLowerCase()
    const attrs = Object.fromEntries([...tag[2].matchAll(/([\w:-]+)="([^"]*)"/g)].map((m) => [m[1].toLowerCase(), m[2]]))
    const url = attrs.src || attrs.href
    if (!url) continue
    if (/^(mailto:|tel:|data:)/.test(url)) continue
    if (/^(https?:)?\/\//.test(url)) {
      // 2. recursos de terceiros (as ligações <a> e o canonical não carregam nada)
      const loads = name === 'script' || name === 'img' || name === 'iframe' || name === 'video' || name === 'audio' || name === 'source'
        || (name === 'link' && (attrs.rel || '').split(/\s+/).some((r) => LOADS.has(r)))
      if (loads && !/^https:\/\/www\.lmdreams\.pt\//.test(url)) problems.push(`recurso de terceiros em ${rel(file)}: ${url}`)
      continue
    }
    // 1. caminhos locais
    const [pathPart, hash] = url.split('#')
    const clean = pathPart.split('?')[0]
    let target = file
    if (clean) {
      target = clean.startsWith('/') ? path.join(dist, clean) : path.resolve(path.dirname(file), clean)
      if (clean.endsWith('/')) target = path.join(target, 'index.html')
      if (!fs.existsSync(target)) { problems.push(`não existe em ${rel(file)}: ${url}`); continue }
      if (fs.statSync(target).isDirectory()) target = path.join(target, 'index.html')
    }
    if (hash && target.endsWith('.html') && !idsOf(target).has(hash)) problems.push(`âncora em falta em ${rel(file)}: ${url}`)
  }
}

for (const file of files.filter((f) => f.endsWith('.css'))) {
  const css = fs.readFileSync(file, 'utf8')
  for (const m of css.matchAll(/(?:@import\s+(?:url\()?|url\()\s*['"]?((?:https?:)?\/\/[^'")\s]+)/g)) {
    problems.push(`recurso de terceiros em ${rel(file)}: ${m[1]}`)
  }
}

if (problems.length) {
  console.error(`verificar: ${problems.length} problema(s)`)
  problems.forEach((p) => console.error(`  - ${p}`))
  process.exit(1)
}
console.log(`verificar: ok (${files.length} ficheiros, sem ligações partidas nem recursos de terceiros)`)
