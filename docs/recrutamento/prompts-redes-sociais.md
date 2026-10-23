# Redes sociais: personagem e prompts para o Higgsfield

Estilo combinado com o cliente para as redes sociais: **ilustração leve, quase cartoon, mas não infantil**, com um tom sério. Uma **personagem recorrente** aparece nas publicações de recrutamento e, mais tarde, em publicações que esclarecem dúvidas frequentes sobre obras, com ligação para as páginas da empresa.

A personagem parte de uma imagem de referência em estilo cartoon, que fica fora do Git em `rss/imgs/redes-sociais/`:
- `personagem-referencia.jpg`: o original;
- `personagem-referencia-limpa.jpg`: a mesma imagem sem o logótipo da parede. É esta que se carrega no Higgsfield, para o modelo não copiar o texto.

Pesquisa de 23 de outubro de 2026 (Higgsfield, Meta e Comissão Europeia).

## Regras

- **O texto não vai na imagem.** Os títulos, as profissões (m/f), o logótipo e o endereço são compostos por cima depois de gerada a imagem. Os prompts pedem zonas calmas para esse texto e proíbem letras e logótipos, porque os modelos costumam deformar o texto.
- **Cores neutras nas imagens.** As cores da marca entram só no texto composto por cima. Se o cliente mudar a paleta para as cores do logótipo, as imagens continuam a servir.
- **Segurança em obra.** Nas cenas de obra, a personagem usa capacete e botas de segurança. Só pode ter o capacete na mão fora da zona de trabalho.
- **Não dizer que a agenda está cheia**, para não afastar clientes.
- **Se a personagem for inspirada numa pessoa real**, guardar a autorização dessa pessoa por escrito.

## Nota de IA

Cada publicação leva "Imagem ilustrativa gerada por IA" de forma discreta:
- **na imagem:** letra pequena (cerca de 16 px numa imagem com 1080 px de largura), branco-sujo com pouca opacidade, num canto da imagem; nas stories e nos reels, dentro da zona livre indicada em "Definições";
- **no texto da publicação e no texto alternativo:** a mesma frase, no fim.

**Porque chega uma nota discreta:**
- Nas publicações normais, a Meta não exige rótulo em imagens. Só o exige em vídeo fotorrealista e em áudio realista. Pode, ainda assim, mostrar "Informações de IA" por iniciativa própria, se o ficheiro trouxer sinais de IA (metadados C2PA ou IPTC, ou marcas de água invisíveis).
- Nos anúncios pagos, a própria Meta põe esse rótulo em imagens feitas com ferramentas de IA.
- Desde 2 de agosto de 2026, o AI Act (art. 50.º, n.º 4) obriga a identificar as *deep fakes*, ou seja, imagens que passariam por reais. As orientações da Comissão Europeia dão exemplos que não contam como *deep fakes*, como um cartoon gerado por IA sobre um acontecimento histórico ou ratos a discutir num anúncio de queijo. Em contrapartida, um avatar realista do presidente executivo de uma empresa conta como *deep fake*.
- Uma personagem claramente ilustrada, que não passa por uma pessoa real, provavelmente fica fora dessa obrigação. Nesse caso, a nota é voluntária. A avaliação cabe à empresa e faz-se caso a caso, porque o contexto também conta.

**Atenção:** se o estilo derivar para o realista, a imagem pode passar a contar como *deep fake*. Nesse caso, a nota tem de ser clara e distinguível: na própria imagem, legível e com bom contraste, e não só no texto da publicação. Antes de campanhas pagas, convém confirmar a classificação com um advogado. Isto não é aconselhamento jurídico.

## Definições

| | |
|---|---|
| Modelo | **Nano Banana 2.1**: aceita até 14 imagens de referência e mantém até 4 personagens. Alternativas: **GPT Image 2.5** (qualidade `high`, até 16 referências) ou **FLUX 3 Image** (até 10 referências). |
| Formato | **Escolhe-o à mão em cada geração**, nunca em `auto`. Com referências, o `auto` pode copiar a forma da imagem de referência. |
| Testes | 1 variação em `1k`. Passa a `2k` só quando a personagem sair certa. Poupa o limite diário. |
| Referências | Anexa-as em cada geração. Segundo a documentação do Higgsfield, os *Elements* (`@nome`) não funcionam com estes três modelos. O *Soul ID* foi feito para pessoas reais, a partir de 20 ou mais fotografias, e só funciona com modelos fotorrealistas. Não serve para uma personagem ilustrada. |

**Formatos das publicações**, segundo a ajuda do Instagram e o guia de anúncios da Meta:

| Onde | Gerar em | Publicações finais |
|---|---|---|
| Feed do Instagram e do Facebook | **3:4** | 1080 × 1440 (o máximo no Instagram; segundo fontes não oficiais, enche a miniatura da grelha do perfil) e, cortada da mesma imagem, 1080 × 1350 (4:5, o máximo nos anúncios pagos). A Meta não indica um tamanho para as publicações normais no Facebook; a versão 4:5 é uma escolha segura. |
| Stories e reels | **9:16** | 1080 × 1920. No guia de anúncios, a Meta recomenda deixar sem texto, logótipos nem elementos importantes cerca de 14% em cima, 35% em baixo e 6% de cada lado. |
| Ficha da personagem | **3:2** | Só para uso interno. |

## Ordem

1. **Ficha da personagem** (prompt 1), com `personagem-referencia-limpa.jpg` como imagem 1. Quando a personagem sair certa em `1k`, gera a ficha em `2k` (ou `4k`) e guarda a melhor como `personagem-ficha.png`: numa ficha em `1k`, cada vista de corpo inteiro fica com cerca de 400 px de altura. Eu recorto dela a vista de três quartos de corpo inteiro sem capacete (a segunda da linha de cima), para a cabeça careca ficar visível, e guardo-a como `personagem-corpo-inteiro.png`.
2. **Recrutamento** (prompts 2 a 4), com as duas referências:
   - **imagem 1:** `personagem-referencia-limpa.jpg`, que manda no rosto e no estilo;
   - **imagem 2:** `personagem-corpo-inteiro.png`, que manda no corpo e na roupa.

   Não uses a ficha inteira como referência: os modelos tendem a copiar a grelha e a desenhar várias figuras.
3. **Série de dúvidas sobre obras** (prompt 5), mais tarde.

Compara sempre cada resultado com as referências, e não com a imagem anterior. Assim os pequenos desvios não se acumulam.

## 1. `personagem-ficha` (3:2; imagem 1)

```
Image 1 is the design reference for an original character. Redraw exactly this character as a clean character design sheet on a plain warm off-white background. Use Image 1 only for his face, head, glasses, beard, build, T-shirt and drawing style; ignore its background, the selfie camera angle, the thumbs-up pose, the worried expression and the sweat drop. The character: a heavyset, stocky man in his forties; completely bald, with a large smooth round head and no hair anywhere on the scalp; warm light-tan skin; a broad round face with full cheeks, slightly protruding ears and light forehead creases; thick dark-brown eyebrows; thick matte black rectangular full-rim glasses with slightly rounded corners and clear lenses; small realistic dark-brown eyes; a broad nose with a rounded tip; a dense, full, short-to-medium dark-brown beard with only a few faint lighter strands, joined to a full moustache, covering the cheeks, jaw and chin and reaching down to the neck, with sideburns that stop at the ear lobes; a thick neck, broad shoulders and a big chest; a plain black short-sleeved crew-neck T-shirt with no print; a plain matte black wristband on his right wrist, the same wrist in every view. Complete the outfit, which Image 1 does not show, and keep it fixed: dark grey work trousers with side pockets and black leather safety boots. Layout: top row, the same character four times, full body, standing naturally with relaxed arms, without a hard hat: front view, three-quarter view, side view, back view. Bottom row: the same character in three-quarter view, full body, wearing a plain white hard hat with no markings; then three head-and-shoulders close-ups: explaining calmly, warm confident smile, one eyebrow raised in a sceptical, doubtful look. Same proportions and design in every view. Leave clear empty space around every figure so that none overlap, with no panel borders, grid lines, guide lines or colour swatches. Clean 2D digital cartoon illustration with a semi-realistic adult look, in the same drawing style as Image 1: smooth confident near-black outlines, slightly heavier on the outer silhouette and finer for wrinkles; hard-edged cel shading with one flat shadow tone per colour and small flat highlights; muted, warm, naturalistic, slightly desaturated colours; realistic adult proportions and small realistic eyes; backgrounds softer and simpler than the character. Serious, grounded, lightly humorous tone. Not chibi, not big-eyed anime, not 3D or Pixar style, not photorealistic. No text, no letters, no numbers, no labels, no logos and no watermark anywhere, including on signs, helmets, vests and clothing.
```

## Início comum dos prompts 2 a 5

Já está incluído em cada prompt. Repete as características da personagem em todas as gerações, como aconselha a OpenAI, para reduzir os desvios. A Google também pede descrições concretas para manter a consistência.

```
Image 1 and Image 2 show the same original character. Image 1 is the master for his face, glasses, beard and drawing style; Image 2 is the master for his full-body proportions and outfit. Keep exactly the same character and do not redesign him: completely bald head, thick matte black rectangular glasses, full dark-brown beard, heavyset build, plain black T-shirt, dark grey work trousers, black safety boots, black wristband on his right wrist. Change only his pose, expression and setting, and add the hard hat when the scene asks for it. Draw him only once; he is the only person in the image who looks like him. Ignore the backgrounds of the reference images, and do not copy from Image 1 its close-up selfie camera angle, the foreshortened hand close to the camera, the worried frown or the sweat drop on his cheek.
```

## 2. `recrutamento-convite` (3:4; imagens 1 e 2): publicação principal

```
Image 1 and Image 2 show the same original character. Image 1 is the master for his face, glasses, beard and drawing style; Image 2 is the master for his full-body proportions and outfit. Keep exactly the same character and do not redesign him: completely bald head, thick matte black rectangular glasses, full dark-brown beard, heavyset build, plain black T-shirt, dark grey work trousers, black safety boots, black wristband on his right wrist. Change only his pose, expression and setting, and add the hard hat when the scene asks for it. Draw him only once; he is the only person in the image who looks like him. Ignore the backgrounds of the reference images, and do not copy from Image 1 its close-up selfie camera angle, the foreshortened hand close to the camera, the worried frown or the sweat drop on his cheek. Scene: he stands on the construction site of a contemporary two-storey house in the Setúbal peninsula, Portugal, wearing a plain white hard hat with no markings, with the house, light scaffolding, stacked concrete blocks and umbrella pines in the background, all kept below the top 35% of the frame, in soft late-afternoon light. He looks at the viewer with a warm, confident smile and gestures with an open hand towards the empty upper part of the frame, as if inviting the viewer to join the team. Far in the background, below the top 35% of the frame, two small simplified workers who look clearly different from him (slimmer, no beard, no glasses, light grey work shirts), wearing hard hats and seen from behind, lay blocks and paint a wall. Vertical 3:4 frame: the top 35% is calm, plain sky with no detail; he is seen from the knees up, in the lower half, slightly left of centre; keep his head and hands away from the edges of the frame. Clean 2D digital cartoon illustration with a semi-realistic adult look, in the same drawing style as Image 1: smooth confident near-black outlines, slightly heavier on the outer silhouette and finer for wrinkles; hard-edged cel shading with one flat shadow tone per colour and small flat highlights; muted, warm, naturalistic, slightly desaturated colours; realistic adult proportions and small realistic eyes; backgrounds softer and simpler than the character, with gentle painterly gradients. Serious, grounded, lightly humorous tone. Not chibi, not big-eyed anime, not 3D or Pixar style, not photorealistic. No text, no letters, no numbers, no logos and no watermark anywhere, including on signs, helmets, vests and clothing.
```

## 3. `recrutamento-story` (9:16; imagens 1 e 2): stories e reels

```
Image 1 and Image 2 show the same original character. Image 1 is the master for his face, glasses, beard and drawing style; Image 2 is the master for his full-body proportions and outfit. Keep exactly the same character and do not redesign him: completely bald head, thick matte black rectangular glasses, full dark-brown beard, heavyset build, plain black T-shirt, dark grey work trousers, black safety boots, black wristband on his right wrist. Change only his pose, expression and setting, and add the hard hat when the scene asks for it. Draw him only once; he is the only person in the image who looks like him. Ignore the backgrounds of the reference images, and do not copy from Image 1 its close-up selfie camera angle, the foreshortened hand close to the camera, the worried frown or the sweat drop on his cheek. Scene: he stands on a house construction site in front of a low section of light metal scaffold that stays below the top 40% of the frame, wearing a plain white hard hat with no markings, smiling and pointing up at the empty sky with one hand raised beside his head, the fingertip no higher than the top of his hard hat, in soft late-afternoon light. Vertical 9:16 frame: the top 40% is calm, plain sky with no detail; his head is between 40% and 55% of the frame height and his body continues down to the bottom edge; nothing important in the outer 6% at each side. Clean 2D digital cartoon illustration with a semi-realistic adult look, in the same drawing style as Image 1: smooth confident near-black outlines, slightly heavier on the outer silhouette and finer for wrinkles; hard-edged cel shading with one flat shadow tone per colour and small flat highlights; muted, warm, naturalistic, slightly desaturated colours; realistic adult proportions and small realistic eyes; backgrounds softer and simpler than the character, with gentle painterly gradients. Serious, grounded, lightly humorous tone. Not chibi, not big-eyed anime, not 3D or Pixar style, not photorealistic. No text, no letters, no numbers, no logos and no watermark anywhere, including on signs, helmets, vests and clothing.
```

## 4. `recrutamento-<profissão>` (3:4; imagens 1 e 2): uma por profissão

Troca só a parte entre parêntesis retos. Por exemplo:
- `pedreiro`: laying concrete blocks with a trowel on a wall under construction;
- `pintor`: painting a facade with a roller from a low platform;
- `ladrilhador`: laying large floor tiles with a notched trowel and spacers;
- `carpinteiro`: fitting a wooden door frame.

```
Image 1 and Image 2 show the same original character. Image 1 is the master for his face, glasses, beard and drawing style; Image 2 is the master for his full-body proportions and outfit. Keep exactly the same character and do not redesign him: completely bald head, thick matte black rectangular glasses, full dark-brown beard, heavyset build, plain black T-shirt, dark grey work trousers, black safety boots, black wristband on his right wrist. Change only his pose, expression and setting, and add the hard hat when the scene asks for it. Draw him only once; he is the only person in the image who looks like him. Ignore the backgrounds of the reference images, and do not copy from Image 1 its close-up selfie camera angle, the foreshortened hand close to the camera, the worried frown or the sweat drop on his cheek. Scene: on a house construction site, he stands in the foreground on the left, wearing a plain white hard hat with no markings, looking at the viewer with a confident nod and pointing with an open hand towards a simplified worker behind him on the right who looks clearly different from him (slimmer, clean-shaven, no glasses, light grey work shirt), seen from behind or in profile, with no detailed face, wearing a hard hat and work clothes and [TRADE ACTION, e.g. laying concrete blocks with a trowel on a wall under construction], in soft late-afternoon light. Vertical 3:4 frame: the top 35% is calm, plain background with no detail; both figures are in the lower 65%; keep heads and hands away from the edges of the frame. Clean 2D digital cartoon illustration with a semi-realistic adult look, in the same drawing style as Image 1: smooth confident near-black outlines, slightly heavier on the outer silhouette and finer for wrinkles; hard-edged cel shading with one flat shadow tone per colour and small flat highlights; muted, warm, naturalistic, slightly desaturated colours; realistic adult proportions and small realistic eyes; backgrounds softer and simpler than the character, with gentle painterly gradients. Serious, grounded, lightly humorous tone. Not chibi, not big-eyed anime, not 3D or Pixar style, not photorealistic. No text, no letters, no numbers, no logos and no watermark anywhere, including on signs, helmets, vests and clothing.
```

## 5. Série "dúvidas sobre obras" (3:4; imagens 1 e 2): modelo para mais tarde

Troca as duas partes entre parêntesis retos:
- **a expressão**, em inglês:
  - `explaining calmly with one hand raised` (a explicar com calma);
  - `raising one eyebrow with a sceptical, doubtful look` (a desconfiar, para os mitos: "É verdade que…?");
  - `satisfied, giving a thumbs-up` (satisfeito, para as boas práticas);
- **a cena do tema**, também em inglês.

O prompt já põe o capacete. Numa cena fora da zona de trabalho, troca `wearing a plain white hard hat with no markings` por `holding a plain white hard hat with no markings in one hand`.

**Os temas vêm de perguntas reais**: as pesquisas que aparecem no Search Console e a caixa "Outras perguntas" do Google. **Cada resposta deve existir também no site**, por exemplo numa pergunta frequente, e a publicação resume-a e liga para lá. Assim, a resposta fica numa página do site, que o Google e os assistentes de IA podem encontrar e citar.

```
Image 1 and Image 2 show the same original character. Image 1 is the master for his face, glasses, beard and drawing style; Image 2 is the master for his full-body proportions and outfit. Keep exactly the same character and do not redesign him: completely bald head, thick matte black rectangular glasses, full dark-brown beard, heavyset build, plain black T-shirt, dark grey work trousers, black safety boots, black wristband on his right wrist. Change only his pose, expression and setting, and add the hard hat when the scene asks for it. Draw him only once; he is the only person in the image who looks like him. Ignore the backgrounds of the reference images, and do not copy from Image 1 its close-up selfie camera angle, the foreshortened hand close to the camera, the worried frown or the sweat drop on his cheek. Scene: he stands three-quarter to the viewer, wearing a plain white hard hat with no markings, [EXPRESSION, e.g. explaining calmly with one hand raised], next to [SCENE OF THE TOPIC, e.g. a bathroom being renovated, with new tiles half laid]. Vertical 3:4 frame: the top 35% is a calm, plain area with no detail; he and the scene occupy the lower 65%; keep his head and hands away from the edges of the frame. Clean 2D digital cartoon illustration with a semi-realistic adult look, in the same drawing style as Image 1: smooth confident near-black outlines, slightly heavier on the outer silhouette and finer for wrinkles; hard-edged cel shading with one flat shadow tone per colour and small flat highlights; muted, warm, naturalistic, slightly desaturated colours; realistic adult proportions and small realistic eyes; backgrounds softer and simpler than the character, with gentle painterly gradients. Serious, grounded, lightly humorous tone. Not chibi, not big-eyed anime, not 3D or Pixar style, not photorealistic. No text, no letters, no numbers, no logos and no watermark anywhere, including on signs, helmets, vests and clothing.
```

## Se o resultado fugir

| Problema | Acrescenta ao prompt |
|---|---|
| Aparece cabelo | `completely bald, no hair at all, not even at the sides or back` |
| A barba fica grisalha ou curta | `dense dark-brown beard, not grey, not stubble` |
| Fica mais magro | `heavyset, stocky, round full face, thick neck` |
| Os óculos mudam ou desaparecem | `thick matte black rectangular glasses in every view` |
| Fica infantil | `mature adult proportions, adult facial wrinkles, same cel-shaded cartoon style as Image 1` |
| Fica realista | `flat colour areas, visible outlines, no photographic detail` |
| Aparece texto ou um logótipo | Repete a última frase do prompt e gera outra vez |

Se o estilo continuar a fugir, experimenta o **Nano Banana Pro** com as mesmas referências. A documentação da Google parece indicar que este modelo aceita referências de estilo, mas não está confirmado.

## Depois de gerar

Guarda as imagens escolhidas em `rss/imgs/redes-sociais/` com os nomes indicados e diz-me. Eu faço:
- o recorte `personagem-corpo-inteiro.png` a partir da ficha;
- as publicações finais em 1080 × 1440, 1080 × 1350 e 1080 × 1920, com:
  - o título;
  - as profissões (m/f);
  - o logótipo;
  - o endereço `lmdreams.pt/trabalhe-connosco`;
  - a nota de IA discreta;
- o texto da publicação para o Facebook e o Instagram, com o texto alternativo;
- o registo de proveniência (modelo, prompt, referências e data).
