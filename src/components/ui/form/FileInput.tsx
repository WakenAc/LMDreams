import { ImageIcon } from 'lucide-react'
import { useEffect, useRef, type ChangeEvent, type InputHTMLAttributes } from 'react'
import { Button } from '../Button'
import { VisuallyHidden } from '../VisuallyHidden'

interface FileInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange' | 'children'> {
  id: string
  /** Ficheiros aceites (a validação é feita por quem usa o componente). */
  files: readonly File[]
  /** Ficheiros acabados de escolher (a juntar aos que já estavam). */
  onFilesSelected: (novos: File[]) => void
  onRemove: (index: number) => void
  /** Título visível da lista de ficheiros escolhidos. */
  listLabel: string
  /** Texto visível do botão de remover (o nome do ficheiro junta-se só para leitores de ecrã). */
  removeLabel: string
}

const INPUT_CLASS =
  'block h-12 w-full cursor-pointer rounded-sm border border-muted bg-bg p-[5px] text-small text-muted ' +
  'transition-[border-color,box-shadow] duration-150 ease-planta hover:border-ink ' +
  'disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-muted ' +
  'aria-[invalid=true]:border-error aria-[invalid=true]:shadow-[inset_0_0_0_1px_var(--color-error)] ' +
  'file:mr-3 file:h-9 file:cursor-pointer file:rounded-sm file:border-0 file:bg-transparent file:px-4 ' +
  'file:font-body file:text-[0.9375rem] file:font-semibold file:text-ink ' +
  'file:shadow-[inset_0_0_0_1px_var(--color-ink)] file:transition-colors file:duration-150 hover:file:bg-surface'

/** Põe no controlo nativo os ficheiros da lista (sem DataTransfer, limpa-o quando a lista fica vazia). */
function sincronizar(input: HTMLInputElement, files: readonly File[]): void {
  try {
    const transferencia = new DataTransfer()
    for (const ficheiro of files) transferencia.items.add(ficheiro)
    input.files = transferencia.files
  } catch {
    if (files.length === 0) input.value = ''
  }
}

/**
 * Campo de fotografias com lista e botão para remover cada uma. O controlo nativo fica
 * sincronizado com a lista (DataTransfer), para mostrar sempre o número certo de ficheiros.
 */
export function FileInput({
  id,
  files,
  onFilesSelected,
  onRemove,
  listLabel,
  removeLabel,
  className,
  disabled,
  ...rest
}: FileInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const focoPendente = useRef<number | null>(null)
  const listId = `${id}-lista`

  // O controlo nativo passa a refletir a lista (escolhas acumuladas e remoções).
  useEffect(() => {
    if (inputRef.current) sincronizar(inputRef.current, files)
  }, [files])

  // Depois de remover, o foco passa para o botão seguinte (ou para o campo, se a lista ficou vazia).
  useEffect(() => {
    const indice = focoPendente.current
    if (indice === null) return
    focoPendente.current = null
    const botoes = listRef.current?.querySelectorAll('button')
    const alvo = files.length > 0 && botoes ? botoes[Math.min(indice, botoes.length - 1)] : inputRef.current
    alvo?.focus()
  }, [files])

  // A janela de escolha substitui a seleção nativa: os ficheiros escolhidos juntam-se à lista
  // (quem usa o componente devolve uma lista nova, que volta a ser sincronizada). Se a escolha
  // for cancelada, o controlo volta já a mostrar a lista atual.
  function aoEscolher(event: ChangeEvent<HTMLInputElement>): void {
    const input = event.currentTarget
    const novos = Array.from(input.files ?? [])
    if (novos.length > 0) onFilesSelected(novos)
    else sincronizar(input, files)
  }

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        id={id}
        multiple
        className={INPUT_CLASS}
        onChange={aoEscolher}
        disabled={disabled}
        {...rest}
      />
      {files.length > 0 ? (
        <div className="mt-4">
          <p id={listId} className="text-small font-medium text-ink">
            {listLabel}
          </p>
          <ul ref={listRef} aria-labelledby={listId} className="mt-2 border-t border-line">
            {files.map((ficheiro, i) => (
              <li
                key={`${ficheiro.name}-${ficheiro.size}-${ficheiro.lastModified}`}
                className="flex items-center gap-3 border-b border-line py-2"
              >
                <ImageIcon size={20} strokeWidth={1.5} aria-hidden="true" focusable="false" className="shrink-0 text-muted" />
                <span className="min-w-0 flex-1 text-small break-all text-ink">{ficheiro.name}</span>
                <Button
                  variant="secondary"
                  className="shrink-0"
                  disabled={disabled}
                  onClick={() => {
                    focoPendente.current = i
                    onRemove(i)
                  }}
                >
                  {removeLabel}
                  <VisuallyHidden> {ficheiro.name}</VisuallyHidden>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
