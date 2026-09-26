import { X } from 'lucide-react'
import { useEffect, useId, useRef, type ReactNode, type RefObject } from 'react'
import { ui } from '../../content/common'
import { Button } from './Button'

// Diálogo modal com <dialog> nativo e showModal() (Parte 3.10): título ligado ao nome
// acessível, botão de fechar, Esc fecha (nativo), clique no fundo fecha, o foco volta ao
// elemento que o abriu. Raio de 6 px, shadow-dialog e scroll interno em ecrãs baixos.
// Só deve ser montado no cliente (depois de uma ação do utilizador): nunca entra no HTML
// pré-renderizado, para não criar conteúdo duplicado nem títulos a mais.

interface DialogProps {
  open: boolean
  /** Chamado sempre que o diálogo fecha (Esc, botão de fechar, fundo ou `open` a falso). */
  onClose: () => void
  /** Título visível (H2) e nome acessível do diálogo. */
  title: ReactNode
  children: ReactNode
  /** Recebe o foco ao fechar; por omissão, o elemento que tinha o foco ao abrir. */
  returnFocusRef?: RefObject<HTMLElement | null>
  className?: string
  /** Atributos de dados para testes e verificações. */
  data?: Record<`data-${string}`, string>
}

const PANEL = [
  'm-auto flex-col overflow-hidden rounded-lg border border-line bg-bg p-0 text-ink shadow-dialog open:flex',
  'w-[calc(100%_-_1rem)] max-w-4xl max-h-[calc(100dvh_-_1rem)]',
  'sm:w-[calc(100%_-_3rem)] sm:max-h-[calc(100dvh_-_3rem)]',
  'backdrop:bg-[rgb(26_34_44/0.6)]',
  'transition-[opacity,translate] duration-250 ease-planta starting:open:translate-y-2 starting:open:opacity-0',
].join(' ')

export function Dialog({ open, onClose, title, children, returnFocusRef, className, data }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) {
      previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  // Clique no fundo (::backdrop): só fecha se o clique começar e acabar fora do painel
  // (arrastar o controlo deslizante ou selecionar texto até ao fundo não fecha).
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    let pressedOnBackdrop = false
    const onPointerDown = (event: PointerEvent) => {
      pressedOnBackdrop = event.target === dialog
    }
    const onClick = (event: MouseEvent) => {
      if (pressedOnBackdrop && event.target === dialog) dialog.close()
      pressedOnBackdrop = false
    }
    dialog.addEventListener('pointerdown', onPointerDown)
    dialog.addEventListener('click', onClick)
    return () => {
      dialog.removeEventListener('pointerdown', onPointerDown)
      dialog.removeEventListener('click', onClick)
    }
  }, [])

  function handleClose() {
    onClose()
    const target = returnFocusRef?.current ?? previousFocus.current
    if (target?.isConnected) target.focus()
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={handleClose}
      className={[PANEL, className].filter(Boolean).join(' ')}
      {...data}
    >
      <div className="flex shrink-0 items-start justify-between gap-4 border-b border-line px-4 py-3 sm:px-6 sm:py-4">
        <h2 id={titleId} className="min-w-0 pt-2 text-h3 text-ink">
          {title}
        </h2>
        <Button
          variant="secondary"
          className="shrink-0"
          icon={<X size={20} strokeWidth={1.5} aria-hidden="true" focusable="false" />}
          onClick={() => ref.current?.close()}
        >
          <span className="max-sm:sr-only">{ui.a11y.close}</span>
        </Button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-6 sm:px-6 sm:py-8">{children}</div>
    </dialog>
  )
}
