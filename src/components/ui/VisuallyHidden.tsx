import type { ReactNode } from 'react'

/** Texto só para tecnologias de apoio (continua no DOM e é lido pelos leitores de ecrã). */
export function VisuallyHidden({ children }: { children: ReactNode }) {
  return <span className="sr-only">{children}</span>
}
