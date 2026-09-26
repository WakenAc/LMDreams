import { CircleAlert, CircleCheck, Mail } from 'lucide-react'
import type { ReactNode } from 'react'
import { VisuallyHidden } from '../VisuallyHidden'
import { cx } from './styles'

export type FormStatusTone = 'info' | 'success' | 'error'

interface FormStatusProps {
  /** 'status' (role="status", anúncio educado) para sucesso e informação; 'alert' (role="alert") para erros. */
  kind: 'status' | 'alert'
  tone?: FormStatusTone
  /** Só para tecnologias de apoio (por exemplo, "A enviar…", que já está visível no botão). */
  visuallyHidden?: boolean
  children?: ReactNode
  /** Classes da caixa visível (por exemplo, a margem); a região vazia não ocupa espaço. */
  className?: string
}

const ICONS = { info: Mail, success: CircleCheck, error: CircleAlert } as const

/**
 * Região viva do formulário. Está sempre no DOM (vazia) para que as mudanças sejam anunciadas;
 * só ganha caixa e ícone quando tem conteúdo. O elemento exterior nunca muda (a região mantém-se).
 */
export function FormStatus({ kind, tone = 'info', visuallyHidden = false, children, className }: FormStatusProps) {
  const temConteudo = children !== null && children !== undefined && children !== false && children !== ''
  const Icone = ICONS[tone]
  let conteudo: ReactNode = null
  if (temConteudo && visuallyHidden) {
    conteudo = <VisuallyHidden>{children}</VisuallyHidden>
  } else if (temConteudo) {
    conteudo = (
      <div
        data-form-status={tone}
        className={cx(
          'flex items-start gap-3 rounded-sm border p-4 text-body text-ink',
          tone === 'error' ? 'border-error bg-bg' : 'border-line bg-surface',
          className,
        )}
      >
        <Icone
          size={24}
          strokeWidth={1.5}
          aria-hidden="true"
          focusable="false"
          className={cx('shrink-0', tone === 'error' ? 'text-error' : 'text-accent-hover')}
        />
        <div className="min-w-0 break-words">{children}</div>
      </div>
    )
  }
  return (
    <div role={kind} data-form-region={kind}>
      {conteudo}
    </div>
  )
}
