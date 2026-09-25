import { transparency } from '../content/transparency'
import { Container } from '../components/ui/Container'
import { Picture } from '../components/ui/Picture'
import { RichText } from '../components/ui/RichText'
import { Section } from '../components/ui/Section'
import { SectionHeading } from '../components/ui/SectionHeading'

// Provisório (Fase 2). Versão final: pacote WP3.
export function Transparency() {
  return (
    <Section id="transparencia">
      <Container className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <SectionHeading sectionId="transparencia" title={transparency.heading} intro={transparency.intro} />
          <h3 className="mt-8 text-h3">{transparency.listTitle}</h3>
          <ul className="mt-4 grid gap-2">
            {transparency.items.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
          <p className="mt-6 max-w-prose text-muted">
            <RichText value={transparency.unforeseen} />
          </p>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <Picture id="transparencia" />
        </div>
      </Container>
    </Section>
  )
}
