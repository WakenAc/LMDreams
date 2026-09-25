import { useEffect, useState } from 'react'
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
