// Serviços (Anexo A §5; Partes 5.2, 5.4 §5 e 5.5, "Serviços: frases de referência").
// Todos com `confirmado: false` até a empresa validar o nome e a descrição (chave `servicos`).
// Os seis primeiros são os serviços em destaque, com imagem.

import type { Service, ServicesContent } from './tipos'

export const servicesSection = {
  heading: 'Serviços de construção e remodelação',
  intro:
    'Fazemos obras em casas, condomínios, escritórios e espaços comerciais, e recuperamos imóveis para quem os quer habitar, arrendar ou vender. Cada trabalho fica a cargo de profissionais da respetiva especialidade.',
  featuredLabel: 'Serviços em destaque',
  othersHeading: 'Outros serviços',
  visitorNote:
    'Cada obra é diferente. Diga-nos de que precisa e confirmamos se é um trabalho que fazemos.',
} satisfies ServicesContent

export const services = [
  // Em destaque (com imagem)
  {
    id: 'construcao-civil',
    name: 'Construção civil',
    description:
      'Construção e ampliação de edifícios, com cada fase entregue à equipa da especialidade.',
    icon: 'BrickWall',
    imageId: 'servico-construcao',
    confirmado: false,
  },
  {
    id: 'remodelacao-de-cozinhas',
    name: 'Remodelação de cozinhas',
    description:
      'Canalização, eletricidade, revestimentos e montagem, cada trabalho feito por quem o domina.',
    icon: 'CookingPot',
    imageId: 'servico-cozinhas',
    confirmado: false,
  },
  {
    id: 'remodelacao-de-casas-de-banho',
    name: 'Remodelação de casas de banho',
    description:
      'Loiças sanitárias, canalização, impermeabilização e revestimentos, numa sequência de trabalhos planeada.',
    icon: 'Bath',
    imageId: 'servico-casas-de-banho',
    confirmado: false,
  },
  {
    id: 'aplicacao-de-pavimentos-e-revestimentos',
    name: 'Aplicação de pavimentos e revestimentos',
    description: 'Cerâmica, pedra, madeira e vinílico, aplicados sobre bases bem preparadas e niveladas.',
    icon: 'LayoutGrid',
    imageId: 'servico-pavimentos',
    confirmado: false,
  },
  {
    id: 'recuperacao-de-imoveis',
    name: 'Recuperação de imóveis',
    description:
      'Reabilitação de edifícios antigos, preservando o que tem valor e corrigindo o que já não serve.',
    icon: 'Landmark',
    imageId: 'servico-recuperacao',
    confirmado: false,
  },
  {
    id: 'trabalhos-exteriores',
    name: 'Trabalhos exteriores',
    description: 'Muros, pavimentos exteriores, terraços e arranjos de logradouros.',
    icon: 'Fence',
    imageId: 'servico-exteriores',
    confirmado: false,
  },

  // Lista compacta (pela ordem do Anexo A §5)
  {
    id: 'remodelacoes-completas',
    name: 'Remodelações completas',
    description:
      'Remodelação integral de casas e espaços comerciais, com todas as especialidades coordenadas por nós.',
    icon: 'Hammer',
    emphasis: true,
    confirmado: false,
  },
  {
    id: 'canalizacao',
    name: 'Canalização',
    description:
      'Redes de águas e esgotos, substituição de tubagens e reparação de fugas por canalizadores experientes.',
    icon: 'Droplets',
    confirmado: false,
  },
  {
    id: 'eletricidade',
    name: 'Eletricidade',
    description:
      'Instalações elétricas novas e remodelação de quadros e circuitos, executadas por eletricistas.',
    icon: 'Zap',
    confirmado: false,
  },
  {
    id: 'pintura',
    name: 'Pintura',
    description:
      'Pintura de interiores e exteriores, com as superfícies bem preparadas antes da primeira demão.',
    icon: 'PaintRoller',
    confirmado: false,
  },
  {
    id: 'carpintaria',
    name: 'Carpintaria',
    description: 'Portas, roupeiros, rodapés e outros trabalhos em madeira, ajustados ao espaço.',
    icon: 'Ruler',
    confirmado: false,
  },
  {
    id: 'tetos-falsos-e-divisorias',
    name: 'Tetos falsos e divisórias',
    description:
      'Tetos falsos e paredes em gesso cartonado, com isolamento e iluminação integrados quando fizer sentido.',
    icon: 'Layers',
    confirmado: false,
  },
  {
    id: 'isolamentos',
    name: 'Isolamentos',
    description:
      'Isolamento térmico e acústico de paredes, coberturas e pavimentos, incluindo capoto (isolamento pelo exterior).',
    icon: 'Thermometer',
    confirmado: false,
  },
  {
    id: 'impermeabilizacoes',
    name: 'Impermeabilizações',
    description:
      'Impermeabilização de coberturas, terraços, varandas e zonas húmidas, para tratar as infiltrações na origem.',
    icon: 'Umbrella',
    confirmado: false,
  },
  {
    id: 'reparacoes-e-manutencao',
    name: 'Reparações e manutenção',
    description: 'Reparações pontuais e manutenção de habitações, condomínios e espaços comerciais.',
    icon: 'Wrench',
    confirmado: false,
  },
  {
    id: 'preparacao-e-coordenacao-de-obra',
    name: 'Preparação e coordenação de obra',
    description:
      'Planeamento, sequência dos trabalhos e coordenação das várias especialidades ao longo da obra.',
    icon: 'ClipboardList',
    emphasis: true,
    confirmado: false,
  },
] as const satisfies readonly Service[]
