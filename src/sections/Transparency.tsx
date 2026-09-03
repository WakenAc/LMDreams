import {
  AlertTriangle,
  FileText,
  ListChecks,
  MessageCircle,
  UserCog,
} from "lucide-react";
import { Container } from "../components/ui/Container";
import { SectionHeading } from "../components/ui/SectionHeading";

const ITENS = [
  {
    icon: FileText,
    title: "O que vai ser executado",
    text: "Detalhamos o âmbito dos trabalhos antes de a obra começar.",
  },
  {
    icon: UserCog,
    title: "Quem é responsável por cada especialidade",
    text: "Sabe sempre que profissional está a cargo de cada tarefa.",
  },
  {
    icon: ListChecks,
    title: "Quais são as principais etapas",
    text: "Planeamento claro do faseamento da obra, do início à entrega.",
  },
  {
    icon: MessageCircle,
    title: "Como está a decorrer o trabalho",
    text: "Comunicação regular sobre o progresso, sem surpresas de última hora.",
  },
];

export function Transparency() {
  return (
    <section id="transparencia" className="scroll-mt-20 bg-ink py-20 text-paper sm:py-28">
      <Container className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-16">
        <SectionHeading
          tone="dark"
          eyebrow="Transparência e confiança"
          title="Uma obra sem surpresas escondidas."
          description="Acreditamos que um cliente bem informado é um cliente tranquilo. Por isso, ao longo de toda a obra, garantimos que sabe sempre:"
        />

        <div className="flex flex-col gap-6">
          <div className="grid gap-5 sm:grid-cols-2">
            {ITENS.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-2xl border border-paper/10 bg-paper/[0.04] p-5"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-copper-500/15 text-copper-300">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold">
                  {title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-stone-300">
                  {text}
                </p>
              </div>
            ))}
          </div>

          <div className="flex gap-4 rounded-2xl border border-copper-400/30 bg-copper-500/10 p-6">
            <AlertTriangle
              className="h-5 w-5 shrink-0 text-copper-300"
              aria-hidden="true"
            />
            <p className="text-sm leading-relaxed text-stone-200">
              <strong className="font-semibold text-paper">
                Numa obra podem surgir imprevistos —
              </strong>{" "}
              não prometemos que isso nunca aconteça. O que garantimos é que
              qualquer alteração que possa afetar o orçamento ou os prazos
              lhe será comunicada de forma clara e atempada, para que possa
              decidir com toda a informação.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
