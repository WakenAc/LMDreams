// Cliente (Parte 3.4). Em produção, o HTML de cada página já vem pré-renderizado e só
// as ilhas interativas (cabeçalho, barra móvel, projetos, formulário) são hidratadas,
// cada uma com o seu import(): o texto das secções estáticas e das páginas legais não
// entra no JavaScript. Em desenvolvimento (#root vazio), a página inteira é renderizada
// no cliente, escolhida pelo caminho.
import './styles/index.css'
import { StrictMode, type ComponentType } from 'react'
import { flushSync } from 'react-dom'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { App } from './App'
import { islandPrefix, isIslandId, type IslandId } from './lib/islands'
import { PageContext } from './lib/page-context'
import { isPageId, PAGES, type PageId } from './lib/pages'
import { initQuoteLinks } from './lib/quote-links'
import { initReveal } from './lib/reveal'

const islandLoaders: Record<IslandId, () => Promise<{ default: ComponentType }>> = {
  header: () => import('./islands/header'),
  'mobile-bar': () => import('./islands/mobile-bar'),
  projects: () => import('./islands/projects'),
  contact: () => import('./islands/contact'),
}

const pageLoaders: Record<PageId, () => Promise<{ default: ComponentType }>> = {
  home: () => import('./pages/HomePage'),
  privacy: () => import('./pages/PrivacyPage'),
  cookies: () => import('./pages/CookiesPage'),
  terms: () => import('./pages/TermsPage'),
  notFound: () => import('./pages/NotFoundPage'),
}

function pageFromPath(pathname: string): PageId {
  const base = import.meta.env.BASE_URL
  const rel = pathname.startsWith(base) ? pathname.slice(base.length) : pathname.replace(/^\//, '')
  let normal = rel
  if (rel === '' || rel === 'index.html') normal = ''
  else if (!rel.endsWith('/')) normal = `${rel}/`
  return PAGES.find((p) => p.path === normal)?.id ?? 'notFound'
}

function onRecoverableError(error: unknown) {
  console.error('Erro de hidratação', error)
}

async function hydrateIslands(page: PageId): Promise<void> {
  const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-island]'))
  await Promise.all(
    elements.map(async (el) => {
      const id = el.dataset.island
      if (!isIslandId(id)) return
      const { default: Component } = await islandLoaders[id]()
      hydrateRoot(
        el,
        <StrictMode>
          <PageContext value={page}>
            <Component />
          </PageContext>
        </StrictMode>,
        { identifierPrefix: islandPrefix(id), onRecoverableError },
      )
    }),
  )
}

async function start(): Promise<void> {
  const root = document.getElementById('root')
  if (!root) return
  const declared = document.body.dataset.page
  const prerendered = root.firstElementChild !== null
  const page: PageId = isPageId(declared) ? declared : pageFromPath(window.location.pathname)

  if (prerendered) {
    await hydrateIslands(page)
  } else {
    const { default: Page } = await pageLoaders[page]()
    if (import.meta.env.DEV) {
      const { seo } = await import('./content/seo')
      document.title = seo.pages[page].title
    }
    const app = createRoot(root)
    flushSync(() => app.render(<App page={page} Page={Page} />))
  }
  initReveal()
  initQuoteLinks()
}

void start()
