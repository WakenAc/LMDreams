import { company } from '../content/company'
import type { LegalPageContent } from '../content/tipos'
import { SiteLayout } from '../components/layout/SiteLayout'
import { Container } from '../components/ui/Container'
import { PlainText, RichText } from '../components/ui/RichText'

// Provisório (Fase 2). Versão final: pacote WP8 (índice, secções, data de atualização).
export function LegalDocument({ content }: { content: LegalPageContent }) {
  return (
    <SiteLayout>
      <article className="pt-[calc(var(--header-h)+3rem)] pb-24">
        <Container className="max-w-[52rem]">
          <h1 className="text-h1">{content.title}</h1>
          <p className="mt-4 text-small text-muted">
            {content.updatedLabel} <PlainText text={company.legal.policiesUpdatedAt} />
          </p>
          <nav aria-labelledby="indice-titulo" className="mt-8">
            <h2 id="indice-titulo" className="text-h3">
              {content.tocHeading}
            </h2>
            <ol className="mt-3 grid gap-1">
              {content.sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>{s.heading}</a>
                </li>
              ))}
            </ol>
          </nav>
          {content.sections.map((s) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-titulo`} className="mt-10">
              <h2 id={`${s.id}-titulo`} className="text-h3">
                {s.heading}
              </h2>
              {s.blocks.map((b, i) =>
                b.type === 'p' ? (
                  <p key={i} className="mt-3 max-w-prose">
                    <RichText value={b.text} />
                  </p>
                ) : (
                  <ul key={i} className="mt-3 grid max-w-prose list-disc gap-1 pl-5">
                    {b.items.map((it, j) => (
                      <li key={j}>
                        <RichText value={it} />
                      </li>
                    ))}
                  </ul>
                ),
              )}
            </section>
          ))}
        </Container>
      </article>
    </SiteLayout>
  )
}
