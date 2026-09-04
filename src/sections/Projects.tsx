import { useState } from "react";
import { MapPin } from "lucide-react";
import { Container } from "../components/ui/Container";
import { SectionHeading } from "../components/ui/SectionHeading";
import { PlaceholderBadge } from "../components/ui/PlaceholderBadge";
import { PlaceholderImage } from "../components/ui/PlaceholderImage";
import { PROJECT_CATEGORIES, PROJECTS, type ProjectCategory } from "../data/projects";
import { cn } from "../lib/utils";

type Filter = "Todos" | ProjectCategory;

export function Projects() {
  const [filter, setFilter] = useState<Filter>("Todos");

  const visible =
    filter === "Todos" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  return (
    <section id="projetos" className="scroll-mt-20 bg-surface py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Projetos"
          title="Espaço preparado para os nossos projetos reais."
          description="Esta secção está pronta para apresentar fotografias de trabalhos concluídos, organizadas por categoria. Os cartões abaixo são exemplos de estrutura, identificados como conteúdo a substituir."
        />

        <div
          className="mt-10 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Filtrar projetos por categoria"
        >
          {(["Todos", ...PROJECT_CATEGORIES] as Filter[]).map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={filter === cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200",
                filter === cat
                  ? "border-brand bg-brand text-ink"
                  : "border-line-strong bg-surface-2 text-fg-muted hover:border-brand hover:text-fg"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project) => (
            <article
              key={project.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-line bg-surface-2 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="grid grid-cols-2 gap-px bg-line">
                <PlaceholderImage
                  patternId={`${project.id}-antes`}
                  label="Antes"
                  className="aspect-[4/3]"
                />
                <PlaceholderImage
                  patternId={`${project.id}-depois`}
                  label="Depois"
                  className="aspect-[4/3]"
                />
              </div>

              <div className="flex flex-1 flex-col gap-3 p-6">
                <div className="flex items-start justify-between gap-3">
                  <span className="rounded-full bg-brand/10 px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-brand">
                    {project.category}
                  </span>
                  <PlaceholderBadge />
                </div>
                <h3 className="font-display text-lg font-semibold text-fg">
                  {project.name}
                </h3>
                <p className="text-sm font-medium text-fg-subtle">
                  {project.intervention}
                </p>
                <p className="flex items-center gap-1.5 text-sm text-fg-subtle">
                  <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {project.locality}
                </p>
                <p className="text-sm leading-relaxed text-fg-muted">
                  {project.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
