import type { ProcessStep } from '@/types/content';

export const processSteps: ProcessStep[] = [
  {
    id: 'primeiro-contacto',
    title: 'Primeiro contacto',
    description: 'Receção do pedido inicial e recolha dos dados essenciais para o enquadramento.',
    displayOrder: 1,
    draftContent: true,
    requiresCompanyApproval: true
  },
  {
    id: 'compreensao-necessidade',
    title: 'Compreensão da necessidade',
    description: 'Entendimento do objetivo da obra, prioridades e expectativas principais do cliente.',
    displayOrder: 2,
    draftContent: true,
    requiresCompanyApproval: true
  },
  {
    id: 'avaliacao-projeto',
    title: 'Avaliação do projeto',
    description: 'Análise das necessidades e identificação das especialidades técnicas mais adequadas.',
    displayOrder: 3,
    draftContent: true,
    requiresCompanyApproval: true
  },
  {
    id: 'proposta-planeamento',
    title: 'Proposta e planeamento',
    description: 'Definição da abordagem de trabalho e planeamento de coordenação entre equipas.',
    displayOrder: 4,
    draftContent: true,
    requiresCompanyApproval: true
  },
  {
    id: 'execucao-especializada',
    title: 'Execução especializada',
    description: 'Intervenção executada por profissionais dedicados a cada área da obra.',
    displayOrder: 5,
    draftContent: true,
    requiresCompanyApproval: true
  },
  {
    id: 'acompanhamento-entrega',
    title: 'Acompanhamento e entrega',
    description: 'Acompanhamento final e fecho da intervenção com comunicação clara do resultado.',
    displayOrder: 6,
    draftContent: true,
    requiresCompanyApproval: true
  }
];
