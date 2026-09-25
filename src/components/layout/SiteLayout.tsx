import type { ReactNode } from 'react'
import { Footer } from './Footer'
import { Header } from './Header'
import { MobileContactBar } from './MobileContactBar'
import { SkipLink } from './SkipLink'

// Montagem comum a todas as páginas (orquestrador): ligação "Saltar para o conteúdo"
// como primeiro elemento focável, cabeçalho fixo, conteúdo, rodapé e barra móvel.
export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SkipLink />
      <Header />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />
      <MobileContactBar />
    </>
  )
}
