# Especificação Funcional: Website Institucional LMDreams

**Versão**: 1.0.0  
**Data**: 2026-07-13  
**Governação**: `.specify/memory/constitution.md` v1.0.0

## Alinhamento com Constituição

Especificação alinha-se com 11 princípios da Constituição v1.0.0:

- **Princípio I** (Propriedade, alojamento, independência): GitHub Pages; sem Higgsfield runtime
- **Princípio II** (GitHub Pages compatibilidade): Ficheiros estáticos (HTML/CSS/JS/imagens)
- **Princípio III** (Transparência): Zero invenções; imagens IA identificadas
- **Princípio IV** (Especialização central): Destaca profissionais especializados positivamente

## Clarificações

### Sessão 2026-07-13

- Q1: Serviços Confirmados no MVP → A: Opção C — Usar lista exemplo durante desenvolvimento com flag clara "[EXEMPLO — Aguardando confirmação]" para validar estrutura; substituir com dados reais quando confirmados
- Q2: Processamento de Formulário → A: Formspree (GitHub Pages compatible, notificação email, sem backend, GDPR-friendly, simples integração)
- Q3: Imagens Provisórias → A: Placeholders SVG profissionais + flag descritiva "[Imagem ilustrativa]" durante desenvolvimento; substituir por fotografias reais quando disponíveis
- Q4: Estrutura de Dados Projeto → A: Modelo minimal obrigatório (título, tipo, descrição, localidade, fotos, especialidades) + campos opcionais (custo, duração, testemunho) para extensibilidade sem reengenharia

---

## Histórias de Utilizador (P1: 8, P2: 3)

### US1 — Compreender imediatamente (P1)

**Razão**: Visitante decide em 10 segundos se continua a explorar.

**Teste**: Novo visitante identifica sem scroll: nome, setor, proposta de valor, ação principal.

**Cenários**:
- **Given** página inicial carregada; **When** 10 segundos; **Then** compreende LMDreams, setor, diferenciação
- **Given** telemóvel 320px; **When** carrega; **Then** botão contacto visível sem scroll

### US2 — Conhecer serviços (P1)

**Razão**: Visitante verifica se empresa resolve sua necessidade.

**Teste**: Página Serviços lista apenas especialidades confirmadas, com descrição, benefício, imagem.

**Cenários**:
- **Given** página Serviços; **When** carrega; **Then** lista organizada de serviços aprovados
- **Given** clica serviço; **When** abre; **Then** descrição expandida + botão contacto

### US3 — Especialização como diferenciador (P1)

**Razão**: Diferenciador central. Mensagem positiva, sem insultar concorrentes.

**Teste**: Página explica 3+ benefícios concretos (qualidade, responsabilização, coordenação).

**Cenários**:
- **Given** secção especialização; **When** lê; **Then** compreende valor de profissionais dedicados

### US4 — Empresa e experiência (P1)

**Razão**: Criar confiança. Identidade, valores, experiência dos profissionais.

**Teste**: Página "Sobre Nós" comunica que profissionais possuem 20+ anos de experiência.

**Cenários**:
- **Given** "Sobre Nós"; **When** lê; **Then** compreende: quem, experiência, valores, forma trabalho

### US5 — Consultar projetos realizados (P2)

**Razão**: Validação social. Apenas obras reais autorizadas ou placeholder honesto.

**Teste**: Página Projetos lista apenas projetos reais ou estado "Projetos sendo preparados".

**Cenários**:
- **Given** página Projetos; **When** carrega; **Then** projetos reais autorizados OU placeholder profissional
- **Given** clica projeto; **When** abre; **Then** descrição, fotos, especialidades, resultado

### US6 — Processo de trabalho (P2)

**Razão**: Reduzir incerteza do cliente sobre como colaboração funciona.

**Teste**: Página apresenta 7-10 passos do processo, sem prometer prazos/visitas/orçamentos não confirmados.

**Cenários**:
- **Given** "Como Trabalhamos"; **When** lê; **Then** sequência clara de passos

### US7 — Contactar facilmente (P1)

**Razão**: Ação essencial. Contactos acessíveis em máximo 2 cliques.

**Teste**: Telefone e email encontrados em navegação, hero section e rodapé.

**Cenários**:
- **Given** qualquer página; **When** procura contactos; **Then** encontra em ≤ 1 clique
- **Given** clica email; **When** abre; **Then** cliente de email com endereço pré-preenchido

### US8 — Solicitar orçamento (P1)

**Razão**: Conversão. Formulário simples com máximo 7 campos.

**Teste**: Formulário recolhe nome, contacto, tipo trabalho, localidade, descrição. Valida obrigatórios.

**Cenários**:
- **Given** clica "Pedir Orçamento"; **When** abre formulário; **Then** campos claros e intuitivos
- **Given** tenta enviar sem nome; **When** clica enviar; **Then** erro: "Campo obrigatório"
- **Given** formulário preenchido corretamente; **When** envia; **Then** sucesso: "Pedido recebido"

### US9 — Usar em telemóvel (P1)

**Razão**: 60%+ dos acessos em dispositivos móveis. Zero zoom forçado.

**Teste**: Website completamente funcional em 320px sem zoom manual.

**Cenários**:
- **Given** acesso em telemóvel (320px); **When** navega; **Then** zero overflow, tudo funciona

### US10 — Acessibilidade (P1)

**Razão**: WCAG 2.2 AA compliance obrigatório (Constituição Princípio VI).

**Teste**: Navegável por teclado, compreendido por leitor ecrã, sem movimento obrigatório.

**Cenários**:
- **Given** teclado apenas; **When** navega; **Then** acesso completo a todas as funções
- **Given** leitor ecrã; **When** lê página; **Then** compreende estrutura, links, labels

### US11 — Privacidade e legal (P2)

**Razão**: Conformidade legal. Visitante compreende como dados são utilizados.

**Teste**: Página privacidade com responsável, finalidade, período conservação, direitos utilizador.

**Cenários**:
- **Given** acessa política privacidade; **When** lê; **Then** compreende claramento o tratamento de dados

---

## Requisitos Funcionais (RF-001 a RF-035)

1. **RF-001**: Identifica claramente LMDreams como empresa construção civil
2. **RF-002**: Proposta de valor na página inicial (especialização, qualidade, transparência)
3. **RF-003**: Comunica que profissionais possuem 20+ anos (sem confundir com idade empresa)
4. **RF-004**: Explica modelo de profissionais especializados como diferenciador central
5. **RF-005**: Apresenta apenas serviços confirmados pela empresa
6. **RF-006**: Serviços consultáveis em qualquer dispositivo (320px, 768px, 1200px+)
7. **RF-007**: Informação institucional (identidade, valores, experiência)
8. **RF-008**: Disponibiliza área de projetos/portefólio
9. **RF-009**: Distingue conteúdo real de provisório ou ilustrativo
10. **RF-010**: Nunca apresenta imagens geradas como trabalhos reais
11. **RF-011**: Contactos principais em máximo 2 cliques
12. **RF-012**: Permite iniciar pedido com formulário simples
13. **RF-013**: Valida campos obrigatórios antes submissão
14. **RF-014**: Apresenta mensagens claras de sucesso e erro
15. **RF-015**: Informa finalidade da recolha de dados
16. **RF-016**: Não recolhe dados desnecessários (máximo 7 campos)
17. **RF-017**: Disponibiliza política de privacidade completa
18. **RF-018**: Funciona em telemóvel, tablet, desktop
19. **RF-019**: Permite navegação completa por teclado
20. **RF-020**: Conteúdo essencial sem depender exclusivamente de animações
21. **RF-021**: Respeita preferência de redução de movimento
22. **RF-022**: Imagens informativas com alternativas textuais
23. **RF-023**: Utiliza português de Portugal (sem traduções literais)
24. **RF-024**: Oferece chamadas para ação consistentes
25. **RF-025**: Navegação clara para áreas principais
26. **RF-026**: Contactos acessíveis mesmo com falha de serviço externo
27. **RF-027**: Não exige conta, registo ou autenticação
28. **RF-028**: Não exige instalação de aplicações ou extensões
29. **RF-029**: Não depende de Higgsfield para acesso público
30. **RF-030**: Publicável via GitHub Pages (Constituição Princípio I)
31. **RF-031**: Não apresenta conteúdo fictício como informação real
32. **RF-032**: Permite atualização futura sem reengenharia de arquitetura
33. **RF-033**: Cada página com metadados descritivos (título, OG tags)
34. **RF-034**: Links de contacto (tel:, mailto:) utilizáveis em dispositivos
35. **RF-035**: Estados vazios profissionais quando sem conteúdo

---

## Entidades Conceptuais

### Empresa
- Nome comercial
- Nome legal [CONTENT PENDING]
- Descrição/missão
- Valores (qualidade, transparência, especialização)
- Experiência (20+ anos profissionais)
- Área geográfica [CONTENT PENDING]
- Contactos [CONTENT PENDING]

### Serviço
- Nome
- Descrição simples
- Necessidade resolvida
- Benefício para cliente
- Imagem representativa

### Projeto

**Campos Obrigatórios (Modelo Minimal)**:
- Título
- Tipo de intervenção
- Descrição breve
- Localidade geral (sem morada privada)
- Especialidades envolvidas
- Fotografias (reais, autorizadas — mínimo 2)

**Campos Opcionais (Extensibilidade)**:
- Resultado/conclusão mensurável
- Custo aproximado (ex: "Reparação urgência €500-€1000")
- Duração do trabalho (ex: "3 dias")
- Testemunho de cliente (se autorizado)
- Vídeo ou galeria 360°
- Antes/depois comparativas

**Rastreabilidade**:
- Data de conclusão
- Estado de publicação (rascunho/publicado)
- Autorização para divulgação

### Testemunho
- Texto
- Identificação aprovada
- Projeto relacionado
- Autorização [CONTENT PENDING]

### Pedido de Contacto/Orçamento
- Nome (obrigatório)
- Contacto: email ou telefone (obrigatório)
- Tipo de trabalho
- Localidade
- Descrição
- Consentimentos

### Conteúdo Visual
Cada imagem distingue: fotografia real | institucional | stock | ilustrativa | IA | placeholder

---

## Critérios de Sucesso (SC-001+)

1. **SC-001**: Novo visitante identifica nome/setor/proposta em <10 segundos (80%+ sem ajuda)
2. **SC-002**: Encontra contactos em <3 segundos (teste usabilidade)
3. **SC-003**: Completa formulário em <2 minutos (10 utilizadores)
4. **SC-004**: Carrega em <3 segundos em ligação 3G (Lighthouse ≥80)
5. **SC-005**: Zero rejeição técnica (WCAG 2.2 AA, navegadores modernos)
6. **SC-006**: Leitor de ecrã funciona sem erro crítico (NVDA/JAWS)
7. **SC-007**: Funciona perfeitamente em 320px, 768px, 1200px+
8. **SC-008**: Visitante descobre serviços em <30 segundos (90%+ em 1 clique)
9. **SC-009**: Compreende diferenciação sem ajuda (80%+ explicam em palavras próprias)
10. **SC-010**: Website publicado em GitHub Pages permanece acessível nas rotas principais sem depender de backend próprio, autenticação ou serviços runtime não aprovados

---

## Dependências de Conteúdo

### Críticas para MVP
- [CONTENT PENDING] Logótipo oficial
- [CONTENT PENDING] Contactos confirmados (telefone, email)
- [CONTENT PENDING] Descrição institucional da empresa
- [CONTENT PENDING] Lista final de serviços confirmados

### Recomendadas para MVP
- [CONTENT PENDING] Área geográfica de atuação
- [CONTENT PENDING] Processo oficial de trabalho (7-10 passos)
- [CONTENT PENDING] Fotografias de projetos reais autorizados

### Opcionais (post-launch)
- Testemunhos reais autorizados
- Blog ou recursos educativos
- Conteúdo multilingue
- Sistema de avaliações

---

## Casos-Limite Obrigatórios

1. Ausência de projetos reais → Estado vazio profissional com placeholder
2. Projeto sem fotografias autorizadas → Não é publicado até existirem mínimo 2 fotografias reais autorizadas
3. Imagens falham no carregamento → Alternativa textual descritiva visível
4. Visitante indeciso sobre serviço → Link para contactar-nos para orientação
5. Tentativa de envio formulário incompleto → Erro específico por campo obrigatório
6. Email num formato inesperado → Validação regex apropriada
7. Telefone em vários formatos → Aceitar +351, 21, 91, etc.
8. Texto excessivamente longo → Limitar a 5000 caracteres com aviso
9. Conteúdo malicioso nos campos → Sanitização de entrada, rejeição de scripts
10. Falha no envio do formulário → Mensagem: "Erro ao enviar. Tente novamente ou contacte-nos."
11. Serviço externo indisponível → Contactos estáticos no rodapé sempre funcionais
12. JavaScript desabilitado → Conteúdo essencial acessível
13. Navegação apenas por teclado → Tab order lógica, focus bem visível
14. Preferência de redução de movimento ativa → Animações removidas ou reduzidas
15. Texto ampliado a 200% → Zero overflow, legibilidade mantida
16. Ecrã muito pequeno (320px) → Zero overflow horizontal
17. Ligação muito lenta (3G) → Imagens otimizadas com lazy loading
18. Links de redes sociais não configurados → Omitidos (sem placeholders)
19. Contactos incompletos durante desenvolvimento → Marcado "[Confirmação pendente]"
20. Conteúdo provisório antes publicação → Flag "[DRAFT — Não publicado]"
21. Fotografias fictícias que podem confundir → Marcadas "Imagem ilustrativa — gerada"
22. Utilizador chega a página interna via motor busca → Navegação clara para Início
23. Página ou recurso inexistente (404) → Página 404 com link para Início
24. Formulário submetido 2x rapidamente → Botão desabilitado após 1º envio
[REMOVIDO - Fora do scope v1: não há tracking/cookies não-essenciais]

---

## Assunções

1. Empresa tem profissionais com 20+ anos de experiência (confirmado)
2. Especialização é diferenciador central (confirmado)
3. Website será publicado via GitHub Pages (Constituição Princípio II)
4. Contactos, logótipo, lista de serviços serão fornecidos antes da implementação
5. Fotografias de projetos reais serão autorizadas por proprietários/clientes
6. Português de Portugal é linguagem principal de conteúdo
7. Website não exigirá servidor permanente ou processamento server-side complexo
8. Higgsfield é ferramenta auxiliar de design; todos os assets exportados para GitHub

---

## Detalhes de Implementação (Derivados de Clarificações)

### Gestão de Serviços (Q1)

Durante o desenvolvimento do MVP, a secção "Serviços" utilizará uma lista exemplo marcada com flag clara:

```
[EXEMPLO — Aguardando confirmação]

- Alvenaria e estruturas
- Pintura e acabamentos
- Reparações e manutenção
- Impermeabilizações
- Carpintaria e esquadrias
```

Quando a empresa fornecer a lista oficial de serviços confirmados, os dados exemplo serão completamente substituídos. Esta abordagem permite validação de estrutura e fluxo durante desenvolvimento sem risco de publicação de informação incorrecta.

### Processamento de Formulário (Q2)

O formulário de "Pedido de Contacto/Orçamento" (RF-012) será processado através de **Formspree**:

- Integração simples: `<form action="https://formspree.io/f/{PROJECT_ID}">` (sem backend)
- Notificações automáticas: Email enviado para contacto LMDreams declarado
- Conformidade: GDPR-friendly; dados não armazenados em servidores de terceiros indefinidamente
- Fallback: Se Formspree indisponível, contactos estáticos (email, telefone) no rodapé continuam funcionais
- Justificação: GitHub Pages não suporta servidor backend; Formspree é solução mais simples, confiável e sem dependência de CRM proprietário

### Gestão de Imagens Provisórias (Q3)

Durante desenvolvimento, quando fotografias reais não estiverem disponíveis:

- Placeholders profissionais: SVG geradas (ex: ícones temáticos por serviço, silhuetas ilustrativas)
- Flag obrigatória: Toda a imagem provisória terá descrição "[Imagem ilustrativa]" ou "[Placeholder — Substituir com foto real]"
- Nunca publicar como real: Imagens geradas ou stock nunca serão publicadas como prova de trabalhos reais (Constituição Princípio III)
- Substituição fácil: Estrutura permitirá simples substituição de `img` tag quando fotos reais chegarem

### Estrutura de Dados Projeto — Modelo Minimal + Extensível (Q4)

Entidade Projeto segue modelo em duas camadas para flexibilidade:

**MVP (Camada Obrigatória)**: Título, tipo, descrição, localidade, especialidades, fotos (≥2)
**Extensões Futuras (Camada Opcional)**: Custo, duração, testemunho, vídeo, antes/depois

Esta estrutura permite implementação rápida sem reengenharia quando novas funcionalidades forem pedidas.

## Fora do Âmbito (v1)

- Área reservada para clientes
- Autenticação ou contas de utilizador
- Portal de acompanhamento de obras
- Pagamentos online
- Chatbot autónomo
- Aplicação móvel
- Conteúdo multilingue
- Blog

---

## Próximas Fases

- **Clarify**: Resolver clarificações de stakeholders (se necessário)
- **Plan**: Arquitetura técnica, stack de tecnologias, GitHub Pages, dependências runtime
- **Tasks**: Decompor em unidades de trabalho implementáveis
- **Implement**: Código, testes, revisão
- **Analyze**: Validação vs especificação antes de publicação

---

**Especificação validada conforme Constituição v1.0.0. Pronta para fase de planeamento técnico.**