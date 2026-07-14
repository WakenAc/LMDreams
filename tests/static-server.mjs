import http from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import siteConfig from '../site.config.mjs';

const port = Number(process.argv[2] || 4322);
const distDir = resolve('dist');
const basePath = siteConfig.basePath === '/' ? '' : siteConfig.basePath;

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp'
};

const resolveFile = (requestPath) => {
  let path = decodeURIComponent(requestPath.split('?')[0]);
  if (basePath && path.startsWith(basePath)) {
    path = path.slice(basePath.length) || '/';
  }

  if (path === '/') {
    return join(distDir, 'index.html');
  }

  const trimmed = path.replace(/^\/+/, '');
  const filePath = join(distDir, trimmed);
  const htmlPath = `${filePath}.html`;
  const indexPath = join(filePath, 'index.html');

  if (existsSync(filePath) && statSync(filePath).isFile()) return filePath;
  if (existsSync(indexPath)) return indexPath;
  if (existsSync(htmlPath)) return htmlPath;
  return join(distDir, '404.html');
};

const server = http.createServer((request, response) => {
  const filePath = resolveFile(request.url || '/');
  const extension = extname(filePath);
  const body = readFileSync(filePath);
  const statusCode = filePath.endsWith('404.html') ? 404 : 200;

  response.writeHead(statusCode, {
    'Content-Type': contentTypes[extension] || 'application/octet-stream'
  });
  response.end(body);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Static test server ready on http://127.0.0.1:${port}${basePath || '/'}`);
});
