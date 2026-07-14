# Technical Contract - Build and Deployment

## Purpose

Define the reproducible build/deployment contract for the static Astro website on GitHub Pages.

## Build Target

- **Hosting**: GitHub Pages
- **Output mode**: fully static
- **Output directory**: `dist/`

## Installation Command

```bash
npm ci
```

## Validation Commands

Planned command set:

```bash
npm run check
npm run test:unit
npm run build
npm run test:e2e
npm run test:a11y
npm run test:links
npm run test:lighthouse
```

The exact script names will be finalized during implementation, but the contract requires all these validation categories to exist before production release.

## Build Command

```bash
npm run build
```

## Preview Command

```bash
npm run preview
```

## Configuration Inputs

### Required centralized values

- `siteUrl` - the public absolute base URL
- `basePath` - `/<repo>` for Project Pages or `/` for custom domain
- optional `customDomain` - only when confirmed

### Optional build-time variables

These may be passed via GitHub Actions or a local env file template if implementation chooses that route:

- `SITE_URL`
- `BASE_PATH`
- `CUSTOM_DOMAIN`

No secret value is required for static rendering.

## GitHub Pages Modes

### Mode A - Project Pages

- `siteUrl = https://<user>.github.io/<repo>/`
- `basePath = /<repo>`
- `public/CNAME` absent

### Mode B - Custom Domain

- `siteUrl = https://<real-domain>/`
- `basePath = /`
- `public/CNAME` present with confirmed domain only

## Workflow Contract

### `validate.yml`

**Triggers**:
- pull requests
- pushes to relevant branches
- manual dispatch

**Required steps**:
1. Checkout
2. Setup Node 24 LTS
3. `npm ci`
4. `npm run check`
5. `npm run test:unit`
6. `npm run build`
7. `npm run test:e2e`
8. `npm run test:a11y`
9. `npm run test:links`
10. `npm audit`

### `deploy-pages.yml`

**Triggers**:
- push to the main branch
- manual dispatch

**Required steps**:
1. Checkout
2. Minimal permissions (`contents: read`, `pages: write`, `id-token: write`)
3. Setup Node 24 LTS
4. `npm ci`
5. Re-run essential checks (`npm run check`, `npm run build`, minimum smoke validation)
6. Upload `dist/` as the Pages artifact
7. Deploy to the `github-pages` environment
8. Concurrency control to avoid inconsistent parallel deploys
9. Expose the final deployment URL

## Failure Behavior

Deployment MUST fail when:

- install is non-reproducible
- Astro/TypeScript validation fails
- content schema validation fails
- required published content is invalid
- build fails
- critical accessibility or link validation gates fail
- Pages artifact upload/deploy fails

## Security Rules

- No real `.env` file is versioned
- No frontend secret is required
- No Higgsfield credential is involved
- Only the static artifact is deployed
- No secondary repository or Higgsfield branch is used

## Operational Notes

- GitHub Pages source must be configured as **GitHub Actions**
- DNS changes for a custom domain happen outside the repository
- `public/CNAME` is introduced only after real-domain confirmation
