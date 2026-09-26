import type { TextareaHTMLAttributes } from 'react'
import { CONTROL_CLASS, cx } from './styles'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

/** Área de texto (mensagem), redimensionável na vertical. */
export function Textarea({ className, rows = 5, ...rest }: TextareaProps) {
  return (
    <textarea
      rows={rows}
      className={cx(CONTROL_CLASS, 'min-h-36 resize-y px-3.5 py-3 leading-normal', className)}
      {...rest}
    />
  )
}
