# Direção C · Planta e Latão

Proposta do Workflow 1A (Fase 1). Documento de trabalho para os juízes e para o orquestrador; a decisão final vive em `design/direcao-visual.md`. Maqueta do primeiro ecrã: `design/maquetas/hero-C.html`.

## 1. Ideia

“Planta e Latão” trata o site como a folha de desenho de uma obra bem preparada: papel claro de pedra, tinta azul-ardósia, linhas de cota finas e um único metal quente, o latão, reservado para o que o visitante pode fazer (pedir orçamento). A fotografia do hero é apresentada como um desenho anotado: cada especialidade visível na imagem recebe um número e um nome, e a promessa “cada especialidade nas mãos de quem realmente sabe” passa a ver-se, não só a ler-se. O carvão do logótipo torna-se a cor das faixas escuras e o seu amarelo-lima fica sozinho dentro da placa, como o carimbo de uma planta. A precisão das linhas é equilibrada pela luz quente das fotografias e pelo latão, para que o resultado seja técnico sem ser frio.

Como foge ao aspeto genérico de IA:

- **A estrutura mede coisas reais.** O contentor tem 1272 px porque (1272 + 24) / 12 = 108 px por coluna, isto é, 4,5 módulos de 24 px: a grelha do papel passa exatamente pelas arestas da fotografia. As cotas enquadram a fotografia e a lista de confiança assenta na mesma linha de base.
- **Anotações em vez de ícones decorativos.** Os números 01, 02 e 03 apontam para especialidades do Anexo A §5 presentes na imagem (revestimentos, carpintaria, eletricidade).
- **Um só acento, pequeno e com função:** botão primário, marcas de cota, item ativo da navegação, marcadores em cruz. Nada de gradientes luminosos, vidro fosco, sombras grandes, botões em pílula ou ícones dentro de círculos coloridos.
- **Tipografia com carácter técnico e editorial:** Schibsted Grotesk firme e compacta nos títulos, IBM Plex Sans no texto, IBM Plex Mono só nas anotações. Foge ao par habitual de sites gerados (Inter com Poppins ou Manrope).
- **O logótipo não é “limpo” nem redesenhado:** a placa escura do ficheiro é assumida como carimbo e ganha um papel no sistema.

## 2. Tokens de cor

Valores finais. Partem da coluna C da Parte 5.1; os ajustes explicam-se a seguir à tabela.

| Token | Hex | Papel | Origem |
|---|---|---|---|
| `bg` | #F6F5F1 | Fundo, papel de desenho | Parte 5.1, igual |
| `surface` | #E8E7E1 | Secções alternadas (Método, Testemunhos), cartões claros | Parte 5.1, igual |
| `sand` | #D6D2C7 | Placeholders e blocos decorativos, sem controlos por cima | Parte 5.1, igual |
| `ink` | #1A222C | Títulos e texto, a “tinta da planta” | Parte 5.1, igual |
| `muted` | #4A5361 | Texto secundário, subtítulos, fronteira dos campos de formulário | Parte 5.1, igual |
| `line` | #D2D2CC | Linhas finas decorativas: réguas de listas, separadores, cabeçalho | Novo |
| `accent` | #7A6226 | Latão envelhecido: botão primário, marcas de cota, item ativo, marcadores | Ajustado (era #80632B) |
| `accentHover` | #614E1E | Hover do primário; acento em texto sobre `surface` | Ajustado (era #674F22) |
| `dark` | #292928 | Diferenciação, véu do CTA, rodapé: o carvão do próprio logótipo | Ajustado (era #1A222C) |
| `onDark` | #F2F1EC | Texto nas faixas escuras | Novo |
| `accentOnDark` | #D0B47C | Acento nas faixas escuras (ícones, números, sublinhados) | Ajustado (era #CDAA62) |
| `focus` | #3D7DC2 | Anel de foco, “azul de cianotipia”; o mesmo em fundos claros e escuros | Novo |

Cores derivadas (documentadas, fora da lista de 12):

| Nome | Valor | Uso |
|---|---|---|
| `muted-on-dark` | #B7B5AE | Texto secundário nas faixas escuras |
| `error` | #A3322A | Mensagens de erro do formulário, sempre com ícone e texto |
| `cota` | #80868E | Linhas de cota (decorativas) |
| grelha menor / maior | `ink` a 5,5% / 10% | Papel de desenho do hero e do Método |
| `line-on-dark` | `onDark` a 16% (≈ #494947) | Contornos dos cartões da Diferenciação e divisórias do rodapé |

Porquê os ajustes:

- **`dark` = #292928.** É o fundo do logótipo. Nas faixas escuras (Diferenciação e rodapé) o ficheiro PNG funde-se com o fundo e só o traço amarelo-lima fica visível, sem remover o fundo nem tocar no ficheiro. No cabeçalho claro, a placa passa a ser um fragmento das faixas escuras. `ink` mantém-se azul-ardósia (texto sobre papel); os dois nunca partilham uma aresta, exceto a placa ao lado do nome, onde a diferença lê-se como intencional.
- **`accent` #80632B → #7A6226.** O matiz passa de 39,5° para 42,9°, 3,4° mais perto do amarelo do logótipo (59,3°), e escurece ligeiramente: é o “metal” do mesmo amarelo, parente e não imitação. Ganha contraste (5,34:1 sobre `bg`, 4,70:1 sobre `surface`, 5,83:1 com texto branco).
- **`accentOnDark` #CDAA62 → #D0B47C.** Menos saturado (0,40 contra 0,85 do amarelo-lima) para que, nas faixas escuras, o latão se leia como metal e o amarelo do logótipo continue único.
- **`focus` azul.** Distingue-se de tudo o resto (1,1 a 1,4:1 contra o latão), passa 3:1 sobre `bg`, `surface` e `dark`, e é da família de `ink` (matiz 212° contra 213°): a tinta da planta, mais clara. Só aparece com foco de teclado.

Tokens para `@theme` (Tailwind CSS v4, Parte 5.2):

```css
@theme {
  --color-bg: #F6F5F1;
  --color-surface: #E8E7E1;
  --color-sand: #D6D2C7;
  --color-ink: #1A222C;
  --color-muted: #4A5361;
  --color-line: #D2D2CC;
  --color-accent: #7A6226;
  --color-accent-hover: #614E1E;
  --color-dark: #292928;
  --color-on-dark: #F2F1EC;
  --color-accent-on-dark: #D0B47C;
  --color-focus: #3D7DC2;
  --color-muted-on-dark: #B7B5AE;
  --color-error: #A3322A;

  --font-display: "Schibsted Grotesk Variable", "Schibsted Grotesk Fallback", Arial, sans-serif;
  --font-body: "IBM Plex Sans Variable", "IBM Plex Sans Fallback", Arial, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, Consolas, monospace;

  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 6px;

  --ease-planta: cubic-bezier(0.2, 0.7, 0.2, 1);
}
```

## 3. Contrastes calculados

Calculados com `node -e` e a fórmula de luminância relativa WCAG 2.x (linearização sRGB com limiar 0,04045 e pesos 0,2126, 0,7152 e 0,0722; razão (L1 + 0,05) / (L2 + 0,05)). As composições com transparência foram misturadas em sRGB, como faz o navegador, contra o pior fundo possível.

| Par | Uso | Razão | Mínimo | Resultado |
|---|---|---|---|---|
| ink/bg (#1A222C / #F6F5F1) | Texto corrente e títulos | 14,70:1 | 4,5:1 | passa |
| ink/surface (#1A222C / #E8E7E1) | Texto sobre surface | 12,95:1 | 4,5:1 | passa |
| ink/sand (#1A222C / #D6D2C7) | Texto sobre sand (placeholders) | 10,62:1 | 4,5:1 | passa |
| muted/bg (#4A5361 / #F6F5F1) | Texto secundário | 7,13:1 | 4,5:1 | passa |
| muted/surface (#4A5361 / #E8E7E1) | Texto secundário sobre surface | 6,27:1 | 4,5:1 | passa |
| muted/sand (#4A5361 / #D6D2C7) | Texto secundário sobre sand | 5,15:1 | 4,5:1 | passa |
| accent/bg (#7A6226 / #F6F5F1) | Acento em texto pequeno (só sobre bg) | 5,34:1 | 4,5:1 | passa |
| branco/accent (#FFFFFF / #7A6226) | Texto do botão primário | 5,83:1 | 4,5:1 | passa |
| branco/accentHover (#FFFFFF / #614E1E) | Botão primário em hover | 8,03:1 | 4,5:1 | passa |
| accent/surface (#7A6226 / #E8E7E1) | Acento sobre surface (em texto usa-se accentHover) | 4,70:1 | 4,5:1 | passa |
| accentHover/surface (#614E1E / #E8E7E1) | Acento em texto sobre surface | 6,48:1 | 4,5:1 | passa |
| accentHover/bg (#614E1E / #F6F5F1) | Ligações em hover | 7,36:1 | 4,5:1 | passa |
| onDark/dark (#F2F1EC / #292928) | Texto nas faixas escuras | 12,88:1 | 4,5:1 | passa |
| accentOnDark/dark (#D0B47C / #292928) | Acento nas faixas escuras | 7,28:1 | 4,5:1 | passa |
| muted-on-dark/dark (#B7B5AE / #292928) | Texto secundário nas faixas escuras | 7,10:1 | 4,5:1 | passa |
| muted/bg (#4A5361 / #F6F5F1) | Fronteira dos campos de formulário (componente) | 7,13:1 | 3:1 | passa |
| line/bg (#D2D2CC / #F6F5F1) | Linhas decorativas (nunca fronteira de controlo) | 1,39:1 | informativo | n/a |
| line/surface (#D2D2CC / #E8E7E1) | Linhas decorativas sobre surface | 1,23:1 | informativo | n/a |
| focus/bg (#3D7DC2 / #F6F5F1) | Anel de foco sobre bg | 3,92:1 | 3:1 | passa |
| focus/surface (#3D7DC2 / #E8E7E1) | Anel de foco sobre surface | 3,45:1 | 3:1 | passa |
| focus/dark (#3D7DC2 / #292928) | Anel de foco nas faixas escuras | 3,41:1 | 3:1 | passa |
| focus/sand (#3D7DC2 / #D6D2C7) | Por isso, nenhum controlo sobre sand | 2,83:1 | informativo | n/a |
| error/bg (#A3322A / #F6F5F1) | Mensagens de erro | 6,32:1 | 4,5:1 | passa |
| error/surface (#A3322A / #E8E7E1) | Erro sobre surface | 5,56:1 | 4,5:1 | passa |
| dark/bg (#292928 / #F6F5F1) | Placa do logótipo no cabeçalho | 13,35:1 | informativo | n/a |
| amarelo do logótipo/dark (#D1CF20 / #292928) | Traço do logótipo sobre a sua placa | 8,78:1 | informativo | n/a |
| amarelo do logótipo/bg (#D1CF20 / #F6F5F1) | Prova de que o amarelo-lima não serve como acento | 1,52:1 | informativo | n/a |
| accentOnDark/amarelo do logótipo (#D0B47C / #D1CF20) | Não colocar lado a lado | 1,21:1 | informativo | n/a |
| accent/dark (#7A6226 / #292928) | Limite do botão primário sobre faixa escura | 2,50:1 | informativo | n/a |
| onDark sobre véu dark a 72% (pior caso: branco por baixo, #656564) | Texto do CTA sobre fotografia | 5,16:1 | 4,5:1 | passa |
| onDark sobre legenda de IA (dark a 86%, pior caso #474746) | Legenda “Imagem ilustrativa gerada por IA” | 8,22:1 | 4,5:1 | passa |
| ink sobre etiqueta de anotação (bg a 95%, pior caso preto, #E7E6E3) | Anotações 01 a 03 | 12,85:1 | 4,5:1 | passa |
| line-on-dark/dark (#494947 / #292928) | Contornos decorativos nas faixas escuras | 1,61:1 | informativo | n/a |

Notas:

- A regra comum mantém-se mesmo com accent/surface a 4,70:1: texto pequeno em acento só sobre `bg`; sobre `surface` usa-se `accentHover`; nas faixas escuras usa-se `accentOnDark`.
- O botão primário sobre a faixa escura do CTA tem um limite de 2,50:1 contra o fundo. É aceitável porque o componente se identifica pelo texto (5,83:1), e a WCAG 1.4.11 não exige contraste do contorno nesse caso; os botões secundários do CTA levam contorno `onDark` (12,88:1), o que reforça a leitura do grupo.
- `line` é só decorativa. Campos de formulário, caixas de seleção e filtros usam fronteira `muted` de 1 px (7,13:1).

## 4. Diálogo com o logótipo

Factos: `logo-lmdreams.png`, 352 × 188 px, sem transparência, fundo sólido carvão #292928, grafismo de uma só cor amarelo-lima #D1CF20 (contorno de telhado com chaminé e janela de quatro vidros), sem texto. Usa-se tal como está.

Como a direção convive com ele:

1. **O amarelo-lima vive só dentro do logótipo.** Nunca é cor de interface, de texto, de ícone ou de fotografia (1,52:1 sobre `bg`: seria ilegível e demasiado brilhante). Os prompts de imagem pedem ausência de verde-amarelado.
2. **O carvão do logótipo é o `dark` do site.** A placa do cabeçalho e as faixas escuras são o mesmo material. No rodapé e na Diferenciação, o logótipo aparece sem placa visível, porque o fundo do ficheiro coincide com o da faixa.
3. **O latão é o “metal” do mesmo amarelo.** Matiz vizinho (42,9° contra 59,3°), muito mais escuro e menos saturado: relação análoga, de família, sem competição. O `accentOnDark` é ainda menos saturado para não disputar o amarelo nas faixas escuras, e nunca fica encostado ao logótipo (no rodapé, as ligações usam `onDark`).
4. **A tinta azul-ardósia é a complementar dos dois amarelos.** `ink`, `muted` e `focus` (matizes de 212° a 217°) equilibram o latão e o amarelo-lima, como a tinta azul de uma planta sobre papel.

Aplicações:

- **Cabeçalho (claro):** placa com 44 px de altura (82 × 44 px) em computador, 36 px em tablet e 32 px em telemóvel, raio de 2 px, seguida do nome “LMDreams” em Schibsted Grotesk 650, 21 px (17 px em telemóvel), cor `ink`. A placa e o botão “Pedir orçamento” têm a mesma altura (44 px) e fecham o cabeçalho dos dois lados. Nome acessível da ligação: “LMDreams, voltar ao início”; `img` com `alt=""` porque o nome está em texto. Abaixo de 380 px, o nome esconde-se visualmente e fica só no nome acessível.
- **Rodapé (dark #292928):** o PNG diretamente sobre o fundo, 56 px de altura, sem raio; lê-se como se tivesse transparência. Verificar na Fase 4 que o fundo do ficheiro é uniforme (por exemplo, estatísticas de canal com `sharp` nas margens); se houver desvio visível, manter a placa com raio de 2 px, que continua coerente.
- **Diferenciação (dark):** sem logótipo, para não o repetir; o latão claro aparece só nos ícones e nos números.
- **Favicon:** recorte quadrado do próprio ficheiro centrado na casa (cerca de 188 × 188 px a partir de x ≈ 82), sem redesenho, reduzido a 16, 32, 180, 192 e 512 px sobre o fundo #292928 do próprio ficheiro (o `apple-touch-icon` fica opaco sem esforço). O traço fino do telhado pode desaparecer a 16 px: assinalar para aprovação (Parte 4.9). O ficheiro tem menos de 1000 px de largura: pedir ao Andre uma versão vetorial (ponto de paragem 4, não bloqueia).
- **`theme-color`:** #F6F5F1 (o cabeçalho é claro).
- **Imagem OG:** fundo `dark` com o logótipo sem placa, linhas de cota em `cota` e a frase em `onDark`.

## 5. Tipografia

| Papel | Pacote (versão confirmada com `npm view`) | Família CSS | Pesos e eixos usados | Importação no site |
|---|---|---|---|---|
| Títulos | `@fontsource-variable/schibsted-grotesk` 5.3.0 | `"Schibsted Grotesk Variable"` | Eixo `wght` (400 a 900); usados 600 (h2, h3), 620 (display e h1), 650 (nome LMDreams) | `index.css` do pacote (eixo `wght`) |
| Texto | `@fontsource-variable/ibm-plex-sans` 5.3.0 | `"IBM Plex Sans Variable"` | Eixo `wght` (100 a 700); usados 400, 500 e 600. O eixo de largura não se usa | `index.css` do pacote |
| Anotações | `@fontsource/ibm-plex-mono` 5.3.0 | `"IBM Plex Mono"` | Estático, 400 e 500 (Parte 5.1) | `400.css` e `500.css` |

- Os três pacotes têm `index.css` como entrada principal e exportam `./*.css` e `./files/*` (confirmado com `npm view … main exports`). Subconjunto `latin` (Parte 3.6): na Fase 2, verificar se existe folha só com `latin`; se não existir, declarar o `@font-face` à mão com os ficheiros `files/*-latin-*.woff2`. Os caracteres do português (á, â, ã, à, ç, é, ê, í, ó, ô, õ, ú, “ ” e ·) estão todos no subconjunto `latin`.
- **Porquê Schibsted Grotesk e não Manrope.** A Manrope é geométrica e arredondada, frequente em páginas geradas por IA, e mais branda. A Schibsted Grotesk é um grotesco de jornal, compacto e de terminais firmes: aguenta 72 px em duas linhas no hero e dá a firmeza de uma legenda técnica.
- **Plex Mono** só em etiquetas, anotações, números de etapa, legendas de imagem e rótulos do bloco legal. Nunca em parágrafos.
- **Algarismos tabulares:** `font-variant-numeric: tabular-nums` no telefone e nos números em Plex Sans; a Plex Mono já é monoespaçada.
- **Sem itálicos.** Ênfase por peso (500 ou 600).
- **Fontes de recurso com métricas ajustadas** (`size-adjust`, `ascent-override`, `descent-override` sobre Arial): valores a medir na Fase 2 contra os ficheiros reais e a confirmar no CLS do Lighthouse. Não se fixam aqui números não medidos.
- Serifa: não se aplica a esta direção.

Escala fluida (valores em px calculados com `node -e` para cada largura):

| Nível | `clamp()` | 390 | 768 | 1280 | 1440 | Altura de linha | Espaçamento | Fonte e peso |
|---|---|---|---|---|---|---|---|---|
| display (H1 do hero) | `clamp(2.25rem, 1.2rem + 3.75vw, 4.5rem)` | 36 | 48 | 67,2 | 72 | 1,02 | -0,03em | Schibsted 620, `text-wrap: balance` |
| h1 (páginas legais e 404) | `clamp(2rem, 1.3rem + 2.4vw, 3.25rem)` | 32 | 39,2 | 51,5 | 52 | 1,06 | -0,026em | Schibsted 620 |
| h2 | `clamp(1.75rem, 1.2rem + 1.9vw, 2.75rem)` | 28 | 33,8 | 43,5 | 44 | 1,08 | -0,022em | Schibsted 600 |
| h3 | `clamp(1.1875rem, 1.05rem + 0.45vw, 1.5rem)` | 19 | 20,3 | 22,6 | 23,3 | 1,22 | -0,012em | Schibsted 600 |
| texto grande | `clamp(0.96875rem, 0.83rem + 0.55vw, 1.25rem)` | 15,5 | 17,5 | 20 | 20 | 1,5 | 0 | Plex Sans 400 |
| texto | `clamp(1rem, 0.95rem + 0.2vw, 1.0625rem)` | 16 | 16,7 | 17 | 17 | 1,6 | 0 | Plex Sans 400 |
| pequeno | `0.875rem` | 14 | 14 | 14 | 14 | 1,5 | 0,005em | Plex Sans 400 ou 500 |
| legenda | `0.75rem` | 12 | 12 | 12 | 12 | 1,35 | 0,02em | Plex Mono 500 |
| etiqueta (maiúsculas) | `0.6875rem` abaixo de 768 px, `0.75rem` acima | 11 | 12 | 12 | 12 | 1,35 | 0,07em / 0,09em | Plex Mono 500, `text-transform: uppercase` |
| número de etapa | `1rem` | 16 | 16 | 16 | 16 | 1 | 0,02em | Plex Mono 500, tabular |

O mínimo do texto grande (15,5 px) foi medido na maqueta: com 16 px o subtítulo do hero ocupa 4 linhas a 390 px; com 15,5 px ocupa 3. Em computador fica nos 20 px. Largura máxima de texto corrido: 65 caracteres (`max-width: 36em` a 17 px).

## 6. Espaço, grelha, raios, linhas, sombras e movimento

- **Escala de 4 px:** 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128.
- **Secções:** `padding-block: clamp(4rem, 8vw, 8rem)` (64 px a 390 e 768, 102 px a 1280, 115 px a 1440, 128 px a partir de 1600).
- **Contentor:** largura máxima de 1272 px (dentro dos 1200 a 1280 px pedidos), escolhida para que colunas e grelha de 24 px coincidam; margens laterais de 16 px (abaixo de 640), 24 px (640 a 1023) e 32 px (a partir de 1024).
- **Grelha:** 4 colunas com intervalo de 16 px (abaixo de 640), 8 colunas com 24 px (640 a 1023), 12 colunas com 24 px (a partir de 1024).
- **Hero:** `min-height: clamp(560px, calc(100dvh - 72px), 920px)` (abaixo de 768 px, subtrai também a barra de contacto e a *safe area*); `padding-block: clamp(1.75rem, 5.4vh, 3.5rem)`; intervalo entre linhas da grelha `clamp(2rem, 5.2vh, 3rem)`.
- **Raios (uma escala):** 2 px por omissão (botões, campos, filtros, legendas, etiquetas, fotografias, placa do logótipo), 4 px nos cartões, 6 px no diálogo de projeto e no painel do menu móvel. Círculos só nos alvos das anotações.
- **Linhas:** 1 px `line` em réguas, separadores e cabeçalho; 1 px `cota` nas linhas de cota; 1 px `ink` no contorno do botão secundário; 1 px `muted` nos campos; barra de 2 px `accent` sob o item ativo da navegação; tracejado de 1 px `muted` nos placeholders “Conteúdo a substituir” e “Imagem a substituir”.
- **Sombras:** nenhuma por omissão. Cabeçalho após scroll: `0 1px 0 var(--color-line), 0 8px 24px -16px rgb(26 34 44 / 0.28)`. Diálogo: `0 24px 64px -24px rgb(26 34 44 / 0.35)`. A barra de contacto móvel usa só a linha superior.
- **Botões:** alturas de 44 px (md) e 52 px (lg), 48 px nos botões empilhados em telemóvel; padding horizontal de 20 e 24 px; Plex Sans 600. Primário: `accent` com texto branco, hover `accentHover`. Secundário: transparente com contorno interior de 1 px `ink`, hover `surface`. Ligação com seta: texto `ink` com seta de 20 px, sublinhado em hover e foco. Foco: anel de 2 px `focus` com afastamento de 3 px.
- **Movimento:** 150 ms (hover e cor), 250 ms (menu, sombra do cabeçalho, filtros), 400 ms (entrada: deslocação de 10 px e opacidade, uma vez, com atraso de 60 ms entre no máximo 3 elementos); curva `cubic-bezier(0.2, 0.7, 0.2, 1)`; zoom de 2% nas imagens em hover (400 ms). Opcional: as linhas de cota “desenham-se” na primeira aparição (`scaleX` de 0 a 1 em 400 ms), só com JavaScript ativo e sem `prefers-reduced-motion`; o conteúdo nunca fica escondido.

## 7. Motivos “a planta da obra”

Regra de contenção: no máximo dois motivos por secção, e nenhum atrás de parágrafos.

| Motivo | Onde aparece | Onde não aparece |
|---|---|---|
| Papel de desenho (grelha de 24 px com linha maior a cada 96 px) | Hero, na metade direita, esbatido para o lado do texto; Método de trabalho, atrás da linha temporal | Restantes secções e faixas escuras |
| Linha de cota com traços a 45° em latão | Moldura da fotografia do hero (horizontal sempre; vertical só com margem lateral de pelo menos 56 px, a partir de 1400 px); separadores entre secções seguidas com o mesmo fundo (Hero e Sobre, Serviços e Projetos); cadeia de cotas a ligar as etapas do Método | Cartões, formulário, fotografias fora do hero |
| Anotações numeradas (alvo, linha-guia branca, etiqueta com número em latão) | Só na fotografia do hero: 2 ou 3, com nomes de serviços do Anexo A §5 que a fotografia escolhida mostre de facto; escondidas abaixo de 1024 px | Qualquer outra imagem |
| Algarismos tabulares em Plex Mono | Etapas 01 a 08, anotações, rótulos do bloco legal | Títulos e texto corrido |
| Marca de referência em cruz (9 px, latão) | Marcador das listas com régua: linha de confiança, destaques do Sobre, “O que vai saber” da Transparência | Listas de navegação e de serviços |
| Carimbo (tabela de legenda de uma planta) | Placa do logótipo; bloco “Informação legal” do rodapé, em tabela com rótulos em Plex Mono (firma, NIPC, sede, alvará ou certificado do IMPIC) | Resto do site |
| Pequena cota antes da etiqueta | Etiqueta do hero (única etiqueta em maiúsculas nas três primeiras secções) | Outras secções |

## 8. Tratamento fotográfico

- **Luz:** fim de tarde, quente e rasante, sombras longas e suaves. Nunca flash, nunca HDR.
- **Cor:** saturação contida; tons de betão, pedra, carvalho e latão; pretos levantados (nada abaixo de um carvão próximo de #1E1E1C); sem verdes, azuis ou amarelos saturados. O amarelo-lima nunca aparece nas fotografias.
- **Grão:** muito subtil e igual em todas (o sufixo de estilo da Parte 4.4 já o pede).
- **Enquadramento:** 35 mm; mãos, antebraços e materiais; sujeito ligeiramente à direita do centro e envolvente calma, para permitir recortes 4:3 (hero a 1440 × 900), cerca de 16:9 (hero a 1280 × 720) e 4:5 (telemóvel) com `object-position` no sujeito.
- **Moldura:** raio de 2 px, sem sombra. No hero, cotas à volta.
- **Véu:** o hero não tem texto sobre a fotografia (só etiquetas com fundo próprio), por isso não leva véu. No CTA, véu `dark` com opacidade mínima de 72% na zona do texto (gradiente de 80% no lado do texto para 45% no lado oposto), o que garante 5,16:1 para `onDark` no pior caso.
- **Legenda de IA:** “Imagem ilustrativa gerada por IA”, texto real num `figcaption`, Plex Mono 500 a 12 px, `onDark` sobre `dark` a 86% (8,22:1 no pior caso), padding de 6 × 9 px, raio de 2 px. Canto superior direito no hero (em todas as larguras, longe da barra móvel) e nas imagens das secções; canto inferior direito no CTA. Nunca `aria-hidden`, nunca só em hover.
- **Ajustes propostos aos prompts, se a direção C ganhar** (Parte 4.4): no sufixo de estilo, acento “aged brass”; no `hero`, trocar “wide composition with clean negative space on the left third for a headline” por “subject slightly right of centre with calm surroundings, easy to crop to 4:3, 16:9 and 4:5; a recessed ceiling downlight and an oak joinery panel with a slim brass pull visible in the scene”, para que as anotações 02 e 03 correspondam ao que a imagem mostra; no `sobre`, “brushed copper” passa a “brushed brass”.

## 9. Composição do hero

Medições feitas na maqueta com `getBoundingClientRect`, com a barra de deslocamento vertical visível (15 px); sem ela, as posições horizontais deslocam-se cerca de 7 px.

**Computador, 1440 × 900.** Cabeçalho de 72 px: placa e nome à esquerda, seis itens de navegação (Plex Sans 500, 15 px, intervalo de 26 px, barra de latão sob “Início”), telefone “+351 919 233 372” com “(chamada para a rede móvel nacional)” a 11 px por baixo, e o botão “Pedir orçamento” (md). Hero com 828 px:

- Linha 1 da grelha (colunas 1 a 11): etiqueta em Plex Mono maiúsculas precedida de uma pequena cota em latão; H1 a 72 px em **2 linhas** (“Cada especialidade nas mãos” / “de quem realmente sabe.”), y de 166 a 313.
- Linha 2, colunas 1 a 5 (516 px): subtítulo a 20 px em `muted`, **3 linhas** (y de 373 a 463); os dois botões lado a lado, 52 px (y de 495 a 547); linha de confiança como lista de três linhas com régua e marcador em cruz, ancorada em baixo (y de 716 a 852), na mesma linha de base da fotografia.
- Linha 2, colunas 7 a 12: cota horizontal (24 px) e fotografia de 624 × 469 px (4:3), y de 383 a 852; cota vertical na margem direita; três anotações (01 Revestimentos, 02 Carpintaria, 03 Eletricidade); legenda de IA no canto superior direito.
- Papel de desenho atrás da fotografia e da margem direita, esbatido para a esquerda e para baixo; as linhas passam pelas arestas da fotografia.

**Computador, 1280 × 720.** Hero com 648 px. H1 a 67,2 px em 2 linhas; subtítulo em 3 linhas; botões de y 455 a 507; linha de confiança até y 682; fotografia de 589 × 333 px (perto de 16:9), recorte pelo sujeito; a cota vertical esconde-se (margem de 32 px). Folga mínima de 38 px até ao fim do ecrã. O número de telefone continua visível (a partir de 1280 px); entre 1152 e 1279 px troca pelo botão compacto “Ligar” (nome acessível “Ligar para a LMDreams”); abaixo de 1152 px a navegação passa para o botão de menu.

**Telemóvel, 390 × 844.** Cabeçalho de 64 px: placa de 32 px, nome a 17 px, botão “Pedir orçamento” compacto (40 px) e botão de menu (44 × 40 px). Etiqueta em 2 linhas equilibradas (`text-wrap: balance`); H1 a 36 px em 3 linhas; subtítulo a 15,5 px em 3 linhas; botões empilhados a toda a largura, 48 px (y de 363 a 471); linha de confiança de y 495 a 608; fotografia 4:5 a toda a largura a partir de y 656, com a legenda de IA no canto superior direito (y de 668 a 694), visível acima da barra. Barra de contacto fixa em baixo (“Ligar”, “WhatsApp”, “Pedir orçamento”), 61 px mais a *safe area*: com 34 px de *safe area* começa em y 749, e tudo o que é obrigatório continua acima dela. Sem anotações nem cota vertical.

**Tablet, 768 a 1023 px.** Texto por cima e fotografia 4:3 a toda a largura por baixo, só com a cota horizontal; cabeçalho com “Ligar”, “Pedir orçamento” e menu.

## 10. Aplicação às outras secções

- **Sobre (bg):** separador de cota no topo; imagem 4:5 à esquerda (colunas 1 a 5) e texto à direita (colunas 7 a 12), para alternar com o hero; H2 “A sua obra executada por especialistas.”; destaques em lista com régua e marcador em cruz. Sem etiqueta.
- **Diferenciação (dark #292928):** H2 em `onDark`; grelha assimétrica com a imagem `diferenciacao` (3:2) a ocupar duas colunas e cinco cartões com contorno `line-on-dark`, ícones Lucide de traço 1,5 em `accentOnDark`, títulos `onDark`, texto `muted-on-dark`. Sem papel de desenho.
- **Serviços (bg):** seis cartões com imagem 4:3 em grelha 3 × 2 (título h3 por baixo, raio de 4 px); os outros dez numa lista compacta a duas colunas com ícone `muted`, régua `line` e uma linha de descrição; “Remodelações completas” e “Preparação e coordenação de obra” com peso 600; frase ao visitante e botão “Pedir orçamento”.
- **Método de trabalho (surface, com papel de desenho):** oito etapas em grelha 4 × 2 a partir de 1024 px, ligadas por uma cadeia de cotas com traços de latão entre etapas; números 01 a 08 em Plex Mono; vertical em telemóvel, com a cota à esquerda.
- **Projetos (bg):** filtros com raio de 2 px e contorno `muted`, estado premido em `ink` com texto `onDark`; grelha de placeholders em `sand` com contorno tracejado e “Imagem a substituir”; diálogo com raio de 6 px.
- **Transparência (bg):** lista “O que vai saber” com régua e cruz; imagem 3:2 à direita; parágrafo sobre imprevistos em `muted`.
- **Testemunhos (surface):** três cartões placeholder tracejados, “Conteúdo a substituir”, sem estrelas nem nomes.
- **CTA (dark sobre a imagem `cta`):** véu de 72% ou mais na zona do texto; H2 em `onDark`; primário em latão, “Contactar por telefone” e “Falar por WhatsApp” como secundários com contorno `onDark`; legenda de IA no canto inferior direito.
- **Contactos (bg):** duas colunas; campos de 48 px com contorno `muted`, rótulos Plex Sans 500, ajudas em `muted` a 14 px, erros em `error` com ícone; dados de contacto em lista com régua; telefone com “(chamada para a rede móvel nacional)”.
- **Rodapé (dark):** logótipo sem placa; colunas com ligações `onDark` sublinhadas em hover; bloco “Informação legal” em carimbo; nota das imagens ilustrativas e “©” em `muted-on-dark`.

## 11. Fazer e evitar

Fazer:

- Alinhar tudo à grelha de 12 colunas; fotografias, cotas e réguas a coincidir com as arestas das colunas.
- Guardar o latão para ação e marcação: botão primário, cotas, item ativo, marcadores. Como referência, nunca mais de 5% da área de um ecrã.
- Usar Plex Mono só em rótulos curtos e números.
- Manter as anotações fiéis à fotografia escolhida (rever depois de escolher o hero).
- Usar `accentHover` para texto de acento sobre `surface` e `accentOnDark` nas faixas escuras.
- Deixar ar: uma ideia por secção, títulos curtos, parágrafos de 2 a 4 linhas.

Evitar:

- O amarelo-lima fora do logótipo; redesenhar, recolorir ou “limpar” o logótipo; pousar a placa sobre fotografias.
- Papel de desenho em mais de duas secções; cotas em todas as imagens; anotações fora do hero.
- Etiquetas em maiúsculas por cima de cada título (no máximo uma por cada três secções).
- Preto puro, creme amarelado, gradientes luminosos, vidro fosco, sombras grandes, botões em pílula, ícones em círculos coloridos.
- Texto sobre fotografias sem véu; texto pequeno em latão sobre `surface` ou `dark`; controlos sobre `sand`.
- Espaçamento de letras negativo no texto corrido; maiúsculas em títulos.

## 12. Prompt do board do hero (inglês)

Segue o prompt-modelo da Parte 4.3; o texto fixo do modelo fica intacto, incluindo “brushed copper” (ver problemas em aberto).

```text
Website design mockup of a single desktop landing-page section (1440 px wide) for "LMDreams",
a Portuguese construction and renovation company whose promise is one specialist for each trade.
Section: hero with headline, subtitle, two buttons and a small trust line, under a compact light header 72 px tall. Header, left to right: a small dark charcoal logo plate at the top left (a small charcoal #292928 rectangle containing only a thin lime-yellow #D1CF20 outline of a house roof with a chimney and a small four-pane window; do not invent any other logo, symbol or lettering inside it), the word "LMDreams" in dark ink beside it, six navigation links "Início", "Sobre nós", "Serviços", "Método de trabalho", "Projetos", "Contactos" (the first one marked by a thin brass underline), the phone number "+351 919 233 372" with "(chamada para a rede móvel nacional)" in very small text below it, and a brass "Pedir orçamento" button. Hero content: a small uppercase monospace label "Construção civil e remodelações · Portugal continental" preceded by a tiny brass dimension mark, the headline in two lines across the width, then a left column with the subtitle, the two buttons side by side and the trust line as three short ruled rows with tiny brass crosshair markers.
Palette: warm off-white drafting paper #F6F5F1 background, pale concrete #E8E7E1, stone sand #D6D2C7, blue-black drafting ink #1A222C for headings and text, slate grey #4A5361 for the subtitle, hairlines #D2D2CC, one single aged-brass accent #7A6226 used only on the primary button, tiny tick marks and the active link, charcoal #292928 only inside the logo plate; no other colours. Typography: crisp, firm grotesk headings with compact proportions and tight tracking (like Schibsted Grotesk semibold), neutral engineered sans for body text (like IBM Plex Sans), small monospace annotations and labels (like IBM Plex Mono). Composition: light drafting-paper background with a very faint 24 px technical grid on the right half, fading out towards the text; headline spanning the full width at the top; below it, the text column on the left five columns and, on the right six columns, a framed 4:3 photograph of a craftsman's hands levelling a large natural-stone wall tile with a spirit level, oak joinery with a slim brass pull and a recessed ceiling downlight, framed by thin architectural dimension lines with small 45-degree brass tick marks above and to the right of the photo; three small numbered annotation tags on the photo, "01 Revestimentos", "02 Carpintaria", "03 Eletricidade", each with a thin white leader line and a small target dot; a small dark caption tag in the photo's top right corner reading "Imagem ilustrativa gerada por IA"; the trust rows aligned with the bottom edge of the photograph. Visual language: generous white space, thin structural lines inspired by
architectural floor plans, editorial photography of real materials (concrete, natural stone, oak, brushed copper),
warm light, premium but approachable, not luxurious, not industrial. Headline text: "Cada especialidade nas mãos de quem realmente sabe.".
Subtitle text: "Profissionais com mais de 30 anos de experiência, reunidos para cada etapa da obra, com qualidade, rigor e transparência do início ao fim.".
Primary button text: "Pedir orçamento". Secondary button text (outlined in dark ink): "Conhecer os serviços".
Trust line text: "Mais de 30 anos de experiência · Profissionais especializados · Acompanhamento transparente". Realistic, production-quality web layout, clear hierarchy.
No browser chrome, no device frame, no watermark, no lorem ipsum.
```

## 13. Maqueta

- Ficheiro: `design/maquetas/hero-C.html`, HTML estático e autocontido, CSS num `<style>`, sem JavaScript, sem lorem ipsum.
- Mostra o primeiro ecrã a 1440 × 900 e, abaixo, o início da secção Sobre (visível a 1440 × 1200). Tem regras responsivas de apoio (1280, 1152, 1024, 768 e 380 px) e a barra de contacto móvel abaixo de 768 px.
- A fotografia do hero é um SVG com tons de betão, pedra e carvalho: teto em betão aparente, parede em pedra de grande formato com cruzetas de junta, nível de bolha, painel de carvalho com puxador em latão, foco embutido, luz rasante, linhas de laser e prumo tracejadas e grão. A imagem do Sobre é uma planta desenhada sobre uma mesa de betão com amostras de materiais.
- Logótipo por `<img src="../../logo-lmdreams.png">`, tal como está.
- Fontes: só na maqueta vêm do jsDelivr (`@fontsource-variable/schibsted-grotesk@5.3.0/index.css`, `@fontsource-variable/ibm-plex-sans@5.3.0/index.css`, `@fontsource/ibm-plex-mono@5.3.0/400.css` e `500.css`); o navegador confirmou as três famílias carregadas. No site são autoalojadas. Pilhas de recurso: Helvetica Neue ou Arial nos títulos, Segoe UI ou system-ui no texto, Cascadia Mono ou Consolas nas anotações.

## 14. Problemas em aberto

- O texto fixo do prompt-modelo diz “brushed copper”; nesta direção o metal é latão. Mantive o texto fixo por fidelidade ao modelo; se o orquestrador aceitar, trocar por “brushed brass” no board C e nos prompts de imagem.
- As anotações 02 e 03 dependem de a fotografia do hero mostrar carpintaria e um foco de iluminação; o prompt atual do `hero` só garante a pedra e a carpintaria. Ajuste proposto na secção 8; sem ele, fica só a 01 ou a 01 e a 02.
- O logótipo tem 352 × 188 px: pouco para favicons nítidos e para o rodapé em ecrãs de alta densidade. Não bloqueia (Parte 4.9, ponto de paragem 4); pedir versão vetorial.
- Uniformidade do fundo do PNG a confirmar na Fase 4 para a fusão com `dark` no rodapé.
- Métricas das fontes de recurso por medir (Fase 2).
