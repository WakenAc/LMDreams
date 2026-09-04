import {
  ClipboardCheck,
  Gauge,
  MessagesSquare,
  UserCheck,
  Wrench,
} from "lucide-react";
import { Container } from "../components/ui/Container";
import { SectionHeading } from "../components/ui/SectionHeading";
import { asset } from "../lib/asset";

const CARTOES = [
  {
    icon: UserCheck,
    title: "Profissionais especializados",
    text: "Cada especialidade — canalização, eletricidade, carpintaria, pintura, revestimentos — é executada por quem tem experiência real nessa área.",
  },
  {
    icon: MessagesSquare,
    title: "Comunicação transparente",
    text: "O cliente sabe o que está a ser feito, por quem e em que fase da obra se encontra o trabalho.",
  },
  {
    icon: ClipboardCheck,
    title: "Planeamento rigoroso",
    text: "Antes de qualquer trabalho começar, analisamos o projeto e organizamos as etapas de forma clara.",
  },
  {
    icon: Gauge,
    title: "Qualidade de execução",
    text: "Rigor técnico em cada pormenor, para um resultado sólido e duradouro — não apenas um trabalho terminado depressa.",
  },
  {
    icon: Wrench,
    title: "Acompanhamento até à entrega",
    text: "Continuamos presentes durante toda a obra, não apenas no início e no fim.",
  },
];

export function Differentiation() {
  return (
    <section className="relative isolate overflow-hidden bg-ink py-20 text-fg sm:py-28">
      {/* Fotografia de ambiente — imagem ilustrativa, ver README */}
      <img
        src={asset("images/especialistas.webp")}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-ink/88" aria-hidden="true" />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-ink via-transparent to-ink"
        aria-hidden="true"
      />

      <Container>
        <SectionHeading
          align="center"
          eyebrow="A nossa diferença"
          title={
            <>
              Não acreditamos no <span className="text-brand">&ldquo;faz tudo&rdquo;</span>.
              <br className="hidden sm:block" /> Acreditamos em especialistas.
            </>
          }
          description="No setor da construção é comum uma única pessoa tentar executar várias especialidades sem dominar verdadeiramente nenhuma. Na LMDreams, cada trabalho é feito pela pessoa certa."
          className="mx-auto"
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {CARTOES.map(({ icon: Icon, title, text }, i) => (
            <div
              key={title}
              className={`rounded-2xl border border-line bg-surface-2/95 p-6 backdrop-blur-sm transition-all duration-300 hover:border-brand/40 hover:bg-surface-3 ${
                i === CARTOES.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                {text}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
