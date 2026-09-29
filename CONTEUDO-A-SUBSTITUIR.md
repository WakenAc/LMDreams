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

- Pendentes: 16, em 2 chaves
- Bloqueiam a publicação: 0, em 0 chaves
- Outros pendentes: 16, em 2 chaves
- Chaves do registo sem ocorrências (só informação): 27
- Erros de estrutura: 0
- Forma jurídica considerada: sociedade (`legalForm` em `src/content/company.ts`). As chaves "Sim, se for sociedade" e "Sim, se aplicável" só bloqueiam quando a forma jurídica é sociedade.

## Bloqueia publicação

Nenhum pendente bloqueia a publicação.

## Outros pendentes

### `icone-livro-reclamacoes` (1)

- Onde aparece: Rodapé, Contactos
- Ficheiro e campo: public/livro-reclamacoes.svg (ou .png) e src/content/company.ts → complaintsBookIcon
- O que fornecer: Ícone oficial descarregado da plataforma do Livro de Reclamações, depois de registar a empresa
- Bloqueia publicação: Não (existe a ligação em texto)
- Ocorrências:
  - `src/content/company.ts:76`, campo `complaintsBookIcon`: ícone oficial do Livro de Reclamações Eletrónico

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

## Chaves do registo sem ocorrências

Só para informação: estas chaves não têm pendentes no código. É normal, porque são dados já preenchidos, opcionais ou tratados fora do código.

- `forma-juridica`: Sociedade (e tipo: Lda., Unipessoal Lda., S.A.) ou empresário em nome individual
  - Onde aparece: Informação legal
  - Ficheiro e campo: src/content/company.ts → legal.form, legal.companyType
- `denominacao-social`: Firma (ou nome civil, se for empresário em nome individual). Depois de a confirmar, decidir se o aviso de direitos de autor do rodapé passa a nomear a firma (hoje nomeia só a marca: “© [ano] LMDreams. Todos os direitos reservados.”, como pede a Parte 5.4 do brief)
  - Onde aparece: Informação legal, políticas
  - Ficheiro e campo: src/content/company.ts → legal.name
- `nipc`: NIPC ou NIF
  - Onde aparece: Informação legal, políticas
  - Ficheiro e campo: src/content/company.ts → legal.nipc
- `sede`: Morada da sede (uso legal, não comercial)
  - Onde aparece: Informação legal, Política de privacidade
  - Ficheiro e campo: src/content/company.ts → legal.address
- `titulo-impic`: Tipo (alvará ou certificado de empreiteiro) e número; classes e categorias opcionais
  - Onde aparece: Informação legal, Sobre
  - Ficheiro e campo: src/content/company.ts → legal.license
- `ral`: Entidade(s) de resolução alternativa de litígios a que a empresa aderiu ou que são competentes, com o site (o CNIACC já consta como entidade de competência genérica)
  - Onde aparece: Informação legal, Termos
  - Ficheiro e campo: src/content/company.ts → legal.ral
- `registo-comercial`: Conservatória e capital social
  - Onde aparece: Informação legal (só se for sociedade)
  - Ficheiro e campo: src/content/company.ts → legal.registry, legal.shareCapital
- `responsavel-dados`: Contacto para questões de dados pessoais
  - Onde aparece: Política de privacidade
  - Ficheiro e campo: src/content/company.ts → legal.dataController
- `prazo-conservacao`: Prazo de conservação dos pedidos que não dão origem a contrato
  - Onde aparece: Política de privacidade
  - Ficheiro e campo: src/content/company.ts → legal.dataRetention
- `fornecedores-dados`: Serviço de formulários e serviço de e-mail usados (subcontratantes)
  - Onde aparece: Política de privacidade
  - Ficheiro e campo: src/content/company.ts → legal.processors
- `data-politicas`: Data da última revisão das políticas
  - Onde aparece: Páginas legais
  - Ficheiro e campo: src/content/company.ts → legal.policiesUpdatedAt
- `capital-realizado-proprio`: Capital realizado, se diferente do capital social; capital próprio, se for igual ou inferior a metade do capital social
  - Onde aparece: Informação legal (só Lda. e S.A.)
  - Ficheiro e campo: src/content/company.ts → legal.paidUpCapital, legal.equityNote
- `epd`: Encarregado de proteção de dados e contacto, ou confirmação de que não foi designado
  - Onde aparece: Política de privacidade
  - Ficheiro e campo: src/content/company.ts → legal.dpo
- `validade-orcamento`: Validade habitual dos orçamentos
  - Onde aparece: Termos e condições
  - Ficheiro e campo: src/content/company.ts → legal.quoteValidity
- `garantia-comercial`: Existe garantia comercial? Com que condições escritas?
  - Onde aparece: Termos e condições
  - Ficheiro e campo: src/content/company.ts → legal.commercialWarranty
- `experiencia`: Base da alegação “mais de 30 anos” (percurso dos profissionais; ou data de constituição, se a empresa quiser dizer que existe há mais de 30 anos). A experiência de mais de 30 anos é de cada profissional ou do conjunto? (até lá, o site não diz que é de cada um)
  - Onde aparece: Hero, Sobre, SEO
  - Ficheiro e campo: src/content/company.ts → experienceYears
- `condicoes-orcamento`: O orçamento e a visita são gratuitos? Há algum prazo de resposta que a empresa queira assumir? (até lá, nada disto aparece no site)
  - Onde aparece: Contactos, CTA, Termos
  - Ficheiro e campo: src/content/company.ts → quoteTerms
- `morada-publica`: Morada que a empresa autoriza mostrar ao público (pode não existir)
  - Onde aparece: JSON-LD, Contactos (opcional)
  - Ficheiro e campo: src/content/company.ts → publicAddress
- `horario`: Horário de atendimento
  - Onde aparece: Contactos, rodapé
  - Ficheiro e campo: src/content/company.ts → hours
- `redes-sociais`: Endereços das redes sociais (os ícones só aparecem quando houver URL)
  - Onde aparece: Contactos, rodapé
  - Ficheiro e campo: src/content/company.ts → social[]
- `servicos`: Confirmar a lista de serviços com a empresa (nome e descrição de cada um)
  - Onde aparece: Serviços
  - Ficheiro e campo: src/content/services.ts → confirmado
- `projetos`: Fotografias reais (antes e depois), nome, tipo de intervenção, localidade, descrição, autorização
  - Onde aparece: Projetos
  - Ficheiro e campo: src/content/projects.ts
- `intervalos-orcamento`: Rever os intervalos propostos
  - Onde aparece: Formulário
  - Ficheiro e campo: src/content/contact.ts → budgetRanges
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
