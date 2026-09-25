import { drawingPaths, type PlaceholderVariant } from './placeholder-drawings'

export type { PlaceholderVariant } from './placeholder-drawings'

interface PlaceholderArtProps {
  variant: PlaceholderVariant
  /** Classes extra do <svg> (ex.: zoom de 2% em hover nas capas dos projetos). */
  className?: string
}

/**
 * Desenho decorativo de uma imagem em falta (plano B): fundo `sand` e traço `muted` a 45%,
 * igual em todos os placeholders; o desenho muda com o assunto (placeholder-drawings.ts),
 * para as grelhas de Serviços e Projetos não repetirem o mesmo retângulo.
 */
export function PlaceholderArt({ variant, className }: PlaceholderArtProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={['absolute inset-0 h-full w-full', className].filter(Boolean).join(' ')}
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 400 300"
    >
      <rect width="400" height="300" fill="#d6d2c7" />
      <g fill="none" stroke="#4a5361" strokeOpacity="0.45" strokeWidth="1.2" strokeLinejoin="round">
        {drawingPaths(variant).map((p, i) => (
          <path key={i} d={p.d} strokeOpacity={p.faint ? 0.3 : undefined} />
        ))}
      </g>
    </svg>
  )
}
