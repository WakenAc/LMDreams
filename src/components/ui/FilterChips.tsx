// Filtros em botões de alternar (Parte 3.10): grupo (fieldset) com nome acessível, `aria-pressed`,
// alvos de 44 px, contorno `muted` e estado premido em `ink` com texto `on-dark`.
// Sem JavaScript (antes da hidratação) ficam desativados: o conteúdo filtrado continua
// todo visível.

export interface FilterChipOption<T extends string> {
  value: T
  label: string
}

interface FilterChipsProps<T extends string> {
  /** Nome acessível do grupo. */
  label: string
  options: readonly FilterChipOption<T>[]
  value: T
  onChange: (value: T) => void
  disabled?: boolean
  className?: string
}

const CHIP = [
  'inline-flex min-h-11 items-center justify-center rounded-sm border px-4 py-2 text-center',
  'font-body text-small font-medium leading-tight',
  'transition-[background-color,border-color,color] duration-250 ease-planta',
  'border-muted text-ink',
  'aria-[pressed=false]:enabled:hover:bg-surface aria-[pressed=false]:enabled:active:bg-sand/60',
  'aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-on-dark',
  'disabled:cursor-not-allowed disabled:opacity-60',
].join(' ')

export function FilterChips<T extends string>({
  label,
  options,
  value,
  onChange,
  disabled = false,
  className,
}: FilterChipsProps<T>) {
  // <fieldset> dá o papel de grupo nativo; a <legend> (escondida visualmente) é o nome acessível.
  return (
    <fieldset data-filter-group="" className={['min-w-0', className].filter(Boolean).join(' ')}>
      <legend className="sr-only">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            data-filter={option.value}
            aria-pressed={option.value === value}
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={CHIP}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
