import { spawn } from 'node:child_process';

const [port, ...args] = process.argv.slice(2);

if (!port) {
  throw new Error('A porta Playwright é obrigatória.');
}

const child = spawn(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['playwright', 'test', '--config=playwright.config.ts', ...args],
  {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: {
      ...process.env,
      PLAYWRIGHT_PORT: port
    }
  }
);

child.on('exit', (code) => {
  process.exit(code ?? 1);
});
