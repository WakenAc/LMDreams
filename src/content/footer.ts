// Rodapé (Anexo A §12; Partes 5.4 §12 e 5.6). Os dados do bloco "Informação legal"
// vêm de company.ts; aqui ficam só os rótulos e a informação RAL.

import type { FooterContent, Seg } from './tipos'
import { company } from './company'
import { ui } from './common'

const adesaoRal =
  company.legal.ralMembership === null
    ? ''
    : `Entidade de resolução alternativa de litígios a que a empresa aderiu: ${company.legal.ralMembership}. `

/**
 * Centro de arbitragem competente (company.legal.ral). Quando o texto acaba no site do
 * centro ("…, www.exemplo.pt"), o site passa a ligação, como o CNIACC e o Portal do Consumidor.
 */
const ralCentro: { texto: string; ligacao: Seg[] } = (() => {
  const m = /^(.*,\s*)(www\.[a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z]{2,})$/i.exec(company.legal.ral)
  if (!m?.[1] || !m[2]) return { texto: company.legal.ral, ligacao: [] }
  return { texto: m[1], ligacao: [{ text: m[2], href: `https://${m[2]}` }] }
})()

export const footer = {
  description: `Empresa de construção civil e remodelações em ${company.areaServed}, que entrega cada trabalho a profissionais da respetiva especialidade.`,
  quickLinksHeading: 'Ligações rápidas',
  servicesHeading: 'Serviços',
  allServicesLabel: ui.labels.exploreServices,
  contactsHeading: 'Contactos',
  policiesHeading: 'Políticas e termos',
  // Iguais aos títulos das páginas legais (que os usam a partir daqui).
  policyLinks: {
    privacy: 'Política de privacidade',
    cookies: 'Política de cookies',
    terms: 'Termos e condições',
  },
  legalInfoHeading: 'Informação legal',
  legalLabels: {
    brand: `marca ${company.name}`,
    seat: 'Sede',
    nipc: 'NIPC e matrícula',
    registry: 'Conservatória do Registo Comercial de',
    registryUnnamed: 'número de matrícula na Conservatória do Registo Comercial',
    shareCapital: 'Capital social',
    license: 'de empreiteiro n.º',
    licenseIssuer: 'emitido pelo IMPIC, I.P.',
    eniSuffix: 'empresário em nome individual',
    nif: 'NIF',
    professionalAddress: 'Morada profissional',
  },
  // Lei n.º 144/2015, art. 18.º. Sem a antiga plataforma europeia de litígios em linha
  // (encerrada em julho de 2025).
  ral: [
    `Em caso de litígio de consumo, o consumidor pode recorrer ao centro de arbitragem de conflitos de consumo com competência na zona em causa (${ralCentro.texto}`,
    ...ralCentro.ligacao,
    `). Se nenhum centro regional for competente, pode recorrer ao CNIACC, Centro Nacional de Informação e Arbitragem de Conflitos de Consumo (`,
    { text: 'www.cniacc.pt', href: 'https://www.cniacc.pt' },
    `). ${adesaoRal}Mais informações no Portal do Consumidor (`,
    { text: 'www.consumidor.gov.pt', href: 'https://www.consumidor.gov.pt' },
    ').',
  ],
  aiNotice: `Algumas imagens deste site são ilustrativas, geradas por IA, e não representam obras realizadas pela ${company.name}.`,
  copyright: `© {ano} ${company.name}. Todos os direitos reservados.`,
} satisfies FooterContent
