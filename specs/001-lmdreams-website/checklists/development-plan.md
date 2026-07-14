# Development Plan Alignment Checklist: LMDreams Institutional Website

**Purpose**: Assess whether ongoing development stays aligned with the approved plan, contracts, governance constraints, and release gates for the feature.
**Created**: 2026-07-13
**Feature**: [spec.md](../spec.md), [plan.md](../plan.md), [tasks.md](../tasks.md)

**Note**: This checklist is generated from planned artifacts and is intended to test requirement/planning quality, traceability, and development readiness rather than implementation behavior.

## Architecture & Routing Coverage

- [ ] CHK001 Are the static-first architecture constraints defined consistently across the specification, plan, and constitution so development cannot drift into SSR, SPA-only routing, or backend runtime assumptions? [Consistency, Spec §RF-027–RF-030, Plan §Architecture Overview, Constitution Principles I-II]
- [ ] CHK002 Is the full public route inventory explicitly documented with route purpose, source ownership, and failure/empty-state expectations for every planned page? [Completeness, Plan §Routing and Page Generation, Contract: routes.md]
- [ ] CHK003 Are the publication gates for `/servicos/[slug]/` and `/projetos/[slug]/` aligned across routing, content schema, and task decomposition so eligibility rules are unambiguous? [Consistency, Plan §Route and Content Decisions, Contract: routes.md, Contract: content-schema.md, Tasks Phases 4 and 11]
- [ ] CHK004 Are direct-entry, unknown-slug, and `404.html` behaviors specified clearly enough to prevent route handling gaps under GitHub Pages deep linking? [Coverage, Contract: routes.md, Spec §Casos-Limite Obrigatórios, Tasks T012/T065]
- [ ] CHK005 Is the central `siteUrl`/`basePath`/Pages-mode decision defined as a single source of truth across metadata, sitemap, robots, and deployment guidance? [Clarity, Research D05, Plan §GitHub Pages Strategy, Contract: deployment.md]

## Content Model & Editorial Governance

- [ ] CHK006 Are pending company facts and missing business inputs handled by explicit publication rules instead of informal placeholders or silent assumptions? [Completeness, Spec §Dependências de Conteúdo, Data Model §CompanyProfile, Quickstart §How to Avoid Publishing Placeholders]
- [ ] CHK007 Are service and project lifecycle states defined precisely enough to distinguish draft-authoring flexibility from public-publication requirements? [Clarity, Data Model §Service, Data Model §Project, Contract: content-schema.md]
- [ ] CHK008 Are the project authorization, approval, and truthfulness gates traceable from conceptual requirements through schemas and planned implementation tasks? [Traceability, Spec §Entidades Conceptuais > Projeto, Data Model §Project, Tasks Phase 11]
- [ ] CHK009 Are image-origin categories, provenance duties, and proof-of-work restrictions consistent across the specification, data model, research, and quickstart guidance? [Consistency, Spec §Conteúdo Visual, Data Model §VisualAsset, Research D08/D18, Quickstart §How to Identify Image Origin]
- [ ] CHK010 Does the plan specify who approves publishable content and what evidence of approval must exist before release, especially for portfolio and legal/privacy content? [Gap, Constitution Principles III and XI, Spec §Dependências de Conteúdo, Tasks Phase 14]
- [ ] CHK011 Are the example-service and illustrative-image development allowances bounded by explicit replacement/removal criteria before production publication? [Coverage, Spec §Gestão de Serviços (Q1), Spec §Gestão de Imagens Provisórias (Q3), Quickstart §How to Replace a Higgsfield-Generated Asset]

## Accessibility, UX & Form Planning

- [ ] CHK012 Are WCAG 2.2 AA obligations decomposed into specific planning artifacts (routes, components, validation, and release gates) rather than left as a general aspiration? [Completeness, Constitution Principle VI, Plan §Testing and Validation Plan, Tasks Phase 10]
- [ ] CHK013 Do keyboard navigation, focus visibility, DOM order, and reduced-motion requirements align across route contracts, constitution, plan, and edge-case documentation? [Consistency, Contract: routes.md, Constitution Principles V-VI, Plan §Design System Plan, Spec §Casos-Limite Obrigatórios]
- [ ] CHK014 Are mobile/responsive requirements quantified clearly enough to guide development priorities across critical routes and breakpoints? [Clarity, Spec §US9 and SC-007, Plan §Scale/Scope and §Testing and Validation Plan, Tasks Phase 9]
- [ ] CHK015 Is the contact-form contract complete about required fields, validation layers, transport model, and acceptable enhancement boundaries without implying unsupported backend behavior? [Completeness, Spec §RF-012–RF-016, Contract: contact-form.md, Data Model §ContactSubmission]
- [ ] CHK016 Are timeout, provider outage, duplicate submission, and missing-endpoint scenarios specified consistently between the form contract, data model, quickstart, and release expectations? [Coverage, Contract: contact-form.md, Data Model §Contact Form Publication, Quickstart §How to Configure the Contact Form]
- [ ] CHK017 Is the connection between consent capture, privacy disclosures, and fallback contact options defined clearly enough to avoid legal-text invention or UX ambiguity during implementation? [Clarity, Spec §US11 and RF-015/RF-017, Contract: contact-form.md, Tasks Phase 13]

## Performance, Privacy, Dependencies & Higgsfield Policy

- [ ] CHK018 Are performance targets measurable and tied to concrete validation methods, pages, or budgets rather than broad statements like “fast” or “lightweight”? [Measurability, Plan §Performance Goals, Research D12, Constitution Principle VII]
- [ ] CHK019 Are selected dependencies and explicit non-selections justified clearly enough to prevent unnecessary stack expansion during implementation? [Clarity, Plan §Dependency Plan, Research D19, Constitution Principle VIII]
- [ ] CHK020 Is the inventory of allowed runtime external services limited, justified, and paired with documented privacy, availability, and fallback implications? [Completeness, Plan §Security and Privacy Plan, Research D15-D16, Constitution Principles II and X]
- [ ] CHK021 Are the “no secrets”, “no tracking by default”, and “no runtime Higgsfield dependency” rules reflected consistently across architecture, deployment, privacy, and documentation artifacts? [Consistency, Constitution Principles I-II-X, Plan §Technical Context and §Security and Privacy Plan, Research D17, Contract: deployment.md]
- [ ] CHK022 Is asset provenance treated as a release-quality requirement with named records, ownership expectations, and task-level follow-through? [Traceability, Research D18, Tasks T062-T063/T067, Quickstart §How to Replace a Higgsfield-Generated Asset]
- [ ] CHK023 Are metadata, sitemap, robots, and structured-data publication rules explicit about what must remain absent when company facts or public URLs are still unconfirmed? [Coverage, Research D09, Plan §SEO and Metadata, Contract: routes.md, Spec §Dependências de Conteúdo]

## Deployment, Testing & Release Gating

- [ ] CHK024 Do the validation command sets align across quickstart, deployment contract, implementation plan, and tasks so the planned gate sequence is unambiguous? [Consistency, Quickstart §Run Tests, Contract: deployment.md, Plan §Testing and Validation Plan, Tasks §Tests]
- [ ] CHK025 Are CI workflow requirements specific enough about triggers, mandatory steps, permissions, and redeploy safeguards to prevent ad hoc release processes? [Clarity, Plan §CI/CD Strategy, Contract: deployment.md]
- [ ] CHK026 Is the “first public increment” boundary defined clearly enough to distinguish mandatory MVP stories from post-launch or secondary scope at release time? [Completeness, Spec §Histórias de Utilizador, Tasks §Recommended First Public Increment, Tasks §Incremental Delivery]
- [ ] CHK027 Are manual validation expectations documented as explicit release evidence categories rather than informal reviewer knowledge? [Traceability, Plan §Manual Validation, Constitution Principle XI, Quickstart §How to Verify Publication]
- [ ] CHK028 Are GitHub Pages mode-switch rules, custom-domain prerequisites, and `CNAME` conditions defined clearly enough to avoid deployment-path ambiguity? [Clarity, Plan §GitHub Pages Strategy, Contract: deployment.md, Quickstart §How to Configure GitHub Pages]
- [ ] CHK029 Are blocking failure conditions defined for invalid content, broken form publication, accessibility regressions, broken links, performance regressions, and asset-path issues? [Acceptance Criteria, Contract: deployment.md §Failure Behavior, Data Model §Contact Form Publication, Constitution Principle XI]
- [ ] CHK030 Are unresolved business-content dependencies called out as explicit release blockers or controlled exceptions instead of being left implicit in the plan? [Dependencies & Assumptions, Spec §Dependências de Conteúdo, Research D20, Constitution §Governacao]

## Notes

- Check items off as evidence is gathered: `[x]`
- Add links to PRs, task IDs, validation reports, or approval notes inline
- Use this checklist to detect drift from the approved plan before drift becomes implementation rework
