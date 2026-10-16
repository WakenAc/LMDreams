# LMDreams v1: prompts para o Higgsfield

O site conta a obra como **uma única câmara que nunca desliga**. Para a transição ser fluida, as imagens têm de "encaixar" umas nas outras:

- **Fases 03, 04 e 05**: exatamente o mesmo enquadramento e a mesma luz. No site, cada fase "sobe" sobre a anterior com uma linha de laser, como se a casa crescesse no mesmo sítio. Só funciona se a câmara não mexer.
- **Fase 05 para 06**: a câmara entra pela **janela grande do rés-do-chão** e aparece a cozinha.
- **Fase 10 para 11**: a câmara sai da casa e o interior (a escada) encolhe para dentro da mesma janela, já com a casa acabada. A fase 11 usa a mesma câmara e tem a janela no mesmo sítio que a 05.
- **Fase 02 para 03**: a maquete e o terreno real fundem-se com o mesmo ângulo, como um "corte" de cinema.

Por isso a **ordem de geração importa**. Gera primeiro as imagens "mestre" e usa-as como **imagem de referência** nas seguintes.

---

## Definições recomendadas

| | |
|---|---|
| Modelo | **Nano Banana 2.1** (o melhor a manter enquadramento e geometria quando editas a partir de uma referência). Alternativas: **FLUX 3 Image** (até 10 referências) ou **GPT Image 2.5** (qualidade `high`). |
| Resolução | **`4k` obrigatório para a fase-05 e a fase-11**, porque no site a câmara aproxima-se até cerca de 6× da janela grande. Não uses upscale por IA nestas duas. As restantes podem ficar em `2k`. |
| Formato | **16:9** para as 13 imagens da obra. **4:5** para as imagens extra. |
| Lotes | Gera 2 a 4 variações de cada e escolhe a que melhor encaixa na anterior. |

**Nomes e pasta.** Guarda em `rss/imgs/` com estes nomes exatos. A extensão pode ser `.jpg`, `.png` ou `.webp`, porque o site deteta-a sozinho.

**Composição.** No computador o texto fica no terço esquerdo, e no telemóvel fica no terço de baixo. Mantém essas zonas calmas e escuras, sem detalhes importantes, e o assunto principal ao centro.

---

## Blocos que se repetem (já estão incluídos nos prompts abaixo)

**CASA:**
> a contemporary two-storey Portuguese family house: two stacked white lime-rendered volumes, the upper volume cantilevering about 2 m over a recessed ground floor clad in vertical warm oak slats, flat roofs with thin white parapets, one large floor-to-ceiling black-aluminium glazed opening about 5 m wide in the centre of the ground floor, a long horizontal ribbon window on the upper floor, light limestone plinth, on a gently sloping plot in the Setúbal peninsula, Portugal, with umbrella pines and olive trees around

**CÂMARA EXTERIOR:**
> eye-level three-quarter view from the front-left corner of the plot, 35 mm lens, camera at 1.6 m height about 22 m from the house, the house fills the central 55% of the frame, the large ground-floor glazed opening is exactly in the centre of the frame, horizon at 45% from the bottom, verticals perfectly straight

**JANELA LIVRE** (fases 05 e 11):
> nothing stands between the camera and the large ground-floor glazed opening: it is fully visible from sill to head and edge to edge, with only flat ground and the flat path in front of it; planting, walls, lights, materials and furniture are kept to the far left and far right of the frame

**SOBREPOSIÇÃO** (fases 04 e 03):
> the output must overlay the reference pixel for pixel: same 16:9 frame, no crop, no zoom, no reframing; the horizon and the trees at the left and right edges stay at exactly the same positions and sizes

**ESTILO:**
> photorealistic architectural photography, true-to-life materials, subtle film grain, restrained cinematic colour grade with deep slate-blue shadows and warm highlights, sharp focus, no text, no letters, no watermark, no logos

---

## Ordem de geração

| # | Ficheiro | Referência a usar |
|---|---|---|
| 1 | `fase-11-exterior` | nenhuma: **MESTRE EXTERIOR** |
| 2 | `fase-05-envolvente` | fase-11 |
| 3 | `fase-04-estrutura` | fase-05 (só esta) |
| 4 | `fase-03-terreno` | fase-04 (só esta) |
| 5 | `fase-02-projeto` | fase-11 |
| 6 | `fase-00-capa` | fase-11 |
| 7 | `fase-01-licenciamento` | nenhuma |
| 8 | `fase-08-sala` | nenhuma: **MESTRE INTERIOR** |
| 9 | `fase-06-cozinha` | fase-08 (só como estilo) |
| 10 | `fase-07-casa-de-banho` | fase-08 (só como estilo) |
| 11 | `fase-09-quarto` | fase-08 (só como estilo) |
| 12 | `fase-10-escadas` | fase-08 (só como estilo) |
| 13 | `fase-12-entrega` | fase-11 (só como estilo) |
| 14 a 18 | extras (secções Sobre e Serviços) | nenhuma |

---

## 1. `fase-11-exterior` (MESTRE: gera primeiro, em 4k)
Fase 11, Exteriores e jardim. É a imagem mais importante: define a casa e a câmara para todas as outras. Através da janela grande vê-se a escada, porque no site a escada da fase 10 encolhe para dentro desta janela.

```
A contemporary two-storey Portuguese family house: two stacked white lime-rendered volumes, the upper volume cantilevering about 2 m over a recessed ground floor clad in vertical warm oak slats, flat roofs with thin white parapets, one large floor-to-ceiling black-aluminium glazed opening about 5 m wide in the centre of the ground floor, a long horizontal ribbon window on the upper floor, light limestone plinth, on a gently sloping plot in the Setúbal peninsula, Portugal, with umbrella pines and olive trees around. The house is finished and landscaped: a lawn, low Mediterranean planting with lavender, rosemary and ornamental grasses, a path of large light limestone slabs leading to the entrance, low garden walls in the same white render, discreet bollard lights and warm uplights on the trees. Blue hour just after sunset, deep blue sky with a last warm glow on the horizon, all interior lights on, warm 2700K light glowing through the large glazing, revealing inside the lower flight of a floating staircase with thick solid oak treads fixed into an off-white lime-plaster wall, a frameless glass balustrade and a warm LED strip under each tread. Eye-level three-quarter view from the front-left corner of the plot, 35 mm lens, camera at 1.6 m height about 22 m from the house, the house fills the central 55% of the frame, the large ground-floor glazed opening is exactly in the centre of the frame, horizon at 45% from the bottom, verticals perfectly straight. Nothing stands between the camera and the large ground-floor glazed opening: it is fully visible from sill to head and edge to edge, with only flat lawn and the flat path in front of it; planting, garden walls, bollards and furniture are kept to the far left and far right of the frame. Crisp detail on the window frames, oak slats and soffit around the large opening. Photorealistic architectural photography, true-to-life materials, subtle film grain, restrained cinematic colour grade with deep slate-blue shadows and warm highlights, sharp focus, no people, no text, no letters, no watermark, no logos.
```

## 2. `fase-05-envolvente` (referência: fase-11, em 4k)
Fase 05, Instalações e envolvente. A luz definida aqui (céu encoberto, sem sol) repete-se nas fases 04 e 03.

```
Use the reference image. Keep exactly the same camera position, lens, framing, horizon line and the exact same house geometry, size and position in the frame. Only change the construction stage: the house is under construction with the envelope almost closed. The walls are covered with white ETICS external insulation boards, partly rendered and partly showing the boards and the fibreglass mesh; the oak cladding is not installed yet, the wall there is bare grey render; black aluminium window frames are installed with blue protective film still on the glass, including the large central ground-floor glazed opening; metal scaffolding with wooden boards along the left side of the house; no garden yet: bare compacted earth and gravel, a pallet of materials and a small skip at the far right edge of the frame; the same pines and olive trees in the background. Nothing stands between the camera and the large ground-floor glazed opening: it is fully visible from sill to head and edge to edge, with only flat bare earth in front of it. Soft overcast daylight from a uniformly pale grey-blue sky, diffuse light with no hard cast shadows, no sun, no mist, no haze, interior unlit. Crisp detail on the window frames and the soffit around the large opening. Photorealistic construction photography, true-to-life materials, subtle film grain, restrained cinematic colour grade with deep slate-blue shadows and warm highlights, no people, no text, no letters, no watermark, no logos.
```

## 3. `fase-04-estrutura` (referência: só a fase-05)
Fase 04, Estrutura e construção.

```
Use the reference image (the same house with its envelope almost closed). Keep exactly the same camera position, lens, framing, horizon line and the exact same building volume, size and position in the frame. Only change the construction stage: the house is a bare reinforced-concrete structure: grey concrete columns, ground-floor slab, first-floor slab and the cantilevered slab with timber formwork and steel props underneath it, flat roof slab finished, some red ceramic brick infill walls on the ground floor, empty openings where the windows will be (the large central ground-floor opening is an empty rectangular gap in exactly the same place), rebar sticking out of the top of a few columns, metal scaffolding around the upper floor; dry earth around the site with stacked rebar and formwork panels at the far left and far right edges; the same pines and olive trees in the background. Keep exactly the same light, sky, colour grade and background trees as the reference image: soft overcast daylight, no hard cast shadows, no sun, no mist, no haze. The output must overlay the reference pixel for pixel: same 16:9 frame, no crop, no zoom, no reframing; the horizon and the trees at the left and right edges stay at exactly the same positions and sizes. Photorealistic construction photography, subtle film grain, no people, no cranes, no text, no letters, no watermark, no logos.
```

## 4. `fase-03-terreno` (referência: só a fase-04)
Fase 03, Preparação do terreno.

```
Use the reference image. Keep exactly the same camera, framing, sky and background trees. Remove the concrete structure, brick infill, scaffolding and stacked materials completely; where they stood, the plot is cleared and levelled earth before construction. Wooden stakes with taut white string lines mark the exact footprint of the house on the ground, in the same place where the structure stands in the reference; freshly dug shallow foundation trenches along the string lines; a parked yellow compact excavator at the right edge of the frame, bucket resting on the ground, empty cab; piles of fresh earth; the same umbrella pines and olive trees in the background. Keep exactly the same light, sky, colour grade and background trees as the reference image: soft overcast daylight, no hard cast shadows, no sun, no mist, no haze. The output must overlay the reference pixel for pixel: same 16:9 frame, no crop, no zoom, no reframing; the horizon and the trees at the left and right edges stay at exactly the same positions and sizes. Photorealistic construction photography, subtle film grain, no people, no text, no letters, no watermark, no logos.
```

## 5. `fase-02-projeto` (referência: fase-11)
Fase 02, Planeamento e projeto. A maquete tem de ficar **no mesmo sítio e com o mesmo tamanho no enquadramento** que a casa da fase-11 (que é também o sítio da implantação na fase-03), porque no site a maquete funde-se com o terreno da fase-03.

```
A white architectural scale model of the exact house shown in the reference image, with the same volumes, cantilever, ribbon window and large central glazed opening, made of white card and balsa wood with a thin oak base, standing on a large light oak table in an architecture studio. The camera is very low, almost resting on the tabletop at the height of the model's ground-floor windows, from the same three-quarter angle as the reference photo, so the model is seen at eye level exactly like the real house and occupies the same position and size in the frame; the roof is not seen from above and the tabletop is seen at a grazing angle. Rolled drawings, tracing paper and small material samples of oak, limestone and white render lie flat on the table to the far left and far right, never in front of the model. Soft daylight from a large window on the left, the whole model in sharp focus, only the studio background softly blurred. Photorealistic, subtle film grain, restrained cinematic colour grade with deep slate-blue shadows and warm highlights, no people, no text, no letters, no watermark, no logos.
```

## 6. `fase-00-capa` (referência: fase-11)
Capa do site, por trás do título "O seu sonho, a nossa obra". É o sonho antes de ser obra: o desenho da casa.

```
Transform the reference image into a hand-drawn architectural perspective drawing of the same house from exactly the same angle, with the same position and size in the frame: fine white ink and white pencil lines on deep slate-blue paper, like an elegant modern blueprint. Visible construction lines and perspective guide lines extending towards the vanishing points, light hatching on the shaded facades, a few dimension lines without numbers, the trees drawn as loose sketches, the drawing slightly unfinished and fading out towards the edges of the paper, subtle paper texture. Calm, precise, poetic. No text, no letters, no numbers, no watermark, no logos.
```

## 7. `fase-01-licenciamento` (sem referência)
Fase 01, Burocracia e licenciamento. A câmara vai "mergulhar" na planta ao centro.

```
Close-up of an architect's desk seen from a high three-quarter angle. In the centre of the frame, a large topographic survey plan of a sloping plot with fine contour lines, the plot boundary drawn in red and the footprint of a house hatched in grey, with no numbers, labels or title block. On top of it, a closed grey cardboard permit folder with a completely blank cover and a round red embossed seal with only a simple geometric emblem, no lettering; a fountain pen, an architect's scale ruler and a pair of reading glasses; a cup of coffee at the edge. The hands and forearms of two people in shirt sleeves point at the plan, faces out of frame. Warm morning light from the left, shallow depth of field. Photorealistic editorial photography, subtle film grain, restrained cinematic colour grade with deep slate-blue shadows and warm highlights, no readable text, no letters, no watermark, no logos.
```

---

## Interiores

Gera primeiro a sala (fase-08). Nas outras divisões, usa a sala **só como referência de estilo** (materiais, luz e cor). Cada divisão tem a sua própria composição.

## 8. `fase-08-sala` (MESTRE INTERIOR)
Fase 08, Sala de estar. Define os materiais e a luz de todos os interiores.

```
A spacious living room in a contemporary Portuguese house: warm wide-plank oak floor, soft off-white lime-plaster walls, a long low linen sofa in warm sand colour, a round travertine coffee table on a natural wool rug, a built-in oak wall unit with open shelves and a linear fireplace, a full-height wall of black-framed floor-to-ceiling windows on the right looking onto a Mediterranean garden with olive trees, a flush ceiling with a recessed perimeter cove of warm LED light. Blue hour outside, warm 2700K interior lights on. Eye-level, 24 mm lens, gentle one-point perspective, verticals perfectly straight. Photorealistic interior architectural photography, true-to-life materials, subtle film grain, restrained cinematic colour grade with deep slate-blue shadows and warm highlights, no people, no text, no letters, no watermark, no logos.
```

## 9. `fase-06-cozinha` (referência de estilo: fase-08)
Fase 06, Acabamentos: cozinha. É a primeira imagem depois de "entrar pela janela".

```
Use the reference image only as a style reference for materials, light and colour grade. Create a new photograph of a different room with its own layout and camera position; do not reuse the reference composition, furniture, window wall or ceiling. A kitchen: a large island in honed light limestone with a waterfall edge in the foreground centre, flush oak cabinetry from floor to ceiling with integrated appliances in black glass, three slim black pendant lights above the island, a matte black tap, a few handmade ceramic pieces, a wide window to the garden at blue hour in the background, recessed warm LED cove lighting in the ceiling, warm wide-plank oak floor. Eye-level, 24 mm lens, gentle one-point perspective, verticals perfectly straight. Photorealistic interior architectural photography, subtle film grain, no people, no text, no letters, no watermark, no logos.
```

## 10. `fase-07-casa-de-banho` (referência de estilo: fase-08)
Fase 07, Acabamentos: casa de banho.

```
Use the reference image only as a style reference for materials, light and colour grade. Create a new photograph of a different room with its own layout and camera position; do not reuse the reference composition, furniture, window wall or ceiling. A bathroom: large-format light stone tiles on floor and walls with precise thin joints, a walk-in shower with a frameless glass panel and matte black fittings, a freestanding white stone bathtub next to a tall window to the garden at blue hour, a floating oak vanity with a stone countertop and a round backlit mirror, warm LED light in a recessed wall niche. Eye-level, 24 mm lens, verticals perfectly straight. Photorealistic interior architectural photography, subtle film grain, no people, no text, no letters, no watermark, no logos.
```

## 11. `fase-09-quarto` (referência de estilo: fase-08)
Fase 09, Acabamentos: quarto.

```
Use the reference image only as a style reference for materials, light and colour grade. Create a new photograph of a different room with its own layout and camera position; do not reuse the reference composition, furniture, window wall or ceiling. A bedroom: a low bed with linen bedding in sand and off-white tones, a full-width oak headboard wall with integrated warm reading lights, floor-to-ceiling built-in oak wardrobe with flush handleless doors on the left, a large window to the garden at blue hour, two bedside lamps glowing softly, a natural wool rug on the oak floor, recessed warm cove light in the ceiling. Eye-level, 24 mm lens, verticals perfectly straight. Photorealistic interior architectural photography, subtle film grain, no people, no text, no letters, no watermark, no logos.
```

## 12. `fase-10-escadas` (referência de estilo: fase-08)
Fase 10, Acabamentos: escadas. É a última imagem antes de "sair pela janela". A câmara está mesmo junto à janela grande, a olhar para dentro: é esta escada que depois se vê de fora, através da janela, na fase 11.

```
Use the reference image only as a style reference for materials, light and colour grade. Create a new photograph of a different room with its own layout and camera position; do not reuse the reference composition, furniture, window wall or ceiling. A double-height entrance hall, seen from just inside the large ground-floor front glazing, looking into the hall, with a floating cantilevered staircase: thick solid oak treads fixed into an off-white lime-plaster wall, a frameless glass balustrade, a warm LED strip under each tread, a large calm abstract artwork in earth tones on the wall, warm oak floor, warm 2700K light. Eye-level, 24 mm lens, verticals perfectly straight. Photorealistic interior architectural photography, subtle film grain, no people, no text, no letters, no watermark, no logos.
```

## 13. `fase-12-entrega` (referência de estilo: fase-11)
Fase 12, Entrega em chave na mão. Sem caras, só mãos: é mais elegante e evita rostos artificiais. As mãos ficam um pouco à direita do centro, longe do texto.

```
Use the reference image only for the materials and the blue-hour light; this is a new close-up photograph. Two hands handing over a set of house keys on a simple tan leather keyring, in front of the entrance of the house: a tall solid oak pivot door, white lime render, a warm wall light by the door, at blue hour. One hand in a navy suit sleeve gives the keys, the other hand in a light knit sleeve receives them; the hands are slightly right of centre, around 58% of the frame width, and slightly above centre. Very shallow depth of field, the house softly blurred behind with warm bokeh from the windows. Photorealistic editorial photography, subtle film grain, restrained cinematic colour grade with deep slate-blue shadows and warm highlights, no faces, no text, no letters, no watermark, no logos.
```

---

## Extras (formato 4:5)

São usadas nas secções **Sobre nós** (os quatro especialistas) e **Serviços** (recuperação). As outras imagens dos serviços reaproveitam as fases.

### 14. `especialista-eletricista`
```
Close-up of the hands of a professional electrician connecting wires into an unbranded residential electrical panel of plain white circuit breakers with blank fronts and no labels, tidy and precise cabling, dark grey work clothes, a single warm side light, dark background, shallow depth of field. Photorealistic editorial photography, subtle film grain, restrained cinematic colour grade with deep slate-blue shadows and warm highlights, no faces, no text, no letters, no watermark, no logos.
```

### 15. `especialista-canalizador`
```
Close-up of the hands of a professional plumber tightening a brass fitting on an underfloor water manifold with neatly arranged red and blue multilayer pipes, dark grey work clothes, a single warm side light, dark background, shallow depth of field. Photorealistic editorial photography, subtle film grain, restrained cinematic colour grade with deep slate-blue shadows and warm highlights, no faces, no text, no letters, no watermark, no logos.
```

### 16. `especialista-carpinteiro`
```
Close-up of the hands of a professional carpenter adjusting the concealed hinge of a solid oak wardrobe door with a screwdriver, a few fine wood shavings, a single warm side light, dark background, shallow depth of field. Photorealistic editorial photography, subtle film grain, restrained cinematic colour grade with deep slate-blue shadows and warm highlights, no faces, no text, no letters, no watermark, no logos.
```

### 17. `especialista-pintor`
```
Close-up of the hand of a professional painter rolling warm off-white paint onto a wall, finishing along a perfectly straight crisp edge against a slate-blue wall, a single warm side light, shallow depth of field. Photorealistic editorial photography, subtle film grain, restrained cinematic colour grade with deep slate-blue shadows and warm highlights, no faces, no text, no letters, no watermark, no logos.
```

### 18. `servico-recuperacao`
```
A traditional two-storey Portuguese townhouse in the Lisbon region being restored: the right half of the facade already repaired and repainted in white lime with new wooden windows and a restored limestone doorway, the left half still showing old cracked and stained render, a light metal scaffolding on the left, a narrow cobbled street. Soft morning light. Photorealistic architectural photography, subtle film grain, restrained cinematic colour grade with deep slate-blue shadows and warm highlights, no people, no text, no letters, no watermark, no logos.
```

---

## Fotografias reais dos projetos

A secção **Projetos** usa as fotografias reais que já estão no site atual. Guarda-as em `rss/imgs/projetos/` com estes nomes, em formato 4:3:

| Ficheiro | Obra |
|---|---|
| `projeto-predio-feijo` | Recuperação e remodelação de prédio de três frações (Feijó, 2019) |
| `projeto-cozinha-feijo` | Cozinha em tom de carvalho e branco (Feijó, 2019) |
| `projeto-wc-casal-de-cambra` | Casa de banho numa casa de dois pisos (Casal de Cambra, 2026) |
| `projeto-livraria-lisboa` | Livraria-café (Lisboa, 2017) |
| `projeto-piscina-fernao-ferro` | Piscina e jardim (Fernão Ferro, 2021) |
| `projeto-patio-seixal` | Pátio com pérgola (Seixal, 2016) |
| `projeto-ampliacao-fernao-ferro` | Ampliação para dois pisos (Fernão Ferro, 2021) |
| `projeto-recuperacao-casal-de-cambra` | Recuperação de casa de dois pisos (Casal de Cambra, 2026) |

---

## Quando as imagens estiverem na pasta

Diz-me e eu faço o seguinte:
1. **Meço a janela grande** nas fases 05 e 11 e afino as transições "entrar/sair pela janela" ao píxel (atributo `data-win` no `index.html`).
2. Verifico se as fases 03, 04 e 05 estão realmente alinhadas e com a mesma luz. Se alguma estiver desviada, digo-te qual repetir.
3. Converto tudo para WebP otimizado, para o site carregar depressa, mantendo a fase-05 e a fase-11 com 3840 px de largura.

### Opcional, mais à frente: vídeos de transição
Os modelos de vídeo do Higgsfield com **imagem inicial + imagem final** (FLUX 3 Video, MiniMax H3) conseguem gerar a passagem entre duas fases, por exemplo a casa a "crescer" da fase-04 para a fase-05. Depois de vermos a animação com imagens fixas, podemos decidir se vale a pena trocar algumas transições por vídeo controlado pelo scroll.
