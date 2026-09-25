// npm run lighthouse: duas recolhas do Lighthouse CI (telemóvel e computador) sobre a
// pasta de saída servida no base path. Resultados em .lighthouseci/ (nunca públicos).
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import { chromium } from '@playwright/test'

const env = { ...process.env }
if (!env.CHROME_PATH) {
  // Sem Google Chrome instalado, usar o Chromium do Playwright.
  const candidates = [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ]
  const found = candidates.find((c) => fs.existsSync(c))
  env.CHROME_PATH = found ?? chromium.executablePath()
}
console.log(`lighthouse: Chrome em ${env.CHROME_PATH}`)

let failed = false
for (const preset of ['mobile', 'desktop'] as const) {
  console.log(`\nlighthouse: recolha ${preset === 'mobile' ? 'telemóvel' : 'computador'}`)
  const r = spawnSync('npx', ['lhci', 'autorun', '--config=./lighthouserc.cjs'], {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: { ...env, LHCI_PRESET: preset },
  })
  if (r.status !== 0) failed = true
}
process.exit(failed ? 1 : 0)
