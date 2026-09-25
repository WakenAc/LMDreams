// Dados da empresa (Partes 1.3, 3.3 e 5.6). Os dados reais estão preenchidos;
// os que faltam usam PH(chave, descrição) e aparecem em CONTEUDO-A-SUBSTITUIR.md.
// Nunca inventar denominação, NIPC, moradas, alvarás ou entidades.

import { PH } from '../lib/placeholders'
import { hasIllustrativeImages } from './images'

export type LegalForm = 'sociedade' | 'eni'

export interface SocialLink {
  network: 'facebook' | 'instagram' | 'linkedin' | 'youtube'
  label: string
  url: string
}

export interface QuoteTerms {
  /** Só `true` com confirmação escrita da empresa (chave `condicoes-orcamento`). */
  freeQuote: boolean
  freeVisit: boolean
  /** Prazo de resposta que a empresa aceita assumir, ou null. */
  responseTime: string | null
}

/** Experiência dos profissionais (nunca a idade da empresa; Parte 5.6). */
const experienceYears = 30

/** Forma jurídica: 'sociedade' (valor inicial) ou 'eni' (empresário em nome individual). */
const legalForm: LegalForm = 'sociedade'

export const company = {
  name: 'LMDreams',
  experienceYears,
  /** Forma escrita da alegação, sempre atribuída aos profissionais. */
  experienceText: `mais de ${experienceYears} anos`,

  phone: {
    // Espaços inseparáveis (U+00A0): o número nunca quebra a meio.
    display: '+351 919 233 372',
    href: 'tel:+351919233372',
    e164: '+351919233372',
  },
  /** Obrigatório junto a cada ocorrência visível do número (Parte 5.6). */
  phoneCallNote: 'chamada para a rede móvel nacional',

  whatsapp: {
    number: '351919233372',
    message: 'Olá, gostaria de pedir um orçamento para uma obra.',
  },

  email: 'mendes3pm@gmail.com',
  areaServed: 'Portugal continental',

  hours: PH('horario', 'horário de atendimento'),

  /** Os ícones das redes só aparecem quando houver URL real. */
  social: [] as readonly SocialLink[],
  /** Passa a null quando `social` tiver endereços reais. */
  socialPending: PH('redes-sociais', 'redes sociais') as string | null,

  /** Condições do orçamento e da visita: nada aparece no site até haver confirmação. */
  quoteTerms: null as QuoteTerms | null,

  /** Morada que a empresa autoriza mostrar ao público (pode não existir). */
  publicAddress: null as string | null,

  /**
   * Ícone oficial do Livro de Reclamações (public/livro-reclamacoes.svg), depois de
   * registar a empresa na plataforma. Enquanto não existir: ligação em texto + placeholder.
   */
  complaintsBookIcon: PH(
    'icone-livro-reclamacoes',
    'ícone oficial do Livro de Reclamações Eletrónico',
  ) as string | { src: string; width: number; height: number },

  legal: {
    form: legalForm as LegalForm,
    companyType: PH('forma-juridica', 'tipo de sociedade (Lda., Unipessoal Lda. ou S.A.)'),
    /** Firma (ou nome civil, se for empresário em nome individual). */
    // Se legal.form passar a 'eni': name = nome civil do empresário, nipc = NIF e
    // address = morada profissional (Parte 5.6); os rótulos do rodapé mudam sozinhos.
    name: PH('denominacao-social', 'denominação social'),
    /** NIPC (ou NIF, se for empresário em nome individual). */
    nipc: PH('nipc', 'NIPC'),
    /** Morada da sede (ou morada profissional, se for empresário em nome individual). */
    address: PH('sede', 'morada da sede'),
    registry: PH('registo-comercial', 'conservatória'),
    shareCapital: PH('registo-comercial', 'capital social'),
    /** Capital realizado, se for diferente do capital social; null se não se aplicar. */
    paidUpCapital: PH('capital-realizado-proprio', 'capital realizado, se for diferente do capital social') as
      | string
      | null,
    /** Capital próprio, se for igual ou inferior a metade do capital social; null se não se aplicar. */
    equityNote: PH(
      'capital-realizado-proprio',
      'capital próprio, se for igual ou inferior a metade do capital social',
    ) as string | null,
    license: {
      type: PH('titulo-impic', 'alvará ou certificado'),
      number: PH('titulo-impic', 'número'),
    },
    /** Entidade RAL a que a empresa aderiu (se houver) e centros competentes. */
    ral: PH(
      'ral',
      'centros de arbitragem de conflitos de consumo competentes em Portugal continental, com os sites',
    ),
    ralMembership: PH('ral', 'entidade RAL a que a empresa aderiu, se houver, com o site') as
      | string
      | null,
    dataController: PH('responsavel-dados', 'e-mail para dados pessoais'),
    dataRetention: PH('prazo-conservacao', 'prazo de conservação'),
    processors: PH('fornecedores-dados', 'serviços de formulários e de e-mail'),
    /** Serviço de formulários (Política de privacidade, destinatários). */
    formService: PH('fornecedores-dados', 'serviço de formulários'),
    policiesUpdatedAt: PH('data-politicas', 'data da última atualização'),
    dpo: PH(
      'epd',
      'encarregado de proteção de dados ou confirmação de que não foi designado',
    ),
    quoteValidity: PH('validade-orcamento', 'validade dos orçamentos'),
    commercialWarranty: PH('garantia-comercial', 'garantia comercial') as string | null,
  },

  /** Legenda visível em cada imagem gerada por IA (Partes 4.8 e 5.6). */
  aiImageLabel: 'Imagem ilustrativa gerada por IA',
  /** Nota do rodapé: só existe se houver pelo menos uma imagem com `ilustrativa: true`. */
  showIllustrativeImagesNotice: hasIllustrativeImages(),
} as const

export type Company = typeof company
