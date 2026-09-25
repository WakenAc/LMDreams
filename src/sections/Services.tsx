import { ui } from '../content/common'
import { services, servicesSection } from '../content/services'
import type { ImageId, Service } from '../content/tipos'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { Icon } from '../components/ui/Icon'
import { Picture } from '../components/ui/Picture'
import { PlainText } from '../components/ui/RichText'
import { Section } from '../components/ui/Section'
import { SectionHeading } from '../components/ui/SectionHeading'
import { anchorHref } from '../lib/links'
import { useCurrentPage } from '../lib/page-context'
import { quoteLinkProps } from '../lib/quote-links'

// Serviços (Parte 5.4 §5; direção visual C, secção 9; board-servicos-C-v1).
// Fundo `bg`: separador de cota no topo, seis serviços com imagem 4:3 numa grelha
// 3 × 2 (2 colunas a partir de 640 px, 1 em telemóvel), os restantes dez numa lista
// compacta a duas colunas com ícone e régua, e o fecho com a frase ao visitante e
// "Pedir orçamento". Todo o texto vem de src/content/services.ts e common.ts.

const SECTION_ID = 'servicos'
const OTHERS_HEADING_ID = 'servicos-outros-titulo'

type FeaturedService = Service & { imageId: ImageId }

function hasImage(service: Service): service is FeaturedService {
  return service.imageId !== undefined
}

const ALL: readonly Service[] = services
const FEATURED = ALL.filter(hasImage)
const OTHERS = ALL.filter((s) => !hasImage(s))
// Os serviços com destaque de texto (capacidade de obra completa) abrem a lista.
const OTHERS_ORDERED = [...OTHERS.filter((s) => s.emphasis), ...OTHERS.filter((s) => !s.emphasis)]

// Largura real de cada imagem: 1 coluna (< 640), 2 colunas (640 a 1023), 3 colunas
// (≥ 1024) no contentor de 1272 px com margens de 16, 24 e 32 px e intervalos de 24 px.
const FEATURED_SIZES =
  '(min-width: 1336px) 408px, (min-width: 1024px) calc((100vw - 112px) / 3), (min-width: 640px) calc((100vw - 72px) / 2), calc(100vw - 32px)'

// Zoom de 2% em hover (só com movimento aceite).
const IMAGE_ZOOM = 'transition-transform duration-200 ease-planta motion-safe:group-hover:scale-[1.02]'

/**
 * Marca de cota: linha de chamada vertical (`cota`) com o traço a 45 graus em latão.
 * A caixa tem 11 px; as classes de posição centram a linha de chamada no ponto medido.
 */
function CotaTick({ className }: { className: string }) {
  return (
    <span className={['absolute top-0 size-[11px]', className].join(' ')}>
      <span className="absolute inset-y-0 left-[5px] w-px bg-cota" />
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 11 11"
        width="11"
        height="11"
        className="absolute inset-0 text-accent"
      >
        <path d="M0.5 10.5 10.5 0.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </span>
  )
}

/**
 * Separador de cota no topo da secção, sem números nem graus. As marcas intermédias
 * ficam nos eixos entre as colunas da grelha de serviços (a cota mede a grelha real):
 * só as extremidades em telemóvel, um eixo com 2 colunas e dois eixos com 3.
 */
function CotaSeparator() {
  return (
    <div aria-hidden="true" data-cota-separator="" className="relative h-[11px]">
      <span className="absolute inset-x-0 top-[5px] h-px bg-line" />
      <div className="grid h-full grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
        <span className="relative">
          <CotaTick className="left-[-5px]" />
          <CotaTick className="right-[-5px] sm:hidden" />
        </span>
        <span className="relative hidden sm:block">
          <CotaTick className="left-[-17px]" />
          <CotaTick className="right-[-5px] lg:hidden" />
        </span>
        <span className="relative hidden lg:block">
          <CotaTick className="left-[-17px]" />
          <CotaTick className="right-[-5px]" />
        </span>
      </div>
    </div>
  )
}

export function Services() {
  const currentPage = useCurrentPage()

  return (
    <Section id={SECTION_ID} flush className="pt-10 pb-[clamp(4rem,8vw,8rem)] md:pt-12 lg:pt-18">
      <Container>
        <CotaSeparator />

        {/* Título: alinhado à esquerda em telemóvel e tablet, centrado a partir de 1024 px. */}
        <div data-reveal="" className="mt-10 md:mt-12 lg:mt-16">
          <SectionHeading
            sectionId={SECTION_ID}
            title={servicesSection.heading}
            intro={servicesSection.intro}
            className="lg:mx-auto lg:text-center lg:[&>p]:mx-auto"
          />
        </div>

        {/* Seis serviços em destaque, com imagem 4:3. */}
        <ul
          data-reveal=""
          aria-label={servicesSection.featuredLabel}
          className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 md:mt-12 lg:mt-16 lg:grid-cols-3 lg:gap-y-12"
        >
          {FEATURED.map((service) => (
            <Card key={service.id} as="li" variant="service" data={{ 'data-servico': service.id }}>
              <Picture
                id={service.imageId}
                frameClassName="aspect-[4/3]"
                imgClassName={IMAGE_ZOOM}
                sizes={FEATURED_SIZES}
              />
              <div>
                <h3 className="text-h3 text-ink">
                  <PlainText text={service.name} />
                </h3>
                <p className="mt-2 max-w-texto text-muted">
                  <PlainText text={service.description} />
                </p>
              </div>
            </Card>
          ))}
        </ul>

        {/* Restantes serviços: lista compacta com ícone e régua entre itens. */}
        <div data-reveal="" className="mt-16 md:mt-20 lg:mt-24">
          <h3 id={OTHERS_HEADING_ID} className="text-h3 text-ink">
            <PlainText text={servicesSection.othersHeading} />
          </h3>
          <ul aria-labelledby={OTHERS_HEADING_ID} className="mt-6 grid md:grid-cols-2 md:gap-x-6">
            {OTHERS_ORDERED.map((service, index) => (
              <li
                key={service.id}
                data-servico={service.id}
                data-destaque={service.emphasis ? '' : undefined}
                className={[
                  'flex gap-4 border-b border-line py-4 md:py-5',
                  // Régua superior na primeira linha (uma coluna em telemóvel, duas a partir de 768 px).
                  index === 0 ? 'border-t' : '',
                  index === 1 ? 'md:border-t' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <Icon name={service.icon} className="mt-0.5 shrink-0 text-muted" />
                <div className="min-w-0">
                  <p className={['text-ink', service.emphasis ? 'font-semibold' : 'font-medium'].join(' ')}>
                    <PlainText text={service.name} />
                  </p>
                  <p className="mt-1 max-w-texto text-small text-muted">
                    <PlainText text={service.description} />
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Fecho: frase ao visitante e "Pedir orçamento" (leva ao formulário). */}
        <div
          data-reveal=""
          className="mt-10 flex flex-col items-start gap-6 md:mt-12 lg:mt-16 lg:items-center lg:text-center"
        >
          <p className="max-w-texto text-lead text-ink">
            <PlainText text={servicesSection.visitorNote} />
          </p>
          <Button
            href={anchorHref('contactos', currentPage)}
            size="lg"
            className="w-full sm:w-auto"
            {...quoteLinkProps}
          >
            {ui.labels.requestQuote}
          </Button>
        </div>
      </Container>
    </Section>
  )
}
