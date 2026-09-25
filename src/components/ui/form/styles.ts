// Classes e ids partilhados pelos controlos de formulário (design/direcao-visual.md, secção 9):
// campos de 48 px com contorno `muted` de 1 px e raio de 2 px, rótulos em Plex Sans 500 por
// cima, ajudas em `muted` a 14 px, erros em `error` com ícone. O foco usa o anel global
// (2 px `focus` com afastamento): nenhum controlo o substitui.

export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}

/** Junta ids para `aria-describedby`; undefined quando não há nenhum. */
export function joinIds(...ids: Array<string | false | null | undefined>): string | undefined {
  const lista = ids.filter(Boolean).join(' ')
  return lista || undefined
}

/** Ids da ajuda e do erro de um campo. */
export function fieldIds(id: string): { help: string; error: string } {
  return { help: `${id}-ajuda`, error: `${id}-erro` }
}

export const LABEL_CLASS = 'block font-medium text-ink'

export const HELP_CLASS = 'mt-1 max-w-prose text-small text-muted'

/** Base comum a campos de texto, áreas de texto e listas. */
export const CONTROL_CLASS =
  'block w-full rounded-sm border border-muted bg-bg text-body text-ink ' +
  'transition-[border-color,box-shadow] duration-150 ease-planta hover:border-ink ' +
  'aria-[invalid=true]:border-error aria-[invalid=true]:shadow-[inset_0_0_0_1px_var(--color-error)] ' +
  'disabled:cursor-not-allowed disabled:opacity-60'
