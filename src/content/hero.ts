// Hero (Anexo A §2; Parte 5.4 §2). A experiência é a dos profissionais,
// não a idade da empresa (Parte 5.6; chave `experiencia`).

import type { HeroContent } from './tipos'
import { company } from './company'

/** Primeira letra em maiúscula, para a forma escrita da experiência abrir um item. */
function maiuscula(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

export const hero = {
  eyebrow: `Construção civil e remodelações · ${company.areaServed}`,
  titleLines: ['Cada especialidade nas mãos', 'de quem realmente sabe.'],
  subtitle: `Profissionais com ${company.experienceText} de experiência, reunidos para cada etapa da obra, com qualidade, rigor e transparência do início ao fim.`,
  trustItems: [
    `${maiuscula(company.experienceText)} de experiência`,
    'Profissionais especializados',
    'Acompanhamento transparente',
  ],
  trustLabel: 'Em resumo',
  // Nomes de serviços do Anexo A §5; o orquestrador ajusta-os à fotografia final.
  annotations: [
    { number: '01', label: 'Revestimentos' },
    { number: '02', label: 'Carpintaria' },
    { number: '03', label: 'Eletricidade' },
  ],
  annotationsLabel: 'Especialidades assinaladas na imagem',
} satisfies HeroContent
