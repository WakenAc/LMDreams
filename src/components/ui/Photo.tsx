import { asset } from "../../lib/asset";
import { cn } from "../../lib/utils";

/**
 * Fotografia ilustrativa.
 *
 * As imagens atualmente incluídas em `public/images/` são composições
 * geradas por IA e servem apenas de ambiente visual — não são obras
 * realizadas pela LMDreams. Por isso cada uma é apresentada com a
 * etiqueta "Imagem ilustrativa", que deve ser removida (passando
 * `illustrative={false}`) quando for substituída por uma fotografia
 * real da empresa. Ver README, secção "Imagens".
 */
export function Photo({
  src,
  alt,
  className,
  imgClassName,
  priority = false,
  illustrative = true,
  overlay = "none",
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  illustrative?: boolean;
  overlay?: "none" | "soft" | "strong";
}) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <img
        src={asset(src)}
        alt={alt}
        className={cn("h-full w-full object-cover", imgClassName)}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        {...(priority ? { fetchPriority: "high" as const } : {})}
      />
      {overlay !== "none" && (
        <div
          className={cn(
            "pointer-events-none absolute inset-0",
            overlay === "soft"
              ? "bg-gradient-to-t from-ink/80 via-ink/20 to-transparent"
              : "bg-gradient-to-t from-ink via-ink/70 to-ink/40"
          )}
          aria-hidden="true"
        />
      )}
      {illustrative && (
        <span className="pointer-events-none absolute bottom-2 right-2 rounded-md bg-ink/75 px-2 py-1 text-[0.6rem] font-medium uppercase tracking-wide text-fg-subtle backdrop-blur-sm">
          Imagem ilustrativa
        </span>
      )}
    </div>
  );
}
