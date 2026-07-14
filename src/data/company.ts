import siteConfig from '../../site.config.mjs';
import type { CompanyInfo, ContactDetailsData } from '@/types/content';

export const companyInfo: CompanyInfo = {
  name: 'LMDreams',
  legalName: 'LMDreams Construções Lda',
  slogan: 'O seu sonho, a nossa obra.',
  intro:
    'Empresa portuguesa de construção e remodelação, apoiada por profissionais com mais de 20 anos de experiência no mercado da construção.',
  experienceStatement:
    'Profissionais com mais de 20 anos de experiência no setor da construção.',
  values: [
    'Qualidade',
    'Transparência',
    'Especialização profissional',
    'Experiência',
    'Fiabilidade',
    'Comunicação clara',
    'Atenção ao detalhe',
    'Responsabilidade',
    'Coordenação adequada entre especialidades'
  ]
};

export const contactDetails: ContactDetailsData = {
  phone: '[TELEFONE A CONFIRMAR]',
  email: '[EMAIL A CONFIRMAR]',
  operationArea: '[ÁREA DE ATUAÇÃO A CONFIRMAR]',
  formEndpoint: siteConfig.contactFormEndpoint
};

export const trustHighlights = [
  'Profissionais com mais de 20 anos de experiência.',
  'Especialistas dedicados a cada área de trabalho.',
  'Comunicação clara durante toda a obra.',
  'Qualidade e rigor na execução.'
];

export const specializationBenefits = [
  {
    title: 'Especialização',
    description: 'Cada tarefa é executada por profissionais dedicados à respetiva área.'
  },
  {
    title: 'Qualidade de execução',
    description: 'A intervenção certa, com o conhecimento certo, em cada fase.'
  },
  {
    title: 'Coordenação',
    description: 'Planeamento e articulação entre especialidades para evitar falhas de sequência.'
  },
  {
    title: 'Transparência',
    description: 'Comunicação objetiva sobre o que está previsto, em curso e concluído.'
  }
];
