const repoOwner = 'WakenAc';
const repoName = 'LMDreams';

const trimTrailingSlash = (value) => value.replace(/\/+$/, '');
const ensureLeadingSlash = (value) => value.startsWith('/') ? value : `/${value}`;

const pagesMode = process.env.PAGES_MODE === 'custom-domain' ? 'custom-domain' : 'project';
const defaultSiteUrl = `https://${repoOwner.toLowerCase()}.github.io/${repoName}`;
const configuredSiteUrl = trimTrailingSlash(process.env.SITE_URL || defaultSiteUrl);
const configuredBasePath = process.env.BASE_PATH
  ? ensureLeadingSlash(process.env.BASE_PATH)
  : (pagesMode === 'project' ? `/${repoName}` : '/');

export const siteConfig = {
  repoOwner,
  repoName,
  pagesMode,
  siteUrl: configuredSiteUrl,
  basePath: configuredBasePath === '/' ? '/' : trimTrailingSlash(configuredBasePath),
  customDomain: process.env.CUSTOM_DOMAIN || '',
  defaultLocale: 'pt-PT',
  defaultTitle: 'LMDreams Construções Lda | O seu sonho, a nossa obra.',
  defaultDescription:
    'Website institucional da LMDreams Construções Lda: construção e remodelação com especialização, experiência e comunicação clara.',
  defaultOgImage: '/social/og-default.svg',
  githubRepositoryUrl: `https://github.com/${repoOwner}/${repoName}`,
  contactFormEndpoint: process.env.CONTACT_FORM_ENDPOINT || process.env.FORMSPREE_ENDPOINT || '',
  publicUrl: configuredSiteUrl
};

export default siteConfig;
