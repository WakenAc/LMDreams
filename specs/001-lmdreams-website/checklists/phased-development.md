# Implementation Phases Checklist: LMDreams Institutional Website

**Purpose**: Track phase-by-phase implementation progress against the approved plan, task structure, technical contracts, and constitutional rules.
**Created**: 2026-07-13
**Feature**: [spec.md](../spec.md), [plan.md](../plan.md), [tasks.md](../tasks.md), [development-plan.md](./development-plan.md)

**Note**: This checklist is an operational companion to `development-plan.md`. Use it during implementation to decide when a phase is ready to start, when it is ready to close, and what evidence must exist before moving on.

## Phase 1 - Setup

- [ ] CHK001 Close `T001-T005` only after the Astro/TypeScript shell, Pages-aware config, planned directory tree, validation scripts, and README workflow all exist in the locations promised by the plan. [Tasks T001-T005, Plan §Technical Context, Plan §Project Structure]
- [ ] CHK002 Record the active GitHub Pages mode assumptions (`siteUrl`, `basePath`, custom-domain status) before downstream layout, metadata, or deployment work begins. [Tasks T002/T005, Plan §GitHub Pages Strategy, Contract: deployment.md]
- [ ] CHK003 Confirm setup work does not introduce non-approved runtime dependencies, SSR assumptions, backend requirements, or secret-bearing configuration paths. [Constitution Principles I-II-VIII-X, Plan §Constraints, Plan §Dependency Plan]
- [ ] CHK004 Treat setup as complete only when another developer could install, validate, build, preview, and understand the publication path from the repository documentation without oral handoff. [Task T005, Contract: deployment.md, Constitution Principle VIII]

## Phase 2 - Foundational

- [ ] CHK005 Complete the foundational phase before any user-story delivery is counted, since all story work depends on shared data, layout, styling, metadata, and deployment infrastructure. [Tasks Phase 2, Tasks §Phase Dependencies]
- [ ] CHK006 Confirm the shared configuration layer handles pending business values honestly so later pages can omit, defer, or label missing data instead of inventing facts. [Tasks T006-T007, Contract: content-schema.md §Business-Content Pending Rule, Constitution Principle III]
- [ ] CHK007 Verify the shared foundation centralizes route metadata, navigation, publication guards, and Pages-safe support files in the single-source locations named by the plan. [Tasks T009-T013, Plan §Architecture Overview, Contract: routes.md, Contract: deployment.md]
- [ ] CHK008 Do not close Phase 2 until baseline validation coverage exists for URL logic and publication guards and the team agrees the shared system is ready for story-by-story work. [Task T014, Tasks Phase 2 Checkpoint, Plan §Testing and Validation Plan]

## US1 - Homepage / Compreender imediatamente

- [ ] CHK009 Start US1 only after Phase 2 is closed and the homepage can rely on the shared data, layout, and CTA primitives already defined. [Tasks Phase Dependencies, Tasks T015-T018]
- [ ] CHK010 Track US1 completion by confirming homepage identity, trust, and CTA content are sourced from approved company data rather than page-local ad hoc copy. [Tasks T015-T017, Plan §Content Architecture, Constitution Principles III-IV]
- [ ] CHK011 Capture evidence that the homepage implementation preserves the plan’s “core offer in seconds” intent before more scope is layered onto `/`. [Tasks Phase 3 Checkpoint, Spec §US1, Tasks §MVP First]
- [ ] CHK012 Hold the phase open if homepage messaging, CTA ownership, or approved value proposition copy remain unresolved, because later conversion and narrative phases depend on them. [Spec §RF-001–RF-004, Tasks §Recommended Story Completion Order, Constitution Principle V]

## US2 - Services / Conhecer serviços

- [ ] CHK013 Confirm service work follows the publication model: example or draft content may exist in-repo, but only eligible published entries can define the public experience. [Tasks T019-T023, Contract: content-schema.md §Service Publication Rule, Contract: routes.md §/servicos/[slug]/]
- [ ] CHK014 Track whether `/servicos/` and `/servicos/[slug]/` are being implemented from shared collection rules and breadcrumb/navigation patterns instead of special-case route logic. [Tasks T020-T021, Tasks T011, Plan §Routing and Page Generation, Contract: routes.md]
- [ ] CHK015 Require explicit placeholder labeling and fallback handling whenever confirmed public services or final imagery are still pending. [Tasks T019/T022, Spec §Gestão de Serviços (Q1), Constitution Principle III]
- [ ] CHK016 Mark US2 done only when the service listing path, detail path rules, and empty-state strategy all align with the contracts and do not depend on fabricated specialties. [Tasks Phase 4 Checkpoint, Spec §RF-005/RF-035, Contract: content-schema.md, Contract: routes.md]

## US3 - Specialization / Diferenciador

- [ ] CHK017 Treat US3 as a narrative phase with governance sensitivity: approved specialization benefits and tone constraints must be defined before the section is considered complete. [Tasks T024-T027, Constitution Principles III-IV]
- [ ] CHK018 Confirm specialization messaging is implemented through reusable content fields and a dedicated component, not scattered copy that would drift across pages later. [Tasks T024-T026, Plan §Content Architecture, Plan §Component Strategy]
- [ ] CHK019 Keep this phase open if any messaging attacks competitors, overstates proof, or weakens the constitution’s required tone of rigor and credibility. [Tasks Phase 5 Checkpoint, Constitution Principle IV]
- [ ] CHK020 Record that US3 is complete only when the specialization narrative can stand independently and be traced back to approved company positioning. [Spec §US3, Spec §RF-004, Tasks Phase 5 Checkpoint]

## US4 - Company / Empresa e experiência

- [ ] CHK021 Close US4 only after the institutional page content distinguishes company identity, values, and professional experience without implying unsupported facts such as company age or unconfirmed credentials. [Tasks T028-T031, Spec §RF-003/RF-007, Constitution Principle III]
- [ ] CHK022 Confirm `/empresa/` extends the shared content system rather than becoming a one-off page with duplicated structural logic or styling. [Tasks T029-T030, Plan §Component Strategy, Plan §Styling Strategy]
- [ ] CHK023 Record unresolved content dependencies for company profile data, service area, or process details before calling the phase complete, even if the page can ship with approved omissions. [Spec §Dependências de Conteúdo, Contract: content-schema.md §Company Schema, Constitution Principle III]
- [ ] CHK024 Use the phase checkpoint as the closure gate: `/empresa/` should be independently reviewable as the trust-building institutional page before US6 extends it further. [Tasks Phase 6 Checkpoint, Tasks §User Story Dependencies]

## US7 - Contact discovery / Contactar facilmente

- [ ] CHK025 Start US7 as the site-wide contact-discovery phase, not just a contact-page phase; header, footer, homepage, and contact route responsibilities should all be tracked together. [Tasks T032-T035, Contract: routes.md, Spec §RF-011/RF-026/RF-034]
- [ ] CHK026 Confirm contact channels and CTA destinations are centralized in shared data so the form phase can reuse the same source of truth. [Tasks T032-T033, Plan §Content Architecture, Contract: content-schema.md §Company Schema]
- [ ] CHK027 Keep visible fallback contact options as a hard completion condition, since US8 depends on them and the constitution requires core contacts to remain usable without external services. [Tasks §User Story Dependencies, Contract: contact-form.md §Fallback Contract, Constitution Principles II-X]
- [ ] CHK028 Mark US7 complete only when contact discovery works as a stable cross-route pattern and not as isolated page-specific wiring. [Tasks Phase 7 Checkpoint, Plan §Component Strategy]

## US8 - Quote/contact form / Solicitar orçamento

- [ ] CHK029 Do not count US8 as started until US7 has already established the fallback contact block reused by the contact route. [Tasks §User Story Dependencies, Tasks T035-T040]
- [ ] CHK030 Track this phase against the form contract: field scope, validation limits, provider endpoint ownership, and enhancement boundaries should all be defined before closure. [Tasks T036-T039, Contract: contact-form.md, Spec §RF-012–RF-016]
- [ ] CHK031 Require the Formspree integration model, honeypot/spam approach, and fallback instructions to remain consistent with the static-site plan and privacy constraints. [Tasks T036-T040, Spec §Processamento de Formulário (Q2), Contract: contact-form.md, Constitution Principles II-X]
- [ ] CHK032 Hold the phase open until the team has documented how success, failure, timeout, and duplicate-submission handling are represented in the contact flow without hiding alternative contact paths. [Contract: contact-form.md §Success Contract/§Error Contract/§Timeout Behavior, Tasks Phase 8 Checkpoint]

## US9 - Mobile-first hardening / Usar em telemóvel

- [ ] CHK033 Schedule US9 after the main public routes exist so responsive work hardens real pages rather than styling placeholders in isolation. [Tasks §User Story Dependencies, Tasks T041-T044]
- [ ] CHK034 Track US9 by route coverage: `/`, `/empresa/`, `/servicos/`, `/contactos/`, and dependent routes should all be included in the responsive sweep named by the tasks. [Tasks T042-T044, Spec §RF-018, Spec §SC-007]
- [ ] CHK035 Keep mobile navigation, overflow safeguards, and responsive media handling linked to the shared component/system layer rather than patching pages one by one without reuse. [Tasks T041/T043, Plan §Styling Strategy, Plan §Design System Plan]
- [ ] CHK036 Mark the phase complete only when the team agrees the site is being treated as mobile-first in practice, not merely desktop-first with late shrink-down fixes. [Tasks Phase 9 Checkpoint, Constitution Principle V]

## US10 - Accessibility / Acessibilidade

- [ ] CHK037 Start US10 only after the shared interactive flows from US7-US9 are present, so accessibility work lands on the real navigation, motion, and form patterns. [Tasks §User Story Dependencies, Tasks T045-T048]
- [ ] CHK038 Track the phase against the constitution’s functional accessibility rule: landmarks, labels, focus semantics, reduced motion, and form feedback all need explicit implementation ownership. [Tasks T045-T046, Constitution Principle VI, Spec §RF-019–RF-022]
- [ ] CHK039 Require automated accessibility coverage and keyboard-regression coverage to be part of phase completion evidence, not deferred to final polish. [Tasks T047-T048, Plan §Testing and Validation Plan]
- [ ] CHK040 Hold US10 open until the team can show accessibility has been integrated as a first-class release condition across shared layout, navigation, and contact flows. [Tasks Phase 10 Checkpoint, Constitution Principles VI-XI]

## US5 - Projects / Consultar projetos realizados

- [ ] CHK041 Treat US5 as a truthfulness-sensitive content phase: no project route or gallery completion should be recorded until publication authorization and provenance handling are defined. [Tasks T049-T053, Contract: content-schema.md §Project Publication Rule/§Image Truthfulness Rule, Constitution Principle III]
- [ ] CHK042 Track the projects listing and detail work against the contract that permits professional empty states when approved public projects are unavailable. [Tasks T050-T051, Contract: routes.md §/projetos/ and §/projetos/[slug]/, Spec §RF-008/RF-035]
- [ ] CHK043 Require provenance notes and image-origin handling to stay synchronized between project content and design documentation as the phase progresses. [Tasks T049/T052, Plan §Security and Privacy Plan, Tasks Phase 14]
- [ ] CHK044 Mark US5 complete only when the portfolio can be released honestly, including the case where it launches with zero publishable projects. [Tasks Phase 11 Checkpoint, Constitution Principle III]

## US6 - Process explanation / Processo de trabalho

- [ ] CHK045 Schedule US6 after US4 unless an explicit deviation is approved, because it extends the company page rather than standing as a separate foundation. [Tasks §User Story Dependencies, Tasks T054-T057]
- [ ] CHK046 Track process-step content as ordered, approved editorial data with honest pending handling rather than implied operational promises. [Tasks T054-T056, Spec §US6, Contract: content-schema.md §Business-Content Pending Rule]
- [ ] CHK047 Keep the phase open if the implementation starts implying timelines, guarantees, visits, or pricing commitments that were never approved. [Tasks Phase 12 Checkpoint, Constitution Principles III-IV]
- [ ] CHK048 Close US6 only when the process explanation strengthens institutional trust without introducing new factual or legal risk. [Tasks Phase 12 Checkpoint, Constitution Principles III-V]

## US11 - Privacy and legal / Privacidade e legal

- [ ] CHK049 Schedule US11 after US8 unless a conscious sequencing change is approved, because privacy disclosures must connect to the real contact and consent flow. [Tasks §User Story Dependencies, Tasks T058-T061]
- [ ] CHK050 Track this phase against the privacy contract: the policy page, contact-page notice, and provider disclosure should describe real data handling without inventing legal advice. [Tasks T058-T060, Contract: contact-form.md §Privacy Constraints, Spec §RF-015/RF-017]
- [ ] CHK051 Require legal/privacy copy ownership to be explicit before closure, especially where retention, rights, or provider wording still depends on business confirmation. [Spec §Dependências de Conteúdo, Constitution Principle X, Tasks Phase 13 Checkpoint]
- [ ] CHK052 Mark US11 complete only when the privacy information is understandable, connected to the contact flow, and compatible with the static-site architecture. [Tasks Phase 13 Checkpoint, Contract: routes.md, Contract: contact-form.md]

## Final Polish & Cross-Cutting

- [ ] CHK053 Treat Phase 14 as the release-hardening phase: provenance records, design guidance, validation gates, dependency-security alignment, and pre-publication handoff notes should all be closed together. [Tasks T062-T067, Tasks Phase 14]
- [ ] CHK054 Confirm cross-cutting documentation matches the implemented repository reality, especially for Higgsfield usage boundaries, asset provenance, validation commands, and approval handoff expectations. [Tasks T062-T067, Constitution Principles I-III-XI, Plan §Testing and Validation Plan]
- [ ] CHK055 Keep release gating aligned with the deployment contract: Lighthouse, link validation, smoke coverage, dependency review, and Pages-safe behavior should all be represented in the final evidence set. [Task T064-T067, Contract: deployment.md, Plan §CI/CD Strategy]
- [ ] CHK056 Do not mark the feature ready for publication until remaining content-truthfulness blockers, pending business facts, and approval-dependent assets are either resolved or explicitly carried as approved exclusions. [Spec §Dependências de Conteúdo, Constitution Principle III, Constitution Principle XI]

## Notes

- Check items off as evidence is gathered: `[x]`
- Use this alongside `development-plan.md`: that file checks high-level alignment; this file tracks phase closure discipline during implementation
- Add PR links, task IDs, reviewer notes, or approval references inline next to completed items
- If sequence changes are intentional, annotate the relevant checklist item with the approved rationale before proceeding
