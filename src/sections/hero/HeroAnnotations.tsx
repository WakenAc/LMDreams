import type { HeroAnnotation } from '../../content/tipos'

// Anotações numeradas da fotografia do hero (design/direcao-visual.md, secções 1 e 8).
// São uma lista real no DOM (nunca aria-hidden). A partir de 1024 px, com a fotografia
// na proporção do ficheiro, cada item é desenhado sobre o seu ponto (percentagem da
// imagem): alvo circular, linha-guia branca curta e etiqueta. Abaixo disso, os mesmos
// itens aparecem como etiquetas numa linha por baixo da fotografia.

export interface HeroPin extends HeroAnnotation {
  /** Ponto da anotação em percentagem da imagem (0 a 100), ou null se não existir. */
  point: { x: number; y: number } | null
  /** Falso se o ponto fica fora do recorte de telemóvel: o item esconde-se abaixo de 768 px. */
  onMobile?: boolean
}

interface HeroAnnotationsProps {
  label: string
  pins: readonly HeroPin[]
  /** Desenha os itens sobre a fotografia a partir de 1024 px. */
  overlay: boolean
}

/**
 * A etiqueta fica à esquerda do ponto quando cabe desse lado mesmo na fotografia mais
 * estreita em que as anotações aparecem (468 px a 1024 px de janela: etiqueta, linha e
 * alvo ocupam cerca de 166 px, 36% da largura); caso contrário, fica à direita. Assim as
 * etiquetas afastam-se do canto superior direito, onde está a legenda de IA.
 */
const LEFT_MIN_X = 36

const LABEL =
  'inline-flex items-center gap-2 rounded-sm border border-line bg-bg px-2 py-1 font-mono text-caption font-medium text-ink'

const LABEL_OVERLAY = 'lg:whitespace-nowrap lg:border-0 lg:bg-bg/95 lg:px-[9px] lg:py-[5px] lg:leading-none'

export function HeroAnnotations({ label, pins, overlay }: HeroAnnotationsProps) {
  if (pins.length === 0) return null
  return (
    <ul
      aria-label={label}
      className={[
        'mt-3 flex flex-wrap gap-2',
        overlay ? 'lg:pointer-events-none lg:absolute lg:inset-0 lg:mt-0 lg:block' : '',
      ].join(' ')}
    >
      {pins.map((pin) => {
        const point = overlay ? pin.point : null
        const toLeft = point !== null && point.x >= LEFT_MIN_X
        return (
          <li
            key={pin.number}
            // Sem efeito abaixo de 1024 px (o item é estático); posiciona o alvo no ponto.
            style={point ? { left: `${point.x}%`, top: `${point.y}%` } : undefined}
            className={[
              'flex',
              pin.onMobile === false ? 'max-md:hidden' : '',
              point
                ? [
                    'lg:absolute lg:w-max lg:items-center lg:-translate-y-1/2',
                    toLeft ? 'lg:translate-x-[calc(-100%+6px)] lg:flex-row-reverse' : 'lg:-translate-x-[6px]',
                  ].join(' ')
                : '',
            ].join(' ')}
          >
            {point ? (
              <>
                <span
                  aria-hidden="true"
                  className="relative hidden size-3 shrink-0 rounded-full border-[1.5px] border-white bg-ink/35 shadow-[0_0_0_1px_color-mix(in_srgb,var(--color-ink)_30%,transparent)] lg:block"
                >
                  <span className="absolute inset-0 m-auto size-[3px] rounded-full bg-white" />
                </span>
                <span
                  aria-hidden="true"
                  className="hidden h-px w-5 shrink-0 bg-white shadow-[0_1px_0_color-mix(in_srgb,var(--color-ink)_22%,transparent)] lg:block"
                />
              </>
            ) : null}
            <span className={[LABEL, point ? LABEL_OVERLAY : ''].join(' ')}>
              <span className="tabular text-accent">{pin.number}</span>{' '}
              <span>{pin.label}</span>
            </span>
          </li>
        )
      })}
    </ul>
  )
}
