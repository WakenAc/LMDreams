import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const requiredFiles = [
  'package.json',
  'astro.config.mjs',
  'site.config.mjs',
  'src/layouts/Base.astro',
  'src/pages/index.astro',
  'src/pages/contactos/index.astro',
  'src/content.config.ts',
  'README.md'
];

for (const file of requiredFiles) {
  if (!existsSync(join(process.cwd(), file))) {
    throw new Error(`Ficheiro obrigatório em falta: ${file}`);
  }
}

const readme = readFileSync(join(process.cwd(), 'README.md'), 'utf8');
if (!readme.includes('GitHub Pages')) {
  throw new Error('O README deve documentar explicitamente o workflow GitHub Pages.');
}

const tasks = readFileSync(join(process.cwd(), 'specs/001-lmdreams-website/tasks.md'), 'utf8');
if (!tasks.includes('T076')) {
  throw new Error('O ficheiro de tarefas parece incompleto.');
}

console.log('Content lint passed.');
