import { ArrowUp } from 'lucide-react'
import { company } from '../content/company'
import type { LegalBlock, LegalPageContent, LegalSection } from '../content/tipos'
import { SiteLayout } from '../components/layout/SiteLayout'
import { Container } from '../components/ui/Container'
import { PlainText, RichText } from '../components/ui/RichText'
import { headingId } from '../components/ui/Section'

// Páginas legais (Partes 5.4 e 5.6): um só H1, índice no topo, secções com H2 e âncora,
// data de atualização com placeholder realçado. Tipografia de leitura (17 px, 65 caracteres).
//
// Grelha: em computador, o documento ocupa as colunas 3 a 10 da grelha de 12; dentro dele,
// uma grelha de 8 colunas põe os números das secções na primeira (margem da planta) e o
// texto nas restantes. Em tablet a mesma grelha de 8 ocupa o contentor todo; em telemóvel
// o número fica à esquerda do título e o texto usa a largura toda.

const TITLE_ID = 'documento-titulo'
const TOC_ID = 'indice'
const TOC_TITLE_ID = headingId(TOC_ID)

/** Número de ordem com dois algarismos, igual no índice e nos títulos ("01"). */
function ordinal(index: number): string {
  return String(index + 1).padStart(2, '0')
}

// Ligações dentro do texto: sublinhadas, com hover em accent-hover (7,08:1 sobre bg).
const TEXT_LINK =
  'underline decoration-1 underline-offset-[3px] transition-colors duration-150 ease-planta ' +
  'hover:text-accent-hover hover:decoration-2 focus-visible:decoration-2'

// Ligações de navegação (índice, voltar ao índice): sublinhado só em hover e foco.
const NAV_LINK =
  'text-ink underline-offset-4 decoration-1 transition-colors duration-150 ease-planta ' +
  'hover:text-accent-hover hover:underline focus-visible:underline'

/** Cota fina sob o título: mede a coluna do documento, com traços a 45° em latão, sem números. */
function TitleCota() {
  return (
    <div aria-hidden="true" className="relative mt-6 h-[11px] w-full md:mt-8">
      <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-cota" />
      <span className="absolute top-0 left-0 h-full w-px bg-cota" />
      <span className="absolute top-0 right-0 h-full w-px bg-cota" />
      <span className="absolute top-1/2 left-0 h-[1.5px] w-[13px] -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-accent" />
      <span className="absolute top-1/2 right-0 h-[1.5px] w-[13px] translate-x-1/2 -translate-y-1/2 -rotate-45 bg-accent" />
    </div>
  )
}

function Block({ block }: { block: LegalBlock }) {
  if (block.type === 'p') {
    return (
      <p>
        <RichText value={block.text} linkClassName={TEXT_LINK} />
      </p>
    )
  }
  return (
    <ul className="grid list-disc gap-2 pl-5 marker:text-muted">
      {block.items.map((item, j) => (
        <li key={j} className="pl-1">
          <RichText value={item} linkClassName={TEXT_LINK} />
        </li>
      ))}
    </ul>
  )
}

function DocumentSection({ section, index }: { section: LegalSection; index: number }) {
  return (
    <section
      id={section.id}
      aria-labelledby={headingId(section.id)}
      data-reveal=""
      className="mt-10 border-t border-line pt-8 md:mt-12 md:grid md:grid-cols-8 md:gap-x-6 md:pt-10"
    >
      <h2
        id={headingId(section.id)}
        className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-3 text-h3 text-ink md:col-span-8 md:grid-cols-8 md:gap-x-6"
      >
        <span aria-hidden="true" className="font-mono text-step font-medium tracking-[0.02em] text-accent tabular md:col-span-1">
          {ordinal(index)}
        </span>
        <span className="md:col-span-7">{section.heading}</span>
      </h2>
      <div className="mt-4 max-w-prose space-y-4 text-[1.0625rem] leading-[1.7] break-words text-ink md:col-span-7 md:col-start-2 md:mt-5">
        {section.blocks.map((block, j) => (
          <Block key={j} block={block} />
        ))}
      </div>
    </section>
  )
}

export function LegalDocument({ content }: { content: LegalPageContent }) {
  return (
    <SiteLayout>
      <article
        aria-labelledby={TITLE_ID}
        className="pt-[calc(var(--header-h)+clamp(2.5rem,6vw,5rem))] pb-[clamp(4rem,8vw,8rem)]"
      >
        <Container>
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-6">
            <div className="lg:col-span-8 lg:col-start-3">
              {/* Bloco do título (carimbo): H1, cota, data de atualização e introdução. */}
              <div data-reveal="">
                <h1 id={TITLE_ID} className="text-h1 text-ink">
                  {content.title}
                </h1>
                <TitleCota />
                <p className="mt-5 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-small text-muted">
                  <span className="font-mono text-eyebrow font-medium uppercase">{content.updatedLabel}</span>
                  <span>
                    <PlainText text={company.legal.policiesUpdatedAt} />
                  </span>
                </p>
                {content.intro ? (
                  <p className="mt-6 max-w-prose text-[1.0625rem] leading-[1.6] break-words text-muted md:text-lead">
                    <RichText value={content.intro} linkClassName={TEXT_LINK} />
                  </p>
                ) : null}
              </div>

              {/* Índice no topo: lista ordenada de ligações para as secções. */}
              <nav
                id={TOC_ID}
                aria-labelledby={TOC_TITLE_ID}
                className="mt-10 border-t border-line pt-6 md:mt-14 md:grid md:grid-cols-8 md:gap-x-6 md:pt-8"
              >
                <h2
                  id={TOC_TITLE_ID}
                  className="font-mono text-eyebrow font-medium text-muted uppercase md:col-span-1 md:py-2.5 md:leading-6"
                >
                  {content.tocHeading}
                </h2>
                <ol className="mt-2 md:col-span-7 md:mt-0 md:columns-2 md:gap-x-8">
                  {content.sections.map((section, i) => (
                    <li
                      key={section.id}
                      className="grid break-inside-avoid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-3"
                    >
                      <span aria-hidden="true" className="font-mono text-small font-medium text-muted tabular">
                        {ordinal(i)}
                      </span>
                      <a href={`#${section.id}`} className={`block justify-self-start py-2.5 text-base leading-6 ${NAV_LINK}`}>
                        {section.heading}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>

              {content.sections.map((section, i) => (
                <DocumentSection key={section.id} section={section} index={i} />
              ))}

              {/* Regresso ao índice no fim do documento (sem JavaScript: âncora normal). */}
              <div className="mt-10 border-t border-line pt-4 md:mt-12 md:grid md:grid-cols-8 md:gap-x-6">
                <a
                  href={`#${TOC_ID}`}
                  className={`inline-flex min-h-11 items-center gap-2 text-small font-medium md:col-span-7 md:col-start-2 md:justify-self-start ${NAV_LINK}`}
                >
                  <ArrowUp size={20} strokeWidth={1.5} aria-hidden="true" focusable="false" className="shrink-0" />
                  <span>{content.backToIndex}</span>
                </a>
              </div>
            </div>
          </div>
        </Container>
      </article>
    </SiteLayout>
  )
}
