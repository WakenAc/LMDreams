import type { InputHTMLAttributes, ReactNode } from 'react'
import { cx } from './styles'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'children'> {
  id: string
  /** Texto da etiqueta (pode ter ligações); a etiqueta envolve a caixa e o texto. */
  children: ReactNode
}

/**
 * Caixa de verificação nativa de 24 px dentro da própria etiqueta (toda a etiqueta é alvo).
 * O estado inválido usa um anel em `error` (o foco continua a usar o anel global). Em
 * contraste forçado (Windows) as sombras desaparecem: aí o anel é um contorno (outline),
 * que passa à cor do sistema. O erro tem sempre texto (FieldError).
 */
export function Checkbox({ id, children, className, ...rest }: CheckboxProps) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-body text-ink">
      <input
        type="checkbox"
        id={id}
        className={cx(
          'mt-0.5 size-6 shrink-0 cursor-pointer rounded-sm accent-accent',
          'transition-shadow duration-150 ease-planta',
          'aria-[invalid=true]:shadow-[0_0_0_2px_var(--color-error)]',
          'forced-colors:aria-[invalid=true]:outline-2 forced-colors:aria-[invalid=true]:outline-offset-2',
          className,
        )}
        {...rest}
      />
      <span className="min-w-0">{children}</span>
    </label>
  )
}
