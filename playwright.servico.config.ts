import { defineConfig, devices } from '@playwright/test'

// Testes do formulário com serviço de formulários ativo (Formward em produção), sobre o build
// de .tmp/dist-servico (npm run build:servico). O endereço de envio desse build,
// https://formulario.exemplo.test/f/teste, nunca sai da máquina: os testes intercetam-no.
const PORT = 4175

export default defineConfig({
  testDir: 'tests/e2e-servico',
  outputDir: 'test-results/servico',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [['list'], ['html', { open: 'never', outputFolder: 'playwright-report/servico' }]]
    : [['list']],
  use: {
    ...devices['Desktop Chrome'],
    viewport: { width: 1440, height: 900 },
    baseURL: `http://localhost:${PORT}/LMDreams/`,
    trace: 'retain-on-failure',
    locale: 'pt-PT',
  },
  webServer: {
    command: `npx tsx scripts/serve-dist.ts --dir .tmp/dist-servico --base /LMDreams/ --port ${PORT}`,
    url: `http://localhost:${PORT}/LMDreams/`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})
