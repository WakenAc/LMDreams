import { Link } from "react-router-dom";
import { ExternalLink, Facebook, Instagram, Mail, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { Container } from "./ui/Container";
import { SITE } from "../lib/site";
import { NAV_ITEMS } from "../data/nav";

const SERVICOS_RODAPE = [
  "Construção civil",
  "Remodelações completas",
  "Remodelação de cozinhas",
  "Remodelação de casas de banho",
  "Canalização e eletricidade",
];

export function Footer() {
  const ano = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-surface">
      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:gap-8">
        <div className="flex flex-col gap-4">
          <Logo markClassName="h-10 w-10" />
          <p className="max-w-xs text-sm leading-relaxed text-fg-muted">
            Empresa de construção civil com profissionais especializados em
            cada área da obra. Qualidade, rigor e transparência do início ao
            fim.
          </p>
          <div className="flex items-center gap-3 pt-1">
            <a
              href={SITE.instagramHref}
              title="Placeholder — associar Instagram real"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line-strong text-fg-subtle transition-colors hover:border-brand hover:text-brand"
            >
              <Instagram className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href={SITE.facebookHref}
              title="Placeholder — associar Facebook real"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line-strong text-fg-subtle transition-colors hover:border-brand hover:text-brand"
            >
              <Facebook className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        <nav aria-label="Ligações rápidas">
          <h3 className="font-display text-sm font-semibold text-fg">
            Ligações rápidas
          </h3>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm">
            {NAV_ITEMS.map((item) => (
              <li key={item.hash}>
                <Link
                  to={{ pathname: "/", hash: item.hash }}
                  className="text-fg-muted transition-colors hover:text-brand"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Serviços">
          <h3 className="font-display text-sm font-semibold text-fg">
            Serviços
          </h3>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm">
            {SERVICOS_RODAPE.map((servico) => (
              <li key={servico}>
                <Link
                  to={{ pathname: "/", hash: "servicos" }}
                  className="text-fg-muted transition-colors hover:text-brand"
                >
                  {servico}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="font-display text-sm font-semibold text-fg">
            Contactos
          </h3>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm text-fg-muted">
            <li>
              <a
                href={SITE.telefoneHref}
                className="flex items-center gap-2 transition-colors hover:text-brand"
              >
                <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                {SITE.telefone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${SITE.email}`}
                className="flex items-center gap-2 transition-colors hover:text-brand"
              >
                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                {SITE.email}
              </a>
            </li>
            <li className="pt-1 text-fg-subtle">{SITE.areaAtuacao}</li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-line">
        <Container className="flex flex-col gap-4 py-6 text-xs text-fg-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>© {ano} LMDreams. Todos os direitos reservados.</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <Link to="/politica-de-privacidade" className="hover:text-brand">
                Política de privacidade
              </Link>
            </li>
            <li>
              <Link to="/politica-de-cookies" className="hover:text-brand">
                Política de cookies
              </Link>
            </li>
            <li>
              <Link to="/termos-e-condicoes" className="hover:text-brand">
                Termos e condições
              </Link>
            </li>
            <li>
              <a
                href="https://www.livroreclamacoes.pt/Inicio/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-brand"
              >
                Livro de reclamações
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
            </li>
          </ul>
        </Container>
      </div>
    </footer>
  );
}
