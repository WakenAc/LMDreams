import { Quote, Star } from "lucide-react";
import { Container } from "../components/ui/Container";
import { SectionHeading } from "../components/ui/SectionHeading";
import { PlaceholderBadge } from "../components/ui/PlaceholderBadge";

const CARTOES = [1, 2, 3];

export function Testimonials() {
  return (
    <section className="bg-ink py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Testemunhos"
          title="O que os nossos clientes dizem."
          description="Esta secção está preparada para testemunhos reais. Enquanto não existirem avaliações verificadas, mantemos os cartões identificados como conteúdo de exemplo — nunca inventamos opiniões ou classificações."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CARTOES.map((n) => (
            <figure
              key={n}
              className="flex flex-col gap-5 rounded-2xl border border-dashed border-line-strong bg-surface p-7"
            >
              <div className="flex items-center justify-between">
                <Quote className="h-6 w-6 text-brand" aria-hidden="true" />
                <PlaceholderBadge />
              </div>

              <div className="flex gap-1 text-line-strong" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4" />
                ))}
              </div>

              <blockquote className="text-sm italic leading-relaxed text-fg-subtle">
                &ldquo;[Espaço reservado para o testemunho real do
                cliente sobre a obra realizada.]&rdquo;
              </blockquote>

              <figcaption className="mt-auto border-t border-line pt-4 text-sm">
                <p className="font-semibold text-fg-subtle">[Nome do cliente]</p>
                <p className="text-fg-subtle">[Tipo de obra • Localidade]</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
