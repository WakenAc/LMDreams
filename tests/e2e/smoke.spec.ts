import { AxeBuilder } from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

// Teste de fumo: todas as páginas abrem, têm um H1, não fazem pedidos a terceiros,
// não têm erros na consola e o axe não encontra violações graves.
const PAGES = [
  { path: './', name: 'principal' },
  { path: 'politica-de-privacidade/', name: 'privacidade' },
  { path: 'politica-de-cookies/', name: 'cookies' },
  { path: 'termos-e-condicoes/', name: 'termos' },
  { path: 'pagina-que-nao-existe/', name: '404' },
]

for (const p of PAGES) {
  test(`página ${p.name}: carrega sem erros e sem violações graves`, async ({ page, baseURL }) => {
    const errors: string[] = []
    const external: string[] = []
    const origin = new URL(baseURL ?? 'http://localhost').origin
    page.on('console', (msg) => {
      if (msg.type() !== 'error' && msg.type() !== 'warning') return
      // A própria 404 responde com o estado 404 de propósito (o Chrome regista-o na consola).
      if (p.name === '404' && msg.location().url.endsWith(p.path) && /status of 404/.test(msg.text())) return
      errors.push(`${msg.type()}: ${msg.text()}`)
    })
    page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`))
    page.on('request', (req) => {
      const url = req.url()
      if (!url.startsWith(origin) && !url.startsWith('data:')) external.push(url)
    })

    const response = await page.goto(p.path)
    expect(response?.status()).toBe(p.name === '404' ? 404 : 200)
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('main#conteudo')).toBeVisible()
    await page.waitForLoadState('networkidle')
    // O JavaScript das ilhas só é pedido depois do evento load (scripts/prerender.ts): o
    // axe e a consola só contam depois da hidratação, mais 500 ms para avisos tardios.
    await page.waitForSelector('html[data-hydrated]', { state: 'attached' })
    await page.waitForTimeout(500)

    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()
    const serious = axe.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
    expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([])
    expect(external).toEqual([])
    expect(errors).toEqual([])
  })
}
