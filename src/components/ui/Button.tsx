import { ArrowRight } from 'lucide-react'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { ui } from '../../content/common'
import { isExternal } from '../../lib/links'
import { VisuallyHidden } from './VisuallyHidden'

// Sistema único de botões (Partes 5.2 e 5.3): primário, secundário e ligação com seta;
// tamanhos md (44 px) e lg (52 px); estados hover, ativo, foco visível e desativado.

export type ButtonVariant = 'primary' | 'secondary' | 'link'
export type ButtonSize = 'md' | 'lg'

interface CommonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Faixas escuras: secundário e ligação em `on-dark`. */
  onDark?: boolean
  /** Ocupa a largura toda (botões empilhados em telemóvel). */
  block?: boolean
  /** Ícone à esquerda do texto (decorativo). */
  icon?: ReactNode
  children: ReactNode
  className?: string
}

type AnchorProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'> & { href: string }
type NativeButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & { href?: undefined }

export type ButtonProps = AnchorProps | NativeButtonProps

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-sm font-body font-semibold text-center leading-tight ' +
  'transition-[background-color,color,box-shadow] duration-150 ease-planta ' +
  'disabled:cursor-not-allowed disabled:opacity-60 aria-disabled:cursor-not-allowed aria-disabled:opacity-60'

const SIZES: Record<ButtonSize, string> = {
  md: 'min-h-11 px-5 py-2 text-[0.9375rem]',
  lg: 'min-h-12 px-6 py-3 text-base md:min-h-13',
}

function variantClass(variant: ButtonVariant, onDark: boolean): string {
  if (variant === 'primary') return 'bg-accent text-white hover:bg-accent-hover active:bg-accent-hover'
  if (variant === 'secondary') {
    return onDark
      ? 'text-on-dark shadow-[inset_0_0_0_1px_var(--color-on-dark)] hover:bg-white/10 active:bg-white/15'
      : 'text-ink shadow-[inset_0_0_0_1px_var(--color-ink)] hover:bg-surface active:bg-sand/60'
  }
  return [
    'underline-offset-4 decoration-1 hover:underline focus-visible:underline',
    onDark ? 'text-on-dark' : 'text-ink',
  ].join(' ')
}

// A ligação com seta mantém o alvo de toque de 44 px, sem padding lateral.
const LINK_SIZE = 'min-h-11 py-2 text-[0.9375rem]'

export function buttonClassName({
  variant = 'primary',
  size = 'md',
  onDark = false,
  block = false,
  className,
}: Pick<CommonProps, 'variant' | 'size' | 'onDark' | 'block' | 'className'>): string {
  const sizeClass = variant === 'link' ? LINK_SIZE : SIZES[size]
  return [BASE, sizeClass, variantClass(variant, onDark), block ? 'w-full' : '', className]
    .filter(Boolean)
    .join(' ')
}

export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', onDark = false, block = false, icon, children, className, ...rest } = props
  const cls = buttonClassName({ variant, size, onDark, block, className })
  const content = (
    <>
      {icon ? <span className="shrink-0 [&>svg]:size-5">{icon}</span> : null}
      <span>{children}</span>
      {variant === 'link' ? <ArrowRight size={20} strokeWidth={1.5} aria-hidden="true" className="shrink-0" /> : null}
    </>
  )

  if (typeof rest.href === 'string') {
    const { href, ...anchorRest } = rest as Omit<AnchorProps, keyof CommonProps>
    const external = isExternal(href)
    return (
      <a
        href={href}
        className={cls}
        {...(external ? { target: '_blank', rel: 'noopener' } : {})}
        {...anchorRest}
      >
        {content}
        {external ? <VisuallyHidden> {ui.a11y.newWindow}</VisuallyHidden> : null}
      </a>
    )
  }

  const { type = 'button', ...buttonRest } = rest as Omit<NativeButtonProps, keyof CommonProps>
  return (
    // oxlint-disable-next-line react/button-has-type
    <button type={type} className={cls} {...buttonRest}>
      {content}
    </button>
  )
}
