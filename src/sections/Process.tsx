import { method } from '../content/process'
import { Container } from '../components/ui/Container'
import { Section } from '../components/ui/Section'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Steps } from '../components/ui/Steps'

// Método de trabalho (Parte 5.4 §6; direção visual, secção 9): faixa `surface` com papel de
// desenho em opacidade baixa e as oito etapas numa linha temporal ligada por uma cadeia de
// cotas (os dois motivos da secção). O papel de desenho esbate-se do canto superior direito
// para o inferior esquerdo, para quase não passar por trás do texto.
export function Process() {
  return (
    <Section id="metodo" tone="surface">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-planta opacity-50 lg:opacity-70 [mask-image:linear-gradient(to_bottom_left,var(--color-ink),transparent_72%)]"
      />
      <Container className="relative">
        <div data-reveal="">
          <SectionHeading sectionId="metodo" title={method.heading} intro={method.intro} />
        </div>
        <div data-reveal="" className="mt-12 md:mt-14 lg:mt-16">
          <Steps steps={method.steps} />
        </div>
      </Container>
    </Section>
  )
}
