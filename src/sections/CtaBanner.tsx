import { MessageCircle, Phone, Send } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Container } from "../components/ui/Container";
import { SITE } from "../lib/site";
import { asset } from "../lib/asset";

export function CtaBanner() {
  return (
    <section className="relative isolate overflow-hidden bg-ink py-20 text-fg sm:py-24">
      {/* Fotografia de ambiente — imagem ilustrativa, ver README */}
      <img
        src={asset("images/cta.webp")}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-ink/85" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 0%, rgba(199,212,54,0.14), transparent 55%)",
        }}
        aria-hidden="true"
      />
      <Container className="relative flex flex-col items-center gap-6 text-center">
        <h2 className="text-balance font-display text-3xl font-semibold sm:text-4xl">
          Tem uma obra ou remodelação em mente?
        </h2>
        <p className="max-w-xl text-balance text-base leading-relaxed text-fg-muted sm:text-lg">
          Fale connosco sobre o seu projeto. Analisamos as suas necessidades
          e apresentamos uma solução clara, adequada e executada pelos
          profissionais certos.
        </p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Button href="#contactos" size="lg" icon={<Send className="h-4 w-4" />}>
            Pedir orçamento
          </Button>
          <Button href={SITE.telefoneHref} size="lg" variant="ghost" icon={<Phone className="h-4 w-4" />}>
            Contactar por telefone
          </Button>
          <Button
            href={SITE.whatsappHref}
            size="lg"
            variant="ghost"
            icon={<MessageCircle className="h-4 w-4" />}
            target="_blank"
            rel="noopener noreferrer"
          >
            Falar por WhatsApp
          </Button>
        </div>
      </Container>

      <span className="pointer-events-none absolute bottom-3 right-3 rounded-md bg-ink/70 px-2 py-1 text-[0.6rem] font-medium uppercase tracking-wide text-fg-subtle backdrop-blur-sm">
        Imagem ilustrativa
      </span>
    </section>
  );
}
