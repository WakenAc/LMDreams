// Projetos (Anexo A §7; Parte 5.4 §7). Obras reais da empresa, com fotografias autorizadas
// pelos donos de obra (29/09/2026) e tratadas para não identificar moradas nem pessoas
// (recortes e desfoques; proveniência em docs/relatorio-final.md). Nunca imagens de IA.
// Fotografias em public/projetos/<obra>/: pares antes e depois com as mesmas dimensões e
// pela mesma ordem (antes[i] com depois[i]).

import type { Project, ProjectsContent } from './tipos'
import { company } from './company'

export const projectsSection = {
  heading: 'Projetos',
  introPlaceholder: `Esta secção vai reunir obras realizadas pela ${company.name}, com fotografias publicadas com autorização dos clientes.`,
  introReal: `Fotografias de obras realizadas pela ${company.name}, publicadas com autorização dos clientes.`,
  filtersLabel: 'Filtrar projetos por categoria',
  allLabel: 'Todos',
  categories: {
    remodelacoes: 'Remodelações',
    cozinhas: 'Cozinhas',
    'casas-de-banho': 'Casas de banho',
    interiores: 'Interiores',
    exteriores: 'Exteriores',
    construcao: 'Construção',
    recuperacao: 'Recuperação de imóveis',
  },
  results: {
    zero: 'Nenhum projeto para mostrar.',
    one: 'A mostrar {n} projeto.',
    other: 'A mostrar {n} projetos.',
  },
  fieldLabels: {
    type: 'Tipo de intervenção',
    locality: 'Localidade',
    category: 'Categoria',
  },
  dialog: {
    galleryHeading: 'Antes e depois',
    beforeLabel: 'Antes',
    afterLabel: 'Depois',
    sliderLabel: 'Comparar antes e depois',
    sliderValueText: '{antes}\u00A0% antes, {depois}\u00A0% depois',
    noPhotos: 'As fotografias deste projeto ainda não foram publicadas.',
  },
} satisfies ProjectsContent

export const projects = [
  {
    id: 'projeto-remodelacoes',
    nome: 'Recuperação e remodelação de prédio de três frações',
    categoria: 'remodelacoes',
    tipoDeIntervencao: 'Recuperação e remodelação integral',
    localidade: 'Feijó',
    descricao: 'Prédio de três frações recuperado em 2019, com todas as frações remodeladas. As fotografias mostram a entrada, um corredor e uma casa de banho, parte de uma obra que incluiu também fachadas, cozinhas e terraço.',
    capa: { src: 'projetos/remodelacao-predio/01-depois.webp', alt: 'Entrada do prédio depois da remodelação, com pórtico cinzento e revestimento escuro junto à porta.', width: 671, height: 503 },
    antes: [
      { src: 'projetos/remodelacao-predio/01-antes.webp', alt: 'Entrada do prédio antes da obra, com pórtico antigo, parede em pastilha e azulejos antigos.', width: 671, height: 503 },
      { src: 'projetos/remodelacao-predio/02-antes.webp', alt: 'Corredor em demolição antes da remodelação, com tijolo à vista e pavimento cerâmico antigo.', width: 567, height: 756 },
    ],
    depois: [
      { src: 'projetos/remodelacao-predio/01-depois.webp', alt: 'Entrada do prédio depois da obra, com pórtico cinzento, paredes brancas e revestimento escuro.', width: 671, height: 503 },
      { src: 'projetos/remodelacao-predio/02-depois.webp', alt: 'Corredor depois da remodelação, com pavimento laminado, teto com focos embutidos e portas brancas.', width: 567, height: 756 },
      { src: 'projetos/remodelacao-predio/03-depois.webp', alt: 'Casa de banho depois da remodelação, com resguardo de vidro, lavatório suspenso e espelho largo.', width: 960, height: 640 },
    ],
    placeholder: false,
  },
  {
    id: 'projeto-cozinhas',
    nome: 'Cozinha em tom de carvalho e branco num prédio',
    categoria: 'cozinhas',
    tipoDeIntervencao: 'Remodelação de cozinha',
    localidade: 'Feijó',
    descricao: 'Cozinha feita em 2019 como parte da remodelação integral de um prédio de três frações. Depois da demolição, ficou com móveis em tom de carvalho e branco, azulejo metro, bancada branca e península.',
    capa: { src: 'projetos/cozinha-predio/02-depois.webp', alt: 'Cozinha remodelada com colunas em tom de carvalho, azulejo metro e península branca, depois da obra.', width: 1200, height: 553 },
    antes: [
      { src: 'projetos/cozinha-predio/01-antes.webp', alt: 'Antes: cozinha em demolição, com paredes sem azulejo, entulho no chão e janela ao fundo.', width: 720, height: 540 },
    ],
    depois: [
      { src: 'projetos/cozinha-predio/01-depois.webp', alt: 'Depois: mesmo canto, com lava-loiça, pilar em tom de carvalho e balcão junto à janela.', width: 720, height: 540 },
      { src: 'projetos/cozinha-predio/02-depois.webp', alt: 'Depois: cozinha com colunas em tom de carvalho, frigorífico, forno e micro-ondas, e península branca.', width: 1200, height: 553 },
      { src: 'projetos/cozinha-predio/03-depois.webp', alt: 'Depois: península branca à volta do pilar, placa e armários brancos sobre azulejo metro.', width: 1200, height: 553 },
      { src: 'projetos/cozinha-predio/04-depois.webp', alt: 'Depois: lava-loiça e bancada junto à janela, com balcão branco do outro lado do pilar.', width: 1200, height: 624 },
    ],
    placeholder: false,
  },
  {
    id: 'projeto-casas-de-banho',
    nome: 'Casa de banho numa habitação de dois pisos recuperada',
    categoria: 'casas-de-banho',
    tipoDeIntervencao: 'Remodelação de casa de banho',
    localidade: 'Casal de Cambra',
    descricao: 'A casa de banho ficou com duche com resguardo de correr, paredes e chão em cerâmica de grande formato e móveis de lavatório com espelho iluminado. Faz parte da recuperação integral de uma casa de dois pisos, obra de 2026.',
    capa: { src: 'projetos/casa-de-banho-casa/01-depois.webp', alt: 'Duche com resguardo de correr e paredes em cerâmica cinza-bege, depois da obra.', width: 1200, height: 900 },
    antes: [],
    depois: [
      { src: 'projetos/casa-de-banho-casa/01-depois.webp', alt: 'Depois da obra: duche com resguardo de correr em vidro decorado, coluna de duche e janela.', width: 1200, height: 900 },
      { src: 'projetos/casa-de-banho-casa/02-depois.webp', alt: 'Depois da obra: móvel de lavatório branco com gaveta, espelho com luz e paredes em cerâmica.', width: 900, height: 1200 },
      { src: 'projetos/casa-de-banho-casa/03-depois.webp', alt: 'Depois da obra: lavatório com móvel branco e espelho com luz, em parede de cerâmica cinza-bege.', width: 900, height: 1200 },
      { src: 'projetos/casa-de-banho-casa/04-depois.webp', alt: 'Depois da obra: porta de correr embutida aberta para a casa de banho com chão cinzento.', width: 900, height: 1200 },
    ],
    placeholder: false,
  },
  {
    id: 'projeto-interiores',
    nome: 'Livraria-café: remodelação de espaço comercial',
    categoria: 'interiores',
    tipoDeIntervencao: 'Remodelação de espaço comercial',
    localidade: 'Lisboa',
    descricao: 'Remodelação de uma loja em Lisboa para livraria e café, em 2017, com soalho de pinho e tetos falsos. As fotografias mostram parte da obra: a sala do café, antes e depois, e a zona da livraria.',
    capa: { src: 'projetos/livraria-cafe/02-depois.webp', alt: 'Estantes escuras com livros e soalho de pinho na livraria, depois da obra.', width: 720, height: 540 },
    antes: [
      { src: 'projetos/livraria-cafe/01-antes.webp', alt: 'Sala vazia antes da obra, com estrado de madeira e envidraçado virado para o pátio.', width: 644, height: 483 },
    ],
    depois: [
      { src: 'projetos/livraria-cafe/01-depois.webp', alt: 'Sala do café depois da obra, com teto falso, candeeiros suspensos e envidraçado para o pátio.', width: 644, height: 483 },
      { src: 'projetos/livraria-cafe/02-depois.webp', alt: 'Livraria depois da obra, com estantes escuras cheias de livros e soalho de pinho.', width: 720, height: 540 },
      { src: 'projetos/livraria-cafe/03-depois.webp', alt: 'Banco estofado com almofadas entre estantes de livros e soalho de pinho, depois da obra.', width: 610, height: 720 },
    ],
    placeholder: false,
  },
  {
    id: 'projeto-exteriores',
    nome: 'Arranjos exteriores com piscina e jardim',
    categoria: 'exteriores',
    tipoDeIntervencao: 'Arranjos exteriores',
    localidade: 'Fernão Ferro',
    descricao: 'Piscina com deck e jardim com relvado, caminhos em lajeta e canteiros de gravilha branca, feitos em 2021. Faz parte de uma obra maior na mesma moradia, que incluiu a ampliação da casa.',
    capa: { src: 'projetos/exteriores-moradia/01-depois.webp', alt: 'Piscina com deck e jardim com relvado de uma moradia, depois da obra.', width: 960, height: 720 },
    antes: [],
    depois: [
      { src: 'projetos/exteriores-moradia/01-depois.webp', alt: 'Deck junto à piscina e relvado do jardim, com a moradia à esquerda, depois da obra.', width: 960, height: 720 },
      { src: 'projetos/exteriores-moradia/02-depois.webp', alt: 'Caminho em lajeta entre relvados e canteiros de gravilha até à moradia, depois da obra.', width: 960, height: 720 },
      { src: 'projetos/exteriores-moradia/03-depois.webp', alt: 'Caminho em lajeta, gravilha branca e relvado, com a piscina ao fundo, depois da obra.', width: 530, height: 720 },
      { src: 'projetos/exteriores-moradia/04-depois.webp', alt: 'Jardim visto de cima, com caminho em lajeta, gravilha branca, relvado e piscina, depois da obra.', width: 720, height: 515 },
      { src: 'projetos/exteriores-moradia/05-depois.webp', alt: 'Piscina com deck, relvado e gravilha branca, com o anexo ao fundo, depois da obra.', width: 960, height: 410 },
    ],
    placeholder: false,
  },
  {
    id: 'projeto-exteriores-patio',
    nome: 'Pátio com pérgola de madeira e churrasqueira',
    categoria: 'exteriores',
    tipoDeIntervencao: 'Remodelação de pátio',
    localidade: 'Seixal',
    descricao: 'Obra de 2016 num pátio traseiro. Ficou com pavimento cerâmico imitação madeira, canteiros brancos com oliveira e gravilha e uma zona coberta por pérgola de madeira, com churrasqueira.',
    capa: { src: 'projetos/patio-pergola/01-depois.webp', alt: 'Pérgola de madeira sobre a zona da churrasqueira no pátio, depois da obra.', width: 960, height: 596 },
    antes: [],
    depois: [
      { src: 'projetos/patio-pergola/01-depois.webp', alt: 'Zona coberta por pérgola de madeira, com churrasqueira, lava-loiça e pavimento imitação madeira, depois da obra.', width: 960, height: 596 },
      { src: 'projetos/patio-pergola/02-depois.webp', alt: 'Pátio depois da obra, com pavimento imitação madeira, oliveira num canteiro branco e pérgola ao fundo.', width: 800, height: 384 },
      { src: 'projetos/patio-pergola/03-depois.webp', alt: 'Fachada branca das traseiras com portas envidraçadas e pavimento cerâmico do pátio, depois da obra.', width: 800, height: 530 },
    ],
    placeholder: false,
  },
  {
    id: 'projeto-construcao',
    nome: 'Ampliação de moradia para dois pisos',
    categoria: 'construcao',
    tipoDeIntervencao: 'Ampliação',
    localidade: 'Fernão Ferro',
    descricao: 'Obra de 2021: as paredes da moradia, que tinha um piso e sótão, foram alteadas e a casa passou a ter dois pisos e cobertura nova. Fez parte de uma obra maior, que incluiu interiores, piscina e jardim.',
    capa: { src: 'projetos/ampliacao-moradia/03-depois.webp', alt: 'Moradia ampliada para dois pisos, com piscina e jardim, depois da obra.', width: 938, height: 704 },
    antes: [
      { src: 'projetos/ampliacao-moradia/01-antes.webp', alt: 'Moradia de um piso com sótão antes da ampliação, com areia e betoneira à frente.', width: 620, height: 465 },
      { src: 'projetos/ampliacao-moradia/02-antes.webp', alt: 'Empena da moradia com a chaminé e o alpendre, antes da ampliação.', width: 760, height: 570 },
    ],
    depois: [
      { src: 'projetos/ampliacao-moradia/01-depois.webp', alt: 'Moradia depois da ampliação, com dois pisos, cobertura nova, pérgola de madeira e pátio em lajeta.', width: 620, height: 465 },
      { src: 'projetos/ampliacao-moradia/02-depois.webp', alt: 'Empena da moradia depois da ampliação, com dois pisos, chaminé e pérgola de madeira.', width: 760, height: 570 },
      { src: 'projetos/ampliacao-moradia/03-depois.webp', alt: 'Moradia de dois pisos depois da obra, com piscina, relvado e caminhos em lajeta.', width: 938, height: 704 },
    ],
    placeholder: false,
  },
  {
    id: 'projeto-recuperacao',
    nome: 'Recuperação de uma casa de dois pisos',
    categoria: 'recuperacao',
    tipoDeIntervencao: 'Recuperação integral',
    localidade: 'Casal de Cambra',
    descricao: 'Obra de 2026. A fachada degradada foi reparada e pintada, com caixilharia nova, e o interior ficou com escada em pedra e guarda metálica, cozinha sob a escada e quarto com roupeiro embutido.',
    capa: { src: 'projetos/recuperacao-casa/02-depois.webp', alt: 'Depois da obra: fachada de dois pisos pintada de branco, com molduras cor de mostarda.', width: 1200, height: 900 },
    antes: [
      { src: 'projetos/recuperacao-casa/01-antes.webp', alt: 'Antes da obra: fachada de dois pisos com reboco a cair e molduras cor de laranja.', width: 699, height: 932 },
    ],
    depois: [
      { src: 'projetos/recuperacao-casa/01-depois.webp', alt: 'Depois da obra: a mesma fachada pintada de branco, com molduras e soco cor de mostarda.', width: 699, height: 932 },
      { src: 'projetos/recuperacao-casa/02-depois.webp', alt: 'Depois da obra: fachada vista de frente, com caixilharia branca nova e molduras cor de mostarda.', width: 1200, height: 900 },
      { src: 'projetos/recuperacao-casa/03-depois.webp', alt: 'Depois da obra: rés do chão com escada em pedra, guarda metálica e cozinha por baixo.', width: 1200, height: 900 },
      { src: 'projetos/recuperacao-casa/04-depois.webp', alt: 'Depois da obra: quarto com teto inclinado, roupeiro embutido, aplique de parede e janela nova.', width: 1200, height: 900 },
    ],
    placeholder: false,
  },
] satisfies readonly Project[]
