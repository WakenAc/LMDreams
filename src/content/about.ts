// Sobre a LMDreams (Anexo A §3; Parte 5.4 §3). Sem números, certificações nem clientes
// inventados; a experiência é a dos profissionais, sem dizer que é de cada um enquanto a
// empresa não responder à chave `experiencia`. Parágrafos de 2 a 4 linhas (Parte 5.3).

import type { AboutContent } from './tipos'
import { company } from './company'

export const about = {
  heading: 'Uma empresa de construção civil organizada por especialidades',
  paragraphs: [
    `A ${company.name} é uma empresa de obras que reúne profissionais de construção com ${company.experienceText} de experiência. Com eles, fazemos desde pequenas reparações a obras completas.`,
    'Um trabalho bem feito começa pela pessoa certa e nota-se no acabamento e na durabilidade. Acompanhamos de perto quem nos confia a obra, seja uma família ou um arquiteto, e dizemos com clareza o que foi feito e o que falta.',
  ],
  // Factos concretos que não repetem os itens do hero nem os títulos da Diferenciação.
  highlights: [
    'Eletricistas, canalizadores, carpinteiros e pintores de profissão',
    'Coordenação de todos os trabalhos',
    'Alterações explicadas antes de avançar',
  ],
  highlightsLabel: 'O que pode esperar',
} satisfies AboutContent
