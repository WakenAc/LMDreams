import { Menu, MessageCircle, Phone, X } from 'lucide-react'
import { useEffect, useRef, useState, useSyncExternalStore, type MouseEvent as ReactMouseEvent } from 'react'
import { company } from '../../content/company'
import { ui } from '../../content/common'
import { navigation } from '../../content/navigation'
import { anchorHref } from '../../lib/links'
import { useCurrentPage } from '../../lib/page-context'
import type { AnchorId } from '../../lib/pages'
import { quoteLinkProps } from '../../lib/quote-links'
import { whatsappHref } from '../../lib/whatsapp'
import { Button } from '../ui/Button'
import { VisuallyHidden } from '../ui/VisuallyHidden'
import { FOOTER_NAV_ID, MOBILE_MENU_ID, NAV_MEDIA_QUERY, SCROLLBAR_VAR } from './ids'

// Menu móvel (Partes 3.10 e 5.3), abaixo de 1152 px.
//
// Sem JavaScript: o HTML pré-renderizado tem, no lugar do botão, uma ligação com o mesmo
// aspeto para a navegação do rodapé (#navegacao-rodape), que tem as seis âncoras. Não há
// botão sem função nem painel escondido à espera de JavaScript.
// Com JavaScript: depois de montado, a ligação passa a botão (aria-expanded,
// aria-controls) e o painel é acrescentado, fechado (`hidden`). Aberto: Esc fecha e
// devolve o foco ao botão; escolher uma ligação fecha; o Tab circula entre o botão e o
// painel (o wrapper [data-mobile-menu] contém os dois); o scroll da página fica
// bloqueado, com a largura da barra de scroll compensada; o resto da página fica
// `inert`; <html data-menu-open="true"> esconde a barra de contacto móvel.

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'

const TOGGLE =
  'inline-flex size-11 shrink-0 items-center justify-center rounded-sm text-ink ' +
  'shadow-[inset_0_0_0_1px_var(--color-ink)] transition-colors duration-150 ease-planta hover:bg-surface ' +
  '[&>svg]:pointer-events-none'

// < 768 px: ecrã inteiro abaixo do cabeçalho. ≥ 768 px: painel de 24rem alinhado à margem
// direita do contentor, logo abaixo do cabeçalho. Entrada com @starting-style (sem
// animação com movimento reduzido: a regra global anula as transições).
const PANEL = [
  'fixed inset-x-0 top-[var(--header-h)] bottom-0 z-10 overflow-y-auto overscroll-contain border-t border-line bg-bg',
  'md:left-auto md:right-[calc(1.5rem_+_var(--lmd-sbw,0px))] md:bottom-auto md:mt-2 md:w-[24rem]',
  'md:max-h-[calc(100dvh_-_var(--header-h)_-_1.5rem)] md:rounded-lg md:border md:shadow-dialog',
  'lg:right-[calc(2rem_+_var(--lmd-sbw,0px))]',
  'transition-[opacity,translate] duration-250 ease-planta starting:-translate-y-2 starting:opacity-0',
].join(' ')

const PANEL_LINK =
  'relative flex min-h-14 items-center pl-4 text-lg font-medium text-ink decoration-1 underline-offset-[6px] ' +
  'transition-colors duration-150 ease-planta hover:underline focus-visible:underline'

const PANEL_LINK_ACTIVE =
  'font-semibold before:absolute before:top-1/2 before:left-0 before:h-6 before:w-0.5 before:-translate-y-1/2 before:bg-accent'

const ICON = { size: 20, strokeWidth: 1.5, 'aria-hidden': true, focusable: false } as const

// "Já hidratado?" sem setState num efeito: o React usa o valor do servidor (false) na
// hidratação e volta a renderizar com o do cliente (true) logo depois.
const subscribeNothing = () => () => {}
const clientSnapshot = () => true
const serverSnapshot = () => false

interface MobileMenuProps {
  /** Secção atual (scrollspy do cabeçalho), marcada com aria-current="location". */
  activeAnchor: AnchorId | null
  /** Classes do wrapper (o cabeçalho passa `nav:hidden`). */
  className?: string
}

export function MobileMenu({ activeAnchor, className }: MobileMenuProps) {
  const page = useCurrentPage()
  // Falso no HTML pré-renderizado e no render de hidratação; verdadeiro logo a seguir.
  const mounted = useSyncExternalStore(subscribeNothing, clientSnapshot, serverSnapshot)
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const html = document.documentElement
    const body = document.body
    const panel = panelRef.current
    const toggle = toggleRef.current

    // Bloqueio do scroll sem saltos: compensa a largura da barra de scroll.
    const scrollbar = window.innerWidth - html.clientWidth
    const previous = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPadding: body.style.paddingRight,
    }
    if (scrollbar > 0) {
      const padding = Number.parseFloat(getComputedStyle(body).paddingRight) || 0
      body.style.paddingRight = `${padding + scrollbar}px`
      html.style.setProperty(SCROLLBAR_VAR, `${scrollbar}px`)
    }
    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    html.dataset.menuOpen = 'true'

    // O conteúdo por trás do painel deixa de receber foco e leitura.
    const background = [document.getElementById('conteudo'), document.querySelector('[data-site-footer]')].filter(
      (el): el is HTMLElement => el instanceof HTMLElement,
    )
    for (const el of background) el.inert = true

    const close = (restoreFocus: boolean) => {
      setOpen(false)
      if (restoreFocus) toggle?.focus()
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close(true)
        return
      }
      if (event.key !== 'Tab' || !panel || !toggle) return
      const items = [toggle, ...panel.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (el) => el.getClientRects().length > 0,
      )
      const first = items[0]
      const last = items.at(-1)
      if (!first || !last) return
      const activeEl = document.activeElement
      if (!(activeEl instanceof HTMLElement) || !items.includes(activeEl)) {
        event.preventDefault()
        ;(event.shiftKey ? last : first).focus()
      } else if (event.shiftKey && activeEl === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && activeEl === last) {
        event.preventDefault()
        first.focus()
      }
    }

    // Clique fora do painel e do botão (fundo escurecido, logótipo, "Pedir orçamento").
    const onDocumentClick = (event: Event) => {
      const target = event.target
      if (!(target instanceof Node)) return
      // O clique que abriu o menu troca o ícone do botão: o alvo original já não está no
      // documento e não pode contar como "clique fora".
      if (!target.isConnected) return
      if (panel?.contains(target) || toggle?.contains(target)) return
      close(false)
    }

    // Janela alargada até à navegação completa: o botão desaparece, o menu fecha.
    const media = window.matchMedia(NAV_MEDIA_QUERY)
    const onMedia = () => {
      if (media.matches) close(false)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('click', onDocumentClick)
    media.addEventListener('change', onMedia)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('click', onDocumentClick)
      media.removeEventListener('change', onMedia)
      html.style.overflow = previous.htmlOverflow
      body.style.overflow = previous.bodyOverflow
      body.style.paddingRight = previous.bodyPadding
      html.style.removeProperty(SCROLLBAR_VAR)
      delete html.dataset.menuOpen
      for (const el of background) el.inert = false
    }
  }, [open])

  // Escolher uma ligação fecha o menu. Nas âncoras da própria página o foco segue a
  // navegação; nas restantes (telefone, WhatsApp) volta ao botão.
  const onLinkClick = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    const link = event.currentTarget
    const inPage = link.hash !== '' && link.pathname === window.location.pathname
    setOpen(false)
    if (!inPage) toggleRef.current?.focus()
  }

  return (
    <div data-mobile-menu="" className={['contents', className].filter(Boolean).join(' ')}>
      {mounted ? (
        <button
          ref={toggleRef}
          type="button"
          aria-expanded={open}
          aria-controls={MOBILE_MENU_ID}
          onClick={() => setOpen((value) => !value)}
          className={TOGGLE}
        >
          {open ? <X {...ICON} size={24} /> : <Menu {...ICON} size={24} />}
          <VisuallyHidden>{open ? ui.a11y.closeMenu : ui.a11y.openMenu}</VisuallyHidden>
        </button>
      ) : (
        <a href={`#${FOOTER_NAV_ID}`} className={TOGGLE}>
          <Menu {...ICON} size={24} />
          <VisuallyHidden>{navigation.mobileMenuTitle}</VisuallyHidden>
        </a>
      )}

      {mounted && open ? (
        <div
          aria-hidden="true"
          className="fixed inset-x-0 top-[var(--header-h)] bottom-0 hidden bg-ink/25 md:block"
        />
      ) : null}

      {mounted ? (
        <div id={MOBILE_MENU_ID} ref={panelRef} data-mobile-menu-panel="" hidden={!open} className={PANEL}>
          <div className="flex flex-col gap-8 px-4 pt-2 pb-[calc(2rem_+_env(safe-area-inset-bottom,0px))] sm:px-6 md:pt-3 md:pb-6">
            <nav aria-label={navigation.ariaLabel}>
              <ul className="divide-y divide-line">
                {navigation.items.map((item) => {
                  const current = activeAnchor === item.anchor
                  return (
                    <li key={item.anchor}>
                      <a
                        href={anchorHref(item.anchor, page)}
                        aria-current={current ? 'location' : undefined}
                        onClick={onLinkClick}
                        className={[PANEL_LINK, current ? PANEL_LINK_ACTIVE : ''].join(' ')}
                      >
                        {item.label}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </nav>

            <ul className="flex flex-col gap-3">
              <li>
                <Button
                  href={anchorHref('contactos', page)}
                  size="lg"
                  block
                  onClick={onLinkClick}
                  {...quoteLinkProps}
                >
                  {ui.labels.requestQuote}
                </Button>
              </li>
              <li>
                <Button
                  variant="secondary"
                  size="lg"
                  block
                  href={company.phone.href}
                  icon={<Phone {...ICON} />}
                  aria-describedby={`${MOBILE_MENU_ID}-telefone`}
                  onClick={onLinkClick}
                >
                  {ui.labels.callPhone}
                </Button>
                <p id={`${MOBILE_MENU_ID}-telefone`} className="mt-2 text-center text-small text-muted">
                  <span className="tabular whitespace-nowrap">{company.phone.display}</span> ({company.phoneCallNote})
                </p>
              </li>
              <li>
                <Button
                  variant="secondary"
                  size="lg"
                  block
                  href={whatsappHref()}
                  icon={<MessageCircle {...ICON} />}
                  onClick={onLinkClick}
                >
                  {ui.labels.whatsapp}
                </Button>
              </li>
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  )
}
