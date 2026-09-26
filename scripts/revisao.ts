// Artefactos de uma ronda de verificação (Partes 2.8 e 6.2), em .revisao/ronda-<n>/:
// capturas (ecrã visível e página inteira, movimento normal e reduzido, sem JavaScript),
// medições (scroll horizontal, cabeçalho, hero, alvos de toque, pedidos externos,
// consola) e violações do axe. Corre sobre a pasta de saída já construída.
// Proveniência: o chunk de entrada e a data do dist ficam em medicoes.json e axe.json
// (chave "proveniencia"); se o dist mudar durante a recolha, o script falha sem os gravar.
// Com JavaScript, cada captura, medição e axe é feita depois da hidratação.
// Uso: npx tsx scripts/revisao.ts --ronda 1
import fs from 'node:fs'
import path from 'node:path'
import { AxeBuilder } from '@axe-core/playwright'
import { chromium, type Browser, type Page } from '@playwright/test'
import { provenanceChange, readProvenance } from './proveniencia.ts'
import { startServer } from './serve-dist.ts'

function arg(name: string, fallback: string): string {
  const i = process.argv.indexOf(`--${name}`)
  return i > -1 && process.argv[i + 1] ? (process.argv[i + 1] as string) : fallback
}

const ronda = arg('ronda', '1')
const OUT = path.resolve(`.revisao/ronda-${ronda}`)
const SHOTS = path.join(OUT, 'capturas')
fs.mkdirSync(SHOTS, { recursive: true })

const WIDTHS = [360, 390, 768, 1024, 1280, 1440, 1920]
const HEIGHT: Record<number, number> = { 360: 780, 390: 844, 768: 1024, 1024: 768, 1280: 720, 1440: 900, 1920: 1080 }
const PAGES = [
  { name: 'principal', path: '' },
  { name: 'privacidade', path: 'politica-de-privacidade/' },
  { name: 'cookies', path: 'politica-de-cookies/' },
  { name: 'termos', path: 'termos-e-condicoes/' },
  { name: '404', path: 'a/b/pagina-inexistente/' },
]

const DIST = 'dist'
const provenance = readProvenance(DIST)
if (!provenance.entrada) {
  console.error(`revisao: não encontrei o chunk de entrada em ${path.join(DIST, 'index.html')} (data-lmd-loader); corra primeiro o build`)
  process.exit(1)
}
console.log(`revisao: build de ${provenance.buildEm}, entrada ${provenance.entrada}`)

const server = await startServer({ dir: DIST, base: '/LMDreams/', port: 4180 })
const BASE = server.url.endsWith('/') ? server.url : `${server.url}/`
console.log(`revisao: servidor em ${BASE}`)

const medicoes: Record<string, unknown> = {}
const axe: Record<string, unknown> = {}

/** Espera pela hidratação das ilhas; se não acontecer, fica registado na consola da página. */
async function waitForHydration(page: Page, consoleMsgs: string[]) {
  try {
    await page.waitForSelector('html[data-hydrated]', { state: 'attached', timeout: 15_000 })
  } catch {
    consoleMsgs.push('hidratação: html[data-hydrated] não apareceu em 15 s (capturas e axe sobre o HTML sem JavaScript)')
  }
}

async function scrollThrough(page: Page) {
  // Percorre a página até ao fim para disparar as entradas suaves (e as imagens lazy)
  // antes da captura inteira. Scroll instantâneo: o html tem scroll-behavior: smooth e um
  // scroll animado seria interrompido pelo passo seguinte. A espera final cobre a
  // transição de 400 ms das entradas.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8
    for (let y = 0; ; y += step) {
      // A altura pode crescer com as imagens lazy: recalculada a cada passo.
      const end = document.documentElement.scrollHeight - window.innerHeight
      window.scrollTo({ top: Math.min(y, end), behavior: 'instant' })
      await new Promise((r) => setTimeout(r, 60))
      if (y >= end) break
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  })
  await page.waitForTimeout(800)
}

async function measure(page: Page, width: number) {
  return page.evaluate((w) => {
    // As funções do page.evaluate correm no navegador: não podem subir para o módulo.
    // oxlint-disable-next-line unicorn/consistent-function-scoping -- corre no navegador (page.evaluate)
    const q = (s: string) => document.querySelector(s)
    // oxlint-disable-next-line unicorn/consistent-function-scoping -- corre no navegador (page.evaluate)
    const box = (el: Element | null) => {
      if (!el) return null
      const r = el.getBoundingClientRect()
      return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }
    }
    const small: string[] = []
    for (const el of Array.from(document.querySelectorAll('a, button, input, select, textarea, summary'))) {
      const r = el.getBoundingClientRect()
      const cs = getComputedStyle(el)
      if (r.width === 0 || r.height === 0 || cs.visibility === 'hidden') continue
      if (el.closest('.sr-only, [aria-hidden="true"]')) continue
      // Ligações dentro de parágrafos (texto corrido) estão isentas do mínimo de 24 px.
      const inline = el.tagName === 'A' && cs.display === 'inline' && el.closest('p, li, dd')
      if (!inline && (r.width < 24 || r.height < 24)) small.push(`${el.tagName.toLowerCase()} "${(el.textContent ?? '').trim().slice(0, 40)}" ${Math.round(r.width)}×${Math.round(r.height)}`)
    }
    const hero = q('#inicio')
    return {
      largura: w,
      scrollWidthExcesso: document.documentElement.scrollWidth - window.innerWidth,
      cabecalho: box(q('header')),
      barraMovel: box(q('nav[aria-label="Contactos rápidos"]')),
      hero: hero
        ? {
            h1: box(hero.querySelector('h1')),
            botaoOrcamento: box(hero.querySelector('a[href="#contactos"]')),
            botaoServicos: box(hero.querySelector('a[href="#servicos"]')),
            linhaConfianca: box(hero.querySelector('ul[aria-label]')),
            legendaIA: box(hero.querySelector('[data-ai-caption]')),
          }
        : null,
      alvosAbaixoDe24px: small.slice(0, 30),
      alturaPagina: document.documentElement.scrollHeight,
    }
  }, width)
}

async function run(browser: Browser) {
  for (const p of PAGES) {
    for (const width of WIDTHS) {
      for (const mode of ['normal', 'reduced'] as const) {
        if (mode === 'reduced' && ![390, 1440].includes(width)) continue
        const context = await browser.newContext({
          viewport: { width, height: HEIGHT[width] ?? 900 },
          reducedMotion: mode === 'reduced' ? 'reduce' : 'no-preference',
          locale: 'pt-PT',
        })
        // O tsx (esbuild) injeta __name nas funções passadas ao page.evaluate.
        await context.addInitScript({ content: 'window.__name = (f) => f' })
        const page = await context.newPage()
        const external: string[] = []
        const consoleMsgs: string[] = []
        page.on('request', (r) => {
          if (!r.url().startsWith(new URL(BASE).origin) && !r.url().startsWith('data:')) external.push(r.url())
        })
        page.on('console', (m) => {
          if (m.type() === 'error' || m.type() === 'warning') consoleMsgs.push(`${m.type()}: ${m.text()}`)
        })
        page.on('pageerror', (e) => consoleMsgs.push(`pageerror: ${e.message}`))
        await page.goto(BASE + p.path, { waitUntil: 'networkidle' })
        await waitForHydration(page, consoleMsgs)
        await page.evaluate(() => document.fonts.ready)
        const suffix = mode === 'reduced' ? '-reduced' : ''
        await page.screenshot({ path: path.join(SHOTS, `${p.name}-${width}${suffix}.png`) })
        if (mode === 'normal') medicoes[`${p.name}-${width}`] = { ...(await measure(page, width)), pedidosExternos: external, consola: consoleMsgs }
        await scrollThrough(page)
        await page.screenshot({ path: path.join(SHOTS, `${p.name}-${width}${suffix}-full.png`), fullPage: true })
        if (mode === 'normal' && [390, 768, 1440].includes(width)) {
          const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()
          axe[`${p.name}-${width}`] = r.violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            help: v.help,
            nodes: v.nodes.slice(0, 5).map((n) => n.target.join(' ')),
          }))
        }
        await context.close()
      }
    }
    // Sem JavaScript (principal e uma página legal).
    if (['principal', 'privacidade'].includes(p.name)) {
      for (const width of [390, 1440]) {
        const context = await browser.newContext({ viewport: { width, height: HEIGHT[width] ?? 900 }, javaScriptEnabled: false })
        const page = await context.newPage()
        await page.goto(BASE + p.path)
        await page.screenshot({ path: path.join(SHOTS, `${p.name}-${width}-nojs-full.png`), fullPage: true })
        await context.close()
      }
    }
    console.log(`revisao: ${p.name} capturada`)
  }
}

const browser = await chromium.launch()
try {
  await run(browser)
} finally {
  await browser.close()
  await server.close()
}

// O dist não pode ter mudado a meio: as capturas, as medições e o axe seriam de dois builds.
const changed = provenanceChange(provenance, readProvenance(DIST))
if (changed) {
  console.error(`revisao FALHOU: ${changed}. medicoes.json e axe.json não foram gravados; volte a correr sem nenhum build pelo meio.`)
  process.exit(1)
}
fs.writeFileSync(path.join(OUT, 'medicoes.json'), `${JSON.stringify({ proveniencia: provenance, ...medicoes }, null, 2)}\n`)
fs.writeFileSync(path.join(OUT, 'axe.json'), `${JSON.stringify({ proveniencia: provenance, ...axe }, null, 2)}\n`)
const graves = Object.entries(axe).flatMap(([k, v]) =>
  (v as { id: string; impact: string }[]).filter((x) => x.impact === 'serious' || x.impact === 'critical').map((x) => `${k}: ${x.id}`),
)
console.log(`revisao: ${fs.readdirSync(SHOTS).length} capturas; axe graves: ${graves.length}`)
for (const g of graves) console.log(`  ${g}`)
