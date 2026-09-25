import { projects, projectsSection } from '../content/projects'
import { Card } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { PlainText } from '../components/ui/RichText'
import { Section } from '../components/ui/Section'
import { SectionHeading } from '../components/ui/SectionHeading'

// Provisório (Fase 2). Versão final: pacote WP6 (filtros, diálogo, antes e depois).
export function Projects() {
  const allPlaceholder = projects.every((p) => p.placeholder)
  return (
    <Section id="projetos">
      <Container>
        <SectionHeading
          sectionId="projetos"
          title={projectsSection.heading}
          intro={allPlaceholder ? projectsSection.introPlaceholder : projectsSection.introReal}
        />
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <Card
              key={p.id}
              as="li"
              variant="project"
              data={{ 'data-project': p.id, 'data-placeholder': String(p.placeholder) }}
            >
              <div className="p-5">
                <p className="font-mono text-caption uppercase text-muted">
                  {projectsSection.categories[p.categoria]}
                </p>
                <h3 className="mt-2 text-h3">
                  <PlainText text={p.nome} />
                </h3>
              </div>
            </Card>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
