import type { CSSProperties } from 'react'
import { company } from '../../content/company'
import { ui } from '../../content/common'
import { getImage, type PictureAsset } from '../../content/images'
import type { ImageId } from '../../content/tipos'
import { PLACEHOLDER_LABEL } from './Placeholder'
import { PlaceholderArt, type PlaceholderVariant } from './PlaceholderArt'

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
 * Desenho do placeholder SVG de cada imagem (plano B, Parte 4.2): um assunto por imagem,
 * no mesmo traço, para as secções não repetirem o mesmo desenho.
 */
const PLACEHOLDER_VARIANT: Record<ImageId, PlaceholderVariant> = {
  hero: 'planta',
  sobre: 'planta',
  diferenciacao: 'corte',
  'servico-construcao': 'estrutura',
  'servico-cozinhas': 'cozinha',
  'servico-casas-de-banho': 'casa-de-banho',
  'servico-pavimentos': 'pavimento',
  'servico-recuperacao': 'fachada',
  'servico-exteriores': 'exterior',
  transparencia: 'cronograma',
  cta: 'planta',
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
        {/* O fundo do CTA (`fill`) fica numa faixa escura, sob o véu: desenho em `dark`, para a
            faixa não passar a um gradiente cinzento enquanto a fotografia não existir. */}
        <PlaceholderArt variant={PLACEHOLDER_VARIANT[id]} tone={fill ? 'dark' : 'light'} />
        {/* Contorno tracejado de 1 px `muted` (Parte 5.3). Não no fundo do CTA, que fica sob o véu. */}
        {fill ? null : (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-sm border border-dashed border-muted"
          />
        )}
        <figcaption className="absolute inset-x-0 bottom-0 flex justify-center p-4">
          <span className={PLACEHOLDER_LABEL}>{ui.placeholders.image}</span>
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
