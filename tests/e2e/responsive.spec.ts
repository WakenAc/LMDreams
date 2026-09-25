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

for (const [width, height, maxHeight] of [
  [390, 844, 64],
  [1440, 900, 72],
] as const) {
  test(`cabeçalho fixo a ${width} px: continua no topo e visível depois do scroll`, async ({ page }) => {
    await page.setViewportSize({ width, height })
    await page.goto('./')
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'instant' }))
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0)
    const header = page.locator('header').first()
    await expect(header).toBeVisible()
    await expect(header).toBeInViewport()
    const box = await header.boundingBox()
    expect(box?.y).toBe(0)
    expect(box?.height).toBeLessThanOrEqual(maxHeight)
  })
}

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

// WCAG 2.2, 1.4.12 (espaçamento de texto): com os valores do critério, todos os controlos
// do cabeçalho ficam dentro do ecrã e sem se sobreporem, e "Pedir orçamento" continua
// inteiro à vista (Parte 5.3). O cabeçalho passa ao modo compacto (useHeaderFit). Sem o
// espaçamento, a partir de 1152 px a navegação completa continua no cabeçalho. A partir de
// 1280 px, o modo compacto só tira a navegação: o número fica e o "Ligar" nunca aparece
// (Parte 1.4, regra 12: "Ligar" no cabeçalho só entre 768 e 1279 px).
const TEXT_SPACING =
  '* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important }' +
  ' p { margin-bottom: 2em !important }'

for (const width of [390, 1152, 1280, 1440, 1600]) {
  test(`espaçamento de texto (WCAG 1.4.12) a ${width} px: cabeçalho inteiro dentro do ecrã`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('./')
    await page.waitForSelector('html[data-hydrated]')
    const header = page.locator('header').first()
    if (width >= 1152) await expect(header.getByRole('navigation')).toBeVisible()

    await page.addStyleTag({ content: TEXT_SPACING })
    const problems = () =>
      page.evaluate(() => {
        const controls = Array.from(document.querySelectorAll<HTMLElement>('header a, header button'))
          .filter((el) => el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden')
          .map((el) => ({
            name: (el.getAttribute('aria-label') ?? el.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 32),
            r: el.getBoundingClientRect(),
          }))
        const vw = document.documentElement.clientWidth
        const found: string[] = []
        controls.forEach((a, i) => {
          if (a.r.left < -0.5 || a.r.right > vw + 0.5) {
            found.push(`"${a.name}" fora do ecrã (${Math.round(a.r.left)} a ${Math.round(a.r.right)} de ${vw})`)
          }
          for (const b of controls.slice(i + 1)) {
            const overlap =
              a.r.left < b.r.right - 0.5 && b.r.left < a.r.right - 0.5 && a.r.top < b.r.bottom - 0.5 && b.r.top < a.r.bottom - 0.5
            if (overlap) found.push(`"${a.name}" sobrepõe "${b.name}"`)
          }
        })
        return found
      })
    await expect.poll(problems).toEqual([])
    await expect(header.getByRole('link', { name: 'Pedir orçamento' })).toBeInViewport({ ratio: 1 })

    if (width >= 1280) {
      // O cenário é mesmo o do modo compacto (senão o teste não provava nada).
      await expect(page.locator('html[data-header-compacto]')).toHaveCount(1)
      const shortCall = () =>
        page.evaluate(
          () =>
            Array.from(document.querySelectorAll<HTMLElement>('header a, header button')).filter(
              (el) =>
                el.getClientRects().length > 0 &&
                getComputedStyle(el).visibility !== 'hidden' &&
                el.innerText.trim().replace(/\s+/g, ' ') === 'Ligar',
            ).length,
        )
      expect(await shortCall(), '"Ligar" visível no cabeçalho a partir de 1280 px').toBe(0)
      await expect(header.getByRole('link', { name: 'Ligar para a LMDreams' })).toBeHidden()
      const number = header.locator('a[href^="tel:"]').filter({ hasText: '+351' })
      await expect(number).toBeVisible()
      await expect(number).toBeInViewport({ ratio: 1 })
    }
  })
}

// Ecrãs baixos (direção visual, secção 8, ajuste): abaixo de 768 px de largura e com até
// 480 px de altura (telemóvel na horizontal, zoom a 200%), a barra de contacto móvel fica
// escondida. "Pedir orçamento" continua no cabeçalho, e o telefone e o WhatsApp no menu.
test('ecrã baixo (740×360): sem barra móvel, "Pedir orçamento" no cabeçalho e contactos no menu', async ({ page }) => {
  await page.setViewportSize({ width: 740, height: 360 })
  await page.goto('./')
  await page.waitForSelector('html[data-hydrated]')
  const header = page.locator('header').first()
  await expect(page.locator('nav[aria-label="Contactos rápidos"]')).toBeHidden()
  await expect(header.getByRole('link', { name: 'Pedir orçamento' })).toBeInViewport({ ratio: 1 })
  const toggle = header.getByRole('button', { name: 'Abrir menu' })
  await expect(toggle).toBeInViewport({ ratio: 1 })
  await toggle.click()
  const panel = page.locator('[data-mobile-menu-panel]')
  await expect(panel).toBeVisible()
  await expect(panel.getByRole('link', { name: 'Contactar por telefone' })).toBeVisible()
  await expect(panel.getByRole('link', { name: /^Falar por WhatsApp/ })).toBeVisible()
})

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
