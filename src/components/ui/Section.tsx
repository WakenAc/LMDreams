import type { ReactNode } from 'react'
import type { AnchorId } from '../../lib/pages'

export type SectionTone = 'bg' | 'surface' | 'dark'

const TONES: Record<SectionTone, string> = {
  bg: 'bg-bg text-ink',
  surface: 'bg-surface text-ink',
  dark: 'bg-dark text-on-dark',
}

interface SectionProps {
  id: AnchorId | string
  children: ReactNode
  tone?: SectionTone
  className?: string
  /** Sem o padding vertical por omissão (o hero e o CTA definem o seu). */
  flush?: boolean
}

/** Id do título de uma secção, usado em `aria-labelledby`. */
export function headingId(sectionId: string): string {
  return `${sectionId}-titulo`
}

/** Secção com `id` (âncora) e `aria-labelledby` ligado ao seu H2. */
export function Section({ id, children, tone = 'bg', className, flush = false }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={headingId(id)}
      className={[TONES[tone], flush ? '' : 'section-y', 'relative', className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </section>
  )
}
