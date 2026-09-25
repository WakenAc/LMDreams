// Identificadores das ilhas hidratadas no cliente (ver src/components/Island.tsx).
// Módulo puro: também é usado pelo prerender para pré-carregar o JavaScript de cada ilha.

export const ISLANDS = ['header', 'mobile-bar', 'projects', 'contact'] as const
export type IslandId = (typeof ISLANDS)[number]

/** Ficheiro-fonte de cada ilha (chave do manifest do Vite). */
export const ISLAND_SOURCES: Record<IslandId, string> = {
  header: 'src/islands/header.tsx',
  'mobile-bar': 'src/islands/mobile-bar.tsx',
  projects: 'src/islands/projects.tsx',
  contact: 'src/islands/contact.tsx',
}

export function isIslandId(value: string | undefined): value is IslandId {
  return (ISLANDS as readonly string[]).includes(value ?? '')
}

/** Prefixo dos ids gerados por useId em cada ilha (igual no servidor e no cliente). */
export function islandPrefix(id: IslandId): string {
  return `i-${id}-`
}
