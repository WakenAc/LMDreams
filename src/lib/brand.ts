// Logótipo fornecido, usado tal como está (Parte 4.9): 352 × 188 px, fundo #292929
// (igual ao token `dark`) e grafismo amarelo-lima. Só se gera o redimensionamento.
import logoSrcSet from '@brand/logo-original.png?w=82;164;246&format=webp&quality=90&as=srcset'
import logoFallback from '@brand/logo-original.png?w=164&format=png'

/** Proporção do ficheiro original (largura / altura). */
export const LOGO_RATIO = 352 / 188

export const logo = {
  src: logoFallback,
  srcSet: logoSrcSet,
  width: 352,
  height: 188,
}
