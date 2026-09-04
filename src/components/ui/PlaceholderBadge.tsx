import { AlertTriangle } from "lucide-react";
import { cn } from "../../lib/utils";

/**
 * Selo visível que identifica conteúdo de exemplo (testemunhos, fotografias
 * de projetos, etc.) que ainda não deve ser publicado como real. Remover
 * este selo apenas depois de substituir o conteúdo por informação verdadeira.
 */
export function PlaceholderBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-brand/40 bg-brand/10 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-brand",
        className
      )}
    >
      <AlertTriangle className="h-3 w-3" aria-hidden="true" />
      Conteúdo de exemplo
    </span>
  );
}
