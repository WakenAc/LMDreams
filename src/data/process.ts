export type ProcessStep = {
  numero: string;
  title: string;
  text: string;
};

export const PROCESS_STEPS: ProcessStep[] = [
  {
    numero: "01",
    title: "Primeiro contacto",
    text: "Conta-nos o que pretende fazer, por telefone, e-mail, WhatsApp ou através do formulário do site.",
  },
  {
    numero: "02",
    title: "Visita ou análise do projeto",
    text: "Avaliamos o espaço e o que é necessário fazer, presencialmente ou com base nos elementos do projeto.",
  },
  {
    numero: "03",
    title: "Identificação das necessidades",
    text: "Esclarecemos objetivos, prioridades e especialidades envolvidas na obra.",
  },
  {
    numero: "04",
    title: "Orçamento claro",
    text: "Apresentamos uma proposta detalhada, sem valores escondidos ou pouco explicados.",
  },
  {
    numero: "05",
    title: "Planeamento dos trabalhos",
    text: "Definimos o faseamento e a sequência das especialidades envolvidas.",
  },
  {
    numero: "06",
    title: "Execução por profissionais especializados",
    text: "Cada tarefa é realizada por quem tem experiência concreta nessa área.",
  },
  {
    numero: "07",
    title: "Acompanhamento e comunicação",
    text: "Mantemo-lo informado sobre o progresso e sobre qualquer alteração relevante.",
  },
  {
    numero: "08",
    title: "Verificação final e entrega",
    text: "Revemos o trabalho concluído consigo antes da entrega da obra.",
  },
];
