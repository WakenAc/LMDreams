import { createContext, useContext, type ReactNode } from 'react'
import { PageContext, useCurrentPage } from '../lib/page-context'
import { islandPrefix, type IslandId } from '../lib/islands'

// Ilhas de interatividade (orquestrador). Só os componentes com estado ou eventos
// (cabeçalho e menu, barra móvel, projetos e formulário) são hidratados no cliente;
// o resto da página é HTML pré-renderizado sem JavaScript (Parte 3.11: JS inicial
// ≤ 100 KB gzip). Cada ilha é renderizada no servidor como uma raiz própria, com o
// mesmo `identifierPrefix` que o cliente usa na hidratação (os useId coincidem).

type IslandRenderer = (node: ReactNode, identifierPrefix: string) => string

/** Fornecido só pelo entry-server: indica que se está a pré-renderizar. */
// oxlint-disable-next-line react/only-export-components -- contexto só usado na pré-renderização (entry-server); o aviso só afeta o Fast Refresh em desenvolvimento.
export const IslandRendererContext = createContext<IslandRenderer | null>(null)

interface IslandProps {
  id: IslandId
  children: ReactNode
}

export function Island({ id, children }: IslandProps) {
  const render = useContext(IslandRendererContext)
  const page = useCurrentPage()
  if (render) {
    const html = render(<PageContext value={page}>{children}</PageContext>, islandPrefix(id))
    return <div data-island={id} className="contents" dangerouslySetInnerHTML={{ __html: html }} />
  }
  return (
    <div data-island={id} className="contents">
      {children}
    </div>
  )
}
