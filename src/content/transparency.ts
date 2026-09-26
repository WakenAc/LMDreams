// Transparência e confiança (Anexo A §8; Parte 5.4 §8).
// Comunicação realista: não se promete ausência de imprevistos.

import type { TransparencyContent } from './tipos'

export const transparency = {
  heading: 'Transparência em todas as fases da obra',
  intro:
    'Quem já passou por uma obra com atrasos por explicar ou trabalhos mal acabados sabe o que custa ficar às escuras. Connosco, recebe a informação de que precisa antes de ter de decidir.',
  listTitle: 'O que vai saber',
  items: [
    'O que vai ser executado',
    'Quem é responsável por cada especialidade',
    'Quais são as principais etapas',
    'Como está a decorrer o trabalho',
    'Que alterações podem afetar o orçamento ou os prazos',
  ],
  unforeseen:
    'Numa obra podem surgir imprevistos, como uma canalização antiga em mau estado ou uma parede que esconde humidade. Quando acontecem, explicamos o que se passa, as opções e o impacto no orçamento e no prazo, e só avançamos depois de decidir consigo.',
} satisfies TransparencyContent
