import { ui } from '../content/common'
import { notFound } from '../content/notFound'
import { SiteLayout } from '../components/layout/SiteLayout'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { pageHref } from '../lib/links'

// Provisório (Fase 2). Versão final: pacote WP8. Funciona em qualquer profundidade de URL
// porque todas as ligações usam caminhos absolutos do base path.
export default function NotFoundPage() {
  return (
    <SiteLayout>
      <section aria-labelledby="nao-encontrada-titulo" className="pt-[calc(var(--header-h)+4rem)] pb-24">
        <Container>
          <h1 id="nao-encontrada-titulo" className="text-h1">
            {notFound.title}
          </h1>
          <p className="mt-4 max-w-prose text-lead text-muted">{notFound.text}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={pageHref('home')} size="lg">
              {ui.labels.backHome}
            </Button>
            <Button href={pageHref('home', 'contactos')} size="lg" variant="secondary">
              {ui.labels.requestQuote}
            </Button>
          </div>
        </Container>
      </section>
    </SiteLayout>
  )
}
