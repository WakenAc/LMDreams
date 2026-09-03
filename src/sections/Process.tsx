import { Container } from "../components/ui/Container";
import { SectionHeading } from "../components/ui/SectionHeading";
import { PROCESS_STEPS } from "../data/process";

export function Process() {
  return (
    <section id="metodo" className="scroll-mt-20 bg-paper py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Método de trabalho"
          title="Um processo simples, claro e transparente."
          description="Sabe sempre em que fase está a sua obra e o que vai acontecer a seguir."
        />

        <ol className="relative mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          <div
            className="pointer-events-none absolute left-0 right-0 top-6 hidden h-px bg-stone-200 lg:block"
            aria-hidden="true"
          />
          {PROCESS_STEPS.map((step) => (
            <li key={step.numero} className="relative flex flex-col gap-3">
              <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-stone-300 bg-paper font-display text-base font-semibold text-copper-600">
                {step.numero}
              </span>
              <h3 className="font-display text-lg font-semibold text-ink">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-stone-600">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
