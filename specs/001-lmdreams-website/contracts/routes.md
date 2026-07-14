# Technical Contract - Routes

## Purpose

List the public routes, their responsibilities, content sources, parameters, and empty/error states.

## Static Public Routes

| Route | Planned Source File | Responsibility | Primary Content Source | Empty / Failure State |
|------|----------------------|----------------|------------------------|-----------------------|
| `/` | `src/pages/index.astro` | Present company value proposition, trust, services preview, CTA, key contacts | `company.ts`, `navigation.ts`, featured services/projects | Never blank; hides unavailable blocks rather than inventing content |
| `/empresa/` | `src/pages/empresa/index.astro` | Explain who LMDreams is, values, specialization model, experience | `company.ts`, optional approved process data | Omits unconfirmed sub-sections |
| `/servicos/` | `src/pages/servicos/index.astro` | Show approved services list | Services collection | If no published services exist, render honest placeholder state |
| `/projetos/` | `src/pages/projetos/index.astro` | Show approved real projects | Projects collection | Professional empty state when zero published projects |
| `/contactos/` | `src/pages/contactos/index.astro` | Show contacts and contact/request form | `company.ts`, centralized form endpoint | If form unavailable, fallback contacts remain visible |
| `/privacidade/` | `src/pages/privacidade/index.astro` | Publish local privacy information | Local Markdown/content module | Must exist before production release |
| `/404.html` | `src/pages/404.astro` | Friendly missing-page response | Static content | Links back to key destinations |
| `/robots.txt` | `src/pages/robots.txt.ts` | Tell crawlers basic crawl/sitemap info | Central site config | Build fails if `siteUrl` required for sitemap/robots is not configured for deployment mode |

## Dynamic Static Routes

### `/servicos/[slug]/`

| Aspect | Contract |
|--------|----------|
| Planned source | `src/pages/servicos/[slug].astro` |
| Parameter | `slug` |
| Source entries | Services collection |
| Inclusion rule | Only `published = true` entries with required detail fields |
| Indexability | Indexable when published |
| Empty state | No route generated for unpublished/incomplete service; unknown slug resolves to 404 |

### `/projetos/[slug]/`

| Aspect | Contract |
|--------|----------|
| Planned source | `src/pages/projetos/[slug].astro` |
| Parameter | `slug` |
| Source entries | Projects collection |
| Inclusion rule | Only projects with `published = true`, `authorizedForPublication = true`, and required content complete |
| Indexability | Indexable when published and approved |
| Empty state | No route generated for excluded entries; unknown slug resolves to 404 |

## Navigation Rules

- Primary navigation should expose only stable public routes
- Dynamic detail pages do not need to appear in primary nav
- Breadcrumbs appear on detail pages and any deeper informational page where helpful
- Internal links use normal HTML anchors, not client-side router abstractions

## SEO Rules Per Route

- One H1 per page
- Unique title and description per route
- Canonical URL per route based on centralized public URL config
- Open Graph data per route with local share image fallback
- `lang="pt-PT"` on every HTML page

## Accessibility Rules Per Route

- `SkipLink` present globally
- DOM order must match reading order
- Keyboard navigation to all major content and interactive elements
- Visible focus state on links, buttons, fields, and mobile menu controls

## Publication Exclusion Rules

The build MUST exclude:

- unpublished service detail pages
- unpublished/unapproved project detail pages
- pages that would depend on fabricated content

Collection index routes remain available and must render honest empty states when needed.
