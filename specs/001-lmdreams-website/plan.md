# Implementation Plan: LMDreams Institutional Website

**Branch**: `001-lmdreams-website` | **Date**: 2026-07-13 | **Spec**: `specs/001-lmdreams-website/spec.md`

**Input**: Feature specification from `specs/001-lmdreams-website/spec.md`

## Summary

Build the first public version of the LMDreams institutional website as a fully static, multi-page Astro application with TypeScript in strict mode, native CSS, minimal browser JavaScript, versioned local content, GitHub Actions validation, and GitHub Pages deployment. The design must emphasize trust, rigor, specialization, transparency, accessibility, and performance while remaining fully independent from Higgsfield at build, deploy, and runtime.

## Technical Context

**Language/Version**: Astro `7.0.8`; TypeScript `strict`; native HTML/CSS; minimal native browser TypeScript/JavaScript for progressive enhancement only

**Primary Dependencies**:
- `astro` - static site generation, file-based routing, content collections, asset pipeline
- `typescript` - strict typing for content, data modules, and utilities
- `@astrojs/sitemap` - build-time sitemap generation
- `vitest` - unit tests for non-trivial local logic only
- `@playwright/test` - cross-browser E2E validation
- `@axe-core/playwright` - automated accessibility assertions in Playwright
- `@lhci/cli` - Lighthouse CI performance and quality assertions
- GitHub Actions official actions for Pages deployment plus Lychee GitHub Action for link validation

**Storage**: Repository-versioned files only (`src/data/`, `src/content/`, `src/assets/`, `public/`); no database; contact submissions are transient and sent directly to Formspree, not persisted by GitHub Pages

**Testing**: `astro check`; Vitest; Playwright (Chromium, Firefox, WebKit when viable); `@axe-core/playwright`; Lighthouse CI; automated link validation; `npm audit`

**Target Platform**: GitHub Pages static hosting; evergreen desktop/mobile browsers; mobile-first rendering

**Project Type**: Static multi-page institutional website

**Performance Goals**:
- Lighthouse Performance >= 90
- Lighthouse Accessibility >= 95 with target 100
- Lighthouse Best Practices >= 90
- Lighthouse SEO >= 95
- LCP <= 2.5s on controlled mobile conditions
- CLS <= 0.1
- INP <= 200ms where measured
- Initial JS < 50 KB compressed per page except justified exceptions
- Initial homepage payload < 1.5 MB

**Constraints**:
- MUST deploy to GitHub Pages from the main LMDreams repository only
- MUST use static output; no SSR, no SPA-only routing, no database, no authentication
- MUST keep essential content in generated HTML without JS dependency
- MUST keep all runtime assets local to the repository or explicitly justified third-party services
- MUST expose no secrets in frontend code
- MUST remain functional if Higgsfield tooling becomes unavailable
- MUST avoid invented company data, fictitious testimonials, or misleading portfolio imagery

**Scale/Scope**:
- Core public routes: `/`, `/empresa/`, `/servicos/`, `/servicos/[slug]/`, `/projetos/`, `/projetos/[slug]/`, `/contactos/`, `/privacidade/`, `/404.html`
- Detail pages generated only for published entries
- Expected content scale: low editorial frequency, tens of service/project entries at most
- One contact form integration; no authenticated user flows

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Initial Gate (Before Phase 0 Research)

| Check | Result | Notes |
|-------|--------|-------|
| Scope MUST remain an institutional website for LMDreams | PASS | No portal, auth, blog, app, or SaaS scope introduced |
| Hosting MUST remain compatible with GitHub Pages | PASS | Static Astro output only; no backend runtime |
| Plan MUST avoid unnecessary stack expansion | PASS | Preferred stack kept: Astro + TS + native CSS/JS |
| Runtime dependencies MUST be justified | PASS | Only one runtime external dependency is planned: Formspree; full justification documented in `research.md` |
| Accessibility MUST target WCAG 2.2 AA | PASS | Automated + manual accessibility gates defined |
| Performance MUST have measurable targets | PASS | Lighthouse, LCP, CLS, INP, payload, and JS budgets defined |
| Privacy/security MUST avoid secrets and tracking by default | PASS | No analytics, no maps embed, no cookies non-essential, no frontend secrets |
| Plan MUST stay separate from implementation | PASS | This phase creates planning artifacts only; no production code, no dependencies installed |
| Any exception MUST be documented | PASS | No constitutional exception required at planning time |
| Repository ownership MUST remain with LMDreams main GitHub repo | PASS | No Higgsfield repo, branch, or mirror is introduced |
| Higgsfield MUST remain optional and non-runtime | PASS | Policy documented as design aid only; all outputs must be exported locally |
| Content MUST remain truthful and approved | PASS | Missing company data remains pending; no facts invented |

## Architecture Overview

### Rendering Model

- Static multi-page application (MPA) generated at build time with Astro file-based routing
- No SPA shell, no client-only router, no global hydration
- Essential page content rendered into static HTML
- Progressive enhancement reserved for mobile navigation, gallery ergonomics, and form UX improvements

### Routing and Page Generation

- `src/pages/index.astro` -> `/`
- `src/pages/empresa/index.astro` -> `/empresa/`
- `src/pages/servicos/index.astro` -> `/servicos/`
- `src/pages/servicos/[slug].astro` -> statically generated only for published services with sufficient detail content
- `src/pages/projetos/index.astro` -> `/projetos/`
- `src/pages/projetos/[slug].astro` -> statically generated only for published + approved projects
- `src/pages/contactos/index.astro` -> `/contactos/`
- `src/pages/privacidade/index.astro` -> `/privacidade/`
- `src/pages/404.astro` -> `/404.html`
- `src/pages/robots.txt.ts` -> `/robots.txt` as static build artifact

### Content Architecture

- `site.config.mjs` centralizes `siteUrl`, `basePath`, `pagesMode`, and optional `customDomain`
- `src/data/company.ts` stores global company/contact/legal/CTA configuration and explicit pending values
- `src/data/navigation.ts` stores primary navigation and footer links
- `src/data/process.ts` stores the company work-process steps when confirmed
- `src/content.config.ts` defines typed Astro content collections for services and projects
- `src/content/services/*.md` stores service entries with strict frontmatter schema
- `src/content/projects/*.md` stores project entries with strict frontmatter schema
- Unconfirmed content remains unpublished or explicitly pending in data modules; it must not be surfaced as factual public content

### Component Strategy

- Shared layout and metadata in `BaseLayout` and `PageHead`
- Shared global chrome in `SiteHeader`, `DesktopNavigation`, `MobileNavigation`, `SiteFooter`, and `SkipLink`
- Reusable content sections for hero, trust indicators, process steps, cards, empty states, contact options, and breadcrumbs
- Project gallery isolated behind a dedicated component so keyboard behavior, image labeling, and progressive enhancement can be validated independently
- No component may depend on Higgsfield services, scripts, or remote assets to render

### Styling Strategy

- Native CSS only
- Design tokens defined as CSS custom properties in `src/styles/tokens.css`
- Global reset, typography, layout primitives, forms, and accessibility utilities in `src/styles/global.css`
- Limited shared helpers in `src/styles/utilities.css`
- Component-local styles stay in scoped `.astro` `<style>` blocks until a repeated pattern justifies extraction
- No Tailwind, Bootstrap, or component library

### Visual Direction

- Warm light base surfaces rather than stark clinical white
- Graphite/charcoal neutrals for primary text and structure
- Single warm accent family (copper / terracotta / clay) for emphasis and interactive states
- System-font stack by default for performance and licensing simplicity
- Spacious layout rhythm, strong headings, clear grid alignment, and restrained motion
- Images must communicate architecture, materials, construction detail, and professionalism without implying fictitious completed work

### SEO and Metadata

- `PageHead` centralizes page title, description, canonical URL, Open Graph, and social image logic
- `lang="pt-PT"` at document root
- `@astrojs/sitemap` generates sitemap from static routes
- `robots.txt` references the sitemap using the same central site URL
- Structured data is emitted only when the required real company metadata exists

### Contact Form Strategy

- Static HTML form posts directly to Formspree endpoint
- HTML validation remains the primary no-JS validation layer
- Optional JS enhancement upgrades UX (inline state, preserved values on failure, error summary), but the form still works without JS
- Form endpoint is stored in one centralized configuration field, not scattered across components
- If Formspree is unavailable, visible contact alternatives (`tel:` and `mailto:`) remain usable

### CI/CD Strategy

- `validate.yml` runs on pull requests, relevant pushes, and manual dispatch
- `deploy-pages.yml` runs on pushes to the default branch and manual dispatch
- GitHub Pages source is GitHub Actions only
- Only the static output directory is uploaded and deployed

## Project Structure

### Documentation (this feature)

```text
specs/001-lmdreams-website/
â”œâ”€â”€ plan.md
â”œâ”€â”€ research.md
â”œâ”€â”€ data-model.md
â”œâ”€â”€ quickstart.md
â”œâ”€â”€ contracts/
â”‚   â”œâ”€â”€ contact-form.md
â”‚   â”œâ”€â”€ content-schema.md
â”‚   â”œâ”€â”€ routes.md
â”‚   â””â”€â”€ deployment.md
â””â”€â”€ tasks.md                # Created later by /speckit.tasks
```

### Source Code (repository root)

```text
/
â”œâ”€â”€ .github/
â”‚   â””â”€â”€ workflows/
â”‚       â”œâ”€â”€ validate.yml
â”‚       â””â”€â”€ deploy-pages.yml
â”œâ”€â”€ docs/
â”‚   â””â”€â”€ design/
â”‚       â”œâ”€â”€ design-direction.md
â”‚       â”œâ”€â”€ higgsfield-usage.md
â”‚       â””â”€â”€ asset-provenance.md
â”œâ”€â”€ public/
â”‚   â”œâ”€â”€ favicon.svg
â”‚   â””â”€â”€ social/
â”‚       â””â”€â”€ og-default.jpg
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ assets/
â”‚   â”‚   â”œâ”€â”€ brand/
â”‚   â”‚   â”œâ”€â”€ company/
â”‚   â”‚   â”œâ”€â”€ projects/
â”‚   â”‚   â”œâ”€â”€ services/
â”‚   â”‚   â””â”€â”€ illustrative/
â”‚   â”œâ”€â”€ components/
â”‚   â”œâ”€â”€ content/
â”‚   â”‚   â”œâ”€â”€ projects/
â”‚   â”‚   â””â”€â”€ services/
â”‚   â”œâ”€â”€ data/
â”‚   â”‚   â”œâ”€â”€ company.ts
â”‚   â”‚   â”œâ”€â”€ navigation.ts
â”‚   â”‚   â””â”€â”€ process.ts
â”‚   â”œâ”€â”€ layouts/
â”‚   â”œâ”€â”€ pages/
â”‚   â”‚   â”œâ”€â”€ 404.astro
â”‚   â”‚   â”œâ”€â”€ robots.txt.ts
â”‚   â”‚   â”œâ”€â”€ contactos/
â”‚   â”‚   â”œâ”€â”€ empresa/
â”‚   â”‚   â”œâ”€â”€ privacidade/
â”‚   â”‚   â”œâ”€â”€ projetos/
â”‚   â”‚   â””â”€â”€ servicos/
â”‚   â”œâ”€â”€ scripts/
â”‚   â”œâ”€â”€ styles/
â”‚   â”‚   â”œâ”€â”€ global.css
â”‚   â”‚   â”œâ”€â”€ tokens.css
â”‚   â”‚   â””â”€â”€ utilities.css
â”‚   â”œâ”€â”€ types/
â”‚   â””â”€â”€ utils/
â”œâ”€â”€ tests/
â”‚   â”œâ”€â”€ accessibility/
â”‚   â”œâ”€â”€ e2e/
â”‚   â””â”€â”€ unit/
â”œâ”€â”€ astro.config.mjs
â”œâ”€â”€ site.config.mjs
â”œâ”€â”€ package.json
â”œâ”€â”€ package-lock.json
â”œâ”€â”€ tsconfig.json
â””â”€â”€ README.md
```

**Structure Decision**: Single Astro project with local content and static output. `site.config.mjs` is the single source of truth for public URL/base mode, while typed local content lives under `src/data/` and `src/content/`. `public/CNAME` is intentionally omitted from the default structure and must only be created after a real custom domain is confirmed.

## Dependency Plan

### Selected Package Dependencies

| Dependency | Type | Why It Is Needed | Why Simpler Alternatives Were Rejected |
|------------|------|------------------|----------------------------------------|
| `astro` | core | Static generation, routing, assets, content collections | Hand-written static HTML would reduce maintainability and schema validation |
| `typescript` | dev | Strict typing for content and configuration safety | Plain JS weakens validation of pending/published content |
| `@astrojs/sitemap` | build | Official sitemap generation from static routes | Manual sitemap creation would be error-prone as routes grow |
| `vitest` | dev | Fast unit tests for pure utilities only | No unit test runner would force logic testing into slower E2E only |
| `@playwright/test` | dev | Cross-browser E2E and keyboard-navigation coverage | Browser-manual-only validation is insufficient for repeatable CI |
| `@axe-core/playwright` | dev | Automated accessibility regression checks inside E2E flows | Manual-only a11y review would not scale in CI |
| `@lhci/cli` | CI/dev | Reproducible Lighthouse assertions and budgets | Manual Lighthouse runs are too variable and non-repeatable |

### Explicit Non-Selections

- No React, Vue, Svelte, Angular, Next.js, or TanStack Start
- No Tailwind CSS, Bootstrap, jQuery, or component framework
- No CMS, database, server runtime, API layer, or analytics package
- No icon library; only local/inline SVGs
- No Higgsfield runtime SDK or remote asset dependency

## Route and Content Decisions

### Public Route Strategy

- `/servicos/[slug]/` exists only when the service entry is `published: true` and includes the required detail fields
- `/projetos/[slug]/` exists only when the project is published, approved, authorized, and visually honest
- `/projetos/` renders an empty professional state if there are zero published project entries
- Unknown dynamic slugs resolve to static 404 output

### Content Publication Rules

- Draft or incomplete service entries are excluded from generated static paths
- Draft, unapproved, unauthorized, visually misleading, or photo-incomplete (< 2 authorized real photos) project entries are excluded from generated static paths
- Generated/illustrative/stock/placeholder images may appear only in clearly marked non-proof contexts
- Local business schema data is withheld until legal name, contacts, public URL, service set, and location/coverage are confirmed

## Design System Plan

### Token Families

- `--color-*`: surfaces, text, borders, accent, success, error, focus
- `--font-*`: family stacks, sizes, line-heights, weights
- `--space-*`: spacing scale from dense mobile spacing to wide desktop spacing
- `--radius-*`: corner radii for cards, buttons, form controls
- `--shadow-*`: restrained elevation levels
- `--container-*`: max content widths and reading widths
- `--breakpoint-*`: mobile, tablet, laptop, desktop thresholds
- `--motion-*`: durations/easings with reduced-motion overrides

### Interaction Rules

- Focus states must be highly visible and not depend only on color
- Hover-only affordances are forbidden for essential content
- Success/error states use both color and text/icon reinforcement
- Motion defaults are subtle; all decorative motion must degrade to none under `prefers-reduced-motion`

## Testing and Validation Plan

### Automated Validation

- `npm ci` for reproducible install
- `astro check` for Astro + TypeScript correctness
- Content schema validation during build
- Vitest for utilities only (formatting, path helpers, filters, guards)
- Playwright for critical navigation/form/menu/404 flows
- `@axe-core/playwright` on homepage, service listing, project listing, contacts, and menu-open states
- Lighthouse CI against representative pages
- Link validation for internal routes, anchors, `mailto:`, `tel:`, canonical URLs, and static assets
- `npm audit` to surface vulnerable dependencies

### Manual Validation

- Keyboard-only navigation
- Focus visibility
- Screen reader smoke test
- Zoom at 200%
- Reduced motion behavior
- Contrast review
- Mobile menu behavior
- Form validation and fallback messaging
- Project gallery keyboard behavior

## GitHub Pages Strategy

### Mode A: Project Pages

- Example shape: `https://<user>.github.io/<repo>/`
- `siteUrl` set to the actual GitHub Pages public URL
- `basePath` set to `/<repo>`
- Internal links and canonical generation consume centralized config, not hardcoded prefixes

### Mode B: Custom Domain

- Example shape: `https://dominio-da-empresa.pt/`
- `siteUrl` set to the real confirmed domain
- `basePath` set to `/`
- `public/CNAME` created only after domain confirmation
- DNS remains an out-of-repo operational task

### Centralization Rule

All URL-sensitive settings flow from `site.config.mjs` into `astro.config.mjs`, head metadata, sitemap, and robots generation so domain changes require one logical update.

## Security and Privacy Plan

- No frontend secrets, tokens, private keys, or real `.env` files
- No analytics, ad pixels, map embeds, chat widgets, or non-essential cookies in v1
- No user-provided HTML rendering, no `innerHTML` without compelling reviewed need
- Form fields limited to the minimum necessary request data
- Links opening a new tab use appropriate security attributes
- Vendor risk isolated to the form provider and documented with fallback contacts

## Post-Design Constitution Check (After Phase 1 Design)

| Check | Result | Notes |
|-------|--------|-------|
| Repository ownership remains with main GitHub repo | PASS | All build/deploy assets remain in the LMDreams repository |
| GitHub Pages compatibility preserved | PASS | Static output, no SSR/backend dependency |
| Higgsfield independence preserved | PASS | Higgsfield appears only in optional design/provenance documentation |
| Content truthfulness preserved | PASS | Publication gates prevent invented or misleading content |
| Specialization remains central brand message | PASS | Page/component structure reserves dedicated positioning sections |
| UX simplicity preserved | PASS | MPA, semantic navigation, visible CTAs, minimal JS |
| Accessibility strategy remains enforceable | PASS | WCAG 2.2 AA gates and automated/manual checks defined |
| Performance strategy remains measurable | PASS | Explicit budgets and Lighthouse/LCP/CLS/INP validation defined |
| Simplicity/manutenability preserved | PASS | Local content, small dependency set, no CMS/backend |
| SEO requirements preserved | PASS | Static HTML, metadata, sitemap, robots, canonical strategy defined |
| Privacy preserved | PASS | No tracking by default; minimal-data form; provider risk documented |
| Security preserved | PASS | No frontend secrets; minimal workflow permissions; dependency audit planned |
| Pre-publication validation preserved | PASS | Build, a11y, links, performance, Pages path validation all gated |
| Phase separation preserved | PASS | Only planning artifacts created; no production implementation done |

## Complexity Tracking

No constitutional exception is required at this stage.