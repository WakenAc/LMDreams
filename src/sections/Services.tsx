import { Container } from "../components/ui/Container";
import { SectionHeading } from "../components/ui/SectionHeading";
import { SERVICES } from "../data/services";

export function Services() {
  return (
    <section id="servicos" className="scroll-mt-20 bg-stone-50 py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Serviços"
          title="Um único ponto de contacto para todas as especialidades da sua obra."
          description="Coordenamos as várias frentes de trabalho para que não precise de gerir vários prestadores de serviço em separado."
        />

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {SERVICES.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="group flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-copper-400/50 hover:shadow-lift sm:p-6"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-copper-300 transition-colors duration-300 group-hover:bg-copper-500 group-hover:text-white">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-display text-base font-semibold text-ink">
                  {title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-stone-600">
                  {text}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-10 max-w-2xl text-sm leading-relaxed text-stone-500">
          Esta lista é indicativa e pode não refletir a totalidade dos
          serviços atualmente disponíveis. Contacte-nos para confirmar a
          disponibilidade e adequação ao seu projeto.
        </p>
      </Container>
    </section>
  );
}
