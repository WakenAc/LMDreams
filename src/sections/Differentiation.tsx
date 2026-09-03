import {
  ClipboardCheck,
  Gauge,
  MessagesSquare,
  UserCheck,
  Wrench,
} from "lucide-react";
import { Container } from "../components/ui/Container";
import { SectionHeading } from "../components/ui/SectionHeading";

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
    <section className="bg-ink py-20 text-paper sm:py-28">
      <Container>
        <SectionHeading
          tone="dark"
          align="center"
          eyebrow="A nossa diferença"
          title={
            <>
              Não acreditamos no <span className="text-copper-400">&ldquo;faz tudo&rdquo;</span>.
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
              className={`rounded-2xl border border-paper/10 bg-paper/[0.04] p-6 transition-all duration-300 hover:border-copper-400/40 hover:bg-paper/[0.07] ${
                i === CARTOES.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-copper-500/15 text-copper-300">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-300">
                {text}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
