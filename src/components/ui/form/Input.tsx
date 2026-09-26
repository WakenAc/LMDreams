import type { InputHTMLAttributes } from 'react'
import { CONTROL_CLASS, cx } from './styles'

type InputProps = InputHTMLAttributes<HTMLInputElement>

/** Campo de texto de 48 px (nome, telefone, e-mail, localização). */
export function Input({ className, type = 'text', ...rest }: InputProps) {
  return <input type={type} className={cx(CONTROL_CLASS, 'h-12 px-3.5', className)} {...rest} />
}
