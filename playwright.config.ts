import { defineConfig, devices } from '@playwright/test';
import siteConfig from './site.config.mjs';

const previewPort = 4322;
const resolvedPort = Number(process.env.PLAYWRIGHT_PORT || previewPort);
const baseURL = `http://127.0.0.1:${resolvedPort}`;

export default defineConfig({
  testDir: './tests',
  testMatch: ['**/*.spec.ts'],
  fullyParallel: false,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL,
    trace: 'on-first-retry'
  },
  webServer: {
    command: `node tests/static-server.mjs ${resolvedPort}`,
    url: `http://127.0.0.1:${resolvedPort}${siteConfig.basePath === '/' ? '' : siteConfig.basePath}/`,
    reuseExistingServer: true,
    timeout: 120000
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome']
      }
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox']
      }
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari']
      }
    }
  ]
});
