/** Ano do build (copyright), definido no vite.config.ts; igual no cliente e no SSR. */
declare const __BUILD_YEAR__: string

/** URL absoluto do site, sem barra final (SITE_URL). Só para canónicos, OG, sitemap e JSON-LD. */
declare const __SITE_URL__: string

interface ImportMetaEnv {
  readonly VITE_FORM_ENDPOINT?: string
  readonly VITE_FORM_ACCEPTS_FILES?: string
  readonly VITE_FORM_ACCESS_KEY?: string
}
