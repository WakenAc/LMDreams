import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { imagetools } from 'vite-imagetools'

const root = path.dirname(fileURLToPath(import.meta.url))

// Base path do GitHub Pages (Parte 3.5). Nunca definir na linha de comandos:
// usar os scripts npm build:pages e build:root.
const raw = process.env.BASE_PATH ?? '/LMDreams/'
const base = raw.endsWith('/') ? raw : `${raw}/`
if (!/^\/([\w.-]+\/)*$/.test(base)) {
  throw new Error(
    `BASE_PATH inválido: ${base}. Use os scripts npm (build:pages ou build:root); no Git Bash, ` +
      'um caminho começado por / pode ser convertido num caminho do Windows.',
  )
}

const siteUrl = (process.env.SITE_URL ?? 'https://wakenac.github.io/LMDreams').replace(/\/+$/, '')
if (!/^https?:\/\/[^\s/]+(\/[\w.-]+)*$/.test(siteUrl)) {
  throw new Error(`SITE_URL inválido: ${siteUrl}`)
}

export default defineConfig({
  base,
  resolve: {
    alias: {
      '@ilustrativas': path.resolve(root, 'assets-src/ilustrativas'),
      '@brand': path.resolve(root, 'assets-src/brand'),
    },
  },
  build: {
    outDir: process.env.OUT_DIR ?? 'dist',
    emptyOutDir: true,
    manifest: true,
    assetsInlineLimit: 0,
    target: 'es2022',
  },
  define: {
    __BUILD_YEAR__: JSON.stringify(String(new Date().getFullYear())),
    __SITE_URL__: JSON.stringify(siteUrl),
  },
  plugins: [
    react(),
    tailwindcss(),
    imagetools({
      cache: { enabled: true, dir: path.resolve(root, 'node_modules/.cache/imagetools') },
      removeMetadata: true,
    }),
  ],
  server: {
    port: 5173,
    strictPort: false,
  },
})
