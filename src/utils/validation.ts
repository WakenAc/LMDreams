import siteConfig from '../../site.config.mjs';
import type { ProjectEntry } from '@/types/content';

export const isContactFormConfigured = (endpoint?: string | null): boolean =>
  Boolean(endpoint && endpoint.startsWith('https://'));

export const withBasePath = (href: string): string => {
  if (!href.startsWith('/')) return href;
  if (siteConfig.basePath === '/') return href;
  return `${siteConfig.basePath}${href}`;
};

const shouldPrependBasePath = (): boolean => {
  const sitePathname = new URL(siteConfig.siteUrl).pathname.replace(/\/$/, '') || '/';
  const normalizedBase = siteConfig.basePath === '/' ? '/' : siteConfig.basePath.replace(/\/$/, '');
  return sitePathname !== normalizedBase;
};

export const absoluteUrl = (pathname: string): string => {
  const path = pathname === '/' ? '/' : pathname.replace(/\/?$/, '/');
  const relativePath = shouldPrependBasePath() ? withBasePath(path) : path;
  return new URL(relativePath, `${siteConfig.siteUrl}/`).toString();
};

export const absoluteAssetUrl = (pathname: string): string => {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const relativePath = shouldPrependBasePath() ? withBasePath(normalized) : normalized;
  return new URL(relativePath, `${siteConfig.siteUrl}/`).toString();
};

export const isRealProjectAsset = (assetType: ProjectEntry['images'][number]['assetType']) =>
  assetType === 'real-project-photo' || assetType === 'company-photo';

export const hasPublishableProjectAssets = (project: ProjectEntry): boolean =>
  project.images.some(
    (image) => image.authorizedForPublication && isRealProjectAsset(image.assetType)
  );

export const isPublishedProject = (project: ProjectEntry): boolean =>
  project.published && project.authorizedForPublication && hasPublishableProjectAssets(project);
