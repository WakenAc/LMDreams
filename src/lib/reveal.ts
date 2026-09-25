// Entrada suave dos elementos marcados com `data-reveal` (Parte 5.3).
// O conteúdo nunca fica escondido à espera de JavaScript: o estado inicial só é
// aplicado aqui, com movimento aceite, e os elementos já visíveis são marcados
// antes de a classe entrar, para não piscarem.

export function initReveal(): void {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
  if (elements.length === 0) return

  const viewport = window.innerHeight
  for (const el of elements) {
    const rect = el.getBoundingClientRect()
    if (rect.top < viewport && rect.bottom > 0) el.dataset.revealed = ''
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        ;(entry.target as HTMLElement).dataset.revealed = ''
        observer.unobserve(entry.target)
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
  )

  for (const el of elements) {
    if (!('revealed' in el.dataset)) observer.observe(el)
  }

  // Impressão e capturas de página inteira: mostrar tudo.
  window.addEventListener('beforeprint', () => {
    for (const el of elements) el.dataset.revealed = ''
  })

  document.documentElement.classList.add('reveal-on')
}
