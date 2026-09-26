// <head> de cada página, gerado na pré-renderização (Parte 3.9).
// Meta tags, Open Graph e JSON-LD nunca incluem placeholders: se o valor for
// placeholder, o campo é omitido.

import { company } from '../content/company'
import { seo } from '../content/seo'
import { services } from '../content/services'
import { absoluteUrl, withBase } from './links'
import { pageById, type PageId } from './pages'
import { isPlaceholder, realOrUndefined } from './placeholders'

export const THEME_COLOR = '#f6f5f1'
export const OG_IMAGE = { path: 'og-image.jpg', width: 1200, height: 630 }

function esc(valor: string): string {
  return valor
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function meta(attr: 'name' | 'property', key: string, content: string): string {
  return `<meta ${attr}="${key}" content="${esc(content)}">`
}

/** Dados estruturados da página principal (GeneralContractor). */
export function buildJsonLd(): Record<string, unknown> {
  const confirmed = services.filter((s) => s.confirmado).map((s) => s.name)
  const sameAs = company.social.map((s) => s.url).filter((u) => u.startsWith('https://'))
  const legalName = realOrUndefined(company.legal.name)
  const vatID = realOrUndefined(company.legal.nipc)
  const address = company.publicAddress ? realOrUndefined(company.publicAddress) : undefined

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    name: company.name,
    url: absoluteUrl(),
    logo: absoluteUrl('logo-lmdreams.png'),
    image: absoluteUrl(OG_IMAGE.path),
    description: seo.organizationDescription,
    telephone: company.phone.e164,
    email: company.email,
    areaServed: { '@type': 'AdministrativeArea', name: company.areaServed },
  }
  if (confirmed.length > 0) data.knowsAbout = confirmed
  if (sameAs.length > 0) data.sameAs = sameAs
  if (legalName) data.legalName = legalName
  if (vatID) data.vatID = vatID
  if (address) data.address = address

  // Salvaguarda: nenhum placeholder pode chegar ao JSON-LD.
  const json = JSON.stringify(data)
  if (isPlaceholder(json)) throw new Error('JSON-LD com placeholder')
  return data
}

export function buildHead(page: PageId): string {
  const def = pageById(page)
  const info = seo.pages[page]
  const title = info.title
  const description = info.description
  const canonical = page === 'notFound' ? null : absoluteUrl(def.path)
  const ogUrl = canonical ?? absoluteUrl()

  if (isPlaceholder(title) || isPlaceholder(description) || isPlaceholder(seo.ogImageAlt)) {
    throw new Error(`SEO com placeholder na página ${page}`)
  }

  const tags: string[] = [
    `<title>${esc(title)}</title>`,
    meta('name', 'description', description),
    meta('name', 'robots', def.indexable ? 'index,follow' : 'noindex,follow'),
  ]
  if (canonical) tags.push(`<link rel="canonical" href="${esc(canonical)}">`)
  tags.push(
    meta('property', 'og:type', 'website'),
    meta('property', 'og:locale', seo.locale),
    meta('property', 'og:site_name', seo.siteName),
    meta('property', 'og:title', title),
    meta('property', 'og:description', description),
    meta('property', 'og:url', ogUrl),
    meta('property', 'og:image', absoluteUrl(OG_IMAGE.path)),
    meta('property', 'og:image:width', String(OG_IMAGE.width)),
    meta('property', 'og:image:height', String(OG_IMAGE.height)),
    meta('property', 'og:image:alt', seo.ogImageAlt),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', title),
    meta('name', 'twitter:description', description),
    meta('name', 'twitter:image', absoluteUrl(OG_IMAGE.path)),
    meta('name', 'theme-color', THEME_COLOR),
    `<link rel="icon" href="${withBase('favicon.ico')}" sizes="32x32">`,
    `<link rel="icon" type="image/png" sizes="32x32" href="${withBase('favicon-32.png')}">`,
    `<link rel="apple-touch-icon" href="${withBase('apple-touch-icon.png')}">`,
    `<link rel="manifest" href="${withBase('site.webmanifest')}">`,
  )
  if (page === 'home') {
    const json = JSON.stringify(buildJsonLd()).replace(/</g, '\\u003c')
    tags.push(`<script type="application/ld+json">${json}</script>`)
  }
  return tags.join('\n    ')
}
