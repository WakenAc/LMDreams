// Motivos "a planta da obra" do hero (design/direcao-visual.md, secção 6): linhas de cota
// com traços a 45° em latão (sem números nem graus), marca em cruz e papel de desenho.
// Tudo decorativo: aria-hidden e sem texto.

interface ClassProps {
  className?: string
}

function cx(...parts: (string | false | undefined)[]): string {
  return parts.filter(Boolean).join(' ')
}

/** Traço a 45° (11 × 11 px) que remata uma linha de cota. */
function Tick({ className }: ClassProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="11"
      height="11"
      viewBox="0 0 11 11"
      className={cx('absolute text-accent', className)}
    >
      <path d="M0.5 10.5 10.5 0.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

/** Pequena cota em latão que antecede a etiqueta do hero. */
export function CotaEtiqueta({ className }: ClassProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="32"
      height="11"
      viewBox="0 0 32 11"
      className={cx('shrink-0 text-accent', className)}
    >
      <g fill="none" stroke="currentColor">
        <path d="M5.5 5.5H26.5" strokeWidth="1" />
        <path d="M0.5 10.5 10.5 0.5M21.5 10.5 31.5 0.5" strokeWidth="1.5" />
      </g>
    </svg>
  )
}

/**
 * Cota horizontal por cima da fotografia (24 px de altura): linha `cota`, linhas de
 * extensão nas arestas da fotografia e traços a 45° em latão nas pontas.
 */
export function CotaHorizontal({ className }: ClassProps) {
  return (
    <div aria-hidden="true" className={cx('relative h-6', className)}>
      <span className="absolute inset-x-0 top-[11px] h-px bg-cota" />
      <span className="absolute top-1 left-0 h-4 w-px bg-cota" />
      <span className="absolute top-1 right-0 h-4 w-px bg-cota" />
      <Tick className="top-[6px] -left-[5px]" />
      <Tick className="top-[6px] -right-[5px]" />
    </div>
  )
}

/**
 * Cota vertical à direita da fotografia (ocupa de 6 a 44 px para lá da aresta).
 * Só se mostra quando a margem lateral tem pelo menos 56 px (decide quem a usa).
 */
export function CotaVertical({ className }: ClassProps) {
  return (
    <div aria-hidden="true" className={cx('absolute inset-y-0 -right-11 w-[38px]', className)}>
      <span className="absolute inset-y-0 left-[26px] w-px bg-cota" />
      <span className="absolute top-0 left-0 h-px w-8 bg-cota" />
      <span className="absolute bottom-0 left-0 h-px w-8 bg-cota" />
      <Tick className="-top-[5px] left-[21px]" />
      <Tick className="-bottom-[5px] left-[21px]" />
    </div>
  )
}

/** Linha de terra: base da linha de confiança, com os traços a 45° nas pontas. */
export function LinhaDeTerra({ className }: ClassProps) {
  return (
    <div aria-hidden="true" className={cx('relative h-px bg-cota', className)}>
      <Tick className="-top-[5px] -left-[5px]" />
      <Tick className="-top-[5px] -right-[5px]" />
    </div>
  )
}

/** Marca em cruz (9 px, latão) das listas com régua. */
export function MarcaCruz({ className }: ClassProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="9"
      height="9"
      viewBox="0 0 9 9"
      className={cx('shrink-0 text-accent', className)}
    >
      <path d="M4.5 0V9M0 4.5H9" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}
