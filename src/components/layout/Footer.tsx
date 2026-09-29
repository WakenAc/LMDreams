import { company } from '../../content/company'
import { contact } from '../../content/contact'
import { ui } from '../../content/common'
import { footer } from '../../content/footer'
import { hasIllustrativeImages } from '../../content/images'
import { navigation } from '../../content/navigation'
import { services } from '../../content/services'
import { logo } from '../../lib/brand'
import { anchorHref, pageHref, withBase } from '../../lib/links'
import { useCurrentPage } from '../../lib/page-context'
import { whatsappHref } from '../../lib/whatsapp'
import { Button } from '../ui/Button'
import { PlainText, RichText } from '../ui/RichText'
import { VisuallyHidden } from '../ui/VisuallyHidden'
import { FOOTER_NAV_ID } from './ids'
import { LegalInfo } from './LegalInfo'

// Rodapé de todas as páginas (Anexo A §12; Partes 5.4 §12 e 5.6), em faixa `dark`.
// Três faixas:
//  1. marca e descrição, ligações rápidas (nav#navegacao-rodape: também é o destino do
//     botão de menu sem JavaScript), os seis serviços em destaque e os contactos;
//  2. políticas, Livro de Reclamações Eletrónico, bloco "Informação legal" e RAL;
//  3. nota das imagens ilustrativas e ©.
// Empilhado em telemóvel; duas colunas a partir de 768 px; grelha de 12 a partir de 1024.

const HEADING = 'font-display text-[1.0625rem] leading-snug font-semibold text-on-dark'
const LINK =
  'text-on-dark decoration-1 underline-offset-4 transition-colors duration-150 ease-planta ' +
  'hover:text-white hover:underline focus-visible:underline'
// Alvo de 44 px em telemóvel; 32 px a partir de 768 px (acima dos 24 px do WCAG 2.2 AA).
const LIST_LINK = `inline-flex min-h-11 items-center md:min-h-8 ${LINK}`
const LABEL = 'text-small text-muted-on-dark'
const RAL_LINK =
  'text-on-dark underline decoration-1 underline-offset-[3px] transition-colors duration-150 ease-planta hover:text-white hover:decoration-2'

/**
 * Nota das imagens ilustrativas: só se o site mostrar alguma (Parte 4.8). Calculada aqui,
 * e não em company.ts (que todas as ilhas importam): o rodapé não é uma ilha, por isso o
 * registo de imagens não precisa de ir para o JavaScript das ilhas.
 */
const SHOW_AI_NOTICE = hasIllustrativeImages()

/** Os seis serviços principais são os que têm imagem (Parte 5.4 §5). */
const FEATURED_SERVICES = services.filter((s) => 'imageId' in s)

/** Ícone do Livro de Reclamações: ficheiro em public/ (com o base path) ou URL já resolvido. */
function iconSrc(src: string): string {
  return /^(?:[a-z][a-z0-9+.-]*:|\/)/i.test(src) ? src : withBase(src)
}

function ComplaintsBook() {
  const icon = company.complaintsBookIcon
  const { url, label } = ui.complaintsBook
  if (typeof icon !== 'string') {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener"
        className="inline-flex rounded-sm transition-opacity duration-150 ease-planta hover:opacity-90"
      >
        <img
          src={iconSrc(icon.src)}
          width={icon.width}
          height={icon.height}
          alt={label}
          loading="lazy"
          decoding="async"
          className="h-12 w-auto"
        />
        <VisuallyHidden> {ui.a11y.newWindow}</VisuallyHidden>
      </a>
    )
  }
  // Enquanto o ícone oficial não existir: só a ligação em texto (a obrigação de dar acesso ao
  // Livro de Reclamações cumpre-se na mesma). O pendente continua em CONTEUDO-A-SUBSTITUIR.md.
  return (
    <a href={url} target="_blank" rel="noopener" className={`${LIST_LINK} underline`}>
      {label}
      <VisuallyHidden> {ui.a11y.newWindow}</VisuallyHidden>
    </a>
  )
}

export function Footer() {
  const page = useCurrentPage()
  const { details } = contact

  return (
    <footer data-site-footer="" className="bg-dark text-on-dark">
      <div className="container-site pt-16 pb-10 md:pt-20 lg:pt-24">
        {/* 1. Marca, ligações rápidas, serviços e contactos */}
        <div className="grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-12">
          <div className="md:col-span-2 lg:col-span-3 xl:col-span-4">
            {/* O ficheiro tem o fundo igual a `dark`: sem placa visível. O símbolo não tem
                texto, por isso o nome segue-o, como no cabeçalho. A margem esquerda do
                ficheiro (48 de 352 px, invisível sobre `dark`) é compensada na imagem, sem a
                recortar: 12 px com 48 px de altura e 14 px com 56 px. O desenho alinha com a
                descrição e a ligação (e o anel de foco) continua no contentor. */}
            <a
              href={anchorHref('inicio', page)}
              aria-label={navigation.logoLabel}
              className="group inline-flex items-center gap-3 rounded-sm"
            >
              <img
                src={logo.src}
                srcSet={logo.srcSet}
                sizes="(min-width: 768px) 105px, 90px"
                width={logo.width}
                height={logo.height}
                alt=""
                loading="lazy"
                decoding="async"
                className="-ml-3 h-12 w-auto md:-ml-3.5 md:h-14"
              />
              <span className="font-display text-[1.1875rem] leading-none font-[650] tracking-[-0.015em] text-on-dark decoration-1 underline-offset-4 group-hover:underline group-focus-visible:underline xl:text-[1.3125rem]">
                {company.name}
              </span>
            </a>
            {/* Slogan do logótipo, junto à marca; em `on-dark` (texto pequeno em latão sobre
                `dark` fica de fora pela direção visual). */}
            <p className="mt-3 font-display text-[1.0625rem] leading-snug font-medium text-on-dark">
              {company.slogan}
            </p>
            <p className="mt-5 max-w-[38ch] text-muted-on-dark">{footer.description}</p>
          </div>

          <nav id={FOOTER_NAV_ID} aria-labelledby="rodape-ligacoes-titulo" className="lg:col-span-3 xl:col-span-2">
            <h2 id="rodape-ligacoes-titulo" className={HEADING}>
              {footer.quickLinksHeading}
            </h2>
            <ul className="mt-3 md:mt-4 md:space-y-1">
              {navigation.items.map((item) => (
                <li key={item.anchor}>
                  <a href={anchorHref(item.anchor, page)} className={LIST_LINK}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h2 className={HEADING}>{footer.servicesHeading}</h2>
            <ul className="mt-4 space-y-2 text-muted-on-dark">
              {FEATURED_SERVICES.map((s) => (
                <li key={s.id}>{s.name}</li>
              ))}
            </ul>
            <Button variant="link" onDark href={anchorHref('servicos', page)} className="mt-3">
              {footer.allServicesLabel}
            </Button>
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <h2 className={HEADING}>{footer.contactsHeading}</h2>
            <dl className="mt-4 grid gap-x-6 gap-y-5 md:grid-cols-2 lg:grid-cols-1">
              <div>
                <dt className={LABEL}>{details.phoneLabel}</dt>
                <dd>
                  <a href={company.phone.href} className={`${LIST_LINK} tabular`}>
                    {company.phone.display}
                  </a>
                  <span className="block text-small text-muted-on-dark">({company.phoneCallNote})</span>
                </dd>
              </div>
              <div>
                <dt className={LABEL}>{details.whatsappLabel}</dt>
                <dd>
                  <a href={whatsappHref()} target="_blank" rel="noopener" className={LIST_LINK}>
                    {ui.labels.whatsapp}
                    <VisuallyHidden> {ui.a11y.newWindow}</VisuallyHidden>
                  </a>
                </dd>
              </div>
              <div>
                <dt className={LABEL}>{details.emailLabel}</dt>
                <dd>
                  <a href={`mailto:${company.email}`} className={`${LIST_LINK} break-all`}>
                    {company.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className={LABEL}>{details.areaLabel}</dt>
                <dd className="mt-1">{company.areaServed}</dd>
              </div>
              {company.publicAddress ? (
                <div>
                  <dt className={LABEL}>{details.addressLabel}</dt>
                  <dd className="mt-1">{company.publicAddress}</dd>
                </div>
              ) : null}
              <div>
                <dt className={LABEL}>{details.hoursLabel}</dt>
                <dd className="mt-1">
                  <PlainText onDark text={company.hours} />
                </dd>
              </div>
              {company.social.length > 0 ? (
                <div>
                  <dt className={LABEL}>{details.socialLabel}</dt>
                  <dd>
                    <ul className="flex flex-wrap gap-x-5">
                      {company.social.map((s) => (
                        <li key={s.network}>
                          <a href={s.url} target="_blank" rel="noopener" className={LIST_LINK}>
                            {s.label}
                            <VisuallyHidden> {ui.a11y.newWindow}</VisuallyHidden>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ) : company.socialPending ? (
                <div>
                  <dt className={LABEL}>{details.socialLabel}</dt>
                  <dd className="mt-1">
                    <PlainText onDark text={company.socialPending} />
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>
        </div>

        {/* 2. Políticas, Livro de Reclamações, informação legal e RAL */}
        <div className="mt-14 grid gap-x-6 gap-y-10 border-t border-line-on-dark pt-10 md:mt-16 md:grid-cols-2 lg:grid-cols-12">
          <div className="grid content-start gap-x-6 gap-y-8 md:col-span-2 md:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
            <div>
              <h2 className={HEADING}>{footer.policiesHeading}</h2>
              <ul className="mt-3 md:mt-4 md:space-y-1">
                <li>
                  <a href={pageHref('privacy')} className={LIST_LINK}>
                    {footer.policyLinks.privacy}
                  </a>
                </li>
                <li>
                  <a href={pageHref('cookies')} className={LIST_LINK}>
                    {footer.policyLinks.cookies}
                  </a>
                </li>
                <li>
                  <a href={pageHref('terms')} className={LIST_LINK}>
                    {footer.policyLinks.terms}
                  </a>
                </li>
              </ul>
            </div>
            <div data-complaints-book="">
              <h2 className={HEADING}>{details.complaintsLabel}</h2>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 md:mt-4">
                <ComplaintsBook />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 md:col-span-2 lg:col-span-8">
            <LegalInfo />
            <p data-ral="" className="max-w-texto text-small text-muted-on-dark">
              <RichText value={footer.ral} onDark linkClassName={RAL_LINK} />
            </p>
          </div>
        </div>

        {/* 3. Nota das imagens ilustrativas e © */}
        <div className="mt-12 flex flex-col gap-3 border-t border-line-on-dark pt-6 text-small text-muted-on-dark md:flex-row md:items-start md:gap-8">
          {SHOW_AI_NOTICE ? (
            <p data-ai-notice="" className="max-w-texto">
              {footer.aiNotice}
            </p>
          ) : null}
          <p className="md:ml-auto md:shrink-0 md:text-right">{footer.copyright.replace('{ano}', __BUILD_YEAR__)}</p>
        </div>
      </div>
    </footer>
  )
}
