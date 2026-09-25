import { ui } from '../content/common'
import { hero } from '../content/hero'
import { getImage } from '../content/images'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { Picture } from '../components/ui/Picture'
import { headingId, Section } from '../components/ui/Section'
import { quoteLinkProps } from '../lib/quote-links'
import { HeroAnnotations, type HeroPin } from './hero/HeroAnnotations'
import { CotaEtiqueta, CotaHorizontal, CotaVertical, LinhaDeTerra, MarcaCruz } from './hero/motivos'

// Hero (Partes 5.3 e 5.4 §2; design/direcao-visual.md, secção 8). Cabe no primeiro ecrã:
// a 1280 × 720 e a 390 × 844, título, subtítulo, botões, linha de confiança e legenda de
// IA ficam visíveis sem scroll e acima da barra de contacto móvel.
// Contas (px, a partir do topo da janela):
// - 1280 × 720: cabeçalho 72; padding 36 (5vh); etiqueta 16 + 20; H1 2 × 68,5; intervalo
//   32 (4,5vh); corpo 20 + subtítulo 3 × 30 + 32 + botões 52 + 24 + confiança 3 × 38.
//   Conteúdo 639 em 648 (centrado). Fim da linha de confiança ≈ 650; legenda de IA
//   ≈ 354 a 383 (fotografia 596 × 337 com a cota de 24 por cima).
// - 390 × 844: cabeçalho 64; 20; etiqueta 2 × 16 + 12; H1 3 × 36,7; 16; subtítulo
//   3 × 23,3; 24; botões 48 + 12 + 48; 20; confiança 3 × 34. Fim da confiança ≈ 578;
//   legenda de IA ≈ 647 a 676 (mesmo com H1 e subtítulo em 4 linhas, ≈ 736); a barra
//   móvel começa em 783 (844 − 61).
// Em computador, os espaçamentos verticais encolhem com a altura da janela (vh) e, até
// 680 px de altura, reduzem-se mais um pouco.

// Tamanho real da fotografia: 6 colunas a partir de 1024 px (624 px no contentor máximo).
const HERO_SIZES = '(min-width: 1336px) 624px, (min-width: 1024px) 47vw, 100vw'

// Papel de desenho na metade direita, esbatido para o lado do texto e para baixo. A grelha
// de 24 px passa pelas arestas da fotografia a partir de 1336 px (a aresta esquerda da
// fotografia fica 12 px à direita do meio da janela).
const PLANTA_LG =
  'pointer-events-none absolute inset-y-0 right-0 left-1/2 -z-10 hidden bg-planta [background-position:12px_0] ' +
  'mask-l-from-40% mask-b-from-65% lg:block'

// Abaixo de 1024 px, o papel fica só à volta da fotografia (nunca atrás do texto).
const PLANTA_SM =
  'pointer-events-none absolute -inset-x-4 -top-10 -bottom-8 -z-10 bg-planta mask-t-from-85% mask-b-from-80% ' +
  'sm:-inset-x-6 lg:hidden'

export function Hero() {
  const image = getImage('hero')
  const pins: HeroPin[] = hero.annotations.map((a) => {
    const spot = image.hotspots?.find((h) => h.number === a.number)
    return { ...a, point: spot ? { x: spot.x, y: spot.y } : null }
  })
  // Só sobre a fotografia real, na proporção do ficheiro, e com todos os pontos definidos.
  const overlay = image.picture !== null && pins.length > 0 && pins.every((p) => p.point !== null)

  return (
    <Section id="inicio" flush className="isolate overflow-hidden pt-[var(--header-h)]">
      <div aria-hidden="true" className={PLANTA_LG} />
      <Container
        className={[
          'grid min-h-[min(calc(100dvh_-_var(--header-h)_-_var(--mobile-bar-h)),57.5rem)] content-center',
          'pt-5 pb-8 md:pt-10 md:pb-12',
          'lg:grid-cols-12 lg:items-start lg:gap-x-6 lg:gap-y-[clamp(1.5rem,4.5vh,3rem)] lg:py-[clamp(1.5rem,5vh,3.5rem)]',
        ].join(' ')}
      >
        {/* Cabeça: etiqueta e H1 (duas linhas estáveis a partir de 1024 px). */}
        <div data-reveal className="lg:col-span-12">
          <p className="mb-3 flex items-start gap-3 font-mono text-eyebrow font-medium text-ink uppercase md:mb-4 lg:mb-5">
            <CotaEtiqueta className="mt-[2.5px]" />
            <span>{hero.eyebrow}</span>
          </p>
          <h1 id={headingId('inicio')} className="text-display font-[620] text-ink">
            <span className="lg:block">{hero.titleLines[0]}</span>{' '}
            <span className="lg:block">{hero.titleLines[1]}</span>
          </h1>
        </div>

        {/* Corpo: subtítulo, botões e linha de confiança logo abaixo dos botões.
            Em computador com janela baixa (até 680 px), os intervalos encolhem. */}
        <div
          data-reveal
          className="mt-4 md:mt-6 lg:col-span-6 lg:mt-0 lg:pt-5 xl:col-span-5 lg:[@media(max-height:42.5rem)]:pt-0"
        >
          <p className="max-w-prose text-lead text-muted">{hero.subtitle}</p>
          <div className="mt-6 flex flex-col gap-3 md:mt-8 md:flex-row md:flex-wrap lg:[@media(max-height:42.5rem)]:mt-6">
            <Button href="#contactos" size="lg" className="w-full md:w-auto" {...quoteLinkProps}>
              {ui.labels.requestQuote}
            </Button>
            <Button href="#servicos" size="lg" variant="secondary" className="w-full md:w-auto">
              {ui.labels.exploreServices}
            </Button>
          </div>
          <div className="mt-5 max-w-md md:mt-6 lg:[@media(max-height:42.5rem)]:mt-4">
            <ul aria-label={hero.trustLabel}>
              {hero.trustItems.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 border-t border-line py-1.5 text-small font-medium text-ink md:py-2 lg:[@media(max-height:42.5rem)]:py-1.5"
                >
                  <MarcaCruz />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <LinhaDeTerra />
          </div>
        </div>

        {/* Figura: fotografia na proporção do ficheiro (4:5 em telemóvel), cotas e anotações. */}
        <div data-reveal className="relative mt-8 md:mt-10 lg:col-span-6 lg:col-start-7 lg:mt-0">
          <div aria-hidden="true" className={PLANTA_SM} />
          <CotaHorizontal />
          <div className="relative">
            <Picture
              id="hero"
              priority
              frameClassName="aspect-[4/5] md:aspect-[2560/1448]"
              sizes={HERO_SIZES}
            />
            <CotaVertical className="hidden min-[86.5rem]:block" />
            {overlay ? <HeroAnnotations label={hero.annotationsLabel} pins={pins} overlay /> : null}
          </div>
          {overlay ? null : <HeroAnnotations label={hero.annotationsLabel} pins={pins} overlay={false} />}
        </div>
      </Container>
    </Section>
  )
}
