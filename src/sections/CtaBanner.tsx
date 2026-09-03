import { MessageCircle, Phone, Send } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Container } from "../components/ui/Container";
import { SITE } from "../lib/site";

export function CtaBanner() {
  return (
    <section className="relative overflow-hidden bg-ink py-20 text-paper sm:py-24">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 0%, rgba(181,98,47,0.25), transparent 55%)",
        }}
        aria-hidden="true"
      />
      <Container className="relative flex flex-col items-center gap-6 text-center">
        <h2 className="text-balance font-display text-3xl font-semibold sm:text-4xl">
          Tem uma obra ou remodelação em mente?
        </h2>
        <p className="max-w-xl text-balance text-base leading-relaxed text-stone-300 sm:text-lg">
          Fale connosco sobre o seu projeto. Analisamos as suas necessidades
          e apresentamos uma solução clara, adequada e executada pelos
          profissionais certos.
        </p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Button href="#contactos" size="lg" icon={<Send className="h-4 w-4" />}>
            Pedir orçamento
          </Button>
          <Button href={SITE.telefoneHref} size="lg" variant="outlineLight" icon={<Phone className="h-4 w-4" />}>
            Contactar por telefone
          </Button>
          <Button
            href={SITE.whatsappHref}
            size="lg"
            variant="outlineLight"
            icon={<MessageCircle className="h-4 w-4" />}
            target="_blank"
            rel="noopener noreferrer"
          >
            Falar por WhatsApp
          </Button>
        </div>
      </Container>
    </section>
  );
}
