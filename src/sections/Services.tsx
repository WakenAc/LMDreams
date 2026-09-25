import { ui } from '../content/common'
import { services, servicesSection } from '../content/services'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { Icon } from '../components/ui/Icon'
import { Picture } from '../components/ui/Picture'
import { Section } from '../components/ui/Section'
import { SectionHeading } from '../components/ui/SectionHeading'

// Provisório (Fase 2). Versão final: pacote WP5.
export function Services() {
  const featured = services.filter((s) => 'imageId' in s && s.imageId)
  const others = services.filter((s) => !('imageId' in s && s.imageId))
  return (
    <Section id="servicos">
      <Container>
        <SectionHeading sectionId="servicos" title={servicesSection.heading} intro={servicesSection.intro} />
        <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((s) => (
            <Card key={s.id} as="li" variant="service">
              {'imageId' in s && s.imageId ? <Picture id={s.imageId} frameClassName="aspect-[4/3]" /> : null}
              <h3 className="text-h3">{s.name}</h3>
              <p className="text-muted">{s.description}</p>
            </Card>
          ))}
        </ul>
        <h3 className="mt-16 text-h3">{servicesSection.othersHeading}</h3>
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {others.map((s) => (
            <li key={s.id} className="flex gap-4 border-t border-line pt-4">
              <Icon name={s.icon} className="text-muted" />
              <div>
                <p className={'emphasis' in s && s.emphasis ? 'font-semibold' : 'font-medium'}>{s.name}</p>
                <p className="text-small text-muted">{s.description}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-10 max-w-prose">{servicesSection.visitorNote}</p>
        <Button href="#contactos" className="mt-6">
          {ui.labels.requestQuote}
        </Button>
      </Container>
    </Section>
  )
}
