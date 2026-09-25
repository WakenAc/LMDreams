// Pré-renderização (Parte 3.4): usado por scripts/prerender.ts depois do build SSR.
import type { ComponentType } from 'react'
import { renderToString } from 'react-dom/server'
import { App } from './App'
import { buildHead } from './lib/seo'
import type { PageId } from './lib/pages'
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

/** Ficheiro-fonte de cada página, para o prerender encontrar o chunk no manifest do Vite. */
export const PAGE_SOURCES: Record<PageId, string> = {
  home: 'src/pages/HomePage.tsx',
  privacy: 'src/pages/PrivacyPage.tsx',
  cookies: 'src/pages/CookiesPage.tsx',
  terms: 'src/pages/TermsPage.tsx',
  notFound: 'src/pages/NotFoundPage.tsx',
}

export function render(page: PageId): { html: string; head: string } {
  const Page = PAGES[page]
  const html = renderToString(<App page={page} Page={Page} />)
  return { html, head: buildHead(page) }
}
