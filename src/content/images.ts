// Registo central de imagens por ID (Partes 3.7 e 4.4).
// Enquanto uma imagem não existir (`picture: null`), o componente Picture mostra um
// placeholder SVG gerado em código, com proporção fixa (sem saltos de layout).
// Proveniência das imagens geradas: assets-src/ilustrativas/manifest.json.
// Para trocar por uma fotografia real: substituir o ficheiro importado e pôr `ilustrativa: false`.

import heroMobile from '@ilustrativas/hero-telemovel.jpg?w=480;720;960;1216&format=avif;webp;jpg&quality=58&as=picture'
import hero from '@ilustrativas/hero.jpg?w=640;960;1280;1600;1920&format=avif;webp;jpg&quality=60&as=picture'
import type { ImageId } from './tipos'

/** Resultado de um import `?…&as=picture` do vite-imagetools. */
export interface PictureAsset {
  sources: Record<string, string>
  img: { src: string; w: number; h: number }
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
  hotspots?: readonly { number: string; x: number; y: number }[]
}

export const IMAGES: Readonly<Record<ImageId, ImageEntry>> = {
  hero: {
    id: 'hero',
    picture: hero,
    mobile: heroMobile,
    alt: 'Profissional a verificar com um nível o revestimento de pedra natural de um interior contemporâneo.',
    ratio: [2560, 1448],
    ilustrativa: true,
    sizes: '(min-width: 1336px) 624px, (min-width: 1024px) 47vw, 100vw',
    hotspots: [
      { number: '01', x: 58, y: 27 }, // revestimento de pedra
      { number: '02', x: 15, y: 67 }, // painel de carvalho com puxador
      { number: '03', x: 40, y: 18.5 }, // foco embutido no teto
    ],
  },
  sobre: {
    id: 'sobre',
    picture: null,
    alt: 'Planta de arquitetura com amostras de betão, pedra, madeira e latão sobre uma mesa de obra.',
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
    picture: null,
    alt: 'Cofragem e armaduras de aço numa obra de construção ao fim da tarde.',
    ratio: [4, 3],
    ilustrativa: true,
    sizes: '(min-width: 1336px) 408px, (min-width: 1024px) calc((100vw - 112px) / 3), (min-width: 640px) calc((100vw - 72px) / 2), calc(100vw - 32px)',
  },
  'servico-cozinhas': {
    id: 'servico-cozinhas',
    picture: null,
    alt: 'Profissional a ajustar uma bancada de pedra numa cozinha em remodelação.',
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
    picture: null,
    alt: 'Mãos de um profissional a aplicar um pavimento de madeira em espinha.',
    ratio: [4, 3],
    ilustrativa: true,
    sizes: '(min-width: 1336px) 408px, (min-width: 1024px) calc((100vw - 112px) / 3), (min-width: 640px) calc((100vw - 72px) / 2), calc(100vw - 32px)',
  },
  'servico-recuperacao': {
    id: 'servico-recuperacao',
    picture: null,
    alt: 'Recuperação de fachada tradicional com reboco de cal e cantarias restauradas.',
    ratio: [4, 3],
    ilustrativa: true,
    sizes: '(min-width: 1336px) 408px, (min-width: 1024px) calc((100vw - 112px) / 3), (min-width: 640px) calc((100vw - 72px) / 2), calc(100vw - 32px)',
  },
  'servico-exteriores': {
    id: 'servico-exteriores',
    picture: null,
    alt: 'Assentamento de pavimento em pedra natural num terraço exterior.',
    ratio: [4, 3],
    ilustrativa: true,
    sizes: '(min-width: 1336px) 408px, (min-width: 1024px) calc((100vw - 112px) / 3), (min-width: 640px) calc((100vw - 72px) / 2), calc(100vw - 32px)',
  },
  transparencia: {
    id: 'transparencia',
    picture: null,
    alt: 'Reunião em obra sobre o planeamento impresso dos trabalhos.',
    ratio: [3, 2],
    ilustrativa: true,
    sizes: '(min-width: 1336px) 516px, (min-width: 1024px) 39vw, (min-width: 640px) 47vw, calc(100vw - 32px)',
  },
  cta: {
    id: 'cta',
    picture: null,
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
