// Contactos e formulário (Anexo A §11; Partes 3.8, 5.4 §11, 5.5 e 5.6).
// "Recebemos o seu pedido" só aparece no estado `success`, que só existe com
// serviço de formulários ativo. No modo por e-mail o site não sabe se o pedido foi enviado.

import type { BudgetRanges, ContactContent, Rich } from './tipos'
import { company } from './company'
import { ui } from './common'
import { formServiceActive } from '../lib/form-config'

const telefoneEscrito = `${company.phone.display} (${company.phoneCallNote})`
const assuntoEmail = 'Pedido de orçamento pelo site'

/**
 * Aviso RGPD junto ao botão (primeira camada; RGPD, art. 13.º; fundamento: art. 6.º,
 * n.º 1, al. b)). Texto-modelo da Parte 5.6, dividido em três blocos curtos para se
 * ler melhor no ponto de envio (cada bloco é um parágrafo).
 */
export const avisoBlocos: readonly Rich[] = [
  // Sem ponto duplo quando a firma já termina em "Lda.".
  `Responsável pelo tratamento: ${company.legal.name.replace(/\.$/, '')}. Usamos estes dados apenas para analisar o seu pedido de orçamento e responder-lhe, antes de qualquer contrato (RGPD, art. 6.º, n.º 1, al. b)).`,
  `Conservamo-los durante ${company.legal.dataRetention} se não for celebrado contrato e só os partilhamos com prestadores técnicos (${formServiceActive ? company.legal.formServiceHosted.processors : company.legal.processors}).`,
  [
    `Pode exercer os seus direitos de acesso, retificação, apagamento, limitação, oposição e portabilidade através de ${company.legal.dataController} e apresentar reclamação à CNPD (`,
    { text: 'www.cnpd.pt', href: 'https://www.cnpd.pt' },
    '). Saiba mais na ',
    { text: 'Política de privacidade', page: 'privacy' },
    '.',
  ],
]

export const contact = {
  heading: 'Contactos e pedido de orçamento',
  intro: `Descreva a obra no formulário ou contacte-nos por telefone, WhatsApp ou e-mail. Quanto mais nos disser sobre o trabalho, mais útil será a primeira conversa.${
    company.quoteTerms?.responseTime ? ` Respondemos no prazo máximo de ${company.quoteTerms.responseTime}.` : ''
  }`,
  formHeading: 'Pedido de orçamento',
  detailsHeading: 'Dados de contacto',
  fields: {
    name: { label: 'Nome (obrigatório)' },
    contactGroup: {
      legend: 'Contacto (indique pelo menos um)',
      phone: { label: 'Telefone' },
      email: { label: 'E-mail' },
    },
    location: {
      label: 'Localização da obra (obrigatória)',
      help: 'Concelho ou localidade.',
    },
    service: {
      label: 'Tipo de serviço (opcional)',
      emptyOption: 'Escolha um serviço',
      otherOption: 'Outro',
    },
    message: {
      label: 'Mensagem (obrigatória)',
      help: 'Descreva a obra: o que pretende fazer, a dimensão aproximada e o prazo que tem em mente.',
    },
    budget: {
      label: 'Orçamento previsto (opcional)',
      help: 'Valor aproximado que pensa investir na obra. Ajuda-nos a propor a solução adequada.',
      emptyOption: 'Escolha um intervalo',
    },
    photos: {
      label: 'Fotografias (opcional)',
      help: 'Até 5 fotografias, em JPG, PNG ou WebP. As fotografias grandes são reduzidas antes do envio.',
      remove: 'Remover',
      selected: 'Fotografias escolhidas',
      preparing: 'A preparar as fotografias…',
    },
    privacy: {
      before: 'Tomei conhecimento da ',
      link: 'Política de privacidade',
      after: '.',
      required: '(obrigatório)',
    },
  },
  noFilesNote:
    'Se tiver fotografias do espaço, pode enviá-las por WhatsApp ou e-mail depois do contacto.',
  // Primeira camada de informação (RGPD, art. 13.º). Texto em `avisoBlocos`.
  notice: avisoBlocos,
  noJsNote: [
    'Neste navegador, o formulário não consegue enviar o pedido (precisa de JavaScript). Escreva-nos para ',
    { text: company.email, href: `mailto:${company.email}?subject=${encodeURIComponent(assuntoEmail)}` },
    ', com a descrição da obra, ou use os outros contactos desta secção.',
  ],
  errors: {
    summary: 'Há campos por preencher ou corrigir. Veja as indicações em cada campo.',
    name: 'Indique o seu nome.',
    contact: 'Indique um telefone ou um e-mail para podermos entrar em contacto consigo.',
    email: 'O e-mail não parece válido. Exemplo: nome@exemplo.pt',
    phone: 'O número de telefone não parece válido.',
    location: 'Indique o concelho ou a localidade da obra.',
    message: 'Descreva brevemente a obra.',
    privacy: 'Confirme que tomou conhecimento da Política de privacidade.',
    tooManyFiles: 'Pode enviar até 5 fotografias.',
    fileTooBig: 'A fotografia “{nome}” tem mais de 10 MB.',
    fileType: 'O ficheiro “{nome}” não está num formato aceite. Use JPG, PNG ou WebP.',
    filesTotalTooBig: 'A fotografia “{nome}” ficou de fora: no total, as fotografias não podem passar de 25 MB.',
  },
  states: {
    sending: 'A enviar…',
    success: 'Obrigado. Recebemos o seu pedido e vamos entrar em contacto consigo.',
    error: `Não foi possível enviar o pedido. Tente novamente ou contacte-nos pelo ${telefoneEscrito} ou por WhatsApp.`,
    errorWithPhotos: `Não foi possível enviar o pedido com as fotografias. Retire as fotografias e tente novamente (pode enviá-las depois por WhatsApp ou e-mail), ou contacte-nos pelo ${telefoneEscrito} ou por WhatsApp.`,
    mailtoBefore:
      'Vamos abrir o seu programa de e-mail com o pedido preenchido. Só tem de o enviar.',
    mailtoAfter: `Tentámos abrir o seu programa de e-mail com o pedido preenchido. O pedido só nos chega depois de o enviar. Se o programa não abriu, use “${ui.labels.copyRequest}” e envie o texto para ${company.email}, ou ligue para o ${telefoneEscrito}.`,
    copied: `Pedido copiado. Cole-o num e-mail para ${company.email}.`,
    copyFailed: `Não foi possível copiar o pedido. Envie a descrição da obra para ${company.email} ou ligue para o ${telefoneEscrito}.`,
    truncated: '(mensagem encurtada; indique o resto por telefone ou WhatsApp)',
  },
  emailDraft: {
    subject: assuntoEmail,
    greeting: `${company.whatsapp.message} Seguem os dados do pedido.`,
    labels: {
      name: 'Nome',
      phone: 'Telefone',
      email: 'E-mail',
      location: 'Localização da obra',
      service: 'Tipo de serviço',
      budget: 'Orçamento previsto',
      message: 'Mensagem',
    },
  },
  details: {
    phoneLabel: 'Telefone',
    whatsappLabel: 'WhatsApp',
    emailLabel: 'E-mail',
    areaLabel: 'Área de atuação',
    addressLabel: 'Morada',
    hoursLabel: 'Horário de atendimento',
    socialLabel: 'Redes sociais',
    complaintsLabel: 'Reclamações',
  },
} satisfies ContactContent

// ---------------------------------------------------------------------------
// Intervalos do campo "Orçamento previsto" (confirmados pela empresa a 28/09/2026;
// chave `intervalos-orcamento`). Formato PT-PT: espaço inseparável (U+00A0)
// entre os milhares e antes do símbolo do euro, escrito como escape.
// ---------------------------------------------------------------------------

export const budgetRanges = {
  confirmado: true,
  options: [
    'Até 10\u00A0000\u00A0€',
    '10\u00A0000\u00A0€ a 25\u00A0000\u00A0€',
    '25\u00A0000\u00A0€ a 50\u00A0000\u00A0€',
    '50\u00A0000\u00A0€ a 100\u00A0000\u00A0€',
    '100\u00A0000\u00A0€ a 250\u00A0000\u00A0€',
    'Mais de 250\u00A0000\u00A0€',
    'Prefiro não indicar',
  ],
} satisfies BudgetRanges
