// Entrada suave dos elementos marcados com `data-reveal` (Parte 5.3).
// O conteúdo nunca fica escondido à espera de JavaScript nem numa captura de página
// inteira: um elemento só é "armado" (escondido) enquanto o visitante faz scroll e o
// elemento está logo abaixo do ecrã (zona de antecipação), e aparece quando entra.
// - Ao sair da zona de antecipação sem ter entrado no ecrã (o visitante voltou para cima
//   ou saltou por cima dele), é desarmado.
// - Quando o scroll para ('scrollend', ou 150 ms sem eventos de scroll), todos os
//   elementos armados são desarmados: com a página parada, nada fica com opacidade 0.
//   No scroll seguinte, voltam a ser armados os que continuam na zona de antecipação.
// Sem JavaScript, ou com movimento reduzido, não há animação nenhuma.

const ARMED = 'revealArmed'
const REVEALED = 'revealed'

/** Zona de antecipação abaixo do ecrã, em fração da altura da janela. */
const LOOKAHEAD = 0.35
/** O scroll conta como parado ao fim deste tempo sem eventos (também sem 'scrollend'). */
const IDLE_MS = 150

function disarm(el: HTMLElement): void {
  delete el.dataset[ARMED]
}

export function initReveal(): void {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
  if (elements.length === 0) return

  /** Elementos ainda por revelar. */
  const pending = new Set<HTMLElement>()
  /** Verdadeiro com a página parada: nada é armado até ao próximo scroll. */
  let settled = false

  const done = (el: HTMLElement) => {
    el.dataset[REVEALED] = ''
    pending.delete(el)
    arm.unobserve(el)
    show.unobserve(el)
  }

  // 1. Arma os elementos que estão logo abaixo do ecrã (zona de antecipação) e desarma
  //    os que saem dela sem terem sido revelados.
  const arm = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const el = entry.target as HTMLElement
        if (REVEALED in el.dataset) continue
        if (!entry.isIntersecting) {
          disarm(el)
          continue
        }
        if (!settled && entry.boundingClientRect.top >= window.innerHeight) el.dataset[ARMED] = ''
      }
    },
    { rootMargin: `0px 0px ${LOOKAHEAD * 100}% 0px`, threshold: 0 },
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

  // 3. Página parada: desarma tudo (os elementos armados estão fora do ecrã ou na orla
  //    inferior, por isso a mudança não se nota a meio de uma leitura).
  const settle = () => {
    settled = true
    for (const el of pending) disarm(el)
  }

  // 4. Scroll retomado: volta a armar o que está na zona de antecipação, abaixo do ecrã.
  const resume = () => {
    settled = false
    const vh = window.innerHeight
    for (const el of pending) {
      const top = el.getBoundingClientRect().top
      if (top >= vh && top < vh * (1 + LOOKAHEAD)) el.dataset[ARMED] = ''
    }
  }

  // 'scrollend' dá o fim do scroll logo que acontece; o tempo sem eventos cobre os
  // navegadores sem ele e qualquer scroll que não o dispare (settle pode correr duas vezes).
  let idle: ReturnType<typeof setTimeout> | undefined
  const onScroll = () => {
    if (settled) resume()
    clearTimeout(idle)
    idle = setTimeout(settle, IDLE_MS)
  }

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
      pending.add(el)
      arm.observe(el)
      show.observe(el)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    if ('onscrollend' in window) window.addEventListener('scrollend', settle)
    onScroll()
  }
  window.addEventListener('scroll', start, { once: true, passive: true })

  // Impressão: tudo visível.
  window.addEventListener('beforeprint', () => {
    for (const el of elements) done(el)
  })

  document.documentElement.classList.add('reveal-on')
}
