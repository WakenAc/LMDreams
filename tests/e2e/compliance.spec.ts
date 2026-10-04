import { expect, test, type Page } from '@playwright/test'

// Conformidade (Partes 5.6 e 6.1) em todas as páginas: bloco "Informação legal",
// Livro de Reclamações, RAL, tipo de chamada junto ao número, legendas de IA,
// nota do rodapé e, na página principal, o formulário e a frase dos projetos.
const PAGES = ['./', 'politica-de-privacidade/', 'politica-de-cookies/', 'termos-e-condicoes/', 'pagina-inexistente/']
const PHONE = /919[\s ]233[\s ]372/
const CALL_NOTE = 'chamada para a rede móvel nacional'

test.describe.configure({ mode: 'parallel' })

async function phoneOccurrencesWithoutNote(page: Page): Promise<string[]> {
  return page.evaluate(
    ({ phoneSource, note }) => {
      const phone = new RegExp(phoneSource)
      const bad: string[] = []
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        const text = n.textContent ?? ''
        if (!phone.test(text)) continue
        const el = n.parentElement
        if (!el || el.closest('script, style, template, [hidden]')) continue
        // Sobe até um elemento de bloco (p, li, dd, div, section) e procura a nota.
        let block: Element | null = el
        for (let i = 0; i < 4 && block; i++) {
          if ((block.textContent ?? '').includes(note)) break
          block = block.parentElement
        }
        if (!block || !(block.textContent ?? '').includes(note)) bad.push(text.trim().slice(0, 80))
      }
      return bad
    },
    { phoneSource: PHONE.source, note: CALL_NOTE },
  )
}

for (const path of PAGES) {
  test(`conformidade em ${path}`, async ({ page }) => {
    await page.goto(path)
    const footer = page.locator('footer')
    await expect(footer.locator('[data-legal-info]')).toContainText('Informação legal')
    await expect(page.locator('a[href="https://www.livroreclamacoes.pt/inicio"]').first()).toBeAttached()
    await expect(footer.locator('[data-ral]')).toContainText('CNIACC')
    await expect(footer.locator('[data-ral] a[href="https://www.centroarbitragemlisboa.pt"]')).toContainText(
      'www.centroarbitragemlisboa.pt',
    )
    await expect(page.locator('a[href*="ec.europa.eu/consumers/odr"]')).toHaveCount(0)
    expect(await phoneOccurrencesWithoutNote(page)).toEqual([])

    // Cada imagem gerada por IA tem a legenda visível em texto no DOM.
    const aiImages = page.locator('img[data-ilustrativa="true"]')
    const count = await aiImages.count()
    for (let i = 0; i < count; i++) {
      const figure = aiImages.nth(i).locator('xpath=ancestor::figure[@data-ai-image]')
      await expect(figure).toHaveCount(1)
      const caption = figure.locator('[data-ai-caption]')
      await expect(caption).toHaveText('Imagem ilustrativa gerada por IA')
      await expect(caption).not.toHaveAttribute('aria-hidden', 'true')
    }
  })
}

test('nota de IA no rodapé se, e só se, houver imagens ilustrativas', async ({ page }) => {
  await page.goto('./')
  const hasAi = (await page.locator('img[data-ilustrativa="true"]').count()) > 0
  await expect(page.locator('footer [data-ai-notice]')).toHaveCount(hasAi ? 1 : 0)
})

test('formulário: caixa de privacidade, aviso RGPD e sem caixa de marketing', async ({ page }) => {
  await page.goto('./')
  const form = page.locator('form[data-lead-form]')
  await expect(form).toHaveCount(1)
  const boxes = form.locator('input[type="checkbox"]')
  await expect(boxes).toHaveCount(1)
  await expect(boxes.first()).not.toBeChecked()
  await expect(boxes.first()).toHaveAttribute('required', '')
  const label = form.locator('label', { has: page.locator('a[href*="politica-de-privacidade/"]') })
  await expect(label).toContainText('Tomei conhecimento da Política de privacidade')
  const notice = form.locator('[data-rgpd-notice]')
  await expect(notice).toContainText('art. 6.º')
  // O aviso fica antes do botão de envio.
  const order = await form.evaluate((f) => {
    const n = f.querySelector('[data-rgpd-notice]')
    const b = f.querySelector('button[type="submit"]')
    return n && b ? n.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING : 0
  })
  expect(order).toBeTruthy()
})

test('projetos: frase provisória enquanto só houver placeholders', async ({ page }) => {
  await page.goto('./')
  const cards = page.locator('#projetos [data-project]')
  const total = await cards.count()
  const placeholders = await page.locator('#projetos [data-project][data-placeholder="true"]').count()
  const section = page.locator('#projetos')
  if (total > 0 && total === placeholders) {
    await expect(section).toContainText('Esta secção vai reunir obras realizadas pela LMDreams')
    await expect(section).not.toContainText('Fotografias de obras realizadas pela LMDreams, publicadas com autorização dos clientes.')
  }
})

test('sem cookies nem armazenamento do navegador', async ({ page, context }) => {
  await page.goto('./')
  await page.waitForLoadState('networkidle')
  expect(await context.cookies()).toEqual([])
  const storage = await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length }))
  expect(storage).toEqual({ local: 0, session: 0 })
})
