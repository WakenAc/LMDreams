// npm run lighthouse (Partes 3.12 e 6.1): Lighthouse em telemóvel e computador sobre a
// página principal e as três páginas legais, servidas como no GitHub Pages
// (scripts/serve-dist.ts). Usa a API do Lighthouse com o Chromium do Playwright, o que
// evita o chrome-launcher (no Windows falha a apagar a pasta temporária). Relatórios
// em .lighthouseci/<telemovel|computador>/ (nunca armazenamento público) e um resumo em
// .lighthouseci/resumo.json. A 404 fica fora (verificada pelo Playwright e pelo axe).
import fs from 'node:fs'
import path from 'node:path'
import { chromium } from '@playwright/test'
import lighthouse, { desktopConfig } from 'lighthouse'
import { startServer } from './serve-dist.ts'

const ALL_PAGES = ['', 'politica-de-privacidade/', 'politica-de-cookies/', 'termos-e-condicoes/']
// Filtros opcionais para medições rápidas: --preset telemovel|computador --pagina principal|<caminho>
function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`)
  return i > -1 ? process.argv[i + 1] : undefined
}
const onlyPreset = arg('preset')
const onlyPage = arg('pagina')
const PAGES = ALL_PAGES.filter((p) => !onlyPage || (onlyPage === 'principal' ? p === '' : p.startsWith(onlyPage)))
const PORT_DEBUG = 9333
const OUT = path.resolve('.lighthouseci')

interface Limits {
  performance: number
  accessibility: number
  'best-practices': number
  seo: number
}
const LIMITS: Record<'telemovel' | 'computador', Limits> = {
  telemovel: { performance: 0.9, accessibility: 1, 'best-practices': 0.95, seo: 1 },
  computador: { performance: 0.95, accessibility: 1, 'best-practices': 0.95, seo: 1 },
}

if (!onlyPreset && !onlyPage) fs.rmSync(OUT, { recursive: true, force: true })
fs.mkdirSync(OUT, { recursive: true })

const server = await startServer({ dir: process.env.OUT_DIR ?? 'dist', base: '/LMDreams/', port: 4174 })
const base = server.url.endsWith('/') ? server.url : `${server.url}/`
const browser = await chromium.launch({ args: [`--remote-debugging-port=${PORT_DEBUG}`] })

type Row = {
  preset: string
  page: string
  scores: Record<string, number>
  lcp: number
  cls: number
  tbt: number
  fcp: number
  falhas: string[]
}
const rows: Row[] = []

try {
  for (const preset of (['telemovel', 'computador'] as const).filter((x) => !onlyPreset || x === onlyPreset)) {
    const dir = path.join(OUT, preset)
    fs.mkdirSync(dir, { recursive: true })
    for (const p of PAGES) {
      const url = base + p
      const result = await lighthouse(
        url,
        { port: PORT_DEBUG, output: ['html', 'json'], logLevel: 'error' },
        preset === 'computador' ? desktopConfig : undefined,
      )
      if (!result) throw new Error(`Lighthouse sem resultado para ${url}`)
      const lhr = result.lhr
      const name = p ? p.replace(/\/$/, '') : 'principal'
      const [html, json] = result.report as string[]
      fs.writeFileSync(path.join(dir, `${name}.html`), html ?? '')
      fs.writeFileSync(path.join(dir, `${name}.json`), json ?? '')

      const scores = Object.fromEntries(
        Object.entries(lhr.categories).map(([k, c]) => [k, Math.round((c.score ?? 0) * 100)]),
      )
      const metric = (id: string) => Number(lhr.audits[id]?.numericValue ?? Number.NaN)
      const row: Row = {
        preset,
        page: name,
        scores,
        lcp: metric('largest-contentful-paint'),
        cls: metric('cumulative-layout-shift'),
        tbt: metric('total-blocking-time'),
        fcp: metric('first-contentful-paint'),
        falhas: [],
      }
      const limits = LIMITS[preset]
      for (const [cat, min] of Object.entries(limits)) {
        if ((scores[cat] ?? 0) < min * 100) row.falhas.push(`${cat} ${scores[cat]} < ${min * 100}`)
      }
      if (row.cls > 0.05) row.falhas.push(`CLS ${row.cls.toFixed(3)} > 0,05`)
      if (preset === 'telemovel' && row.lcp >= 2500) row.falhas.push(`LCP ${Math.round(row.lcp)} ms ≥ 2500 ms`)
      // Auditorias com nota abaixo de 1 nas categorias de acessibilidade, boas práticas e SEO.
      for (const cat of ['accessibility', 'best-practices', 'seo']) {
        for (const ref of lhr.categories[cat]?.auditRefs ?? []) {
          const a = lhr.audits[ref.id]
          if (ref.weight > 0 && a && a.score !== null && a.score < 1) row.falhas.push(`${cat}: ${ref.id} (${a.title})`)
        }
      }
      rows.push(row)
      console.log(
        `${preset.padEnd(10)} ${name.padEnd(26)} desempenho ${scores.performance} · acessibilidade ${scores.accessibility} · boas práticas ${scores['best-practices']} · SEO ${scores.seo} · LCP ${Math.round(row.lcp)} ms · CLS ${row.cls.toFixed(3)} · TBT ${Math.round(row.tbt)} ms`,
      )
      for (const f of row.falhas) console.log(`           ! ${f}`)
    }
  }
} finally {
  await browser.close()
  await server.close()
}

fs.writeFileSync(path.join(OUT, 'resumo.json'), `${JSON.stringify(rows, null, 2)}\n`)
const failed = rows.filter((r) => r.falhas.length > 0)
console.log(
  failed.length === 0
    ? `\nlighthouse passou: ${rows.length} recolhas dentro dos limites da Parte 6.1.`
    : `\nlighthouse: ${failed.length} de ${rows.length} recolhas abaixo dos limites (ver acima e .lighthouseci/).`,
)
process.exit(failed.length === 0 ? 0 : 1)
