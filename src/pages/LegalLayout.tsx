import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Logo } from "../components/Logo";
import { Footer } from "../components/Footer";
import { Container } from "../components/ui/Container";

export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <>
      <header className="border-b border-stone-200 bg-paper py-5">
        <Container className="flex items-center justify-between">
          <Link to="/" aria-label="Voltar à página inicial da LMDreams">
            <Logo markClassName="h-9 w-9" />
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-medium text-ink/70 transition-colors hover:text-copper-500"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Voltar ao site
          </Link>
        </Container>
      </header>

      <main>
        <Container className="max-w-3xl py-16 sm:py-20">
          <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
            {title}
          </h1>
          {updated && (
            <p className="mt-2 text-sm text-stone-500">
              Última atualização: {updated}
            </p>
          )}

          <div className="mt-6 rounded-xl border border-copper-400/40 bg-copper-50 p-4 text-sm leading-relaxed text-copper-700">
            Este texto é um modelo de referência genérico, disponibilizado
            para preencher a estrutura do site. Deve ser revisto e adaptado
            por um profissional habilitado antes da publicação final, de
            forma a refletir com exatidão as práticas reais da LMDreams.
          </div>

          <div className="mt-10 flex flex-col gap-6 text-[0.95rem] leading-relaxed text-stone-700">
            {children}
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
      <div className="mt-2 flex flex-col gap-3">{children}</div>
    </section>
  );
}
