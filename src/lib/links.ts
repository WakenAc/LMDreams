import { pageById, type AnchorId, type PageId } from './pages'

/**
 * Caminho interno com o base path (Parte 3.5). Escrito exatamente assim porque o
 * Vite substitui `import.meta.env.BASE_URL` no build do cliente e do SSR.
 */
export function withBase(caminho = ''): string {
  const base = import.meta.env.BASE_URL
  return `${base}${caminho.replace(/^\/+/, '')}`
}

/** URL absoluto (canónico, Open Graph, sitemap, JSON-LD). */
export function absoluteUrl(caminho = ''): string {
  const limpo = caminho.replace(/^\/+/, '')
  return limpo ? `${__SITE_URL__}/${limpo}` : `${__SITE_URL__}/`
}

/** Ligação para uma página (com barra final) e, opcionalmente, uma âncora. */
export function pageHref(page: PageId, hash?: string): string {
  const caminho = pageById(page).path
  return withBase(caminho) + (hash ? `#${hash.replace(/^#/, '')}` : '')
}

/**
 * Ligação para uma âncora da página principal. Na própria página principal usa só
 * `#ancora`; nas outras páginas usa o caminho da principal com o base path.
 */
export function anchorHref(anchor: AnchorId, currentPage: PageId): string {
  return currentPage === 'home' ? `#${anchor}` : pageHref('home', anchor)
}

/** Ligações externas abrem numa nova janela (Livro de Reclamações, WhatsApp, sites oficiais). */
export function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href)
}
