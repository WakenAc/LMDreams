import { readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { homedir } from 'node:os';

const playwrightRoot =
  process.platform === 'win32'
    ? join(process.env.LOCALAPPDATA || join(homedir(), 'AppData', 'Local'), 'ms-playwright')
    : join(homedir(), '.cache', 'ms-playwright');

const chromiumDir = readdirSync(playwrightRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && entry.name.startsWith('chromium-'))
  .map((entry) => entry.name)
  .sort()
  .pop();

if (!chromiumDir) {
  throw new Error('Não foi encontrada uma instalação Chromium do Playwright para o Lighthouse.');
}

const chromePath =
  process.platform === 'win32'
    ? join(playwrightRoot, chromiumDir, 'chrome-win64', 'chrome.exe')
    : join(playwrightRoot, chromiumDir, 'chrome-linux', 'chrome');

if (!existsSync(chromePath)) {
  throw new Error(`Caminho de Chrome não encontrado: ${chromePath}`);
}

const child = spawn(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['lhci', 'autorun', '--config=./lhci.config.json'],
  {
    stdio: 'inherit',
    env: {
      ...process.env,
      CHROME_PATH: chromePath
    },
    shell: process.platform === 'win32'
  }
);

child.on('exit', (code) => process.exit(code ?? 1));
