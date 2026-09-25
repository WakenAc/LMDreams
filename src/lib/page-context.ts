import { createContext, useContext } from 'react'
import type { PageId } from './pages'

/** Página atual (para ligações de âncora e destaque da navegação). */
export const PageContext = createContext<PageId>('home')

export function useCurrentPage(): PageId {
  return useContext(PageContext)
}
