export type ProjectCategory =
  | "Remodelações"
  | "Cozinhas"
  | "Casas de banho"
  | "Interiores"
  | "Exteriores"
  | "Construção"
  | "Recuperação de imóveis";

export type Project = {
  id: string;
  category: ProjectCategory;
  name: string;
  intervention: string;
  locality: string;
  description: string;
};

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  "Remodelações",
  "Cozinhas",
  "Casas de banho",
  "Interiores",
  "Exteriores",
  "Construção",
  "Recuperação de imóveis",
];

// Todos os projetos abaixo são exemplos de estrutura (placeholders).
// Substituir por projetos reais, com fotografias próprias, antes de
// publicar o site. Ver README, secção "Elementos a substituir".
export const PROJECTS: Project[] = [
  {
    id: "exemplo-remodelacao",
    category: "Remodelações",
    name: "[Nome do projeto]",
    intervention: "Remodelação completa de habitação",
    locality: "[Localidade a preencher]",
    description:
      "Descrição breve da intervenção realizada — âmbito dos trabalhos, especialidades envolvidas e resultado final.",
  },
  {
    id: "exemplo-cozinha",
    category: "Cozinhas",
    name: "[Nome do projeto]",
    intervention: "Remodelação de cozinha",
    locality: "[Localidade a preencher]",
    description:
      "Descrição breve da intervenção realizada — âmbito dos trabalhos, especialidades envolvidas e resultado final.",
  },
  {
    id: "exemplo-casa-banho",
    category: "Casas de banho",
    name: "[Nome do projeto]",
    intervention: "Remodelação de casa de banho",
    locality: "[Localidade a preencher]",
    description:
      "Descrição breve da intervenção realizada — âmbito dos trabalhos, especialidades envolvidas e resultado final.",
  },
  {
    id: "exemplo-interior",
    category: "Interiores",
    name: "[Nome do projeto]",
    intervention: "Reorganização e acabamentos de interiores",
    locality: "[Localidade a preencher]",
    description:
      "Descrição breve da intervenção realizada — âmbito dos trabalhos, especialidades envolvidas e resultado final.",
  },
  {
    id: "exemplo-exterior",
    category: "Exteriores",
    name: "[Nome do projeto]",
    intervention: "Trabalhos exteriores",
    locality: "[Localidade a preencher]",
    description:
      "Descrição breve da intervenção realizada — âmbito dos trabalhos, especialidades envolvidas e resultado final.",
  },
  {
    id: "exemplo-construcao",
    category: "Construção",
    name: "[Nome do projeto]",
    intervention: "Construção de raiz",
    locality: "[Localidade a preencher]",
    description:
      "Descrição breve da intervenção realizada — âmbito dos trabalhos, especialidades envolvidas e resultado final.",
  },
  {
    id: "exemplo-recuperacao",
    category: "Recuperação de imóveis",
    name: "[Nome do projeto]",
    intervention: "Recuperação de imóvel antigo",
    locality: "[Localidade a preencher]",
    description:
      "Descrição breve da intervenção realizada — âmbito dos trabalhos, especialidades envolvidas e resultado final.",
  },
];
