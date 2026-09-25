// sitemap.xml e robots.txt (Parte 3.9). Só páginas indexáveis, URLs absolutos com
// barra final, sem priority, changefreq nem lastmod.
import fs from 'node:fs'
import path from 'node:path'
import { PAGES } from '../src/lib/pages.ts'

const outDir = path.resolve(process.env.OUT_DIR ?? 'dist')
const siteUrl = (process.env.SITE_URL ?? 'https://wakenac.github.io/LMDreams').replace(/\/+$/, '')

const urls = PAGES.filter((p) => p.indexable).map((p) => `${siteUrl}/${p.path}`)

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map((u) => `  <url><loc>${u}</loc></url>`),
  '</urlset>',
  '',
].join('\n')

const robots = ['User-agent: *', 'Allow: /', '', `Sitemap: ${siteUrl}/sitemap.xml`, ''].join('\n')

fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemap)
fs.writeFileSync(path.join(outDir, 'robots.txt'), robots)
console.log(`generate-seo: sitemap.xml (${urls.length} URLs) e robots.txt em ${path.relative(process.cwd(), outDir)}`)
