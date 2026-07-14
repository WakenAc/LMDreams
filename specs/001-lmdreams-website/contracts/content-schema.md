# Technical Contract - Content Schemas

## Purpose

Define the planned schema contracts for global company data, service entries, project entries, image metadata, and publication rules.

## 1. Company Schema

**Planned storage**: `src/data/company.ts`

| Field | Type | Required for code | Required for public production | Notes |
|-------|------|-------------------|--------------------------------|-------|
| `commercialName` | string | Yes | Yes | `LMDreams` |
| `legalName` | string | No | Only if used publicly | Pending until confirmed |
| `shortDescription` | string | Yes | Yes | Homepage and metadata support |
| `institutionalDescription` | string | Yes | Yes | Company page |
| `phone` | string | No | Yes for contact CTA | Must never use fake placeholder |
| `email` | string | No | Yes for contact CTA | Must never use fake placeholder |
| `whatsapp` | string | No | Optional | Only if confirmed |
| `address` | string | No | Optional unless legally required | No fake address |
| `serviceArea` | string or string[] | No | Recommended | Public wording may stay generic if approved |
| `openingHours` | string | No | Optional | Only if confirmed |
| `socialLinks` | object | No | Optional | Only confirmed links |
| `professionalsExperienceYears` | number or string | Yes | Yes | Must describe professionals, not company age |
| `contactFormEndpoint` | string | No | Required if public form is active | Public value, not secret |

## 2. Service Schema

**Planned storage**: `src/content/services/*.md`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | Yes | Public service name |
| `slug` | string | Yes | URL segment |
| `summary` | string | Yes | Listing card and metadata support |
| `description` | string | Yes | Service detail explanation |
| `benefits` | string[] | Yes | At least one concrete visitor-facing benefit |
| `image` | string/import | No | Optional while unpublished; recommended when published |
| `imageAlt` | string | No | Required when image is present |
| `displayOrder` | number | Yes | Stable listing order |
| `published` | boolean | Yes | Governs route generation |

### Service Publication Rule

Public build MUST fail or exclude the entry when:

- `published = true` but any required field is missing
- image exists without meaningful `imageAlt`
- content implies an unconfirmed specialty or claim

## 3. Project Schema

**Planned storage**: `src/content/projects/*.md`

| Field | Type | Required for published project | Notes |
|-------|------|-------------------------------|-------|
| `title` | string | Yes | Public title |
| `slug` | string | Yes | URL segment |
| `summary` | string | Yes | Listing summary |
| `locationGeneral` | string | Yes | General area only |
| `interventionType` | string | Yes | Type of work |
| `services` | string[] | Yes | References service slugs or labels |
| `challenge` | string | Yes | Honest problem statement |
| `workPerformed` | string | Yes | Honest work summary |
| `result` | string | Yes | Honest outcome summary |
| `images` | ImageAsset[] | Yes | At least one approved visual; plan target is two or more |
| `completionDate` | date/string | Yes | Completion timing |
| `published` | boolean | Yes | Public visibility intent |
| `authorizedForPublication` | boolean | Yes | Explicit permission gate |
| `testimonialExcerpt` | string | No | Optional, only if separately approved |
| `duration` | string | No | Optional |
| `budgetRange` | string | No | Optional |

### Project Publication Rule

A project may appear publicly only when:

- `published = true`
- `authorizedForPublication = true`
- all required published fields are present
- its images do not create a misleading impression of real work

## 4. Image Schema

**Used within**: service/project content and provenance tracking

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `src` | string/import | Yes | Local asset path/import |
| `alt` | string | Contextual | Required for informative images |
| `width` | number | Yes for optimized output | Can be inferred from local asset |
| `height` | number | Yes for optimized output | Can be inferred from local asset |
| `origin` | enum | Yes | `real-project`, `company-photo`, `stock`, `generated`, `illustrative`, `placeholder` |
| `authorized` | boolean | Yes | Publication permission |
| `caption` | string | No | Optional explanatory caption |
| `licenseOrSourceNote` | string | No | Provenance support |

### Image Truthfulness Rule

- `generated`, `stock`, `illustrative`, and `placeholder` MUST NOT be represented as proof of a real LMDreams project
- Informative generated/illustrative images MUST be labeled appropriately when exposed publicly

## 5. Publication Schema / Derived Visibility Rules

### Service Visibility States

- `Draft`
- `Published`

### Project Visibility States

- `Draft`
- `AwaitingApproval`
- `Approved`
- `Published`
- `Archived`

### Derived Build Rules

- Static paths are generated only from entries eligible for publication
- Excluded entries remain in the repository but do not appear in sitemap or public navigation
- Empty states are rendered when a collection has no eligible public entries

## 6. Business-Content Pending Rule

Pending business content may exist in repository sources during development, but MUST NOT be published as invented facts. Public output must either:

- omit the block,
- mark it honestly as pending when appropriate for internal preview,
- or show an approved empty/professional fallback state.
