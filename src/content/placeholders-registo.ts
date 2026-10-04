// Registo de placeholders (Anexo B do BRIEF-LMDREAMS.md).
// Fonte de verdade para PH(chave, descrição) e para `npm run check:placeholders`,
// que gera CONTEUDO-A-SUBSTITUIR.md. Módulo puro: não importar nada aqui.

/**
 * - 'sim': bloqueia a publicação (`check:placeholders --strict`, usado no deploy).
 * - 'se-sociedade' / 'se-aplicavel': só bloqueia quando `legal.form` é 'sociedade'.
 * - 'nao': pendente informativo.
 */
export type Bloqueio = 'sim' | 'se-sociedade' | 'se-aplicavel' | 'nao'

export interface RegistoPlaceholder {
  chave: string
  ondeAparece: string
  ficheiroCampo: string
  oQueFornecer: string
  bloqueia: Bloqueio
  /** Texto da coluna "Bloqueia publicação" do Anexo B, para o ficheiro gerado. */
  bloqueiaTexto: string
}

export const REGISTO_PLACEHOLDERS = [
  {
    chave: 'forma-juridica',
    ondeAparece: 'Informação legal',
    ficheiroCampo: 'src/content/company.ts → legal.form, legal.companyType',
    oQueFornecer:
      'Sociedade (e tipo: Lda., Unipessoal Lda., S.A.) ou empresário em nome individual',
    bloqueia: 'se-sociedade',
    bloqueiaTexto: 'Sim',
  },
  {
    chave: 'denominacao-social',
    ondeAparece: 'Informação legal, políticas',
    ficheiroCampo: 'src/content/company.ts → legal.name',
    oQueFornecer:
      'Firma (ou nome civil, se for empresário em nome individual). Depois de a confirmar, decidir se o aviso de direitos de autor do rodapé passa a nomear a firma (hoje nomeia só a marca: “© [ano] LMDreams. Todos os direitos reservados.”, como pede a Parte 5.4 do brief)',
    bloqueia: 'sim',
    bloqueiaTexto: 'Sim',
  },
  {
    chave: 'nipc',
    ondeAparece: 'Informação legal, políticas',
    ficheiroCampo: 'src/content/company.ts → legal.nipc',
    oQueFornecer: 'NIPC ou NIF',
    bloqueia: 'sim',
    bloqueiaTexto: 'Sim',
  },
  {
    chave: 'sede',
    ondeAparece: 'Informação legal, Política de privacidade',
    ficheiroCampo: 'src/content/company.ts → legal.address',
    oQueFornecer: 'Morada da sede (uso legal, não comercial)',
    bloqueia: 'sim',
    bloqueiaTexto: 'Sim',
  },
  {
    chave: 'titulo-impic',
    ondeAparece: 'Informação legal, Sobre',
    ficheiroCampo: 'src/content/company.ts → legal.license',
    oQueFornecer:
      'Tipo (alvará ou certificado de empreiteiro) e número; classes e categorias opcionais',
    bloqueia: 'sim',
    bloqueiaTexto: 'Sim',
  },
  {
    chave: 'ral',
    ondeAparece: 'Informação legal, Termos',
    ficheiroCampo: 'src/content/company.ts → legal.ral',
    oQueFornecer:
      'Entidade(s) de resolução alternativa de litígios a que a empresa aderiu ou que são competentes, com o site (o CNIACC já consta como entidade de competência genérica)',
    bloqueia: 'sim',
    bloqueiaTexto: 'Sim',
  },
  {
    chave: 'registo-comercial',
    ondeAparece: 'Informação legal (só se for sociedade)',
    ficheiroCampo: 'src/content/company.ts → legal.registry, legal.shareCapital',
    oQueFornecer: 'Conservatória e capital social',
    bloqueia: 'se-sociedade',
    bloqueiaTexto: 'Sim, se for sociedade',
  },
  {
    chave: 'responsavel-dados',
    ondeAparece: 'Política de privacidade',
    ficheiroCampo: 'src/content/company.ts → legal.dataController',
    oQueFornecer: 'Contacto para questões de dados pessoais',
    bloqueia: 'sim',
    bloqueiaTexto: 'Sim',
  },
  {
    chave: 'prazo-conservacao',
    ondeAparece: 'Política de privacidade',
    ficheiroCampo: 'src/content/company.ts → legal.dataRetention',
    oQueFornecer: 'Prazo de conservação dos pedidos que não dão origem a contrato',
    bloqueia: 'sim',
    bloqueiaTexto: 'Sim',
  },
  {
    chave: 'fornecedores-dados',
    ondeAparece: 'Política de privacidade',
    ficheiroCampo: 'src/content/company.ts → legal.processors',
    oQueFornecer: 'Serviço de formulários e serviço de e-mail usados (subcontratantes)',
    bloqueia: 'sim',
    bloqueiaTexto: 'Sim',
  },
  {
    chave: 'data-politicas',
    ondeAparece: 'Páginas legais',
    ficheiroCampo: 'src/content/company.ts → legal.policiesUpdatedAt',
    oQueFornecer: 'Data da última revisão das políticas',
    bloqueia: 'sim',
    bloqueiaTexto: 'Sim',
  },
  {
    chave: 'capital-realizado-proprio',
    ondeAparece: 'Informação legal (só Lda. e S.A.)',
    ficheiroCampo: 'src/content/company.ts → legal.paidUpCapital, legal.equityNote',
    oQueFornecer:
      'Capital realizado, se diferente do capital social; capital próprio, se for igual ou inferior a metade do capital social',
    bloqueia: 'se-aplicavel',
    bloqueiaTexto: 'Sim, se aplicável',
  },
  {
    chave: 'epd',
    ondeAparece: 'Política de privacidade',
    ficheiroCampo: 'src/content/company.ts → legal.dpo',
    oQueFornecer:
      'Encarregado de proteção de dados e contacto, ou confirmação de que não foi designado',
    bloqueia: 'sim',
    bloqueiaTexto: 'Sim',
  },
  {
    chave: 'validade-orcamento',
    ondeAparece: 'Termos e condições',
    ficheiroCampo: 'src/content/company.ts → legal.quoteValidity',
    oQueFornecer: 'Validade habitual dos orçamentos',
    bloqueia: 'nao',
    bloqueiaTexto: 'Não',
  },
  {
    chave: 'garantia-comercial',
    ondeAparece: 'Termos e condições',
    ficheiroCampo: 'src/content/company.ts → legal.commercialWarranty',
    oQueFornecer: 'Existe garantia comercial? Com que condições escritas?',
    bloqueia: 'nao',
    bloqueiaTexto: 'Não',
  },
  {
    chave: 'experiencia',
    ondeAparece: 'Hero, Sobre, SEO',
    ficheiroCampo: 'src/content/company.ts → experienceYears',
    oQueFornecer:
      'Base da alegação “mais de 30 anos” (percurso dos profissionais; ou data de constituição, se a empresa quiser dizer que existe há mais de 30 anos). A experiência de mais de 30 anos é de cada profissional ou do conjunto? (até lá, o site não diz que é de cada um)',
    bloqueia: 'nao',
    bloqueiaTexto: 'Não',
  },
  {
    chave: 'condicoes-orcamento',
    ondeAparece: 'Contactos, CTA, Termos',
    ficheiroCampo: 'src/content/company.ts → quoteTerms',
    oQueFornecer:
      'O orçamento e a visita são gratuitos? Há algum prazo de resposta que a empresa queira assumir? (até lá, nada disto aparece no site)',
    bloqueia: 'nao',
    bloqueiaTexto: 'Não',
  },
  {
    chave: 'morada-publica',
    ondeAparece: 'JSON-LD, Contactos (opcional)',
    ficheiroCampo: 'src/content/company.ts → publicAddress',
    oQueFornecer: 'Morada que a empresa autoriza mostrar ao público (pode não existir)',
    bloqueia: 'nao',
    bloqueiaTexto: 'Não',
  },
  {
    chave: 'icone-livro-reclamacoes',
    ondeAparece: 'Rodapé, Contactos',
    ficheiroCampo: 'public/livro-reclamacoes.svg (ou .png) e src/content/company.ts → complaintsBookIcon',
    oQueFornecer:
      'Ícone oficial descarregado da plataforma do Livro de Reclamações, depois de registar a empresa',
    bloqueia: 'nao',
    bloqueiaTexto: 'Não (existe a ligação em texto)',
  },
  {
    chave: 'horario',
    ondeAparece: 'Contactos, rodapé',
    ficheiroCampo: 'src/content/company.ts → hours',
    oQueFornecer: 'Horário de atendimento',
    bloqueia: 'nao',
    bloqueiaTexto: 'Não',
  },
  {
    chave: 'redes-sociais',
    ondeAparece: 'Contactos, rodapé',
    ficheiroCampo: 'src/content/company.ts → social[]',
    oQueFornecer: 'Endereços das redes sociais (os ícones só aparecem quando houver URL)',
    bloqueia: 'nao',
    bloqueiaTexto: 'Não',
  },
  {
    chave: 'servicos',
    ondeAparece: 'Serviços',
    ficheiroCampo: 'src/content/services.ts → confirmado',
    oQueFornecer: 'Confirmar a lista de serviços com a empresa (nome e descrição de cada um)',
    bloqueia: 'nao',
    bloqueiaTexto: 'Não',
  },
  {
    chave: 'testemunhos',
    ondeAparece: 'Testemunhos',
    ficheiroCampo: 'src/content/testimonials.ts',
    oQueFornecer: 'Testemunhos reais, com autorização escrita',
    bloqueia: 'nao',
    bloqueiaTexto: 'Não',
  },
  {
    chave: 'projetos',
    ondeAparece: 'Projetos',
    ficheiroCampo: 'src/content/projects.ts',
    oQueFornecer:
      'Fotografias reais (antes e depois), nome, tipo de intervenção, localidade, descrição, autorização',
    bloqueia: 'nao',
    bloqueiaTexto: 'Não',
  },
  {
    chave: 'intervalos-orcamento',
    ondeAparece: 'Formulário',
    ficheiroCampo: 'src/content/contact.ts → budgetRanges',
    oQueFornecer: 'Rever os intervalos propostos',
    bloqueia: 'nao',
    bloqueiaTexto: 'Não',
  },
  {
    chave: 'endpoint-formulario',
    ondeAparece: 'Formulário',
    ficheiroCampo:
      'Variáveis do repositório (Repository variables) VITE_FORM_ENDPOINT, VITE_FORM_ACCEPTS_FILES e, se o serviço exigir, VITE_FORM_ACCESS_KEY',
    oQueFornecer:
      'Formward escolhido a 4 de outubro de 2026: falta o endereço de envio do formulário (https://forms.formward.eu/f/…) e VITE_FORM_ACCEPTS_FILES=true (README, secção 8); até lá, alternativa por e-mail',
    bloqueia: 'nao',
    bloqueiaTexto: 'Não',
  },
  {
    chave: 'logotipo',
    ondeAparece: 'Cabeçalho, rodapé, favicons',
    ficheiroCampo: 'assets-src/brand/',
    oQueFornecer: 'Só se o ficheiro fornecido for insuficiente (idealmente SVG)',
    bloqueia: 'nao',
    bloqueiaTexto: 'Não',
  },
  {
    chave: 'dominio',
    ondeAparece: 'SEO, publicação',
    ficheiroCampo: 'Definições do GitHub Pages (README, “Domínio próprio”)',
    oQueFornecer: 'Domínio próprio (opcional, mais tarde)',
    bloqueia: 'nao',
    bloqueiaTexto: 'Não',
  },
  {
    chave: 'fotografias-reais',
    ondeAparece: 'Hero, secções',
    ficheiroCampo: 'src/content/images.ts',
    oQueFornecer: 'Opcional: substituir imagens ilustrativas por fotografias reais de obras',
    bloqueia: 'nao',
    bloqueiaTexto: 'Não',
  },
] as const satisfies readonly RegistoPlaceholder[]

export type PlaceholderKey = (typeof REGISTO_PLACEHOLDERS)[number]['chave']
