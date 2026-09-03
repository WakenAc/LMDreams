import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./ui/Button";
import { Container } from "./ui/Container";
import { NAV_ITEMS } from "../data/nav";
import { SITE } from "../lib/site";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-paper/90 backdrop-blur-md transition-shadow duration-300 ${
        scrolled || open ? "shadow-soft" : ""
      }`}
    >
      <Container className="flex h-[4.5rem] items-center justify-between sm:h-20">
        <a
          href="#inicio"
          className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
          onClick={() => setOpen(false)}
        >
          <Logo markClassName="h-9 w-9 sm:h-10 sm:w-10" />
        </a>

        <nav
          className="hidden items-center gap-8 lg:flex"
          aria-label="Navegação principal"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.hash}
              href={`#${item.hash}`}
              className="text-sm font-medium text-ink/80 transition-colors hover:text-copper-500"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={SITE.telefoneHref}
            className="flex items-center gap-2 text-sm font-semibold text-ink/80 transition-colors hover:text-copper-500"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            {SITE.telefone}
          </a>
          <Button href="#contactos" size="md">
            Pedir orçamento
          </Button>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full text-ink lg:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      {open && (
        <div
          id="menu-mobile"
          className="border-t border-stone-200 bg-paper px-2 pb-6 pt-2 lg:hidden"
        >
          <nav className="flex flex-col" aria-label="Navegação móvel">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.hash}
                href={`#${item.hash}`}
                onClick={() => setOpen(false)}
                className="border-b border-stone-100 px-3 py-3.5 text-base font-medium text-ink"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-3 px-3">
            <a
              href={SITE.telefoneHref}
              className="flex items-center justify-center gap-2 text-sm font-semibold text-ink"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              {SITE.telefone}
            </a>
            <Button href="#contactos" size="md" onClick={() => setOpen(false)}>
              Pedir orçamento
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
