import { useId, useState } from 'react'
import { ui } from '../../content/common'
import { projectsSection } from '../../content/projects'
import type { ProjectPhoto } from '../../content/tipos'
import { withBase } from '../../lib/links'

// Galeria antes e depois dos projetos (Partes 3.10 e 5.4 §7). Com fotografias reais dos
// dois lados, cada par tem um comparador operável por teclado (<input type="range">,
// etiqueta e aria-valuetext). Sem fotografias, mostra dois placeholders gerados em código
// (nunca imagens de IA) e o texto a explicar que ainda não foram publicadas.

/** Caminho da fotografia: URLs, data: e caminhos absolutos ficam iguais; os relativos levam o base path. */
function photoSrc(src: string): string {
  return /^(?:[a-z][a-z\d+.-]*:|\/)/i.test(src) ? src : withBase(src)
}

interface PhotoImageProps {
  photo: ProjectPhoto
  className?: string
}

/** Fotografia real de um projeto (autorizada pelo cliente), com o alt e as dimensões do conteúdo. */
export function PhotoImage({ photo, className }: PhotoImageProps) {
  return (
    <img
      src={photoSrc(photo.src)}
      alt={photo.alt}
      width={photo.width}
      height={photo.height}
      loading="lazy"
      decoding="async"
      className={className}
    />
  )
}

export type PlaceholderDrawing = 'plan' | 'before' | 'after'

/** Planta simples em linhas finas sobre `sand` (decorativa). */
function PlanArt({ drawing, className }: { drawing: PlaceholderDrawing; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className={['absolute inset-0 h-full w-full [&_*]:[vector-effect:non-scaling-stroke]', className]
        .filter(Boolean)
        .join(' ')}
    >
      <rect width="400" height="300" className="fill-sand" />
      {/* Paredes */}
      <g fill="none" className="stroke-muted" strokeOpacity={0.55} strokeWidth={2}>
        <path d="M64 60H336V240H64Z" />
        {drawing === 'after' ? null : <path d="M208 60V132M208 176V240" />}
        {drawing === 'before' ? <path d="M64 164H148V240" strokeDasharray="6 5" /> : null}
      </g>
      {/* Janelas */}
      <g className="fill-sand stroke-muted" strokeOpacity={0.55} strokeWidth={1}>
        <path d="M108 56h72v8h-72z" />
        <path d="M332 156h8v52h-8z" />
      </g>
      <path d="M108 60h72M336 156v52" fill="none" className="stroke-muted" strokeOpacity={0.55} strokeWidth={1} />
      {/* Porta, bancadas e ilha */}
      <g fill="none" className="stroke-cota" strokeWidth={1}>
        {drawing === 'after' ? (
          <>
            <path d="M76 72H200V96H100V184H76Z" />
            <path d="M240 128h72v40h-72z" />
          </>
        ) : (
          <>
            <path d="M208 176H252" />
            <path d="M252 176A44 44 0 0 0 208 132" />
          </>
        )}
        {drawing === 'plan' ? (
          <>
            <path d="M224 72h100v22H224z" />
            <path d="M258 76h28v14h-28z" />
          </>
        ) : null}
      </g>
    </svg>
  )
}

interface PhotoPlaceholderProps {
  drawing?: PlaceholderDrawing
  /** Rótulo visível no canto superior esquerdo (ex.: "Antes"). */
  label?: string
  /** Classes do enquadramento (proporção, raio). */
  className?: string
  /** Classes do desenho (ex.: zoom de 2% em hover). */
  artClassName?: string
}

/** Imagem em falta gerada em código, com a etiqueta "Imagem a substituir" (Parte 5.3). */
export function PhotoPlaceholder({ drawing = 'plan', label, className, artClassName }: PhotoPlaceholderProps) {
  return (
    <figure
      data-photo-placeholder={drawing}
      className={['relative overflow-hidden bg-sand', className].filter(Boolean).join(' ')}
    >
      <PlanArt drawing={drawing} className={artClassName} />
      <figcaption className="absolute inset-0 flex flex-col items-start gap-2 p-2 sm:p-3">
        {label ? (
          <span className="rounded-sm bg-bg px-2 py-0.5 text-small font-semibold text-ink">{label}</span>
        ) : null}
        <span className="mt-auto max-w-full self-center rounded-sm border border-dashed border-muted bg-bg/90 px-2.5 py-1 text-center font-mono text-caption text-ink">
          {ui.placeholders.image}
        </span>
      </figcaption>
    </figure>
  )
}

interface ComparatorProps {
  before: ProjectPhoto
  after: ProjectPhoto
}

/**
 * Comparador de um par: "antes" por baixo, à esquerda da linha; "depois" por cima, recortado
 * a partir da linha. O valor do controlo é a percentagem da largura que mostra "antes".
 */
function Comparator({ before, after }: ComparatorProps) {
  const t = projectsSection.dialog
  const [value, setValue] = useState(50)
  const inputId = useId()
  const valueText = t.sliderValueText.replace('{antes}', String(value)).replace('{depois}', String(100 - value))

  return (
    <div data-comparator="" className="flex flex-col gap-3">
      <div
        className="relative overflow-hidden rounded-sm bg-sand"
        style={{ aspectRatio: `${after.width} / ${after.height}` }}
      >
        <PhotoImage photo={before} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${value}%)` }}>
          <PhotoImage photo={after} className="h-full w-full object-cover" />
        </div>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 w-[3px] -translate-x-1/2 border-x border-ink/30 bg-white"
          style={{ left: `${value}%` }}
        />
      </div>
      <div>
        <label htmlFor={inputId} className="text-small font-medium text-ink">
          {t.sliderLabel}
        </label>
        <div className="mt-1 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 text-small font-semibold text-ink">
          <span>{t.beforeLabel}</span>
          <input
            id={inputId}
            type="range"
            min={0}
            max={100}
            step={1}
            value={value}
            aria-valuetext={valueText}
            onChange={(event) => setValue(Number(event.currentTarget.value))}
            className="h-11 w-full cursor-pointer accent-accent"
          />
          <span>{t.afterLabel}</span>
        </div>
      </div>
    </div>
  )
}

interface BeforeAfterProps {
  before: readonly ProjectPhoto[]
  after: readonly ProjectPhoto[]
  className?: string
}

export function BeforeAfter({ before, after, className }: BeforeAfterProps) {
  const t = projectsSection.dialog

  if (before.length === 0 && after.length === 0) {
    return (
      <div data-before-after="sem-fotografias" className={className}>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <PhotoPlaceholder drawing="before" label={t.beforeLabel} className="aspect-[4/3] rounded-sm" />
          <PhotoPlaceholder drawing="after" label={t.afterLabel} className="aspect-[4/3] rounded-sm" />
        </div>
        <p className="mt-4 max-w-prose text-small text-muted">{t.noPhotos}</p>
      </div>
    )
  }

  const pairs = before.flatMap((b, i) => {
    const a = after[i]
    return a ? [{ before: b, after: a }] : []
  })
  // Fotografias sem par (só "antes" ou só "depois"): mostram-se sem comparador.
  const singles = [
    ...before.slice(pairs.length).map((photo) => ({ photo, label: t.beforeLabel })),
    ...after.slice(pairs.length).map((photo) => ({ photo, label: t.afterLabel })),
  ]

  return (
    <div data-before-after="" className={['flex flex-col gap-8', className].filter(Boolean).join(' ')}>
      {pairs.map((pair) => (
        <Comparator key={`${pair.before.src}|${pair.after.src}`} before={pair.before} after={pair.after} />
      ))}
      {singles.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2">
          {singles.map(({ photo, label }, i) => (
            <li key={`${i}-${photo.src}`}>
              <figure className="flex flex-col gap-2">
                <div className="overflow-hidden rounded-sm bg-sand">
                  <PhotoImage photo={photo} className="h-auto w-full" />
                </div>
                <figcaption className="text-small font-semibold text-ink">{label}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
