import type { LucideIcon } from "lucide-react";
import {
  Axe,
  Bath,
  Building,
  Building2,
  ChefHat,
  ClipboardList,
  CloudRain,
  Droplet,
  Hammer,
  LayoutGrid,
  PaintRoller,
  PanelsTopLeft,
  ShieldCheck,
  TreeDeciduous,
  Wrench,
  Zap,
} from "lucide-react";

export type Service = {
  icon: LucideIcon;
  title: string;
  text: string;
};

// Lista indicativa de serviços — a confirmar diretamente com a LMDreams
// antes da publicação final do site (ver README).
export const SERVICES: Service[] = [
  {
    icon: Building2,
    title: "Construção civil",
    text: "Execução de obras de raiz e projetos de construção mais alargados.",
  },
  {
    icon: Hammer,
    title: "Remodelações completas",
    text: "Renovação integral de casas e frações, do projeto à entrega.",
  },
  {
    icon: ChefHat,
    title: "Remodelação de cozinhas",
    text: "Novas cozinhas funcionais, com acabamentos cuidados.",
  },
  {
    icon: Bath,
    title: "Remodelação de casas de banho",
    text: "Renovação completa de casas de banho, do encanamento aos revestimentos.",
  },
  {
    icon: Droplet,
    title: "Canalização",
    text: "Instalação e reparação de sistemas de água e esgotos.",
  },
  {
    icon: Zap,
    title: "Eletricidade",
    text: "Instalações elétricas seguras e conformes.",
  },
  {
    icon: PaintRoller,
    title: "Pintura",
    text: "Pintura de interiores e exteriores com acabamento profissional.",
  },
  {
    icon: Axe,
    title: "Carpintaria",
    text: "Trabalhos de madeira à medida, estruturais e decorativos.",
  },
  {
    icon: LayoutGrid,
    title: "Pavimentos e revestimentos",
    text: "Aplicação de pavimentos, azulejos e revestimentos diversos.",
  },
  {
    icon: PanelsTopLeft,
    title: "Tetos falsos e divisórias",
    text: "Criação e reorganização de espaços com tetos falsos e divisórias.",
  },
  {
    icon: ShieldCheck,
    title: "Isolamentos",
    text: "Isolamento térmico e acústico para maior conforto e eficiência.",
  },
  {
    icon: CloudRain,
    title: "Impermeabilizações",
    text: "Proteção de coberturas, terraços e paredes contra infiltrações.",
  },
  {
    icon: Wrench,
    title: "Reparações e manutenção",
    text: "Intervenções pontuais e manutenção preventiva de imóveis.",
  },
  {
    icon: TreeDeciduous,
    title: "Trabalhos exteriores",
    text: "Muros, pavimentos exteriores e outras intervenções ao ar livre.",
  },
  {
    icon: Building,
    title: "Recuperação de imóveis",
    text: "Reabilitação de edifícios e frações mais antigas.",
  },
  {
    icon: ClipboardList,
    title: "Preparação e coordenação de obra",
    text: "Planeamento, faseamento e coordenação de todas as especialidades.",
  },
];
