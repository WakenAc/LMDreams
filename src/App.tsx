import { StrictMode, type ComponentType } from 'react'
import { PageContext } from './lib/page-context'
import type { PageId } from './lib/pages'

interface AppProps {
  page: PageId
  Page: ComponentType
}

/**
 * Raiz da página inteira: usada na pré-renderização e, em desenvolvimento, no cliente.
 * Em produção o cliente só hidrata as ilhas (src/entry-client.tsx).
 */
export function App({ page, Page }: AppProps) {
  return (
    <StrictMode>
      <PageContext value={page}>
        <Page />
      </PageContext>
    </StrictMode>
  )
}
