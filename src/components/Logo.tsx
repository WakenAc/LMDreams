import { asset } from "../lib/asset";

/**
 * Símbolo oficial da marca LMDreams (public/logo.png).
 * Para substituir o logótipo basta trocar esse ficheiro.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src={asset("logo.png")}
      alt=""
      className={className}
      width={250}
      height={151}
      aria-hidden="true"
    />
  );
}

export function Logo({
  className,
  markClassName,
}: {
  className?: string;
  markClassName?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-3 ${className ?? ""}`}>
      <LogoMark className={markClassName ?? "h-9 w-auto shrink-0"} />
      <span className="flex flex-col leading-none">
        <span className="font-display text-xl font-semibold tracking-tight text-fg">
          LMDreams
        </span>
        <span className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-fg-subtle">
          Construção &amp; Remodelações
        </span>
      </span>
    </span>
  );
}
