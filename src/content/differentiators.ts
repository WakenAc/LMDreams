// Diferenciação (Anexo A §4; Parte 5.4 §4).

import type { DifferentiatorsContent } from './tipos'

export const differentiators = {
  heading: 'Não acreditamos no “faz-tudo”. Acreditamos em especialistas.',
  intro:
    'Numa obra há trabalhos muito diferentes, e cada um pede o seu ofício. Por isso, cada especialidade é executada por um profissional com experiência nessa área: o eletricista trata da eletricidade, o canalizador da canalização, e nós coordenamos o conjunto.',
  cards: [
    {
      icon: 'UserCheck',
      title: 'Profissionais especializados',
      text: 'Cada trabalho fica com quem o faz no dia a dia: a pintura com o pintor, os roupeiros com o carpinteiro.',
    },
    {
      icon: 'MessagesSquare',
      title: 'Comunicação transparente',
      text: 'Falamos claro sobre o que vai ser feito e o que custa. Se alguma coisa mudar, fica a saber antes de avançarmos.',
    },
    {
      icon: 'CalendarRange',
      title: 'Planeamento rigoroso',
      text: 'Definimos a sequência dos trabalhos antes de começar, para que cada especialidade entre na altura certa.',
    },
    {
      icon: 'BadgeCheck',
      title: 'Qualidade de execução',
      text: 'Preparamos bem as bases e verificamos cada fase antes de passar à seguinte.',
    },
    {
      icon: 'HardHat',
      title: 'Acompanhamento durante toda a obra',
      text: 'Da primeira visita à entrega, explicamos quem faz o quê e em que ponto está a obra.',
    },
  ],
} satisfies DifferentiatorsContent
