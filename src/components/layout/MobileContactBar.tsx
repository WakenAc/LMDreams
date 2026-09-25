import { useEffect, useState } from 'react'
import { company } from '../../content/company'
import { ui } from '../../content/common'
import { anchorHref } from '../../lib/links'
import { useCurrentPage } from '../../lib/page-context'
import { quoteLinkProps } from '../../lib/quote-links'
import { whatsappHref } from '../../lib/whatsapp'
import { Button } from '../ui/Button'

// Barra de contacto móvel (< 768 px; Partes 3.10 e 5.3). Fixa em baixo, 61 px + safe
// area (var(--mobile-bar-h), o mesmo valor do padding-bottom do body, para o rodapé
// nunca ficar tapado). Formas curtas "Ligar" e "WhatsApp" só aqui (Parte 1.4, regra 12),
// com nomes acessíveis que começam pelo texto visível.
// Esconde-se (visibility: hidden, fora do Tab e da árvore de acessibilidade) com o menu
// aberto (html[data-menu-open]) e enquanto a secção #contactos estiver visível.
// Sem JavaScript fica sempre visível.
//
// Larguras: as três ligações ocupam a sua largura natural e repartem o espaço que
// sobra (flex-auto). A 320 px: cerca de 48 + 83 + 125 px (padding de 8 px) em 272 px
// úteis; com fontes mais largas, "Pedir orçamento" quebra em duas linhas dentro dos 44 px.

const ITEM = 'w-full max-md:px-2 max-md:text-[0.875rem]'

export function MobileContactBar() {
  const page = useCurrentPage()
  const [contactsVisible, setContactsVisible] = useState(false)

  useEffect(() => {
    const contacts = document.getElementById('contactos')
    if (!contacts || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries.at(-1)
        if (entry) setContactsVisible(entry.isIntersecting)
      },
      { threshold: 0 },
    )
    observer.observe(contacts)
    return () => observer.disconnect()
  }, [])

  return (
    <nav
      aria-label={ui.a11y.mobileContactBar}
      data-mobile-contact-bar=""
      data-hidden={contactsVisible ? '' : undefined}
      className={[
        'fixed inset-x-0 bottom-0 z-40 h-[var(--mobile-bar-h)] border-t border-line bg-bg pb-[env(safe-area-inset-bottom,0px)] md:hidden',
        'transition-[translate,visibility] duration-250 ease-planta',
        '[html[data-menu-open]_&]:invisible [html[data-menu-open]_&]:translate-y-full',
        contactsVisible ? 'invisible translate-y-full' : '',
      ].join(' ')}
    >
      <ul className="flex h-full items-center gap-2 px-4">
        <li className="flex flex-auto">
          <Button variant="secondary" href={company.phone.href} aria-label={ui.a11y.callCompany} className={ITEM}>
            {ui.labels.callShort}
          </Button>
        </li>
        <li className="flex flex-auto">
          <Button
            variant="secondary"
            href={whatsappHref()}
            aria-label={`${ui.a11y.whatsappCompany} ${ui.a11y.newWindow}`}
            className={ITEM}
          >
            {ui.labels.whatsappShort}
          </Button>
        </li>
        <li className="flex flex-auto">
          <Button href={anchorHref('contactos', page)} className={ITEM} {...quoteLinkProps}>
            {ui.labels.requestQuote}
          </Button>
        </li>
      </ul>
    </nav>
  )
}
