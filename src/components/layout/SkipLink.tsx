import { ui } from '../../content/common'

// Provisório (Fase 2). Versão final: pacote WP1.
export function SkipLink() {
  return (
    <a
      href="#conteudo"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-sm focus:bg-ink focus:px-4 focus:py-3 focus:text-on-dark"
    >
      {ui.a11y.skipLink}
    </a>
  )
}
