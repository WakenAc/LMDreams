import { drawingPaths, type PlaceholderVariant } from './placeholder-drawings'

export type { PlaceholderVariant } from './placeholder-drawings'

/** Fundo claro (as imagens das secções) ou escuro (o fundo da faixa do CTA). */
export type PlaceholderTone = 'light' | 'dark'

// Cores dos tokens da direção visual (secção 2), escritas em hex porque os atributos de
// apresentação do SVG não leem variáveis CSS: `sand` com traço `muted`; `dark` com traço
// `line-on-dark`. Na faixa escura, o véu do CTA fica por cima e o traço quase desaparece do
// lado do texto: a faixa continua escura, como as outras, e não um gradiente cinzento.
const TONES: Record<PlaceholderTone, { fill: string; stroke: string; opacity: number; faint: number }> = {
  light: { fill: '#d6d2c7', stroke: '#4a5361', opacity: 0.45, faint: 0.3 },
  dark: { fill: '#292929', stroke: '#494947', opacity: 1, faint: 0.65 },
}

interface PlaceholderArtProps {
  variant: PlaceholderVariant
  tone?: PlaceholderTone
  /** Classes extra do <svg> (ex.: zoom de 2% em hover nas capas dos projetos). */
  className?: string
}

/**
 * Desenho decorativo de uma imagem em falta (plano B): fundo `sand` e traço `muted` a 45%,
 * igual em todos os placeholders (no fundo da faixa escura, `dark` e `line-on-dark`); o
 * desenho muda com o assunto (placeholder-drawings.ts), para as grelhas de Serviços e
 * Projetos não repetirem o mesmo retângulo.
 */
export function PlaceholderArt({ variant, tone = 'light', className }: PlaceholderArtProps) {
  const colors = TONES[tone]
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={['absolute inset-0 h-full w-full', className].filter(Boolean).join(' ')}
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 400 300"
    >
      <rect width="400" height="300" fill={colors.fill} />
      <g fill="none" stroke={colors.stroke} strokeOpacity={colors.opacity} strokeWidth="1.2" strokeLinejoin="round">
        {drawingPaths(variant).map((p, i) => (
          <path key={i} d={p.d} strokeOpacity={p.faint ? colors.faint : undefined} />
        ))}
      </g>
    </svg>
  )
}
