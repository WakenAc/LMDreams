// Registo central de imagens por ID (Partes 3.7 e 4.4).
// Enquanto uma imagem não existir (`picture: null`), o componente Picture mostra um
// placeholder SVG gerado em código, com proporção fixa (sem saltos de layout).
// Proveniência das imagens geradas: assets-src/ilustrativas/manifest.json.
// Para trocar por uma fotografia real: substituir o ficheiro importado e pôr `ilustrativa: false`.

// Qualidade por formato: o AVIF a 50 fica abaixo do WebP a 64 com o mesmo detalhe (medido
// com o sharp); por isso cada formato tem o seu import.
import heroMobileAvif from '@ilustrativas/hero-telemovel.jpg?w=480;640;720;800;1024;1216&format=avif&quality=50&as=picture'
import heroMobileRest from '@ilustrativas/hero-telemovel.jpg?w=480;640;720;800;1024;1216&format=webp;jpg&quality=64&as=picture'
import heroAvif from '@ilustrativas/hero.jpg?w=640;960;1280;1600;1920&format=avif&quality=50&as=picture'
import heroRest from '@ilustrativas/hero.jpg?w=640;960;1280;1600;1920&format=webp;jpg&quality=64&as=picture'
// Larguras até 2× o maior tamanho em que cada imagem aparece (Parte 4.8): cerca de 607 px
// no Sobre e nos cartões de serviço (telemóvel, abaixo de 640 px); a toda a largura no CTA.
// Nos cartões de serviço e na transparência, o AVIF vai a 56: a 50 comprimia tanto que o JPEG de recurso
// passava do dobro do AVIF (Parte 4.8).
import sobreAvif from '@ilustrativas/sobre.jpg?w=480;640;800;1024;1216&format=avif&quality=50&as=picture'
import sobreRest from '@ilustrativas/sobre.jpg?w=480;640;800;1024;1216&format=webp;jpg&quality=64&as=picture'
import cozinhasAvif from '@ilustrativas/servico-cozinhas.jpg?w=480;640;816;1024;1216&format=avif&quality=56&as=picture'
import cozinhasRest from '@ilustrativas/servico-cozinhas.jpg?w=480;640;816;1024;1216&format=webp;jpg&quality=64&as=picture'
import recuperacaoAvif from '@ilustrativas/servico-recuperacao.jpg?w=480;640;816;1024;1216&format=avif&quality=56&as=picture'
import recuperacaoRest from '@ilustrativas/servico-recuperacao.jpg?w=480;640;816;1024;1216&format=webp;jpg&quality=64&as=picture'
import exterioresAvif from '@ilustrativas/servico-exteriores.jpg?w=480;640;816;1024;1216&format=avif&quality=56&as=picture'
import exterioresRest from '@ilustrativas/servico-exteriores.jpg?w=480;640;816;1024;1216&format=webp;jpg&quality=64&as=picture'
import construcaoAvif from '@ilustrativas/servico-construcao.jpg?w=480;640;816;1024;1216&format=avif&quality=56&as=picture'
import construcaoRest from '@ilustrativas/servico-construcao.jpg?w=480;640;816;1024;1216&format=webp;jpg&quality=64&as=picture'
import pavimentosAvif from '@ilustrativas/servico-pavimentos.jpg?w=480;640;816;1024;1216&format=avif&quality=56&as=picture'
import pavimentosRest from '@ilustrativas/servico-pavimentos.jpg?w=480;640;816;1024;1216&format=webp;jpg&quality=64&as=picture'
import transparenciaAvif from '@ilustrativas/transparencia.jpg?w=480;640;800;1024;1216&format=avif&quality=56&as=picture'
import transparenciaRest from '@ilustrativas/transparencia.jpg?w=480;640;800;1024;1216&format=webp;jpg&quality=64&as=picture'
import ctaAvif from '@ilustrativas/cta.jpg?w=640;960;1280;1600;1920;2560&format=avif&quality=50&as=picture'
import ctaRest from '@ilustrativas/cta.jpg?w=640;960;1280;1600;1920;2560&format=webp;jpg&quality=64&as=picture'
import type { ImageId } from './tipos'

/** Resultado de um import `?…&as=picture` do vite-imagetools. */
export interface PictureAsset {
  sources: Record<string, string>
  img: { src: string; w: number; h: number }
}

/** Junta um import só com AVIF a outro com WebP e JPEG (o JPEG é a imagem de recurso). */
function withAvif(avif: PictureAsset, rest: PictureAsset): PictureAsset {
  return { sources: { ...avif.sources, ...rest.sources }, img: rest.img }
}

export interface ImageEntry {
  id: ImageId
  /** Imagem otimizada, ou null enquanto não existir (placeholder). */
  picture: PictureAsset | null
  /** Variante para telemóvel (< 768 px), só no hero. */
  mobile?: PictureAsset | null
  /** Texto alternativo em PT-PT (8 a 16 palavras); '' se for decorativa. */
  alt: string
  /** Proporção do ficheiro original, para o placeholder (largura/altura). */
  ratio: readonly [number, number]
  /** Gerada por IA: mostra a legenda "Imagem ilustrativa gerada por IA". */
  ilustrativa: boolean
  /** Atributo `sizes` para o srcset. */
  sizes: string
  /**
   * Pontos das anotações do hero, em percentagem da imagem inteira (0 a 100), pelo número
   * da anotação em src/content/hero.ts. Só se usam com a imagem na proporção do ficheiro.
   */
  hotspots?: readonly { number: string; x: number; y: number; side?: 'left' | 'right' }[]
  /**
   * Parte horizontal da imagem inteira (em percentagem) que o recorte de telemóvel mostra.
   * As anotações cujo ponto fica fora dele não aparecem abaixo de 768 px.
   */
  mobileCrop?: { x0: number; x1: number }
}

export const IMAGES: Readonly<Record<ImageId, ImageEntry>> = {
  hero: {
    id: 'hero',
    picture: withAvif(heroAvif, heroRest),
    mobile: withAvif(heroMobileAvif, heroMobileRest),
    alt: 'Profissional a verificar com um nível o revestimento de pedra natural de um interior contemporâneo.',
    ratio: [2560, 1448],
    ilustrativa: true,
    sizes: '(min-width: 1336px) 624px, (min-width: 1024px) 47vw, 100vw',
    hotspots: [
      { number: '01', x: 58, y: 27, side: 'right' }, // revestimento de pedra (etiqueta à direita, longe da 03)
      { number: '02', x: 15, y: 67 }, // painel de carvalho com puxador
      { number: '03', x: 40, y: 18.5 }, // foco embutido no teto
    ],
    // hero-telemovel.jpg: recorte x = 1060 a 2276 dos 2688 px do original (inclui o foco do
    // teto, a parede de pedra e o nível inteiro).
    mobileCrop: { x0: 39.4, x1: 84.7 },
  },
  sobre: {
    id: 'sobre',
    picture: withAvif(sobreAvif, sobreRest),
    alt: 'Profissional aponta para uma planta de arquitetura, junto a amostras de pedra, madeira e latão.',
    ratio: [4, 5],
    ilustrativa: true,
    sizes: '(min-width: 1336px) 516px, (min-width: 1024px) 39vw, (min-width: 640px) 47vw, calc(100vw - 32px)',
  },
  diferenciacao: {
    id: 'diferenciacao',
    picture: null,
    alt: 'Ferramentas de várias especialidades organizadas lado a lado sobre uma superfície de betão.',
    ratio: [3, 2],
    ilustrativa: true,
    sizes: '(min-width: 1336px) 732px, (min-width: 1024px) 55vw, 100vw',
  },
  'servico-construcao': {
    id: 'servico-construcao',
    picture: withAvif(construcaoAvif, construcaoRest),
    alt: 'Cofragem e armaduras de aço numa obra de construção ao fim da tarde.',
    ratio: [4, 3],
    ilustrativa: true,
    sizes: '(min-width: 1336px) 408px, (min-width: 1024px) calc((100vw - 112px) / 3), (min-width: 640px) calc((100vw - 72px) / 2), calc(100vw - 32px)',
  },
  'servico-cozinhas': {
    id: 'servico-cozinhas',
    picture: withAvif(cozinhasAvif, cozinhasRest),
    alt: 'Profissional a verificar com um nível o alinhamento de uma bancada de pedra numa cozinha.',
    ratio: [4, 3],
    ilustrativa: true,
    sizes: '(min-width: 1336px) 408px, (min-width: 1024px) calc((100vw - 112px) / 3), (min-width: 640px) calc((100vw - 72px) / 2), calc(100vw - 32px)',
  },
  'servico-casas-de-banho': {
    id: 'servico-casas-de-banho',
    picture: null,
    alt: 'Assentamento de revestimento cerâmico numa casa de banho em remodelação.',
    ratio: [4, 3],
    ilustrativa: true,
    sizes: '(min-width: 1336px) 408px, (min-width: 1024px) calc((100vw - 112px) / 3), (min-width: 640px) calc((100vw - 72px) / 2), calc(100vw - 32px)',
  },
  'servico-pavimentos': {
    id: 'servico-pavimentos',
    picture: withAvif(pavimentosAvif, pavimentosRest),
    alt: 'Mãos de um profissional a aplicar um pavimento de madeira em espinha.',
    ratio: [4, 3],
    ilustrativa: true,
    sizes: '(min-width: 1336px) 408px, (min-width: 1024px) calc((100vw - 112px) / 3), (min-width: 640px) calc((100vw - 72px) / 2), calc(100vw - 32px)',
  },
  'servico-recuperacao': {
    id: 'servico-recuperacao',
    picture: withAvif(recuperacaoAvif, recuperacaoRest),
    alt: 'Fachada tradicional em recuperação, com andaime, reboco de cal e cantarias de pedra.',
    ratio: [4, 3],
    ilustrativa: true,
    sizes: '(min-width: 1336px) 408px, (min-width: 1024px) calc((100vw - 112px) / 3), (min-width: 640px) calc((100vw - 72px) / 2), calc(100vw - 32px)',
  },
  'servico-exteriores': {
    id: 'servico-exteriores',
    picture: withAvif(exterioresAvif, exterioresRest),
    alt: 'Assentamento de pavimento em pedra natural num terraço exterior.',
    ratio: [4, 3],
    ilustrativa: true,
    sizes: '(min-width: 1336px) 408px, (min-width: 1024px) calc((100vw - 112px) / 3), (min-width: 640px) calc((100vw - 72px) / 2), calc(100vw - 32px)',
  },
  transparencia: {
    id: 'transparencia',
    picture: withAvif(transparenciaAvif, transparenciaRest),
    alt: 'Reunião em obra sobre o planeamento impresso dos trabalhos.',
    ratio: [3, 2],
    ilustrativa: true,
    sizes: '(min-width: 1336px) 516px, (min-width: 1024px) 39vw, (min-width: 640px) 47vw, calc(100vw - 32px)',
  },
  cta: {
    id: 'cta',
    picture: withAvif(ctaAvif, ctaRest),
    // Decorativa: alt vazio, mas com a legenda de IA visível (Parte 4.8).
    alt: '',
    ratio: [21, 9],
    ilustrativa: true,
    sizes: '100vw',
  },
}

export function getImage(id: ImageId): ImageEntry {
  return IMAGES[id]
}

/** Verdadeiro só se houver pelo menos uma imagem gerada por IA efetivamente mostrada. */
export function hasIllustrativeImages(): boolean {
  return Object.values(IMAGES).some((img) => img.picture !== null && img.ilustrativa)
}
