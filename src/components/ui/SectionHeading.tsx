import type { ReactNode } from 'react'
import type { Rich } from '../../content/tipos'
import { RichText } from './RichText'
import { headingId } from './Section'

interface SectionHeadingProps {
  /** Id da secção: o H2 recebe `<id>-titulo` (ligado ao `aria-labelledby`). */
  sectionId: string
  title: ReactNode
  intro?: Rich
  /** Etiqueta pequena em maiúsculas (no máximo uma por cada três secções). */
  eyebrow?: string
  onDark?: boolean
  align?: 'start' | 'center'
  className?: string
}

/** H2 da secção com introdução opcional (largura máxima de 65 caracteres). */
export function SectionHeading({
  sectionId,
  title,
  intro,
  eyebrow,
  onDark = false,
  align = 'start',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={[align === 'center' ? 'mx-auto text-center' : '', 'max-w-[44rem]', className]
        .filter(Boolean)
        .join(' ')}
    >
      {eyebrow ? (
        <p
          className={[
            'mb-4 font-mono text-eyebrow uppercase',
            onDark ? 'text-accent-on-dark' : 'text-muted',
          ].join(' ')}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2 id={headingId(sectionId)} className={['text-h2', onDark ? 'text-on-dark' : 'text-ink'].join(' ')}>
        {title}
      </h2>
      {intro ? (
        <p
          className={[
            'mt-5 max-w-texto text-lead',
            onDark ? 'text-muted-on-dark' : 'text-muted',
          ].join(' ')}
        >
          <RichText value={intro} onDark={onDark} />
        </p>
      ) : null}
    </div>
  )
}
