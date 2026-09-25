// Lista única das páginas do site. Módulo puro (sem imports): é usado pela app,
// pela pré-renderização e pelos scripts de verificação.

export type PageId = 'home' | 'privacy' | 'cookies' | 'terms' | 'notFound'

export interface PageDef {
  id: PageId
  /** Caminho relativo ao base path, com barra final ('' = página principal). */
  path: string
  /** Ficheiro gerado na pasta de saída. */
  file: string
  /** Entra no sitemap e no Lighthouse. */
  indexable: boolean
}

export const PAGES: readonly PageDef[] = [
  { id: 'home', path: '', file: 'index.html', indexable: true },
  {
    id: 'privacy',
    path: 'politica-de-privacidade/',
    file: 'politica-de-privacidade/index.html',
    indexable: true,
  },
  {
    id: 'cookies',
    path: 'politica-de-cookies/',
    file: 'politica-de-cookies/index.html',
    indexable: true,
  },
  {
    id: 'terms',
    path: 'termos-e-condicoes/',
    file: 'termos-e-condicoes/index.html',
    indexable: true,
  },
  { id: 'notFound', path: '404.html', file: '404.html', indexable: false },
]

export const PAGE_IDS = PAGES.map((p) => p.id)

export function pageById(id: PageId): PageDef {
  const page = PAGES.find((p) => p.id === id)
  if (!page) throw new Error(`Página desconhecida: ${id}`)
  return page
}

export function isPageId(value: string | undefined): value is PageId {
  return PAGES.some((p) => p.id === value)
}

/** Âncoras da página principal (Parte 3.9). */
export const ANCHORS = [
  'inicio',
  'sobre',
  'servicos',
  'metodo',
  'projetos',
  'transparencia',
  'testemunhos',
  'contactos',
] as const

export type AnchorId = (typeof ANCHORS)[number]
