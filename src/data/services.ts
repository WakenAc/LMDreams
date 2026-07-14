import type { ServiceEntry } from '@/types/content';

export const services: ServiceEntry[] = [
  {
    title: 'Construção e remodelação',
    slug: 'construcao-remodelacao',
    summary:
      'Construção de raiz, remodelações completas e trabalhos de especialidade executados por profissionais coordenados em cada fase.',
    description:
      'A LMDreams coordena profissionais especializados em todas as áreas da construção e remodelação, garantindo qualidade, rigor e comunicação clara durante toda a obra.',
    benefits: [
      'Profissionais especializados por área',
      'Coordenação centralizada de todas as especialidades',
      'Comunicação clara em cada fase da obra'
    ],
    draftContent: true,
    requiresCompanyApproval: true,
    icon: 'build'
  },
  {
    title: 'Especialidades técnicas',
    slug: 'especialidades-tecnicas',
    summary:
      'Canalização, eletricidade, climatização e outras especialidades técnicas com profissionais certificados.',
    description:
      'Execução de trabalhos técnicos especializados por profissionais qualificados, com cumprimento das normas de segurança e qualidade aplicáveis.',
    benefits: [
      'Profissionais certificados para cada especialidade',
      'Cumprimento das normas técnicas e de segurança',
      'Garantia de qualidade na execução'
    ],
    draftContent: true,
    requiresCompanyApproval: true,
    icon: 'tools'
  },
  {
    title: 'Acabamentos',
    slug: 'acabamentos',
    summary:
      'Pintura, carpintaria, pavimentos, revestimentos e acabamentos interiores e exteriores com rigor profissional.',
    description:
      'Trabalhos de acabamento executados com atenção ao detalhe, utilizando materiais de qualidade e profissionais experientes em cada área.',
    benefits: [
      'Materiais de qualidade selecionados',
      'Execução cuidada e atenta ao detalhe',
      'Resultado com acabamento profissional'
    ],
    draftContent: true,
    requiresCompanyApproval: true,
    icon: 'finish'
  },
  {
    title: 'Reparações e melhorias',
    slug: 'reparacoes-melhorias',
    summary:
      'Pequenas e médias reparações, manutenção e melhorias em todo o tipo de edifícios residenciais e comerciais.',
    description:
      'Resposta rápida e profissional para resolver problemas do dia a dia, com técnicos disponíveis para intervenções de menor dimensão.',
    benefits: [
      'Resposta rápida a pedidos de reparação',
      'Profissionais disponíveis para intervenções pontuais',
      'Solução adequada a cada situação'
    ],
    draftContent: true,
    requiresCompanyApproval: true,
    icon: 'repair'
  },
  {
    title: 'Coordenação de trabalhos',
    slug: 'coordenacao-trabalhos',
    summary:
      'Planeamento e gestão completa de obras, coordenando prazos, fornecedores e equipas especializadas.',
    description:
      'A LMDreams assegura a coordenação de todas as especialidades necessárias, garantindo uma execução eficiente, dentro do prazo e sem sobressaltos.',
    benefits: [
      'Gestão centralizada da obra',
      'Coordenação entre equipas especializadas',
      'Controlo de prazos e fornecedores'
    ],
    draftContent: true,
    requiresCompanyApproval: true,
    icon: 'coordination'
  },
  {
    title: 'Acompanhamento de obra',
    slug: 'acompanhamento-obra',
    summary:
      'Acompanhamento presencial e comunicação regular sobre o estado de cada fase da obra.',
    description:
      'Supervisão e acompanhamento técnico da execução da obra, com relatórios de progresso e comunicação transparente com o cliente.',
    benefits: [
      'Acompanhamento presencial em cada fase',
      'Relatórios de progresso regulares',
      'Comunicação transparente com o cliente'
    ],
    draftContent: true,
    requiresCompanyApproval: true,
    icon: 'supervision'
  }
];

