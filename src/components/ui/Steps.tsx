import type { ProcessStep } from '../../content/tipos'
import { PlainText } from './RichText'

// Linha temporal numerada (Partes 3.10 e 5.4 §6): lista ordenada semântica, uma etapa por
// <li> com número em Plex Mono, H3 e texto. As etapas ficam ligadas por uma cadeia de cotas
// decorativa (linhas de 1 px em `cota` e traços a 45 graus em latão, sem números nem graus).
//
// - Abaixo de 1024 px: vertical, com a cota à esquerda. Cada etapa tem uma linha de chamada
//   que aponta para o número; a cota fecha no fim da última etapa.
// - A partir de 1024 px: grelha de 4 colunas (4 x 2 com oito etapas). A cota corre por cima
//   de cada linha da grelha e, no fim da primeira linha, desce pela direita até à seguinte.
//
// Geometria (px, relativa ao <li>): a cota tem 1 px e está a 8 px do topo (linha horizontal)
// ou a 5 px da esquerda (linha vertical); o traço de 11 x 11 fica centrado no ponto da cota.

/** Colunas da grelha a partir de 1024 px. */
const COLS = 4

/** Intervalo entre linhas da grelha a partir de 1024 px (lg:gap-y-14 = 56 px). */
const ROW_GAP = 'lg:gap-y-14'
/** Ligação à linha seguinte: intervalo (56 px) + posição da cota (8 px) + espessura (1 px). */
const CONNECTOR_BOTTOM = 'lg:-bottom-[65px]'

/** Traço a 45 graus em latão (marca de cota). */
function Tick({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 11 11"
      width="11"
      height="11"
      focusable="false"
      className={['absolute size-[11px] text-accent', className].join(' ')}
    >
      <path d="M0.5 10.5 10.5 0.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

interface ChainProps {
  first: boolean
  last: boolean
  /** Última coluna de uma linha com outra linha por baixo: a cota desce pela direita. */
  turnsDown: boolean
}

/** Troço da cadeia de cotas de uma etapa (decorativo). */
function Chain({ first, last, turnsDown }: ChainProps) {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0">
      {/* Cota: vertical à esquerda (telemóvel e tablet), horizontal por cima (computador). */}
      <span
        className={[
          'absolute bottom-0 left-[5px] w-px bg-cota',
          first ? 'top-2' : 'top-0',
          'lg:top-2 lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto',
        ].join(' ')}
      />
      {/* Linha de chamada no início da etapa. */}
      <span className="absolute top-2 left-0 h-px w-[26px] bg-cota lg:top-0.5 lg:h-6 lg:w-px" />
      <Tick className="top-[3px] left-0 lg:-left-[5px]" />
      {/* Fecho da cota no fim da última etapa (só na versão vertical). */}
      {last ? (
        <>
          <span className="absolute bottom-0 left-0 h-px w-[26px] bg-cota lg:hidden" />
          <Tick className="-bottom-[5px] left-0 lg:hidden" />
        </>
      ) : null}
      {/* Ligação entre linhas da grelha (só a partir de 1024 px). */}
      {turnsDown ? (
        <span className={['absolute top-2 right-0 hidden w-px bg-cota lg:block', CONNECTOR_BOTTOM].join(' ')} />
      ) : null}
    </span>
  )
}

interface StepsProps {
  steps: readonly ProcessStep[]
  className?: string
}

/** Linha temporal numerada e acessível (<ol>), sem scroll horizontal em nenhuma largura. */
export function Steps({ steps, className }: StepsProps) {
  const total = steps.length
  return (
    <ol
      data-steps=""
      className={['lg:grid lg:grid-cols-4', ROW_GAP, className].filter(Boolean).join(' ')}
    >
      {steps.map((step, i) => {
        const first = i === 0
        const last = i === total - 1
        const turnsDown = i % COLS === COLS - 1 && i + COLS < total
        return (
          <li
            key={step.number}
            data-step={step.number}
            className={[
              'relative pl-10 lg:pt-10 lg:pr-6 lg:pl-0 xl:pr-8',
              last ? '' : 'pb-10 md:pb-12 lg:pb-0',
            ].join(' ')}
          >
            <Chain first={first} last={last} turnsDown={turnsDown} />
            <div className="grid gap-y-2 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-baseline md:gap-x-10 lg:grid-cols-1">
              <p className="tabular mb-1 font-mono text-step font-medium text-accent-hover md:col-span-2 lg:col-span-1">
                {step.number}
              </p>
              <h3 className="text-h3 text-ink">
                <PlainText text={step.title} />
              </h3>
              <p className="max-w-prose text-muted">
                <PlainText text={step.text} />
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
