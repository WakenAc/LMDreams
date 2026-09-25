import { about } from '../content/about'
import { company } from '../content/company'
import { footer } from '../content/footer'
import { Container } from '../components/ui/Container'
import { Picture } from '../components/ui/Picture'
import { PlainText, RichText } from '../components/ui/RichText'
import { Section } from '../components/ui/Section'
import { SectionHeading } from '../components/ui/SectionHeading'

// Sobre a LMDreams (Parte 5.4 §3; direção visual, secção 9).
//
// Computador (>= 1024 px): fotografia 4:5 nas colunas 1 a 5, texto nas colunas 7 a 12. O
// separador de cota fica a meio do espaço entre o hero e o texto e a moldura da fotografia
// atravessa-o (a única sobreposição editorial do site, enxertada da direção B). A sobreposição
// é interna à secção: nada sai da caixa da secção, não há scroll horizontal nem texto tapado.
// Tablet e telemóvel largo (640 a 1023 px, grelha de 8 colunas): separador, texto a toda a
// largura e, por baixo, a fotografia (4 colunas) ao lado dos destaques, alinhados pela base.
// Telemóvel (< 640 px): texto primeiro, fotografia a toda a largura, destaques no fim.

type ClassPart = string | false | null | undefined

function cx(...parts: ClassPart[]): string {
  return parts.filter(Boolean).join(' ')
}

// ---------------------------------------------------------------------------
// Motivos da planta partilhados com a secção Transparência (src/sections/Transparency.tsx).
// Pedido ao orquestrador: mover para src/components/ui/ se outros pacotes os usarem.
// ---------------------------------------------------------------------------

/** Extremidade de uma linha de cota: traço vertical (cota) e traço a 45 graus (latão). */
function CotaEnd({ className }: { className: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="11"
      height="11"
      viewBox="0 0 11 11"
      fill="none"
      className={className}
    >
      <path d="M5.5 0V11" className="stroke-cota" strokeWidth="1" />
      <path d="M0.5 10.5L10.5 0.5" className="stroke-accent" strokeWidth="1.5" />
    </svg>
  )
}

interface CotaSeparatorProps {
  className?: string
  /** Classes da extremidade inicial (por exemplo, escondê-la quando fica atrás de uma fotografia). */
  startClassName?: string
}

/**
 * Separador de cota entre secções seguidas com o mesmo fundo: linha fina `line` com as
 * extremidades marcadas. Decorativo (aria-hidden), sem números nem graus. As extremidades
 * saem 5,5 px para fora da linha, dentro da margem lateral do contentor (sem scroll horizontal).
 */
export function CotaSeparator({ className, startClassName }: CotaSeparatorProps) {
  return (
    <div
      aria-hidden="true"
      data-cota-separator=""
      className={cx('pointer-events-none relative h-[11px]', className)}
    >
      <span className="absolute inset-x-0 top-[5px] h-px bg-line" />
      <CotaEnd className={cx('absolute top-0 left-0 -translate-x-1/2', startClassName)} />
      <CotaEnd className="absolute top-0 right-0 translate-x-1/2" />
    </div>
  )
}

/** Marca em cruz de 9 px em latão, centrada na primeira linha do item. */
function CrossMark() {
  return (
    <span aria-hidden="true" className="flex h-[1.4em] shrink-0 items-center">
      <svg
        aria-hidden="true"
        focusable="false"
        width="9"
        height="9"
        viewBox="0 0 9 9"
        fill="none"
        shapeRendering="crispEdges"
        className="block"
      >
        <path d="M4.5 0V9M0 4.5H9" className="stroke-accent" strokeWidth="1" />
      </svg>
    </span>
  )
}

interface RuledListProps {
  items: readonly string[]
  className?: string
  'aria-label'?: string
  'aria-labelledby'?: string
}

/** Lista com régua (linhas `line`) e marcador em cruz de latão. Não numerada. */
export function RuledList({ items, className, ...aria }: RuledListProps) {
  return (
    <ul {...aria} className={cx('border-b border-line', className)}>
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-3 border-t border-line py-2.5 leading-[1.4] font-medium text-ink"
        >
          <CrossMark />
          <span className="min-w-0">
            <PlainText text={item} />
          </span>
        </li>
      ))}
    </ul>
  )
}

// ---------------------------------------------------------------------------
// Secção
// ---------------------------------------------------------------------------

/** Tamanhos da fotografia: 5 de 12 colunas, 4 de 8 colunas, largura do contentor. */
const PHOTO_SIZES =
  '(min-width: 1336px) 516px, (min-width: 1024px) 39vw, (min-width: 640px) 47vw, calc(100vw - 32px)'

/** Zoom de 2% em hover (Parte 5.3), só com movimento aceite. */
const PHOTO_HOVER = 'transition-transform duration-200 motion-safe:hover:scale-[1.02]'

export function About() {
  const [lead, ...rest] = about.paragraphs
  const license = company.legal.license
  // Título habilitante do IMPIC (Parte 5.6), com os mesmos rótulos do bloco legal do rodapé.
  // Pedido ao orquestrador: uma chave própria em about.ts (ver relatório).
  const licenseLine = `${company.legal.name}, ${license.type} ${footer.legalLabels.license} ${license.number}, ${footer.legalLabels.licenseIssuer}`

  return (
    <Section id="sobre" flush className="pt-6 pb-[clamp(4rem,8vw,8rem)] sm:pt-8 lg:pt-10">
      <Container>
        <div className="relative grid grid-cols-1 items-start [--sobre-o:3rem] sm:grid-cols-8 sm:gap-x-6 lg:grid-cols-12 lg:grid-rows-[auto_1fr] xl:[--sobre-o:4rem]">
          {/* A partir de 1024 px, a linha passa por trás da fotografia: a extremidade inicial
              ficaria meio à vista junto à aresta esquerda, por isso esconde-se. */}
          <CotaSeparator
            className="mb-[calc(clamp(4rem,8vw,8rem)_-_11px)] sm:col-span-8 lg:absolute lg:inset-x-0 lg:top-(--sobre-o) lg:col-auto lg:mb-0"
            startClassName="lg:hidden"
          />

          <div
            data-reveal=""
            className="sm:col-span-8 sm:row-start-2 lg:col-span-6 lg:col-start-7 lg:row-start-1 lg:pt-[calc(var(--sobre-o)*2_+_1rem)]"
          >
            <SectionHeading sectionId="sobre" title={about.heading} />
            {lead ? (
              <p className="mt-6 max-w-prose text-lead text-ink">
                <RichText value={lead} />
              </p>
            ) : null}
            {rest.map((paragraph, i) => (
              <p key={i} className="mt-4 max-w-prose text-muted">
                <RichText value={paragraph} />
              </p>
            ))}
          </div>

          <div
            data-reveal=""
            className="mt-10 sm:col-span-4 sm:col-start-1 sm:row-start-3 sm:mt-12 lg:z-10 lg:col-span-5 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:mt-0"
          >
            <Picture id="sobre" frameClassName="aspect-[4/5]" sizes={PHOTO_SIZES} imgClassName={PHOTO_HOVER} />
          </div>

          <div
            data-reveal=""
            className="mt-8 sm:col-span-4 sm:col-start-5 sm:row-start-3 sm:self-end lg:col-span-6 lg:col-start-7 lg:row-start-2 lg:self-start"
          >
            <RuledList aria-label={about.highlightsLabel} items={about.highlights} className="max-w-prose" />
            <p data-impic-license="" className="mt-6 max-w-prose text-small text-muted">
              <PlainText text={licenseLine} />
            </p>
          </div>
        </div>
      </Container>
    </Section>
  )
}
