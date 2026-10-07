// Política de cookies (Parte 5.6, 7 secções). O site não usa cookies, armazenamento
// local nem recursos de terceiros carregados automaticamente (Parte 1.4, regra 5).
// Minuta a validar por um jurista antes da publicação (nota em CONTEUDO-A-SUBSTITUIR.md).

import type { LegalPageContent } from '../tipos'
import { company } from '../company'
import { ui } from '../common'
import { footer } from '../footer'

export const cookiesPage = {
  title: footer.policyLinks.cookies,
  intro: 'Resumo: este site não usa cookies nem guarda informação no seu dispositivo.',
  updatedLabel: 'Última atualização:',
  updatedAt: company.legal.cookiesUpdatedAt,
  tocHeading: 'Índice',
  backToIndex: 'Voltar ao índice',
  sections: [
    {
      id: 'o-que-sao-cookies',
      heading: 'O que são cookies e tecnologias semelhantes',
      blocks: [
        {
          type: 'p',
          text: 'Cookies são pequenos ficheiros que um site guarda no navegador para reconhecer o dispositivo em visitas seguintes. Há tecnologias com efeito semelhante, como o armazenamento local do navegador (localStorage e sessionStorage), os pixels de rastreio ou os identificadores de dispositivo.',
        },
        {
          type: 'p',
          text: 'A lei portuguesa exige consentimento prévio para guardar ou ler informação no equipamento de quem visita um site, exceto quando isso é estritamente necessário para prestar o serviço pedido (Lei n.º 41/2004, de 18 de agosto, art. 5.º).',
        },
      ],
    },
    {
      id: 'este-site-nao-usa-cookies',
      heading: 'Este site não usa cookies',
      blocks: [
        {
          type: 'p',
          text: `O site da ${company.name} não usa cookies, próprios ou de terceiros, e não guarda nada no armazenamento local do navegador. Também não usa pixels, ferramentas de estatística, reCAPTCHA ou outras tecnologias de rastreio.`,
        },
        {
          type: 'p',
          text: 'Por isso, não lhe mostramos nenhum aviso de cookies nem lhe pedimos consentimento para esse efeito.',
        },
      ],
    },
    {
      id: 'recursos-de-terceiros',
      heading: 'Recursos de terceiros',
      blocks: [
        {
          type: 'p',
          text: 'O site não carrega automaticamente nenhum recurso de terceiros: as fontes tipográficas e as imagens são servidas a partir do próprio site, e não há mapas, vídeos ou botões de redes sociais incorporados.',
        },
        {
          type: 'p',
          text: `Só sai do site se carregar numa ligação externa, por exemplo para o WhatsApp ou para o ${ui.complaintsBook.label}. A partir daí, aplicam-se as políticas desses sites.`,
        },
      ],
    },
    {
      id: 'registos-do-alojamento',
      heading: 'Registos técnicos do alojamento',
      blocks: [
        {
          type: 'p',
          text: 'O site está alojado no GitHub Pages, serviço da GitHub. Como a generalidade dos serviços de alojamento, o GitHub Pages regista o endereço IP de cada visita, por motivos de segurança e de funcionamento do serviço.',
        },
        {
          type: 'p',
          text: [
            'Estes registos não dependem de cookies, e não os usamos para identificar visitantes. Mais informação na ',
            { text: 'Política de privacidade', page: 'privacy' },
            '.',
          ],
        },
      ],
    },
    {
      id: 'gerir-cookies-no-navegador',
      heading: 'Como gerir cookies no navegador',
      blocks: [
        {
          type: 'p',
          text: 'Embora este site não use cookies, pode consultar e apagar os cookies guardados por outros sites nas definições do seu navegador, normalmente na área de privacidade ou segurança. Também pode configurar o navegador para bloquear cookies ou para o avisar antes de os aceitar.',
        },
      ],
    },
    {
      id: 'alteracoes-futuras',
      heading: 'Alterações futuras',
      blocks: [
        {
          type: 'p',
          text: 'Se no futuro o site passar a usar estatísticas de visitas ou conteúdos de terceiros que guardem ou leiam informação no seu dispositivo, só o fará com o seu consentimento prévio e com a opção de recusar. Esta política será atualizada antes dessa mudança.',
        },
      ],
    },
    {
      id: 'data-da-ultima-atualizacao',
      heading: 'Data da última atualização',
      blocks: [
        {
          type: 'p',
          text: `Esta política foi atualizada em ${company.legal.cookiesUpdatedAt}.`,
        },
      ],
    },
  ],
} satisfies LegalPageContent
