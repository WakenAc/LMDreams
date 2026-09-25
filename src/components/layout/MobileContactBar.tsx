import { company } from '../../content/company'
import { ui } from '../../content/common'
import { anchorHref } from '../../lib/links'
import { useCurrentPage } from '../../lib/page-context'
import { whatsappHref } from '../../lib/whatsapp'

// Provisório (Fase 2). Versão final: pacote WP1 (safe area, esconde-se com o menu
// aberto e quando a secção de contactos está visível).
export function MobileContactBar() {
  const page = useCurrentPage()
  return (
    <nav
      aria-label={ui.a11y.mobileContactBar}
      className="fixed inset-x-0 bottom-0 z-40 grid h-[var(--mobile-bar-h)] grid-cols-3 border-t border-line bg-bg pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <a href={company.phone.href} aria-label={ui.a11y.callCompany} className="flex items-center justify-center">
        {ui.labels.callShort}
      </a>
      <a href={whatsappHref()} target="_blank" rel="noopener" aria-label={`${ui.a11y.whatsappCompany} ${ui.a11y.newWindow}`} className="flex items-center justify-center">
        {ui.labels.whatsappShort}
      </a>
      <a href={anchorHref('contactos', page)} className="flex items-center justify-center bg-accent text-white">
        {ui.labels.requestQuote}
      </a>
    </nav>
  )
}
