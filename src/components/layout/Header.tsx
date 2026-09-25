import { Phone } from 'lucide-react'
import { company } from '../../content/company'
import { ui } from '../../content/common'
import { navigation } from '../../content/navigation'
import { logo } from '../../lib/brand'
import { anchorHref } from '../../lib/links'
import { useCurrentPage } from '../../lib/page-context'
import { quoteLinkProps } from '../../lib/quote-links'
import { Button } from '../ui/Button'
import { useActiveSection, useScrolled } from './hooks'
import { MobileMenu } from './MobileMenu'

// Cabeçalho fixo (Partes 5.3 e 5.4 §1; design/direcao-visual.md, secções 5 e 10).
// 64 px abaixo de 768 px e 72 px a partir daí (var(--header-h)); linha e sombra só
// depois de fazer scroll (box-shadow: sem saltos de layout).
//
// Larguras (métricas das fontes reais, com margem para os pesos 500 e 600):
//  < 768 px   placa, nome (escondido abaixo de 380 px), "Pedir orçamento" compacto, menu
//             (390 px: cerca de 339 px de 358 px; 320 px: cerca de 249 px de 288 px).
//  768–1151   placa, nome, "Ligar", "Pedir orçamento", menu (768 px: cerca de 503 de 720).
//  1152–1279  navegação completa + "Ligar" + "Pedir orçamento" (1152 px: cerca de 1035 de 1088).
//  ≥ 1280     navegação + número com o tipo de chamada + "Pedir orçamento" (1280 px: cerca
//             de 1170 de 1216); o ícone do telefone só entra a partir de 1440 px.

const LOGO_SIZES = '(min-width: 1024px) 83px, (min-width: 768px) 68px, 60px'

// A ligação tem 44 px de altura, centrada nos 72 px do cabeçalho: o anel de foco global
// (2 px com afastamento de 3 px) cabe inteiro dentro do cabeçalho (Parte 5.3).
const NAV_LINK =
  'flex min-h-11 items-center whitespace-nowrap text-[0.9375rem] font-medium text-ink ' +
  'decoration-1 underline-offset-[6px] transition-colors duration-150 ease-planta hover:underline focus-visible:underline'

// Barra de 2 px em latão no fundo do cabeçalho, sob o item da secção atual. A ligação não
// é posicionada: a barra fica no fundo do <li> (relative), que ocupa a altura toda.
const NAV_LINK_ACTIVE = 'after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-accent'

export function Header() {
  const page = useCurrentPage()
  const scrolled = useScrolled()
  const active = useActiveSection(page)

  return (
    <header
      data-scrolled={scrolled ? '' : undefined}
      className={[
        'fixed inset-x-0 top-0 z-50 h-[var(--header-h)] bg-bg pr-[var(--lmd-sbw,0px)]',
        'transition-shadow duration-250 ease-planta',
        scrolled ? 'shadow-header' : '',
      ].join(' ')}
    >
      <div className="container-site flex h-full items-center gap-2 md:gap-4">
        {/* Placa do logótipo e nome: uma só peça, ligação para o início. */}
        <a
          href={anchorHref('inicio', page)}
          aria-label={navigation.logoLabel}
          className="group flex min-h-11 shrink-0 items-center gap-2 rounded-sm md:gap-3"
        >
          <img
            src={logo.src}
            srcSet={logo.srcSet}
            sizes={LOGO_SIZES}
            width={logo.width}
            height={logo.height}
            alt=""
            decoding="async"
            className="h-8 w-auto rounded-sm transition-opacity duration-150 ease-planta group-hover:opacity-90 md:h-9 lg:h-11"
          />
          <span
            className={[
              'font-display text-base leading-none font-[650] tracking-[-0.015em] text-dark',
              'decoration-1 underline-offset-4 group-hover:underline group-focus-visible:underline',
              'max-[380px]:sr-only md:text-[1.1875rem] lg:text-[1.3125rem]',
            ].join(' ')}
          >
            {company.name}
          </span>
        </a>

        {/* Navegação principal a partir de 1152 px. */}
        <nav aria-label={navigation.ariaLabel} className="ml-6 hidden h-full nav:block min-[1440px]:ml-12">
          <ul className="flex h-full items-stretch gap-4 xl:gap-5 min-[1440px]:gap-7">
            {navigation.items.map((item) => {
              const current = active === item.anchor
              return (
                <li key={item.anchor} className="relative flex items-center">
                  <a
                    href={anchorHref(item.anchor, page)}
                    aria-current={current ? 'location' : undefined}
                    className={[NAV_LINK, current ? NAV_LINK_ACTIVE : ''].join(' ')}
                  >
                    {item.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 md:gap-3 xl:gap-6">
          {/* A partir de 1280 px: número clicável com o tipo de chamada por baixo. */}
          <a
            href={company.phone.href}
            className="group hidden min-h-11 items-center gap-2.5 rounded-sm xl:flex"
          >
            <Phone
              size={20}
              strokeWidth={1.5}
              aria-hidden="true"
              focusable="false"
              className="hidden shrink-0 text-muted min-[1440px]:block"
            />
            <span className="flex flex-col">
              <span className="tabular text-[0.9375rem] leading-5 font-medium tracking-[0.01em] text-ink decoration-1 underline-offset-4 group-hover:underline group-focus-visible:underline">
                {company.phone.display}
              </span>
              <span className="text-[0.75rem] leading-4 whitespace-nowrap text-muted">({company.phoneCallNote})</span>
            </span>
          </a>

          {/* Entre 768 e 1279 px: botão compacto "Ligar" (exceção da Parte 1.4, regra 12). */}
          <Button
            variant="secondary"
            href={company.phone.href}
            aria-label={ui.a11y.callCompany}
            icon={<Phone size={20} strokeWidth={1.5} aria-hidden="true" focusable="false" />}
            className="max-md:hidden xl:hidden"
          >
            {ui.labels.callShort}
          </Button>

          {/* "Pedir orçamento": visível em todas as larguras, fora do menu. */}
          <Button
            href={anchorHref('contactos', page)}
            className="whitespace-nowrap max-md:px-3 max-md:text-[0.84375rem]"
            {...quoteLinkProps}
          >
            {ui.labels.requestQuote}
          </Button>

          <MobileMenu activeAnchor={active} className="nav:hidden" />
        </div>
      </div>
    </header>
  )
}
