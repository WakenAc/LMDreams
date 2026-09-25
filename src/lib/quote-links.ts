// "Pedir orçamento" leva a #contactos e coloca o foco no primeiro campo do formulário
// (Parte 5.4 §1). Sem JavaScript, a ligação continua a funcionar como âncora normal.
// Contrato: as ligações têm o atributo `data-pedir-orcamento` e o primeiro campo tem
// o id FIRST_FIELD_ID.

export const QUOTE_LINK_ATTR = 'data-pedir-orcamento'
export const FIRST_FIELD_ID = 'campo-nome'

/** Atributos a espalhar nas ligações "Pedir orçamento". */
export const quoteLinkProps = { [QUOTE_LINK_ATTR]: '' } as const

export function initQuoteLinks(): void {
  if (typeof document === 'undefined') return
  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return
    }
    const target = event.target instanceof Element ? event.target.closest(`a[${QUOTE_LINK_ATTR}]`) : null
    if (!(target instanceof HTMLAnchorElement)) return
    const url = new URL(target.href, window.location.href)
    // Só na própria página: nas outras páginas a navegação segue normalmente.
    if (url.pathname !== window.location.pathname || url.hash !== '#contactos') return
    const field = document.getElementById(FIRST_FIELD_ID)
    if (!(field instanceof HTMLElement)) return
    event.preventDefault()
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById('contactos')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    history.replaceState(null, '', '#contactos')
    // Foco sem novo salto de scroll, depois de a deslocação começar.
    window.setTimeout(() => field.focus({ preventScroll: true }), reduce ? 0 : 450)
  })
}
