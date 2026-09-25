import { ui } from '../content/common'
import { hero } from '../content/hero'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { Picture } from '../components/ui/Picture'
import { headingId, Section } from '../components/ui/Section'

// Provisório (Fase 2). Versão final: pacote WP2 (Parte 5.3, hero no primeiro ecrã).
export function Hero() {
  return (
    <Section id="inicio" flush className="pt-[calc(var(--header-h)+2rem)] pb-12">
      <Container className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="font-mono text-eyebrow uppercase text-muted">{hero.eyebrow}</p>
          <h1 id={headingId('inicio')} className="mt-4 text-display">
            {hero.titleLines[0]} {hero.titleLines[1]}
          </h1>
          <p className="mt-6 max-w-prose text-lead text-muted">{hero.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="#contactos" size="lg">
              {ui.labels.requestQuote}
            </Button>
            <Button href="#servicos" size="lg" variant="secondary">
              {ui.labels.exploreServices}
            </Button>
          </div>
          <ul aria-label={hero.trustLabel} className="mt-8 grid gap-2 text-small">
            {hero.trustItems.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-6">
          <Picture id="hero" priority frameClassName="aspect-[4/5] md:aspect-[4/3]" />
        </div>
      </Container>
    </Section>
  )
}
