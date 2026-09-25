import { ui } from '../../content/common'
import { navigation } from '../../content/navigation'
import { logo } from '../../lib/brand'
import { anchorHref } from '../../lib/links'
import { useCurrentPage } from '../../lib/page-context'
import { Button } from '../ui/Button'

// Provisório (Fase 2). Versão final: pacote WP1 (cabeçalho fixo, menu móvel,
// "Ligar" entre 768 e 1279 px, telefone a partir de 1280 px, secção atual).
export function Header() {
  const page = useCurrentPage()
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[var(--header-h)] border-b border-line bg-bg">
      <div className="container-site flex h-full items-center justify-between gap-4">
        <a href={anchorHref('inicio', page)} aria-label={navigation.logoLabel} className="flex items-center gap-3">
          <img src={logo.src} srcSet={logo.srcSet} sizes="82px" width={82} height={44} alt="" className="h-8 w-auto rounded-sm md:h-11" />
          <span className="font-display text-lg font-[650] text-dark">LMDreams</span>
        </a>
        <nav aria-label={navigation.ariaLabel} className="hidden nav:block">
          <ul className="flex gap-6 text-[0.9375rem] font-medium">
            {navigation.items.map((item) => (
              <li key={item.anchor}>
                <a href={anchorHref(item.anchor, page)}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <Button href={anchorHref('contactos', page)} size="md">
          {ui.labels.requestQuote}
        </Button>
      </div>
    </header>
  )
}
