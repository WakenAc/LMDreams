import { HardHat, MessageCircle, ShieldCheck, Users } from "lucide-react";
import { Container } from "../components/ui/Container";
import { SectionHeading } from "../components/ui/SectionHeading";
import { Photo } from "../components/ui/Photo";

const PONTOS = [
  {
    icon: Users,
    title: "Um especialista para cada área",
    text: "Canalização, eletricidade, carpintaria, pintura ou revestimentos — cada trabalho é feito por quem tem experiência concreta nessa especialidade.",
  },
  {
    icon: HardHat,
    title: "Capacidade para obras completas",
    text: "De uma pequena remodelação a um projeto de construção mais alargado, coordenamos todas as fases necessárias para o concluir.",
  },
  {
    icon: MessageCircle,
    title: "Acompanhamento próximo",
    text: "Mantemos o cliente informado ao longo de toda a obra, com uma comunicação direta e acessível em cada etapa.",
  },
  {
    icon: ShieldCheck,
    title: "Qualidade que dura",
    text: "Trabalhamos com rigor técnico, porque o objetivo não é só terminar a obra — é entregar um resultado sólido e duradouro.",
  },
];

export function About() {
  return (
    <section id="sobre" className="scroll-mt-20 bg-ink py-20 sm:py-28">
      <Container className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            eyebrow="Sobre a LMDreams"
            title="Mais de 25 anos de experiência a coordenar as pessoas certas para cada obra."
            description="A LMDreams reúne profissionais com mais de 25 anos de experiência no mercado da construção civil, capazes de responder a praticamente todas as necessidades de uma obra — desde pequenas remodelações a projetos de construção mais completos."
          />
          <p className="mt-6 max-w-xl text-balance text-base leading-relaxed text-fg-muted">
            Em vez de depender de uma única pessoa a tentar fazer um pouco de
            tudo, trabalhamos com profissionais dedicados a cada
            especialidade. É esta organização que nos permite manter
            elevados padrões de qualidade, rigor e transparência, obra após
            obra.
          </p>

          <Photo
            src="images/obra.webp"
            alt="Estaleiro de construção ao final do dia, com grua e equipa em obra"
            className="mt-8 aspect-[4/3] rounded-2xl border border-line"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {PONTOS.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="group rounded-2xl border border-line bg-surface-2 p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand/50 hover:shadow-lift"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-fg">
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
