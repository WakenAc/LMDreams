import type { CSSProperties } from 'react'
import { company } from '../../content/company'
import { ui } from '../../content/common'
import { getImage, type PictureAsset } from '../../content/images'
import type { ImageId } from '../../content/tipos'

// Imagem otimizada do registo (Partes 3.7 e 4.8): <picture> com AVIF e WebP, `img`
// com width, height, sizes e alt. Imagens geradas por IA levam a legenda visível
// "Imagem ilustrativa gerada por IA" em texto real (nunca aria-hidden nem só em hover).

export type CaptionPosition = 'top-right' | 'bottom-right'

interface PictureProps {
  id: ImageId
  /** Classes do enquadramento (ex.: 'aspect-[4/5] lg:aspect-[4/3]'). Sem elas, usa a proporção do ficheiro. */
  frameClassName?: string
  className?: string
  imgClassName?: string
  /** Hero: carregamento imediato e prioridade alta. As restantes são lazy. */
  priority?: boolean
  caption?: CaptionPosition
  /** Preenche o contentor (imagem de fundo do CTA). */
  fill?: boolean
  objectPosition?: string
  sizes?: string
  /** `sizes` da variante de telemóvel (< 768 px), quando existe. Por omissão, 100vw. */
  mobileSizes?: string
}

const CAPTION: Record<CaptionPosition, string> = {
  'top-right': 'top-3 right-3',
  'bottom-right': 'bottom-3 right-3',
}

const FORMAT_ORDER = ['avif', 'webp', 'jpeg', 'jpg', 'png']

function mime(format: string): string {
  return format === 'jpg' ? 'image/jpeg' : `image/${format}`
}

function fallbackFormat(asset: PictureAsset): string {
  const ext = asset.img.src.split('?')[0]?.split('.').pop()?.toLowerCase() ?? 'jpg'
  return ext === 'jpeg' ? 'jpg' : ext
}

/**
 * Srcset do formato de recurso, com as larguras todas. O vite-imagetools regista o JPEG
 * com a chave 'jpeg' (e não 'jpg'): sem este alias, o <img> ficava só com o maior ficheiro
 * e as outras larguras eram publicadas sem uso (Parte 4.8).
 */
function fallbackSrcset(asset: PictureAsset): string | undefined {
  const fb = fallbackFormat(asset)
  return asset.sources[fb] ?? (fb === 'jpg' ? asset.sources['jpeg'] : undefined)
}

function orderedSources(asset: PictureAsset): [string, string][] {
  const fb = fallbackFormat(asset)
  return Object.entries(asset.sources)
    .filter(([format]) => format !== fb && !(fb === 'jpg' && format === 'jpeg'))
    .toSorted(([a], [b]) => FORMAT_ORDER.indexOf(a) - FORMAT_ORDER.indexOf(b))
}

/**
 * Placeholder SVG com linhas de planta sobre tons de pedra (plano B, Parte 4.2). Sem papel
 * de desenho nem cotas: esses motivos ficam só no Hero e no Método (direção visual,
 * secções 6 e 11).
 */
function PlaceholderArt() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 400 300"
    >
      <rect width="400" height="300" fill="#d6d2c7" />
      <g fill="none" stroke="#4a5361" strokeOpacity="0.45" strokeWidth="1.2">
        <path d="M60 60H340V240H60Z" />
        <path d="M60 150H190V240M190 60V120M250 150H340M250 150V240" />
        <path d="M190 120a30 30 0 0 1 30 30" />
        <path d="M110 240v-14h40v14" />
      </g>
    </svg>
  )
}

export function Picture({
  id,
  frameClassName,
  className,
  imgClassName,
  priority = false,
  caption = 'top-right',
  fill = false,
  objectPosition,
  sizes,
  mobileSizes = '100vw',
}: PictureProps) {
  const entry = getImage(id)
  const [rw, rh] = entry.ratio
  const frameStyle: CSSProperties | undefined =
    fill || frameClassName ? undefined : { aspectRatio: `${rw} / ${rh}` }
  const frame = [
    fill ? 'absolute inset-0 h-full w-full overflow-hidden' : 'relative overflow-hidden rounded-sm',
    frameClassName,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (!entry.picture) {
    return (
      <figure data-image-placeholder={id} className={frame} style={frameStyle}>
        <PlaceholderArt />
        {/* Contorno tracejado de 1 px `muted` (Parte 5.3). Não no fundo do CTA, que fica sob o véu. */}
        {fill ? null : (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-sm border border-dashed border-muted"
          />
        )}
        <figcaption className="absolute inset-x-0 bottom-0 flex justify-center p-4">
          <span className="rounded-sm border border-dashed border-muted bg-bg/90 px-2.5 py-1 font-mono text-caption text-ink">
            {ui.placeholders.image}
          </span>
        </figcaption>
      </figure>
    )
  }

  const asset = entry.picture
  const sizesAttr = sizes ?? entry.sizes
  const imgStyle: CSSProperties | undefined = objectPosition ? { objectPosition } : undefined

  return (
    <figure data-ai-image={entry.ilustrativa ? '' : undefined} className={frame} style={frameStyle}>
      <picture>
        {entry.mobile
          ? orderedSources(entry.mobile).map(([format, srcset]) => (
              <source
                key={`m-${format}`}
                media="(max-width: 767px)"
                type={mime(format)}
                srcSet={srcset}
                sizes={mobileSizes}
              />
            ))
          : null}
        {entry.mobile ? (
          <source
            media="(max-width: 767px)"
            type={mime(fallbackFormat(entry.mobile))}
            srcSet={fallbackSrcset(entry.mobile) ?? entry.mobile.img.src}
            sizes={mobileSizes}
          />
        ) : null}
        {orderedSources(asset).map(([format, srcset]) => (
          <source key={format} type={mime(format)} srcSet={srcset} sizes={sizesAttr} />
        ))}
        <img
          src={asset.img.src}
          srcSet={fallbackSrcset(asset)}
          sizes={sizesAttr}
          width={asset.img.w}
          height={asset.img.h}
          alt={entry.alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : undefined}
          data-ilustrativa={entry.ilustrativa ? 'true' : undefined}
          data-image-id={id}
          className={['h-full w-full object-cover', imgClassName].filter(Boolean).join(' ')}
          style={imgStyle}
        />
      </picture>
      {entry.ilustrativa ? (
        <figcaption
          data-ai-caption=""
          className={[
            'absolute z-10 rounded-sm bg-dark/86 px-[9px] py-[6px] font-mono text-caption text-on-dark',
            CAPTION[caption],
          ].join(' ')}
        >
          {company.aiImageLabel}
        </figcaption>
      ) : null}
    </figure>
  )
}
