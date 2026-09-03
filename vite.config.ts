import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Caminho base para publicação em GitHub Pages.
// - Páginas de projeto (https://<utilizador>.github.io/lmdreams/): mantenha "/lmdreams/".
// - Domínio próprio via CNAME (https://www.oseudominio.pt/): mude para "/".
// Pode também ser definido em tempo de build com a variável de ambiente VITE_BASE_PATH.
const BASE_PATH = process.env.VITE_BASE_PATH ?? "/lmdreams/";

export default defineConfig({
  base: BASE_PATH,
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
  },
});
