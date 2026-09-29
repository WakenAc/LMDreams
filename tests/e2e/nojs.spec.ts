import { AxeBuilder } from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

// Conteúdo completo e visível sem JavaScript (Parte 1.4, regra 10).
test.use({ javaScriptEnabled: false })

// axe sobre o HTML antes da hidratação, nas larguras de a11y.spec.ts: é o que um visitante
// vê sem JavaScript e antes de o JavaScript das ilhas chegar (só é pedido depois do load).
// O axe precisa de JavaScript na página, por isso aqui o JavaScript do site é bloqueado na
// rede em vez de desligado: o resultado é o mesmo HTML pré-renderizado, sem hidratação.
const AXE_PAGES = ['./', 'politica-de-privacidade/', 'politica-de-cookies/', 'termos-e-condicoes/', 'pagina-inexistente/']
const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

test.describe('axe antes da hidratação', () => {
  test.use({ javaScriptEnabled: true })
  for (const width of [390, 768, 1440]) {
    for (const path of AXE_PAGES) {
      test(`axe sem o JavaScript do site a ${width} px em ${path}`, async ({ page }) => {
        await page.route('**/assets/*.js', (route) => route.abort())
        await page.setViewportSize({ width, height: 900 })
        await page.goto(path)
        const hydrated = await page.evaluate(() => document.documentElement.dataset.hydrated ?? null)
        expect(hydrated).toBeNull()
        const r = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze()
        const serious = r.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
        expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`)).toEqual([])
      })
    }
  }
})

const SECTIONS = [
  'inicio',
  'sobre',
  'diferenciacao',
  'servicos',
  'metodo',
  'projetos',
  'transparencia',
  // 'testemunhos' só aparece com pelo menos um testemunho real (src/sections/Testimonials.tsx).
  'orcamento',
  'contactos',
]

test('página principal sem JavaScript: todas as secções e o formulário', async ({ page }) => {
  await page.goto('./')
  await expect(page.locator('h1')).toHaveCount(1)
  for (const id of SECTIONS) {
    await expect(page.locator(`#${id}`)).toBeVisible()
  }
  await expect(page.locator('form[data-lead-form]')).toHaveCount(1)
  // Sem JavaScript, o navegador valida os campos obrigatórios e a caixa da Política de
  // privacidade antes de abrir o programa de e-mail.
  await expect(page.locator('form[data-lead-form]')).toHaveJSProperty('noValidate', false)
  // Nada fica escondido à espera de JavaScript.
  const hidden = await page.evaluate(() =>
    Array.from(document.querySelectorAll('main *'))
      .filter((el) => {
        const s = getComputedStyle(el)
        return (el.textContent ?? '').trim().length > 0 && (s.opacity === '0' || s.visibility === 'hidden')
      })
      // Os filtros e os botões do detalhe dos projetos só funcionam com JavaScript e ficam
      // de fora de propósito; os sete projetos, com o conteúdo todo, continuam visíveis.
      .filter((el) => !el.closest('dialog, [aria-hidden="true"], .sr-only, [data-filter-group], [data-project-open]'))
      .map((el) => el.tagName)
      .slice(0, 10),
  )
  expect(hidden).toEqual([])
})

for (const path of ['politica-de-privacidade/', 'politica-de-cookies/', 'termos-e-condicoes/']) {
  test(`${path} sem JavaScript: índice e secções`, async ({ page }) => {
    await page.goto(path)
    await expect(page.locator('h1')).toHaveCount(1)
    expect(await page.locator('main h2').count()).toBeGreaterThan(3)
  })
}
