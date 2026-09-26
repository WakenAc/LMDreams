// Testemunhos (Anexo A §9; Parte 5.4 §9). Três cartões placeholder: sem nomes,
// fotografias, estrelas nem classificações, e sem dados estruturados de avaliações.
// Para publicar um testemunho real: preencher os campos (com autorização escrita
// do cliente) e pôr `placeholder: false`.

import type { Testimonial, TestimonialsContent } from './tipos'
import { PH } from '../lib/placeholders'
import { company } from './company'

export const testimonialsSection = {
  heading: 'Testemunhos de clientes',
  introPlaceholder: `Esta secção vai reunir opiniões de clientes da ${company.name}, publicadas com autorização de quem as escreveu.`,
  introReal: `Opiniões de clientes da ${company.name}, publicadas com autorização de quem as escreveu.`,
  fieldLabels: {
    name: 'Nome',
    locality: 'Localidade',
    workType: 'Tipo de obra',
  },
} satisfies TestimonialsContent

export const testimonials = [
  {
    id: 'testemunho-1',
    placeholder: true,
    texto: PH('testemunhos', 'texto do testemunho, com autorização escrita do cliente'),
    nome: PH('testemunhos', 'nome do cliente, com autorização'),
    localidade: PH('testemunhos', 'localidade'),
    tipoDeObra: PH('testemunhos', 'tipo de obra'),
  },
  {
    id: 'testemunho-2',
    placeholder: true,
    texto: PH('testemunhos', 'texto do testemunho, com autorização escrita do cliente'),
    nome: PH('testemunhos', 'nome do cliente, com autorização'),
    localidade: PH('testemunhos', 'localidade'),
    tipoDeObra: PH('testemunhos', 'tipo de obra'),
  },
  {
    id: 'testemunho-3',
    placeholder: true,
    texto: PH('testemunhos', 'texto do testemunho, com autorização escrita do cliente'),
    nome: PH('testemunhos', 'nome do cliente, com autorização'),
    localidade: PH('testemunhos', 'localidade'),
    tipoDeObra: PH('testemunhos', 'tipo de obra'),
  },
] satisfies readonly Testimonial[]
