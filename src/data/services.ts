import type { ServiceEntry } from '@/types/content';

export const services: ServiceEntry[] = [
  {
    title: 'Construção e remodelação',
    slug: 'construcao-remodelacao',
    summary: 'Intervenções de construção e renovação planeadas com coordenação técnica adequada.',
    description:
      'Categoria provisória para enquadrar necessidades de construção nova, remodelação integral ou parcial.',
    benefits: ['Planeamento consistente', 'Execução por especialidade', 'Comunicação clara'],
    draftContent: true,
    requiresCompanyApproval: true,
    icon: 'build'
  },
  {
    title: 'Especialidades técnicas',
    slug: 'especialidades-tecnicas',
    summary: 'Coordenação de especialidades necessárias ao bom desempenho e segurança da obra.',
    description:
      'Categoria provisória para trabalhos técnicos que exigem profissionais dedicados e coordenação entre equipas.',
    benefits: ['Profissionais dedicados', 'Compatibilização técnica', 'Rigor de execução'],
    draftContent: true,
    requiresCompanyApproval: true,
    icon: 'tools'
  },
  {
    title: 'Acabamentos',
    slug: 'acabamentos',
    summary: 'Fase de acabamento orientada para qualidade visual, funcionalidade e detalhe.',
    description:
      'Categoria provisória para operações de acabamento interior e exterior a validar na lista final de serviços.',
    benefits: ['Atenção ao detalhe', 'Qualidade final', 'Execução cuidada'],
    draftContent: true,
    requiresCompanyApproval: true,
    icon: 'finish'
  },
  {
    title: 'Reparações e melhorias',
    slug: 'reparacoes-melhorias',
    summary: 'Intervenções de correção e melhoria em imóveis habitacionais e comerciais.',
    description:
      'Categoria provisória para necessidades pontuais de reparação e melhoria, com priorização técnica adequada.',
    benefits: ['Resposta orientada à necessidade', 'Solução técnica adequada', 'Follow-up claro'],
    draftContent: true,
    requiresCompanyApproval: true,
    icon: 'repair'
  },
  {
    title: 'Coordenação de trabalhos',
    slug: 'coordenacao-trabalhos',
    summary: 'Articulação das diferentes fases e equipas envolvidas na obra.',
    description:
      'Categoria provisória para coordenação de frentes de trabalho e sequência entre especialidades.',
    benefits: ['Sequência lógica', 'Menos conflitos entre etapas', 'Maior previsibilidade'],
    draftContent: true,
    requiresCompanyApproval: true,
    icon: 'coordination'
  },
  {
    title: 'Acompanhamento de obra',
    slug: 'acompanhamento-obra',
    summary: 'Acompanhamento contínuo da execução com informação objetiva para o cliente.',
    description:
      'Categoria provisória para monitorização da obra, validação de progresso e alinhamento de comunicação.',
    benefits: ['Visibilidade sobre progresso', 'Comunicação transparente', 'Gestão responsável'],
    draftContent: true,
    requiresCompanyApproval: true,
    icon: 'supervision'
  }
];
