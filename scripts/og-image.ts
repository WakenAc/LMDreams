// npm run og:image: gera public/og-image.jpg (1200 × 630) a partir de
// scripts/og/og-card.html, capturado com o Chromium do Playwright (Parte 4.9).
// Com a fotografia do hero: recorte com véu escuro e a legenda de IA.
// Sem ela (plano B): fundo `dark` com linhas de planta, sem legenda.
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { chromium } from '@playwright/test'
import sharp from 'sharp'

const root = process.cwd()
const url = (p: string) => pathToFileURL(path.resolve(root, p)).href

const heroCandidates = ['hero.png', 'hero.jpg', 'hero.jpeg', 'hero.webp'].map((f) =>
  path.join('assets-src/ilustrativas', f),
)
const hero = heroCandidates.find((f) => fs.existsSync(path.resolve(root, f)))

const planta = `<svg class="planta" viewBox="0 0 1200 630" aria-hidden="true">
  <defs>
    <pattern id="g" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="#f2f1ec" stroke-opacity="0.05"/></pattern>
    <pattern id="G" width="96" height="96" patternUnits="userSpaceOnUse"><path d="M96 0H0V96" fill="none" stroke="#f2f1ec" stroke-opacity="0.09"/></pattern>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/><rect width="1200" height="630" fill="url(#G)"/>
  <g fill="none" stroke="#b7b5ae" stroke-opacity="0.5" stroke-width="1.5">
    <path d="M792 120H1104V510H792Z"/><path d="M792 330H940V510M940 120V260M1000 330H1104"/>
    <path d="M940 260a52 52 0 0 1 52 52"/>
  </g>
  <g stroke="#80868e" stroke-width="1.2"><path d="M792 92H1104M792 84v16M1104 84v16"/></g>
  <g stroke="#d0b47c" stroke-width="1.2"><path d="M786 98l12-12M1098 98l12-12"/></g>
</svg>`

const background = hero
  ? `<img class="foto" src="${url(hero)}" alt="" /><div class="veu"></div>`
  : planta
const caption = hero ? '<p class="legenda">Imagem ilustrativa gerada por IA</p>' : ''

const html = fs
  .readFileSync(path.resolve(root, 'scripts/og/og-card.html'), 'utf8')
  .replace('{{FONT_DISPLAY}}', url('node_modules/@fontsource-variable/schibsted-grotesk/files/schibsted-grotesk-latin-wght-normal.woff2'))
  .replace('{{FONT_MONO}}', url('node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2'))
  .replace('{{LOGO}}', url('assets-src/brand/logo-original.png'))
  .replace('{{HERO_POSITION}}', '68% 50%')
  .replace('{{BACKGROUND}}', background)
  .replace('{{CAPTION}}', caption)

const tmp = path.resolve(root, '.tmp/og-card.html')
fs.mkdirSync(path.dirname(tmp), { recursive: true })
fs.writeFileSync(tmp, html)

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
await page.goto(pathToFileURL(tmp).href)
await page.evaluate(() => document.fonts.ready)
const png = await page.screenshot({ type: 'png' })
await browser.close()

const out = path.resolve(root, 'public/og-image.jpg')
await sharp(png).jpeg({ quality: 84, mozjpeg: true }).toFile(out)
console.log(
  `og:image: public/og-image.jpg (${hero ? 'com a fotografia do hero e a legenda de IA' : 'plano B, sem fotografia'}), ${Math.round(fs.statSync(out).size / 1024)} KB`,
)
