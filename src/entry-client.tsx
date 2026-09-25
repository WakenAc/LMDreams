// Cliente (Parte 3.4). Em produção, o HTML de cada página já vem pré-renderizado e só
// as ilhas interativas (cabeçalho, barra móvel, projetos, formulário) são hidratadas,
// cada uma com o seu import(): o texto das secções estáticas e das páginas legais não
// entra no JavaScript. Em desenvolvimento (#root vazio), a página inteira é renderizada
// no cliente por src/dev-render.tsx, escolhida pelo caminho.
import './styles/index.css'
import { StrictMode, type ComponentType } from 'react'
import { hydrateRoot } from 'react-dom/client'
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

/** Hidrata cada ilha de forma independente: se uma falhar, as outras continuam. */
async function hydrateIslands(page: PageId): Promise<boolean> {
  const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-island]'))
  const results = await Promise.allSettled(
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
  const failed = results.filter((r) => r.status === 'rejected').length
  if (failed > 0) console.warn(`${failed} ilha(s) interativa(s) não carregaram; a página continua utilizável sem elas.`)
  return failed === 0
}

async function start(): Promise<void> {
  const root = document.getElementById('root')
  if (!root) return
  const declared = document.body.dataset.page
  const prerendered = root.firstElementChild !== null
  const page: PageId = isPageId(declared) ? declared : pageFromPath(window.location.pathname)

  let allHydrated = true
  if (prerendered) {
    allHydrated = await hydrateIslands(page)
  } else if (import.meta.env.DEV) {
    // Só em desenvolvimento: fora do build de produção (sem as páginas completas em JS).
    const { renderDev } = await import('./dev-render')
    await renderDev(root, page)
  }
  initReveal()
  initQuoteLinks()
  // Marca para os testes E2E (e para depuração): as ilhas já estão interativas. Se alguma
  // falhou, a marca não é posta e os controlos que dependem dela continuam escondidos.
  if (allHydrated) document.documentElement.dataset.hydrated = 'true'
}

void start()
