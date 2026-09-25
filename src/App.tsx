import { StrictMode, useEffect, type ComponentType } from 'react'
import { PageContext } from './lib/page-context'
import type { PageId } from './lib/pages'
import { initQuoteLinks } from './lib/quote-links'
import { initReveal } from './lib/reveal'

interface AppProps {
  page: PageId
  Page: ComponentType
}

/** Raiz comum ao servidor (pré-renderização) e ao cliente (hidratação). */
export function App({ page, Page }: AppProps) {
  useEffect(() => {
    initReveal()
    initQuoteLinks()
  }, [])

  return (
    <StrictMode>
      <PageContext value={page}>
        <Page />
      </PageContext>
    </StrictMode>
  )
}
