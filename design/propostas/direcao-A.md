# Direção A · Betão e Cobre

Proposta da Fase 1 (Workflow 1A) para o site da LMDreams. Maqueta estática do primeiro ecrã: `design/maquetas/hero-A.html` (1440 × 900, com o início da secção Sobre visível a 1440 × 1200 e regras para 1280 × 720 e 390 × 844).

Todos os números desta proposta foram calculados ou medidos (Parte 13): contrastes com a fórmula WCAG 2.x, cores do logótipo lidas pixel a pixel do PNG, larguras de texto medidas com as métricas reais das fontes variáveis (avanços com interpolação HVAR nos eixos usados, sem kerning, o que dá um limite superior).

---

## 1. Nome e ideia

**Betão e Cobre.** O site apresenta-se como uma obra bem executada vista de perto: superfícies de betão e pedra, uma única nota de cobre onde há uma decisão a tomar e linhas finas de planta a marcar alinhamentos e medidas. O primeiro ecrã é uma fotografia de materiais reais a toda a largura, com o texto em baixo à esquerda sobre um véu de carvão, e esse carvão é o do próprio logótipo. Os títulos usam uma grotesca semiexpandida (Archivo a 110 % de largura), com o ar firme da sinalética de obra e da legenda de um desenho técnico; o texto corrido usa uma sem serifa neutra e muito legível (Public Sans). O rigor está nos pormenores: cotas com traço oblíquo, algarismos tabulares, cantos quase retos, tudo alinhado a uma grelha de 12 colunas.

**Como foge ao aspeto genérico de IA**

- O cobre não decora: aparece só no botão primário, no indicador da secção atual, nas ligações com seta, em pequenas marcas de cota e no anel de foco. Não há gradientes de acento, brilhos nem fundos cor de laranja.
- O tom escuro é o carvão medido no logótipo (#292929), não um preto azulado genérico. Nas faixas escuras, a placa do logótipo funde-se com o fundo e fica só a casa amarelo-lima.
- As cotas usam o traço oblíquo a 45° dos desenhos de arquitetura, em vez de pontos, ícones decorativos ou formas orgânicas.
- Botões retangulares com raio de 4 px: sem pílulas, sem vidro fosco, sem sombras largas, sem texto em gradiente.
- Fotografia de materiais e de mãos em luz rasante, nunca pessoas a sorrir para a câmara.
- Ritmo variado entre secções (Parte 5.3) e grelhas assimétricas, em vez da sequência de "três cartões com ícone" repetida.

---

## 2. Tokens de cor

Partem dos valores da Parte 5.1 para a direção A. Há um único ajuste: `dark` passa de #1D2124 para #292929, o fundo medido do logótipo. Os tokens que a Parte 5.1 não definia (`line`, `onDark`, `focus`) foram calculados para esta paleta.

| Token | Hex | Papel | Origem |
|---|---|---|---|
| `bg` | #F4F2EE | fundo principal, pedra clara | Parte 5.1 |
| `surface` | #E6E2DB | secções alternadas, painéis, formulário | Parte 5.1 |
| `sand` | #D9D1C5 | placeholders de imagem, fundos de amostra, estado desativado | Parte 5.1 |
| `ink` | #1D2124 | texto principal, grafite | Parte 5.1 |
| `muted` | #4B5157 | texto secundário, ardósia | Parte 5.1 |
| `line` | #CFC9BF | linhas finas decorativas de 1 px (cotas, separadores) | novo |
| `accent` | #9A5530 | cobre: botão primário, texto de acento só sobre `bg` | Parte 5.1 |
| `accentHover` | #7E4426 | hover do primário; texto de acento sobre `surface` e `sand` | Parte 5.1 |
| `dark` | #292929 | faixas escuras, véu das fotografias, barra móvel, rodapé | ajustado (fundo do logótipo) |
| `onDark` | #EEEBE5 | texto sobre `dark` e sobre fotografia com véu | novo |
| `accentOnDark` | #D39266 | cobre suave sobre `dark`: pormenores, ligações, ícones | Parte 5.1 |
| `focus` | #B56438 | anel de foco sobre fundos claros e sobre `dark` liso | novo |

Tokens auxiliares propostos (pedido ao orquestrador para o `@theme`):

| Token | Hex | Papel |
|---|---|---|
| `lineStrong` | #817C75 | fronteira de controlos (campos, caixas, chips de filtro), ≥ 3:1 |
| `mutedOnDark` | #ABA7A0 | texto secundário sobre `dark` liso (nunca sobre fotografia) |
| `lineOnDark` | #4A4945 | linhas decorativas nas faixas escuras |
| véu | `rgb(41 41 41 / α)` | carvão `dark` com a opacidade da Parte 8 |

Regras:

1. Um único acento (cobre). O amarelo-lima do logótipo nunca sai da placa do logótipo.
2. Texto pequeno em cobre só sobre `bg` (`accent`, 5,05:1). Sobre `surface` e `sand`, texto de acento em `accentHover`. `accent` sobre `surface` (4,38:1) só para texto grande ou elementos gráficos.
3. Botão primário: texto branco #FFFFFF sobre `accent` (5,65:1); hover `accentHover` (7,66:1).
4. Nunca preto puro nem branco puro como fundo de secção. O único branco é o texto dos botões primários.
5. Neutros de pedra e betão: `bg`, `surface` e `sand` são pedras quentes pouco saturadas; `ink` e `muted` são grafites ligeiramente frios. Nada de creme amarelado.
6. Sobre fotografia com véu, todo o texto é `onDark`; `mutedOnDark` não vai para cima de fotografias (exigiria α ≥ 0,91).
7. Anel de foco: 2 px, afastamento de 3 px, `focus` sobre fundos claros e `dark` liso; sobre fotografia com véu, o anel passa a `onDark` (classe `.on-dark`).

---

## 3. Contrastes calculados

Fórmula de luminância relativa WCAG 2.x (sRGB linearizado, 0,2126 R + 0,7152 G + 0,0722 B), calculada com `node` (Parte 13).

| Par | Cores | Razão | Uso | Resultado |
|---|---|---|---|---|
| ink / bg | #1D2124 / #F4F2EE | 14,50 | texto | passa AA e AAA |
| ink / surface | #1D2124 / #E6E2DB | 12,56 | texto | passa |
| ink / sand | #1D2124 / #D9D1C5 | 10,71 | texto | passa |
| muted / bg | #4B5157 / #F4F2EE | 7,19 | texto secundário | passa |
| muted / surface | #4B5157 / #E6E2DB | 6,22 | texto secundário | passa |
| muted / sand | #4B5157 / #D9D1C5 | 5,31 | texto em placeholders | passa |
| accent / bg | #9A5530 / #F4F2EE | 5,05 | texto pequeno de acento | passa |
| branco / accent | #FFFFFF / #9A5530 | 5,65 | botão primário | passa |
| branco / accentHover | #FFFFFF / #7E4426 | 7,66 | botão primário em hover | passa |
| accent / surface | #9A5530 / #E6E2DB | 4,38 | só texto grande ou UI (≥ 3:1) | passa para esse uso; não serve para texto pequeno |
| accentHover / surface | #7E4426 / #E6E2DB | 5,93 | texto pequeno de acento | passa |
| accentHover / bg | #7E4426 / #F4F2EE | 6,85 | ligações em hover | passa |
| accentHover / sand | #7E4426 / #D9D1C5 | 5,06 | texto de acento | passa |
| onDark / dark | #EEEBE5 / #292929 | 12,23 | texto em faixas escuras | passa |
| mutedOnDark / dark | #ABA7A0 / #292929 | 6,07 | texto secundário escuro | passa |
| accentOnDark / dark | #D39266 / #292929 | 5,59 | ligações e pormenores em faixas escuras | passa (era 6,23 com o `dark` antigo) |
| accent / dark | #9A5530 / #292929 | 2,57 | limite do botão primário numa faixa escura | informativo: o botão identifica-se pelo texto branco (5,65) |
| line / bg | #CFC9BF / #F4F2EE | 1,47 | linha decorativa | sem requisito (não é fronteira de controlo) |
| line / surface | #CFC9BF / #E6E2DB | 1,27 | linha decorativa | sem requisito |
| lineStrong / bg | #817C75 / #F4F2EE | 3,70 | fronteira de controlo | passa (≥ 3:1) |
| lineStrong / surface | #817C75 / #E6E2DB | 3,21 | fronteira de controlo | passa (≥ 3:1) |
| lineOnDark / dark | #4A4945 / #292929 | 1,61 | linha decorativa | sem requisito |
| focus / bg | #B56438 / #F4F2EE | 3,88 | anel de foco | passa (≥ 3:1) |
| focus / surface | #B56438 / #E6E2DB | 3,36 | anel de foco | passa |
| focus / dark | #B56438 / #292929 | 3,36 | anel de foco | passa |
| amarelo do logótipo / dark | #D1CF20 / #292929 | 8,77 | informativo | o grafismo lê-se bem nas faixas escuras |
| amarelo medido / dark | #D0CF22 / #292929 | 8,75 | informativo | média dos pixels sólidos do PNG |
| amarelo do logótipo / bg | #D1CF20 / #F4F2EE | 1,48 | informativo | explica porque não pode ser acento |
| amarelo do logótipo / branco | #D1CF20 / #FFFFFF | 1,66 | informativo | idem |

**Texto sobre fotografia (véu carvão, pior caso: pixel branco por baixo).** Opacidade mínima do véu calculada:

| Texto | Mínimo exigido | α mínimo do véu |
|---|---|---|
| `onDark`, texto normal | 4,5:1 | 0,70 |
| `onDark`, título (≥ 24 px) | 3:1 | 0,56 |
| branco, texto normal | 4,5:1 | 0,64 |
| `mutedOnDark`, texto normal | 4,5:1 | 0,91 (por isso não se usa sobre fotografia) |

Legenda de IA num chip `rgb(41 41 41 / 0,85)` sobre pixel branco: `onDark` a 7,56:1.

---

## 4. Logótipo e diálogo com o amarelo-lima

**O que o ficheiro tem (medido).** `logo-lmdreams.png`, 352 × 188 px, RGBA mas totalmente opaco (alfa mínimo 255), com blocos `sRGB` e `gAMA` (cores fiéis no navegador). Fundo carvão #292929 (70,8 % dos pixels; média das margens #292929) com ruído de ±2 de uma compressão anterior (7 691 cores distintas). Grafismo de uma cor, amarelo-lima (média #D0CF22; referência do orquestrador #D1CF20): contorno de telhado com chaminé e janela de quatro vidros. Área do grafismo: 247 × 135 px, a começar em (48, 39). Não tem texto.

**Uso, sempre tal como está (Parte 4.9):**

- **Cabeçalho claro.** O retângulo do ficheiro funciona como uma placa de obra: 44 px de altura (82 × 44) a partir de 1280 px, 40 px entre 1024 e 1279 px e 32 px (60 × 32) em telemóvel, com cantos de 4 px por CSS, sem contorno nem sombra. A 44 px, o ficheiro tem 4,3 vezes a resolução necessária (chega para ecrãs 2×). Ao lado, o nome "LMDreams" em texto HTML (Archivo, peso 650, largura 112 %, 20 px). A placa tem a mesma altura do botão "Pedir orçamento" (44 px): os dois extremos do cabeçalho alinham. Ligação com o nome acessível "LMDreams, voltar ao início"; `alt=""` na imagem, porque o nome já está no texto.
- **Rodapé e faixas escuras.** `dark` = #292929 = fundo do logótipo: a placa desaparece e fica só a casa amarelo-lima, sem cantos nem moldura. Altura recomendada no rodapé: 64 px (120 × 64; 2,9 vezes de resolução). Se o token `dark` mudar, as arestas da placa voltam a ver-se: o `dark` fica preso ao valor medido.
- **Favicon e ícones.** Recorte quadrado do próprio ficheiro à volta do grafismo, completando o fundo com o mesmo #292929 (não é redesenho). Com 247 px de largura, o traço do telhado fica com cerca de 0,3 px a 16 px: é provável que fique ilegível. Pedir versão vetorial (ponto de paragem 4, não bloqueia) e assinalar no relatório. `apple-touch-icon` 180 px e ícones 192 e 512 px com fundo #292929; `theme-color` #F4F2EE (igual ao cabeçalho).
- **Imagem OG.** Fundo `dark`: a placa funde-se, a casa fica sobre o carvão junto da frase.

**Diálogo de cor.**

- O amarelo-lima (cerca de 60° de matiz, muito luminoso) e o cobre (21°, baixo e terroso) são dois quentes afastados. Juntos em superfícies grandes chocariam; lado a lado em pequenos elementos, lembram a sinalização de obra ao lado de um material nobre. Por isso nunca se tocam: no cabeçalho, a placa fica no extremo esquerdo e o cobre no extremo direito, com a navegação em grafite pelo meio; no rodapé, o cobre suave (`accentOnDark`) fica só em estados de hover e marcas de cota, longe do logótipo.
- O amarelo-lima não é acento: 1,48:1 sobre `bg` e 1,66:1 sobre branco (inutilizável em texto ou botões claros). Nas faixas escuras teria 8,77:1, mas usá-lo lá criaria um segundo acento. Fica só dentro do logótipo.
- O carvão do logótipo é o `dark` do site, e o `ink` (#1D2124) é um grafite um pouco mais fundo e frio: no cabeçalho, a placa lê-se como um objeto físico pousado na página, não como uma mancha de texto.
- O cobre da Parte 5.1 mantém-se: continua AA em todos os usos e fica tonalmente longe do lima. Não foi preciso mudá-lo.

---

## 5. Tipografia

| Papel | Pacote | Versão (npm view) | Ficheiro CSS | Família | Eixos e pesos usados |
|---|---|---|---|---|---|
| Títulos (`font-display`) | `@fontsource-variable/archivo` | 5.3.0 | `wdth.css` | "Archivo Variable" | `wght` 600 a 650; `wdth` (`font-stretch`) 106 a 112 % |
| Texto (`font-body`) | `@fontsource-variable/public-sans` | 5.3.0 | `wght.css` | "Public Sans Variable" | `wght` 400, 500, 600 |

- Confirmado no pacote: `wdth.css` declara `font-weight: 100 900` e `font-stretch: 62% 125%` (os dois eixos no mesmo ficheiro). Subconjunto `latin` (U+0000 a U+00FF, mais aspas curvas, € e ·) cobre o português. Peso em latin: Archivo `wdth` 90 104 bytes, Public Sans 26 832 bytes.
- Valores por omissão das fontes (lidos da tabela `fvar`): Archivo `wght` 600 e `wdth` 100; Public Sans `wght` 100. Declarar sempre o peso em `body` (400), para nunca herdar o 100.
- As duas têm `tnum` (algarismos tabulares). Os algarismos do Archivo são proporcionais por omissão (o 0 mede 25,3 px e o 1 mede 24,2 px a 40 px): usar `font-variant-numeric: tabular-nums` nos números de etapa, no telefone e em tabelas.
- `@fontsource-variable/inter` 5.3.0 também existe, mas Inter é a escolha mais comum em sites gerados por IA; Public Sans tem um desenho institucional mais seco, que combina com o Archivo.
- Carregamento no site (Parte 3.6): importar `@fontsource-variable/archivo/wdth.css` e `@fontsource-variable/public-sans/wght.css`, pré-carregar só o woff2 latin do Archivo (é a fonte do H1), `font-display: swap` com fontes de recurso ajustadas (`size-adjust`, `ascent-override`) para Arial e Segoe UI.
- Serifa: não se aplica a esta direção.

**Escala fluida** (valores calculados; px a 390 / 768 / 1280 / 1440 de largura):

| Token | `clamp()` | 390 | 768 | 1280 | 1440 | Altura de linha | Espaçamento | Fonte |
|---|---|---|---|---|---|---|---|---|
| display (H1 do hero) | `clamp(2.25rem, 1.1rem + 3.6vw, 4.125rem)` | 36 | 45,2 | 63,7 | 66 | 1,02 | −0,022em | Archivo 640, 110 % (106 % abaixo de 768 px) |
| h1 (páginas legais, 404) | `clamp(2rem, 1.2rem + 2.4vw, 3.25rem)` | 32 | 37,6 | 49,9 | 52 | 1,05 | −0,02em | Archivo 640, 110 % |
| h2 | `clamp(1.75rem, 1.1rem + 1.9vw, 2.875rem)` | 28 | 32,2 | 41,9 | 45 | 1,1 | −0,015em | Archivo 620, 110 % |
| h3 | `clamp(1.25rem, 1.05rem + 0.55vw, 1.5rem)` | 20 | 21 | 23,8 | 24 | 1,25 | −0,005em | Archivo 600, 106 % |
| h3 compacto (listas, destaques) | `1.125rem` | 18 | 18 | 18 | 18 | 1,3 | −0,005em | Archivo 600, 106 % |
| texto grande | `clamp(1.0625rem, 0.9rem + 0.45vw, 1.25rem)` | 17 | 17,9 | 20 | 20 | 1,5 | −0,005em | Public Sans 400 |
| texto | `clamp(1rem, 0.96rem + 0.12vw, 1.0625rem)` | 16 | 16,3 | 16,9 | 17 | 1,6 | 0 | Public Sans 400 |
| pequeno | `0.875rem` | 14 | 14 | 14 | 14 | 1,45 | 0,005em | Public Sans 400 e 500 |
| legenda | `0.75rem` | 12 | 12 | 12 | 12 | 1,3 | 0,01em | Public Sans 500 |
| etiqueta (maiúsculas) | `0.75rem` | 12 | 12 | 12 | 12 | 1,4 | 0,09em | Public Sans 600 |
| navegação e botões | `0.9375rem` (md) e `1rem` (lg) | 14 a 16 | 14 a 16 | 15 a 16 | 15 a 16 | 1 a 1,2 | 0,005em | Public Sans 500 (navegação) e 600 (botões) |

Exceção medida: o subtítulo do hero, abaixo de 768 px, usa `0.96875rem` (15,5 px) com −0,005em, para caber em 3 linhas em 358 px ("Profissionais com mais de 30 anos de experiência," / "reunidos para cada etapa da obra, com qualidade," / "rigor e transparência do início ao fim."). A 16 px dá 4 linhas.

Largura de linha do texto: 65 caracteres no máximo (`max-width: 34em` no texto, `29em` no subtítulo do hero, `30em` nos textos grandes). Títulos com `text-wrap: balance`.

---

## 6. Espaço, grelha, raios, linhas, sombras e movimento

- **Escala de 4 px:** 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96, 128.
- **Secções:** `padding-block: clamp(4rem, 8vw, 8rem)` (64 px até 800 px de largura, 102 px a 1280, 115 px a 1440).
- **Contentor:** 1280 px de conteúdo (`max-width: calc(1280px + 2 × margem)`), margens de 16 px (< 640), 24 px (640 a 1023) e 32 px (≥ 1024). Grelha de 12 colunas com 32 px de intervalo (24 px abaixo de 1024, uma coluna abaixo de 768).
- **Raios, uma só escala:** 2 px (legendas, chips, campos, caixas), 4 px (botões, cartões, imagens, placa do logótipo), 6 px (diálogos e painéis grandes). Nada acima de 6 px.
- **Linhas:** 1 px `line` para separadores e cotas; 1 px `lineStrong` nas fronteiras de controlos; 1 px `lineOnDark` nas faixas escuras; 2 px `accent` só no indicador da secção atual.
- **Sombras (raras):** cabeçalho ao fazer scroll `0 1px 0 var(--line), 0 8px 24px -16px rgb(29 33 36 / 0.28)`; diálogo `0 24px 48px -24px rgb(29 33 36 / 0.45)`. Cartões sem sombra (separação por linhas e fundos).
- **Movimento:** 150 ms (hover, cor e fundo de botões), 250 ms (sublinhados, menu, chips), 400 ms (entrada ao aparecer: 10 px de deslocação e opacidade, uma vez; zoom de 2 % nas imagens em hover). Curva única `cubic-bezier(0.2, 0.7, 0.2, 1)`. Com `prefers-reduced-motion: reduce`, sem transições nem animações. O estado inicial "escondido" só se aplica com JavaScript ativo e sem redução de movimento (Parte 5.3).
- **Botões:** md 44 px, lg 52 px; padding horizontal 20 e 28 px; primário `accent` com texto branco; secundário transparente com contorno de 1 px `ink` (em fundo escuro, contorno e texto `onDark`, hover `rgb(238 235 229 / 0.12)`); ligação com seta em `accent` sobre `bg` (ou `accentHover` sobre `surface`), sublinhada em hover e foco; ativo desce 1 px; desativado com fundo `sand` e texto `muted` (5,31:1).

---

## 7. Motivos gráficos: "a planta da obra"

Um tempero, não um tema. Onde aparecem:

1. **Cota de separação** no topo das secções claras que seguem outra secção clara (Sobre, Método de trabalho, Contactos): linha de 1 px `line` à largura do contentor, com traços oblíquos a 45° nos extremos e um terceiro traço alinhado com o início da coluna de imagem. Não se repete em secções seguidas nem antes de faixas escuras.
2. **Pequena cota em cobre** (├──┤, 28 × 9 px) antes da etiqueta do hero. É a única etiqueta das três primeiras secções (Parte 5.3).
3. **Linha de confiança do hero** assente numa linha de cota com remates verticais, e itens separados por traços verticais em `accentOnDark`.
4. **Números de etapa 01 a 08** (Método) em Archivo 600 tabular, cor `accent` sobre `bg`, com uma linha de ligação de 1 px e traços oblíquos em cada etapa. Grelha técnica discreta (quadrícula de 24 px em `line` a 35 % de opacidade) só no fundo desta secção.
5. **Legenda de desenho** (o "carimbo" das plantas) no bloco "Informação legal" do rodapé: caixa de linhas `lineOnDark` com rótulos pequenos (Firma, NIPC, Sede, Alvará ou certificado do IMPIC) e os valores ou placeholders.
6. **Placeholders do plano B:** linhas de planta em `ink` a 40 % sobre `sand`, com a etiqueta "Imagem a substituir".

Onde não aparecem: por cima do texto, dentro de botões, nos cartões de testemunhos e na barra móvel. Sobre fotografias reais, no máximo uma linha de cota junto à margem, nunca a atravessar o assunto.

---

## 8. Tratamento fotográfico

- **Luz:** natural, quente, de fim de tarde, rasante e lateral (da direita no hero), com sombras longas e suaves. Sem flash direto nem HDR.
- **Cor:** betão, pedra, carvalho e cobre como materiais; saturação contida; brancos ligeiramente quentes; pretos com detalhe (nunca esmagados). O cobre aparece na fotografia só como material (amostra, perfil, torneira escovada), nunca como luz colorida.
- **Grão:** muito subtil e uniforme, igual em todas as imagens (a referência de estilo é o hero, Parte 4.4).
- **Enquadramento:** 35 mm, verticais direitas, perspetiva correta, profundidade de campo curta; pessoas só como mãos e antebraços. No hero, o assunto fica no **terço superior direito**; a metade inferior esquerda é espaço negativo calmo e mais escuro, onde assenta o texto (o título a 66 px ocupa até 74 % da largura; ver pedido ao orquestrador na Parte 13).
- **Véu sobre fotografia (hero e CTA):** carvão `dark` em duas camadas, com paragens em px ligadas ao contentor, para seguir o bloco de texto em qualquer largura:

```css
--cx: max(var(--gutter), calc((100% - 1280px) / 2));
background:
  linear-gradient(to right,
    rgb(41 41 41 / 0.80) 0,
    rgb(41 41 41 / 0.66) calc(var(--cx) + 480px),
    rgb(41 41 41 / 0.34) calc(var(--cx) + 1020px),
    rgb(41 41 41 / 0) calc(var(--cx) + 1300px)),
  linear-gradient(to top,
    rgb(41 41 41 / 0.80) 0,
    rgb(41 41 41 / 0.62) 300px,
    rgb(41 41 41 / 0.40) 520px,
    rgb(41 41 41 / 0) 700px);
/* abaixo de 768 px, só vertical: */
background: linear-gradient(to top,
  rgb(41 41 41 / 0.88) 0, rgb(41 41 41 / 0.80) 470px,
  rgb(41 41 41 / 0.32) 570px, rgb(41 41 41 / 0) 660px);
```

  Verificado no pior caso (pixel branco) no canto superior direito de cada caixa de texto, a 1440 × 900, 1280 × 720, 1920 × 1080 e 390 × 844: α entre 0,64 e 0,90, contraste do título ≥ 3,86:1 e do texto normal ≥ 5,89:1 (tabela na Parte 13). Na Fase 3, com a fotografia escolhida, medir o pixel mais claro sob cada caixa de texto; o véu só pode ser aliviado se o contraste real continuar ≥ 4,5:1 (texto) e ≥ 3:1 (título).
- **Legenda "Imagem ilustrativa gerada por IA":** texto real no DOM, `figcaption` ou elemento sobreposto, 12 px, peso 500, `onDark` sobre chip `rgb(41 41 41 / 0.85)` com raio de 2 px e padding de 6 × 10 px (7,56:1 no pior caso). Canto inferior direito a 24/20 px das margens em computador; canto superior direito a 12 px em telemóvel, onde a barra móvel nunca chega. Em imagens de secção (Sobre, Serviços), canto inferior direito a 12 px.
- **Cantos e recortes:** imagens com 4 px; hero 16:9 e recorte 4:5 para telemóvel (assunto no terço superior); zoom máximo de 2 % em hover.

---

## 9. Composição do hero

Estrutura comum: cabeçalho claro fixo; fotografia a toda a largura; véu carvão; bloco de texto alinhado em baixo e à esquerda do contentor: etiqueta, H1, subtítulo, dois botões, linha de confiança. Legenda de IA num canto.

**Computador, 1440 × 900**

- Cabeçalho de 72 px, fundo `bg`, linha inferior de 1 px `line`. Da esquerda para a direita: placa (82 × 44) e "LMDreams"; navegação de seis itens (15 px, peso 500, intervalo de 28 px, "Início" com traço de 2 px em cobre e `aria-current="location"`); divisória vertical de 1 px; telefone "+351 919 233 372" (15 px, 600, tabular, ícone em cobre) com "(chamada para a rede móvel nacional)" por baixo a 12 px em `muted`; botão primário "Pedir orçamento" (44 px). Largura medida: 1 243 de 1 280 px.
- Hero de 828 px (`min-height: clamp(560px, calc(100dvh - 72px), 960px)`). Padding inferior de 7vh (63 px). Medidas de baixo para cima: linha de confiança 63 a 98 px; botões lg (52 px) 130 a 182 px; subtítulo a 20 px em 3 linhas, 218 a 308 px; H1 a 66 px em 2 linhas, 332 a 467 px; etiqueta 487 a 504 px. Ficam 324 px livres no topo para a fotografia.
- H1 medido: "Cada especialidade nas mãos" 979 px e "de quem realmente sabe." 826 px (`max-width: 16.5em` = 1 089 px, `text-wrap: balance`). Subtítulo em 3 linhas com `max-width: 29em` (580 px). Linha de confiança com cerca de 665 px.
- Legenda de IA no canto inferior direito, longe da linha de confiança.

**Computador, 1280 × 720**

- Cabeçalho: navegação com intervalo de 20 px, sem divisória; 1 186 de 1 216 px.
- Hero de 648 px, H1 a 63,7 px (linha 1 com 944 px), subtítulo a 20 px em 3 linhas. O bloco ocupa 487 px com o padding: ficam 161 px de fotografia no topo e os dois botões e a linha de confiança ficam visíveis sem scroll.
- Entre 1024 e 1279 px: placa de 40 px, navegação a 14 px com intervalo de 14 px, botão compacto "Ligar" (ícone e texto, nome acessível "Ligar para a LMDreams") e "Pedir orçamento" a 40 px; 943 de 960 px a 1024. Entre 768 e 1023 px: placa, "Ligar", "Pedir orçamento" e botão de menu.

**Telemóvel, 390 × 844**

- Cabeçalho de 64 px: placa de 32 px, "LMDreams" a 16 px, "Pedir orçamento" compacto (40 px) e botão de menu (40 × 40, `aria-expanded`, `aria-controls`); 349 de 358 px.
- Barra de contacto móvel fixa em baixo, 60 px mais a *safe area*, fundo `dark`: "Ligar", "WhatsApp" e "Pedir orçamento" (célula em `accent` com texto branco).
- Hero com `min-height` de 100dvh menos 64 px, menos 60 px, menos a *safe area* (720 px sem *safe area*). Fotografia 4:5 com o assunto no topo; véu só vertical.
- Bloco de texto (480 px): etiqueta em 2 linhas; H1 a 36 px, largura 106 %, em 3 linhas ("Cada especialidade" / "nas mãos de quem" / "realmente sabe.", a mais larga com 338 px); subtítulo a 15,5 px em 3 linhas; botões empilhados a toda a largura (48 px); linha de confiança em 3 linhas, cada item com um pequeno traço de cota. Ficam cerca de 240 px de fotografia livre no topo, e nada fica por baixo da barra.
- Legenda de IA no canto superior direito da imagem.

---

## 10. Como a direção se aplica às outras secções

- **Sobre (`bg`):** cota de separação; H2 e dois parágrafos nas colunas 1 a 6; três destaques em lista com ícone de traço 1,5 e linhas `line`; imagem 4:5 nas colunas 8 a 12, alinhada com o topo do H2. Sem etiqueta.
- **Diferenciação (`dark`, faixa escura 1 de 3):** H2 "Não acreditamos no “faz-tudo”. Acreditamos em especialistas." em `onDark`; grelha assimétrica de cinco diferenciais (dois largos e três estreitos) separados por linhas `lineOnDark`, sem cartões com fundo; ícones em `accentOnDark`; imagem 3:2 à direita. A placa do logótipo não aparece aqui.
- **Serviços (`surface`):** seis cartões com imagem 4:3 (raio 4 px, legenda de IA) e lista compacta dos restantes dez em duas colunas, com ícone e uma linha; "Remodelações completas" e "Preparação e coordenação de obra" com título em peso 600 e uma pequena cota em cobre; termina com "Pedir orçamento". Texto de acento em `accentHover`.
- **Método de trabalho (`bg` com quadrícula técnica):** 01 a 08 em Archivo tabular cor `accent`, grelha de 4 × 2 com linha de ligação a partir de 1024 px; vertical em telemóvel; `<ol>` semântica.
- **Projetos (`bg`):** chips de filtro (raio 2 px, contorno `lineStrong`, `aria-pressed` com fundo `ink` e texto `bg`); grelha de três colunas de placeholders tracejados "Conteúdo a substituir" em `sand`.
- **Transparência (`surface`):** imagem 3:2 à esquerda (espelho do Sobre, para variar o ritmo) e lista "O que vai saber" com traços de cota em vez de marcadores.
- **Testemunhos (`bg`):** três cartões tracejados "Conteúdo a substituir", sem estrelas nem fotografias, com aspas curvas grandes em `line`.
- **CTA (fotografia `cta` com véu, faixa escura 2 de 3):** H2 em `onDark`, três botões (primário, e "Contactar por telefone" e "Falar por WhatsApp" como secundários claros); legenda de IA no canto inferior direito.
- **Contactos (`bg`):** cota de separação; formulário num painel `surface` (campos com contorno `lineStrong`, raio 2 px, foco `focus`) e dados de contacto em lista com linhas `line`.
- **Rodapé (`dark`, faixa escura 3 de 3):** logótipo fundido no carvão, ligações `onDark` com hover em `accentOnDark`, textos secundários em `mutedOnDark`, "Informação legal" como legenda de desenho, Livro de Reclamações e RAL.

---

## 11. O que fazer e o que evitar

**Fazer**

- Guardar o cobre para ações e pormenores de medida; se uma página tiver muito cobre, retirar primeiro os ícones.
- Alinhar tudo à grelha de 12 colunas e deixar o alinhamento visível através das cotas.
- Usar fotografias com luz rasante e materiais verdadeiros, sempre com legenda de IA.
- Medir o contraste real de cada fotografia com véu antes de aceitar.
- Usar algarismos tabulares em números de etapa, telefone e dados.
- Manter o `dark` igual ao fundo do logótipo (#292929).

**Evitar**

- Amarelo-lima fora do logótipo; segundo acento; gradientes de cobre; texto em cobre sobre `surface` ou `sand` (usar `accentHover`).
- Cantos acima de 6 px, botões em pílula, vidro fosco, sombras largas, texto em gradiente.
- Linhas de planta por cima de texto ou a atravessar o assunto de uma fotografia; mais de uma quadrícula técnica no site.
- `mutedOnDark` sobre fotografia; texto de 12 px sobre fotografia sem chip de fundo.
- Fotografias de banco com pessoas a posar, capacetes em pose, CGI, aspeto de luxo.
- Largura do Archivo acima de 112 % (perde legibilidade) ou abaixo de 104 % (perde o carácter).

---

## 12. Prompt do board do hero (inglês, modelo da Parte 4.3)

```text
Website design mockup of a single desktop landing-page section (1440 px wide) for "LMDreams",
a Portuguese construction and renovation company whose promise is one specialist for each trade.
Section: hero with a compact light header and a full-bleed photograph. Header: at the top left a small dark charcoal rectangular logo plate (#292929) containing a thin lime-yellow (#D1CF20) outline of a house roof with a chimney and a four-pane window, used exactly as given (do not invent any other logo, symbol or wordmark), followed by the name "LMDreams" in plain text; six navigation links "Início", "Sobre nós", "Serviços", "Método de trabalho", "Projetos", "Contactos"; the phone number "+351 919 233 372" with "(chamada para a rede móvel nacional)" in small type below it; a solid copper "Pedir orçamento" button. Hero text block: a small uppercase label "Construção civil e remodelações · Portugal continental", a two-line headline, the subtitle "Profissionais com mais de 30 anos de experiência, reunidos para cada etapa da obra, com qualidade, rigor e transparência do início ao fim.", two buttons "Pedir orçamento" (solid copper, white text) and "Conhecer os serviços" (thin light outline), and a small trust line "Mais de 30 anos de experiência · Profissionais especializados · Acompanhamento transparente" set on a thin dimension line with end ticks; a small caption chip "Imagem ilustrativa gerada por IA" in the bottom-right corner of the photograph.
Palette: concrete and copper: warm stone off-white #F4F2EE, pale stone #E6E2DB, sand #D9D1C5, graphite ink #1D2124, slate grey #4B5157, logo charcoal #292929, light stone text on dark #EEEBE5, one single copper accent #9A5530 (hover #7E4426, soft copper on dark #D39266); the lime yellow #D1CF20 appears only inside the logo plate. Typography: strong semi-expanded grotesk headings (Archivo at about 110 % width, semibold, tight tracking), highly legible neutral sans body (Public Sans), tabular figures. Composition: full-bleed photograph under the light header; text block bottom-left over a soft charcoal gradient veil that fades towards the upper right; the subject, a craftsman's hands levelling a large-format natural stone wall tile, sits in the upper right in raking late-afternoon light, with calm darker negative space across the lower left; thin architectural dimension lines with oblique 45-degree ticks, used sparingly. Visual language: generous white space, thin structural lines inspired by
architectural floor plans, editorial photography of real materials (concrete, natural stone, oak, brushed copper),
warm light, premium but approachable, not luxurious, not industrial. Headline text: "Cada especialidade nas mãos de quem realmente sabe.".
Primary button text: "Pedir orçamento". Realistic, production-quality web layout, clear hierarchy.
No browser chrome, no device frame, no watermark, no lorem ipsum.
```

---

## 13. Verificações feitas e pontos em aberto

**Verificações (comandos permitidos: `npm view` e `node`, sem ficheiros temporários no projeto)**

1. `npm view` confirmou `@fontsource-variable/archivo` 5.3.0, `@fontsource-variable/public-sans` 5.3.0 e `@fontsource-variable/inter` 5.3.0. A API de metadados do jsDelivr confirmou que existem `wdth.css`, `wght.css` e `standard.css` no Archivo e `wght.css` na Public Sans, e os tamanhos dos woff2 latin.
2. Leitura do PNG do logótipo com `node` e `zlib` (descodificação dos filtros PNG): dimensões, blocos, alfa, histograma de cores, média das margens e caixa do grafismo (Parte 4).
3. Contrastes WCAG 2.x de todos os pares da Parte 3 e pesquisa do `focus` (matiz 16 a 28°), otimizando o mínimo contra `bg`, `surface` e `dark`.
4. Opacidade mínima do véu no pior caso e verificação das caixas de texto em quatro tamanhos de ecrã:

| Ecrã | Caixa (canto superior direito) | α | Contraste no pior caso |
|---|---|---|---|
| 1440 × 900 | etiqueta / H1 linha 1 / H1 linha 2 / subtítulo / botão secundário / confiança | 0,80 / 0,65 / 0,74 / 0,85 / 0,90 / 0,88 | 6,32 / 3,96 / 5,21 / 7,43 / 8,94 / 8,46 |
| 1280 × 720 | idem | 0,80 / 0,67 / 0,76 / 0,85 / 0,90 / 0,89 | 6,45 / 4,24 / 5,49 / 7,54 / 9,03 / 8,55 |
| 1920 × 1080 | etiqueta / H1 linha 1 / subtítulo / confiança | 0,79 / 0,64 / 0,84 / 0,88 | 6,20 / 3,86 / 7,31 / 8,44 |
| 390 × 844 | etiqueta / H1 / subtítulo / confiança | 0,78 / 0,81 / 0,83 / 0,87 | 5,89 / 6,54 / 7,02 / 7,93 |

   Na maqueta (substituto da fotografia conhecido), o contraste real do texto vai de 6,85:1 (fim da linha 1 do H1, sobre a pedra iluminada) a 11,99:1.
5. Larguras de texto com as métricas reais (woff2 descomprimido com Brotli; tabelas `cmap`, `hmtx`, `fvar`, `avar` e `HVAR`): H1 em 1440, 1280, 768 e 390 px, subtítulo em quatro larguras, cabeçalho em 1440, 1280, 1024 e 390 px, etiqueta, linha de confiança, barra móvel e legenda de IA. Sem kerning: os valores reais serão iguais ou ligeiramente menores.

**Pontos em aberto**

- A maqueta não foi vista num navegador nesta fase (fora das ferramentas atribuídas): falta a captura do orquestrador a 1440 × 900 e 1440 × 1200 (e, se possível, 1280 × 720 e 390 × 844).
- As fontes da maqueta vêm do jsDelivr; sem rede, a captura usa as fontes de recurso e as medidas mudam.
- O cabeçalho entre 1024 e 1279 px fica justo (943 de 960 px a 1024): confirmar com Playwright; alternativa, navegação em linha só a partir de 1152 px.
- O favicon a 16 px deve ficar ilegível com o PNG atual: pedir versão vetorial ao Andre (ponto de paragem 4, não bloqueia).
- O Archivo com eixo de largura pesa 90 KB (latin), contra 35 KB só com o peso: é o custo do carácter semiexpandido. Pré-carregar só esse ficheiro.
