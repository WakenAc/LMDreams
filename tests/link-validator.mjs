import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import siteConfig from '../site.config.mjs';

const distDir = resolve('dist');

if (!existsSync(distDir)) {
  throw new Error('A pasta dist/ não existe. Execute npm run build antes do validador de links.');
}

const htmlFiles = [];

const walk = (dir) => {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.html')) {
      htmlFiles.push(fullPath);
    }
  }
};

walk(distDir);

const hrefRegex = /href="([^"]+)"/g;
const srcRegex = /src="([^"]+)"/g;
const failures = [];

const internalExists = (target) => {
  let normalized = target.startsWith('/') ? target.slice(1) : target;
  if (siteConfig.basePath !== '/') {
    const basePrefix = siteConfig.basePath.replace(/^\//, '').replace(/\/$/, '');
    if (normalized === basePrefix || normalized.startsWith(`${basePrefix}/`)) {
      normalized = normalized.slice(basePrefix.length).replace(/^\//, '');
    }
  }
  const asPath = join(distDir, normalized);
  const asIndex = join(distDir, normalized, 'index.html');
  const asHtml = asPath.endsWith('.html') ? asPath : `${asPath}.html`;
  return [asPath, asIndex, asHtml].some((candidate) => existsSync(candidate));
};

for (const file of htmlFiles) {
  const content = readFileSync(file, 'utf8');
  const matches = [...content.matchAll(hrefRegex), ...content.matchAll(srcRegex)];
  for (const match of matches) {
    const target = match[1];
    if (
      !target ||
      target.startsWith('http://') ||
      target.startsWith('https://') ||
      target.startsWith('mailto:') ||
      target.startsWith('tel:') ||
      target.startsWith('#') ||
      target.startsWith('data:')
    ) {
      continue;
    }

    const cleanTarget = target.split('#')[0].split('?')[0];
    if (!internalExists(cleanTarget)) {
      failures.push(`${relative(process.cwd(), file)} -> ${target}`);
    }
  }
}

if (failures.length > 0) {
  throw new Error(`Links internos ou assets em falta:\n${failures.join('\n')}`);
}

console.log(`Validated ${htmlFiles.length} HTML files.`);
