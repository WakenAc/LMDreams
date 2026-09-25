import { AxeBuilder } from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

// Acessibilidade (Partes 3.10 e 6.1): axe em todas as páginas a 390, 768 e 1440 px,
// e percursos de teclado. Corre só no projeto "desktop" (define a janela em cada teste).
// O axe corre sobre as ilhas já hidratadas (html[data-hydrated]); o estado antes da
// hidratação, igual ao HTML sem JavaScript, é verificado em nojs.spec.ts.

const PAGES = ['./', 'politica-de-privacidade/', 'politica-de-cookies/', 'termos-e-condicoes/', 'pagina-inexistente/']
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

for (const width of [390, 768, 1440]) {
  for (const path of PAGES) {
    test(`axe a ${width} px em ${path}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(path)
      await page.waitForLoadState('networkidle')
      await page.waitForSelector('html[data-hydrated]', { state: 'attached' })
      const r = await new AxeBuilder({ page }).withTags(TAGS).analyze()
      const serious = r.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
      expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`)).toEqual([])
    })
  }
}

test('"Saltar para o conteúdo" é o primeiro elemento focável', async ({ page }) => {
  await page.goto('./')
  await page.keyboard.press('Tab')
  const focused = page.locator(':focus')
  await expect(focused).toHaveText('Saltar para o conteúdo')
  await expect(focused).toBeVisible()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#conteudo$/)
})

test('menu móvel: abre, prende o foco, fecha com Esc e devolve o foco', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('./')
  await page.waitForSelector('html[data-hydrated]')
  const button = page.getByRole('button', { name: 'Abrir menu' })
  await button.click()
  await expect(page.getByRole('button', { name: 'Fechar menu' }).first()).toBeVisible()
  // O foco fica dentro do painel ao percorrer com Tab.
  for (let i = 0; i < 15; i++) await page.keyboard.press('Tab')
  const inside = await page.evaluate(() => {
    const panel = document.querySelector('[data-mobile-menu]') ?? document.querySelector('[role="dialog"]')
    return panel ? panel.contains(document.activeElement) : true
  })
  expect(inside).toBe(true)
  await page.keyboard.press('Escape')
  await expect(page.getByRole('button', { name: 'Abrir menu' })).toBeFocused()
})

test('"Pedir orçamento" do cabeçalho leva ao formulário e foca o nome', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('./')
  await page.waitForSelector('html[data-hydrated]')
  await page.locator('header').getByRole('link', { name: 'Pedir orçamento' }).click()
  await expect(page.locator('#campo-nome')).toBeFocused({ timeout: 3000 })
})

test('diálogo de projeto: abre, fecha com Esc e devolve o foco', async ({ page }) => {
  await page.goto('./')
  await page.waitForSelector('html[data-hydrated]')
  const open = page.locator('#projetos').getByRole('button', { name: /Ver antes e depois/ }).first()
  await open.click()
  const dialog = page.locator('dialog[open]')
  await expect(dialog).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
  await expect(open).toBeFocused()
})

test('movimento reduzido: sem conteúdo escondido', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('./')
  const hidden = await page.evaluate(
    () => Array.from(document.querySelectorAll('[data-reveal]')).filter((el) => getComputedStyle(el).opacity === '0').length,
  )
  expect(hidden).toBe(0)
})

// Parte 5.3: "tudo é visível numa captura de ecrã de página inteira", também depois de um
// scroll. Com movimento normal, um scroll para baixo e o regresso ao topo não podem deixar
// elementos armados (opacidade 0) fora do ecrã.
test('movimento normal: depois de um scroll e do regresso ao topo, nada fica escondido', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('./')
  await page.waitForSelector('html[data-hydrated]')
  await expect(page.locator('html.reveal-on')).toHaveCount(1)
  await page.mouse.move(195, 420)
  await page.mouse.wheel(0, 1266)
  await page.waitForTimeout(500)
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  // A transição de entrada dura 400 ms.
  await page.waitForTimeout(900)
  const state = await page.evaluate(() => ({
    hidden: Array.from(document.querySelectorAll('[data-reveal]')).filter((el) => getComputedStyle(el).opacity === '0')
      .length,
    armed: document.querySelectorAll('[data-reveal-armed]:not([data-revealed])').length,
  }))
  expect(state).toEqual({ hidden: 0, armed: 0 })
})

// WCAG 2.2, 2.4.11: o elemento com foco nunca fica inteiramente tapado pela barra de
// contacto móvel nem pelo cabeçalho fixo. 640 × 360 simula uma janela de 1280 × 720 com
// zoom a 200% (Parte 3.10). Movimento reduzido: o scroll do foco é instantâneo.
for (const [width, height] of [
  [390, 844],
  [640, 360],
] as const) {
  test(`foco nunca inteiramente tapado pela barra móvel nem pelo cabeçalho a ${width}×${height}`, async ({ page }) => {
    test.setTimeout(90_000)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.setViewportSize({ width, height })
    await page.goto('./')
    await page.waitForSelector('html[data-hydrated]')
    const covered: string[] = []
    let visited = 0
    for (let i = 0; i < 400; i++) {
      await page.keyboard.press('Tab')
      const r = await page.evaluate(() => {
        const el = document.activeElement
        if (!(el instanceof HTMLElement) || el === document.body) return { end: true, covered: null }
        // Elementos das camadas fixas e a ligação de salto (aparece por cima do cabeçalho).
        if (el.closest('header, [data-mobile-contact-bar]') || el.matches('a[href="#conteudo"]')) {
          return { end: false, covered: null }
        }
        const rect = el.getBoundingClientRect()
        if (rect.width === 0 && rect.height === 0) return { end: false, covered: null }
        const bar = document.querySelector('[data-mobile-contact-bar]')
        const barVisible =
          bar instanceof HTMLElement && !bar.hasAttribute('data-hidden') && getComputedStyle(bar).visibility === 'visible' &&
          getComputedStyle(bar).display !== 'none'
        const barTop = barVisible ? bar.getBoundingClientRect().top : window.innerHeight
        const headerBottom = document.querySelector('header')?.getBoundingClientRect().bottom ?? 0
        const hidden = rect.top >= barTop || rect.bottom <= headerBottom
        const label = `${el.tagName.toLowerCase()} "${(el.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 40)}" (${Math.round(rect.top)}–${Math.round(rect.bottom)}; cabeçalho ${Math.round(headerBottom)}, barra ${Math.round(barTop)})`
        return { end: false, covered: hidden ? label : null }
      })
      if (r.end) break
      visited++
      if (r.covered) covered.push(r.covered)
    }
    expect(visited, 'elementos percorridos com Tab').toBeGreaterThan(20)
    expect(covered).toEqual([])
  })
}
