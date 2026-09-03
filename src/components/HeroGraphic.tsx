/**
 * Composição gráfica original (planta técnica estilizada) usada como imagem
 * de destaque na hero section. Não é uma fotografia de obra real — serve
 * como elemento visual de marca. Pode ser substituída por uma fotografia
 * profissional de uma obra real da LMDreams; ver README.
 */
export function HeroGraphic() {
  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.75rem] bg-ink-2 shadow-lift sm:aspect-[5/6]">
      <svg
        viewBox="0 0 400 480"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <pattern id="hero-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0 L0 0 0 20" fill="none" stroke="#f3ede2" strokeOpacity="0.06" strokeWidth="1" />
          </pattern>
          <linearGradient id="hero-glow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b5622f" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#b5622f" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="400" height="480" fill="url(#hero-grid)" />
        <ellipse cx="200" cy="80" rx="220" ry="160" fill="url(#hero-glow)" />

        {/* Alçado de casa estilizado, traço técnico */}
        <g fill="none" stroke="#f3ede2" strokeOpacity="0.85" strokeWidth="1.6" strokeLinejoin="round">
          <path d="M90 300 L200 210 L310 300" />
          <path d="M110 300 L110 400 L290 400 L290 300" />
          <path d="M150 400 L150 330 L185 330 L185 400" />
          <path d="M225 340 L265 340 L265 380 L225 380 Z" />
          <path d="M240 210 L240 175 L262 175 L262 230" />
        </g>

        <g stroke="#c9a15a" strokeOpacity="0.6" strokeWidth="1" strokeDasharray="2 4">
          <line x1="60" y1="400" x2="340" y2="400" />
          <line x1="60" y1="300" x2="60" y2="410" />
          <line x1="340" y1="300" x2="340" y2="410" />
        </g>

        <g fontFamily="Inter, sans-serif" fontSize="9" letterSpacing="1.5" fill="#f3ede2" fillOpacity="0.45">
          <text x="60" y="430">PLANTA · ALÇADO PRINCIPAL</text>
          <text x="60" y="444">ESC. 1:50</text>
        </g>

        <g stroke="#f3ede2" strokeOpacity="0.15" strokeWidth="1">
          <line x1="0" y1="440" x2="400" y2="440" />
        </g>
      </svg>

      <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl border border-paper/15 bg-ink/70 px-4 py-3 backdrop-blur-sm sm:bottom-7 sm:left-7 sm:right-7">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-copper-200">
            Rigor técnico
          </p>
          <p className="mt-0.5 text-sm text-paper/85">
            Planeamento cuidado antes do primeiro martelo.
          </p>
        </div>
      </div>
    </div>
  );
}
