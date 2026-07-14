# Tasks Breakdown: LMDreams Institutional Website

**Feature**: `specs/001-lmdreams-website/`  
**Plan Reference**: `specs/001-lmdreams-website/plan.md`  
**Specification Reference**: `specs/001-lmdreams-website/spec.md`  

**Total Tasks**: 76 | **Phases**: 14 | **Parallelizable**: 40+ [P]  
**MVP Scope**: Phase 1–Phase 11 (all user stories)  

---

## Phase 1: Project Setup

**Purpose**: Initialize Astro project scaffold and configuration

- [X] T001 Initialize the Astro 7 + TypeScript project shell in `package.json`, `package-lock.json`, and `tsconfig.json`
- [X] T002 Configure static Astro output, sitemap integration, and centralized Pages URL settings in `astro.config.mjs` and `site.config.mjs`
- [X] T003 Create the planned source tree with placeholder keep files at `src/assets/brand/.gitkeep`, `src/assets/company/.gitkeep`, `src/assets/projects/.gitkeep`, `src/assets/services/.gitkeep`, `src/assets/illustrative/.gitkeep`, `src/content/services/.gitkeep`, `src/content/projects/.gitkeep`, `src/components/.gitkeep`, `src/layouts/.gitkeep`, `src/pages/empresa/.gitkeep`, `src/pages/servicos/.gitkeep`, `src/pages/projetos/.gitkeep`, `src/pages/contactos/.gitkeep`, `src/pages/privacidade/.gitkeep`, `src/scripts/.gitkeep`, `src/styles/.gitkeep`, `src/utils/.gitkeep`, `src/types/.gitkeep`, `tests/unit/.gitkeep`, `tests/e2e/.gitkeep`, and `tests/accessibility/.gitkeep`
- [X] T004 [P] Define repository validation and developer scripts in `package.json`, `playwright.config.ts`, `vitest.config.ts`, and `lhci.config.json`
- [X] T005 [P] Document local setup, validation, build, preview, and GitHub Pages publication workflow in `README.md`

---

## Phase 2: Foundational Patterns & Blocks

**Purpose**: Establish reusable layouts, styles, TypeScript utilities, and design system constants before user-story implementation

- [X] T006 [P] Create base layouts: `src/layouts/Base.astro` with global navigation structure, footer, metadata injection, and Formspree integration point
- [X] T007 [P] Create design tokens (CSS custom properties) in `src/styles/tokens.css` for colors, typography, spacing, shadows, z-indexes aligned to brand design direction
- [X] T008 [P] Create utility stylesheet `src/styles/utilities.css` for common responsive patterns (grid, flex, spacing utilities, focus states, reduced-motion overrides)
- [X] T009 [P] Create TypeScript data models and validators in `src/types/content.ts` and `src/utils/validation.ts` for services, projects, testimonials, contact submissions
- [X] T010 [P] Create Astro content collections configuration in `src/content/config.ts` with schemas for services and projects including publication gates *(implemented with Astro 7-compatible `src/content.config.ts`)*
- [X] T011 [P] Implement site configuration constants in `site.config.mjs` (company contact, public URLs, metadata, Formspree endpoint)

---

## Phase 3: Hero & Navigation (US1 — Compreender imediatamente)

**Purpose**: Deliver the first-impression page section and persistent navigation (max 10 seconds for full comprehension)

- [X] T012 [P] Create global navigation component in `src/components/Navigation.astro` with accessible menu, mobile burger trigger, sticky header option
- [X] T013 [P] Create footer component in `src/components/Footer.astro` with contact info, links, privacy/legal references, GitHub link
- [X] T014 Design hero section layout in `src/pages/index.astro`: company name, tagline/proposta de valor, key differentiation (specialization focus), 2+ CTAs (Contactar, Serviços)
- [X] T015 [P] Implement visual hierarchy and typography on hero to guide reading flow within 10 seconds
- [X] T016 [P] Ensure hero is fully functional on 320px mobile (no horizontal overflow, CTAs tappable)

---

## Phase 4: Services Listing & Detail (US2 — Conhecer serviços)

**Purpose**: Create a discoverable, organized service directory with optional expandable detail views

- [X] T017 [P] Create service collection data in `src/content/services/` with approved services from company (initially [CONTENT PENDING] with example placeholders, flagged "[EXEMPLO]")
- [X] T018 Create service listing template in `src/pages/servicos/index.astro`: grid of service cards, each with name, icon, short description, "Saber mais" link
- [X] T019 [P] Create service detail template in `src/pages/servicos/[slug].astro`: full description, benefits, process steps, CTA to contact
- [X] T020 [P] Implement service cards with accessible focus states and lazy image loading
- [X] T021 [P] Add filtering/search to services page if 5+ services exist; otherwise simple 2-column grid

---

## Phase 5: Specialization Messaging (US3 — Especialização como diferenciador)

**Purpose**: Highlight differentiation story with positive, professional messaging

- [X] T022 [P] Design "Como Trabalhamos" section in site navigation and hero CTAs
- [X] T023 Create explainer page in `src/pages/empresa/como-trabalhamos.astro`: 7-10 process steps, specialization benefits, no timeline promises
- [X] T024 [P] Create visual (cards, timeline-like, or flow diagram) showing specialist roles without depreciating competitors
- [X] T025 [P] Ensure messaging aligns with Princípio IV: clarity, credibility, no attacks on competitors

---

## Phase 6: Company & Experience (US4 — Empresa e experiência)

**Purpose**: Build trust through transparent company information and experience narrative

- [X] T026 Create "Sobre Nós" page in `src/pages/empresa/index.astro` with company mission, values, team structure, professionalism statement
- [X] T027 [P] Display "20+ anos de experiência" correctly in company context (referring to professionals, not company age — per Princípio III)
- [X] T028 [P] Create team/specialist overview section linking specialization to company structure
- [ ] T029 [P] Add contact section with email, phone, optional in-page contact form *(contact CTA section added, but real approved phone/email data is still pending)*
- [ ] T030 [P] Ensure all text is truth-verifiable and approved before publication *(truthful/pending handling implemented, but external business approval is unavailable locally)*

---

## Phase 7: Projects & Portfolio (US5 — Consultar projetos realizados)

**Purpose**: Showcase real authorized projects with professional empty state when unavailable

- [X] T031 Create project collection data in `src/content/projects/` with structure for real, authorized projects only
- [X] T032 Create project listing template in `src/pages/projetos/index.astro`: grid of project cards or professional empty state ("[Projetos sendo preparados...]")
- [X] T033 [P] Create project detail template in `src/pages/projetos/[slug].astro`: title, photos (min 2 real authorized), description, specialties used, results, optional testimonial
- [X] T034 [P] Implement project photo validation: reject projects with <2 authorized real photos (no fallback illustrations)
- [X] T035 [P] Add alt-text and image metadata to all project photos for accessibility and SEO
- [ ] T036 [P] Implement lazy loading for project images; test on 3G simulation *(lazy-loading hooks exist, but there are still no publishable real project images to validate under a meaningful 3G scenario)*

---

## Phase 8: Process Overview (US6 — Processo de trabalho)

**Purpose**: Transparent process communication without overpromising

- [X] T037 Create "/empresa/processo" or embed in "Como Trabalhamos": 7-10 steps from contact to completion
- [ ] T038 [P] Describe each step with realistic timeframe ranges (e.g., "1–2 weeks for site design phase") without guaranteeing exact dates *(not added because no approved ranges exist yet)*
- [X] T039 [P] Emphasize transparency and specialist involvement at each stage
- [ ] T040 [P] Ensure process text is approved by company before publication *(company approval unavailable locally)*

---

## Phase 9: Contact (US7 — Contactar facilmente)

**Purpose**: Multiple accessible contact paths with maximum 2-click discovery

- [ ] T041 [P] Create contact information component showing phone, email in header, hero, and footer *(component/pending states exist, but real approved phone/email data is still missing)*
- [ ] T042 [P] Implement `tel:` and `mailto:` links with fallback plain text *(blocked until approved direct contact values exist)*
- [X] T043 [P] Create dedicated contact page in `src/pages/contactos/index.astro` with email, phone, optional contact form preview
- [ ] T044 [P] Ensure contact info is findable via keyboard navigation (Tab) within 3 interactions *(direct contact data still pending, so only the contact route and form preview are testable)*

---

## Phase 10: Contact Form & Submissions (US8 — Solicitar orçamento)

**Purpose**: Conversion-optimized form with simple fields and Formspree integration

- [X] T045 Create form component in `src/components/ContactForm.astro` with fields: name, email/phone, type of work, location, description (max 5000 chars), consent checkboxes
- [X] T046 [P] Integrate Formspree endpoint in form action; validate on client-side before submission
- [X] T047 [P] Implement success feedback ("Pedido recebido. Responderemos em breve") and error handling ("Erro ao enviar. Tente novamente ou contacte-nos diretamente.")
- [X] T048 [P] Add SPAM prevention: disable button after 1st submission for 2+ seconds, implement honeypot field
- [ ] T049 [P] Test form works without JavaScript enabled (falls back to standard HTTP POST) *(requires a real Formspree endpoint; not honestly testable in this repo state)*
- [X] T050 [P] Add form to contact page and optionally embed in other strategic pages

---

## Phase 11: Mobile, Accessibility & Performance (US9, US10 — Telemóvel & Acessibilidade)

**Purpose**: Ensure fully functional experience on all devices and accessible to all users

### Responsive Design & Mobile (US9)
- [X] T051 [P] Test all pages at 320px (iPhone SE), 768px (iPad), 1200px+ (desktop) breakpoints
- [X] T052 [P] Implement `<meta name="viewport" content="width=device-width, initial-scale=1">` in base layout
- [X] T053 [P] Verify zero horizontal overflow on mobile; touch targets ≥44px
- [X] T054 [P] Test form fields, buttons, navigation burger on mobile devices
- [X] T055 [P] Implement CSS media queries for responsive typography, spacing, grid layout

### Accessibility & Keyboard Navigation (US10, partly)
- [X] T056 [P] Semantic HTML throughout: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<button>`, `<form>`, `<label>`
- [X] T057 [P] Implement logical `<tab>` order in navigation, form fields, CTAs; visible focus indicators (outline or custom styles)
- [X] T058 [P] Add ARIA labels to icon-only buttons and form fields where needed
- [X] T059 [P] Implement skip link ("Saltar para conteúdo principal") on every page
- [ ] T060 [P] Test with NVDA screen reader: page structure, form labels, link purposes comprehensible *(manual assistive-technology validation not possible locally here)*
- [X] T061 [P] Implement `prefers-reduced-motion` CSS media query: disable animations, transitions for users with motion sensitivity

---

## Phase 12: Privacy & Legal (US11 — Privacidade e legal)

**Purpose**: Compliance with GDPR and transparency requirements

- [X] T062 [P] Create privacy policy page in `src/pages/privacidade.astro`: data controller, processing purposes, retention, user rights (access, deletion, correction), contact for DPA requests
- [X] T063 [P] Create Terms of Use or similar legal page if needed by company
- [X] T064 [P] Add privacy policy link to footer on all pages
- [X] T065 [P] Document Formspree privacy terms (3rd-party email submission service) in privacy policy

---

## Phase 13: SEO & Metadata (Implicit across spec, PR-033)

**Purpose**: Ensure discoverability via search engines

- [X] T066 [P] Add `<title>`, `<meta name="description">`, `<meta property="og:*">` to all pages in base layout
- [X] T067 [P] Generate `sitemap.xml` and `robots.txt` automatically via Astro sitemap integration
- [X] T068 [P] Schema markup (JSON-LD) for Organization, Service, and LocalBusiness on relevant pages
- [X] T069 [P] Verify internal link structure (avoid broken links, logical hierarchy)

---

## Phase 14: Polish & Cross-Cutting Concerns

**Purpose**: Finalize documentation, provenance, validation gates, and pre-publication readiness across all completed stories

- [X] T070 [P] Create design direction and allowed Higgsfield-usage documentation in `docs/design/design-direction.md` and `docs/design/higgsfield-usage.md`
- [X] T071 [P] Finalize asset provenance and image-truthfulness records in `docs/design/asset-provenance.md`
- [X] T072 Configure Lighthouse and link-validation gates for representative Pages routes in `lhci.config.json` and `.github/workflows/validate.yml`
- [X] T073 [P] Add smoke coverage for `404.html`, `robots.txt`, deep links, and asset-path behavior in `tests/e2e/pages-smoke.spec.ts`
- [X] T074 Align dependency-security and validation documentation with implementation scripts in `package.json`, `package-lock.json`, and `README.md`
- [X] T075 [P] Add the final pre-publication checklist and content-approval handoff notes in `README.md` and `specs/001-lmdreams-website/quickstart.md`
- [ ] T076 Post-deployment: Validate live GitHub Pages site (check routes, forms, accessibility from deployed domain, verify no console errors or Higgsfield dependencies) *(requires an actual deployed GitHub Pages URL; not honestly completable locally)*

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1** (Setup) → blocks all others (configuration, scaffold)
- **Phase 2** (Foundational) → blocks **Phases 3–11** (requires layouts, styles, types)
- **Phases 3–11** (User Stories) → can run in parallel or sequentially
  - **Recommended parallelization**: (US1+US3), (US2+US5), (US4+US6), (US7+US8), (US9+US10+US11)
- **Phase 12** (Privacy) → depends on Phase 10 (contact form fields for GDPR context)
- **Phase 13** (SEO) → can run after Phase 11 (once all pages exist)
- **Phase 14** (Polish) → runs after all stories complete; includes final validation

### Critical Path (Minimum Sequence)

1. T001 → T002 → T003 → T006 → T007 → T008 → T009 → T010 → (Branch into Phases 3–11 in parallel)
2. After Phase 11: T062–T069, T070–T076

### Parallelizable Tasks [P]

Tasks marked `[P]` can execute independently if their direct dependencies are satisfied. Total parallelizable: **40+** of 68.

---

## MVP Scope (First Public Increment)

**Phases included**: 1, 2, 3–11 (complete user stories P1 + P2), partial 12 (privacy page), partial 13 (basic SEO)  
**Phases deferred**: Phase 14 polish/validation (for post-launch optimization), extended edge-case testing

**Content requirements for MVP**:
- Company name, contact, mission (from [CONTENT PENDING])
- 3–5 approved services (or "[Em preparação...]" state with placeholder examples)
- 0–3 authorized real project examples (or professional empty state)
- All text reviewed and approved by company

---

## Completion Signals

- [ ] All Phase 1–11 tasks complete
- [X] `npm run build` produces static output with zero errors
- [X] `npm run preview` launches local site fully functional
- [X] Lighthouse CI passes all targets (Performance ≥90, Accessibility ≥95, SEO ≥95)
- [ ] Playwright E2E tests pass on Chromium, Firefox, WebKit
- [X] `@axe-core/playwright` accessibility assertions pass
- [ ] Manual screen reader test (NVDA or JAWS on desktop; VoiceOver on mobile) passes smoke checks
- [ ] No console errors or warnings on deployed GitHub Pages domain
- [X] No Higgsfield dependencies detected in deployed output
- [ ] Live GitHub Pages site passes smoke tests (routes load, forms submit, links work)

---