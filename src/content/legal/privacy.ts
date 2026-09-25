// Política de privacidade (Parte 5.6, 15 secções). Minuta a validar por um jurista
// antes da publicação (nota registada em CONTEUDO-A-SUBSTITUIR.md, não no site).
// Os dados em falta vêm de company.legal (placeholders já definidos).

import type { LegalPageContent } from '../tipos'
import { company } from '../company'
import { ui } from '../common'
import { contact } from '../contact'
import { footer } from '../footer'

const { legal } = company

const ligacaoEmail = { text: company.email, href: `mailto:${company.email}` }
const ligacaoTelefone = { text: company.phone.display, href: company.phone.href }
// Rótulo da caixa sem o ponto final, para o citar a meio de uma frase.
const caixaPrivacidade = `${contact.fields.privacy.before}${contact.fields.privacy.link}`

/** Identificação do responsável pelo tratamento, conforme a forma jurídica. */
const responsavel =
  legal.form === 'eni'
    ? `${legal.name}, empresário em nome individual, com o NIF ${legal.nipc} e morada profissional em ${legal.address}`
    : `${legal.name}, ${legal.companyType}, com sede em ${legal.address} e o NIPC ${legal.nipc}`

export const privacyPage = {
  title: footer.policyLinks.privacy,
  intro:
    'Esta política explica como tratamos os dados pessoais de quem nos contacta através deste site, em especial nos pedidos de orçamento, nos termos do Regulamento (UE) 2016/679 (Regulamento Geral sobre a Proteção de Dados, RGPD) e da Lei n.º 58/2019, de 8 de agosto.',
  updatedLabel: 'Última atualização:',
  tocHeading: 'Índice',
  backToIndex: 'Voltar ao índice',
  sections: [
    {
      id: 'responsavel-pelo-tratamento',
      heading: 'Responsável pelo tratamento e contactos',
      blocks: [
        {
          type: 'p',
          text: `O responsável pelo tratamento dos dados pessoais recolhidos neste site é ${responsavel}, que usa a marca ${company.name}.`,
        },
        {
          type: 'p',
          text: [
            `Para questões sobre dados pessoais, contacte-nos através de ${legal.dataController}. Para outros assuntos, use o e-mail `,
            ligacaoEmail,
            ' ou o telefone ',
            ligacaoTelefone,
            ` (${company.phoneCallNote}).`,
          ],
        },
      ],
    },
    {
      id: 'encarregado-de-protecao-de-dados',
      heading: 'Encarregado de proteção de dados',
      blocks: [
        {
          type: 'p',
          text: `Encarregado de proteção de dados: ${legal.dpo}.`,
        },
        {
          type: 'p',
          text: 'As questões sobre dados pessoais podem ser enviadas para o contacto indicado na secção anterior.',
        },
      ],
    },
    {
      id: 'dados-tratados',
      heading: 'Dados que tratamos',
      blocks: [
        {
          type: 'p',
          text: 'No formulário de pedido de orçamento, tratamos os dados que nos indicar:',
        },
        {
          type: 'ul',
          items: [
            'Nome',
            'Telefone, e-mail ou ambos',
            'Localização da obra (concelho ou localidade)',
            'Tipo de serviço e orçamento previsto, se os indicar',
            'Mensagem com a descrição da obra',
            'Fotografias do espaço, se as anexar (quando o formulário aceita ficheiros)',
          ],
        },
        {
          type: 'p',
          text: 'Quando nos contacta por telefone, WhatsApp ou e-mail, tratamos os dados transmitidos nesse contacto, como o número de telefone, o endereço de e-mail e o conteúdo da mensagem.',
        },
        {
          type: 'p',
          text: 'Pedimos-lhe que não inclua na mensagem ou nas fotografias dados de outras pessoas, nem informação que não seja necessária para o orçamento.',
        },
        {
          type: 'p',
          text: [
            'O site não usa cookies nem ferramentas de estatística. Os registos técnicos do alojamento estão descritos na secção “Destinatários e subcontratantes” e na ',
            { text: 'Política de cookies', page: 'cookies' },
            '.',
          ],
        },
      ],
    },
    {
      id: 'finalidades-e-fundamentos',
      heading: 'Finalidades e fundamentos jurídicos',
      blocks: [
        {
          type: 'ul',
          items: [
            'Analisar o pedido de orçamento, responder-lhe e, se for o caso, marcar uma visita e preparar o orçamento. Fundamento: diligências pré-contratuais a pedido do titular dos dados (RGPD, art. 6.º, n.º 1, al. b)).',
            'Responder a pedidos feitos em nome de uma empresa, de um condomínio ou de outra entidade, com os dados de contacto do respetivo representante ou colaborador. Fundamento: interesse legítimo em responder à entidade que fez o pedido (RGPD, art. 6.º, n.º 1, al. f)).',
            'Se o pedido der origem a um contrato, executar esse contrato (al. b)) e cumprir as obrigações legais que dele resultam, por exemplo de faturação (al. c)).',
          ],
        },
        {
          type: 'p',
          text: 'Não usamos estes dados para enviar publicidade ou newsletters e não os vendemos a terceiros.',
        },
        {
          type: 'p',
          text: `O tratamento não se baseia no consentimento. A caixa do formulário “${caixaPrivacidade}” serve para confirmar que leu esta informação antes de enviar o pedido.`,
        },
      ],
    },
    {
      id: 'obrigatoriedade-dos-dados',
      heading: 'Obrigatoriedade dos dados',
      blocks: [
        {
          type: 'p',
          text: 'São obrigatórios o nome, pelo menos um contacto (telefone ou e-mail), a localização da obra, a mensagem e a confirmação de que tomou conhecimento desta política. Sem estes elementos não conseguimos analisar o pedido nem responder-lhe.',
        },
        {
          type: 'p',
          text: 'Os restantes campos são opcionais e servem para preparar melhor a resposta.',
        },
      ],
    },
    {
      id: 'destinatarios-e-subcontratantes',
      heading: 'Destinatários e subcontratantes',
      blocks: [
        {
          type: 'p',
          text: 'Os pedidos só são consultados por quem, na empresa, os analisa e lhes responde. Para isso, recorremos aos seguintes prestadores, que tratam os dados por nossa conta (subcontratantes):',
        },
        {
          type: 'ul',
          items: [
            `Serviço de formulários: ${legal.formService}.`,
            [
              'E-mail: os pedidos chegam à caixa ',
              ligacaoEmail,
              ', no Gmail, serviço da Google.',
            ],
            'Envio por e-mail: se o formulário abrir o seu programa de e-mail, o site não envia nem guarda os dados. O pedido segue pelo seu próprio serviço de e-mail até à nossa caixa no Gmail.',
            'Alojamento do site: GitHub Pages, serviço da GitHub, que regista os endereços IP dos visitantes por motivos de segurança.',
          ],
        },
        {
          type: 'p',
          text: 'Os dados podem também ser comunicados a autoridades públicas, quando a lei o exigir.',
        },
      ],
    },
    {
      id: 'transferencias-internacionais',
      heading: 'Transferências internacionais',
      blocks: [
        {
          type: 'p',
          text: 'A Google (Gmail) e a GitHub (GitHub Pages) podem tratar dados fora do Espaço Económico Europeu, em especial nos Estados Unidos. Essas transferências assentam nas garantias previstas no RGPD: a decisão de adequação da Comissão Europeia relativa ao Quadro de Privacidade de Dados UE-EUA (EU-U.S. Data Privacy Framework), a que a GitHub declara ter aderido, ou cláusulas contratuais-tipo aprovadas pela Comissão.',
        },
        {
          type: 'p',
          text: 'Se o serviço de formulários tratar dados fora do Espaço Económico Europeu, aplicam-se as mesmas regras.',
        },
      ],
    },
    {
      id: 'prazo-de-conservacao',
      heading: 'Prazo de conservação',
      blocks: [
        {
          type: 'p',
          text: `Se o pedido não der origem a contrato, conservamos os dados durante ${legal.dataRetention} e apagamo-los em seguida.`,
        },
        {
          type: 'p',
          text: 'Se houver contrato, os dados são conservados durante a execução da obra e, depois, pelos prazos que a lei impõe, por exemplo para efeitos fiscais ou de garantia.',
        },
      ],
    },
    {
      id: 'direitos-dos-titulares',
      heading: 'Os seus direitos e como exercê-los',
      blocks: [
        {
          type: 'p',
          text: 'Nos termos do RGPD, pode:',
        },
        {
          type: 'ul',
          items: [
            'Aceder aos seus dados e obter uma cópia',
            'Pedir a retificação de dados inexatos ou incompletos',
            'Pedir o apagamento dos dados',
            'Pedir a limitação do tratamento',
            'Opor-se ao tratamento baseado no interesse legítimo',
            'Receber os dados que nos forneceu num formato estruturado e de uso corrente, ou pedir que sejam transmitidos a outra entidade (portabilidade)',
          ],
        },
        {
          type: 'p',
          text: `Para exercer estes direitos, contacte-nos através de ${legal.dataController}. Podemos pedir-lhe informação que confirme a sua identidade. O RGPD prevê uma resposta no prazo de um mês a contar da receção do pedido, prorrogável nos casos previstos na lei.`,
        },
      ],
    },
    {
      id: 'reclamacao-cnpd',
      heading: 'Reclamação à autoridade de controlo',
      blocks: [
        {
          type: 'p',
          text: [
            'Se considerar que os seus dados não foram tratados de acordo com a lei, pode apresentar reclamação à Comissão Nacional de Proteção de Dados (CNPD), através do site ',
            { text: 'www.cnpd.pt', href: 'https://www.cnpd.pt' },
            '. Pode também contactar-nos primeiro, para tentarmos resolver a questão.',
          ],
        },
      ],
    },
    {
      id: 'decisoes-automatizadas',
      heading: 'Decisões automatizadas',
      blocks: [
        {
          type: 'p',
          text: 'Não tomamos decisões baseadas exclusivamente em tratamento automatizado, nem definimos perfis a partir dos seus dados.',
        },
      ],
    },
    {
      id: 'seguranca',
      heading: 'Segurança',
      blocks: [
        {
          type: 'p',
          text: 'O site é servido por ligação cifrada (HTTPS) e não tem base de dados própria: o formulário não guarda os pedidos no navegador nem num servidor do site.',
        },
        {
          type: 'p',
          text: 'O acesso aos pedidos fica limitado a quem precisa deles para responder. Se ocorrer uma violação de dados com risco para os seus direitos, informamos a CNPD e, quando a lei o exigir, as pessoas afetadas.',
        },
      ],
    },
    {
      id: 'ligacoes-externas',
      heading: 'Ligações externas e WhatsApp',
      blocks: [
        {
          type: 'p',
          text: `O botão “${ui.labels.whatsapp}” abre o WhatsApp, um serviço externo, com uma mensagem genérica já escrita. O site não transmite ao WhatsApp nenhum dado do formulário. A conversa que se seguir fica sujeita também aos termos e à política de privacidade do WhatsApp.`,
        },
        {
          type: 'p',
          text: `O site tem ainda ligações para outros sites, como o ${ui.complaintsBook.label}, a CNPD ou o Portal do Consumidor, que têm as suas próprias políticas de privacidade.`,
        },
      ],
    },
    {
      id: 'menores',
      heading: 'Menores',
      blocks: [
        {
          type: 'p',
          text: 'Os pedidos de orçamento destinam-se a maiores de 18 anos. Se tiver menos de 18 anos, peça a um adulto responsável que nos contacte.',
        },
      ],
    },
    {
      id: 'alteracoes',
      heading: 'Alterações e data da última atualização',
      blocks: [
        {
          type: 'p',
          text: 'Podemos atualizar esta política, por exemplo se mudarmos de serviço de formulários ou de alojamento. A versão em vigor é a que está publicada nesta página.',
        },
        {
          type: 'p',
          text: `Esta versão foi atualizada em ${legal.policiesUpdatedAt}.`,
        },
      ],
    },
  ],
} satisfies LegalPageContent
