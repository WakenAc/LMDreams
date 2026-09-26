# Direção B · Pedra e Terracota ("Cantaria e telha")

Proposta da Fase 1 (Workflow 1A). Maqueta estática do primeiro ecrã: `design/maquetas/hero-B.html` (1440×900, com excerto da secção Sobre por baixo).

## 1. Ideia

O site é tratado como uma fachada portuguesa bem construída: uma base de pedra clara (a cantaria, o calcário), uma cobertura de telha (a terracota) e, por baixo de tudo, o desenho técnico que as antecede. O logótipo é um telhado; o acento do site é a cor da telha que o cobre e o carvão do próprio logótipo passa a ser o carvão do site, o que faz do logótipo uma peça da paleta e não um elemento estranho. Os títulos usam uma serifa editorial com tamanho ótico de display, herdeira da letra gravada em pedra, e o texto corrido uma sans neogrotesca muito legível. A composição é editorial e deliberadamente desalinhada: o título ocupa dois terços da largura sobre pedra clara, e uma fotografia vertical sangra pela margem direita, atravessa a fronteira com a secção seguinte e assenta num soco de pedra cuja aresta se prolonga numa linha de cota. O aspeto premium vem da contenção (três neutros, um acento, linhas de 1 px, cantos de 3 px), não de sinais de luxo.

**Como foge ao aspeto genérico de IA.** A combinação "bege, terracota e serifa" é um lugar-comum dos sites gerados por IA; aqui a execução afasta-se dele de propósito:

- neutros de pedra e betão ligeiramente acinzentados (sem creme amarelado) e carvão neutro, amostrado do logótipo;
- a serifa nunca aparece em itálico decorativo nem com uma palavra do título pintada no acento;
- a terracota aparece no máximo em três pontos por ecrã (botões primários, marca da etiqueta, item ativo da navegação), nunca em fundos de secção;
- a grelha é assimétrica e há sobreposição real entre secções (fotografia e soco atravessam a fronteira do hero com Sobre), em vez de caixas empilhadas;
- as marcas de planta têm significado: a linha de extensão prolonga uma aresta real, a cota mede a fotografia, as cotas dentro da imagem de substituição alinham com as juntas da pedra;
- fotografia de materiais e de mãos a trabalhar, sem pessoas sorridentes, sem luxo, sem estaleiro;
- sem pílulas, sem sombras grandes, sem gradientes em botões, sem ícones em círculos coloridos.

## 2. Tokens de cor

Valores de partida: coluna B da Parte 5.1. Ajustes feitos para dialogar com o logótipo e para afastar os neutros do creme.

| Token | Hex | Papel | Ajuste face à Parte 5.1 |
|---|---|---|---|
| `bg` | `#F3EFE9` | fundo principal, "calcário claro" | era `#F3EEE6`; menos amarelo (R−B de 13 para 10) |
| `surface` | `#E6E0D7` | secções alternadas, painéis, hover do botão secundário | era `#E4DCD0`; mais pedra, menos areia |
| `sand` | `#D1C8BB` | soco de pedra, blocos decorativos, placeholders | era `#CFC3B2`; menos amarelo. Só decorativo: sem controlos nem texto pequeno em `muted` ou `accent` sobre `sand` |
| `ink` | `#292929` | texto, contornos de controlos, marcas de planta fortes | era `#23201D`; passa a ser o carvão do fundo do logótipo (amostrado no PNG: `#292929` em 70,8 % dos píxeis) |
| `muted` | `#57504A` | texto secundário, etiqueta, notas | igual |
| `line` | `#CEC5B8` | linhas de planta de 1 px, divisórias (decorativas) | novo valor; não serve de fronteira de controlo |
| `accent` | `#A2472A` | "telha envelhecida": botão primário, marca da etiqueta, item ativo | igual |
| `accentHover` | `#853A22` | hover do primário, texto de acento sobre `surface`, erros de formulário | igual |
| `dark` | `#292929` | faixas escuras (Diferenciação, CTA, rodapé) | era `#23201D`; igual ao fundo do logótipo para a placa se fundir |
| `onDark` | `#F3EFE9` | texto sobre `dark` | igual a `bg` |
| `accentOnDark` | `#E08B67` | ícones, ligações e pequenos destaques sobre `dark` | igual |
| `focus` | `#C4572F` | anel de foco de 2 px com afastamento de 3 px | novo; "telha nova", passa 3:1 sobre `bg`, `surface` e `dark` |

Valor derivado (não é token novo): texto secundário sobre `dark` em `#B9B1A6` (`onDark` misturado com `dark`); linhas sobre `dark` em `onDark` a 16 % (`#494948`, decorativas).

Regras: um único acento; acento em texto pequeno só sobre `bg` (sobre `surface` usa-se `accentHover`, embora `accent` passe 4,61:1); botão primário sempre com texto branco sobre `accent`; nunca preto puro; amarelo-lima só dentro do logótipo.

## 3. Contrastes calculados (WCAG 2.x)

Calculados com `node -e` e a fórmula de luminância relativa (linearização sRGB com limiar 0,03928, L = 0,2126 R + 0,7152 G + 0,0722 B, razão (L1 + 0,05) / (L2 + 0,05)). Os véus foram calculados sobre o pior caso (fotografia branca).

| Par | Razão | Uso | Passa |
|---|---|---|---|
| `ink` / `bg` | 12,70 | texto e títulos | AAA |
| `ink` / `surface` | 11,09 | texto sobre secções alternadas | AAA |
| `ink` / `sand` | 8,79 | texto sobre o soco ou placeholders | AAA |
| `muted` / `bg` | 6,91 | texto secundário, etiqueta, subtítulo | AA (texto normal) |
| `muted` / `surface` | 6,04 | texto secundário em secções alternadas | AA |
| `muted` / `sand` | 4,79 | só se inevitável (evitar) | AA no limite |
| `accent` / `bg` | 5,28 | texto de acento pequeno, ligações com seta | AA |
| branco / `accent` | 6,05 | rótulo do botão primário | AA |
| branco / `accentHover` | 8,00 | botão primário em hover | AAA |
| `accent` / `surface` | 4,61 | permitido pela razão, mas a regra manda usar `accentHover` | AA |
| `accentHover` / `surface` | 6,10 | texto de acento sobre `surface` (números do Método) | AA |
| `accentHover` / `bg` | 6,98 | mensagens de erro (com ícone e texto) | AA |
| `accent` / `sand` | 3,66 | proibido para texto | falha (não usar) |
| `onDark` / `dark` | 12,70 | texto nas faixas escuras | AAA |
| `accentOnDark` / `dark` | 5,58 | ícones, ligações e destaques nas faixas escuras | AA |
| `#B9B1A6` / `dark` (muted sobre dark) | 6,86 | texto secundário nas faixas escuras e no rodapé | AA |
| `line` / `bg` | 1,49 | linhas de planta e divisórias, decorativas | não se aplica (não é fronteira de controlo) |
| `line` / `surface` | 1,30 | idem | não se aplica |
| `ink` / `bg` como contorno | 12,70 | fronteira do botão secundário e dos campos | ≥ 3:1 |
| `muted` / `bg` como contorno | 6,91 | alternativa para contorno dos campos | ≥ 3:1 |
| `focus` / `bg` | 3,86 | anel de foco | ≥ 3:1 |
| `focus` / `surface` | 3,37 | anel de foco | ≥ 3:1 |
| `focus` / `dark` | 3,29 | anel de foco nas faixas escuras | ≥ 3:1 |
| `focus` / `sand` | 2,67 | nenhum controlo sobre `sand` | falha (por isso a regra) |
| `accent` / `dark` (preenchimento) | 2,40 | fronteira do botão primário numa faixa escura; o rótulo branco (6,05) identifica o controlo | informativo |
| `onDark` / chip da legenda (`dark` a 88 % sobre branco = `#434343`) | 8,64 | legenda "Imagem ilustrativa gerada por IA" | AAA |
| `onDark` / véu `dark` a 72 % sobre branco (`#656565`) | 5,09 | texto sobre a fotografia do CTA e da imagem OG | AA |
| `accentOnDark` / véu 72 % | 2,24 | proibido sobre véu | falha (não usar) |
| amarelo do logótipo `#D1CF20` / `dark` | 8,77 | informativo: o telhado lê-se bem no rodapé | informativo |
| `#D1CF20` / `bg` | 1,45 | informativo: por isto o lima não pode ser acento | informativo |
| `#D1CF20` / `accent` | 3,65 | informativo: lima e terracota nunca lado a lado | informativo |
| `surface` / `bg` · `sand` / `bg` | 1,15 · 1,44 | separação de áreas, decorativa | informativo |

## 4. Diálogo com o logótipo

O ficheiro é um PNG de 352×188 px, opaco, com fundo carvão `#292929` (ruído de ±2 níveis, típico de uma origem JPEG) e um grafismo de uma só cor em amarelo-lima `#D1CF20`: o contorno de um telhado com chaminé e uma janela de quatro vidros, sem texto.

- **O carvão do logótipo é o carvão do site.** `ink` e `dark` usam `#292929`. No cabeçalho claro, a placa escura do logótipo tem a mesma cor do nome "LMDreams" escrito ao lado, e lê-se como uma pequena placa de pedra escura. Nas faixas escuras e no rodapé, a placa funde-se com o fundo e sobra só o telhado amarelo, sem editar o ficheiro.
- **O telhado pede a telha.** A terracota do acento é a cor da telha que cobre o telhado desenhado no logótipo: o acento explica-se pela marca, não é uma escolha solta.
- **O amarelo-lima fica fechado dentro da placa.** Nunca é acento, nunca aparece em texto, ícones, linhas ou fotografias. Tem 1,45:1 sobre `bg`, por isso seria ilegível num fundo claro.
- **Lima e terracota nunca se tocam.** A razão entre as duas é 3,65:1 e os matizes (cerca de 59° e 14°) vibram lado a lado. O carvão da placa isola sempre o lima, e entre a placa e qualquer terracota do cabeçalho fica sempre o nome "LMDreams" em `ink` e fundo claro: em computador, o sublinhado de 2 px do item ativo está a cerca de 150 px da placa e o botão "Pedir orçamento" no extremo oposto, a mais de 1000 px; no telemóvel, o botão fica a mais de 25 px, depois do nome.
- **O amarelo-lima lê-se como a bolha de um nível**, o instrumento que aparece no hero: uma coincidência feliz que o site não precisa de explicitar.

## 5. Tipografia

| Papel | Pacote | Versão confirmada | Ficheiro a importar | Eixos e pesos usados |
|---|---|---|---|---|
| `font-display` (títulos, nome "LMDreams") | `@fontsource-variable/newsreader` | 5.3.0 (`npm view`) | `opsz.css` (família "Newsreader Variable") | `opsz` 6 a 72 automático (`font-optical-sizing: auto`); `wght` 480 (display, h1, h2), 560 (h3), 600 (nome no cabeçalho). Só estilo normal (sem itálico). |
| `font-body` (texto, interface, números) | `@fontsource-variable/public-sans` | 5.3.0 (`npm view`) | `wght.css` (família "Public Sans Variable") | `wght` 400 (texto), 500 (navegação, linha de confiança, legendas), 600 (botões, etiqueta, número de telefone) |
| `font-mono` | não usada | | | |

Verificado nos ficheiros WOFF2 (tabela GSUB): Public Sans e Newsreader têm a funcionalidade `tnum` (algarismos tabulares), usada no telefone e nos números de etapa (`font-variant-numeric: tabular-nums`).

Peso medido do subconjunto `latin`: Newsreader `opsz` normal 128,9 KB; Public Sans `wght` normal 26,2 KB; total 155,1 KB. Alternativa se o orçamento de desempenho apertar: Newsreader `wght.css` (56,7 KB, sem eixo ótico), compensando com `letter-spacing: -0.025em` nos títulos grandes.

**Justificação da serifa (para `design/direcao-visual.md`, se esta direção ganhar).**

1. Em Portugal, a letra de pedra é serifada: lintéis, cantarias e as placas toponímicas em calcário. Uma serifa editorial nos títulos é a voz natural de uma direção chamada "Pedra" e dá ao site um carácter próprio e português sem cair no postal.
2. O Anexo A pede títulos "fortes e elegantes" e uma estética não excessivamente industrial. As grotescas pesadas e condensadas são o código visual habitual das empresas de construção; a serifa distingue a LMDreams e sinaliza cuidado e acabamento.
3. O eixo de tamanho ótico da Newsreader (6 a 72) dá o desenho de display (contraste mais fino, espaçamento mais justo) aos 66 px do hero e um desenho mais robusto aos 20 a 24 px dos títulos de cartão, com um só ficheiro.
4. A legibilidade não depende da serifa: tudo o que é texto corrido, botões, formulários, navegação e números usa Public Sans; a serifa só aparece de 20 px para cima.
5. Sem itálicos decorativos e sem jogos de cor dentro dos títulos, o que evita o cliché "serifa com palavra em itálico colorida".

**Fontes de recurso (contra saltos de layout).** Métricas lidas nos ficheiros: Newsreader com `unitsPerEm` 2000, ascendente 1470, descendente 530, altura-x 0,426 em; Public Sans com ascendente 1900, descendente 450, altura-x 0,517 em. Pontos de partida para as faces de recurso:

```css
@font-face { font-family: "Newsreader Fallback"; src: local("Georgia");
  ascent-override: 73.5%; descent-override: 26.5%; line-gap-override: 0%; size-adjust: 89%; }
@font-face { font-family: "Public Sans Fallback"; src: local("Arial");
  ascent-override: 95%; descent-override: 22.5%; line-gap-override: 0%; size-adjust: 100%; }
```

Os valores de `size-adjust` (89 % iguala a altura-x da Georgia; 100 % para Arial) são estimativas a calibrar na Fase 2 e a confirmar com o CLS do Lighthouse.

## 6. Escala tipográfica fluida

Base 16 px. Valores medidos na maqueta entre parênteses.

| Nível | Família e peso | Tamanho | Altura de linha | Espaçamento |
|---|---|---|---|---|
| display (H1 do hero) | Newsreader 480 | `clamp(2.5rem, 1.35rem + 3.1vw, 4.125rem)` (66 px a 1440; 61,3 px a 1280; 40 px a 390); entre 1024 e 1279 px, `min(…, 4.6vw)` | 1.04 (1.06 em telemóvel) | −0.021em |
| h1 (páginas legais, 404) | Newsreader 480 | `clamp(2.25rem, 1.6rem + 2vw, 3.25rem)` | 1.08 | −0.018em |
| h2 | Newsreader 480 | `clamp(2rem, 1.45rem + 1.7vw, 3rem)` (47,7 px a 1440) | 1.1 | −0.016em |
| h3 | Newsreader 560 | `clamp(1.25rem, 1.1rem + 0.45vw, 1.5rem)` | 1.25 | −0.005em |
| texto grande (subtítulo) | Public Sans 400 | `clamp(1.0625rem, 1rem + 0.3vw, 1.3125rem)` (20,3 px a 1440; 16 px em telemóvel) | 1.5 | 0 |
| texto | Public Sans 400 | `clamp(1rem, 0.97rem + 0.12vw, 1.0625rem)` | 1.6 | 0 |
| pequeno | Public Sans 500 | `clamp(0.875rem, 0.85rem + 0.1vw, 0.9375rem)` | 1.4 a 1.55 | 0 |
| legenda | Public Sans 500 | `0.75rem` (12 px) | 1.3 a 1.35 | 0.01em |
| etiqueta (maiúsculas) | Public Sans 600 | `0.75rem` (11 px em telemóvel) | 1.5 | 0.12em (0.1em em telemóvel) |

Regras: `text-wrap: balance` nos títulos; `text-wrap: pretty` no subtítulo; largura máxima do texto corrido de 36rem (cerca de 65 caracteres); maiúsculas iniciais só na primeira palavra.

## 7. Espaço, grelha, raios, linhas, sombras e movimento

- **Escala de espaço (4 px):** 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 64, 80, 96, 128.
- **Secções:** `padding-block: clamp(4rem, 8vw, 8rem)`. A secção que recebe a sobreposição da fotografia do hero (Sobre) soma 32 px ao topo.
- **Contentor:** 1280 px (`80rem`); margens laterais 16 px (< 640), 24 px (640 a 1023), 32 px (≥ 1024). Grelha de 12 colunas com calha de 16, 24 e 32 px.
- **Sangria à direita:** calculada com unidades de contentor (`container-type: inline-size` no hero e `100cqw`), nunca com `100vw`, para a fotografia acabar exatamente na margem mesmo com barra de deslocamento clássica (Windows).
- **Raios (uma só escala):** 0 (imagens que sangram até à margem, como a do hero), 2 px (legenda de IA, chips, imagens dentro do contentor), 3 px (botões, campos, placa do logótipo), 5 px (cartões, diálogo). Nada acima de 6 px.
- **Linhas:** 1 px em `line` para planta e divisórias; 1 px em `ink` para contornos de controlos; sobre `dark`, `onDark` a 16 %.
- **Sombras:** só duas. Cabeçalho ao fazer scroll: `0 1px 0 var(--line), 0 8px 24px -16px rgb(41 41 41 / 0.28)`. Diálogo e menu móvel: `0 24px 48px -24px rgb(41 41 41 / 0.35)`. Cartões sem sombra.
- **Movimento:** 150 ms (hover), 250 ms (menu, diálogo, estados), 400 ms (entrada ao aparecer, deslocação de 8 a 12 px); curva `cubic-bezier(0.2, 0.7, 0.2, 1)`; zoom de imagem até 2 % em hover; tudo desligado com `prefers-reduced-motion: reduce`.
- **Botões:** md 44 px (cabeçalho), lg 52 px (hero e CTA), 48 px na barra móvel; padding horizontal 20 e 28 px; Public Sans 600; primário `accent` com texto branco; secundário transparente com contorno de 1 px em `ink`; ativo desloca 1 px.

## 8. Motivos gráficos "a planta da obra"

Linhas finas de 1 px, marcas de cota com pontas a 45°, cruzes de registo e algarismos tabulares. Nunca levam medidas inventadas: as cotas são só gráfico (`aria-hidden="true"`).

- **Hero:** marca curta de cota em terracota antes da etiqueta; linha de extensão que prolonga a aresta esquerda da fotografia até ao cabeçalho; cota vertical na calha entre o texto e a fotografia; "linha de terra" por baixo dos botões, onde assenta a linha de confiança, que continua no topo do soco; cruz de registo no canto do soco. É o único ecrã com mais do que uma marca, porque é o "desenho" da página.
- **Divisórias de secção:** uma linha de 1 px na fronteira entre secções da mesma cor, com uma ponta de cota à esquerda.
- **Sobre:** marca de 32 px em `ink` sobre a linha de cada destaque.
- **Método de trabalho:** a linha temporal é uma cota contínua com uma ponta em cada etapa; números 01 a 08 em Public Sans 600 tabular (`accentHover` sobre `surface`). É a única secção com grelha técnica de fundo (quadrícula de 24 px em `line` a 40 %).
- **Contactos e rodapé:** nenhuma marca além das divisórias.

## 9. Tratamento fotográfico

- **Luz:** quente, rasante e lateral, de fim de tarde (entra pela esquerda), com sombras longas e suaves; nada de HDR.
- **Cor:** neutros de pedra, betão e madeira, saturação ligeiramente contida; pretos levantados para carvão (nunca preto puro); realces cremosos sem amarelo; o único vermelho quente admitido é o de materiais reais (telha, madeira), sem competir com o acento.
- **Grão:** de película, muito subtil; sem vinhetas fortes.
- **Enquadramento:** mãos e materiais em plano médio e de pormenor, objetiva de 35 mm, profundidade de campo curta, verticais corrigidas; sem rostos identificáveis, sem sorrisos para a câmara, sem obra desarrumada.
- **Hero desta direção:** fotografia vertical sem texto por cima (logo sem véu): 2:3 em computador (485×758 px a 1440×900), 4:5 em telemóvel (390×488 px). O assunto fica no terço central, porque o recorte muda entre formatos (`object-fit: cover`, `object-position: 50% 45%`).
- **Véu escuro (CTA e imagem OG):** gradiente de `dark` com opacidade mínima de 72 % sob o texto (5,09:1 no pior caso); sobre o véu só texto `onDark` e botões do sistema, nunca `accentOnDark`.
- **Legenda de IA:** "Imagem ilustrativa gerada por IA" em `figcaption`, texto real no DOM, no canto superior direito da imagem (16 px de margem; 12 px em telemóvel), sobre um chip `dark` a 88 % com raio de 2 px, Public Sans 500 de 12 px em `onDark` (8,64:1 no pior caso). No CTA vai para o canto inferior direito, sobre o véu.

## 10. Composição do hero

Medidas lidas na maqueta (Chromium, sem barra de deslocamento).

**Computador, 1440×900.** Cabeçalho de 72 px. O hero tem `min-height: clamp(36rem, calc(100dvh - 72px), 56rem)` (828 px). O bloco de texto ocupa as colunas 1 a 8 (843 px) e começa a 206 px do topo (`--top: clamp(3rem, 22vh - 4rem, 10rem)`): etiqueta; H1 a 66 px em duas linhas ("Cada especialidade nas mãos" / "de quem realmente sabe.", com a quebra garantida por dois `span` em `inline-block` a partir de 1024 px); subtítulo a 20,3 px em três linhas (36rem); os dois botões lado a lado (550 a 602 px). A linha de confiança assenta na "linha de terra" a 696 px, alinhada com o topo do soco (`--plinth: clamp(160px, 42vh - 110px, 280px)`). A fotografia ocupa as colunas 9 a 12 e sangra até à margem direita (485×758 px, de 206 a 964 px): começa à altura da etiqueta e desce 64 px para dentro da secção Sobre. O soco de pedra (`sand`) vai da coluna 8 à margem, de 696 a 964 px, e também atravessa a fronteira. Legenda de IA visível a 222 px do topo.

**Computador, 1280×720.** H1 a 61,3 px em duas linhas; subtítulo em três linhas; botões de 498 a 550 px; linha de confiança de 592 a 652 px (visível); fotografia 416×618 px; legenda visível. Cabeçalho sem quebras (navegação a 14,5 px com intervalos de 18 px entre 1280 e 1439 px).

**Ecrãs largos (1920×1080).** O hero para nos 56rem (896 px) e a fotografia fica com 36rem de largura no máximo (576×800 px), alinhada à direita, para manter o formato vertical; o soco fica mais visível à esquerda da fotografia.

**Entre 768 e 1279 px.** A navegação passa para o menu; o cabeçalho mostra o logótipo, o botão compacto "Ligar" (contorno, ícone e texto, nome acessível "Ligar para a LMDreams"), "Pedir orçamento" e o botão do menu. A 1024×768, H1 a 47 px em duas linhas.

**Telemóvel, 390×844.** Cabeçalho de 64 px com a placa a 28 px de altura, o nome a 18 px, "Pedir orçamento" (40 px) e o botão do menu (40 px). Texto numa coluna: etiqueta em duas linhas; H1 a 40 px em três linhas; subtítulo a 16 px em quatro linhas; botões empilhados a toda a largura (403 a 509 px); linha de confiança em lista vertical com marcadores quadrados de 5 px (531 a 617 px). A fotografia 4:5 a toda a largura começa a 645 px, com a legenda de IA no canto superior direito (657 a 685 px), sempre acima da barra. Barra de contacto fixa em baixo (69 px mais a *safe area*): "Ligar" e "WhatsApp" com ícone sobre o rótulo (60 e 76 px) e "Pedir orçamento" a ocupar o resto; a página ganha `padding-bottom` igual à barra. Nada do primeiro ecrã fica tapado.

## 11. Integração do logótipo

- **Cabeçalho claro:** o PNG tal como está, a 44 px de altura (82 px de largura), com `border-radius: 3px`, ao lado do nome "LMDreams" em Newsreader 600 de 24 px em `ink`. A ligação tem o nome acessível "LMDreams, voltar ao início" e a imagem `alt=""`. A 44 px, a imagem de 188 px de altura chega para ecrãs 3×.
- **Rodapé e faixas escuras:** o mesmo PNG sobre `dark` `#292929`; a placa funde-se com o fundo e vê-se só o telhado amarelo, sem máscara nem versão nova.
- **Favicon e ícones:** recorte quadrado do próprio PNG centrado no telhado (cerca de 188×188 px), sem redesenhar, para 16, 32, 180, 192 e 512 px e versão maskable (o fundo carvão já é opaco). O grafismo é de traço fino: a 16 px pode ficar ténue; assinalar para aprovação. `theme-color`: `#F3EFE9` (cabeçalho claro).
- **Imagem OG:** fundo `dark` com linhas de planta, logótipo (a placa funde-se), a frase em Newsreader `onDark` e, se houver fotografia, o véu de 72 % e a legenda.

## 12. Aplicação às outras secções

Alternância de fundos: hero `bg`, Sobre `surface`, Diferenciação `dark`, Serviços `bg`, Método `surface`, Projetos `bg`, Transparência `surface`, Testemunhos `bg`, CTA fotografia com véu, Contactos `bg`, rodapé `dark` (três faixas escuras, como manda a Parte 5.3).

- **Sobre:** recebe a sobreposição da fotografia e do soco; H2 em 6 colunas à esquerda e texto em 6 colunas à direita; três destaques em colunas com linha de 1 px e marca de 32 px; imagem `sobre` (4:5) mais abaixo, à esquerda, para alternar com o hero.
- **Diferenciação (faixa escura):** H2 em Newsreader `onDark`; grelha assimétrica de cinco cartões (dois largos, três estreitos) separados por linhas `onDark` a 16 %, sem sombras; ícones Lucide de traço 1,5 em `accentOnDark`; imagem `diferenciacao` (3:2) numa célula larga.
- **Serviços:** seis cartões com imagem 4:3 (raio de 2 px), título h3 e uma linha em `muted`; os outros dez numa lista de duas colunas com ícone de 20 px em `ink` e divisórias; "Remodelações completas" e "Preparação e coordenação de obra" destacados num painel `surface`; termina com "Pedir orçamento".
- **Método de trabalho:** linha temporal 4×2 a partir de 1024 px como uma cota contínua; números 01 a 08 tabulares em `accentHover`; quadrícula técnica discreta de fundo; vertical em telemóvel.
- **Projetos:** filtros como chips retangulares (raio de 3 px, contorno `ink`; ativo com fundo `ink` e texto `bg`, `aria-pressed`); placeholders com contorno tracejado em `muted` e "Imagem a substituir".
- **Transparência:** lista "O que vai saber" com marcadores quadrados de 5 px em `ink`; imagem `transparencia` (3:2) à direita; parágrafo sobre imprevistos em texto grande.
- **Testemunhos:** três cartões placeholder tracejados, sem estrelas nem nomes.
- **CTA:** imagem `cta` (21:9) com véu à esquerda; H2 `onDark`; "Pedir orçamento" (primário), "Contactar por telefone" e "Falar por WhatsApp" (secundários com contorno `onDark`); legenda de IA no canto inferior direito.
- **Contactos:** duas colunas; campos com contorno de 1 px em `muted` e raio de 3 px, rótulos Public Sans 500 em `ink`; erros em `accentHover` com ícone e texto (nunca só cor).
- **Rodapé:** `dark`; logótipo PNG direto; colunas separadas por linhas a 16 %; texto secundário em `#B9B1A6`; ligações `onDark` sublinhadas em hover e foco; nota das imagens ilustrativas.

## 13. O que fazer e o que evitar

**Fazer**

- Usar a terracota só para agir (botões primários) e para marcar (etiqueta, item ativo, números de etapa).
- Alinhar cada marca de planta com uma aresta real (fotografia, soco, junta, etapa).
- Manter títulos em Newsreader direita, peso 480, sem itálico; tudo o resto em Public Sans.
- Deixar a fotografia do hero atravessar a fronteira com Sobre; repetir essa sobreposição no máximo mais uma vez no site (por exemplo, a imagem de Transparência sobre a divisória).
- Espaço generoso e ritmo de 4 px; textos com no máximo 65 caracteres por linha.
- Carvão `#292929` para texto e faixas escuras, nunca preto.

**Evitar**

- Palavras do título em itálico ou em terracota; gradientes em botões; sombras grandes; pílulas; cantos acima de 6 px.
- Terracota em fundos de secção ou em grandes áreas; amarelo-lima fora do logótipo; lima ao lado da terracota.
- Bege amarelado, texturas de papel, ruído forte, "manchas" orgânicas.
- Cotas com números ou medidas inventadas; grelha técnica em mais de uma secção; linhas a desenharem-se em ciclo.
- Ícones em círculos coloridos, cartões flutuantes com sombra, contadores e estrelas.
- Fotografias com rostos, luxo, dourado brilhante ou estaleiro desarrumado.

## 14. Prompt do board do hero (modelo da Parte 4.3)

```text
Website design mockup of a single desktop landing-page section (1440 px wide) for "LMDreams",
a Portuguese construction and renovation company whose promise is one specialist for each trade.
Section: hero with a compact light header (top-left: a small dark charcoal #292929 rectangular logo plate with slightly rounded corners showing a thin lime-yellow #D1CF20 outline of a house roof with a chimney and a small four-pane window, no text inside the plate, followed by the word "LMDreams" in a dark serif; then six small navigation links "Início", "Sobre nós", "Serviços", "Método de trabalho", "Projetos", "Contactos", the phone number "+351 919 233 372" with the tiny note "(chamada para a rede móvel nacional)" and a small terracotta button "Pedir orçamento"), a small uppercase eyebrow "Construção civil e remodelações · Portugal continental" with a tiny terracotta dimension tick, a large two-line serif headline, a three-line subtitle, two buttons side by side and a small trust line.
Palette: pale limestone #F3EFE9 page background, warm stone #E6E0D7 and sand #D1C8BB surfaces, soft charcoal #292929 text (never pure black), muted stone grey #57504A secondary text, fine hairlines #CEC5B8, and one single aged roof-tile terracotta accent #A2472A used only on the primary buttons, the active navigation underline and one tiny tick mark; the lime-yellow appears only inside the logo plate. Typography: editorial transitional serif headlines at display optical size, medium weight, tight tracking, no italics (like Newsreader Display); clean, highly legible neo-grotesk sans for body text, buttons and navigation (like Public Sans). Composition: editorial off-grid layout: headline block on the left two thirds over plain pale limestone; a tall vertical photograph on the right third that bleeds off the right edge of the page and runs past the bottom edge of the section, showing a craftsman's hands setting a large-format natural stone wall tile with a spirit level under an exposed concrete ceiling, warm late-afternoon raking light; a sand-coloured stone plinth at the base of the photograph extending to its left, whose top edge continues as a thin dimension line under the buttons, with the trust line sitting on that line; a thin extension line rising from the left edge of the photograph to the header and a thin vertical dimension line with 45-degree end ticks beside it; a small dark caption chip "Imagem ilustrativa gerada por IA" in the top-right corner of the photograph. Visual language: generous white space, thin structural lines inspired by
architectural floor plans, editorial photography of real materials (concrete, natural stone, oak, brushed copper),
warm light, premium but approachable, not luxurious, not industrial. Headline text: "Cada especialidade nas mãos de quem realmente sabe.".
Primary button text: "Pedir orçamento". Secondary button text: "Conhecer os serviços". Subtitle text: "Profissionais com mais de 30 anos de experiência, reunidos para cada etapa da obra, com qualidade, rigor e transparência do início ao fim.". Trust line text: "Mais de 30 anos de experiência · Profissionais especializados · Acompanhamento transparente". Realistic, production-quality web layout, clear hierarchy.
No browser chrome, no device frame, no watermark, no lorem ipsum.
```

## 15. Maqueta e verificações

- Ficheiro: `design/maquetas/hero-B.html` (HTML e CSS autocontidos, sem JavaScript). Logótipo por `../../logo-lmdreams.png`. Fontes da maqueta pelo jsDelivr (`@fontsource-variable/newsreader@5.3.0/opsz.css` e `@fontsource-variable/public-sans@5.3.0/wght.css`), só neste artefacto; o site autoaloja-as.
- Captura sugerida: viewport 1440×900 (board); com `--full-page` mostra também o excerto de Sobre. A maqueta está preparada para 1280×720, 1024×768, 390×844 e 1920×1080.
- Verificado no Chromium (métricas de layout): H1 em 2 linhas a 1440, 1280 e 1024; subtítulo em 3 linhas em computador; botões, linha de confiança e legenda visíveis sem scroll a 1440×900, 1280×720 e 390×844; cabeçalho sem quebras nem transbordo; sem scroll horizontal em nenhuma largura testada.

## 16. Pontos em aberto

1. A 390 px o subtítulo ocupa 4 linhas: com 137 caracteres e 16 px (mínimo recomendado para texto) não cabe em 3 linhas numa coluna de 358 px. Proposta: aceitar 4 linhas no telemóvel (3 em computador); o primeiro ecrã continua completo.
2. A Newsreader com eixo ótico pesa 128,9 KB (latin). Se o Lighthouse penalizar, trocar para `wght.css` (56,7 KB).
3. Logótipo raster de 352×188 px com o grafismo em cerca de 188 px de lado: abaixo do limiar da Parte 4.9 para favicons (512 px). Seguir com o existente, assinalar e pedir um vetorial (ponto de paragem 4, não bloqueia).
4. O prompt de imagem do `hero` (Parte 4.4) pede 16:9 com espaço livre no terço esquerdo, pensado para texto sobre a imagem. Nesta direção a fotografia é vertical e não leva texto: um recorte 2:3 de uma imagem 2048×1152 dá 768 px de largura (1,58× a 485 px), abaixo dos 2× desejáveis.
5. Numa faixa escura, o preenchimento do botão primário tem 2,40:1 contra `dark`; o rótulo branco (6,05:1) identifica o controlo, mas, se o painel preferir, acrescenta-se um contorno de 1 px em `accentOnDark` só nas faixas escuras.
