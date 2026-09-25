import { company } from '../content/company'
import { ui } from '../content/common'
import { cta } from '../content/cta'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { Picture } from '../components/ui/Picture'
import { RichText } from '../components/ui/RichText'
import { Section } from '../components/ui/Section'
import { SectionHeading } from '../components/ui/SectionHeading'
import { quoteLinkProps } from '../lib/quote-links'
import { whatsappHref } from '../lib/whatsapp'

// Chamada para ação (Parte 5.4 §10; design/direcao-visual.md, secções 7 e 9): faixa
// escura sobre a imagem `cta`, com véu `dark` de pelo menos 72% na zona do texto e a
// legenda de IA no canto inferior direito, por cima do véu e longe dos botões.

// Véu: uniforme a 80% abaixo de 1024 px (o texto ocupa a largura toda); a partir daí,
// 80% do lado do texto até 35% da largura, 72% aos 70% (o texto acaba antes, mesmo a
// 1024 px) e 45% no lado oposto.
const VEU =
  'absolute inset-0 bg-dark/80 lg:bg-transparent lg:bg-linear-to-r lg:from-dark/80 lg:from-35% lg:via-dark/72 lg:via-70% lg:to-dark/45'

// Enquanto a imagem não existir, a etiqueta "Imagem a substituir" do placeholder fica
// por cima do véu (continua visível e legível).
const PLACEHOLDER_LABEL_ON_TOP = '[&_[data-image-placeholder]>figcaption]:z-[1]'

// Foco sobre a fotografia: o anel global (2 px `focus`, afastamento de 3 px) fica sobre
// um halo `dark` sólido de 7 px, para ter sempre 3,40:1 com o que o rodeia; sobre o véu,
// o anel sozinho pode descer a 1,4:1 num píxel claro. O secundário mantém o contorno.
const FOCUS_HALO = 'w-full md:w-auto focus-visible:shadow-[0_0_0_7px_var(--color-dark)]'
const FOCUS_HALO_SECONDARY =
  'w-full md:w-auto focus-visible:shadow-[inset_0_0_0_1px_var(--color-on-dark),0_0_0_7px_var(--color-dark)]'

export function CallToAction() {
  return (
    <Section id="orcamento" tone="dark" flush className={`isolate overflow-hidden ${PLACEHOLDER_LABEL_ON_TOP}`}>
      {/* A moldura absoluta dá à imagem de fundo um tamanho definido em qualquer caso. */}
      <div className="absolute inset-0">
        <Picture id="cta" fill caption="bottom-right" />
      </div>
      <div aria-hidden="true" className={VEU} />
      {/* O padding inferior (80 a 128 px) deixa livre o canto da legenda de IA (40 px). */}
      <Container className="relative z-[2] pt-16 pb-20 md:pt-20 md:pb-24 lg:py-32">
        <div data-reveal className="max-w-[44rem]">
          <SectionHeading sectionId="orcamento" title={cta.heading} onDark />
          <p className="mt-5 max-w-prose text-lead text-on-dark">
            <RichText value={cta.text} onDark />
          </p>
          <div className="mt-8 flex flex-col gap-3 md:flex-row md:flex-wrap">
            <Button href="#contactos" size="lg" className={FOCUS_HALO} {...quoteLinkProps}>
              {ui.labels.requestQuote}
            </Button>
            <Button href={company.phone.href} size="lg" variant="secondary" onDark className={FOCUS_HALO_SECONDARY}>
              {ui.labels.callPhone}
            </Button>
            <Button href={whatsappHref()} size="lg" variant="secondary" onDark className={FOCUS_HALO_SECONDARY}>
              {ui.labels.whatsapp}
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  )
}
