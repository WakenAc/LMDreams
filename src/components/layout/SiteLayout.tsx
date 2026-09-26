import type { ReactNode } from 'react'
import { Island } from '../Island'
import { Footer } from './Footer'
import { Header } from './Header'
import { MobileContactBar } from './MobileContactBar'
import { SkipLink } from './SkipLink'

// Montagem comum a todas as páginas (orquestrador): ligação "Saltar para o conteúdo"
// como primeiro elemento focável, cabeçalho fixo, conteúdo, rodapé e barra móvel.
// O cabeçalho e a barra móvel são ilhas hidratadas; o resto é HTML estático.
export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SkipLink />
      <Island id="header">
        <Header />
      </Island>
      <main id="conteudo" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />
      <Island id="mobile-bar">
        <MobileContactBar />
      </Island>
    </>
  )
}
