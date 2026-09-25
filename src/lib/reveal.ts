// Entrada suave dos elementos marcados com `data-reveal` (Parte 5.3).
// O conteúdo nunca fica escondido à espera de JavaScript nem numa captura de página
// inteira: um elemento só é "armado" (escondido) quando se aproxima do fundo do ecrã
// durante o scroll, e aparece logo que entra. O que nunca se aproximou continua visível.
// Sem JavaScript, ou com movimento reduzido, não há animação nenhuma.

const ARMED = 'revealArmed'
const REVEALED = 'revealed'

export function initReveal(): void {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
  if (elements.length === 0) return

  const done = (el: HTMLElement) => {
    el.dataset[REVEALED] = ''
    arm.unobserve(el)
    show.unobserve(el)
  }

  // 1. Arma os elementos que estão logo abaixo do ecrã (zona de antecipação).
  const arm = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const el = entry.target as HTMLElement
        if (!entry.isIntersecting || REVEALED in el.dataset) continue
        if (entry.boundingClientRect.top >= window.innerHeight) el.dataset[ARMED] = ''
      }
    },
    { rootMargin: '0px 0px 35% 0px', threshold: 0 },
  )

  // 2. Revela-os quando entram no ecrã (a transição parte do estado armado).
  const show = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const el = entry.target as HTMLElement
        if (ARMED in el.dataset) {
          requestAnimationFrame(() => done(el))
        } else {
          done(el)
        }
      }
    },
    { rootMargin: '0px 0px -6% 0px', threshold: 0.05 },
  )

  // Só começa com o primeiro scroll do visitante: sem scroll (carregamento, captura de
  // página inteira, leitura do topo) nada é escondido.
  const start = () => {
    for (const el of elements) {
      const rect = el.getBoundingClientRect()
      // Já visível quando o scroll começa: nunca é escondido.
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.dataset[REVEALED] = ''
        continue
      }
      arm.observe(el)
      show.observe(el)
    }
  }
  window.addEventListener('scroll', start, { once: true, passive: true })

  // Impressão: tudo visível.
  window.addEventListener('beforeprint', () => {
    for (const el of elements) done(el)
  })

  document.documentElement.classList.add('reveal-on')
}
