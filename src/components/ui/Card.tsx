import type { ReactNode } from 'react'

// Cartão com as quatro variantes da Parte 5.2. O conteúdo é composto por cada secção.
export type CardVariant = 'service' | 'differentiator' | 'project' | 'testimonial'

const VARIANTS: Record<CardVariant, string> = {
  // Serviço em destaque: imagem 4:3 em cima, título e descrição por baixo.
  service: 'group flex flex-col gap-4 rounded-md',
  // Diferencial na faixa escura: contorno fino, sem sombra.
  differentiator: 'flex flex-col gap-3 rounded-md border border-line-on-dark p-6 text-on-dark',
  // Projeto: capa, categoria e botão para o detalhe.
  project: 'group flex flex-col overflow-hidden rounded-md border border-line bg-bg',
  // Testemunho: bloco de texto com contorno.
  testimonial: 'flex flex-col gap-4 rounded-md border border-line bg-bg p-6',
}

type CardElement = 'article' | 'li' | 'div'

interface CardProps {
  variant: CardVariant
  as?: CardElement
  children: ReactNode
  className?: string
  /** Atributos de dados para testes e verificações (ex.: data-project). */
  data?: Record<`data-${string}`, string>
}

export function Card({ variant, as: Tag = 'article', children, className, data }: CardProps) {
  return (
    <Tag className={[VARIANTS[variant], className].filter(Boolean).join(' ')} {...data}>
      {children}
    </Tag>
  )
}
