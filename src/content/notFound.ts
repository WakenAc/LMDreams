// Página 404 (Parte 5.4). Os botões usam os rótulos de common.ts
// ("Voltar ao início" e "Pedir orçamento").

import type { NotFoundContent } from './tipos'

export const notFound = {
  title: 'Página não encontrada',
  text: 'A página que procura não existe ou mudou de endereço.',
} satisfies NotFoundContent
