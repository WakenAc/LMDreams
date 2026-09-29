# Fotografias dos projetos

Registo das fotografias reais publicadas na secção Projetos (`src/content/projects.ts`, ficheiros em `public/projetos/`). Complementa o `assets-src/ilustrativas/manifest.json`, que regista as imagens geradas por IA; nenhuma imagem de IA é usada nos projetos.

- **Origem:** fotografias tiradas pelo dono da empresa e enviadas pelo WhatsApp (sem metadados). Os originais e o índice F001 a F269 ficam no computador do Andre, em `fotos-originais/` (fora do Git).
- **Autorização:** os donos de obra das cinco obras autorizaram a publicação (resposta do cliente a 29 de setembro de 2026). A localidade e o ano são os indicados pelo cliente.
- **Privacidade:** nada de rostos, pessoas identificáveis, matrículas, números de porta, placas de rua, objetos pessoais nem marcos que identifiquem a morada. Primeiro recorte e, se não chegar, desfoque forte só na zona (gaussiano com sigma de 15 a 20, ou pixelização), até ficar ilegível a 100%. Cada ficheiro final foi verificado a 100% por um segundo agente.
- **Segurança:** não foram usadas fotografias com andaimes sem guarda-corpos, escadote no telhado, trabalhadores sem proteção, escoras perigosas ou cabos junto a água.
- **Exportação:** WebP de qualidade 78 (70 no mínimo), lado maior até 1200 px (nunca ampliado), sem metadados, até 120 KiB por ficheiro. Os pares antes e depois têm exatamente as mesmas dimensões e estão pela mesma ordem (`antes[i]` com `depois[i]`).
- **Factos confirmados pelo Andre:** a moradia no pinhal foi uma ampliação, com a piscina e o jardim feitos pela empresa (o muro só foi reparado e pintado); a livraria-café é de 2017 e a empresa só instalou o balcão; as três frações do prédio foram todas remodeladas pela empresa.

## Recuperação e remodelação de prédio de três frações

- Obra: Prédio de três frações (obra B). Localidade: Feijó. Ano: 2019. Categoria: remodelacoes.
- Pasta: `public/projetos/remodelacao-predio/`. Capa: `01-depois.webp`.

| Ficheiro | Fase | Origem | Dimensões |
|---|---|---|---|
| `01-antes.webp` | antes | F039 | 671 × 503 |
| `02-antes.webp` | antes | F026 | 567 × 756 |
| `01-depois.webp` | depois | F036 | 671 × 503 |
| `02-depois.webp` | depois | F058 | 567 × 756 |
| `03-depois.webp` | depois | F060 | 960 × 640 |

Tratamentos:

- 01-antes.webp (F039): recorte x 177 a 849, y 67 a 571 (672x504, reduzido para 671x503), alinhado pela porta de entrada para coincidir com F036. Assim ficam de fora a casa vizinha amarela com azulejos (x >= 855) e a maior parte dos cabos no topo. Desfoque gaussiano sigma 20 no número de porta 8 (x 522 a 564, y 256 a 298, margem de transição de 8 px), no painel de azulejos figurativos (x 560 a 656, y 182 a 258, margem de 10 px) e nos dois vidros da janela da esquerda (x 172 a 311, y 285 a 368), que refletiam o prédio em frente. Verificado a 100 % e ampliado: fica ilegível.
- 01-depois.webp (F036): recorte 4:3 x 197 a 1050, y 0 a 640 (853x640, reduzido para 671x503, as mesmas dimensões de F039). Ficam de fora a porta do vizinho com o número 15, o aviso em papel e o pilar e muro do vizinho. Sem desfoque. É também a capa, e o recorte central a 16:9 continua a mostrar a porta.
- 02-antes.webp (F026, fase durante, usada como antes): fotografia inteira (720x960), só reduzida para 567x756, as dimensões do par. Sem desfoque. Não tem pessoas nem objetos pessoais: o objeto turquesa é um saco da obra.
- 02-depois.webp (F058): recorte 3:4 x 41 a 608, y 281 a 1037 (567x756, sem redimensionar), ancorado na porta da escada ao fundo para coincidir com F026 (a grande angular deixa F058 cerca de 1,27 vezes mais aberta). A mistura a 50 % confirma o alinhamento da porta ao fundo, do teto e das portas laterais. Sem desfoque. Fica à vista uma extensão elétrica no chão seco junto à escada. Não está junto a água nem é uma das falhas de segurança listadas, por isso a fotografia ficou.
- 03-depois.webp (F060, sem par): recorte 3:2 x 330 a 1290, y 0 a 640 (960x640, sem redimensionar). Tira a parede distorcida da esquerda e centra o duche, o lavatório e o espelho. Sem desfoque. O espelho reflete só a porta e o corredor, sem o fotógrafo.
- Todas: WebP de qualidade 78, sem metadados (confirmado: sem EXIF, ICC, XMP nem IPTC), entre 8,8 e 27,7 KiB, nenhuma ampliada. Pares com dimensões exatamente iguais (671x503 e 567x756), colocados primeiro nas listas. Scripts em .tmp/projetos/trabalho/remodelacao-predio/ (exportar.cjs, verificar.cjs, zoom.cjs). Resultado gravado em .tmp/projetos/remodelacao-predio.json.

Notas da verificação final:

- `02-depois.webp`: uma extensão elétrica preta vem da escada e atravessa o corredor. A F058 está na lista de 'cabos soltos' da secção 7 do relatório. O chão está seco e longe de água, por isso não é uma das falhas proibidas pela tarefa. Um recorte desfazia o par (567x756) e um desfoque deixava uma mancha. O par coincide bem com o 02-antes (porta da escada, teto e portas laterais).

## Cozinha em tom de carvalho e branco num prédio

- Obra: Prédio de três frações (obra B). Localidade: Feijó. Ano: 2019. Categoria: cozinhas.
- Pasta: `public/projetos/cozinha-predio/`. Capa: `02-depois.webp`.

| Ficheiro | Fase | Origem | Dimensões |
|---|---|---|---|
| `01-antes.webp` | antes | F031 | 720 × 540 |
| `01-depois.webp` | depois | F074 | 720 × 540 |
| `02-depois.webp` | depois | F067 | 1200 × 553 |
| `03-depois.webp` | depois | F071 | 1200 × 553 |
| `04-depois.webp` | depois | F069 | 1200 × 624 |

Tratamentos:

- 01-antes.webp (F031): desfoque gaussiano sigma 20 (máscara com transição de 8 px) só no vidro: vista da janela para o prédio em frente (x 410 a 534, y 344 a 478), fresta de vista entre o caixilho e a persiana (x 530 a 566, y 326 a 478) e vista pela porta da antiga varanda (x 276 a 308, y 334 a 466), para ficar coerente com F074 e F069; recorte 4:3 (x 0 a 720, y 210 a 750) para fazer par com F074; 720 × 540, WebP q78, 32 KiB, sem metadados.
- 01-depois.webp (F074): desfoque gaussiano sigma 20 (transição de 8 px) na janela da direita, com o prédio em frente e as janelas dos vizinhos (x 1004 a 1328, y 216 a 386), e na janela estreita junto ao lava-loiça (x 764 a 806, y 224 a 328); recorte 4:3 (x 490 a 1343, y 0 a 640), que também tira a fresta de vista na ponta direita (x 1360 a 1388); reduzida a 720 × 540 para ficar exatamente do tamanho de 01-antes (par aproximado: o mesmo canto, com a janela à direita e o pilar onde estava a parede entre a porta da varanda e a janela); WebP q78, 13 KiB, sem metadados.
- 02-depois.webp (F067, também capa): sem recorte nem desfoque (nada identificável; janelas sobre-expostas); 1388 × 640 reduzida a 1200 × 553; WebP q78, 17 KiB, sem metadados. O recorte 4:3 ao centro do cartão mostra as colunas, o frigorífico, o forno, a cozinha ao fundo e a península.
- 03-depois.webp (F071): sem recorte nem desfoque (nada identificável; a porta à esquerda não tem reflexos); 1200 × 553; WebP q78, 21 KiB, sem metadados.
- 04-depois.webp (F069): recorte à direita (x 0 a 1230), que tira a sala e a respetiva janela em vez de as desfocar; desfoque gaussiano sigma 20 (transição de 8 px) em todas as vistas das janelas: folha esquerda (x 250 a 430, y 236 a 406) e folha direita (x 452 a 568, y 234 a 376) da janela com o prédio em frente e as janelas dos vizinhos, janela do canto com árvores e casas (x 833 a 957, y 226 a 338) e janela lateral do canto com casas e telhados (x 1013 a 1097, y 224 a 337); os reflexos no armário lacado são só manchas sem forma; 1200 × 624, WebP q78, 29 KiB, sem metadados.
- Verificação: abri cada WebP final (convertido para JPEG) a tamanho inteiro, com recortes a 100 % das zonas desfocadas. As vistas ficaram ilegíveis. Não se veem pessoas, números, placas, roupa, documentos nem objetos pessoais, nem falhas de segurança (F031 tem só entulho, vassoura e balde, sem ninguém a trabalhar). Os ficheiros não têm EXIF, ICC nem XMP. Resultado gravado em C:/Users/andre/Desktop/Claude_playground/websites/LMDreams/LMDreams/.tmp/projetos/cozinha-predio.json; scripts em .tmp/projetos/trabalho/cozinha-predio/ (exportar.cjs, verificar.cjs).

## Casa de banho numa habitação de dois pisos recuperada

- Obra: Casa de dois pisos (obra D). Localidade: Casal de Cambra. Ano: 2026. Categoria: casas-de-banho.
- Pasta: `public/projetos/casa-de-banho-casa/`. Capa: `01-depois.webp`.

| Ficheiro | Fase | Origem | Dimensões |
|---|---|---|---|
| `01-depois.webp` | depois | F189 | 1200 × 900 |
| `02-depois.webp` | depois | F188 | 900 × 1200 |
| `03-depois.webp` | depois | F185 | 900 × 1200 |
| `04-depois.webp` | depois | F187 | 900 × 1200 |

Tratamentos:

- 01-depois.webp (F189): sem recorte nem desfoque. Só foi redimensionada de 1800x1350 para 1200x900 (4:3), WebP q78, 95 KiB. A janela é fosca e não mostra o exterior. Não há reflexos de pessoas no vidro. A etiqueta CE do fabricante no vidro ficou: não é um dado pessoal, e tirá-la com recorte cortaria o chuveiro.
- 02-depois.webp (F188): sem recorte nem desfoque. De 1536x2048 para 900x1200, q78, 29 KiB. O espelho só reflete o azulejo e um interruptor. O autocolante do espelho e o logótipo da marca na sanita não são dados pessoais.
- 03-depois.webp (F185): sem recorte nem desfoque. De 1536x2048 para 900x1200, q78, 30 KiB. O espelho reflete a sanita e o teto inclinado, sem pessoas.
- 04-depois.webp (F187): recortada em x=290, y=387, com 1246x1661 (3:4), para tirar a bancada de granito preto e os armários da cozinha à esquerda. Ficam só a porta de correr embutida e a casa de banho. 900x1200, q78, 17 KiB. Nada identificável.
- Geral: não há pares antes e depois porque não há fotografias do antes. Os 4 ficheiros não têm metadados (sem EXIF, ICC nem XMP) e foram revistos com Read depois de exportados. Nenhum ficheiro teve de baixar a qualidade ou o tamanho. Script: .tmp/projetos/trabalho/casa-de-banho-casa.cjs. Resultado: .tmp/projetos/casa-de-banho-casa.json.
- A confirmar: a F185 e a F188 mostram móveis de lavatório e espelhos diferentes, e a F185 reflete um teto inclinado. Devem ser duas casas de banho, mas isso não está confirmado. Por isso o nome e a descrição não dizem quantas são. A F187 mostra o móvel com pés da F188, por isso é a entrada dessa casa de banho.

## Livraria-café: remodelação de espaço comercial

- Obra: Livraria-café (obra E). Localidade: Lisboa. Ano: 2017. Categoria: interiores.
- Pasta: `public/projetos/livraria-cafe/`. Capa: `02-depois.webp`.

| Ficheiro | Fase | Origem | Dimensões |
|---|---|---|---|
| `01-antes.webp` | antes | F237 | 644 × 483 |
| `01-depois.webp` | depois | F261 | 644 × 483 |
| `02-depois.webp` | depois | F207 | 720 × 540 |
| `03-depois.webp` | depois | F262 | 610 × 720 |

Tratamentos:

- 01-antes.webp (F237): recorte x 316 a 960, y 20 a 503 (644 × 483, 4:3). Tira a base do telefone com o cabo (x 255 a 310, y 380 a 420) e o saco vermelho (x 505 a 640, y a partir de 620). Sem desfoque. O pátio interior que se vê pelo envidraçado não tem pessoas nem nada que identifique a morada.
- 01-depois.webp (F261): recorte x 247 a 931, y 207 a 720 (684 × 513, 4:3), reduzido para 644 × 483, exatamente as mesmas dimensões de 01-antes. Enquadra a parede do fundo e o envidraçado para o pátio na mesma posição horizontal do antes; tira o radiador do canto. Sem desfoque. Os cartões nas mesas não se leem e não há pessoas.
- 02-depois.webp (F207, capa): recorte x 240 a 960, y 180 a 720 (720 × 540, 4:3). Tira o cadeirão com a mala e o casaco (x 0 a 85) e a porta aberta para a rua com carros (x 85 a 235). Sem desfoque. Os retratos na parede são de escritores célebres (decoração), não de família.
- 03-depois.webp (F262): recorte x 0 a 610, y 0 a 720 (610 × 720). Tira as letras que formam o nome do estabelecimento (x 650 a 910, y 255 a 395) e a escada. A composição fica simétrica, centrada no banco. Sem desfoque.
- Todas: WebP qualidade 78, sem metadados (sem EXIF, ICC nem XMP), sem ampliação (lado maior entre 644 e 720 px), de 11 a 34 KiB. Todas conferidas com Read depois da exportação: sem pessoas, matrículas, nome do estabelecimento, objetos pessoais nem falhas de segurança. Scripts em .tmp/projetos/trabalho/livraria-cafe/ (exportar.cjs, resultado.cjs); resultado em .tmp/projetos/livraria-cafe.json.

Notas da verificação final:

- `02-depois.webp`: na parede há retratos de escritores célebres (decoração). São rostos de figuras públicas em reproduções, não pessoas do local nem do cliente, e não há problema de privacidade.
- `03-depois.webp`: tem os mesmos retratos decorativos de escritores. O nome do estabelecimento ficou fora do recorte.

## Arranjos exteriores com piscina e jardim

- Obra: Moradia no pinhal (obra C). Localidade: Fernão Ferro. Ano: 2021. Categoria: exteriores.
- Pasta: `public/projetos/exteriores-moradia/`. Capa: `01-depois.webp`.

| Ficheiro | Fase | Origem | Dimensões |
|---|---|---|---|
| `01-depois.webp` | depois | F125 | 960 × 720 |
| `02-depois.webp` | depois | F127 | 960 × 720 |
| `03-depois.webp` | depois | F122 | 530 × 720 |
| `04-depois.webp` | depois | F149 | 720 × 515 |
| `05-depois.webp` | depois | F121 | 960 × 410 |

Tratamentos:

- 01-depois.webp (F125): sem recorte nem desfoque, 960 × 720. A casa vizinha atrás do muro é genérica e não tem números nem marcos. É também a capa (já em 4:3).
- 02-depois.webp (F127): sem recorte, 960 × 720. Desfoque gaussiano forte (sigma 20, com transição suave nas margens) em x 706 a 748, y 372 a 420 do original: há ali uma figura clara de 6 × 15 px junto ao portão escuro ao fundo, que pode ser uma pessoa. Confirmado que fica ilegível a 100 %.
- 03-depois.webp (F122): recorte de x 340 a 870 e y 0 a 720 do original (530 × 720). À esquerda sai a torre do posto de transformação com os postes e as linhas de alta tensão (até x 335); à direita sai a casa lilás do vizinho com o poste de alta tensão (a partir de x 880). Sem desfoque.
- 04-depois.webp (F149): recorte de x 0 a 720 e y 445 a 960 do original (720 × 515). Saem a subestação, os postes de alta tensão, a torre do posto de transformação, o terreno para lá do muro e o anexo. Sem desfoque.
- 05-depois.webp (F121): recorte de x 0 a 960 e y 310 a 720 do original (960 × 410). Saem a torre do posto de transformação, os postes e as linhas de alta tensão e a vedação escura da subestação por cima do muro. Sem desfoque.
- Todas: WebP de qualidade 78, sem ampliação (os originais têm 960 px ou menos), sem metadados (sem EXIF, ICC nem XMP), entre 41 e 113 KiB. Não há pares: não se confirma nenhum antes e depois do mesmo sítio, por isso a lista 'antes' fica vazia. Cada ficheiro final foi aberto e verificado quanto à privacidade e ao recorte. Resultado gravado em .tmp/projetos/exteriores-moradia.json.

Notas da verificação final:

- `03-depois.webp`: atrás das árvores fica um poste fino da rede elétrica com fios (x≈430, y 265 a 320). A torre do posto de transformação, os pilares de alta tensão e a casa lilás ficaram fora do recorte. O poste é genérico e não identifica a morada.

## Pátio com pérgola de madeira e churrasqueira

- Obra: Pátio com pérgola (obra A). Localidade: Seixal. Ano: 2016. Categoria: exteriores.
- Pasta: `public/projetos/patio-pergola/`. Capa: `01-depois.webp`.

| Ficheiro | Fase | Origem | Dimensões |
|---|---|---|---|
| `01-depois.webp` | depois | F004 | 960 × 596 |
| `02-depois.webp` | depois | F003 | 800 × 384 |
| `03-depois.webp` | depois | F002 | 800 × 530 |

Tratamentos:

- 01-depois.webp (F004, capa): cortei o topo do original 960×720, de y 0 a 124. Saem a roupa estendida, o ar condicionado e as janelas do prédio vizinho, que também se viam entre as telhas. Ficou com 960×596, sem desfoque. WebP q78, 32,9 KiB. Em 4:3 a capa mostra o pilar e a churrasqueira.
- 02-depois.webp (F003): cortei o topo do original 800×600, de y 0 a 216. Saem o prédio vizinho com janelas, a roupa estendida, o ar condicionado e a fachada bege com estores. O corte tira também o telhado de telha da pérgola, mas ficam a viga e o pilar. No canto superior esquerdo só ficam um muro branco e o telhado de uma casa vizinha, que não identificam o local. Ficou com 800×384, sem desfoque. WebP q78, 24,5 KiB.
- 03-depois.webp (F002): cortei o topo do original 800×600, de y 0 a 70. Saem a platibanda e dois pequenos aparelhos no beiral, por precaução, caso sejam sensores ou câmaras. Ficou com 800×530, sem desfoque. WebP q78, 18,7 KiB.
- Todos os ficheiros ficaram sem metadados (sem EXIF, ICC nem XMP) e abaixo de 120 KiB. Não houve ampliação: os tamanhos são os dos originais depois do corte. Abri e verifiquei cada ficheiro final: não aparecem pessoas, roupa, janelas de vizinhos nem elementos que indiquem a morada. O cartão não tem par antes e depois, por isso a lista 'antes' está vazia. O resultado ficou gravado em C:/Users/andre/Desktop/Claude_playground/websites/LMDreams/LMDreams/.tmp/projetos/patio-pergola.json e o script de exportação em .tmp/projetos/trabalho/patio-pergola-export.cjs.

## Ampliação de moradia para dois pisos

- Obra: Moradia no pinhal (obra C). Localidade: Fernão Ferro. Ano: 2021. Categoria: construcao.
- Pasta: `public/projetos/ampliacao-moradia/`. Capa: `03-depois.webp`.

| Ficheiro | Fase | Origem | Dimensões |
|---|---|---|---|
| `01-antes.webp` | antes | F087 | 620 × 465 |
| `02-antes.webp` | antes | F088 | 760 × 570 |
| `01-depois.webp` | depois | F120 | 620 × 465 |
| `02-depois.webp` | depois | F138 | 760 × 570 |
| `03-depois.webp` | depois | F168 | 938 × 704 |

Tratamentos:

- 01-antes.webp (F087, 960×720): recorte x 0 a 740, y 60 a 615 (740×555, 4:3). Saem à direita o poste de alta tensão e a torre do posto de transformação (x 815 a 910) e o poste de madeira (x 805). Reduzida para 620×465, para ficar igual ao par. Sem desfoque. WebP q78, 49,5 KiB.
- 01-depois.webp (F120, 960×720): recorte x 340 a 960, y 80 a 545 (620×465, 4:3). Saem à esquerda o dumper, a caixa do camião, o portão e a casa vizinha com janelas pequenas (x 240 a 340; fica só a ponta do telhado, sem janelas). Fica com a casa na mesma posição que em 01-antes. Sem desfoque (uma primeira tentativa com desfoque deixava um retângulo visível; o recorte resolve sem isso). WebP q78, 17,3 KiB.
- 02-antes.webp (F088, 960×720): sem recorte, porque recortar a casa lilás cortava o pilar e a abertura do alpendre. Desfoque gaussiano sigma 18, com transição de 4 a 5 px, em duas zonas: x 84 a 145, y 338 a 400 (casa lilás de telhado laranja do vizinho, à esquerda do pilar) e x 176 a 202, y 338 a 400 (a mesma casa vista pela abertura do alpendre). O pilar fica nítido. Confirmado ilegível a 100 %. Reduzida para 760×570. WebP q78, 91,6 KiB.
- 02-depois.webp (F138, 960×720): recorte x 140 a 900, y 42 a 612 (760×570, 4:3), com o cimo da empena e a chaminé na mesma zona que em 02-antes. Desfoque gaussiano sigma 15 só nos píxeis de céu (luminância acima de 125) da zona x 300 a 372, y 270 a 326. A torre de alta tensão ao fundo (x 340 a 356, y 302 a 322) e as linhas desaparecem no céu, sem retângulo visível, e as árvores ficam nítidas. Confirmado a 100 %. WebP q78, 61,0 KiB.
- 03-depois.webp (F168, 2048×1536): sem recorte (já está em 4:3) nem desfoque; verificada nos 4 quadrantes, sem pessoas, números, veículos, postes nem torre. Com 1200×900 passava de 120 KiB mesmo em q70, por isso ficou com 938×704 em q70 (119,6 KiB). Serve também de capa.
- Todas: WebP sem metadados (sem EXIF, ICC nem XMP) e nunca ampliadas. Os dois pares têm exatamente as mesmas dimensões (620×465 e 760×570). Scripts em .tmp/projetos/trabalho/ampliacao-moradia/ (exportar.cjs); resultado em .tmp/projetos/ampliacao-moradia.json.

## Recuperação de uma casa de dois pisos

- Obra: Casa de dois pisos (obra D). Localidade: Casal de Cambra. Ano: 2026. Categoria: recuperacao.
- Pasta: `public/projetos/recuperacao-casa/`. Capa: `02-depois.webp`.

| Ficheiro | Fase | Origem | Dimensões |
|---|---|---|---|
| `01-antes.webp` | antes | F197 | 699 × 932 |
| `01-depois.webp` | depois | F174 | 699 × 932 |
| `02-depois.webp` | depois | F172 | 1200 × 900 |
| `03-depois.webp` | depois | F178 | 1200 × 900 |
| `04-depois.webp` | depois | F190 | 1200 × 900 |

Tratamentos:

- 01-antes.webp (F197, antes). Recorte: x 0 a 699, y 585 a 1517 (699x932, 3:4, sem redimensionar). Tira as barras e o indicador da captura de ecrã, e também todo o reboco branco e o cunhal de cantaria da igreja à direita, que começam em x 700. Desfoque gaussiano sigma 22, com máscara arredondada, nos dois homens da rua (x 105 a 210, y 1300 a 1590; x 178 a 292, y 1286 a 1572): o rosto e as silhuetas ficam irreconhecíveis. Desfoque sigma 15 nos números de porta pintados (x 130 a 164, y 1205 a 1247; x 534 a 566, y 1216 a 1248). WebP q78, 31,6 KiB.
- 01-depois.webp (F174, depois). Recorte: x 0 a 1185, y 54 a 1634 (1185x1580, 3:4), reduzido para 699x932, para ter exatamente as mesmas dimensões do antes. O recorte tira o reboco branco e o cunhal da igreja à direita (começam em x 1195 no topo). O enquadramento é igual ao de F197: a casa de ponta a ponta, céu por cima do telhado e um pouco de calçada. A perspetiva é um pouco diferente, porque F174 foi tirada mais perto. Desfoque sigma 15 nos números 43 (x 262 a 308, y 1045 a 1089) e 47 (x 1170 a 1210, y 1086 a 1122) e na etiqueta da caixa do correio (x 398 a 428, y 1216 a 1240). WebP q78, 43,5 KiB.
- 02-depois.webp (F172, depois, também a capa). Sem recorte (1200x900, já em 4:3). Desfoque sigma 15 nos números 43 (x 285 a 331, y 480 a 518) e 47 (x 1146 a 1186, y 518 a 554) e na etiqueta da caixa do correio (x 400 a 432, y 627 a 652). A caixa preta na fachada tem um autocolante ilegível e ficou como está. WebP q78, 58,3 KiB.
- 03-depois.webp (F178, depois). Sem recorte nem desfoque, porque não há nada a assinalar. Reduzida de 1800x1350 para 1200x900. WebP q78, 45,3 KiB.
- 04-depois.webp (F190, depois). Sem recorte nem desfoque: a janela está sobre-exposta e não mostra o exterior. Reduzida de 1800x1350 para 1200x900. WebP q78, 22,8 KiB.
- Todas as fotografias: sem metadados (sem EXIF, ICC nem XMP), todas abaixo de 120 KiB, e cada ficheiro final foi revisto com Read, também ampliado nas zonas desfocadas. Nas fotografias finais não aparecem a igreja, placas nem nomes de rua. Resultado gravado em C:/Users/andre/Desktop/Claude_playground/websites/LMDreams/LMDreams/.tmp/projetos/recuperacao-casa.json. Scripts: .tmp/projetos/trabalho/recuperacao-casa/exportar.cjs e resultado.cjs.

Notas da verificação final:

- `01-antes.webp`: os dois homens na rua continuam visíveis como manchas desfocadas, mas não se reconhecem rosto, roupa nem silhueta. Os números de porta estão ilegíveis e o cunhal da igreja ficou fora. O sinal à direita, na porta do vizinho, é um puxador e não um número. As regras aceitam o desfoque porque recortar estragava o par. Os dois ficheiros do par têm 699x932 e mostram a mesma fachada.

