// Sobre a LMDreams (Anexo A §3; Parte 5.4 §3). Sem números, certificações nem clientes
// inventados; a experiência é a dos profissionais.

import type { AboutContent } from './tipos'
import { company } from './company'

export const about = {
  heading: 'Uma empresa de construção civil organizada por especialidades',
  paragraphs: [
    `A ${company.name} é uma empresa de obras que reúne profissionais de construção com ${company.experienceText} de experiência, cada um na sua especialidade. Com eles, fazemos desde pequenas reparações a obras completas.`,
    'Um trabalho bem feito começa pela pessoa certa, e isso nota-se no acabamento e na forma como a obra resiste ao tempo. Acompanhamos de perto quem nos confia a obra, seja uma família ou um arquiteto.',
  ],
  highlights: [
    'Profissionais especializados em cada área',
    'Coordenação de todos os trabalhos',
    'Informação clara em cada fase',
  ],
  highlightsLabel: 'O que pode esperar',
} satisfies AboutContent
