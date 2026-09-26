import { ui } from '../../content/common'

// "Saltar para o conteúdo" (Parte 3.10): primeiro elemento focável da página (o
// SiteLayout coloca-o antes do cabeçalho). Fica fora do ecrã e desce ao receber o foco,
// por cima do cabeçalho fixo; alvo de 44 px de altura.
export function SkipLink() {
  return (
    <a
      href="#conteudo"
      data-skip-link=""
      className={[
        'fixed top-3 left-4 z-[100] inline-flex min-h-11 items-center rounded-sm bg-ink px-4 py-2',
        'font-body text-[0.9375rem] font-semibold text-on-dark',
        '-translate-y-[calc(100%_+_1.5rem)] transition-transform duration-150 ease-planta',
        'hover:underline focus:translate-y-0 focus-visible:underline',
      ].join(' ')}
    >
      {ui.a11y.skipLink}
    </a>
  )
}
