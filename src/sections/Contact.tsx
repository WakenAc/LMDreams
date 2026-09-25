import { company } from '../content/company'
import { contact } from '../content/contact'
import { Container } from '../components/ui/Container'
import { PlainText, RichText } from '../components/ui/RichText'
import { Section } from '../components/ui/Section'
import { SectionHeading } from '../components/ui/SectionHeading'

// Provisório (Fase 2). Versão final: pacote WP7 (formulário da Parte 3.8).
export function Contact() {
  return (
    <Section id="contactos">
      <Container className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionHeading sectionId="contactos" title={contact.heading} intro={contact.intro} />
        </div>
        <div className="lg:col-span-4 lg:col-start-9">
          <h3 className="text-h3">{contact.detailsHeading}</h3>
          <dl className="mt-4 grid gap-3">
            <div>
              <dt className="text-small text-muted">{contact.details.phoneLabel}</dt>
              <dd>
                <a href={company.phone.href}>{company.phone.display}</a> ({company.phoneCallNote})
              </dd>
            </div>
            <div>
              <dt className="text-small text-muted">{contact.details.emailLabel}</dt>
              <dd>
                <a href={`mailto:${company.email}`}>{company.email}</a>
              </dd>
            </div>
            <div>
              <dt className="text-small text-muted">{contact.details.areaLabel}</dt>
              <dd>{company.areaServed}</dd>
            </div>
            <div>
              <dt className="text-small text-muted">{contact.details.hoursLabel}</dt>
              <dd>
                <PlainText text={company.hours} />
              </dd>
            </div>
          </dl>
          <div data-rgpd-notice="" className="mt-6 grid gap-2 text-small text-muted">
            {contact.notice.map((bloco, i) => (
              <p key={i}>
                <RichText value={bloco} />
              </p>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
