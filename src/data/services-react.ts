import {
  FaHardHat,
  FaHome,
  FaUtensils,
  FaBath,
  FaWrench,
  FaBolt,
  FaPaintRoller,
  FaHammer,
  FaArrowRight,
  FaLayerGroup,
  FaSnowflake,
  FaTint,
  FaTools,
  FaTree,
  FaBuilding,
  FaClipboardList,
} from 'react-icons/fa';

export interface ServiceItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

export const services: ServiceItem[] = [
  {
    id: 'construcao-civil',
    icon: FaHardHat,
    title: 'Construção civil',
    description:
      'Construção de raiz de moradias, edifícios e estruturas, com planeamento rigoroso e execução especializada em cada fase do projeto.',
  },
  {
    id: 'remodelacoes-completas',
    icon: FaHome,
    title: 'Remodelações completas',
    description:
      'Transformação integral de espaços, coordenando todas as especialidades necessárias para renovar a sua casa com qualidade e dentro do prazo previsto.',
  },
  {
    id: 'remodelacao-cozinhas',
    icon: FaUtensils,
    title: 'Remodelação de cozinhas',
    description:
      'Renovação funcional e estética de cozinhas, com profissionais especializados em canalização, eletricidade, carpintaria e revestimentos.',
  },
  {
    id: 'remodelacao-casas-banho',
    icon: FaBath,
    title: 'Remodelação de casas de banho',
    description:
      'Projetos completos de renovação de casas de banho, incluindo impermeabilização, canalização, azulejos e instalações sanitárias.',
  },
  {
    id: 'canalizacao',
    icon: FaWrench,
    title: 'Canalização',
    description:
      'Instalação, reparação e substituição de sistemas de água, esgotos e aquecimento, executados por canalizadores experientes.',
  },
  {
    id: 'eletricidade',
    icon: FaBolt,
    title: 'Eletricidade',
    description:
      'Trabalhos elétricos residenciais e comerciais, desde instalações completas a reparações pontuais, com total cumprimento das normas de segurança.',
  },
  {
    id: 'pintura',
    icon: FaPaintRoller,
    title: 'Pintura',
    description:
      'Pintura interior e exterior com materiais de qualidade e acabamentos profissionais, executada por pintores com experiência comprovada.',
  },
  {
    id: 'carpintaria',
    icon: FaHammer,
    title: 'Carpintaria',
    description:
      'Fabrico e montagem de móveis, roupeiros, armários e estruturas em madeira, com soluções adaptadas a cada espaço.',
  },
  {
    id: 'pavimentos-revestimentos',
    icon: FaArrowRight,
    title: 'Pavimentos e revestimentos',
    description:
      'Aplicação de pavimentos flutuantes, cerâmicos, pedra natural e outros revestimentos, com rigor no assentamento e acabamento.',
  },
  {
    id: 'tetos-divisorias',
    icon: FaLayerGroup,
    title: 'Tetos falsos e divisórias',
    description:
      'Execução de tetos falsos, paredes divisórias e sistemas de isolamento acústico para melhorar o conforto e a funcionalidade dos espaços.',
  },
  {
    id: 'isolamentos',
    icon: FaSnowflake,
    title: 'Isolamentos',
    description:
      'Aplicação de isolamentos térmicos e acústicos em paredes, coberturas e pavimentos, para maior eficiência energética e conforto.',
  },
  {
    id: 'impermeabilizacoes',
    icon: FaTint,
    title: 'Impermeabilizações',
    description:
      'Trabalhos de impermeabilização de coberturas, terraços, caves e zonas húmidas, protegendo a estrutura contra infiltrações.',
  },
  {
    id: 'reparacoes-manutencao',
    icon: FaTools,
    title: 'Reparações e manutenção',
    description:
      'Pequenas e médias reparações em todo o tipo de edifícios, com resposta rápida e profissional para resolver problemas do dia a dia.',
  },
  {
    id: 'trabalhos-exteriores',
    icon: FaTree,
    title: 'Trabalhos exteriores',
    description:
      'Construção e recuperação de muros, calçadas, pátios, varandas e espaços exteriores, com materiais resistentes e acabamentos cuidados.',
  },
  {
    id: 'recuperacao-imoveis',
    icon: FaBuilding,
    title: 'Recuperação de imóveis',
    description:
      'Reabilitação de edifícios antigos ou degradados, preservando as características originais e adaptando-os às exigências atuais de conforto e segurança.',
  },
  {
    id: 'coordenacao-obra',
    icon: FaClipboardList,
    title: 'Preparação e coordenação de obra',
    description:
      'Planeamento e gestão completa de obras, coordenando prazos, fornecedores e equipas especializadas para garantir uma execução eficiente e sem sobressaltos.',
  },
];

export const serviceCategories = [
  { id: 'remodelacoes', label: 'Remodelações' },
  { id: 'cozinhas', label: 'Cozinhas' },
  { id: 'casas-banho', label: 'Casas de banho' },
  { id: 'interiores', label: 'Interiores' },
  { id: 'exteriores', label: 'Exteriores' },
  { id: 'construcao', label: 'Construção' },
  { id: 'recuperacao', label: 'Recuperação de imóveis' },
] as const;

export interface PortfolioItem {
  id: string;
  title: string;
  type: string;
  location: string;
  description: string;
  category: string;
  images: { label: string; placeholder: string }[];
}

export const portfolioItems: PortfolioItem[] = [
  {
    id: 'projeto-01',
    title: 'Projeto 01',
    type: 'Remodelação completa',
    location: '[Localidade]',
    description:
      '[Breve descrição do projeto, tipologia da intervenção e principais trabalhos realizados.]',
    category: 'remodelacoes',
    images: [
      { label: 'Antes', placeholder: '[Fotografia antes da intervenção]' },
      { label: 'Depois', placeholder: '[Fotografia depois da intervenção]' },
    ],
  },
  {
    id: 'projeto-02',
    title: 'Projeto 02',
    type: 'Remodelação de cozinha',
    location: '[Localidade]',
    description:
      '[Breve descrição do projeto, tipologia da intervenção e principais trabalhos realizados.]',
    category: 'cozinhas',
    images: [
      { label: 'Antes', placeholder: '[Fotografia antes da intervenção]' },
      { label: 'Depois', placeholder: '[Fotografia depois da intervenção]' },
    ],
  },
  {
    id: 'projeto-03',
    title: 'Projeto 03',
    type: 'Remodelação de casa de banho',
    location: '[Localidade]',
    description:
      '[Breve descrição do projeto, tipologia da intervenção e principais trabalhos realizados.]',
    category: 'casas-banho',
    images: [
      { label: 'Antes', placeholder: '[Fotografia antes da intervenção]' },
      { label: 'Depois', placeholder: '[Fotografia depois da intervenção]' },
    ],
  },
  {
    id: 'projeto-04',
    title: 'Projeto 04',
    type: 'Construção de raiz',
    location: '[Localidade]',
    description:
      '[Breve descrição do projeto, tipologia da intervenção e principais trabalhos realizados.]',
    category: 'construcao',
    images: [
      { label: 'Antes', placeholder: '[Fotografia antes da intervenção]' },
      { label: 'Depois', placeholder: '[Fotografia depois da intervenção]' },
    ],
  },
  {
    id: 'projeto-05',
    title: 'Projeto 05',
    type: 'Recuperação de imóvel',
    location: '[Localidade]',
    description:
      '[Breve descrição do projeto, tipologia da intervenção e principais trabalhos realizados.]',
    category: 'recuperacao',
    images: [
      { label: 'Antes', placeholder: '[Fotografia antes da intervenção]' },
      { label: 'Depois', placeholder: '[Fotografia depois da intervenção]' },
    ],
  },
  {
    id: 'projeto-06',
    title: 'Projeto 06',
    type: 'Remodelação de interiores',
    location: '[Localidade]',
    description:
      '[Breve descrição do projeto, tipologia da intervenção e principais trabalhos realizados.]',
    category: 'interiores',
    images: [
      { label: 'Antes', placeholder: '[Fotografia antes da intervenção]' },
      { label: 'Depois', placeholder: '[Fotografia depois da intervenção]' },
    ],
  },
];
