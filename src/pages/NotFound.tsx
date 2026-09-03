import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Logo } from "../components/Logo";
import { Button } from "../components/ui/Button";
import { Container } from "../components/ui/Container";

export function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-center text-paper">
      <Container className="flex flex-col items-center gap-6">
        <Link to="/">
          <Logo variant="light" markClassName="h-12 w-12" />
        </Link>
        <p className="font-display text-7xl font-semibold text-copper-400">404</p>
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">
          Página não encontrada
        </h1>
        <p className="max-w-md text-balance text-stone-300">
          A página que procura pode ter sido movida ou já não existe.
          Volte à página inicial para continuar a navegar no site da
          LMDreams.
        </p>
        <Button href={import.meta.env.BASE_URL} size="lg" icon={<ArrowLeft className="h-4 w-4" />}>
          Voltar ao início
        </Button>
      </Container>
    </main>
  );
}
