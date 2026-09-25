import { differentiators } from '../content/differentiators'
import { Card } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { Icon } from '../components/ui/Icon'
import { Picture } from '../components/ui/Picture'
import { Section } from '../components/ui/Section'
import { SectionHeading } from '../components/ui/SectionHeading'

// Provisório (Fase 2). Versão final: pacote WP4.
export function Differentiators() {
  return (
    <Section id="diferenciacao" tone="dark">
      <Container>
        <SectionHeading
          sectionId="diferenciacao"
          title={differentiators.heading}
          intro={differentiators.intro}
          onDark
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Picture id="diferenciacao" />
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {differentiators.cards.map((c) => (
              <Card key={c.title} as="li" variant="differentiator">
                <Icon name={c.icon} className="text-accent-on-dark" />
                <h3 className="text-h3">{c.title}</h3>
                <p className="text-muted-on-dark">{c.text}</p>
              </Card>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  )
}
