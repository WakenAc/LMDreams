# Conteúdo a substituir

> Ficheiro gerado por `npm run check:placeholders`. Não o edite à mão: é reescrito em cada execução, a partir de `src/` e do registo `src/content/placeholders-registo.ts` (Anexo B do brief).

Lista os dados que ainda faltam no site: os placeholders criados com `PH(chave, descrição)`, que o site mostra como `[A CONFIRMAR: descrição]`, os testemunhos e projetos provisórios (`placeholder: true`) e os serviços e intervalos de orçamento por confirmar (`confirmado: false`).

## Como substituir

1. Abra o ficheiro indicado em cada ocorrência (`ficheiro:linha`) e encontre o campo.
2. Troque a chamada `PH('chave', 'descrição')` pelo valor real, entre aspas: por exemplo, `name: PH('denominacao-social', 'denominação social')` passa a `name: 'Denominação real'`.
3. Um campo que a empresa confirme não se aplicar (por exemplo, o capital realizado ou o capital próprio) passa a `null` e deixa de ser pendente.
4. Testemunhos e projetos provisórios: substitua os dados pelos reais e mude `placeholder: true` para `placeholder: false`. Serviços e intervalos de orçamento: depois de a empresa validar o texto, mude `confirmado: false` para `confirmado: true`.
5. Corra `npm run check:placeholders` para atualizar este ficheiro. A publicação usa `npm run check:placeholders -- --strict`, que falha enquanto houver pendentes em "Bloqueia publicação".

## Resumo

- Pendentes: 90, em 22 chaves
- Bloqueiam a publicação: 18, em 13 chaves
- Outros pendentes: 72, em 9 chaves
- Chaves do registo sem ocorrências (só informação): 7
- Erros de estrutura: 0
- Forma jurídica considerada: sociedade (`legalForm` em `src/content/company.ts`). As chaves "Sim, se for sociedade" e "Sim, se aplicável" só bloqueiam quando a forma jurídica é sociedade.

## Bloqueia publicação

### `forma-juridica` (1)

- Onde aparece: Informação legal
- Ficheiro e campo: src/content/company.ts → legal.form, legal.companyType
- O que fornecer: Sociedade (e tipo: Lda., Unipessoal Lda., S.A.) ou empresário em nome individual
- Bloqueia publicação: Sim (a forma jurídica atual é sociedade, por isso bloqueia)
- Ocorrências:
  - `src/content/company.ts:77`, campo `legal.companyType`: tipo de sociedade (Lda., Unipessoal Lda. ou S.A.)

### `denominacao-social` (1)

- Onde aparece: Informação legal, políticas
- Ficheiro e campo: src/content/company.ts → legal.name
- O que fornecer: Firma (ou nome civil, se for empresário em nome individual). Depois de a confirmar, decidir se o aviso de direitos de autor do rodapé passa a nomear a firma (hoje nomeia só a marca: “© [ano] LMDreams. Todos os direitos reservados.”, como pede a Parte 5.4 do brief)
- Bloqueia publicação: Sim
- Ocorrências:
  - `src/content/company.ts:81`, campo `legal.name`: denominação social

### `nipc` (1)

- Onde aparece: Informação legal, políticas
- Ficheiro e campo: src/content/company.ts → legal.nipc
- O que fornecer: NIPC ou NIF
- Bloqueia publicação: Sim
- Ocorrências:
  - `src/content/company.ts:83`, campo `legal.nipc`: NIPC

### `sede` (1)

- Onde aparece: Informação legal, Política de privacidade
- Ficheiro e campo: src/content/company.ts → legal.address
- O que fornecer: Morada da sede (uso legal, não comercial)
- Bloqueia publicação: Sim
- Ocorrências:
  - `src/content/company.ts:85`, campo `legal.address`: morada da sede

### `titulo-impic` (2)

- Onde aparece: Informação legal, Sobre
- Ficheiro e campo: src/content/company.ts → legal.license
- O que fornecer: Tipo (alvará ou certificado de empreiteiro) e número; classes e categorias opcionais
- Bloqueia publicação: Sim
- Ocorrências:
  - `src/content/company.ts:98`, campo `legal.license.type`: alvará ou certificado
  - `src/content/company.ts:99`, campo `legal.license.number`: número

### `ral` (2)

- Onde aparece: Informação legal, Termos
- Ficheiro e campo: src/content/company.ts → legal.ral
- O que fornecer: Entidade(s) de resolução alternativa de litígios a que a empresa aderiu ou que são competentes, com o site (o CNIACC já consta como entidade de competência genérica)
- Bloqueia publicação: Sim
- Ocorrências:
  - `src/content/company.ts:102`, campo `legal.ral`: centros de arbitragem de conflitos de consumo competentes em Portugal continental, com os sites
  - `src/content/company.ts:106`, campo `legal.ralMembership`: entidade RAL a que a empresa aderiu, se houver, com o site

### `registo-comercial` (2)

- Onde aparece: Informação legal (só se for sociedade)
- Ficheiro e campo: src/content/company.ts → legal.registry, legal.shareCapital
- O que fornecer: Conservatória e capital social
- Bloqueia publicação: Sim, se for sociedade (a forma jurídica atual é sociedade, por isso bloqueia)
- Ocorrências:
  - `src/content/company.ts:86`, campo `legal.registry`: conservatória
  - `src/content/company.ts:87`, campo `legal.shareCapital`: capital social

### `responsavel-dados` (1)

- Onde aparece: Política de privacidade
- Ficheiro e campo: src/content/company.ts → legal.dataController
- O que fornecer: Contacto para questões de dados pessoais
- Bloqueia publicação: Sim
- Ocorrências:
  - `src/content/company.ts:109`, campo `legal.dataController`: e-mail para dados pessoais

### `prazo-conservacao` (1)

- Onde aparece: Política de privacidade
- Ficheiro e campo: src/content/company.ts → legal.dataRetention
- O que fornecer: Prazo de conservação dos pedidos que não dão origem a contrato
- Bloqueia publicação: Sim
- Ocorrências:
  - `src/content/company.ts:110`, campo `legal.dataRetention`: prazo de conservação

### `fornecedores-dados` (2)

- Onde aparece: Política de privacidade
- Ficheiro e campo: src/content/company.ts → legal.processors
- O que fornecer: Serviço de formulários e serviço de e-mail usados (subcontratantes)
- Bloqueia publicação: Sim
- Ocorrências:
  - `src/content/company.ts:111`, campo `legal.processors`: serviços de formulários e de e-mail
  - `src/content/company.ts:113`, campo `legal.formService`: serviço de formulários

### `data-politicas` (1)

- Onde aparece: Páginas legais
- Ficheiro e campo: src/content/company.ts → legal.policiesUpdatedAt
- O que fornecer: Data da última revisão das políticas
- Bloqueia publicação: Sim
- Ocorrências:
  - `src/content/company.ts:114`, campo `legal.policiesUpdatedAt`: data da última atualização

### `capital-realizado-proprio` (2)

- Onde aparece: Informação legal (só Lda. e S.A.)
- Ficheiro e campo: src/content/company.ts → legal.paidUpCapital, legal.equityNote
- O que fornecer: Capital realizado, se diferente do capital social; capital próprio, se for igual ou inferior a metade do capital social
- Bloqueia publicação: Sim, se aplicável (a forma jurídica atual é sociedade, por isso bloqueia)
- Ocorrências:
  - `src/content/company.ts:89`, campo `legal.paidUpCapital`: capital realizado, se for diferente do capital social
  - `src/content/company.ts:93`, campo `legal.equityNote`: capital próprio, se for igual ou inferior a metade do capital social

### `epd` (1)

- Onde aparece: Política de privacidade
- Ficheiro e campo: src/content/company.ts → legal.dpo
- O que fornecer: Encarregado de proteção de dados e contacto, ou confirmação de que não foi designado
- Bloqueia publicação: Sim
- Ocorrências:
  - `src/content/company.ts:115`, campo `legal.dpo`: encarregado de proteção de dados ou confirmação de que não foi designado

## Outros pendentes

### `validade-orcamento` (1)

- Onde aparece: Termos e condições
- Ficheiro e campo: src/content/company.ts → legal.quoteValidity
- O que fornecer: Validade habitual dos orçamentos
- Bloqueia publicação: Não
- Ocorrências:
  - `src/content/company.ts:119`, campo `legal.quoteValidity`: validade dos orçamentos

### `garantia-comercial` (1)

- Onde aparece: Termos e condições
- Ficheiro e campo: src/content/company.ts → legal.commercialWarranty
- O que fornecer: Existe garantia comercial? Com que condições escritas?
- Bloqueia publicação: Não
- Ocorrências:
  - `src/content/company.ts:120`, campo `legal.commercialWarranty`: garantia comercial

### `icone-livro-reclamacoes` (1)

- Onde aparece: Rodapé, Contactos
- Ficheiro e campo: public/livro-reclamacoes.svg (ou .png) e src/content/company.ts → complaintsBookIcon
- O que fornecer: Ícone oficial descarregado da plataforma do Livro de Reclamações, depois de registar a empresa
- Bloqueia publicação: Não (existe a ligação em texto)
- Ocorrências:
  - `src/content/company.ts:70`, campo `complaintsBookIcon`: ícone oficial do Livro de Reclamações Eletrónico

### `horario` (1)

- Onde aparece: Contactos, rodapé
- Ficheiro e campo: src/content/company.ts → hours
- O que fornecer: Horário de atendimento
- Bloqueia publicação: Não
- Ocorrências:
  - `src/content/company.ts:53`, campo `hours`: horário de atendimento

### `redes-sociais` (1)

- Onde aparece: Contactos, rodapé
- Ficheiro e campo: src/content/company.ts → social[]
- O que fornecer: Endereços das redes sociais (os ícones só aparecem quando houver URL)
- Bloqueia publicação: Não
- Ocorrências:
  - `src/content/company.ts:58`, campo `socialPending`: redes sociais

### `servicos` (16)

- Onde aparece: Serviços
- Ficheiro e campo: src/content/services.ts → confirmado
- O que fornecer: Confirmar a lista de serviços com a empresa (nome e descrição de cada um)
- Bloqueia publicação: Não
- Ocorrências:
  - `src/content/services.ts:26`, campo `services[0].confirmado`: Serviço "Construção civil" por confirmar; descrição proposta: "Construção e ampliação de edifícios, com cada fase entregue à equipa da especialidade."
  - `src/content/services.ts:35`, campo `services[1].confirmado`: Serviço "Remodelação de cozinhas" por confirmar; descrição proposta: "Canalização, eletricidade, revestimentos e montagem, cada trabalho feito por quem o domina."
  - `src/content/services.ts:44`, campo `services[2].confirmado`: Serviço "Remodelação de casas de banho" por confirmar; descrição proposta: "Loiças sanitárias, canalização, impermeabilização e revestimentos, numa sequência de trabalhos planeada."
  - `src/content/services.ts:52`, campo `services[3].confirmado`: Serviço "Aplicação de pavimentos e revestimentos" por confirmar; descrição proposta: "Cerâmica, pedra, madeira e vinílico, aplicados sobre bases bem preparadas e niveladas."
  - `src/content/services.ts:61`, campo `services[4].confirmado`: Serviço "Recuperação de imóveis" por confirmar; descrição proposta: "Reabilitação de edifícios antigos, preservando o que tem valor e corrigindo o que já não serve."
  - `src/content/services.ts:69`, campo `services[5].confirmado`: Serviço "Trabalhos exteriores" por confirmar; descrição proposta: "Muros, pavimentos exteriores, terraços e arranjos de logradouros."
  - `src/content/services.ts:80`, campo `services[6].confirmado`: Serviço "Remodelações completas" por confirmar; descrição proposta: "Remodelação integral de casas e espaços comerciais, com todas as especialidades coordenadas por nós."
  - `src/content/services.ts:88`, campo `services[7].confirmado`: Serviço "Canalização" por confirmar; descrição proposta: "Redes de águas e esgotos, substituição de tubagens e reparação de fugas por canalizadores experientes."
  - `src/content/services.ts:96`, campo `services[8].confirmado`: Serviço "Eletricidade" por confirmar; descrição proposta: "Instalações elétricas novas e remodelação de quadros e circuitos, executadas por eletricistas."
  - `src/content/services.ts:104`, campo `services[9].confirmado`: Serviço "Pintura" por confirmar; descrição proposta: "Pintura de interiores e exteriores, com as superfícies bem preparadas antes da primeira demão."
  - `src/content/services.ts:111`, campo `services[10].confirmado`: Serviço "Carpintaria" por confirmar; descrição proposta: "Portas, roupeiros, rodapés e outros trabalhos em madeira, ajustados ao espaço."
  - `src/content/services.ts:119`, campo `services[11].confirmado`: Serviço "Tetos falsos e divisórias" por confirmar; descrição proposta: "Tetos falsos e paredes em gesso cartonado, com isolamento e iluminação integrados quando fizer sentido."
  - `src/content/services.ts:127`, campo `services[12].confirmado`: Serviço "Isolamentos" por confirmar; descrição proposta: "Isolamento térmico e acústico de paredes, coberturas e pavimentos, incluindo capoto (isolamento pelo exterior)."
  - `src/content/services.ts:135`, campo `services[13].confirmado`: Serviço "Impermeabilizações" por confirmar; descrição proposta: "Impermeabilização de coberturas, terraços, varandas e zonas húmidas, para tratar as infiltrações na origem."
  - `src/content/services.ts:142`, campo `services[14].confirmado`: Serviço "Reparações e manutenção" por confirmar; descrição proposta: "Reparações pontuais e manutenção de habitações, condomínios e espaços comerciais."
  - `src/content/services.ts:151`, campo `services[15].confirmado`: Serviço "Preparação e coordenação de obra" por confirmar; descrição proposta: "Planeamento, sequência dos trabalhos e coordenação das várias especialidades ao longo da obra."

### `testemunhos` (15)

- Onde aparece: Testemunhos
- Ficheiro e campo: src/content/testimonials.ts
- O que fornecer: Testemunhos reais, com autorização escrita
- Bloqueia publicação: Não
- Ocorrências:
  - `src/content/testimonials.ts:24`, campo `testimonials[0].placeholder`: Testemunho provisório "testemunho-1"
  - `src/content/testimonials.ts:25`, campo `testimonials[0].texto`: texto do testemunho, com autorização escrita do cliente
  - `src/content/testimonials.ts:26`, campo `testimonials[0].nome`: nome do cliente, com autorização
  - `src/content/testimonials.ts:27`, campo `testimonials[0].localidade`: localidade
  - `src/content/testimonials.ts:28`, campo `testimonials[0].tipoDeObra`: tipo de obra
  - `src/content/testimonials.ts:32`, campo `testimonials[1].placeholder`: Testemunho provisório "testemunho-2"
  - `src/content/testimonials.ts:33`, campo `testimonials[1].texto`: texto do testemunho, com autorização escrita do cliente
  - `src/content/testimonials.ts:34`, campo `testimonials[1].nome`: nome do cliente, com autorização
  - `src/content/testimonials.ts:35`, campo `testimonials[1].localidade`: localidade
  - `src/content/testimonials.ts:36`, campo `testimonials[1].tipoDeObra`: tipo de obra
  - `src/content/testimonials.ts:40`, campo `testimonials[2].placeholder`: Testemunho provisório "testemunho-3"
  - `src/content/testimonials.ts:41`, campo `testimonials[2].texto`: texto do testemunho, com autorização escrita do cliente
  - `src/content/testimonials.ts:42`, campo `testimonials[2].nome`: nome do cliente, com autorização
  - `src/content/testimonials.ts:43`, campo `testimonials[2].localidade`: localidade
  - `src/content/testimonials.ts:44`, campo `testimonials[2].tipoDeObra`: tipo de obra

### `projetos` (35)

- Onde aparece: Projetos
- Ficheiro e campo: src/content/projects.ts
- O que fornecer: Fotografias reais (antes e depois), nome, tipo de intervenção, localidade, descrição, autorização
- Bloqueia publicação: Não
- Ocorrências:
  - `src/content/projects.ts:48`, campo `projects[0].nome`: nome de uma obra de remodelação
  - `src/content/projects.ts:50`, campo `projects[0].tipoDeIntervencao`: tipo de intervenção
  - `src/content/projects.ts:51`, campo `projects[0].localidade`: concelho ou localidade da obra
  - `src/content/projects.ts:52`, campo `projects[0].descricao`: breve descrição da obra e do que foi feito
  - `src/content/projects.ts:56`, campo `projects[0].placeholder`: Projeto provisório "projeto-remodelacoes"
  - `src/content/projects.ts:60`, campo `projects[1].nome`: nome de uma obra de cozinha
  - `src/content/projects.ts:62`, campo `projects[1].tipoDeIntervencao`: tipo de intervenção
  - `src/content/projects.ts:63`, campo `projects[1].localidade`: concelho ou localidade da obra
  - `src/content/projects.ts:64`, campo `projects[1].descricao`: breve descrição da obra e do que foi feito
  - `src/content/projects.ts:68`, campo `projects[1].placeholder`: Projeto provisório "projeto-cozinhas"
  - `src/content/projects.ts:72`, campo `projects[2].nome`: nome de uma obra de casa de banho
  - `src/content/projects.ts:74`, campo `projects[2].tipoDeIntervencao`: tipo de intervenção
  - `src/content/projects.ts:75`, campo `projects[2].localidade`: concelho ou localidade da obra
  - `src/content/projects.ts:76`, campo `projects[2].descricao`: breve descrição da obra e do que foi feito
  - `src/content/projects.ts:80`, campo `projects[2].placeholder`: Projeto provisório "projeto-casas-de-banho"
  - `src/content/projects.ts:84`, campo `projects[3].nome`: nome de uma obra de interiores
  - `src/content/projects.ts:86`, campo `projects[3].tipoDeIntervencao`: tipo de intervenção
  - `src/content/projects.ts:87`, campo `projects[3].localidade`: concelho ou localidade da obra
  - `src/content/projects.ts:88`, campo `projects[3].descricao`: breve descrição da obra e do que foi feito
  - `src/content/projects.ts:92`, campo `projects[3].placeholder`: Projeto provisório "projeto-interiores"
  - `src/content/projects.ts:96`, campo `projects[4].nome`: nome de uma obra de exteriores
  - `src/content/projects.ts:98`, campo `projects[4].tipoDeIntervencao`: tipo de intervenção
  - `src/content/projects.ts:99`, campo `projects[4].localidade`: concelho ou localidade da obra
  - `src/content/projects.ts:100`, campo `projects[4].descricao`: breve descrição da obra e do que foi feito
  - `src/content/projects.ts:104`, campo `projects[4].placeholder`: Projeto provisório "projeto-exteriores"
  - `src/content/projects.ts:108`, campo `projects[5].nome`: nome de uma obra de construção
  - `src/content/projects.ts:110`, campo `projects[5].tipoDeIntervencao`: tipo de intervenção
  - `src/content/projects.ts:111`, campo `projects[5].localidade`: concelho ou localidade da obra
  - `src/content/projects.ts:112`, campo `projects[5].descricao`: breve descrição da obra e do que foi feito
  - `src/content/projects.ts:116`, campo `projects[5].placeholder`: Projeto provisório "projeto-construcao"
  - `src/content/projects.ts:120`, campo `projects[6].nome`: nome de uma obra de recuperação de imóvel
  - `src/content/projects.ts:122`, campo `projects[6].tipoDeIntervencao`: tipo de intervenção
  - `src/content/projects.ts:123`, campo `projects[6].localidade`: concelho ou localidade da obra
  - `src/content/projects.ts:124`, campo `projects[6].descricao`: breve descrição da obra e do que foi feito
  - `src/content/projects.ts:128`, campo `projects[6].placeholder`: Projeto provisório "projeto-recuperacao"

### `intervalos-orcamento` (1)

- Onde aparece: Formulário
- Ficheiro e campo: src/content/contact.ts → budgetRanges
- O que fornecer: Rever os intervalos propostos
- Bloqueia publicação: Não
- Ocorrências:
  - `src/content/contact.ts:131`, campo `budgetRanges.confirmado`: Intervalos propostos: "Até 10 000 €"; "10 000 € a 25 000 €"; "25 000 € a 50 000 €"; "50 000 € a 100 000 €"; "100 000 € a 250 000 €"; "Mais de 250 000 €"; "Prefiro não indicar"

## Chaves do registo sem ocorrências

Só para informação: estas chaves não têm pendentes no código. É normal, porque são dados já preenchidos, opcionais ou tratados fora do código.

- `experiencia`: Base da alegação “mais de 30 anos” (percurso dos profissionais; ou data de constituição, se a empresa quiser dizer que existe há mais de 30 anos). A experiência de mais de 30 anos é de cada profissional ou do conjunto? (até lá, o site não diz que é de cada um)
  - Onde aparece: Hero, Sobre, SEO
  - Ficheiro e campo: src/content/company.ts → experienceYears
- `condicoes-orcamento`: O orçamento e a visita são gratuitos? Há algum prazo de resposta que a empresa queira assumir? (até lá, nada disto aparece no site)
  - Onde aparece: Contactos, CTA, Termos
  - Ficheiro e campo: src/content/company.ts → quoteTerms
- `morada-publica`: Morada que a empresa autoriza mostrar ao público (pode não existir)
  - Onde aparece: JSON-LD, Contactos (opcional)
  - Ficheiro e campo: src/content/company.ts → publicAddress
- `endpoint-formulario`: Serviço de formulários escolhido (até lá, alternativa por e-mail)
  - Onde aparece: Formulário
  - Ficheiro e campo: Variáveis do repositório (Repository variables) VITE_FORM_ENDPOINT, VITE_FORM_ACCEPTS_FILES e, se o serviço exigir, VITE_FORM_ACCESS_KEY
- `logotipo`: Só se o ficheiro fornecido for insuficiente (idealmente SVG)
  - Onde aparece: Cabeçalho, rodapé, favicons
  - Ficheiro e campo: assets-src/brand/
- `dominio`: Domínio próprio (opcional, mais tarde)
  - Onde aparece: SEO, publicação
  - Ficheiro e campo: Definições do GitHub Pages (README, “Domínio próprio”)
- `fotografias-reais`: Opcional: substituir imagens ilustrativas por fotografias reais de obras
  - Onde aparece: Hero, secções
  - Ficheiro e campo: src/content/images.ts

## Dados já preenchidos que podem mudar

Estes dados já estão no site. Se mudarem, altere-os no ficheiro e no campo indicados.

- Telefone: "+351 919 233 372", em `src/content/company.ts` → `phone`; `display`, `href` e `e164` mudam em conjunto.
- WhatsApp: "+351 919 233 372", em `src/content/company.ts` → `whatsapp`; número (`number`) e mensagem inicial (`message`).
- E-mail: "mendes3pm@gmail.com", em `src/content/company.ts` → `email`.
- Área de atuação: "Portugal continental", em `src/content/company.ts` → `areaServed`.
- Experiência: "mais de 30 anos", em `src/content/company.ts` → `experienceYears`; experiência dos profissionais (nunca a idade da empresa), da qual deriva o texto `experienceText` (ver a chave `experiencia`).
- Tipo de chamada: "chamada para a rede móvel nacional", em `src/content/company.ts` → `phoneCallNote`; acompanha cada ocorrência visível do número e tem de ser ajustado se o número passar a uma rede fixa.

## Para o jurista

As páginas legais (Política de privacidade, Política de cookies e Termos e condições) e o bloco "Informação legal" do rodapé são **minutas**: têm de ser validadas por um jurista ou por um contabilista antes da publicação. Seguem a Parte 5.6 do brief, com placeholders onde faltam dados, e não substituem aconselhamento jurídico.

### Pontos que a pesquisa não confirmou

A pesquisa de referência foi feita a 24 de setembro de 2026. Falta confirmar:

- As alterações de 2025 e 2026 ao DL n.º 156/2005 (Livro de Reclamações): DL n.º 103/2025, Lei n.º 69/2025 e DL n.º 102/2026.
- O DL n.º 59/2021, quanto à indicação do tipo de chamada junto ao número de telefone.
- A redação atual do art. 18.º da Lei n.º 144/2015 (informação sobre a resolução alternativa de litígios).
- O art. 50.º do Regulamento (UE) 2024/1689 (Regulamento da IA), depois do Regulamento (UE) 2026/1744, quanto à legenda das imagens geradas por IA.
- A transposição da Diretiva (UE) 2024/825 (alegações ambientais e práticas comerciais).

### E-mail de contacto

O e-mail de contacto (mendes3pm@gmail.com) é uma conta Gmail pessoal. Para tratar pedidos de clientes, convém um e-mail profissional com contrato de subcontratação (RGPD, art. 28.º). A decisão é da empresa: os contactos do site só mudam com essa decisão.

### A fazer fora do código

- Registar a empresa no Livro de Reclamações Eletrónico (https://www.livroreclamacoes.pt/inicio) e descarregar o ícone oficial, sem o redesenhar, para `public/livro-reclamacoes.svg` (chave `icone-livro-reclamacoes`).
- Confirmar com a empresa a lista de serviços, com o nome e a descrição de cada um (`src/content/services.ts` → `confirmado`).
- Escolher o serviço de formulários e definir as Repository variables `VITE_FORM_ENDPOINT`, `VITE_FORM_ACCEPTS_FILES` e, se o serviço exigir, `VITE_FORM_ACCESS_KEY` (chave `endpoint-formulario`). Até lá, o formulário usa a alternativa por e-mail.
