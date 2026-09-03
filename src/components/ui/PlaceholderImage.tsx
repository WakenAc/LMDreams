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
  tone = "sand",
  icon,
}: {
  label: string;
  className?: string;
  patternId: string;
  tone?: "sand" | "ink";
  icon?: ReactNode;
}) {
  const isDark = tone === "ink";
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        isDark ? "bg-ink-2" : "bg-stone-100",
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
              stroke={isDark ? "#ffffff" : "#1c1815"}
              strokeOpacity={isDark ? 0.06 : 0.05}
              strokeWidth="1"
            />
            <path
              d="M0 0 L0 28 M0 0 L28 0"
              stroke={isDark ? "#ffffff" : "#1c1815"}
              strokeOpacity={isDark ? 0.05 : 0.04}
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
      <div className="relative flex flex-col items-center gap-2 px-4 text-center">
        <span
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-full border",
            isDark ? "border-paper/25 text-paper/70" : "border-stone-300 text-stone-400"
          )}
        >
          {icon ?? <ImageOff className="h-5 w-5" aria-hidden="true" />}
        </span>
        <p
          className={cn(
            "max-w-[14rem] text-xs font-medium leading-snug",
            isDark ? "text-paper/60" : "text-stone-500"
          )}
        >
          {label}
        </p>
      </div>
    </div>
  );
}
