import { ui } from '../content/common'
import { testimonials, testimonialsSection } from '../content/testimonials'
import { Container } from '../components/ui/Container'
import { PlaceholderBox } from '../components/ui/Placeholder'
import { PlainText } from '../components/ui/RichText'
import { Section } from '../components/ui/Section'
import { SectionHeading } from '../components/ui/SectionHeading'

// Provisório (Fase 2). Versão final: pacote WP7.
export function Testimonials() {
  return (
    <Section id="testemunhos" tone="surface">
      <Container>
        <SectionHeading
          sectionId="testemunhos"
          title={testimonialsSection.heading}
          intro={
            testimonials.every((t) => t.placeholder)
              ? testimonialsSection.introPlaceholder
              : testimonialsSection.introReal
          }
        />
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <li key={t.id}>
              <PlaceholderBox label={ui.placeholders.content}>
                <p>
                  <PlainText text={t.texto} />
                </p>
              </PlaceholderBox>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
