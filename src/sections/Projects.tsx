import { useRef, useState, useSyncExternalStore, type MouseEvent } from 'react'
import { ui } from '../content/common'
import { projects, projectsSection } from '../content/projects'
import type { Project, ProjectCategory } from '../content/tipos'
import { BeforeAfter, PhotoImage, PhotoPlaceholder } from '../components/ui/BeforeAfter'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { Dialog } from '../components/ui/Dialog'
import { FilterChips, type FilterChipOption } from '../components/ui/FilterChips'
import { PlainText } from '../components/ui/RichText'
import { Section } from '../components/ui/Section'
import { SectionHeading } from '../components/ui/SectionHeading'

// Projetos (Parte 5.4 §7): filtros por categoria com aria-pressed e anúncio do número de
// resultados, cartões com capa (placeholder gerado em código enquanto não houver
// fotografia autorizada) e detalhe num <dialog> nativo com a galeria antes e depois.
// Sem JavaScript: todos os projetos visíveis, com a descrição e os campos no cartão;
// os filtros e o botão do detalhe ficam desativados. O diálogo só existe no cliente.

const ALL = 'todos'
type Filter = typeof ALL | ProjectCategory

const PROJECTS: readonly Project[] = projects
const CATEGORY_IDS = Object.keys(projectsSection.categories) as ProjectCategory[]
const FILTERS: readonly FilterChipOption<Filter>[] = [
  { value: ALL, label: projectsSection.allLabel },
  ...CATEGORY_IDS.map((id) => ({ value: id, label: projectsSection.categories[id] })),
]

function resultsText(n: number): string {
  const { zero, one, other } = projectsSection.results
  let template = other
  if (n === 0) template = zero
  else if (n === 1) template = one
  return template.replace('{n}', String(n))
}

const subscribeNothing = () => () => {}

/** Falso no HTML pré-renderizado e durante a hidratação; verdadeiro depois (sem mismatch). */
function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false,
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-0.5">
      <dt className="font-mono text-caption text-muted">{label}</dt>
      <dd className="text-ink">
        <PlainText text={value} />
      </dd>
    </div>
  )
}

interface ProjectCardProps {
  project: Project
  interactive: boolean
  onOpen: (project: Project, event: MouseEvent<HTMLButtonElement>) => void
}

function ProjectCard({ project: p, interactive, onOpen }: ProjectCardProps) {
  const nameId = `${p.id}-nome`
  const zoom = 'transition-transform duration-200 ease-planta motion-safe:group-hover:scale-[1.02]'
  return (
    <Card
      as="li"
      variant="project"
      className={p.placeholder ? 'border-dashed border-muted!' : undefined}
      data={{ 'data-project': p.id, 'data-placeholder': String(p.placeholder) }}
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-sand sm:aspect-[4/3]">
        {p.capa ? (
          <PhotoImage photo={p.capa} className={`h-full w-full object-cover ${zoom}`} />
        ) : (
          <PhotoPlaceholder drawing="plan" className="h-full w-full" artClassName={zoom} />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-5 p-5 sm:p-6">
        <div className="flex flex-col gap-2">
          <h3 id={nameId} className="text-h3 text-ink">
            <PlainText text={p.nome} />
          </h3>
          <p className="order-first flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 font-mono text-caption">
            <span className="text-accent">{projectsSection.categories[p.categoria]}</span>
            {p.placeholder ? <span className="text-muted">{ui.placeholders.content}</span> : null}
          </p>
        </div>
        <p className="max-w-prose text-small text-muted">
          <PlainText text={p.descricao} />
        </p>
        <dl className="grid gap-3 border-t border-line pt-4 text-small">
          <Field label={projectsSection.fieldLabels.type} value={p.tipoDeIntervencao} />
          <Field label={projectsSection.fieldLabels.locality} value={p.localidade} />
        </dl>
        <div className="mt-auto">
          <Button
            variant="secondary"
            className="w-full sm:w-auto"
            disabled={!interactive}
            aria-haspopup="dialog"
            aria-describedby={nameId}
            data-project-open={p.id}
            onClick={(event) => onOpen(p, event)}
          >
            {ui.labels.beforeAfter}
          </Button>
        </div>
      </div>
    </Card>
  )
}

function ProjectDetail({ project: p }: { project: Project }) {
  const f = projectsSection.fieldLabels
  return (
    <div className="flex flex-col gap-8">
      <p className="max-w-prose text-body text-ink">
        <PlainText text={p.descricao} />
      </p>
      <dl className="grid gap-4 border-y border-line py-5 text-small sm:grid-cols-3">
        <Field label={f.category} value={projectsSection.categories[p.categoria]} />
        <Field label={f.type} value={p.tipoDeIntervencao} />
        <Field label={f.locality} value={p.localidade} />
      </dl>
      <div>
        <h3 className="text-h3 text-ink">{projectsSection.dialog.galleryHeading}</h3>
        <BeforeAfter className="mt-5" before={p.antes} after={p.depois} />
      </div>
    </div>
  )
}

export function Projects() {
  const hydrated = useHydrated()
  const [filter, setFilter] = useState<Filter>(ALL)
  // Muda a cada escolha: o texto do anúncio é substituído e volta a ser lido, mesmo
  // quando o número de resultados é igual ao anterior.
  const [announceKey, setAnnounceKey] = useState(0)
  const [current, setCurrent] = useState<Project | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const openerRef = useRef<HTMLElement | null>(null)

  const allPlaceholder = PROJECTS.every((p) => p.placeholder)
  const visible = PROJECTS.filter((p) => filter === ALL || p.categoria === filter)

  function selectFilter(value: Filter) {
    setFilter(value)
    setAnnounceKey((k) => k + 1)
  }

  function openProject(project: Project, event: MouseEvent<HTMLButtonElement>) {
    openerRef.current = event.currentTarget
    setCurrent(project)
    setDialogOpen(true)
  }

  return (
    <Section id="projetos">
      <Container>
        <div data-reveal="">
          <SectionHeading
            sectionId="projetos"
            title={projectsSection.heading}
            intro={allPlaceholder ? projectsSection.introPlaceholder : projectsSection.introReal}
          />
          <div className="mt-10 flex flex-col gap-4 border-t border-line pt-6 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
            <FilterChips
              label={projectsSection.filtersLabel}
              options={FILTERS}
              value={filter}
              onChange={selectFilter}
              disabled={!hydrated}
            />
            <p
              aria-live="polite"
              aria-atomic="true"
              data-project-results=""
              className="min-h-[1.5em] shrink-0 text-small text-muted lg:pt-3 lg:text-right"
            >
              <span key={announceKey}>{resultsText(visible.length)}</span>
            </p>
          </div>
        </div>
        <div data-reveal="" className="mt-8">
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((p) => (
              <ProjectCard key={p.id} project={p} interactive={hydrated} onOpen={openProject} />
            ))}
          </ul>
        </div>
      </Container>
      {current ? (
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          title={<PlainText text={current.nome} />}
          returnFocusRef={openerRef}
          data={{ 'data-project-dialog': current.id }}
        >
          <ProjectDetail key={current.id} project={current} />
        </Dialog>
      ) : null}
    </Section>
  )
}
