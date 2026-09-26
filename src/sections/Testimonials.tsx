import { ui } from '../content/common'
import type { Testimonial } from '../content/tipos'
import { testimonials, testimonialsSection } from '../content/testimonials'
import { Card } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { PlaceholderBox } from '../components/ui/Placeholder'
import { PlainText } from '../components/ui/RichText'
import { Section } from '../components/ui/Section'
import { SectionHeading } from '../components/ui/SectionHeading'

// Testemunhos (Anexo A §9; Parte 5.4 §9; design/direcao-visual.md, secção 9): faixa `surface`
// com três cartões. Enquanto forem placeholders, cartões tracejados "Conteúdo a substituir".
// Sem nomes inventados, fotografias, estrelas, classificações nem dados estruturados de avaliações.

const allPlaceholders = testimonials.every((t) => t.placeholder)

/** Nome, localidade e tipo de obra (os placeholders aparecem realçados). */
function TestimonialFields({ t }: { t: Testimonial }) {
  const labels = testimonialsSection.fieldLabels
  const campos = [
    { label: labels.name, value: t.nome },
    { label: labels.locality, value: t.localidade },
    { label: labels.workType, value: t.tipoDeObra },
  ]
  return (
    <dl className="grid gap-3 text-small">
      {campos.map((campo) => (
        <div key={campo.label}>
          <dt className="text-muted">{campo.label}</dt>
          <dd className="mt-0.5 text-ink">
            <PlainText text={campo.value} />
          </dd>
        </div>
      ))}
    </dl>
  )
}

function PlaceholderTestimonial({ t }: { t: Testimonial }) {
  return (
    <PlaceholderBox label={ui.placeholders.content} className="h-full">
      <p className="text-body text-ink">
        <PlainText text={t.texto} />
      </p>
      <div className="mt-5 border-t border-muted/30 pt-4">
        <TestimonialFields t={t} />
      </div>
    </PlaceholderBox>
  )
}

function RealTestimonial({ t }: { t: Testimonial }) {
  return (
    <Card variant="testimonial" as="div" className="h-full">
      <figure className="flex h-full flex-col gap-5">
        <blockquote className="max-w-texto text-body text-ink">
          <p>
            <PlainText text={t.texto} />
          </p>
        </blockquote>
        <figcaption className="mt-auto border-t border-line pt-4">
          <TestimonialFields t={t} />
        </figcaption>
      </figure>
    </Card>
  )
}

export function Testimonials() {
  const impar = testimonials.length % 2 === 1
  return (
    <Section id="testemunhos" tone="surface">
      <Container>
        <div data-reveal="">
          <SectionHeading
            sectionId="testemunhos"
            title={testimonialsSection.heading}
            intro={allPlaceholders ? testimonialsSection.introPlaceholder : testimonialsSection.introReal}
          />
        </div>
        <ul data-reveal="" className="mt-10 grid gap-6 md:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          {/* Em tablet (duas colunas), o último cartão de um número ímpar ocupa a linha toda. */}
          {testimonials.map((t, i) => (
            <li
              key={t.id}
              data-testimonial=""
              data-placeholder={t.placeholder ? 'true' : 'false'}
              className={impar && i === testimonials.length - 1 ? 'md:col-span-2 lg:col-span-1' : undefined}
            >
              {t.placeholder ? <PlaceholderTestimonial t={t} /> : <RealTestimonial t={t} />}
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
