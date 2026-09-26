import type { ReactNode } from 'react'

interface ContainerProps {
  children: ReactNode
  className?: string
}

/** Contentor de 1272 px com margens laterais de 16, 24 e 32 px. */
export function Container({ children, className }: ContainerProps) {
  return <div className={['container-site', className].filter(Boolean).join(' ')}>{children}</div>
}
