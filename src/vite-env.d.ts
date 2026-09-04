/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL do serviço que recebe o formulário de contacto. */
  readonly VITE_FORM_ENDPOINT?: string;
  /** Chave pública desse serviço (ex.: access key do Web3Forms). */
  readonly VITE_FORM_ACCESS_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
