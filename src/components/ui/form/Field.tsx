import type { ReactNode } from 'react'
import { FieldError } from './FieldError'
import { HELP_CLASS, LABEL_CLASS, fieldIds, joinIds } from './styles'

/** Atributos de acessibilidade que o campo passa ao controlo. */
export interface FieldControlProps {
  id: string
  'aria-describedby'?: string
  'aria-invalid'?: true
}

interface FieldProps {
  id: string
  /** Etiqueta visível por cima do controlo, com a obrigatoriedade escrita por extenso. */
  label: ReactNode
  help?: string
  error?: string | readonly string[]
  /** Ids extra para `aria-describedby` (por exemplo, o erro de um grupo). */
  describedBy?: string
  /** Erro vindo de fora (grupo): marca o controlo como inválido sem mostrar a mensagem aqui. */
  invalid?: boolean
  className?: string
  children: (control: FieldControlProps) => ReactNode
}

/**
 * Campo com etiqueta, ajuda e erro (padrão: etiqueta, ajuda, erro e controlo, por esta ordem).
 * O controlo recebe `id`, `aria-describedby` e `aria-invalid`.
 */
export function Field({ id, label, help, error, describedBy, invalid, className, children }: FieldProps) {
  const ids = fieldIds(id)
  const temErro = typeof error === 'string' ? error.length > 0 : (error?.length ?? 0) > 0
  const control: FieldControlProps = {
    id,
    'aria-describedby': joinIds(help ? ids.help : null, temErro ? ids.error : null, describedBy),
    ...(temErro || invalid ? { 'aria-invalid': true as const } : {}),
  }
  return (
    <div className={className}>
      <label htmlFor={id} className={LABEL_CLASS}>
        {label}
      </label>
      {help ? (
        <p id={ids.help} className={HELP_CLASS}>
          {help}
        </p>
      ) : null}
      <FieldError id={ids.error} messages={error} />
      <div className="mt-2">{children(control)}</div>
    </div>
  )
}
