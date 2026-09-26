import { defineConfig, devices } from '@playwright/test'

// Testes E2E sobre a pasta de saída servida como no GitHub Pages (scripts/serve-dist.ts).
// Caminhos relativos nos testes: page.goto('./'), page.goto('politica-de-privacidade/').
const PORT = Number(process.env.E2E_PORT ?? 4173)
const DIR = process.env.E2E_DIR ?? 'dist'

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: `http://localhost:${PORT}/LMDreams/`,
    trace: 'retain-on-failure',
    locale: 'pt-PT',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    {
      name: 'mobile',
      // Os outros testes definem a janela em cada caso; em telemóvel corre-se o teste de fumo.
      testMatch: /smoke.spec.ts/,
      use: { ...devices['Pixel 7'], viewport: { width: 390, height: 844 } },
    },
  ],
  webServer: {
    command: `npx tsx scripts/serve-dist.ts --dir ${DIR} --base /LMDreams/ --port ${PORT}`,
    url: `http://localhost:${PORT}/LMDreams/`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})
