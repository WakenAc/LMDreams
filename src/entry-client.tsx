// Cliente (Parte 3.4): lê a página pré-renderizada em <body data-page>, carrega só o
// componente dessa página com import() (o texto das páginas legais não entra no
// JavaScript da página principal) e hidrata. Em desenvolvimento (#root vazio),
// escolhe a página pelo caminho e usa createRoot.
import './styles/index.css'
import type { ComponentType } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { App } from './App'
import { isPageId, PAGES, type PageId } from './lib/pages'

const loaders: Record<PageId, () => Promise<{ default: ComponentType }>> = {
  home: () => import('./pages/HomePage'),
  privacy: () => import('./pages/PrivacyPage'),
  cookies: () => import('./pages/CookiesPage'),
  terms: () => import('./pages/TermsPage'),
  notFound: () => import('./pages/NotFoundPage'),
}

function pageFromPath(pathname: string): PageId {
  const base = import.meta.env.BASE_URL
  const rel = pathname.startsWith(base) ? pathname.slice(base.length) : pathname.replace(/^\//, '')
  const normal = rel === '' || rel === 'index.html' ? '' : rel.endsWith('/') ? rel : `${rel}/`
  return PAGES.find((p) => p.path === normal)?.id ?? 'notFound'
}

async function start(): Promise<void> {
  const root = document.getElementById('root')
  if (!root) return
  const declared = document.body.dataset.page
  const prerendered = root.firstElementChild !== null
  const page: PageId = isPageId(declared) ? declared : pageFromPath(window.location.pathname)
  const { default: Page } = await loaders[page]()

  if (prerendered) {
    hydrateRoot(root, <App page={page} Page={Page} />, {
      onRecoverableError(error) {
        console.error('Erro de hidratação', error)
      },
    })
  } else {
    if (import.meta.env.DEV) {
      const { seo } = await import('./content/seo')
      document.title = seo.pages[page].title
    }
    createRoot(root).render(<App page={page} Page={Page} />)
  }
}

void start()
