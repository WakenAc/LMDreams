// SEO (Parte 3.9). Títulos até 60 caracteres e descrições até 155 (`npm run check:seo`).
// Nunca placeholders: meta tags, Open Graph e JSON-LD só levam dados reais.
// A experiência é a dos profissionais, nunca a idade da empresa (Parte 5.6).

import type { SeoContent } from './tipos'
import { company } from './company'
import { hero } from './hero'

/** Frase do H1 escrita em public/og-image.jpg, sem o ponto final (citada a meio da frase). */
const fraseDaImagemOg = hero.titleLines.join(' ').replace(/\.$/u, '')

export const seo = {
  siteName: company.name,
  locale: 'pt_PT',
  // Descreve public/og-image.jpg e transcreve o texto que ela tem escrito (WCAG 1.1.1).
  ogImageAlt: `Logótipo da ${company.name}, a frase “${fraseDaImagemOg}”, a etiqueta “${hero.eyebrow}” e um profissional a verificar com um nível um revestimento de pedra, com a legenda “${company.aiImageLabel}”.`,
  pages: {
    home: {
      title: `${company.name} | Construção civil e remodelações por especialistas`,
      description: `Empresa de construção civil e remodelações em ${company.areaServed}, composta por profissionais com ${company.experienceText} de experiência. Peça orçamento.`,
    },
    privacy: {
      title: `Política de privacidade | ${company.name}`,
      description: `Como a ${company.name} trata os dados pessoais dos pedidos de orçamento: finalidades, fundamentos, conservação, destinatários e os seus direitos.`,
    },
    cookies: {
      title: `Política de cookies | ${company.name}`,
      description: `O site da ${company.name} não usa cookies, armazenamento local nem ferramentas de rastreio. Saiba o que regista o alojamento do site.`,
    },
    terms: {
      title: `Termos e condições | ${company.name}`,
      description: `Condições de utilização do site da ${company.name}: pedidos de orçamento, imagens ilustrativas, garantias, reclamações e resolução de litígios.`,
    },
    notFound: {
      title: `Página não encontrada | ${company.name}`,
      description: `A página que procura não existe ou mudou de endereço. Volte ao início do site da ${company.name} ou peça orçamento para a sua obra.`,
    },
  },
  organizationDescription: `Empresa de construção civil e remodelações em ${company.areaServed}, organizada por especialidades. Profissionais de construção com ${company.experienceText} de experiência.`,
} satisfies SeoContent
