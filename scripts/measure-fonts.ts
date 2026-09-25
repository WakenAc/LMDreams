// Mede as métricas das fontes autoalojadas e calcula os descritores das fontes de
// recurso (size-adjust, ascent-override, descent-override) para evitar saltos de layout
// na troca de fonte (Parte 3.6). Corre com: npx tsx scripts/measure-fonts.ts
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { chromium } from '@playwright/test'

const url = (p: string) => pathToFileURL(path.resolve(p)).href
const pct = (v: number) => `${(v * 100).toFixed(2)}%`
const FONTS = [
  {
    family: 'Schibsted Grotesk Variable',
    fallback: 'Arial',
    file: 'node_modules/@fontsource-variable/schibsted-grotesk/files/schibsted-grotesk-latin-wght-normal.woff2',
    weight: 600,
  },
  {
    family: 'IBM Plex Sans Variable',
    fallback: 'Arial',
    file: 'node_modules/@fontsource-variable/ibm-plex-sans/files/ibm-plex-sans-latin-wght-normal.woff2',
    weight: 400,
  },
  {
    family: 'IBM Plex Mono',
    fallback: 'Courier New',
    file: 'node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2',
    weight: 500,
  },
]

const SAMPLE =
  'Cada especialidade nas mãos de quem realmente sabe. Profissionais com mais de 30 anos de experiência, reunidos para cada etapa da obra.'

const browser = await chromium.launch()
const page = await browser.newPage()
const faces = FONTS.map(
  (f) => `@font-face{font-family:"${f.family}";src:url("${url(f.file)}") format("woff2");font-weight:100 900;}`,
).join('')
const tmp = path.resolve('.tmp/measure-fonts.html')
fs.mkdirSync(path.dirname(tmp), { recursive: true })
fs.writeFileSync(tmp, `<html><head><style>${faces}</style></head><body></body></html>`)
await page.goto(pathToFileURL(tmp).href)

for (const f of FONTS) {
  const r = await page.evaluate(
    async ({ family, fallback, weight, sample }) => {
      await document.fonts.load(`${weight} 100px "${family}"`)
      const c = document.createElement('canvas').getContext('2d')
      if (!c) throw new Error('canvas')
      c.font = `${weight} 100px "${family}"`
      const real = c.measureText(sample)
      c.font = `${weight} 100px "${fallback}"`
      const fb = c.measureText(sample)
      return {
        width: real.width,
        fbWidth: fb.width,
        ascent: real.fontBoundingBoxAscent,
        descent: real.fontBoundingBoxDescent,
      }
    },
    { family: f.family, fallback: f.fallback, weight: f.weight, sample: SAMPLE },
  )
  const sizeAdjust = r.width / r.fbWidth
  console.log(`\n${f.family} (recurso: ${f.fallback})`)
  console.log(`  size-adjust: ${pct(sizeAdjust)}`)
  console.log(`  ascent-override: ${pct(r.ascent / 100 / sizeAdjust)}`)
  console.log(`  descent-override: ${pct(r.descent / 100 / sizeAdjust)}`)
  console.log('  line-gap-override: 0%')
}
await browser.close()
