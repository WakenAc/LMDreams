import { company } from '../content/company'
import { ui } from '../content/common'
import { cta } from '../content/cta'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { Picture } from '../components/ui/Picture'
import { RichText } from '../components/ui/RichText'
import { Section } from '../components/ui/Section'
import { SectionHeading } from '../components/ui/SectionHeading'
import { whatsappHref } from '../lib/whatsapp'

// Provisório (Fase 2). Versão final: pacote WP2 (fundo com véu e legenda de IA).
export function CallToAction() {
  return (
    <Section id="pedir-orcamento" tone="dark" className="overflow-hidden">
      <Picture id="cta" fill caption="bottom-right" />
      <div className="absolute inset-0 bg-dark/80" aria-hidden="true" />
      <Container className="relative">
        <SectionHeading sectionId="pedir-orcamento" title={cta.heading} onDark />
        <p className="mt-5 max-w-prose text-lead text-on-dark">
          <RichText value={cta.text} onDark />
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="#contactos" size="lg">
            {ui.labels.requestQuote}
          </Button>
          <Button href={company.phone.href} size="lg" variant="secondary" onDark>
            {ui.labels.callPhone}
          </Button>
          <Button href={whatsappHref()} size="lg" variant="secondary" onDark>
            {ui.labels.whatsapp}
          </Button>
        </div>
      </Container>
    </Section>
  )
}
