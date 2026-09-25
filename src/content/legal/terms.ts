// Termos e condições (Parte 5.6, 11 secções). Minuta a validar por um jurista antes
// da publicação (nota em CONTEUDO-A-SUBSTITUIR.md). Sem eleição de foro.

import type { LegalPageContent } from '../tipos'
import { company } from '../company'
import { ui } from '../common'
import { footer } from '../footer'

const { legal } = company

const ligacaoEmail = { text: company.email, href: `mailto:${company.email}` }
const ligacaoTelefone = { text: company.phone.display, href: company.phone.href }

/** Identificação do titular do site, conforme a forma jurídica. */
const titular =
  legal.form === 'eni'
    ? `${legal.name}, empresário em nome individual, com o NIF ${legal.nipc} e morada profissional em ${legal.address}`
    : `${legal.name}, ${legal.companyType}, com sede em ${legal.address} e o NIPC ${legal.nipc}`

const garantiaComercial =
  legal.commercialWarranty === null
    ? 'Não é oferecida garantia comercial além da garantia legal.'
    : `Garantia comercial: ${legal.commercialWarranty}. Só existe nas condições indicadas por escrito no orçamento ou no contrato.`

export const termsPage = {
  title: footer.policyLinks.terms,
  intro:
    'Estes termos regulam a utilização deste site e os pedidos de orçamento feitos através dele.',
  updatedLabel: 'Última atualização:',
  tocHeading: 'Índice',
  backToIndex: 'Voltar ao índice',
  sections: [
    {
      id: 'titular-do-site',
      heading: 'Titular do site',
      blocks: [
        {
          type: 'p',
          text: `O titular deste site é ${titular}, que usa a marca ${company.name}.`,
        },
        {
          type: 'p',
          text: `Título habilitante para a atividade de construção: ${legal.license.type} ${footer.legalLabels.license} ${legal.license.number}, ${footer.legalLabels.licenseIssuer}`,
        },
        {
          type: 'p',
          text: [
            'Contactos: e-mail ',
            ligacaoEmail,
            ' e telefone ',
            ligacaoTelefone,
            ` (${company.phoneCallNote}).`,
          ],
        },
      ],
    },
    {
      id: 'objeto',
      heading: 'Objeto do site',
      blocks: [
        {
          type: 'p',
          text: 'Este site apresenta a empresa, os serviços de construção civil e remodelação que presta e as formas de contacto. Tem fins informativos: não é possível comprar produtos ou serviços nem celebrar contratos através dele.',
        },
      ],
    },
    {
      id: 'pedidos-de-orcamento',
      heading: 'Pedidos de orçamento',
      blocks: [
        {
          type: 'ul',
          items: [
            'Um pedido feito pelo formulário, por telefone, WhatsApp ou e-mail não é vinculativo, nem para quem o faz nem para a empresa.',
            'O orçamento é apresentado por escrito, depois de uma visita ao local ou da análise do projeto e da informação enviada.',
            `Salvo indicação em contrário no próprio orçamento, cada orçamento é válido durante ${legal.quoteValidity}.`,
            'A obra só começa depois de aceite o orçamento e, quando a lei o exigir, depois de celebrado um contrato escrito.',
            'Nos contratos celebrados com consumidores à distância ou fora do estabelecimento, prestamos a informação pré-contratual e respeitamos o direito de livre resolução nos termos do Decreto-Lei n.º 24/2014, de 14 de fevereiro, quando aplicável.',
          ],
        },
      ],
    },
    {
      id: 'servicos-sujeitos-a-confirmacao',
      heading: 'Serviços sujeitos a confirmação',
      blocks: [
        {
          type: 'p',
          text: 'A lista de serviços do site é indicativa e não constitui uma proposta contratual. A realização de cada trabalho, o seu âmbito e as condições dependem da análise da obra e ficam confirmados no orçamento.',
        },
      ],
    },
    {
      id: 'imagens',
      heading: 'Imagens ilustrativas e imagens geradas por IA',
      blocks: [
        {
          type: 'p',
          text: `Algumas imagens do site são ilustrativas e foram geradas por inteligência artificial (IA). Estão identificadas com a legenda “${company.aiImageLabel}” e não representam obras realizadas pela ${company.name}.`,
        },
        {
          type: 'p',
          text: 'As fotografias da secção Projetos, quando existirem, são de obras realizadas pela empresa e publicadas com autorização dos clientes. Nessa secção não são usadas imagens geradas por IA.',
        },
      ],
    },
    {
      id: 'propriedade-intelectual',
      heading: 'Propriedade intelectual',
      blocks: [
        {
          type: 'p',
          text: `Os textos, o logótipo, a marca ${company.name} e o aspeto gráfico do site pertencem à empresa ou são usados com autorização. Não podem ser copiados ou reutilizados para fins comerciais sem autorização prévia por escrito.`,
        },
      ],
    },
    {
      id: 'responsabilidade-e-ligacoes-externas',
      heading: 'Responsabilidade e ligações externas',
      blocks: [
        {
          type: 'p',
          text: 'Procuramos manter a informação do site correta e atualizada, mas trata-se de informação geral, que não substitui a análise de cada obra. Em caso de diferença, prevalece o orçamento escrito.',
        },
        {
          type: 'p',
          text: `O site tem ligações para sites de terceiros, como o WhatsApp, o ${ui.complaintsBook.label} ou o Portal do Consumidor. Não somos responsáveis pelo conteúdo nem pelas políticas desses sites.`,
        },
        {
          type: 'p',
          text: 'O site pode ficar temporariamente indisponível por motivos técnicos ou de manutenção.',
        },
      ],
    },
    {
      id: 'garantias',
      heading: 'Garantias',
      blocks: [
        {
          type: 'p',
          text: 'Os trabalhos realizados estão cobertos pela garantia legal aplicável, nos termos da lei e do contrato de cada obra.',
        },
        {
          type: 'p',
          text: garantiaComercial,
        },
      ],
    },
    {
      id: 'reclamacoes-e-litigios',
      heading: 'Livro de Reclamações e resolução alternativa de litígios',
      blocks: [
        {
          type: 'p',
          text: [
            'Pode apresentar uma reclamação no ',
            { text: ui.complaintsBook.label, href: ui.complaintsBook.url },
            '.',
          ],
        },
        {
          type: 'p',
          text: footer.ral,
        },
        {
          type: 'p',
          text: 'Esta informação é prestada nos termos da Lei n.º 144/2015, de 8 de setembro.',
        },
      ],
    },
    {
      id: 'lei-aplicavel',
      heading: 'Lei aplicável e tribunais competentes',
      blocks: [
        {
          type: 'p',
          text: 'Estes termos regem-se pela lei portuguesa. Os litígios são resolvidos pelos tribunais competentes nos termos da lei, sem prejuízo das normas de proteção do consumidor e do recurso à resolução alternativa de litígios.',
        },
      ],
    },
    {
      id: 'alteracoes',
      heading: 'Alterações e data da última atualização',
      blocks: [
        {
          type: 'p',
          text: 'Estes termos podem ser atualizados. A versão em vigor é a que está publicada nesta página.',
        },
        {
          type: 'p',
          text: `Esta versão foi atualizada em ${legal.policiesUpdatedAt}.`,
        },
      ],
    },
  ],
} satisfies LegalPageContent
