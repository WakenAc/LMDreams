// Pré-renderização (Parte 3.4): usado por scripts/prerender.ts depois do build SSR.
import type { ComponentType, ReactNode } from 'react'
import { renderToString } from 'react-dom/server'
import { App } from './App'
import { IslandRendererContext } from './components/Island'
import { ISLAND_SOURCES } from './lib/islands'
import type { PageId } from './lib/pages'
import { buildHead } from './lib/seo'
import CookiesPage from './pages/CookiesPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'

const PAGES: Record<PageId, ComponentType> = {
  home: HomePage,
  privacy: PrivacyPage,
  cookies: CookiesPage,
  terms: TermsPage,
  notFound: NotFoundPage,
}

/** Ficheiro-fonte de cada ilha, para o prerender pré-carregar o seu chunk (manifest do Vite). */
export { ISLAND_SOURCES }

// Cada ilha é uma raiz própria, com o mesmo prefixo de ids que o cliente usa.
const renderIsland = (node: ReactNode, identifierPrefix: string) => renderToString(node, { identifierPrefix })

// oxlint-disable-next-line react/only-export-components -- módulo do build SSR (não tem Fast Refresh).
export function render(page: PageId): { html: string; head: string } {
  const Page = PAGES[page]
  const html = renderToString(
    <IslandRendererContext value={renderIsland}>
      <App page={page} Page={Page} />
    </IslandRendererContext>,
  )
  return { html, head: buildHead(page) }
}
