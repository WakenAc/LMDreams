/**
 * Resolve um caminho dentro de `public/` respeitando o base path
 * configurado no Vite (necessário porque o site é publicado num
 * subcaminho do GitHub Pages: /LMDreams/).
 */
export function asset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}
