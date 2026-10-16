// Prepara a pasta dist/ só com o que o site precisa.
// Publica SEMPRE a pasta dist/, nunca a raiz do projeto: rss/ tem os PNG originais (centenas de MB)
// e as fotografias do WhatsApp por tratar, com o catálogo de privacidade.
// Uso: node scripts/publicar.cjs   (depois: node scripts/verificar.cjs)
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const dist = path.join(root, 'dist')

// Tudo o que é publicado. Uma página nova tem de entrar nesta lista.
const SITE = [
  'index.html',
  '404.html',
  'robots.txt',
  'sitemap.xml',
  'site.webmanifest',
  'og-image.jpg',
  'assets',
  'politica-de-privacidade',
  'politica-de-cookies',
  'termos-e-condicoes',
]

fs.rmSync(dist, { recursive: true, force: true })
fs.mkdirSync(dist)
for (const item of SITE) {
  const from = path.join(root, item)
  if (!fs.existsSync(from)) throw new Error(`Falta ${item}`)
  fs.cpSync(from, path.join(dist, item), { recursive: true })
}

let bytes = 0
let files = 0
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).forEach((e) => {
  const p = path.join(dir, e.name)
  if (e.isDirectory()) walk(p)
  else { bytes += fs.statSync(p).size; files += 1 }
})
walk(dist)
console.log(`dist/ pronta: ${files} ficheiros, ${(bytes / 1024 / 1024).toFixed(1)} MB`)
