import { company } from '../../content/company'
import { ui } from '../../content/common'
import { footer } from '../../content/footer'
import { pageHref } from '../../lib/links'
import { RichText } from '../ui/RichText'
import { VisuallyHidden } from '../ui/VisuallyHidden'
import { LegalInfo } from './LegalInfo'

// Provisório (Fase 2). Versão final: pacote WP1 (Anexo A §12 e Parte 5.6).
export function Footer() {
  return (
    <footer className="bg-dark text-on-dark">
      <div className="container-site section-y grid gap-8">
        <p className="max-w-prose text-muted-on-dark">{footer.description}</p>
        <p>
          <a href={company.phone.href}>{company.phone.display}</a> ({company.phoneCallNote})
        </p>
        <ul className="flex flex-wrap gap-4">
          <li><a href={pageHref('privacy')}>{footer.policyLinks.privacy}</a></li>
          <li><a href={pageHref('cookies')}>{footer.policyLinks.cookies}</a></li>
          <li><a href={pageHref('terms')}>{footer.policyLinks.terms}</a></li>
        </ul>
        <p>
          <a href={ui.complaintsBook.url} target="_blank" rel="noopener">
            {ui.complaintsBook.label}
            <VisuallyHidden> {ui.a11y.newWindow}</VisuallyHidden>
          </a>
        </p>
        <LegalInfo />
        <p data-ral="" className="text-small text-muted-on-dark">
          <RichText value={footer.ral} onDark />
        </p>
        {company.showIllustrativeImagesNotice ? (
          <p data-ai-notice="" className="text-small text-muted-on-dark">{footer.aiNotice}</p>
        ) : null}
        <p className="text-small text-muted-on-dark">{footer.copyright.replace('{ano}', __BUILD_YEAR__)}</p>
      </div>
    </footer>
  )
}
