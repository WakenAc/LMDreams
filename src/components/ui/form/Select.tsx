import { ChevronDown } from 'lucide-react'
import type { ReactNode, SelectHTMLAttributes } from 'react'
import { CONTROL_CLASS, cx } from './styles'

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  children: ReactNode
}

/** Lista nativa de 48 px com seta decorativa (tipo de serviço, orçamento previsto). */
export function Select({ className, children, ...rest }: SelectProps) {
  return (
    <div className="relative">
      <select
        className={cx(CONTROL_CLASS, 'h-12 cursor-pointer appearance-none truncate pr-11 pl-3.5', className)}
        {...rest}
      >
        {children}
      </select>
      <ChevronDown
        size={20}
        strokeWidth={1.5}
        aria-hidden="true"
        focusable="false"
        className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-ink"
      />
    </div>
  )
}
