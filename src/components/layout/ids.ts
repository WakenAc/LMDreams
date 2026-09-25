// Ids e nomes partilhados pelos componentes do layout (contrato com os testes e com o
// menu sem JavaScript).

/** `nav` das ligações rápidas do rodapé: destino da ligação de menu antes da hidratação. */
export const FOOTER_NAV_ID = 'navegacao-rodape'

/** Painel do menu móvel (alvo de `aria-controls`). */
export const MOBILE_MENU_ID = 'menu-movel'

/**
 * Variável CSS com a largura da barra de scroll retirada enquanto o menu está aberto.
 * Os elementos fixos (cabeçalho, painel) somam-na ao seu afastamento à direita para não
 * saltarem; nas classes Tailwind aparece escrita por extenso: `var(--lmd-sbw,0px)`.
 */
export const SCROLLBAR_VAR = '--lmd-sbw'

/** Breakpoint `nav:` (1152 px): a partir daqui a navegação completa substitui o menu. */
export const NAV_MEDIA_QUERY = '(min-width: 72rem)'
