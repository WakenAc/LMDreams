import { method } from '../content/process'
import { Container } from '../components/ui/Container'
import { Section } from '../components/ui/Section'
import { SectionHeading } from '../components/ui/SectionHeading'

// Provisório (Fase 2). Versão final: pacote WP4 (linha temporal com Steps).
export function Process() {
  return (
    <Section id="metodo" tone="surface">
      <Container>
        <SectionHeading sectionId="metodo" title={method.heading} intro={method.intro} />
        <ol className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {method.steps.map((s) => (
            <li key={s.number}>
              <p className="font-mono text-step text-accent-hover">{s.number}</p>
              <h3 className="mt-3 text-h3">{s.title}</h3>
              <p className="mt-2 text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  )
}
