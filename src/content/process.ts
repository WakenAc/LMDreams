// Método de trabalho (Anexo A §6; Parte 5.4 §6): oito etapas, numeradas 01 a 08.

import type { ProcessContent } from './tipos'

export const method = {
  heading: 'Como trabalhamos',
  intro:
    'Uma obra corre melhor quando todos sabem o que vem a seguir. Estas são as oito etapas que seguimos, do primeiro contacto à entrega.',
  steps: [
    {
      number: '01',
      title: 'Primeiro contacto',
      text: 'Pelo meio de contacto que preferir, ouvimos o que tem em mente e perguntamos onde fica a obra.',
    },
    {
      number: '02',
      title: 'Visita ou análise do projeto',
      text: 'Visitamos o local ou analisamos o projeto e as fotografias que nos enviar.',
    },
    {
      number: '03',
      title: 'Identificação das necessidades',
      text: 'Percebemos o que é preciso fazer e que especialidades vão entrar na obra.',
    },
    {
      number: '04',
      title: 'Orçamento claro',
      text: 'Entregamos um orçamento escrito que diz o que está incluído e o que não está.',
    },
    {
      number: '05',
      title: 'Planeamento dos trabalhos',
      text: 'Organizamos a ordem dos trabalhos e acertamos consigo o calendário da obra.',
    },
    {
      number: '06',
      title: 'Execução por profissionais especializados',
      text: 'Eletricistas, canalizadores, carpinteiros e pintores entram cada um na sua fase, coordenados por nós.',
    },
    {
      number: '07',
      title: 'Acompanhamento e comunicação',
      text: 'Mantemo-lo a par do andamento da obra e falamos consigo antes de qualquer alteração.',
    },
    {
      number: '08',
      title: 'Verificação final e entrega',
      text: 'Verificamos os trabalhos consigo, corrigimos o que for preciso e só depois entregamos a obra.',
    },
  ],
} satisfies ProcessContent
