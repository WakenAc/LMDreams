import type { ReactNode } from 'react'
import { ui } from '../../content/common'

/**
 * Pastilha da etiqueta "Conteúdo a substituir" / "Imagem a substituir" (Parte 5.3): um só
 * estilo em todos os placeholders (imagens, cartões, projetos), tracejado, em Plex Mono a
 * 12 px e sem maiúsculas (direção visual, secção 11).
 */
export const PLACEHOLDER_LABEL =
  'rounded-sm border border-dashed border-muted bg-bg/90 px-2.5 py-1 font-mono text-caption text-ink'

/** A mesma pastilha nas faixas escuras. */
export const PLACEHOLDER_LABEL_ON_DARK =
  'rounded-sm border border-dashed border-muted-on-dark bg-white/10 px-2.5 py-1 font-mono text-caption text-on-dark'

/**
 * Valor em falta dentro de um texto (marcador criado por PH), com contorno tracejado
 * e tons neutros (Parte 5.3). Nunca parte o layout: quebra como texto normal.
 */
export function PlaceholderText({ children, onDark = false }: { children: ReactNode; onDark?: boolean }) {
  return (
    <span
      data-placeholder-text=""
      className={[
        'rounded-sm px-1 [box-decoration-break:clone] outline-1 -outline-offset-1 outline-dashed',
        onDark ? 'bg-white/10 text-on-dark outline-muted-on-dark' : 'bg-sand/45 text-ink outline-muted',
      ].join(' ')}
    >
      {children}
    </span>
  )
}

interface PlaceholderBoxProps {
  children?: ReactNode
  /** Etiqueta visível; por omissão "Conteúdo a substituir". */
  label?: string
  className?: string
  onDark?: boolean
}

/** Cartão ou bloco inteiro a substituir (testemunhos, projetos, ícones em falta). */
export function PlaceholderBox({ children, label = ui.placeholders.content, className, onDark = false }: PlaceholderBoxProps) {
  return (
    <div
      data-placeholder-box=""
      className={[
        'rounded-md border border-dashed p-5',
        onDark ? 'border-muted-on-dark text-on-dark' : 'border-muted bg-sand/35 text-ink',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <p className={['w-fit max-w-full', onDark ? PLACEHOLDER_LABEL_ON_DARK : PLACEHOLDER_LABEL].join(' ')}>{label}</p>
      {children ? <div className="mt-3">{children}</div> : null}
    </div>
  )
}
