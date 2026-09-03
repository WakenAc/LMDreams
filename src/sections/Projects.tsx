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
    <section id="projetos" className="scroll-mt-20 bg-stone-50 py-20 sm:py-28">
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
                  ? "border-ink bg-ink text-paper"
                  : "border-stone-300 bg-white text-stone-600 hover:border-ink hover:text-ink"
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
              className="flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="grid grid-cols-2 gap-px bg-stone-200">
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
                  <span className="rounded-full bg-copper-50 px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-copper-600">
                    {project.category}
                  </span>
                  <PlaceholderBadge />
                </div>
                <h3 className="font-display text-lg font-semibold text-ink">
                  {project.name}
                </h3>
                <p className="text-sm font-medium text-stone-500">
                  {project.intervention}
                </p>
                <p className="flex items-center gap-1.5 text-sm text-stone-500">
                  <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {project.locality}
                </p>
                <p className="text-sm leading-relaxed text-stone-600">
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
