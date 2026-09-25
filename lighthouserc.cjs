// Lighthouse CI (Parte 3.12): telemóvel e computador, página principal e páginas legais.
// Serve a pasta de saída com o base path (scripts/serve-dist.ts); nunca `staticDistDir`.
// Sem Google Chrome instalado, defina CHROME_PATH para o Chromium do Playwright.
const PORT = 4174
const BASE = `http://localhost:${PORT}/LMDreams/`
const urls = ['', 'politica-de-privacidade/', 'politica-de-cookies/', 'termos-e-condicoes/'].map(
  (p) => BASE + p,
)
const preset = process.env.LHCI_PRESET === 'desktop' ? 'desktop' : 'mobile'

module.exports = {
  ci: {
    collect: {
      startServerCommand: `npx tsx scripts/serve-dist.ts --dir dist --base /LMDreams/ --port ${PORT}`,
      startServerReadyPattern: 'http://localhost',
      startServerReadyTimeout: 60000,
      url: urls,
      numberOfRuns: 1,
      settings: {
        ...(preset === 'desktop' ? { preset: 'desktop' } : {}),
        chromeFlags: '--headless=new --no-sandbox',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: preset === 'desktop' ? 0.95 : 0.9 }],
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:best-practices': ['warn', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 1 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.05 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: `.lighthouseci/${preset}`,
    },
  },
}
