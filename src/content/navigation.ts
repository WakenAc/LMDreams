// Navegação principal (Anexo A §1; Parte 5.4 §1).

import type { NavigationContent } from './tipos'
import { company } from './company'

export const navigation = {
  ariaLabel: 'Navegação principal',
  logoLabel: `${company.name}, voltar ao início`,
  items: [
    { label: 'Início', anchor: 'inicio' },
    { label: 'Sobre nós', anchor: 'sobre' },
    { label: 'Serviços', anchor: 'servicos' },
    { label: 'Método de trabalho', anchor: 'metodo' },
    { label: 'Projetos', anchor: 'projetos' },
    { label: 'Contactos', anchor: 'contactos' },
  ],
  mobileMenuTitle: 'Menu',
} satisfies NavigationContent
