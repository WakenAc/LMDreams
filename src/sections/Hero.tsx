import { ArrowRight, HardHat } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Container } from "../components/ui/Container";
import { asset } from "../lib/asset";

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative isolate flex min-h-[38rem] items-center overflow-hidden bg-ink pb-20 pt-32 sm:min-h-[44rem] sm:pb-28 sm:pt-40"
    >
      {/* Fotografia de fundo — imagem ilustrativa, ver README */}
      <img
        src={asset("images/hero.webp")}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
        fetchPriority="high"
        decoding="sync"
      />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/90 to-ink/50"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-transparent to-ink/70"
        aria-hidden="true"
      />

      <Container className="relative">
        <div className="fade-up max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-ink/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-brand backdrop-blur-sm">
            <HardHat className="h-3.5 w-3.5" aria-hidden="true" />
            Construção civil &amp; remodelações
          </span>

          <h1 className="mt-6 text-balance font-display text-4xl font-semibold leading-[1.08] text-fg sm:text-5xl lg:text-[3.6rem]">
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
      </Container>

      <span className="pointer-events-none absolute bottom-3 right-3 z-10 rounded-md bg-ink/70 px-2 py-1 text-[0.6rem] font-medium uppercase tracking-wide text-fg-subtle backdrop-blur-sm">
        Imagem ilustrativa
      </span>
    </section>
  );
}
