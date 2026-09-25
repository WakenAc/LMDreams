interface HoneypotProps {
  /** Nome sem significado: nunca email, phone, website nem palavras que o preenchimento automático reconheça. */
  name: string
  id: string
  value: string
  onChange: (valor: string) => void
}

/**
 * Campo-armadilha anti-spam (Parte 3.8): fora do ecrã, escondido das tecnologias de apoio,
 * fora da ordem de tabulação e sem preenchimento automático. As pessoas nunca o veem nem
 * preenchem; os robôs costumam preencher todos os campos.
 */
export function Honeypot({ name, id, value, onChange }: HoneypotProps) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute -left-[10000px] top-0 h-px w-px overflow-hidden">
      <input
        type="text"
        id={id}
        name={name}
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
    </div>
  )
}
