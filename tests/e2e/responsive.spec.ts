import { expect, test, type Page } from '@playwright/test'

// Verificação responsiva (Parte 6.2): sem scroll horizontal, alturas do cabeçalho,
// primeiro ecrã do hero e alvos de toque. Corre só no projeto "desktop" e define a
// janela em cada teste (o projeto "mobile" só corre o teste de fumo).

const WIDTHS = [320, 360, 390, 768, 1024, 1280, 1440, 1920]

async function noHorizontalScroll(page: Page): Promise<number> {
  return page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
}

for (const width of WIDTHS) {
  test(`sem scroll horizontal a ${width} px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    for (const path of ['./', 'politica-de-privacidade/', 'pagina-inexistente/']) {
      await page.goto(path)
      expect(await noHorizontalScroll(page), `${path} a ${width} px`).toBeLessThanOrEqual(0)
    }
  })
}

test('cabeçalho: 72 px em computador e 64 px em telemóvel', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('./')
  const desktop = await page.locator('header').first().boundingBox()
  expect(desktop?.height).toBeLessThanOrEqual(72)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('./')
  const mobile = await page.locator('header').first().boundingBox()
  expect(mobile?.height).toBeLessThanOrEqual(64)
})

async function inFirstScreen(page: Page, selector: string, bottomLimit: number) {
  const box = await page.locator(selector).first().boundingBox()
  expect(box, selector).not.toBeNull()
  if (!box) return
  expect(box.y, `${selector} começa dentro do ecrã`).toBeGreaterThanOrEqual(0)
  expect(box.y + box.height, `${selector} acaba antes de ${bottomLimit}px`).toBeLessThanOrEqual(bottomLimit)
}

test('hero a 1280×720: botões, linha de confiança e legenda de IA sem scroll', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 })
  await page.goto('./')
  const hero = '#inicio'
  await inFirstScreen(page, `${hero} h1`, 720)
  await inFirstScreen(page, `${hero} a[href="#contactos"]`, 720)
  await inFirstScreen(page, `${hero} a[href="#servicos"]`, 720)
  await inFirstScreen(page, `${hero} ul[aria-label]`, 720)
  await inFirstScreen(page, `${hero} [data-ai-caption]`, 720)
  // H1 em até 2 linhas em computador.
  const lines = await page.locator(`${hero} h1`).evaluate((h) => {
    const lh = parseFloat(getComputedStyle(h).lineHeight)
    return Math.round(h.getBoundingClientRect().height / lh)
  })
  expect(lines).toBeLessThanOrEqual(2)
})

test('hero a 390×844: tudo acima da barra de contacto móvel', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('./')
  const bar = await page.locator('nav[aria-label="Contactos rápidos"]').boundingBox()
  const limit = bar ? bar.y : 844
  const hero = '#inicio'
  await inFirstScreen(page, `${hero} h1`, limit)
  await inFirstScreen(page, `${hero} a[href="#contactos"]`, limit)
  await inFirstScreen(page, `${hero} a[href="#servicos"]`, limit)
  await inFirstScreen(page, `${hero} ul[aria-label]`, limit)
  await inFirstScreen(page, `${hero} [data-ai-caption]`, limit)
})

for (const width of [768, 1024]) {
  test(`a ${width} px: "Pedir orçamento" e "Ligar" no cabeçalho sem abrir o menu`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('./')
    const header = page.locator('header').first()
    await expect(header.getByRole('link', { name: 'Pedir orçamento' })).toBeVisible()
    await expect(header.getByRole('link', { name: /Ligar para a LMDreams/ })).toBeVisible()
  })
}

test('alvos de toque principais com pelo menos 44×44 px em telemóvel', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('./')
  const targets = page.locator(
    'header a, header button, nav[aria-label="Contactos rápidos"] a, #inicio a, #contactos button, #contactos input:not([type="checkbox"]):not([aria-hidden="true"]), #contactos select, #contactos textarea',
  )
  const n = await targets.count()
  const small: string[] = []
  for (let i = 0; i < n; i++) {
    const t = targets.nth(i)
    if (!(await t.isVisible())) continue
    const box = await t.boundingBox()
    if (box && (box.width < 44 || box.height < 44)) small.push(`${await t.evaluate((e) => e.outerHTML.slice(0, 80))} ${Math.round(box.width)}×${Math.round(box.height)}`)
  }
  expect(small).toEqual([])
})
