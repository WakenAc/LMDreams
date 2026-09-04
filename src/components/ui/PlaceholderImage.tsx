import type { ReactNode } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "../../lib/utils";

/**
 * Substituto elegante para fotografias reais que ainda não existem.
 * Usa um padrão gráfico neutro (grelha/linhas técnicas) em vez de imagens
 * geradas por IA, para não sugerir que se trata de uma obra real da
 * LMDreams. Substituir por fotografias reais assim que disponíveis —
 * ver README.
 */
export function PlaceholderImage({
  label,
  className,
  patternId,
  icon,
}: {
  label: string;
  className?: string;
  patternId: string;
  icon?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-surface",
        className
      )}
    >
      <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <pattern
            id={patternId}
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 28 L28 0"
              stroke="#ffffff"
              strokeOpacity="0.05"
              strokeWidth="1"
            />
            <path
              d="M0 0 L0 28 M0 0 L28 0"
              stroke="#ffffff"
              strokeOpacity="0.04"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
      <div className="relative flex flex-col items-center gap-2 px-4 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line-strong text-fg-subtle">
          {icon ?? <ImageOff className="h-5 w-5" aria-hidden="true" />}
        </span>
        <p className="max-w-[14rem] text-xs font-medium leading-snug text-fg-subtle">
          {label}
        </p>
      </div>
    </div>
  );
}
