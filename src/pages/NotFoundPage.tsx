import { ui } from '../content/common'
import { notFound } from '../content/notFound'
import { SiteLayout } from '../components/layout/SiteLayout'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { pageHref } from '../lib/links'
import { quoteLinkProps } from '../lib/quote-links'

// Página 404 (Partes 5.4 e 3.4). Funciona em qualquer profundidade de URL: todas as
// ligações (aqui, no cabeçalho e no rodapé) usam caminhos absolutos do base path.
// Composição sóbria: texto e botões à esquerda; à direita, uma pequena planta com uma
// divisão por desenhar (tracejada) e duas cotas sem números. Decorativa (aria-hidden).

const TITLE_ID = 'nao-encontrada-titulo'

/** Planta decorativa: uma divisão construída, uma porta aberta e a divisão seguinte por desenhar. */
function PlanDrawing({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 440 290"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={['aspect-[440/290] h-auto', className].filter(Boolean).join(' ')}
    >
      {/* Divisão por desenhar: fundo neutro e contorno tracejado. */}
      <rect x="214" y="116" width="182" height="152" className="fill-sand/45" />
      <path
        d="M214 116H396V268H214"
        className="stroke-muted"
        strokeWidth="1"
        strokeDasharray="5 5"
        vectorEffect="non-scaling-stroke"
      />

      {/* Paredes da divisão construída, com vãos para a janela e a porta. */}
      <path
        d="M80 72H24V268H214V212M214 160V72H150"
        className="stroke-ink"
        strokeWidth="2.5"
        strokeLinejoin="miter"
        vectorEffect="non-scaling-stroke"
      />
      {/* Janela. */}
      <path
        d="M80 69H150M80 75H150M80 69V75M150 69V75"
        className="stroke-ink"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
      {/* Porta: folha e arco de abertura. */}
      <path d="M214 212H266" className="stroke-ink" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <path d="M214 160A52 52 0 0 1 266 212" className="stroke-cota" strokeWidth="1" vectorEffect="non-scaling-stroke" />

      {/* Cota horizontal sobre a divisão construída (prolonga as arestas das paredes). */}
      <path
        d="M24 62V30M214 62V30M24 40H214"
        className="stroke-cota"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
      <path d="M18 46L30 34M208 46L220 34" className="stroke-accent" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />

      {/* Cota vertical junto à divisão por desenhar. */}
      <path
        d="M404 116H436M404 268H436M426 116V268"
        className="stroke-cota"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M420 122L432 110M420 274L432 262"
        className="stroke-accent"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

export default function NotFoundPage() {
  return (
    <SiteLayout>
      <section
        aria-labelledby={TITLE_ID}
        className="pt-[calc(var(--header-h)+clamp(3rem,8vw,6rem))] pb-[clamp(4rem,8vw,8rem)]"
      >
        <Container className="grid items-center gap-y-12 md:gap-y-16 lg:grid-cols-12 lg:gap-x-6">
          <div data-reveal="" className="lg:col-span-6">
            <h1 id={TITLE_ID} className="text-h1 text-ink">
              {notFound.title}
            </h1>
            <p className="mt-5 max-w-texto text-[1.0625rem] leading-[1.6] text-muted md:mt-6 md:text-lead">
              {notFound.text}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:mt-10">
              <Button href={pageHref('home')} size="lg" className="w-full sm:w-auto">
                {ui.labels.backHome}
              </Button>
              <Button
                href={pageHref('home', 'contactos')}
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
                {...quoteLinkProps}
              >
                {ui.labels.requestQuote}
              </Button>
            </div>
          </div>
          <div data-reveal="" className="lg:col-span-5 lg:col-start-8">
            <PlanDrawing className="w-full max-w-[20rem] sm:max-w-[26rem] lg:max-w-none" />
          </div>
        </Container>
      </section>
    </SiteLayout>
  )
}
