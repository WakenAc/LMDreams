import type { PlaceholderKey } from '../content/placeholders-registo'

// Único sítio do código onde o marcador é escrito (Parte 3.3).
const PREFIX = '[A CONFIRMAR: '
const SUFFIX = ']'

/** Marca um dado em falta. A chave tem de existir no registo do Anexo B. */
export function PH(_chave: PlaceholderKey, descricao: string): string {
  if (!descricao.trim()) throw new Error('PH: a descrição é obrigatória')
  return `${PREFIX}${descricao}${SUFFIX}`
}

/** Verdadeiro se o texto contém pelo menos um placeholder. */
export function isPlaceholder(valor: string | null | undefined): boolean {
  return typeof valor === 'string' && valor.includes(PREFIX)
}

/** Divide um texto em partes normais e placeholders, para os mostrar com estilo próprio. */
export function splitPlaceholders(texto: string): { text: string; placeholder: boolean }[] {
  const partes: { text: string; placeholder: boolean }[] = []
  let resto = texto
  while (resto.length > 0) {
    const inicio = resto.indexOf(PREFIX)
    if (inicio === -1) {
      partes.push({ text: resto, placeholder: false })
      break
    }
    const fim = resto.indexOf(SUFFIX, inicio + PREFIX.length)
    if (fim === -1) {
      partes.push({ text: resto, placeholder: false })
      break
    }
    if (inicio > 0) partes.push({ text: resto.slice(0, inicio), placeholder: false })
    partes.push({ text: resto.slice(inicio, fim + SUFFIX.length), placeholder: true })
    resto = resto.slice(fim + SUFFIX.length)
  }
  return partes
}

/** Devolve o valor só se for um dado real (para meta tags e JSON-LD). */
export function realOrUndefined(valor: string | null | undefined): string | undefined {
  if (valor == null || isPlaceholder(valor) || !valor.trim()) return undefined
  return valor
}
