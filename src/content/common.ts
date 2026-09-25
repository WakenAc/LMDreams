// Microtexto comum a todo o site (Parte 5.5, "Microtexto de referência").
// Um só rótulo por intenção (Parte 1.4, regra 12): os componentes usam só estes.

import type { UiContent } from './tipos'
import { company } from './company'

export const ui = {
  labels: {
    requestQuote: 'Pedir orçamento',
    exploreServices: 'Conhecer os serviços',
    callPhone: 'Contactar por telefone',
    whatsapp: 'Falar por WhatsApp',
    beforeAfter: 'Ver antes e depois',
    backHome: 'Voltar ao início',
    sendRequest: 'Enviar pedido',
    copyRequest: 'Copiar pedido',
    callShort: 'Ligar',
    whatsappShort: 'WhatsApp',
  },
  a11y: {
    skipLink: 'Saltar para o conteúdo',
    openMenu: 'Abrir menu',
    closeMenu: 'Fechar menu',
    newWindow: '(abre numa nova janela)',
    callCompany: `Ligar para a ${company.name}`,
    whatsappCompany: `WhatsApp da ${company.name}`,
    mobileContactBar: 'Contactos rápidos',
    close: 'Fechar',
  },
  placeholders: {
    content: 'Conteúdo a substituir',
    image: 'Imagem a substituir',
  },
  complaintsBook: {
    label: 'Livro de Reclamações Eletrónico',
    url: 'https://www.livroreclamacoes.pt/inicio',
  },
} satisfies UiContent
