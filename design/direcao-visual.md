# Direção visual do site LMDreams: C · Planta e Latão

Documento de referência para o código (tokens em `src/styles/index.css`) e para todos os pacotes da Fase 4. Especificação de origem: `design/propostas/direcao-C.md`; as diferenças face a ela estão assinaladas com **(ajuste)**.

## 1. Decisão e motivo

- **Escolhida:** direção C, “Planta e Latão”, escolhida pelo Andre a 25 de setembro de 2026 por recomendação do painel.
- **Pontuação do painel (Workflow 1B, três juízes, notas de 1 a 10):**

| Lente | A · Betão e Cobre | B · Pedra e Terracota | C · Planta e Latão |
|---|---|---|---|
| (a) Confiança e adequação ao público | 7 | 6,5 | 8 |
| (b) Distinção e “premium mas acessível” | 6 | 7 | 8 |
| (c) Acessibilidade, legibilidade, exequibilidade e desempenho | 6,5 | 7 | 8 |
| **Total** | **19,5** | **20,5** | **24** |

- **Porquê a C:** é a única que mostra a promessa no primeiro ecrã (especialidades anotadas na fotografia), transmite organização e transparência pela própria estrutura (cotas, etapas numeradas, carimbo legal), tem o texto do hero escuro sobre fundo claro (contraste que não depende da fotografia), é a que melhor cabe a 320 px e a mais leve no LCP, e o latão é da família do amarelo-lima do logótipo.
- **Riscos apontados e resposta:** tom técnico demais (aquecer com luz rasante nas fotografias e fundo de pedra, conter os motivos); latão que se lê como azeitona (volta ao latão da Parte 5.1, mais bronze); anotações que desaparecem no telemóvel (etiquetas por baixo da fotografia); lista de confiança afastada dos botões (aproximá-la).

### Ideias enxertadas das outras direções

1. **De A:** fotografia de mãos e materiais em luz rasante de fim de tarde (aquece a C); método do véu calculado no pior caso para o CTA e a imagem OG; telefone com peso visual real no cabeçalho a partir de 1280 px; disciplina de acento (se houver acento a mais, retira-se primeiro dos ícones).
2. **De B:** cada linha de cota prolonga uma aresta real e **nunca leva números nem graus** (nada de “45°” escrito); a linha de confiança assenta numa linha de terra junto aos botões; no máximo uma ou duas sobreposições entre secções no site inteiro (a moldura cotada da fotografia do Sobre pode atravessar o separador); quebra do H1 estável a partir de 1024 px; fontes de recurso com métricas medidas nos ficheiros reais.
3. **Da própria C, corrigido:** anotações com proporção fixa da fotografia (4:3 a partir de 1024 px) para não derivarem; anotações expostas às tecnologias de apoio como lista em texto (nunca `aria-hidden`); abaixo de 1024 px, as especialidades aparecem como três etiquetas por baixo da fotografia; texto em Plex Mono com 12 px no mínimo; nome “LMDreams” escondido visualmente abaixo de 380 px (mantém o nome acessível).

## 2. Tokens de cor

| Token (`@theme`) | Hex | Papel |
|---|---|---|
| `--color-bg` | #F6F5F1 | Fundo, papel de desenho |
| `--color-surface` | #E8E7E1 | Secções alternadas (Método, Testemunhos), cartões claros |
| `--color-sand` | #D6D2C7 | Placeholders e blocos decorativos; nunca controlos por cima |
| `--color-ink` | #1A222C | Títulos e texto (tinta azul-ardósia da planta) |
| `--color-muted` | #4A5361 | Texto secundário; fronteira dos campos de formulário e filtros |
| `--color-line` | #D2D2CC | Linhas finas decorativas (réguas, separadores, cabeçalho) |
| `--color-accent` | #80632B | **(ajuste)** Latão envelhecido da Parte 5.1: botão primário, marcas de cota, item ativo, marcadores |
| `--color-accent-hover` | #674F22 | **(ajuste)** Hover do primário; acento em texto sobre `surface` |
| `--color-dark` | #292929 | **(ajuste)** Carvão exato do fundo do logótipo (medido: margens a 41,41,41 sem desvio): Diferenciação, véu do CTA, rodapé |
| `--color-on-dark` | #F2F1EC | Texto nas faixas escuras |
| `--color-accent-on-dark` | #D0B47C | Acento nas faixas escuras (ícones, números) |
| `--color-focus` | #3D7DC2 | Anel de foco “azul de cianotipia”, igual em fundos claros e escuros |
| `--color-muted-on-dark` | #B7B5AE | Texto secundário nas faixas escuras |
| `--color-error` | #A3322A | Erros do formulário, sempre com ícone e texto |
| `--color-cota` | #80868E | Linhas de cota decorativas |
| `--color-line-on-dark` | #494947 | Contornos decorativos nas faixas escuras |

Porquê o ajuste do latão: o #7A6226 da proposta aproximava-se do caqui ou do azeitona no ecrã, ao lado do amarelo-lima do logótipo (observado na captura da maqueta e apontado por dois juízes). O #80632B da Parte 5.1 tem o matiz mais bronze (39,5°), mantém-se da família do amarelo do logótipo e já tinha contrastes verificados no brief.

O nome “LMDreams” junto à placa usa `dark` (#292929) e não `ink`, para a placa e o nome se lerem como uma só peça **(ajuste)**.

## 3. Contrastes (WCAG 2.x, calculados com `node`)

| Par | Uso | Razão | Mínimo | Resultado |
|---|---|---|---|---|
| ink / bg | Texto e títulos | 14,70:1 | 4,5:1 | passa |
| ink / surface | Texto sobre surface | 12,95:1 | 4,5:1 | passa |
| ink / sand | Texto em placeholders | 10,62:1 | 4,5:1 | passa |
| muted / bg | Texto secundário; fronteira de campos | 7,13:1 | 4,5:1 | passa |
| muted / surface | Texto secundário sobre surface | 6,27:1 | 4,5:1 | passa |
| muted / sand | Texto secundário sobre sand | 5,15:1 | 4,5:1 | passa |
| accent / bg | Acento em texto pequeno (só sobre bg) | 5,15:1 | 4,5:1 | passa |
| branco / accent | Texto do botão primário | 5,62:1 | 4,5:1 | passa |
| branco / accent-hover | Botão primário em hover | 7,73:1 | 4,5:1 | passa |
| accent / surface | Acento sobre surface (texto grande ou UI) | 4,53:1 | 3:1 | passa (em texto pequeno usa-se accent-hover) |
| accent-hover / surface | Acento em texto sobre surface | 6,24:1 | 4,5:1 | passa |
| accent-hover / bg | Ligações em hover | 7,08:1 | 4,5:1 | passa |
| dark / bg | Nome LMDreams no cabeçalho | 13,34:1 | 4,5:1 | passa |
| on-dark / dark | Texto nas faixas escuras | 12,86:1 | 4,5:1 | passa |
| accent-on-dark / dark | Acento nas faixas escuras | 7,28:1 | 4,5:1 | passa |
| muted-on-dark / dark | Texto secundário nas faixas escuras | 7,09:1 | 4,5:1 | passa |
| focus / bg | Anel de foco | 3,92:1 | 3:1 | passa |
| focus / surface | Anel de foco | 3,45:1 | 3:1 | passa |
| focus / dark | Anel de foco nas faixas escuras | 3,40:1 | 3:1 | passa |
| error / bg | Erros | 6,32:1 | 4,5:1 | passa |
| error / surface | Erros sobre surface | 5,56:1 | 4,5:1 | passa |
| on-dark sobre véu dark a 72% (pior caso, píxel branco) | Texto do CTA | ≈ 5,2:1 | 4,5:1 | passa (a medir de novo com a fotografia final) |
| on-dark sobre legenda de IA (dark a 86%) | “Imagem ilustrativa gerada por IA” | ≈ 8,2:1 | 4,5:1 | passa |
| accent / dark | Contorno do botão primário numa faixa escura | 2,59:1 | informativo | o botão identifica-se pelo texto (5,62:1) |
| line / bg | Linhas decorativas | 1,39:1 | informativo | nunca fronteira de controlo |
| amarelo do logótipo / bg | Porque o lima não é acento | 1,52:1 | informativo | só dentro do logótipo |

Regras: texto pequeno em acento só sobre `bg`; sobre `surface` usa-se `accent-hover`; nas faixas escuras `accent-on-dark`. Nenhum controlo sobre `sand` (o foco ficaria a 2,83:1). O script `npm run check:contrast` verifica estes pares a partir do CSS.

## 4. Tipografia

| Papel | Pacote | Família CSS | Pesos |
|---|---|---|---|
| Títulos | `@fontsource-variable/schibsted-grotesk` 5.3.x | “Schibsted Grotesk Variable” | 600 (h2, h3), 620 (display, h1), 650 (nome LMDreams) |
| Texto | `@fontsource-variable/ibm-plex-sans` 5.3.x | “IBM Plex Sans Variable” | 400, 500, 600 |
| Anotações | `@fontsource/ibm-plex-mono` 5.3.x | “IBM Plex Mono” | 500 (e 400 se for mesmo usado) |

- Subconjunto `latin` apenas; autoalojadas (importadas no CSS); `font-display: swap`; fontes de recurso com `size-adjust`, `ascent-override` e `descent-override` medidos nos ficheiros reais na Fase 2.
- Plex Mono só em etiquetas, anotações, números de etapa, legendas de imagem e rótulos do bloco legal; nunca em parágrafos; **nunca abaixo de 12 px** **(ajuste)**.
- Algarismos tabulares (`tabular-nums`) no telefone e nos números em Plex Sans.
- Sem itálicos; ênfase por peso.

| Nível | `clamp()` | 390 px | 1440 px | Altura de linha | Espaçamento |
|---|---|---|---|---|---|
| display (H1 do hero) | `clamp(2.25rem, 1.2rem + 3.75vw, 4.5rem)` | 36 | 72 | 1,02 | -0,03em |
| h1 (legais, 404) | `clamp(2rem, 1.3rem + 2.4vw, 3.25rem)` | 32 | 52 | 1,06 | -0,026em |
| h2 | `clamp(1.75rem, 1.2rem + 1.9vw, 2.75rem)` | 28 | 44 | 1,08 | -0,022em |
| h3 | `clamp(1.1875rem, 1.05rem + 0.45vw, 1.5rem)` | 19 | 23,3 | 1,22 | -0,012em |
| texto grande | `clamp(0.96875rem, 0.83rem + 0.55vw, 1.25rem)` | 15,5 | 20 | 1,5 | 0 |
| texto | `clamp(1rem, 0.95rem + 0.2vw, 1.0625rem)` | 16 | 17 | 1,6 | 0 |
| pequeno | `0.875rem` | 14 | 14 | 1,5 | 0,005em |
| legenda | `0.75rem` | 12 | 12 | 1,35 | 0,02em |
| etiqueta (maiúsculas, mono) | `0.75rem` | 12 | 12 | 1,35 | 0,08em |
| número de etapa (mono), páginas legais e listas | `1rem` | 16 | 16 | 1 | 0,02em |
| número de etapa do Método (mono) **(ajuste)** | `clamp(1.75rem, 1.05rem + 2.5vw, 3.25rem)` (`text-step-lg`) | 28 | 52 | 1 | -0,01em |

O texto grande desce a 15,5 px abaixo de 768 px para o subtítulo do hero caber em 3 linhas a 390 px (medido na maqueta). Largura máxima do texto corrido: 65 caracteres (`max-w-texto`, token `--container-texto: 30em`, cerca de 0,465em por carácter em IBM Plex Sans, medido no próprio parágrafo) **(ajuste: o `max-w-prose` do Tailwind dá 65ch, que em Plex Sans corresponde a mais de 65 caracteres)**. Abaixo de 380 px, o subtítulo do hero pode ocupar 4 linhas (o texto é fixo pelo brief); usa `text-wrap: pretty` só aí, para não deixar uma palavra isolada **(ajuste)**.

## 5. Espaço, grelha, raios, linhas, sombras e movimento

- **Escala de 4 px:** 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128.
- **Secções:** `padding-block: clamp(4rem, 8vw, 8rem)`.
- **Contentor:** largura máxima de 1272 px (12 colunas de 84 px com intervalos de 24 px; coincide com a grelha de 24 px do papel); margens laterais de 16 px (< 640), 24 px (640 a 1023) e 32 px (≥ 1024).
- **Grelha:** 4 colunas com intervalo de 16 px (< 640), 8 colunas com 24 px (640 a 1023), 12 colunas com 24 px (≥ 1024).
- **Cabeçalho:** 72 px em computador, 64 px abaixo de 768 px; claro (`bg`), com linha `line` e sombra suave ao fazer scroll; navegação completa a partir de 1152 px, menu abaixo disso; número de telefone a partir de 1280 px; botão compacto “Ligar” entre 768 e 1279 px (nome acessível “Ligar para a LMDreams”).
- **Raios (uma escala):** 2 px por omissão (botões, campos, filtros, legendas, fotografias, placa do logótipo), 4 px nos cartões, 6 px no diálogo e no painel do menu móvel. Sem botões em pílula; círculos só nos alvos das anotações.
- **Linhas:** 1 px `line` em réguas e separadores; 1 px `cota` nas cotas; 1 px `ink` no contorno do botão secundário (`on-dark` nas faixas escuras); 1 px `muted` nos campos; barra de 2 px `accent` sob o item ativo da navegação; tracejado de 1 px `muted` nos placeholders.
- **Sombras:** nenhuma por omissão. Cabeçalho após scroll: `0 1px 0 var(--color-line), 0 8px 24px -16px rgb(26 34 44 / 0.28)`. Diálogo: `0 24px 64px -24px rgb(26 34 44 / 0.35)`.
- **Botões:** md 44 px, lg 52 px, 48 px empilhados em telemóvel; padding horizontal de 20 e 24 px; Plex Sans 600. Primário: `accent`, texto branco, hover `accent-hover`. Secundário: transparente com contorno interior de 1 px `ink`, hover `surface`. Ligação com seta: `ink` com seta de 20 px, sublinhado em hover e foco. Foco: anel de 2 px `focus` com afastamento de 3 px.
- **Movimento:** 150 ms (hover e cor), 250 ms (menu, sombra do cabeçalho, filtros), 400 ms (entrada: deslocação de 10 px e opacidade, uma vez); curva `cubic-bezier(0.2, 0.7, 0.2, 1)`; zoom de 2% nas imagens em hover. Sem animações com `prefers-reduced-motion: reduce`. O estado inicial “escondido” só existe com JavaScript ativo e movimento aceite.

## 6. Motivos “a planta da obra”

Regra de contenção: no máximo dois motivos por secção e nenhum atrás de parágrafos.

| Motivo | Onde | Onde não |
|---|---|---|
| Papel de desenho (grelha de 24 px, linha maior a cada 96 px, `ink` a 5,5% e 10%) | Hero (metade direita, esbatido); Método de trabalho | Restantes secções e faixas escuras |
| Linha de cota com traços a 45° em latão, **sem números nem graus** | Moldura da fotografia do hero; separadores entre secções seguidas com o mesmo fundo; cadeia de cotas do Método; linha de terra da linha de confiança | Cartões, formulário, outras fotografias |
| Anotações numeradas (alvo, linha-guia, etiqueta com número em latão) | Só na fotografia do hero, 2 ou 3, apenas com especialidades que a fotografia mostre de facto | Qualquer outra imagem |
| Algarismos em Plex Mono | Etapas 01 a 08, anotações, rótulos do bloco legal | Títulos e texto corrido |
| Marca em cruz (9 px, latão) | Marcador das listas com régua: linha de confiança, destaques do Sobre, “O que vai saber” | Navegação e lista de serviços |
| Carimbo (tabela de legenda de uma planta) | Bloco “Informação legal” do rodapé, com rótulos em Plex Mono | Resto do site |

## 7. Fotografia

- **Luz:** fim de tarde, quente e rasante; sombras longas e suaves; nunca flash nem HDR.
- **Cor:** saturação contida; betão, pedra, carvalho e latão; pretos levantados; **sem tons verde-amarelados** (o amarelo-lima é exclusivo do logótipo).
- **Grão:** muito subtil, igual em todas as imagens.
- **Enquadramento:** 35 mm; mãos, antebraços e materiais; sujeito ligeiramente à direita do centro, para recortes 4:3, 16:9 e 4:5.
- **Moldura:** raio de 2 px, sem sombra; no hero, cotas à volta.
- **Véu:** só no CTA (texto sobre fotografia): `dark` com opacidade mínima de 72% na zona do texto; o contraste real mede-se com a fotografia final antes de a aceitar.
- **Legenda de IA:** “Imagem ilustrativa gerada por IA”, texto real no DOM (`figcaption`), Plex Mono 500 a 12 px, `on-dark` sobre `dark` a 86%, padding de 6 × 9 px, raio de 2 px. Canto superior direito no hero (todas as larguras, longe da barra móvel) e nas imagens das secções; canto inferior direito no CTA. Nunca `aria-hidden`, nunca só em hover.
- **Ajustes aos prompts da Parte 4.4:** acento do sufixo de estilo “aged brass”; `hero` com o sujeito ligeiramente à direita do centro, envolvente calma, um foco de teto embutido e um painel de carpintaria em carvalho com um puxador de latão fino (para as anotações corresponderem ao que se vê); `sobre` com “brushed brass” em vez de “brushed copper”; acrescentar “no yellow-green tones”.

## 8. Hero

- **Computador (≥ 1024 px):** fundo `bg` com papel de desenho na metade direita. Linha 1: etiqueta em Plex Mono maiúsculas precedida de uma pequena cota, e o H1 em 2 linhas (quebra estável depois de “mãos”). Linha 2: à esquerda (colunas 1 a 5) o subtítulo em 3 linhas, os dois botões lado a lado (lg) e, logo abaixo, a linha de confiança como três linhas com régua e cruz, sobre a linha de terra **(ajuste: junto aos botões)**; à direita (colunas 7 a 12) a fotografia **na proporção do ficheiro (≈ 16:9) (ajuste: em vez de 4:3, para o hero caber a 1280 × 720 e as anotações não derivarem com o recorte)** com cota horizontal por cima, cota vertical só com margem de pelo menos 56 px, 2 ou 3 anotações e a legenda de IA no canto superior direito.
- **1280 × 720:** tudo o que é obrigatório (título, subtítulo, botões, linha de confiança, legenda) visível sem scroll; a fotografia recorta pelo sujeito.
- **Tablet (768 a 1023 px):** texto por cima, fotografia na proporção do ficheiro (≈ 16:9) a toda a largura por baixo, só com a cota horizontal; especialidades como etiquetas por baixo da fotografia.
- **Telemóvel (< 768 px):** H1 a 36 px em até 3 linhas; subtítulo em 3 linhas; botões empilhados a toda a largura (48 px); linha de confiança; fotografia 4:5 a toda a largura com a legenda de IA no canto superior direito; etiquetas das especialidades por baixo; a barra de contacto móvel nunca tapa os botões nem a linha de confiança.
- **Altura mínima:** `calc(100dvh - 72px)` com teto razoável; abaixo de 768 px, menos também a barra de contacto e a *safe area*.
- **Ecrãs baixos (< 768 px de largura e altura até 480 px, por exemplo telemóvel na horizontal ou zoom a 200%) (ajuste):** a barra de contacto móvel fica escondida para não ocupar metade do ecrã; “Pedir orçamento” continua no cabeçalho, e o telefone e o WhatsApp no menu.
- **Espaçamento de texto aumentado (WCAG 1.4.12) (ajuste):** se o cabeçalho deixar de caber, entra num modo compacto (navegação e número passam para o menu; depois, o nome passa a só acessível), sem esconder “Pedir orçamento”.

## 9. Aplicação às outras secções

- **Sobre (bg):** separador de cota; fotografia 4:5 à esquerda (colunas 1 a 5), texto à direita (colunas 7 a 12); destaques em lista com régua e cruz.
- **Diferenciação (faixa `dark`):** H2 em `on-dark`; grelha assimétrica com a imagem `diferenciacao` (3:2) e cinco cartões com contorno `line-on-dark`, ícones Lucide de traço 1,5 em `accent-on-dark`, títulos `on-dark`, texto `muted-on-dark`. Board: `design/boards/board-diferenciacao-C-v1.png`.
- **Serviços (bg):** seis cartões com imagem 4:3 em grelha 3 × 2; os outros dez numa lista a duas colunas com ícone `muted` e régua; “Remodelações completas” e “Preparação e coordenação de obra” com peso 600; frase ao visitante e “Pedir orçamento”. Board: `design/boards/board-servicos-C-v1.png`.
- **Método de trabalho (surface com papel de desenho):** oito etapas em `<ol>`, grelha 4 × 2 a partir de 1024 px, ligadas por uma cadeia de cotas; números 01 a 08 em Plex Mono latão (`accent-hover` sobre `surface`), de 28 a 52 px, o elemento mais forte de cada etapa, como no board **(ajuste: eram 16 px)**; vertical em telemóvel, com a cota à esquerda. Board: `design/boards/board-metodo-C-v1.png`.
- **Projetos (bg):** filtros com contorno `muted` e raio de 2 px, estado premido em `ink` com texto `on-dark`; placeholders em `sand` tracejados com “Imagem a substituir”; diálogo com raio de 6 px.
- **Transparência (bg):** lista “O que vai saber” com régua e cruz; imagem 3:2 à direita; parágrafo sobre imprevistos.
- **Testemunhos (surface):** três cartões tracejados “Conteúdo a substituir”, sem estrelas nem nomes.
- **CTA (faixa `dark` sobre a imagem `cta`):** véu de 72% ou mais na zona do texto; H2 em `on-dark`; primário em latão; “Contactar por telefone” e “Falar por WhatsApp” com contorno `on-dark`; legenda de IA no canto inferior direito. Board: `design/boards/board-contactos-C-v1.png`.
- **Contactos (bg):** duas colunas; campos de 48 px com contorno `muted`; rótulos Plex Sans 500 por cima; ajudas em `muted` a 14 px; erros em `error` com ícone; dados de contacto em lista com régua; telefone com “(chamada para a rede móvel nacional)”.
- **Rodapé (faixa `dark`):** logótipo sem placa visível (o fundo do ficheiro coincide com `dark`); ligações `on-dark` sublinhadas em hover; bloco “Informação legal” em carimbo; nota das imagens ilustrativas e “©” em `muted-on-dark`.

Faixas escuras: só Diferenciação, CTA e rodapé.

## 10. Logótipo

- Ficheiro original tal como está (352 × 188 px, fundo #292929, grafismo #D1CF20, sem texto). Nunca redesenhar, recolorir nem “limpar”.
- **Cabeçalho:** placa (o próprio ficheiro) com 44 px de altura em computador, 36 px em tablet e 32 px em telemóvel, raio de 2 px, seguida do nome “LMDreams” em Schibsted Grotesk 650 na cor `dark`; `img` com `alt=""` e ligação com o nome acessível “LMDreams, voltar ao início”.
- **Faixas escuras:** o ficheiro diretamente sobre `dark`, sem placa visível.
- **Favicons:** recorte quadrado do próprio ficheiro centrado na casa, sobre o fundo do ficheiro; a 16 px o traço fino pode perder-se: assinalar para aprovação.
- **Imagem OG:** recorte do hero com véu `dark`, logótipo, a frase “Cada especialidade nas mãos de quem realmente sabe.” e a legenda de IA em letra pequena.
- `theme-color`: #F6F5F1.

## 11. Fazer e evitar

Fazer: alinhar tudo à grelha de 12 colunas; guardar o latão para ação e marcação (nunca mais de 5% de um ecrã); manter as anotações fiéis à fotografia escolhida; deixar ar (uma ideia por secção, parágrafos de 2 a 4 linhas).

Evitar: o amarelo-lima fora do logótipo; papel de desenho em mais de duas secções; cotas em todas as imagens; números ou graus escritos nas cotas; anotações fora do hero; etiquetas em maiúsculas por cima de cada título (no máximo uma por cada três secções); preto puro, creme amarelado, gradientes luminosos, vidro fosco, sombras grandes, botões em pílula, ícones em círculos coloridos; texto sobre fotografia sem véu; texto pequeno em latão sobre `surface` ou `dark`; controlos sobre `sand`; `h-screen`.

## 12. Boards e maquetas

| Ficheiro | Conteúdo |
|---|---|
| `design/boards/board-hero-A-v1.png`, `-B-v1.png`, `-C-v1.png` | Ronda 1: hero das três direções (Higgsfield, `nano_banana_pro`, 2k, 16:9) |
| `design/boards/board-hero-A-html-v1.png`, `-B-`, `-C-` | Capturas das maquetas HTML a 1440 × 900 |
| `design/boards/board-diferenciacao-C-v1.png` | Ronda 2: Diferenciação |
| `design/boards/board-servicos-C-v1.png` | Ronda 2: Serviços |
| `design/boards/board-metodo-C-v1.png` | Ronda 2: Método de trabalho |
| `design/boards/board-contactos-C-v1.png` | Ronda 2: chamada para ação e Contactos |
| `design/maquetas/hero-C.html` | Maqueta HTML do hero e início do Sobre |

Os boards definem composição, hierarquia, ritmo, espaço e colocação do acento. Não definem texto (vem de `src/content/`) nem se sobrepõem ao brief (sistema de botões, linha de confiança, legendas). Os logótipos e textos pequenos desenhados pela IA nos boards não são referência: usa-se o ficheiro real e os textos do conteúdo.
