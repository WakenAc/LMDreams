<!--
Sync Impact Report
- Version change: template baseline -> 1.0.0
- Modified principles:
  - Replaced generic scaffold with 11 constitutional principles specific to LMDreams
  - Added mandatory Spec Kit phase separation and governance rules
- Added sections:
  - Separacao obrigatoria entre as fases Spec Kit
  - Governacao
- Removed sections:
  - Generic constitutional placeholders
- Templates requiring updates:
  - Updated: .specify/templates/spec-template.md
  - Updated: .specify/templates/plan-template.md
  - Updated: .specify/templates/tasks-template.md
  - Pending: .specify/templates/commands/*.md (directory not present)
- Follow-up TODOs:
  - None
-->
# Constituicao do Projeto Website Institucional LMDreams

**Versao**: 1.0.0  
**Ratificada em**: 2026-07-13  
**Ultima alteracao**: 2026-07-13

## Contexto da Empresa

A LMDreams e uma empresa de construcao civil composta por profissionais com mais de
20 anos de experiencia no mercado.

A empresa pretende diferenciar-se atraves de:

- Qualidade elevada na execucao dos trabalhos.
- Transparencia durante todo o processo da obra.
- Comunicacao clara com o cliente.
- Profissionais especializados em cada area.
- Rejeicao do modelo comum em que uma unica pessoa executa todo o tipo de trabalhos sem verdadeira especializacao.
- Capacidade para responder as diferentes necessidades existentes numa obra atraves de profissionais dedicados a cada especialidade.

O website MUST transmitir profissionalismo, confianca, competencia, transparencia e
atencao ao detalhe, evitando exageros publicitarios e cliches genericos do setor da
construcao.

## Principio I - Propriedade, alojamento e independencia do projeto

1. O codigo-fonte completo, conteudos, configuracoes, imagens utilizadas, estilos,
   scripts e restantes ficheiros necessarios ao funcionamento do website MUST estar
   armazenados no repositorio GitHub principal controlado pelo proprietario do projeto.
2. O website MUST poder ser publicado e disponibilizado atraves de GitHub Pages a
   partir desse repositorio.
3. O website MUST NOT ser alojado, servido, publicado ou acedido atraves de um
   repositorio pertencente a Higgsfield.
4. A Higgsfield e o respetivo MCP MAY ser utilizados como ferramentas auxiliares de
   web design, geracao visual, pesquisa de estilos, prototipagem ou criacao de recursos.
5. Qualquer recurso produzido com ferramentas da Higgsfield que seja utilizado no
   website MUST:
   - Ser exportado para o repositorio principal do projeto.
   - Ficar sob controlo do proprietario do projeto.
   - Ser utilizavel sem depender do repositorio da Higgsfield.
   - Nao introduzir uma dependencia obrigatoria da Higgsfield durante a execucao do website.
   - Nao obrigar os visitantes a aceder a dominios ou paginas da Higgsfield.
6. O website publicado MUST continuar funcional mesmo que o acesso as ferramentas
   ou ao MCP da Higgsfield deixe de estar disponivel.
7. Qualquer dependencia externa necessaria em runtime MUST ser explicitamente
   identificada e tecnicamente justificada durante a fase de planeamento.

**Criterios verificaveis**:
- Todos os ficheiros de runtime do website estao versionados no repositorio principal.
- O deploy em GitHub Pages e reproduzivel sem acesso a repositorios Higgsfield.
- O website nao redireciona nem depende de paginas Higgsfield para funcionar.

## Principio II - Compatibilidade obrigatoria com GitHub Pages

1. Todas as decisoes arquiteturais MUST ser compativeis com alojamento atraves de
   GitHub Pages.
2. A solucao final MUST gerar ficheiros estaticos que possam ser publicados pelo
   GitHub Pages, incluindo HTML, CSS, JavaScript, imagens, fontes e restantes assets.
3. A implementacao MUST NOT depender de:
   - Um servidor proprio permanente.
   - Execucao server-side nao suportada pelo GitHub Pages.
   - Bases de dados alojadas dentro do GitHub Pages.
   - Segredos ou credenciais expostos no frontend.
   - Processos manuais realizados na Higgsfield para manter o website acessivel.
4. Quando uma funcionalidade exigir um servico externo, a necessidade desse servico
   MUST ser documentada no plano com:
   - A razao da utilizacao.
   - Os dados enviados.
   - Os riscos de privacidade.
   - O comportamento do website quando o servico estiver indisponivel.
   - Uma alternativa mais simples que tenha sido considerada.
5. O processo de build e publicacao MUST ser reproduzivel a partir do repositorio
   principal.

**Criterios verificaveis**:
- O projeto gera artefactos estaticos deployaveis em GitHub Pages.
- Nao existem componentes server-side obrigatorias para renderizacao principal.
- O plano documenta cada servico externo com justificacao e fallback.

## Principio III - Comunicacao verdadeira e transparente

1. Todo o conteudo apresentado no website MUST ser verdadeiro, verificavel e aprovado
   pelo responsavel da LMDreams antes da publicacao.
2. O website MUST NOT inventar ou assumir:
   - Projetos realizados.
   - Clientes.
   - Testemunhos.
   - Certificacoes.
   - Premios.
   - Parceiros.
   - Numeros de obras concluidas.
   - Areas de especializacao nao confirmadas.
   - Fotografias de trabalhos como sendo obras reais da empresa.
   - Garantias comerciais ou tecnicas nao confirmadas.
3. A referencia a profissionais com mais de 20 anos de experiencia MUST ser
   apresentada de forma fiel ao contexto fornecido, sem transformar essa informacao
   numa afirmacao diferente, como a idade da empresa, caso isso nao tenha sido confirmado.
4. Imagens geradas por inteligencia artificial, incluindo imagens criadas atraves da
   Higgsfield, MUST NOT ser apresentadas como fotografias de obras reais realizadas
   pela LMDreams.
5. Durante o desenvolvimento, imagens ficticias ou geradas MAY ser utilizadas como
   placeholders, mas MUST estar claramente identificadas como tal e MUST NOT ser
   publicadas como prova de trabalhos realizados.
6. O portefolio final SHOULD utilizar fotografias reais de projetos da LMDreams sempre
   que estas estejam disponiveis.

**Criterios verificaveis**:
- Existe evidencia de aprovacao do conteudo antes do publish.
- Nenhum texto ou media publica afirma factos nao validados.
- Placeholders estao marcados e removidos/substituidos antes de producao.

## Principio IV - Especializacao como elemento central da marca

1. A comunicacao e a estrutura do website MUST destacar que a LMDreams trabalha com
   profissionais especializados nas diferentes areas necessarias numa obra.
2. Esta mensagem MUST ser comunicada de forma clara, profissional e credivel, sem
   atacar concorrentes ou utilizar linguagem depreciativa.
3. O website SHOULD explicar que a especializacao permite:
   - Maior qualidade de execucao.
   - Maior responsabilizacao.
   - Melhor organizacao dos trabalhos.
   - Maior previsibilidade.
   - Comunicacao mais transparente com o cliente.
4. As paginas e seccoes criadas MUST manter coerencia com os valores centrais da
   empresa:
   - Qualidade.
   - Transparencia.
   - Especializacao.
   - Experiencia.
   - Confianca.
   - Rigor.
   - Cumprimento.
5. Qualquer frase promocional MUST ser especifica e credivel. Expressoes genericas
   como "somos os melhores", "qualidade incomparavel" ou "resultados garantidos"
   MUST NOT ser utilizadas sem evidencia concreta e aprovacao explicita.

**Criterios verificaveis**:
- A proposta de valor baseada em especializacao esta presente nas seccoes nucleares.
- Nao existe linguagem depreciativa ou afirmacoes promocionais sem suporte.

## Principio V - Experiencia do utilizador simples e orientada a confianca

1. O website MUST permitir que um visitante compreenda rapidamente:
   1. Quem e a LMDreams.
   2. Que servicos disponibiliza.
   3. O que diferencia a empresa.
   4. Como pode pedir informacoes ou solicitar um orcamento.
   5. Como pode contactar a empresa.
2. A navegacao MUST ser simples, previsivel e consistente.
3. O website MUST ser completamente utilizavel em dispositivos moveis, tablets e computadores.
4. O design MUST transmitir uma imagem moderna e cuidada, mas MUST NOT sacrificar
   clareza, desempenho ou facilidade de utilizacao em beneficio de efeitos visuais.
5. Animacoes e efeitos visuais:
   - MUST ter uma finalidade clara.
   - MUST NOT impedir a leitura ou navegacao.
   - MUST NOT atrasar desnecessariamente o carregamento.
   - MUST respeitar a preferencia `prefers-reduced-motion`.
   - MUST NOT criar uma aparencia excessivamente artificial ou desligada do setor da construcao.
6. Os principais pedidos de acao, como solicitar orcamento ou contactar a empresa,
   MUST ser facilmente identificaveis, mas MUST NOT recorrer a padroes manipuladores,
   mensagens falsas de urgencia ou elementos intrusivos.
7. Todo o conteudo publico MUST ser apresentado em portugues de Portugal, salvo
   decisao explicita para disponibilizar versoes adicionais.

**Criterios verificaveis**:
- Fluxos nucleares estao acessiveis em desktop e mobile.
- CTAs principais sao visiveis sem padroes dark.
- `prefers-reduced-motion` e respeitado.

## Principio VI - Acessibilidade como requisito funcional

1. A acessibilidade MUST ser tratada como um requisito funcional e nao como uma
   melhoria opcional.
2. O website MUST procurar conformidade com WCAG 2.2 nivel AA.
3. A implementacao MUST incluir, no minimo:
   - HTML semanticamente correto.
   - Estrutura de titulos logica.
   - Navegacao completa atraves de teclado.
   - Foco de teclado claramente visivel.
   - Contraste suficiente entre texto e fundo.
   - Texto alternativo adequado para imagens informativas.
   - Imagens decorativas ignoradas por tecnologias de apoio.
   - Labels associadas aos campos de formularios.
   - Mensagens de erro compreensiveis.
   - Links e botoes com nomes acessiveis.
   - Conteudo compreensivel sem depender exclusivamente de cor.
   - Suporte para ampliacao de texto sem perda de funcionalidade.
   - Respeito pelas preferencias de reducao de movimento.
4. As verificacoes de acessibilidade MUST fazer parte das tarefas e dos criterios
   de aceitacao.
5. Violacoes conhecidas de acessibilidade MUST ser corrigidas antes da publicacao ou
   documentadas como excecoes explicitas aprovadas pelo responsavel do projeto.

**Criterios verificaveis**:
- Existe checklist WCAG 2.2 AA minima em tarefas e validacao.
- Navegacao por teclado e foco visivel sao testados antes de publicar.

## Principio VII - Desempenho e eficiencia

1. O website MUST ser rapido e eficiente em redes moveis e equipamentos de desempenho
   intermedio.
2. A implementacao MUST:
   - Minimizar a quantidade de JavaScript enviado ao browser.
   - Evitar bibliotecas quando HTML, CSS ou JavaScript nativo forem suficientes.
   - Otimizar e redimensionar imagens para o contexto em que sao utilizadas.
   - Utilizar formatos modernos de imagem quando suportados e adequados.
   - Evitar imagens desnecessariamente grandes.
   - Carregar recursos nao criticos de forma diferida quando apropriado.
   - Evitar fontes, scripts e estilos externos desnecessarios.
   - Evitar codigo morto, dependencias nao utilizadas e assets duplicados.
   - Manter o conteudo principal utilizavel quando funcionalidades secundarias falharem.
3. O plano MUST definir criterios mensuraveis de desempenho e uma forma de os validar.
4. Qualquer dependencia com impacto significativo no tamanho, tempo de carregamento
   ou experiencia movel MUST ser justificada no plano.

**Criterios verificaveis**:
- O plano contem metas de desempenho mensuraveis e metodo de verificacao.
- Assets e dependencias nao usadas sao removidas antes de publicacao.

## Principio VIII - Simplicidade e manutenibilidade

1. A solucao MUST utilizar a arquitetura mais simples capaz de cumprir os requisitos aprovados.
2. O projeto MUST NOT introduzir frameworks, sistemas de gestao de conteudos, pipelines,
   abstracoes ou servicos externos sem uma necessidade concreta.
3. Cada nova dependencia MUST ter:
   - Uma finalidade identificavel.
   - Uma justificacao documentada.
   - Uma avaliacao de alternativas mais simples.
   - Compatibilidade com GitHub Pages.
   - Licenca adequada ao projeto.
4. A estrutura do projeto MUST ser clara e permitir que outro programador identifique facilmente:
   - Onde se encontram as paginas.
   - Onde se encontram os estilos.
   - Onde se encontram os scripts.
   - Onde se encontram as imagens.
   - Onde sao alterados os conteudos.
   - Como executar o projeto localmente.
   - Como publicar o website.
5. Estilos e componentes visuais repetidos SHOULD ser reutilizados de forma consistente.
6. A implementacao MUST evitar abstracoes prematuras, arquiteturas criadas para necessidades
   futuras nao especificadas e ficheiros gerados sem utilizacao real.
7. O README MUST documentar o processo de desenvolvimento local, validacao, build e
   publicacao atraves de GitHub Pages.

**Criterios verificaveis**:
- Cada dependencia tem justificacao documentada e compatibilidade GitHub Pages.
- O README cobre setup local, validacao e publicacao.

## Principio IX - SEO tecnico e estrutura de conteudo

1. Cada pagina publica MUST possuir:
   - Um titulo unico e descritivo.
   - Uma meta description adequada.
   - Um unico titulo principal H1.
   - Uma hierarquia de headings coerente.
   - Conteudo semanticamente estruturado.
   - URLs compreensiveis.
   - Informacao de idioma correta.
   - Metadados de partilha social quando aplicavel.
2. O website SHOULD incluir sitemap e configuracao adequada para motores de pesquisa.
3. Dados estruturados MAY ser utilizados apenas quando representarem informacao real e
   verificavel sobre a empresa.
4. O website MUST NOT utilizar keyword stuffing, paginas artificiais, texto escondido ou
   outras praticas manipuladoras de SEO.
5. A otimizacao para motores de pesquisa MUST preservar a qualidade e naturalidade do
   conteudo destinado as pessoas.

**Criterios verificaveis**:
- Cada pagina publica cumpre metadados essenciais e estrutura semantica.
- Nao existem praticas de SEO manipulador.

## Principio X - Privacidade, seguranca e dependencias externas

1. Segredos, passwords, tokens, chaves privadas e credenciais MUST NOT ser incluidos no
   repositorio ou no codigo executado no browser.
2. Dados pessoais MUST ser recolhidos apenas quando forem necessarios para uma
   funcionalidade aprovada.
3. Formularios MUST solicitar apenas os dados estritamente necessarios e MUST informar
   claramente o utilizador sobre a finalidade do contacto.
4. Ferramentas de analytics, tracking, cookies nao essenciais ou conteudos externos com
   capacidade de acompanhamento MUST NOT ser adicionados por defeito.
5. Caso sejam necessarios, a sua inclusao MUST ser documentada e implementada de acordo
   com os requisitos legais e de consentimento aplicaveis.
6. Scripts externos MUST ser minimizados e avaliados quanto a:
   - Privacidade.
   - Seguranca.
   - Desempenho.
   - Disponibilidade.
   - Necessidade real.
7. Todos os links externos abertos num novo separador MUST utilizar as protecoes de
   seguranca adequadas.
8. O website MUST continuar a apresentar a informacao principal e os contactos quando um
   servico externo estiver indisponivel.

**Criterios verificaveis**:
- Nao ha segredos no repositorio nem no frontend.
- Dependencias externas tem avaliacao e justificacao documentadas.
- Fluxo de contacto e informacao principal funciona sem servicos secundarios.

## Principio XI - Validacao antes da publicacao

1. Nenhuma versao do website MUST ser considerada pronta para publicacao sem validar:
   - Funcionamento em dispositivos moveis e desktop.
   - Navegacao atraves de teclado.
   - Contraste e acessibilidade basica.
   - Ausencia de links quebrados.
   - Ausencia de imagens em falta.
   - Ausencia de erros relevantes na consola do browser.
   - Funcionamento dos contactos e formularios.
   - Compatibilidade com GitHub Pages.
   - Correcao dos caminhos de assets.
   - Existencia de titulos e metadados essenciais.
   - Desempenho aceitavel.
   - Ausencia de segredos no repositorio.
   - Ausencia de conteudo ficticio apresentado como real.
   - Ausencia de dependencias runtime obrigatorias da Higgsfield.
2. Os criterios de aceitacao MUST incluir cenarios executaveis que comprovem o
   funcionamento end-to-end do website publicado.
3. O processo de deployment MUST ser testado atraves do repositorio principal antes de a
   implementacao ser considerada concluida.

**Criterios verificaveis**:
- Existe checklist de pre-publicacao com evidencias de execucao.
- E2E publicado e validado no ambiente de GitHub Pages.

## Separacao obrigatoria entre as fases Spec Kit

1. A constituicao MUST conter apenas principios duradouros, regras nao negociaveis e
   governacao do projeto.
2. A fase `specify` MUST definir o que o website deve fazer, para quem existe, as
   historias de utilizador, os requisitos funcionais e os criterios de aceitacao, sem
   escolher prematuramente tecnologias.
3. A fase `plan` MUST definir as decisoes tecnicas, arquitetura, estrutura do projeto,
   processo de GitHub Pages, utilizacao de ferramentas MCP, estrategia de testes e
   criterios tecnicos.
4. A fase `tasks` MUST transformar o plano em tarefas pequenas, executaveis, ordenadas e
   associadas a ficheiros concretos.
5. A fase `implement` MUST executar apenas tarefas aprovadas e MUST NOT alterar
   silenciosamente os requisitos, o plano ou a constituicao.
6. Nenhuma fase MUST antecipar ou executar trabalho pertencente a uma fase posterior.

**Criterios verificaveis**:
- Cada artefacto de fase contem apenas o seu dominio proprio.
- Alteracoes de requisitos/plano/constituicao sao rastreadas e aprovadas explicitamente.

## Governacao

1. Esta constituicao tem precedencia sobre especificacoes, planos, tarefas, sugestoes de
   ferramentas MCP, codigo gerado e decisoes de implementacao.
2. Qualquer conflito entre um artefacto do projeto e esta constituicao MUST ser resolvido
   em favor da constituicao.
3. Todas as especificacoes e planos MUST incluir uma verificacao explicita de
   conformidade constitucional.
4. Uma decisao que viole um principio MUST:
   1. Ser claramente identificada.
   2. Explicar a razao da violacao.
   3. Demonstrar por que nao existe uma alternativa conforme.
   4. Descrever os riscos e impactos.
   5. Receber aprovacao explicita do responsavel do projeto antes da implementacao.
5. Alteracoes a constituicao MUST:
   - Ser intencionais e documentadas.
   - Explicar a razao da alteracao.
   - Identificar os principios afetados.
   - Atualizar a versao atraves de semantic versioning.
   - Atualizar a data da ultima alteracao.
   - Avaliar o impacto nos templates, especificacoes, planos e tarefas existentes.

**Criterios verificaveis**:
- Especificacoes e planos incluem secao de conformidade constitucional.
- Excecoes estao documentadas com justificacao e aprovacao explicita.
