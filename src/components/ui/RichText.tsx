import { Fragment, type ReactNode } from 'react'
import { ui } from '../../content/common'
import type { Rich, Seg } from '../../content/tipos'
import { isExternal, pageHref } from '../../lib/links'
import { splitPlaceholders } from '../../lib/placeholders'
import { PlaceholderText } from './Placeholder'
import { VisuallyHidden } from './VisuallyHidden'

interface RichTextProps {
  value: Rich
  onDark?: boolean
  /** Classes das ligações (por omissão sublinhadas). */
  linkClassName?: string
}

/** Texto com placeholders realçados automaticamente. */
export function PlainText({ text, onDark = false }: { text: string; onDark?: boolean }) {
  const parts = splitPlaceholders(text)
  if (parts.length === 1 && !parts[0]?.placeholder) return <>{text}</>
  return (
    <>
      {parts.map((p, i) =>
        p.placeholder ? (
          <PlaceholderText key={i} onDark={onDark}>
            {p.text}
          </PlaceholderText>
        ) : (
          <Fragment key={i}>{p.text}</Fragment>
        ),
      )}
    </>
  )
}

const LINK = 'underline decoration-1 underline-offset-[3px] hover:decoration-2'

function renderSeg(seg: Seg, i: number, onDark: boolean, linkClassName: string): ReactNode {
  if (typeof seg === 'string') return <PlainText key={i} text={seg} onDark={onDark} />
  if ('strong' in seg) {
    return (
      <strong key={i} className="font-semibold">
        <PlainText text={seg.strong} onDark={onDark} />
      </strong>
    )
  }
  if ('page' in seg) {
    return (
      <a key={i} href={pageHref(seg.page, seg.hash)} className={linkClassName}>
        {seg.text}
      </a>
    )
  }
  const external = isExternal(seg.href)
  return (
    <a
      key={i}
      href={seg.href}
      className={linkClassName}
      {...(external ? { target: '_blank', rel: 'noopener' } : {})}
    >
      {seg.text}
      {external ? <VisuallyHidden> {ui.a11y.newWindow}</VisuallyHidden> : null}
    </a>
  )
}

/** Mostra um valor `Rich` (texto ou segmentos com ligações e ênfase). */
export function RichText({ value, onDark = false, linkClassName = LINK }: RichTextProps) {
  if (typeof value === 'string') return <PlainText text={value} onDark={onDark} />
  return <>{value.map((seg, i) => renderSeg(seg, i, onDark, linkClassName))}</>
}
