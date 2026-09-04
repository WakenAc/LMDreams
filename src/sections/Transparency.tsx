import {
  AlertTriangle,
  FileText,
  ListChecks,
  MessageCircle,
  UserCog,
} from "lucide-react";
import { Container } from "../components/ui/Container";
import { SectionHeading } from "../components/ui/SectionHeading";
import { Photo } from "../components/ui/Photo";

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
    <section id="transparencia" className="scroll-mt-20 bg-ink py-20 text-fg sm:py-28">
      <Container className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:grid-rows-[auto_1fr] lg:items-start lg:gap-x-16 lg:gap-y-8">
        <SectionHeading
          eyebrow="Transparência e confiança"
          title="Uma obra sem surpresas escondidas."
          description="Acreditamos que um cliente bem informado é um cliente tranquilo. Por isso, ao longo de toda a obra, garantimos que sabe sempre:"
        />

        <Photo
          src="images/planeamento.webp"
          alt="Plantas de arquitetura, nível e ferramentas de medição sobre uma mesa de trabalho"
          className="order-last aspect-[3/2] rounded-2xl border border-line lg:order-none lg:col-start-1 lg:row-start-2 lg:-mt-4"
        />

        <div className="flex flex-col gap-6 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <div className="grid gap-5 sm:grid-cols-2">
            {ITENS.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-2xl border border-line bg-surface-2 p-5"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/15 text-brand">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold">
                  {title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">
                  {text}
                </p>
              </div>
            ))}
          </div>

          <div className="flex gap-4 rounded-2xl border border-brand/30 bg-brand/10 p-6">
            <AlertTriangle
              className="h-5 w-5 shrink-0 text-brand"
              aria-hidden="true"
            />
            <p className="text-sm leading-relaxed text-fg-muted">
              <strong className="font-semibold text-fg">
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
