import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import siteConfig from './site.config.mjs';

export default defineConfig({
  output: 'static',
  site: siteConfig.siteUrl,
  base: siteConfig.basePath === '/' ? undefined : siteConfig.basePath,
  integrations: [
    sitemap()
  ],
  trailingSlash: 'always',
  image: {
    responsiveStyles: true
  }
});
