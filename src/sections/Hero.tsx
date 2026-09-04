import { ArrowRight, HardHat } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Container } from "../components/ui/Container";
import { HeroGraphic } from "../components/HeroGraphic";

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-ink pb-20 pt-32 sm:pb-28 sm:pt-40"
    >
      <div className="grid-texture pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 45% at 10% 8%, rgba(199,212,54,0.06), transparent 70%), radial-gradient(ellipse 50% 40% at 92% 0%, rgba(201,138,75,0.05), transparent 70%)",
        }}
        aria-hidden="true"
      />

      <Container className="relative grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10">
        <div className="fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-brand">
            <HardHat className="h-3.5 w-3.5" aria-hidden="true" />
            Construção civil &amp; remodelações
          </span>

          <h1 className="mt-6 text-balance font-display text-4xl font-semibold leading-[1.08] text-fg sm:text-5xl lg:text-[3.4rem]">
            A sua obra executada por especialistas.
          </h1>

          <p className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-fg-muted">
            Há mais de 25 anos a reunir os profissionais certos para cada
            etapa da construção, garantindo qualidade, rigor e transparência
            do início ao fim.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href="#contactos" size="lg" icon={<ArrowRight className="h-4 w-4" />}>
              Pedir orçamento
            </Button>
            <Button href="#servicos" size="lg" variant="ghost">
              Conhecer os serviços
            </Button>
          </div>

          <p className="mt-10 text-sm font-medium text-fg-subtle">
            Mais de 25 anos de experiência
            <span className="mx-2 text-brand">•</span>
            Profissionais especializados
            <span className="mx-2 text-brand">•</span>
            Acompanhamento transparente
          </p>
        </div>

        <div className="fade-up [animation-delay:150ms]">
          <HeroGraphic />
        </div>
      </Container>
    </section>
  );
}
