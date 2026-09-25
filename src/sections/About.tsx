import { about } from '../content/about'
import { Container } from '../components/ui/Container'
import { Picture } from '../components/ui/Picture'
import { RichText } from '../components/ui/RichText'
import { Section } from '../components/ui/Section'
import { SectionHeading } from '../components/ui/SectionHeading'

// Provisório (Fase 2). Versão final: pacote WP3.
export function About() {
  return (
    <Section id="sobre">
      <Container className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Picture id="sobre" />
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <SectionHeading sectionId="sobre" title={about.heading} />
          {about.paragraphs.map((p, i) => (
            <p key={i} className="mt-4 max-w-prose">
              <RichText value={p} />
            </p>
          ))}
          <ul aria-label={about.highlightsLabel} className="mt-6 grid gap-2">
            {about.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  )
}
