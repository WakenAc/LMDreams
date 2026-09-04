type LogoMarkProps = {
  className?: string;
};

/**
 * Recriação vetorial do símbolo da marca LMDreams (silhueta de telhado com
 * chaminé e janela) para uso em ecrã a qualquer resolução. Substituir pelo
 * ficheiro oficial da marca quando disponível — ver README, secção
 * "Elementos a substituir".
 */
export function LogoMark({ className }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label="Símbolo LMDreams"
    >
      <rect x="1" y="1" width="98" height="98" rx="20" fill="#2b2b2b" />
      <g
        fill="none"
        stroke="var(--color-brand)"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 57 L50 22 L86 57" />
        <path d="M50 22 L50 30" />
        <path d="M58 43 L76 26 L91 43" />
        <path d="M70 32 L70 20 L79 20 L79 29" />
      </g>
      <g fill="var(--color-brand)">
        <rect x="37" y="60" width="12" height="12" rx="1.5" />
        <rect x="51" y="60" width="12" height="12" rx="1.5" />
      </g>
    </svg>
  );
}

type LogoProps = {
  className?: string;
  markClassName?: string;
};

export function Logo({ className, markClassName }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-3 ${className ?? ""}`}>
      <LogoMark className={markClassName ?? "h-10 w-10 shrink-0"} />
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
