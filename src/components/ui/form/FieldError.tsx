import { CircleAlert } from 'lucide-react'

interface FieldErrorProps {
  id: string
  /** Uma ou mais mensagens; sem mensagens não mostra nada. */
  messages: string | readonly string[] | undefined
}

/** Erro de um campo: texto em `error` com ícone (nunca só cor). Ligado por `aria-describedby`. */
export function FieldError({ id, messages }: FieldErrorProps) {
  const lista = typeof messages === 'string' ? [messages] : (messages ?? [])
  if (lista.length === 0) return null
  return (
    <div id={id} data-field-error="" className="mt-2 grid gap-1 text-small font-medium text-error">
      {lista.map((mensagem, i) => (
        <p key={i} className="flex items-start gap-1.5">
          <CircleAlert size={20} strokeWidth={1.5} aria-hidden="true" focusable="false" className="shrink-0" />
          <span className="min-w-0 break-words">{mensagem}</span>
        </p>
      ))}
    </div>
  )
}
