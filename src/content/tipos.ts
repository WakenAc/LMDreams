// Tipos do modelo de conteúdo (Parte 3.3). Contrato entre os textos de src/content/
// e os componentes: os componentes não têm texto escrito à mão.
// Os textos podem conter placeholders criados com PH(chave, descrição).

import type { AnchorId, PageId } from '../lib/pages'

export type { AnchorId, PageId }

// ---------------------------------------------------------------------------
// Texto rico mínimo (ligações e ênfase dentro de parágrafos)
// ---------------------------------------------------------------------------

/** Ligação externa, `mailto:` ou `tel:`. As externas abrem numa nova janela. */
export interface SegLink {
  text: string
  href: string
}
/** Ligação interna para outra página do site (e, opcionalmente, uma âncora). */
export interface SegPage {
  text: string
  page: PageId
  hash?: AnchorId | string
}
export interface SegStrong {
  strong: string
}
export type Seg = string | SegLink | SegPage | SegStrong
/** Texto simples ou sequência de segmentos. Os placeholders são detetados automaticamente. */
export type Rich = string | readonly Seg[]

// ---------------------------------------------------------------------------
// Ícones (lucide-react 1.x; nomes confirmados na versão instalada)
// ---------------------------------------------------------------------------

export type IconName =
  | 'BrickWall'
  | 'Hammer'
  | 'CookingPot'
  | 'Bath'
  | 'Droplets'
  | 'Zap'
  | 'PaintRoller'
  | 'Ruler'
  | 'LayoutGrid'
  | 'Layers'
  | 'Thermometer'
  | 'Umbrella'
  | 'Wrench'
  | 'Fence'
  | 'Landmark'
  | 'ClipboardList'
  | 'UserCheck'
  | 'MessagesSquare'
  | 'CalendarRange'
  | 'BadgeCheck'
  | 'Eye'
  | 'ListChecks'
  | 'Handshake'
  | 'Users'
  | 'HardHat'
  | 'PencilRuler'
  | 'ShieldCheck'

// ---------------------------------------------------------------------------
// Imagens (registo central em src/content/images.ts)
// ---------------------------------------------------------------------------

export type ImageId =
  | 'hero'
  | 'sobre'
  | 'diferenciacao'
  | 'servico-construcao'
  | 'servico-cozinhas'
  | 'servico-casas-de-banho'
  | 'servico-pavimentos'
  | 'servico-recuperacao'
  | 'servico-exteriores'
  | 'transparencia'
  | 'cta'

// ---------------------------------------------------------------------------
// Microtexto comum (Parte 5.5, "Microtexto de referência")
// ---------------------------------------------------------------------------

export interface UiContent {
  /** Um só rótulo por intenção em todo o site (Parte 1.4, regra 12). */
  labels: {
    requestQuote: string // "Pedir orçamento"
    exploreServices: string // "Conhecer os serviços"
    callPhone: string // "Contactar por telefone"
    whatsapp: string // "Falar por WhatsApp"
    beforeAfter: string // "Ver antes e depois"
    backHome: string // "Voltar ao início"
    sendRequest: string // "Enviar pedido"
    copyRequest: string // "Copiar pedido"
    /** Forma curta: só na barra móvel e no cabeçalho entre 768 e 1279 px. */
    callShort: string // "Ligar"
    /** Forma curta: só na barra móvel. */
    whatsappShort: string // "WhatsApp"
  }
  a11y: {
    skipLink: string // "Saltar para o conteúdo"
    openMenu: string // "Abrir menu"
    closeMenu: string // "Fechar menu"
    newWindow: string // "(abre numa nova janela)"
    callCompany: string // "Ligar para a LMDreams"
    whatsappCompany: string // "WhatsApp da LMDreams"
    mobileContactBar: string // nome acessível da barra de contacto móvel
    close: string // "Fechar" (diálogos)
  }
  placeholders: {
    content: string // "Conteúdo a substituir"
    image: string // "Imagem a substituir"
  }
  complaintsBook: {
    label: string // "Livro de Reclamações Eletrónico"
    url: string // "https://www.livroreclamacoes.pt/inicio"
  }
}

// ---------------------------------------------------------------------------
// Navegação e cabeçalho
// ---------------------------------------------------------------------------

export interface NavItem {
  label: string
  anchor: AnchorId
}

export interface NavigationContent {
  ariaLabel: string // "Navegação principal"
  logoLabel: string // "LMDreams, voltar ao início"
  /** Os seis itens do Anexo A §1, pela ordem. */
  items: readonly NavItem[]
  mobileMenuTitle: string // título visível do painel do menu móvel
}

// ---------------------------------------------------------------------------
// Secções da página principal
// ---------------------------------------------------------------------------

export interface HeroAnnotation {
  number: string // "01"
  label: string // nome de um serviço do Anexo A §5 visível na fotografia
}

export interface HeroContent {
  eyebrow: string
  /** H1 em duas partes: a quebra de linha só se aplica a partir de 1024 px. */
  titleLines: readonly [string, string]
  subtitle: string
  /** Linha de confiança (Anexo A §2), um item por elemento da lista. */
  trustItems: readonly string[]
  trustLabel: string // nome acessível da lista de confiança
  /** Especialidades anotadas na fotografia do hero (0 a 3; só o que a fotografia mostra). */
  annotations: readonly HeroAnnotation[]
  annotationsLabel: string // título acessível da lista de anotações
}

export interface AboutContent {
  heading: string
  paragraphs: readonly Rich[]
  highlights: readonly string[]
  highlightsLabel: string
}

export interface DifferentiatorCard {
  icon: IconName
  title: string
  text: string
}

export interface DifferentiatorsContent {
  heading: string // "Não acreditamos no “faz-tudo”. Acreditamos em especialistas."
  intro: Rich
  cards: readonly DifferentiatorCard[]
}

export interface Service {
  id: string
  name: string
  description: string
  icon: IconName
  /** Os seis serviços em destaque têm imagem. */
  imageId?: ImageId
  /** Destaque de texto (capacidade de obra completa). */
  emphasis?: boolean
  /** Falso até a empresa validar o nome e a descrição (chave `servicos`). */
  confirmado: boolean
}

export interface ServicesContent {
  heading: string
  intro: Rich
  featuredLabel: string // título acessível ou visível da grelha em destaque
  othersHeading: string // título da lista compacta
  visitorNote: string // "Cada obra é diferente. Diga-nos de que precisa e confirmamos se é um trabalho que fazemos."
}

export interface ProcessStep {
  number: string // "01" a "08"
  title: string
  text: string
}

export interface ProcessContent {
  heading: string
  intro: Rich
  steps: readonly ProcessStep[]
}

export type ProjectCategory =
  | 'remodelacoes'
  | 'cozinhas'
  | 'casas-de-banho'
  | 'interiores'
  | 'exteriores'
  | 'construcao'
  | 'recuperacao'

/** Fotografia real de um projeto (só com autorização do cliente). */
export interface ProjectPhoto {
  src: string
  alt: string
  width: number
  height: number
}

export interface Project {
  id: string
  nome: string
  categoria: ProjectCategory
  tipoDeIntervencao: string
  localidade: string
  descricao: string
  capa: ProjectPhoto | null
  antes: readonly ProjectPhoto[]
  depois: readonly ProjectPhoto[]
  /** Verdadeiro enquanto não houver dados e fotografias reais (chave `projetos`). */
  placeholder: boolean
}

export interface ProjectsContent {
  heading: string
  /** Enquanto todos os projetos forem placeholders (Parte 5.4 §7). */
  introPlaceholder: string
  /** Quando existir pelo menos um projeto real. */
  introReal: string
  filtersLabel: string // nome acessível do grupo de filtros
  allLabel: string // "Todos"
  categories: Readonly<Record<ProjectCategory, string>>
  /** Anúncio do número de resultados ({n} = número). */
  results: { zero: string; one: string; other: string }
  fieldLabels: { type: string; locality: string; category: string }
  dialog: {
    galleryHeading: string
    beforeLabel: string // "Antes"
    afterLabel: string // "Depois"
    sliderLabel: string
    /** Texto do aria-valuetext ({antes} e {depois} em percentagem). */
    sliderValueText: string
    noPhotos: string // texto quando ainda não há fotografias reais
  }
}

export interface TransparencyContent {
  heading: string
  intro: Rich
  listTitle: string // "O que vai saber"
  items: readonly string[] // os cinco pontos do Anexo A §8
  unforeseen: Rich // parágrafo realista sobre imprevistos
}

export interface Testimonial {
  id: string
  placeholder: boolean
  texto: string
  nome: string
  localidade: string
  tipoDeObra: string
}

export interface TestimonialsContent {
  heading: string
  /** Enquanto todos os testemunhos forem placeholders. */
  introPlaceholder: Rich
  /** Quando existir pelo menos um testemunho real. */
  introReal: Rich
  fieldLabels: { name: string; locality: string; workType: string }
}

export interface CtaContent {
  heading: string
  text: Rich
}

// ---------------------------------------------------------------------------
// Contactos e formulário (Partes 3.8, 5.4 §11 e 5.5)
// ---------------------------------------------------------------------------

export interface ContactContent {
  heading: string
  intro: Rich
  formHeading: string
  detailsHeading: string
  fields: {
    name: { label: string }
    contactGroup: { legend: string; phone: { label: string }; email: { label: string } }
    location: { label: string; help: string }
    service: { label: string; emptyOption: string; otherOption: string }
    message: { label: string; help: string }
    budget: { label: string; help: string; emptyOption: string }
    photos: { label: string; help: string; remove: string; selected: string; preparing: string }
    /** "Tomei conhecimento da [Política de privacidade]." */
    privacy: { before: string; link: string; after: string; required: string }
  }
  /** Frase quando o serviço de formulários não aceita ficheiros. */
  noFilesNote: string
  /** Aviso RGPD junto ao botão (primeira camada; Parte 5.6), um parágrafo por bloco. */
  notice: readonly Rich[]
  /** Nota no lugar do botão de envio quando o formulário não pode enviar (sem JavaScript, ou se a ilha não carregar). */
  noJsNote: Rich
  errors: {
    summary: string // anúncio geral quando há erros
    name: string
    contact: string
    email: string
    phone: string
    location: string
    message: string
    privacy: string
    tooManyFiles: string
    /** {nome} = nome do ficheiro. */
    fileTooBig: string
    /** {nome} = nome do ficheiro. */
    fileType: string
    /** {nome} = nome do ficheiro que faria passar o total permitido. */
    filesTotalTooBig: string
  }
  states: {
    sending: string // "A enviar…"
    success: string // só com serviço de formulários ativo
    error: string
    /** Erro quando o pedido levava fotografias: sugere enviar sem elas. */
    errorWithPhotos: string
    mailtoBefore: string
    mailtoAfter: string
    copied: string
    copyFailed: string
    /** Acrescentado ao corpo do e-mail quando é encurtado. */
    truncated: string
  }
  /** Rascunho do e-mail no modo por e-mail (assunto e rótulos do corpo). */
  emailDraft: {
    subject: string
    greeting: string
    labels: {
      name: string
      phone: string
      email: string
      location: string
      service: string
      budget: string
      message: string
    }
  }
  details: {
    phoneLabel: string
    whatsappLabel: string
    emailLabel: string
    areaLabel: string // "Área de atuação"
    addressLabel: string // "Morada" (só com company.publicAddress)
    hoursLabel: string
    socialLabel: string
    complaintsLabel: string
  }
}

/** Intervalos do campo "Orçamento previsto" (chave `intervalos-orcamento`). */
export interface BudgetRanges {
  confirmado: boolean
  options: readonly string[]
}

// ---------------------------------------------------------------------------
// Rodapé e informação legal
// ---------------------------------------------------------------------------

export interface FooterContent {
  description: string
  quickLinksHeading: string
  servicesHeading: string
  allServicesLabel: string // ligação para #servicos
  contactsHeading: string
  policiesHeading: string
  /** Rótulos das ligações para as páginas legais (iguais aos títulos das páginas). */
  policyLinks: { privacy: string; cookies: string; terms: string }
  legalInfoHeading: string // "Informação legal"
  /** Rótulos do bloco "Informação legal" (carimbo). */
  legalLabels: {
    brand: string // "marca LMDreams"
    seat: string // "Sede"
    nipc: string // "NIPC e matrícula"
    registry: string // "Conservatória do Registo Comercial de"
    registryUnnamed: string // quando a conservatória não está indicada (legal.registry null)
    shareCapital: string // "Capital social"
    license: string // "de empreiteiro n.º"
    licenseIssuer: string // "emitido pelo IMPIC, I.P."
    eniSuffix: string // "empresário em nome individual"
    nif: string // "NIF"
    professionalAddress: string // "Morada profissional"
  }
  /** Informação RAL (Lei n.º 144/2015, art. 18.º). */
  ral: Rich
  aiNotice: string // nota geral sobre imagens de IA (só com imagens ilustrativas)
  /** {ano} = ano do build. */
  copyright: string
}

export interface NotFoundContent {
  title: string // "Página não encontrada"
  text: string // "A página que procura não existe ou mudou de endereço."
}

// ---------------------------------------------------------------------------
// Páginas legais (Parte 5.6)
// ---------------------------------------------------------------------------

export type LegalBlock =
  | { type: 'p'; text: Rich }
  | { type: 'ul'; items: readonly Rich[] }

export interface LegalSection {
  id: string
  heading: string
  blocks: readonly LegalBlock[]
}

export interface LegalPageContent {
  title: string
  intro?: Rich
  updatedLabel: string // "Última atualização:"
  /** Data da última atualização desta página (company.legal.*UpdatedAt). */
  updatedAt: string
  tocHeading: string // "Índice"
  backToIndex: string // "Voltar ao índice"
  sections: readonly LegalSection[]
}

// ---------------------------------------------------------------------------
// SEO (Parte 3.9)
// ---------------------------------------------------------------------------

export interface PageSeo {
  /** Até 60 caracteres. */
  title: string
  /** Até 155 caracteres. */
  description: string
}

export interface SeoContent {
  siteName: string // "LMDreams"
  locale: string // "pt_PT"
  ogImageAlt: string
  pages: Readonly<Record<PageId, PageSeo>>
  /** `description` do JSON-LD (mesma regra da meta description). */
  organizationDescription: string
}
