// Só em desenvolvimento (`npm run dev`): o #root vem vazio e a página inteira é
// renderizada no cliente. Em produção este módulo não é incluído (import dinâmico dentro
// de `if (import.meta.env.DEV)` em src/entry-client.tsx), por isso as páginas completas
// não são publicadas como JavaScript.
import type { ComponentType } from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import type { PageId } from './lib/pages'

const pageLoaders: Record<PageId, () => Promise<{ default: ComponentType }>> = {
  home: () => import('./pages/HomePage'),
  privacy: () => import('./pages/PrivacyPage'),
  cookies: () => import('./pages/CookiesPage'),
  terms: () => import('./pages/TermsPage'),
  notFound: () => import('./pages/NotFoundPage'),
}

export async function renderDev(root: HTMLElement, page: PageId): Promise<void> {
  const { default: Page } = await pageLoaders[page]()
  const { seo } = await import('./content/seo')
  document.title = seo.pages[page].title
  const app = createRoot(root)
  flushSync(() => app.render(<App page={page} Page={Page} />))
}
