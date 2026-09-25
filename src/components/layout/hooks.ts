import { useEffect, useState, type RefObject } from 'react'
import { navigation } from '../../content/navigation'
import type { AnchorId, PageId } from '../../lib/pages'

// Estado do cabeçalho calculado só no cliente (useEffect): o HTML pré-renderizado e o
// primeiro render da hidratação são sempre iguais (sem scroll, nenhum item marcado).

/** Verdadeiro quando a página já não está no topo (linha e sombra do cabeçalho). */
export function useScrolled(threshold = 4): boolean {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      setScrolled(window.scrollY > threshold)
    }
    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame !== 0) window.cancelAnimationFrame(frame)
    }
  }, [threshold])

  return scrolled
}

/**
 * Modo compacto do cabeçalho (WCAG 2.2, 1.4.12, espaçamento de texto).
 *
 * As larguras do cabeçalho estão contadas para as fontes do site (Header.tsx) e nada nele
 * encolhe nem quebra de linha. Se o visitante aumentar o espaçamento entre letras e
 * palavras (ou usar uma fonte mais larga), o conteúdo passa a margem direita e, como o
 * cabeçalho é fixo, o que fica de fora ("Pedir orçamento", o botão do menu) não se
 * alcança com scroll. Quando isso acontece, <html data-header-compacto> muda o cabeçalho:
 * - "navegacao": a navegação dá lugar ao botão do menu e o número ao botão "Ligar";
 * - "nome": além disso, o nome ao lado do logótipo fica só para as tecnologias de apoio
 *   (como abaixo de 380 px).
 *
 * Cada medição parte do cabeçalho completo e decide na mesma tarefa, sem pintura pelo
 * meio: o resultado depende só do espaço disponível, por isso não oscila, e o cabeçalho
 * completo volta assim que voltar a caber. O ResizeObserver segue a largura da linha
 * (janela) e a de cada bloco (texto, fontes, espaçamento). Sem JavaScript, ou antes da
 * hidratação, fica o cabeçalho completo do HTML pré-renderizado.
 */
export function useHeaderFit(rowRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const row = rowRef.current
    if (!row || typeof ResizeObserver === 'undefined') return
    const html = document.documentElement

    // O último bloco (à direita, com ml-auto) passa o limite do conteúdo quando não cabe.
    const overflows = () => {
      const last = row.lastElementChild
      if (!last) return false
      const limit = row.getBoundingClientRect().right - (Number.parseFloat(getComputedStyle(row).paddingRight) || 0)
      return last.getBoundingClientRect().right > limit + 0.5
    }

    const fit = () => {
      delete html.dataset.headerCompacto
      for (const level of ['navegacao', 'nome']) {
        if (!overflows()) return
        html.dataset.headerCompacto = level
      }
    }

    let frame = 0
    const schedule = () => {
      if (frame !== 0) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        fit()
      })
    }
    const observer = new ResizeObserver(schedule)
    observer.observe(row)
    for (const child of Array.from(row.children)) observer.observe(child)
    fit()

    return () => {
      observer.disconnect()
      if (frame !== 0) window.cancelAnimationFrame(frame)
      delete html.dataset.headerCompacto
    }
  }, [rowRef])
}

const NAV_ANCHORS: readonly string[] = navigation.items.map((item) => item.anchor)

function isNavAnchor(id: string): id is AnchorId {
  return NAV_ANCHORS.includes(id)
}

/**
 * Secção atual da página principal (scrollspy com IntersectionObserver).
 *
 * Observa as secções do `main` com uma faixa fina a 35% da altura da janela. As secções
 * sem item próprio na navegação (Diferenciação, Transparência, Testemunhos, CTA) contam
 * como a última secção com item que as precede, para o destaque não desaparecer entre
 * itens. Fora da página principal, ou sem JavaScript, devolve null: nenhum item marcado.
 */
export function useActiveSection(page: PageId): AnchorId | null {
  const [active, setActive] = useState<AnchorId | null>(null)

  useEffect(() => {
    if (page !== 'home' || !('IntersectionObserver' in window)) return
    const main = document.getElementById('conteudo')
    if (!main) return

    const sections = Array.from(main.querySelectorAll<HTMLElement>(':scope > section[id]'))
    for (const id of NAV_ANCHORS) {
      const el = document.getElementById(id)
      if (el && !sections.includes(el)) sections.push(el)
    }
    sections.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))

    const owner = new Map<Element, AnchorId | null>()
    let current: AnchorId | null = null
    for (const section of sections) {
      if (isNavAnchor(section.id)) current = section.id
      owner.set(section, current)
    }

    const visible = new Set<Element>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target)
          else visible.delete(entry.target)
        }
        // A última secção dentro da faixa, pela ordem do documento. Com a faixa no
        // rodapé (nenhuma secção), mantém-se o último item marcado.
        let next: AnchorId | null | undefined
        for (const section of sections) {
          if (visible.has(section)) next = owner.get(section) ?? null
        }
        if (next !== undefined) setActive(next)
      },
      { rootMargin: '-35% 0px -64% 0px', threshold: 0 },
    )
    for (const section of sections) observer.observe(section)
    return () => observer.disconnect()
  }, [page])

  return active
}
