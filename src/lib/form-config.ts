// Configuração pública do serviço de formulários (Parte 3.8): variáveis VITE_*, substituídas
// pelo Vite no build do cliente e do SSR. Fica num módulo próprio para os textos legais
// (Política de privacidade, aviso RGPD) saberem, no build, se o formulário envia para um
// serviço, sem importarem o resto de src/lib/lead.ts.
//
// O serviço só está ativo se VITE_FORM_ENDPOINT (sem espaços) começar por "https://". No CI,
// uma Repository variable inexistente chega como texto vazio. VITE_FORM_ACCEPTS_FILES só vale
// se for exatamente 'true'. VITE_FORM_ACCESS_KEY (pública, para serviços como o Web3Forms)
// segue como campo `access_key` quando existir.
//
// `import.meta.env?.` e não `import.meta.env.`: os scripts que correm com o tsx (fora do Vite)
// podem importar os conteúdos, e aí import.meta.env não existe (o formulário fica no modo
// por e-mail).

export const FORM_ENDPOINT: string = import.meta.env?.VITE_FORM_ENDPOINT?.trim() ?? ''
export const FORM_ACCESS_KEY: string = import.meta.env?.VITE_FORM_ACCESS_KEY?.trim() ?? ''

/** Verdadeiro quando há serviço de formulários (endpoint https://). */
export const formServiceActive: boolean = FORM_ENDPOINT.startsWith('https://')

/** O serviço aceita ficheiros: só com serviço ativo e VITE_FORM_ACCEPTS_FILES === 'true'. */
export const formAcceptsFiles: boolean =
  formServiceActive && import.meta.env?.VITE_FORM_ACCEPTS_FILES === 'true'
