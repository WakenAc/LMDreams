# Redes sociais: personagem e prompts para o Higgsfield

Estilo combinado com o cliente para as redes sociais: **ilustração leve, quase cartoon, mas não infantil**, com um tom sério. Uma **personagem recorrente** aparece nas publicações de recrutamento e, mais tarde, em publicações que esclarecem dúvidas frequentes sobre obras, com ligação para as páginas da empresa.

A personagem (ainda em negociação com o cliente) é um homem atlético de cerca de 50 anos, careca, de óculos escuros e barba grisalha, desenhada no estilo de um cartoon de referência. As imagens de partida ficam fora do Git, em `rss/imgs/redes-sociais/`:

| Ficheiro | Para que serve |
|---|---|
| `personagem-referencia-limpa.jpg` | **Só o estilo de desenho.** É um cartoon de outra personagem, sem o logótipo da parede. |
| `personagem-atletica-referencia-limpa.jpg` | **Só a pessoa.** É a fotografia sem estampas, emblemas, reflexos nas lentes nem fundo com texto. O que ainda sobra por cima da T-shirt, o prompt 1 manda ignorar. |
| `personagem-referencia.jpg`, `personagem-atletica-referencia.jpg` | Os originais, que não se carregam. |
| `camisola-frente.png`, `camisola-costas.png` | **A camisola da empresa**, de frente e de costas (recortes da fotografia `camisola-original.webp`). |
| `camisola-logotipo.png` | O logótipo da camisola, ampliado e sem o telefone. |
| `personagem-costas.png` | A vista de costas, recortada da ficha. |

Pesquisa de 23 de outubro de 2026 (Higgsfield, Meta e Comissão Europeia).

## Regras

- **O texto não vai na imagem.** Os títulos, as profissões (m/f), o logótipo e o endereço são compostos por cima depois de gerada a imagem. Os prompts pedem zonas calmas para esse texto e proíbem letras e logótipos, porque os modelos costumam deformar o texto.
- **A única exceção é a camisola da personagem**, com o logótipo da empresa no peito (e, nas costas, o logótipo grande e o telefone). O modelo copia-o das referências. Confirma as letras com zoom: se saírem deformadas, gera outra vez ou diz-me, e eu ponho o logótipo verdadeiro por cima na composição.
- **Nada da fotografia além da pessoa.** Ficam de fora a roupa e os acessórios por cima da T-shirt, as estampas, o fundo e o ar de super-herói, para a personagem ser só da LMDreams.
- **Ar acessível.** A regra é sorriso e gestos abertos. Braços cruzados e cara fechada fazem-no parecer um segurança, o que afasta candidatos.
- **Cores neutras nas imagens.** Fora o logótipo da camisola, as cores da marca entram só no texto composto por cima. Se o cliente mudar a paleta para as cores do logótipo, as imagens continuam a servir.
- **Segurança em obra.** Nas cenas de obra, a personagem usa capacete e botas de segurança. Só pode ter o capacete na mão fora da zona de trabalho. Os óculos escuros não são equipamento de proteção: não lhes chamar "óculos de proteção".
- **Não dizer que a agenda está cheia**, para não afastar clientes.
- **A personagem é inspirada numa pessoa real**, por isso é preciso guardar a autorização dessa pessoa por escrito antes de publicar.

## Nota de IA

Cada publicação leva "Imagem ilustrativa gerada por IA" de forma discreta:
- **na imagem:** letra pequena (cerca de 16 px numa imagem com 1080 px de largura), branco-sujo com pouca opacidade, num canto da imagem; nas stories e nos reels, perto de um canto, mas fora das margens que a Meta recomenda deixar livres (ver "Definições");
- **no texto da publicação e no texto alternativo:** a mesma frase, no fim.

**Porque chega uma nota discreta:**
- Nas publicações normais, a Meta não exige rótulo em imagens. Só o exige em vídeo fotorrealista e em áudio realista. Pode, ainda assim, mostrar "Informações de IA" por iniciativa própria, se o ficheiro trouxer sinais de IA (metadados C2PA ou IPTC, ou marcas de água invisíveis).
- Nos anúncios pagos, a própria Meta põe esse rótulo em imagens feitas com ferramentas de IA.
- Desde 2 de agosto de 2026, o AI Act (art. 50.º, n.º 4) obriga a identificar as *deep fakes*, ou seja, imagens que passariam por reais. As orientações da Comissão Europeia dão exemplos que não contam como *deep fakes*, como um cartoon gerado por IA a partir de uma imagem já existente de um acontecimento histórico ou ratos a discutir num anúncio de queijo. Em contrapartida, um avatar realista do presidente executivo de uma empresa conta como *deep fake*.
- Uma personagem claramente ilustrada, que não passa por uma pessoa real, provavelmente fica fora dessa obrigação. Nesse caso, a nota é voluntária. A avaliação cabe à empresa e faz-se caso a caso, porque o contexto também conta.

**Atenção:** como a personagem parte da fotografia de uma pessoa real, tem de ficar claramente cartoon. Se o estilo derivar para o realista, a imagem pode passar a contar como *deep fake*. Nesse caso, a nota tem de ser clara e distinguível, e não pode passar despercebida. O código de práticas europeu, que é voluntário, pede-a na própria imagem, legível e com bom contraste, e não só no texto da publicação. Antes de campanhas pagas, convém confirmar a classificação com um advogado. Isto não é aconselhamento jurídico.

## Definições

| | |
|---|---|
| Modelo | **Nano Banana 2.1**: aceita até 14 imagens de referência e mantém até 4 personagens. Alternativas: **GPT Image 2.5** (qualidade `high`, até 16 referências) ou **FLUX 3 Image** (até 10 referências). |
| Formato | **Escolhe-o à mão em cada geração**, nunca em `auto`. Com referências, o `auto` pode copiar a forma da imagem de referência. |
| Testes | 1 variação em `1k`. Quando uma imagem sair certa, amplia-a com o *Upscale* do Higgsfield (2×) em vez de a gerar outra vez em `2k`: uma nova geração dá outra imagem, com outros detalhes. Poupa o limite diário, e a imagem ampliada chega aos 1080 px de largura das publicações. |
| Referências | Anexa-as em cada geração. Segundo a documentação do Higgsfield, os *Elements* (`@nome`) não funcionam com estes três modelos. O *Soul ID* foi feito para pessoas reais, a partir de 20 ou mais fotografias, e só funciona com modelos fotorrealistas. Não serve para uma personagem ilustrada. |

**Formatos das publicações**, segundo a ajuda do Instagram e o guia de anúncios da Meta:

| Onde | Gerar em | Publicações finais |
|---|---|---|
| Feed do Instagram e do Facebook | **3:4** | 1080 × 1440 (o máximo no Instagram; segundo fontes não oficiais, enche a miniatura da grelha do perfil) e, cortada da mesma imagem, 1080 × 1350 (4:5, o máximo nos anúncios pagos). Não encontrámos um tamanho indicado pela Meta para as publicações normais no Facebook; a versão 4:5 parece uma escolha segura. |
| Stories e reels | **9:16** | 1080 × 1920. No guia de anúncios, a Meta recomenda deixar sem texto, logótipos nem elementos importantes cerca de 14% em cima, 35% em baixo e 6% de cada lado. |
| Retrato e ficha da personagem | **3:4** e **3:2** | Só para uso interno. |

## Ordem

1. **Retrato da personagem** (prompt 1), com duas referências:
   - **imagem 1:** `personagem-referencia-limpa.jpg`, só para o estilo;
   - **imagem 2:** `personagem-atletica-referencia-limpa.jpg`, só para a pessoa.

   É o passo que transforma a fotografia em cartoon. Repete até sair certo e guarda o melhor como `personagem-mestre.png`.
2. **Ficha da personagem** (prompt 2), só com `personagem-mestre.png` como imagem 1. Quando sair certa em `1k`, amplia-a com o *Upscale* (2×) e guarda-a como `personagem-ficha.png`: em `1k`, cada vista de corpo inteiro fica com cerca de 400 px de altura. Eu recorto dela:
   - a vista de três quartos de corpo inteiro (a segunda da linha de cima), como `personagem-corpo-inteiro.png`;
   - o primeiro grande plano (óculos tirados), como `personagem-olhos.png`.
3. **Camisola da empresa** (prompts 2A a 2C): veste a personagem com a camisola, editando as referências que já existem.
   - Prompt 2A: `personagem-mestre.png` passa a `personagem-mestre-camisola.png`.
   - Prompt 2B: `personagem-corpo-inteiro.png` passa a `personagem-corpo-inteiro-camisola.png`.
   - Prompt 2C, opcional, para cenas de costas: `personagem-costas.png` passa a `personagem-costas-camisola.png`.
4. **Recrutamento** (prompts 3 a 5), com duas referências:
   - **imagem 1:** `personagem-mestre-camisola.png`, que manda no rosto, nos óculos, no logótipo e no estilo;
   - **imagem 2:** `personagem-corpo-inteiro-camisola.png`, que manda no corpo e na roupa.
5. **Série de dúvidas sobre obras** (prompt 6), mais tarde, com as mesmas duas referências. Quando os olhos se veem (óculos tirados ou descidos), junta também a **imagem 3:** `personagem-olhos.png`.

A partir do passo 2, **não voltes a usar a fotografia nem o cartoon antigo**. A partir do passo 4, usa só as versões com a camisola. A fotografia puxa para o realismo e o cartoon antigo é outra pessoa. Também não uses a ficha inteira como referência: os modelos tendem a copiar a grelha e a desenhar várias figuras.

Compara sempre cada resultado com as referências, e não com a imagem anterior. Assim os pequenos desvios não se acumulam.

## Os óculos escuros

Os óculos escuros são a marca da personagem, mas escondem os olhos. A expressão vem das sobrancelhas, da testa, da boca e dos gestos. As sobrancelhas ficam sempre visíveis por cima da armação. A ficha fixa três estados:

| Estado | Quando |
|---|---|
| **Postos** | Nas obras ao ar livre e no recrutamento. Com o capacete, a cabeça careca não se vê, e são os óculos que o identificam. Nas obras dentro de casa (prompt 6), podem estar tirados ou descidos, porque continuam à vista. |
| **Tirados, pendurados na gola da T-shirt por uma haste** | Dentro de casa, nas explicações e nos grandes planos. Os olhos veem-se e os óculos continuam à vista. |
| **Descidos na ponta do nariz**, a espreitar por cima com uma sobrancelha levantada | Nas publicações sobre mitos ("É verdade que…?"). |

Os olhos não aparecem na fotografia. O prompt 2 e as opções do prompt 6 pedem olhos castanho-escuros. Se a pessoa real os tiver de outra cor, troca `dark-brown` em todos antes de gerar a ficha.

## 1. `personagem-mestre` (3:4)

Imagem 1: `personagem-referencia-limpa.jpg` (só o estilo). Imagem 2: `personagem-atletica-referencia-limpa.jpg` (só a pessoa).

```
Image 1 is only a style reference. Copy its drawing style exactly, but not the man in it: not his face, beard, glasses, eyes, ears, skin tone, body shape, pose or expression. Image 2 is only the identity reference. Redraw the man in Image 2 as a cartoon character in the drawing style of Image 1. From Image 2, ignore the photographic rendering and lighting, the cape, the round brooch, the background, the reflections in the lenses, the low camera angle, the crossed arms and the stern look. The character: an original adult man of around fifty with a strong, athletic, muscular build, like a seasoned working man who trains, not a superhero; a completely clean-shaven bald head with a large, tall, smooth dome and no hair anywhere on the scalp; a broad, full face with a wide, heavy jaw and three deep horizontal forehead wrinkles; dark, slightly bushy, fairly straight eyebrows with a few grey hairs, sitting low and always visible just above his sunglasses; wide squared-rectangular sunglasses with a thick matte black full-rim frame, a straight flat top bar, slightly rounded corners, thick temples and plain dark smoke-grey lenses with one flat highlight, no reflections, hiding his eyes; a broad, fleshy nose with a rounded tip; closed, medium-full lips; a short, neatly trimmed salt-and-pepper beard mixing charcoal and silver-white, with a darker moustache joined to a denser, slightly longer, rounded chin beard that is greyest at the chin, shorter stubble on the cheeks and along the jaw up to the ears, and clean upper cheeks; medium ears close to the head; warm sun-tanned medium skin with an olive-bronze undertone; a very thick neck flowing into heavy trapezius muscles, very broad shoulders, big rounded upper arms, thick strong forearms and a deep chest; a plain black short-sleeved crew-neck T-shirt with no print, fitted over his shoulders and arms; wide plain matte black wrist wraps on both wrists, with a few parallel ridge lines. Draw his muscles as simple solid volumes with a few clean contour lines and flat cel shading, with realistic adult proportions and a normal head-to-body ratio: no vein networks, no shiny skin, no exaggerated V-shaped torso, no bulging comic-book anatomy. Pose: seen from mid-thigh up, wearing dark grey work trousers with side pockets, eye-level camera, standing relaxed and approachable, arms loose at his sides with both hands and both wrist wraps fully inside the frame, hands not on his hips and arms not crossed, with a warm, confident closed-mouth smile. Plain warm off-white background. Clean 2D digital cartoon illustration with a semi-realistic adult look, in the same drawing style as Image 1: smooth confident near-black outlines, slightly heavier on the outer silhouette and finer for wrinkles; hard-edged cel shading with one flat shadow tone per colour and small flat highlights; muted, warm, naturalistic, slightly desaturated colours; realistic adult proportions; backgrounds softer and simpler than the character. Serious, grounded, lightly humorous tone. Not chibi, not big-eyed anime, not 3D or Pixar style, not photorealistic. Only one person in the image. No cape, no brooch, no emblem, no sweat drop, no text, no letters, no numbers, no logos and no watermark anywhere, including on the T-shirt.
```

## 2. `personagem-ficha` (3:2; imagem 1: `personagem-mestre.png`)

```
Image 1 shows an original cartoon character. Redraw exactly this character, in exactly the same drawing style, as a clean character design sheet on a plain warm off-white background. Keep his bald head, his wide squared matte black sunglasses with dark smoke-grey lenses, his short salt-and-pepper beard greyest at the chin, his low dark eyebrows, his broad full face, his warm olive-bronze skin, his strong athletic build with a very thick neck and broad muscular shoulders and arms, his plain fitted black crew-neck T-shirt and the wide matte black wrist wraps on both wrists. Complete the outfit, which Image 1 does not show, and keep it fixed: dark grey work trousers with side pockets and black leather safety boots. Layout: top row, the same character four times, full body, standing naturally with relaxed arms, sunglasses on, without a hard hat: front view, three-quarter view, side view, back view. Bottom row: the same character in three-quarter view, full body, wearing a plain white hard hat with no markings and his sunglasses; then three head-and-shoulders close-ups: first, sunglasses off and hooked by one temple into the collar of his T-shirt, showing small realistic dark-brown eyes with light crow's feet, explaining calmly; second, sunglasses on, a warm open smile; third, sunglasses lowered to the tip of his nose, peering over them with one eyebrow raised in a sceptical, doubtful look. Same proportions and design in every view. Leave clear empty space around every figure so that none overlap, with no panel borders, grid lines, guide lines or colour swatches. Draw his muscles as simple solid volumes with flat cel shading and a normal head-to-body ratio: no veins, no shiny skin, no exaggerated V-shaped torso. Clean 2D digital cartoon illustration with a semi-realistic adult look: smooth confident near-black outlines, slightly heavier on the outer silhouette and finer for wrinkles; hard-edged cel shading with one flat shadow tone per colour and small flat highlights; muted, warm, naturalistic, slightly desaturated colours. Serious, grounded, lightly humorous tone. Not chibi, not big-eyed anime, not 3D or Pixar style, not photorealistic. No cape, no brooch, no emblem, no text, no letters, no numbers, no labels, no logos and no watermark anywhere, including on signs, helmets, vests and clothing.
```

## 2A. `personagem-mestre-camisola` (3:4): a camisola no retrato

Imagem 1: `personagem-mestre.png`. Imagem 2: `camisola-frente.png`. Imagem 3: `camisola-logotipo.png`.

É uma edição: o modelo só muda a camisola e deixa o resto igual.

```
Edit Image 1. Keep everything in Image 1 exactly the same: the same character, face, sunglasses, beard, skin, build, pose, expression, drawing style, colours, lighting, framing and background. Change only his T-shirt: it becomes the company T-shirt shown in Image 2, a plain black short-sleeved crew-neck T-shirt with one small logo printed on his left chest, which is on the right side of the image as we look at him, at the size and position shown in Image 2: about the width of his palm, just below the collarbone. The logo is the one in Image 3: a yellow house-roof outline with a chimney on the right, a small yellow square divided into four with the letters L, M, D and C, and two lines of red lettering below it, "LMDreams" and "Construções Lda". Copy the logo's shapes, colours and letters exactly, drawn flat and clean in the same cartoon style and following the fabric. Nothing else on the T-shirt: no other print, no phone number on the front, nothing on the sleeves. No other text, letters, numbers or logos anywhere in the image.
```

## 2B. `personagem-corpo-inteiro-camisola` (1:2 ou o formato mais estreito que houver): a camisola no corpo inteiro

Imagem 1: `personagem-corpo-inteiro.png`. Imagem 2: `camisola-frente.png`. Imagem 3: `camisola-logotipo.png`.

```
Edit Image 1. Keep everything in Image 1 exactly the same: the same character, face, sunglasses, beard, skin, build, three-quarter pose, trousers, boots, wrist wraps, drawing style, colours, framing and plain background. Change only his T-shirt: it becomes the company T-shirt shown in Image 2, a plain black short-sleeved crew-neck T-shirt with one small logo printed on his left chest, at the size and position shown in Image 2: about the width of his palm, just below the collarbone, turning slightly with the chest in this three-quarter view. The logo is the one in Image 3: a yellow house-roof outline with a chimney on the right, a small yellow square divided into four with the letters L, M, D and C, and two lines of red lettering below it, "LMDreams" and "Construções Lda". Copy the logo's shapes, colours and letters exactly, drawn flat and clean in the same cartoon style. Nothing else on the T-shirt: no other print, no phone number on the front, nothing on the sleeves. No other text, letters, numbers or logos anywhere in the image.
```

## 2C. `personagem-costas-camisola` (1:2 ou o formato mais estreito que houver; opcional): as costas da camisola

Imagem 1: `personagem-costas.png`. Imagem 2: `camisola-costas.png`. Imagem 3: `camisola-logotipo.png`.

Serve para cenas em que a personagem aparece de costas, por exemplo a caminho da obra. Confirma o número de telefone com zoom: se sair errado, eu corrijo-o na composição.

```
Edit Image 1, which shows the character from behind. Keep everything in Image 1 exactly the same: the same character, bald head, build, pose, trousers, boots, wrist wraps, drawing style, colours, framing and plain background. Change only the back of his black T-shirt: add the large print shown in Image 2, centred between the shoulder blades, about the width of his upper back. The print is the logo from Image 3 (a yellow house-roof outline with a chimney on the right, a small yellow square divided into four with the letters L, M, D and C, and two lines of red lettering below it, "LMDreams" and "Construções Lda"), and below it, in white, a small phone icon and the number 919 233 372. Copy the shapes, colours, letters and digits exactly, drawn flat and clean in the same cartoon style and following the fabric. Nothing on the sleeves. No other text, letters, numbers or logos anywhere in the image.
```


## Início comum dos prompts 3 a 6

**A partir daqui, as imagens já não são as do passo 1.** Em todos os prompts seguintes:
- **imagem 1:** `personagem-mestre-camisola.png`;
- **imagem 2:** `personagem-corpo-inteiro-camisola.png`, o recorte da ficha já com a camisola.

A fotografia e o cartoon antigo já não entram.

O bloco abaixo já está incluído em cada prompt. Repete as características da personagem em todas as gerações, como aconselha a OpenAI, para reduzir os desvios. A Google também pede descrições concretas para manter a consistência.

```
Image 1 and Image 2 show the same original cartoon character. Image 1 is the master for his face, sunglasses, beard, T-shirt logo and drawing style; Image 2 is the master for his full-body proportions and outfit. Keep exactly the same character and do not redesign him: a man of around fifty with a clean-shaven bald dome head, wide squared matte black sunglasses with plain dark smoke-grey lenses, short salt-and-pepper beard greyest at the chin, low dark slightly bushy eyebrows above the frame, broad full face with a fleshy rounded nose, warm sun-tanned olive-bronze skin, strong athletic build with a very thick neck and broad muscular shoulders and arms, fitted black company T-shirt with the small logo on his left chest exactly as in Image 1, dark grey work trousers, black safety boots, wide black wrist wraps on both wrists. Change only his pose, expression and setting, and add the hard hat when the scene asks for it. Friendly, open body language: no crossed arms, no stern look, no heroic low camera angle. Draw him only once; he is the only person in the image who looks like him. Ignore the backgrounds of the reference images.
```

## 3. `recrutamento-convite` (3:4; imagem 1: `personagem-mestre-camisola.png`; imagem 2: `personagem-corpo-inteiro-camisola.png`): publicação principal

```
Image 1 and Image 2 show the same original cartoon character. Image 1 is the master for his face, sunglasses, beard, T-shirt logo and drawing style; Image 2 is the master for his full-body proportions and outfit. Keep exactly the same character and do not redesign him: a man of around fifty with a clean-shaven bald dome head, wide squared matte black sunglasses with plain dark smoke-grey lenses, short salt-and-pepper beard greyest at the chin, low dark slightly bushy eyebrows above the frame, broad full face with a fleshy rounded nose, warm sun-tanned olive-bronze skin, strong athletic build with a very thick neck and broad muscular shoulders and arms, fitted black company T-shirt with the small logo on his left chest exactly as in Image 1, dark grey work trousers, black safety boots, wide black wrist wraps on both wrists. Change only his pose, expression and setting, and add the hard hat when the scene asks for it. Friendly, open body language: no crossed arms, no stern look, no heroic low camera angle. Draw him only once; he is the only person in the image who looks like him. Ignore the backgrounds of the reference images. Scene: he stands on the construction site of a contemporary two-storey house in the Setúbal peninsula, Portugal, wearing a plain white hard hat with no markings and his sunglasses, with the house, light scaffolding, stacked concrete blocks and umbrella pines in the background, all kept below the top 35% of the frame, in soft late-afternoon light. He looks at the viewer with a warm, confident smile and gestures with an open hand towards the empty upper part of the frame, as if inviting the viewer to join the team. Far in the background, below the top 35% of the frame, two small simplified workers who look clearly different from him (slimmer, no beard, no sunglasses, light grey work shirts), wearing hard hats and seen from behind, lay blocks and paint a wall. Vertical 3:4 frame: the top 35% is calm, plain sky with no detail; he is seen from the knees up, in the lower half, slightly left of centre; keep his head and hands away from the edges of the frame. Clean 2D digital cartoon illustration with a semi-realistic adult look, in the same drawing style as Image 1: smooth confident near-black outlines, slightly heavier on the outer silhouette and finer for wrinkles; hard-edged cel shading with one flat shadow tone per colour and small flat highlights; muted, warm, naturalistic, slightly desaturated colours; realistic adult proportions; backgrounds softer and simpler than the character, with gentle painterly gradients. Serious, grounded, lightly humorous tone. Not chibi, not big-eyed anime, not 3D or Pixar style, not photorealistic. No cape, no brooch, no emblem, no superhero look, no reflections in the sunglasses lenses. The only logo in the image is the small company logo on his T-shirt, exactly as in Image 1; no other text, letters, numbers, logos or watermark anywhere, including on signs, helmets, vests and the other workers' clothing.
```

## 4. `recrutamento-story` (9:16; imagem 1: `personagem-mestre-camisola.png`; imagem 2: `personagem-corpo-inteiro-camisola.png`): stories e reels

```
Image 1 and Image 2 show the same original cartoon character. Image 1 is the master for his face, sunglasses, beard, T-shirt logo and drawing style; Image 2 is the master for his full-body proportions and outfit. Keep exactly the same character and do not redesign him: a man of around fifty with a clean-shaven bald dome head, wide squared matte black sunglasses with plain dark smoke-grey lenses, short salt-and-pepper beard greyest at the chin, low dark slightly bushy eyebrows above the frame, broad full face with a fleshy rounded nose, warm sun-tanned olive-bronze skin, strong athletic build with a very thick neck and broad muscular shoulders and arms, fitted black company T-shirt with the small logo on his left chest exactly as in Image 1, dark grey work trousers, black safety boots, wide black wrist wraps on both wrists. Change only his pose, expression and setting, and add the hard hat when the scene asks for it. Friendly, open body language: no crossed arms, no stern look, no heroic low camera angle. Draw him only once; he is the only person in the image who looks like him. Ignore the backgrounds of the reference images. Scene: he stands on a house construction site in front of a low section of light metal scaffold that stays below the top 40% of the frame, wearing a plain white hard hat with no markings and his sunglasses, smiling and pointing up at the empty sky with one hand raised beside his head, the fingertip no higher than the top of his hard hat, in soft late-afternoon light. Vertical 9:16 frame: the top 40% is calm, plain sky with no detail; his head is between 40% and 55% of the frame height and his body continues down to the bottom edge; nothing important in the outer 6% at each side. Clean 2D digital cartoon illustration with a semi-realistic adult look, in the same drawing style as Image 1: smooth confident near-black outlines, slightly heavier on the outer silhouette and finer for wrinkles; hard-edged cel shading with one flat shadow tone per colour and small flat highlights; muted, warm, naturalistic, slightly desaturated colours; realistic adult proportions; backgrounds softer and simpler than the character, with gentle painterly gradients. Serious, grounded, lightly humorous tone. Not chibi, not big-eyed anime, not 3D or Pixar style, not photorealistic. No cape, no brooch, no emblem, no superhero look, no reflections in the sunglasses lenses. The only logo in the image is the small company logo on his T-shirt, exactly as in Image 1; no other text, letters, numbers, logos or watermark anywhere, including on signs, helmets, vests and the other workers' clothing.
```

## 5. `recrutamento-<profissão>` (3:4; imagem 1: `personagem-mestre-camisola.png`; imagem 2: `personagem-corpo-inteiro-camisola.png`): uma por profissão

Troca só a parte entre parêntesis retos. Por exemplo:
- `pedreiro`: laying concrete blocks with a trowel on a wall under construction;
- `pintor`: painting a facade with a roller from a low platform;
- `servente`: carrying a bucket of mortar across the site;
- `ladrilhador`: laying large floor tiles with a notched trowel and spacers.

```
Image 1 and Image 2 show the same original cartoon character. Image 1 is the master for his face, sunglasses, beard, T-shirt logo and drawing style; Image 2 is the master for his full-body proportions and outfit. Keep exactly the same character and do not redesign him: a man of around fifty with a clean-shaven bald dome head, wide squared matte black sunglasses with plain dark smoke-grey lenses, short salt-and-pepper beard greyest at the chin, low dark slightly bushy eyebrows above the frame, broad full face with a fleshy rounded nose, warm sun-tanned olive-bronze skin, strong athletic build with a very thick neck and broad muscular shoulders and arms, fitted black company T-shirt with the small logo on his left chest exactly as in Image 1, dark grey work trousers, black safety boots, wide black wrist wraps on both wrists. Change only his pose, expression and setting, and add the hard hat when the scene asks for it. Friendly, open body language: no crossed arms, no stern look, no heroic low camera angle. Draw him only once; he is the only person in the image who looks like him. Ignore the backgrounds of the reference images. Scene: on a house construction site, he stands in the foreground on the left, wearing a plain white hard hat with no markings and his sunglasses, looking at the viewer with a confident nod and pointing with an open hand towards a simplified worker behind him on the right who looks clearly different from him (slimmer, clean-shaven, no sunglasses, light grey work shirt), seen from behind or in profile, with no detailed face, wearing a hard hat and work clothes and [TRADE ACTION, e.g. laying concrete blocks with a trowel on a wall under construction], in soft late-afternoon light. Vertical 3:4 frame: the top 35% is calm, plain background with no detail; both figures are in the lower 65%; keep heads and hands away from the edges of the frame. Clean 2D digital cartoon illustration with a semi-realistic adult look, in the same drawing style as Image 1: smooth confident near-black outlines, slightly heavier on the outer silhouette and finer for wrinkles; hard-edged cel shading with one flat shadow tone per colour and small flat highlights; muted, warm, naturalistic, slightly desaturated colours; realistic adult proportions; backgrounds softer and simpler than the character, with gentle painterly gradients. Serious, grounded, lightly humorous tone. Not chibi, not big-eyed anime, not 3D or Pixar style, not photorealistic. No cape, no brooch, no emblem, no superhero look, no reflections in the sunglasses lenses. The only logo in the image is the small company logo on his T-shirt, exactly as in Image 1; no other text, letters, numbers, logos or watermark anywhere, including on signs, helmets, vests and the other workers' clothing.
```

## 6. Série "dúvidas sobre obras" (3:4; imagem 1: `personagem-mestre-camisola.png`; imagem 2: `personagem-corpo-inteiro-camisola.png`; imagem 3, quando os olhos se veem: `personagem-olhos.png`): modelo para mais tarde

Troca as duas partes entre parêntesis retos:
- **os óculos e a expressão**, em inglês:
  - `with his sunglasses off and hooked by one temple into his T-shirt collar, showing small realistic dark-brown eyes with light crow's feet, explaining calmly with one hand raised` (a explicar com calma, dentro de casa);
  - `with his sunglasses lowered to the tip of his nose, peering over them with his small dark-brown eyes and one eyebrow raised in a sceptical, doubtful look` (a desconfiar, para os mitos: "É verdade que…?");
  - `with his sunglasses on, satisfied, giving a thumbs-up` (satisfeito, para as boas práticas, ao ar livre);
- **a cena do tema**, também em inglês.

Nas duas primeiras opções, os olhos veem-se: junta a imagem 3 (`personagem-olhos.png`) e acrescenta, logo a seguir à primeira frase do prompt, `Image 3 is the master for his eyes when the sunglasses are off or lowered.`

O prompt já põe o capacete. Numa cena fora da zona de trabalho, troca `wearing a plain white hard hat with no markings` por `holding a plain white hard hat with no markings in one hand`.

**Os temas vêm de perguntas reais**: as pesquisas que aparecem no Search Console e a caixa "Outras perguntas" do Google. **Cada resposta deve existir também no site**, por exemplo numa pergunta frequente, e a publicação resume-a e liga para lá. Assim, a resposta fica numa página do site, que o Google e os assistentes de IA podem encontrar e citar.

```
Image 1 and Image 2 show the same original cartoon character. Image 1 is the master for his face, sunglasses, beard, T-shirt logo and drawing style; Image 2 is the master for his full-body proportions and outfit. Keep exactly the same character and do not redesign him: a man of around fifty with a clean-shaven bald dome head, wide squared matte black sunglasses with plain dark smoke-grey lenses, short salt-and-pepper beard greyest at the chin, low dark slightly bushy eyebrows above the frame, broad full face with a fleshy rounded nose, warm sun-tanned olive-bronze skin, strong athletic build with a very thick neck and broad muscular shoulders and arms, fitted black company T-shirt with the small logo on his left chest exactly as in Image 1, dark grey work trousers, black safety boots, wide black wrist wraps on both wrists. Change only his pose, expression and setting, and add the hard hat when the scene asks for it. Friendly, open body language: no crossed arms, no stern look, no heroic low camera angle. Draw him only once; he is the only person in the image who looks like him. Ignore the backgrounds of the reference images. Scene: he stands three-quarter to the viewer, wearing a plain white hard hat with no markings, [SUNGLASSES AND EXPRESSION, e.g. with his sunglasses off and hooked by one temple into his T-shirt collar, showing small realistic dark-brown eyes with light crow's feet, explaining calmly with one hand raised], next to [SCENE OF THE TOPIC, e.g. a bathroom being renovated, with new tiles half laid]. Vertical 3:4 frame: the top 35% is a calm, plain area with no detail; he and the scene occupy the lower 65%; keep his head and hands away from the edges of the frame. Clean 2D digital cartoon illustration with a semi-realistic adult look, in the same drawing style as Image 1: smooth confident near-black outlines, slightly heavier on the outer silhouette and finer for wrinkles; hard-edged cel shading with one flat shadow tone per colour and small flat highlights; muted, warm, naturalistic, slightly desaturated colours; realistic adult proportions; backgrounds softer and simpler than the character, with gentle painterly gradients. Serious, grounded, lightly humorous tone. Not chibi, not big-eyed anime, not 3D or Pixar style, not photorealistic. No cape, no brooch, no emblem, no superhero look, no reflections in the sunglasses lenses. The only logo in the image is the small company logo on his T-shirt, exactly as in Image 1; no other text, letters, numbers, logos or watermark anywhere, including on signs, helmets, vests and the other workers' clothing.
```

## Se o resultado fugir

| Problema | Acrescenta ao prompt |
|---|---|
| Aparece cabelo | `completely bald, no hair at all, not even at the sides or back` |
| A barba fica castanha e cheia, ou toda branca | `short salt-and-pepper beard, charcoal and silver, greyest at the chin, stubble on the cheeks` |
| Fica gordo, parecido com o cartoon antigo | `strong athletic build, firm muscular chest and arms, not chubby, not soft` |
| Parece um super-herói ou um culturista | `simple muscle volumes, normal head-to-body ratio, no veins, no V-shaped torso, ordinary working man` |
| Fica novo e magro | `around fifty, broad full face, heavy jaw, very thick neck` |
| Os óculos mudam, ficam transparentes ou espelhados | `wide squared matte black sunglasses with plain dark smoke-grey lenses, no reflections` |
| Desenha os olhos através das lentes | `the dark lenses hide his eyes completely` |
| Parece um segurança | `warm smile, relaxed open posture, approachable` |
| Fica infantil | `mature adult proportions, adult facial wrinkles, same cel-shaded cartoon style as Image 1` |
| Fica realista | `flat colour areas, visible outlines, no photographic detail` |
| Aparece a capa, texto ou um logótipo | Repete a última frase do prompt e gera outra vez |
| O logótipo da camisola sai deformado ou com letras erradas | Junta `camisola-logotipo.png` como imagem 3 e acrescenta `copy the T-shirt logo exactly from Image 3`; se continuar mal, diz-me e eu ponho o logótipo verdadeiro por cima |
| O logótipo muda de lado ou de tamanho | `small logo on his left chest only, about the width of his palm` |

Se o estilo continuar a fugir no passo 1, experimenta o **Nano Banana Pro** com as mesmas referências. A documentação da Google parece indicar que este modelo aceita referências de estilo, mas não está confirmado.

## Depois de gerar

Guarda as imagens escolhidas em `rss/imgs/redes-sociais/` com os nomes indicados e diz-me. Eu faço:
- os recortes `personagem-corpo-inteiro.png`, `personagem-olhos.png` e `personagem-costas.png` a partir da ficha;
- a verificação do logótipo da camisola e, se for preciso, a troca pelo logótipo verdadeiro;
- as publicações finais em 1080 × 1440, 1080 × 1350 e 1080 × 1920, com:
  - o título;
  - as profissões (m/f);
  - o logótipo;
  - o endereço `lmdreams.pt/trabalhe-connosco`;
  - a nota de IA discreta;
- o texto da publicação para o Facebook e o Instagram, com o texto alternativo;
- o registo de proveniência (modelo, prompt, referências e data).
