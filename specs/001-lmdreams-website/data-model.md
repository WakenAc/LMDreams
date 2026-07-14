# Data Model - LMDreams Institutional Website

## Model Purpose

This model describes the conceptual entities, their states, relationships, and publication rules for a static Astro website. It distinguishes repository-stored content, build-generated artifacts, third-party-transmitted data, and data that the public website never stores.

## Data Domains

### 1. Repository-Stored Content

Versioned inside the main GitHub repository and reviewed through normal commits:

- Company profile configuration
- Navigation configuration
- Process steps configuration
- Service entries
- Project entries
- Visual assets and asset metadata
- Privacy-page content

### 2. Build-Generated Data

Generated during `astro build` and emitted as static output:

- HTML pages
- `404.html`
- `robots.txt`
- Sitemap files
- Optimized image derivatives
- Canonical URLs and social metadata derived from central config

### 3. Third-Party-Transmitted Data

Sent from the visitor browser to the chosen form provider:

- Contact/request submissions

This data is not persisted by GitHub Pages or the static website itself.

### 4. Data Never Stored by the Website

- Authentication credentials
- User accounts
- Payment data
- Session data
- Chat transcripts
- Any hidden analytics profile

## Entities

## CompanyProfile

**Storage**: `src/data/company.ts`

**Purpose**: Holds global company identity, contact, legal, CTA, and privacy-related display data.

**Core fields**:
- `commercialName`
- `legalName`
- `shortDescription`
- `institutionalDescription`
- `phone`
- `email`
- `whatsapp`
- `address`
- `serviceArea`
- `openingHours`
- `socialLinks`
- `legalInfo`
- `professionalsExperienceYears`
- `primaryCta`
- `secondaryCta`
- `contactFormEndpoint`

**Rules**:
- Pending business fields remain empty or explicitly marked pending in code comments/config, not with fake public placeholders
- Production publication must fail or hide dependent blocks when required confirmed values are missing

## Service

**Storage**: `src/content/services/*.md`

**Purpose**: Represents a service or specialty the company may publish.

**Fields**:
- `title`
- `slug`
- `summary`
- `description`
- `benefits[]`
- `image`
- `imageAlt`
- `displayOrder`
- `published`

**Lifecycle states**:
- `Draft`
- `Published`

**State rules**:
- `Draft` entries may omit optional polish but must still be schema-valid
- `Published` requires all mandatory schema fields and a truthful image/context

## Project

**Storage**: `src/content/projects/*.md`

**Purpose**: Represents a real, authorized project or intervention that may appear in the public portfolio.

**Fields**:
- `title`
- `slug`
- `summary`
- `locationGeneral`
- `interventionType`
- `services[]`
- `challenge`
- `workPerformed`
- `result`
- `images[]`
- `completionDate`
- `published`
- `authorizedForPublication`
- optional: `testimonialExcerpt`
- optional: `duration`
- optional: `budgetRange`

**Lifecycle states**:
- `Draft`
- `AwaitingApproval`
- `Approved`
- `Published`
- `Archived`

**State rules**:
- `Draft`: working entry, never public
- `AwaitingApproval`: content prepared but waiting for business/content approval
- `Approved`: text/media approved, but not yet marked for publication
- `Published`: allowed into static paths only if `authorizedForPublication = true` and required content is complete
- `Archived`: removed from active public listing but preserved in repo history/content

## VisualAsset

**Storage**: local file under `src/assets/**` or `public/**` plus metadata from content entry or provenance doc

**Purpose**: Tracks the origin and allowed use of any visual asset.

**Origin enum**:
- `real-project`
- `company-photo`
- `stock`
- `generated`
- `illustrative`
- `placeholder`

**Core metadata**:
- `path`
- `alt`
- `width`
- `height`
- `origin`
- `authorized`
- `licenseOrSourceNote`
- `canBeProofOfWork`

**Rules**:
- Only `real-project` and `company-photo` may act as proof-like portfolio visuals, and only when authorized
- `generated`, `illustrative`, `stock`, and `placeholder` MUST NOT be presented as evidence of a completed real LMDreams project

## ContactSubmission

**Storage**: Not stored by the website; transmitted to Formspree

**Purpose**: Represents a visitor's initial contact/request data.

**Fields**:
- `name`
- `contactMethod` (email or phone)
- `location`
- `needType`
- `description`
- `consent`
- derived anti-spam fields (honeypot, provider metadata)

**Rules**:
- The website only renders the form and client-side validation states
- GitHub Pages never persists the submission
- Provider-specific retention/privacy behavior must be disclosed in privacy content

## NavigationItem

**Storage**: `src/data/navigation.ts`

**Purpose**: Defines ordered internal and approved external navigation destinations.

**Fields**:
- `label`
- `href`
- `kind` (`internal` | `external`)
- `showInPrimaryNav`
- `showInFooter`

## ProcessStep

**Storage**: `src/data/process.ts`

**Purpose**: Represents the ordered work-process explanation shown to visitors.

**Fields**:
- `title`
- `description`
- `displayOrder`
- `published`

## Relationships

- One `CompanyProfile` configures global CTA targets and page metadata defaults
- One `Service` may be referenced by many `Project` entries
- One `Project` references one or more `Service` slugs
- One `Project` owns one or more `VisualAsset` references
- One `ContactSubmission` is independent from `Project` and `Service`, but may reference a need type that loosely maps to services
- `NavigationItem` entries link to pages generated from `Service` and `Project` collections

## Publication and Build Rules

### Service Publication

A service may generate a public detail route only when:

- `published = true`
- mandatory schema fields are present
- image and alt text are present when an image is published

### Project Publication

A project may generate a public route only when:

- `published = true`
- `authorizedForPublication = true`
- required content fields are complete
- its associated visuals do not misrepresent generated/illustrative assets as proof of real work

### Portfolio Listing

- `/projetos/` lists only published + authorized projects
- If none exist, it renders an honest empty state instead of placeholder fake projects

### Contact Form Publication

- The page may still be generated if the final provider endpoint is not yet configured during local development
- Production deployment must not ship a broken visible form; if the endpoint is absent, the build or release checklist must block publication or render the form as unavailable with explicit fallback contacts

## Derived Build Artifacts

The following are not editorial entities but are derived from entity data:

- Static paths for service and project detail pages
- Breadcrumb trails
- Sitemap entries
- Canonical URLs
- Open Graph metadata
- Empty-state decisions for portfolio and service detail availability

## Invariants

- The website never stores user accounts or private sessions
- The website never publishes fictitious testimonials
- The website never treats generated imagery as real portfolio proof
- The website never requires Higgsfield to resolve routes, assets, content, or metadata at runtime
