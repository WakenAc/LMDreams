import { useRef, useState, type MouseEvent } from 'react'
import { ui } from '../content/common'
import { projects, projectsSection } from '../content/projects'
import type { Project, ProjectCategory } from '../content/tipos'
import { BeforeAfter, BeforeAfterStatic, PhotoImage, PhotoPlaceholder } from '../components/ui/BeforeAfter'
import { Button, buttonClassName } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { Dialog } from '../components/ui/Dialog'
import { FilterChips, type FilterChipOption } from '../components/ui/FilterChips'
import { PLACEHOLDER_LABEL } from '../components/ui/Placeholder'
import type { PlaceholderVariant } from '../components/ui/PlaceholderArt'
import { PlainText } from '../components/ui/RichText'
import { Section } from '../components/ui/Section'
import { SectionHeading } from '../components/ui/SectionHeading'
import { useHydrated } from '../lib/hydrated'

// Projetos (Parte 5.4 §7): filtros por categoria com aria-pressed e anúncio do número de
// resultados, cartões com capa (placeholder gerado em código enquanto não houver
// fotografia autorizada) e detalhe num <dialog> nativo com a galeria antes e depois.
// Sem JavaScript: todos os projetos visíveis, com a descrição e os campos no cartão; as
// fotografias antes e depois, quando existem, ficam no próprio cartão num <details> em
// HTML estático (Parte 1.4, regra 10). Os filtros e o botão do detalhe não têm função sem
// JavaScript: ficam desativados e escondidos por <noscript> (index.html). Com JavaScript,
// até à hidratação, ficam invisíveis mas a ocupar o lugar (visibility: hidden, também no
// index.html), sem saltos de layout e fora da árvore de acessibilidade. O diálogo só
// existe no cliente.

const ALL = 'todos'
type Filter = typeof ALL | ProjectCategory

const PROJECTS: readonly Project[] = projects
const CATEGORY_IDS = Object.keys(projectsSection.categories) as ProjectCategory[]
const FILTERS: readonly FilterChipOption<Filter>[] = [
  { value: ALL, label: projectsSection.allLabel },
  ...CATEGORY_IDS.map((id) => ({ value: id, label: projectsSection.categories[id] })),
]

/** Desenho da capa em falta, pela categoria (o mesmo assunto dos Serviços). */
const COVER_VARIANT: Record<ProjectCategory, PlaceholderVariant> = {
  remodelacoes: 'planta',
  cozinhas: 'cozinha',
  'casas-de-banho': 'casa-de-banho',
  interiores: 'pavimento',
  exteriores: 'exterior',
  construcao: 'estrutura',
  recuperacao: 'fachada',
}

function resultsText(n: number): string {
  const { zero, one, other } = projectsSection.results
  let template = other
  if (n === 0) template = zero
  else if (n === 1) template = one
  return template.replace('{n}', String(n))
}

/** Resumo do <details> sem JavaScript: o mesmo aspeto do botão secundário. */
const GALLERY_SUMMARY = buttonClassName({
  variant: 'secondary',
  className: 'w-full cursor-pointer list-none sm:w-auto [&::-webkit-details-marker]:hidden',
})

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

/** Cartões que ocupam duas colunas: com 2 colunas (sm) e com 3 colunas (lg). */
interface CardSpan {
  sm: boolean
  lg: boolean
}

/**
 * Grelha sem cartão sozinho na última linha, calculada sobre os resultados visíveis (os
 * filtros mudam o número). Com 3 colunas (a partir de 1024 px): se sobrar um cartão, o
 * primeiro e o último ocupam duas colunas (7 = 2+1, 3, 1+2); se sobrarem dois, só o
 * primeiro (5 = 2+1, 3). Com 2 colunas (640 a 1023 px), com um número ímpar, o último
 * ocupa a linha inteira. Com um só cartão, nada muda.
 */
function cardSpan(index: number, total: number): CardSpan {
  if (total < 2) return { sm: false, lg: false }
  const last = index === total - 1
  const rest = total % 3
  return {
    sm: total % 2 === 1 && last,
    lg: (rest === 2 && index === 0) || (rest === 1 && (index === 0 || last)),
  }
}

// A capa de um cartão largo tem a altura das outras da mesma linha (4:3 de uma coluna, sem
// a borda de 1 px de cada lado), calculada sobre a largura da grelha (100cqw; a <ul> é o
// contentor). Intervalo entre colunas: gap-6 (1,5rem). Cada largura tem uma só regra de
// proporção por elemento (sem classes em conflito na mesma largura).
const COVER = 'relative aspect-[16/9] overflow-hidden bg-sand'
const COVER_SM = 'sm:aspect-[4/3]'
const COVER_WIDE_SM = 'sm:aspect-auto sm:h-[calc((100cqw_-_1.5rem)*3/8_-_1.5px)]'
const COVER_WIDE_LG = 'lg:aspect-auto lg:h-[calc((100cqw_-_3rem)/4_-_1.5px)]'
const COVER_NARROW_LG = 'lg:aspect-[4/3] lg:h-auto'

function coverClassName(span: CardSpan): string {
  let lg = ''
  if (span.lg) lg = COVER_WIDE_LG
  else if (span.sm) lg = COVER_NARROW_LG
  return [COVER, span.sm ? COVER_WIDE_SM : COVER_SM, lg].filter(Boolean).join(' ')
}

function cardSpanClassName(span: CardSpan): string {
  let lg = ''
  if (span.lg) lg = 'lg:col-span-2'
  else if (span.sm) lg = 'lg:col-span-1'
  return [span.sm ? 'sm:col-span-2' : '', lg].filter(Boolean).join(' ')
}

interface ProjectCardProps {
  project: Project
  span: CardSpan
  interactive: boolean
  onOpen: (project: Project, event: MouseEvent<HTMLButtonElement>) => void
}

function ProjectCard({ project: p, span, interactive, onOpen }: ProjectCardProps) {
  const nameId = `${p.id}-nome`
  // Sem JavaScript (e até à hidratação), as fotografias antes e depois ficam no cartão.
  const staticGallery = !interactive && p.antes.length + p.depois.length > 0
  const zoom = 'transition-transform duration-200 ease-planta motion-safe:group-hover:scale-[1.02]'
  return (
    <Card
      as="li"
      variant="project"
      className={[p.placeholder ? 'border-dashed border-muted!' : '', cardSpanClassName(span)].filter(Boolean).join(' ')}
      data={{ 'data-project': p.id, 'data-placeholder': String(p.placeholder) }}
    >
      <div className={coverClassName(span)}>
        {p.capa ? (
          <PhotoImage photo={p.capa} className={`h-full w-full object-cover ${zoom}`} />
        ) : (
          <PhotoPlaceholder variant={COVER_VARIANT[p.categoria]} className="h-full w-full" artClassName={zoom} />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-5 p-5 sm:p-6">
        <div className="flex flex-col gap-2">
          <h3 id={nameId} className="text-h3 text-ink">
            <PlainText text={p.nome} />
          </h3>
          <p className="order-first flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 font-mono text-caption">
            <span className="text-accent">{projectsSection.categories[p.categoria]}</span>
            {p.placeholder ? <span className={PLACEHOLDER_LABEL}>{ui.placeholders.content}</span> : null}
          </p>
        </div>
        <p className="max-w-texto text-small text-muted">
          <PlainText text={p.descricao} />
        </p>
        <dl className="grid gap-3 border-t border-line pt-4 text-small">
          <Field label={projectsSection.fieldLabels.type} value={p.tipoDeIntervencao} />
          <Field label={projectsSection.fieldLabels.locality} value={p.localidade} />
        </dl>
        <div className="mt-auto">
          {staticGallery ? (
            <details data-project-gallery={p.id}>
              <summary className={GALLERY_SUMMARY} aria-describedby={nameId}>
                {ui.labels.beforeAfter}
              </summary>
              <BeforeAfterStatic className="mt-5" before={p.antes} after={p.depois} />
            </details>
          ) : (
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
          )}
        </div>
      </div>
    </Card>
  )
}

function ProjectDetail({ project: p }: { project: Project }) {
  const f = projectsSection.fieldLabels
  return (
    <div className="flex flex-col gap-8">
      <p className="max-w-texto text-body text-ink">
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
          {/* role="list" explícito: o Safari (VoiceOver) tira o papel de lista a <ul> com
              list-style: none. */}
          <ul
            // oxlint-disable-next-line jsx-a11y/no-redundant-roles -- compatibilidade com o VoiceOver no Safari (list-style: none)
            role="list"
            className="@container grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {visible.map((p, i) => (
              <ProjectCard
                key={p.id}
                project={p}
                span={cardSpan(i, visible.length)}
                interactive={hydrated}
                onOpen={openProject}
              />
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
