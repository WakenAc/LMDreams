// Dados da empresa (Partes 1.3, 3.3 e 5.6). Os dados reais estão preenchidos;
// os que faltam usam PH(chave, descrição) e aparecem em CONTEUDO-A-SUBSTITUIR.md.
// Nunca inventar denominação, NIPC, moradas, alvarás ou entidades.

import { PH } from '../lib/placeholders'

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
  /** Slogan do logótipo da empresa; aparece no rodapé, junto ao logótipo. */
  slogan: 'O seu sonho, a nossa obra.',
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

  // Respostas do cliente a 29/09/2026 (questionário de dados; ver docs/relatorio-final.md).
  hours: '8h00 às 19h00',

  /** Os ícones das redes só aparecem quando houver URL real. */
  social: [
    { network: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/lmdreams_construcoes' },
    { network: 'facebook', label: 'Facebook', url: 'https://www.facebook.com/LmDreamnsConstrucoes' },
  ] as readonly SocialLink[],
  /** Passa a null quando `social` tiver endereços reais. */
  socialPending: null as string | null,

  /** Condições do orçamento e da visita: nada aparece no site até haver confirmação. */
  // O cliente não confirmou que o orçamento e a visita são gratuitos: não aparecem como tal.
  quoteTerms: { freeQuote: false, freeVisit: false, responseTime: '8 dias úteis' } as QuoteTerms | null,

  /** Morada que a empresa autoriza mostrar ao público (pode não existir). */
  publicAddress: 'Praceta Armando José Fernandes, n.º 12A, r/c esquerdo, 2845-611 Amora' as string | null,

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
    companyType: 'sociedade unipessoal por quotas',
    /** Firma (ou nome civil, se for empresário em nome individual). */
    // Se legal.form passar a 'eni': name = nome civil do empresário, nipc = NIF e
    // address = morada profissional (Parte 5.6); os rótulos do rodapé mudam sozinhos.
    // Radical "LMDREAMS" numa só palavra, como no IMPIC ("LMDREAMS UNIP LDA"). A pontuação exata
    // confirma-se na certidão permanente (o cliente escreveu "LM Dreams unipessoal lda").
    name: 'LMDreams, Unipessoal Lda.',
    /** NIPC (ou NIF, se for empresário em nome individual). */
    nipc: '516383370',
    /** Morada da sede (ou morada profissional, se for empresário em nome individual). */
    address: 'Rua António Silva, Lote 2037 B, 2975-257 Quinta do Conde',
    // O cliente indicou "Quinta do Conde", mas não há conservatória do registo comercial com esse
    // nome (lista do IRN). Até a certidão permanente a confirmar, o rodapé indica a matrícula sem
    // nomear a conservatória (null).
    registry: null as string | null,
    shareCapital: '5000 €',
    /** Capital realizado, se for diferente do capital social; null se não se aplicar. */
    paidUpCapital: null as string | null, // capital social todo realizado
    /** Capital próprio, se for igual ou inferior a metade do capital social; null se não se aplicar. */
    equityNote: null as string | null, // capital próprio superior a metade do capital social
    // Confirmado no IMPIC a 29/09/2026: alvará de empreiteiro de obras particulares, classe 2.
    license: {
      type: 'Alvará',
      number: '101097-PAR (obras particulares, classe 2)',
    },
    /** Entidade RAL a que a empresa aderiu (se houver) e centros competentes. */
    // Centro competente na Área Metropolitana de Lisboa (sede, escritório e obras); o rodapé já
    // indica o CNIACC para as zonas sem centro regional e o Portal do Consumidor.
    ral: 'na Área Metropolitana de Lisboa, o Centro de Arbitragem de Conflitos de Consumo de Lisboa, www.centroarbitragemlisboa.pt',
    ralMembership: null as string | null, // a empresa não aderiu a nenhuma entidade
    // Passa a geral@lmdreams.pt quando o domínio e o Google Workspace estiverem a funcionar.
    dataController: 'mendes3pm@gmail.com',
    dataRetention: '12 meses',
    processors: 'a Google, que fornece o serviço de e-mail Gmail',
    /** Serviço de formulários (Política de privacidade, destinatários). */
    formService:
      'nenhum; o formulário abre o programa de e-mail do visitante com o pedido preenchido, e o pedido segue pelo serviço de e-mail do próprio visitante',
    policiesUpdatedAt: '29 de setembro de 2026',
    dpo: 'não foi designado',
    quoteValidity: '30 dias',
    // Só as garantias previstas na lei (resposta do cliente): sem garantia comercial.
    commercialWarranty: null as string | null,
  },

  /** Legenda visível em cada imagem gerada por IA (Partes 4.8 e 5.6). */
  aiImageLabel: 'Imagem ilustrativa gerada por IA',
  // A nota do rodapé sobre imagens de IA (Parte 4.8) é calculada a partir de
  // src/content/images.ts, com hasIllustrativeImages(), no próprio rodapé. Não está aqui
  // porque este módulo entra no JavaScript das ilhas e arrastaria o registo de imagens.
} as const

export type Company = typeof company
