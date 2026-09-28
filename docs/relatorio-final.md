# Relatório final: website institucional LMDreams

## Estado

| Fase | Estado | Notas |
|---|---|---|
| Fase 0: Reconhecimento e pré-voo | concluída | Créditos aprovados (teto de 65); conta GitHub gratuita, o Andre torna o repositório público no fim; logótipo atual sem versão melhor. |
| Fase 1: Direção visual | concluída | Direção C (Planta e Latão) escolhida pelo Andre; 7 boards gerados (14 créditos); `design/direcao-visual.md`. |
| Fase 2: Fundações e conteúdos | concluída | Build, pré-renderização, SEO, scripts de verificação e CI a funcionar; textos escritos, revistos (25 achados, 15 aplicados, 2 refutados) e corrigidos. |
| Fase 3: Imagens | concluída (11 de 11 imagens) | Hero gerado e otimizado (com recorte 4:5 para telemóvel), favicons e imagem OG a 25 de setembro. A pedido do Andre, mais 5 imagens a 26 de setembro (Sobre, três serviços e CTA), 3 a 27 de setembro (construção civil, pavimentos e Transparência) e 2 a 28 de setembro (Diferenciação e casa de banho, escolhidas entre dois candidatos cada, depois de as versões de 27 terem sido rejeitadas no controlo de qualidade). O plano da conta Higgsfield, em período de tolerância, só permite 5 gerações por dia. |
| Fase 4: Secções e páginas | concluída | 8 pacotes entregues; integração com ilhas de hidratação e testes E2E. |
| Fase 5: Integração e revisão editorial | concluída | Revisão editorial sobre o HTML gerado, matriz de rastreabilidade preenchida, desempenho em telemóvel (LCP de 3,1 s para cerca de 2 s), `build:root` a passar. |
| Fase 6: Verificação adversarial | concluída | 3 rondas (87 achados; 22 confirmados de severidade média ou superior, todos corrigidos ou documentados). |
| Fase 7: Documentação | concluída | README, `CONTEUDO-A-SUBSTITUIR.md`, matriz fechada, este relatório e `CLAUDE.md`; comandos locais do README testados tal como estão escritos. |
| Fase 8: Entrega | concluída | `npm run check`, `npm run build:pages` e `npm run lighthouse` a verde; branch enviado; [PR n.º 1](https://github.com/WakenAc/LMDreams/pull/1) aberta para `main` (não rascunho), com o `ci.yml` a verde; integrada pelo Andre a 26 de setembro. Imagens de 26 e 27 de setembro numa PR nova. Site retirado do ar a 27 de setembro, com autorização do Andre (secção "Entrega"). |

Última atualização: 25 de setembro de 2026.

## Respostas do Andre na Fase 0

- **Créditos da Higgsfield:** plano aprovado (19 imagens: 7 boards com `nano_banana_pro` a 2 créditos e 12 fotografias com `gpt_image_2_5` high 2k a 2,75 créditos; estimativa de 61,1 créditos com 30% de margem; **teto de 65 créditos**).
- **GitHub Pages:** conta gratuita; o Andre torna o repositório público antes do merge (Parte 0.6, passo 6). O Claude Code não muda a visibilidade.
- **Logótipo:** não há versão melhor; segue-se com o ficheiro atual, assinalado como de baixa resolução.
- **Direção visual (Fase 1):** C · Planta e Latão (recomendação do painel).

## Resultados do pré-voo (Fase 0)

### Repositório

- `WakenAc/LMDreams`: privado, permissão `ADMIN`, **sem commits** no início da execução.
- Aplicada a exceção da Parte 2.2 (repositório vazio): commit inicial em `main` só com `.gitignore` e `README.md` mínimo (`ab0ce0d`), enviado com `git push -u origin main`. Branch por omissão: `main`.
- Branch de trabalho `feat/site-institucional` criado a partir de `main`, com o brief, o logótipo e um `.gitattributes` (fins de linha LF, para o CI em Linux).
- Ficheiros encontrados na raiz: `BRIEF-LMDREAMS.md`, `logo-lmdreams.png` e `images.jpg`. O `images.jpg` é uma cópia em JPEG do mesmo logótipo (352×188 px); não foi adicionado ao Git nem apagado (fica fora do repositório, sem uso).

### Ferramentas

| Ferramenta | Versão | Estado |
|---|---|---|
| Node.js | 24.18.0 | OK (≥ 22.19) |
| npm | 11.16.0 | OK |
| Git | 2.55.0.windows.2 | OK |
| GitHub CLI | 2.101.0 | OK, sessão iniciada como `WakenAc` (âmbitos `repo`, `workflow`, `gist`, `read:org`; sem `read:user`) |
| Sistema operativo | Windows 11 | Todos os scripts do projeto são Node/TypeScript (nunca bash). |

### GitHub Pages

- `gh api repos/WakenAc/LMDreams/pages` → 404 (Pages ainda não ativo).
- `gh api user --jq .plan.name` → vazio (o token não tem o âmbito `read:user`). O Andre confirmou que a conta é gratuita.
- Repositório privado num plano gratuito: o GitHub Pages não está disponível enquanto o repositório for privado. **Não foi ativado** na Fase 8; fica para depois de o Andre tornar o repositório público (README, secção 6).

### Logótipo

- `logo-lmdreams.png`: PNG RGBA de 352×188 px, **sem transparência** (fundo sólido carvão `#292929`, medido nas margens), grafismo de uma só cor amarelo-lima `#D1CF20` (casa com chaminé e janela), sem texto.
- A parte gráfica ocupa cerca de 241×129 px: abaixo dos 1000 px de largura e dos 512 px de lado pedidos na Parte 4.9. Utilizável mas com pouca qualidade: ponto de paragem 4 (não bloqueia; segue-se com o ficheiro existente).

### Higgsfield

- Ferramentas disponíveis na sessão. Saldo inicial: **255,5 créditos** (plano `starter`). Sem gerações gratuitas de teste (`unlim.available: false`).
- Modelos confirmados com `models_explore` na Fase 0: `gpt_image_2_5` (qualidade `low` por omissão; `high` e `2k` definidos explicitamente; papel de referência `image_references`) e `nano_banana_pro` (2k por omissão; papel `image_references`). Ambos aceitavam 16:9, 4:5, 3:2, 4:3 e 21:9.
- Custos estimados com `get_cost: true` (sem gastar créditos): `gpt_image_2_5` high 2k = 2,75 créditos por imagem; `nano_banana_pro` 2k = 2 créditos por imagem.

### Permissões

- `.claude/settings.local.json` criado (ignorado pelo Git) com as listas `allow` e `deny` da Parte 2.2, usando o prefixo real das ferramentas da Higgsfield (`mcp__520133ef-7fea-484c-bef3-fbdb543fc4ad__…`). A lista `deny` inclui também as restantes ferramentas de vídeo, áudio e 3D da Higgsfield (Parte 4.1).

### Versões instaladas (Parte 3.1)

| Pacote | Versão | Pacote | Versão |
|---|---|---|---|
| `react`, `react-dom` | 19.3.0 | `vite` | 8.3.1 |
| `@vitejs/plugin-react` | 6.1.1 | `typescript` | 6.0.3 |
| `tailwindcss`, `@tailwindcss/vite` | 4.3.3 | `vite-imagetools` | 12.0.1 |
| `sharp` | 0.35.4 | `lucide-react` | 1.48.0 |
| `@fontsource-variable/schibsted-grotesk` | 5.3.0 | `@fontsource-variable/ibm-plex-sans` | 5.3.0 |
| `@fontsource/ibm-plex-mono` | 5.3.0 | `oxlint` | 1.85.0 |
| `prettier` | 3.9.9 | `tsx` | 4.23.15 |
| `cross-env` | 10.1.0 | `node-html-parser` | 7.1.0 |
| `@playwright/test` | 1.63.0 | `@axe-core/playwright` | 4.13.0 |
| `lighthouse` | 12.6.1 | `@lhci/cli` | 0.15.1 |
| `@types/node` | 24.13.6 | `@types/react`, `@types/react-dom` | 19.3.0 |

## Resumo

Website institucional estático da LMDreams (React 19, Vite 8, TypeScript 6 e Tailwind CSS v4), em português de Portugal, pré-renderizado e pronto para o GitHub Pages em `https://wakenac.github.io/LMDreams/`. Tem a página principal com as 12 secções do Anexo A, as três páginas legais e a página 404. O HTML de cada página é completo sem JavaScript; só as partes interativas (cabeçalho e menu, barra de contacto móvel, projetos e formulário) são hidratadas no cliente, e o seu JavaScript só é pedido depois de a página carregar. A direção visual é a C, "Planta e Latão", escolhida pelo Andre.

Todos os gates da Parte 6.1 passam: `npm run check` inteiro (97 testes E2E, 96 a passar e 1 saltado enquanto não houver fotografias de projetos), axe sem violações graves (também antes da hidratação) e Lighthouse dentro dos limites nas oito recolhas (página principal em telemóvel: desempenho 98, LCP de 2,26 s).

Os dados da empresa que faltam estão marcados com `[A CONFIRMAR: …]` e listados em `CONTEUDO-A-SUBSTITUIR.md`: 90 pendentes, dos quais 18 (em 13 chaves) bloqueiam a publicação de propósito, porque são dados legais obrigatórios. As onze fotografias ilustrativas previstas existem, todas com a legenda "Imagem ilustrativa gerada por IA" e com proveniência no `manifest.json`; nenhuma está nos projetos nem nos testemunhos. Foram gastos 55,25 dos 65 créditos aprovados.

## O que foi feito por fase

- **Fase 0 (pré-voo):** permissões em `.claude/settings.local.json`; repositório vazio, com o commit inicial autorizado em `main`; branch `feat/site-institucional`; ferramentas verificadas; GitHub Pages por ativar (repositório privado, conta gratuita); logótipo analisado (352 × 188 px, sem transparência); plano de créditos aprovado (teto de 65).
- **Fase 1 (direção visual):** três propostas (A, B e C) com tokens, contrastes calculados e maquetas HTML; três boards do hero e quatro boards de secção na Higgsfield; painel de três juízes (C venceu com 24 pontos contra 20,5 e 19,5); `design/direcao-visual.md` com as ideias enxertadas das outras direções.
- **Fase 2 (fundações e conteúdos):** esqueleto do Vite, TypeScript estrito, oxlint, Prettier, Tailwind v4 com os tokens, fontes autoalojadas com fontes de recurso medidas, pré-renderização das cinco páginas, SEO e JSON-LD, registo de placeholders e `PH()`, primitivas de interface, scripts de verificação, GitHub Actions, `CLAUDE.md`, favicons e imagem OG; textos de `src/content/` escritos por um redator, revistos por dois revisores (25 achados: 15 aplicados, 2 refutados) e corrigidos.
- **Fase 3 (imagens):** hero gerado com `gpt_image_2_5` (high, 2k), aprovado no controlo de qualidade, com recorte 4:5 para telemóvel e imagem OG composta localmente. A partir daí a Higgsfield recusou todas as gerações ("daily generation limit for your grace period"), sem custo; mais tarde, os modelos previstos (`gpt_image_2_5` e `nano_banana_pro`) deixaram de aparecer no catálogo. As outras dez imagens ficaram em plano B nesse dia. A 26 de setembro, com o `gpt_image_2_5` de volta ao catálogo e a pedido do Andre, foi gerada a imagem de teste (`sobre`, com o hero como referência de estilo) e submetido o lote: 4 passaram e 5 foram recusadas pelo mesmo limite (5 gerações por dia). As 5 imagens novas passaram no controlo de qualidade. A 27 de setembro foram geradas as 5 recusadas na véspera: 3 passaram (construção civil, pavimentos e Transparência) e 2 foram rejeitadas (Diferenciação e casa de banho). A 28 de setembro, com os prompts corrigidos, foram gerados dois candidatos de cada uma das duas e escolhido o melhor. Ver a secção "Imagens geradas".
- **Fase 4 (secções e páginas):** oito pacotes em paralelo (layout, hero e CTA, sobre e transparência, diferenciação e método, serviços, projetos, testemunhos e contactos, páginas legais e 404). Integração pelo orquestrador: ilhas de hidratação, correção do menu móvel (fechava no próprio clique) e testes E2E.
- **Fase 5 (integração e revisão editorial):** editor sobre o texto do HTML gerado (cinco alterações), matriz de rastreabilidade preenchida, entrada suave que nunca esconde conteúdo numa captura, desempenho em telemóvel (LCP de 3,1 s para cerca de 2 s), palavras-chave do Anexo A em falta, `build:root` a passar.
- **Fase 6 (verificação adversarial):** três rondas, cada uma com cinco lentes, dois céticos e dois agentes de correção (secção "Rondas de verificação").
- **Fase 7 (documentação):** `README.md` com as dez secções da Parte 2.9, `CONTEUDO-A-SUBSTITUIR.md` gerado, matriz de rastreabilidade fechada, `design/direcao-visual.md` com os ajustes da ronda 3, este relatório e `CLAUDE.md`. Comandos locais do README corridos tal como estão escritos (secção "Comandos locais do README").
- **Fase 8 (entrega):** `npm run check`, `npm run build:pages` e `npm run lighthouse` com os resultados abaixo; envio do branch e PR para `main` (secção "Entrega").

### Entrega (Fase 8)

- Branch `feat/site-institucional` enviado com `git push -u origin feat/site-institucional`, depois de verificar que nenhum ficheiro seguido pelo Git tem segredos (tokens, chaves ou o ficheiro de permissões local).
- [PR n.º 1, "Site institucional LMDreams"](https://github.com/WakenAc/LMDreams/pull/1), de `feat/site-institucional` para `main`, com a descrição da Parte 6.6. Abre como PR normal (secção "Pendentes").
- CI: o `ci.yml` passou nas duas execuções da PR (25 de setembro), à primeira, sem precisar de regenerar o `package-lock.json`.
- GitHub Pages: não ativado na Fase 8, porque o repositório era privado num plano gratuito (Parte 3.15). O Claude Code não mudou a visibilidade nem fez o merge.

#### Depois da entrega (26 e 27 de setembro)

- **26 de setembro, 21:37 UTC:** o Andre tornou o repositório público e fez o merge da PR n.º 1 (commit 3ff15c9 em `main`). O `deploy.yml` arrancou logo e falhou no passo "Configure GitHub Pages" ("Get Pages site failed… Not Found"), porque o Pages ainda não estava ativo; não chegou ao `check:placeholders --strict`.
- **26 de setembro, 21:38 UTC:** o Pages foi ativado primeiro com a origem "Deploy from a branch" (`main`, raiz). Isso correu a publicação clássica do GitHub (`pages-build-deployment`), que publicou os ficheiros-fonte do repositório sem build: a página principal ficou em branco (o `index.html` de desenvolvimento, com `/src/entry-client.tsx`) e os documentos internos ficaram acessíveis no endereço do site (por exemplo `BRIEF-LMDREAMS.html`, `CONTEUDO-A-SUBSTITUIR.html` e `docs/relatorio-final.html`, todos com resposta 200). Esta via contorna o bloqueio por dados legais. Mais tarde, a origem passou a "GitHub Actions", mas a publicação clássica continuou no ar.
- **27 de setembro:** o Claude Code detetou a situação ao atualizar a documentação, confirmou-a no GitHub e perguntou ao Andre o que fazer. Com a autorização dele, apagou a publicação do Pages (`gh api -X DELETE repos/WakenAc/LMDreams/pages`): o repositório, o código e os ramos ficaram intactos, e o endereço do site e os documentos passaram a responder 404. O `README.md` (secção 6) tem agora um aviso para nunca escolher "Deploy from a branch".
- As imagens de 26 e 27 de setembro vão numa PR nova, do ramo `feat/imagens-ilustrativas` para `main`. O merge continua a ser do Andre.
- Saldo da Higgsfield confirmado com `balance`: 238,75 créditos no fim da entrega de 25 de setembro; 225 depois das imagens de 26 de setembro, 211,25 depois das de 27 e 200,25 depois das de 28 de setembro (secção "Imagens geradas").

### Rondas de verificação (Fase 6)

| Ronda | Achados | Confirmados (média ou superior) | Refutados | Baixos | Principais correções |
|---|---|---|---|---|---|
| 1 | 38 | 11 | 4 | 23 | 24 correções (commit `5446cae` e seguintes): transparência explícita no Sobre, galeria antes e depois sem JavaScript, entrada suave que nunca esconde conteúdo, foco nunca tapado pela barra móvel (WCAG 2.4.11), obrigatoriedade da caixa da Política em texto visível, AVIF e `srcset` do hero, largura do texto corrido, placeholders de imagem, matriz atualizada. |
| 2 | 26 | 5 | 1 | 20 | Experiência atribuída aos profissionais no Sobre; modo compacto do cabeçalho para a WCAG 1.4.12; números do Método com a hierarquia do board; R-8 documentado. |
| 3 | 23 | 6 | 0 | 17 | "Ligar" só entre 768 e 1279 px também no modo compacto; texto do formulário preservado na hidratação; Diferenciação entre 1024 e 1180 px; proveniência do build no Lighthouse e nas capturas; `company.ts` fora do JS das ilhas; evidência da matriz fora de `.revisao/`. |

Ficam dois achados confirmados que não se corrigem só com código: as imagens em plano B (resolvido a 28 de setembro: as 11 existem) e a regra de commits pequenos (R-8), parcial por causa dos commits por fase até à ronda 1, que só se corrigiam reescrevendo o histórico (proibido pela mesma regra). O segundo está na secção "Pendentes".

## Decisões e desvios ao brief

| Decisão | Motivo |
|---|---|
| Commit inicial em `main` com `.gitignore` e `README.md` | Repositório vazio; exceção prevista na Parte 1.4, regra 8, e na Parte 2.2. |
| `.gitattributes` com `eol=lf` | Evitar diferenças de fins de linha entre o Windows e o CI em Linux. |
| Latão `#80632B` (Parte 5.1) em vez do `#7A6226` da proposta C | O `#7A6226` lia-se como azeitona ao lado do amarelo-lima do logótipo (dois juízes); o valor do brief tem contrastes já verificados. |
| Token `dark` = `#292929` | É o fundo exato do logótipo (medido nas margens, sem desvio): a placa funde-se nas faixas escuras. |
| Boards comprimidos (PNG com paleta, 1920 ou 1440 px de largura) | Os originais tinham 5 a 7 MB cada; os originais ficam fora do Git. |
| Ronda 2 de boards em 16:9 e 3:4 | Serviços e Contactos precisam de altura para mostrar a secção inteira; o custo é o mesmo. |
| Dependências instaladas durante a espera da Fase 1 | O `package.json` foi criado na raiz antes da Fase 2 (o brief só o proíbe no plano B das maquetas, que não foi usado). Nada mudou no resultado. |
| Fotografia do hero na proporção do ficheiro (≈ 16:9) a partir de 768 px, em vez de 4:3 | Para o hero caber a 1280 × 720 e as anotações não derivarem com o recorte (registado em `design/direcao-visual.md`). |
| Recorte 4:5 do hero em telemóvel centrado no teto e na parede de pedra, sem a cota dupla | Mostra duas especialidades anotadas em vez de uma e evita duas cotas seguidas num ecrã estreito. |
| Largura do texto corrido `max-w-texto` (30em) em vez de `max-width: 36em` | O `max-w-prose` do Tailwind (65ch) dá mais de 65 caracteres em IBM Plex Sans; 30em corresponde a 65 caracteres reais. |
| Números do Método de 28 a 52 px (eram 16 px) | Achado da ronda 2: com 16 px perdiam a hierarquia do board. |
| Cabeçalho com modo compacto (WCAG 1.4.12) | Com o espaçamento de texto aumentado, a navegação passa para o menu e, se preciso, o nome fica só acessível; "Ligar" continua só entre 768 e 1279 px, o número a partir de 1280 px, e "Pedir orçamento" nunca se esconde. |
| "Pedir orçamento" do cabeçalho em estilo secundário abaixo de 768 px | Para não competir com o botão primário da barra de contacto móvel logo abaixo. |
| Barra de contacto móvel escondida em ecrãs com altura até 480 px (abaixo de 768 px de largura) | Telemóvel na horizontal ou zoom a 200%: a barra ocuparia metade do ecrã. "Pedir orçamento" continua no cabeçalho e o telefone e o WhatsApp no menu (teste «ecrã baixo (740×360)»). |
| Ilhas de hidratação (só cabeçalho, barra móvel, projetos e formulário) | O JavaScript inicial com a página inteira hidratada chegava a 106 KB gzip, acima do limite de 100 KB; com as ilhas fica em 96,2 KiB e o texto das secções estáticas não entra no JavaScript. |
| JavaScript das ilhas pedido depois do `load`, quando o navegador fica livre | O HTML é completo e utilizável sem JavaScript; assim a imagem do hero e as fontes não disputam a rede nem o processador (LCP em telemóvel de 3,1 s para cerca de 2 s). O `check:budget` e o `check:links` continuam a contar e a verificar esse JavaScript. |
| Páginas completas renderizadas no cliente só em `npm run dev` (`src/dev-render.tsx`); `build.ssrEmitAssets` com cópia das imagens do build SSR para `dist/assets` | O JavaScript de produção não leva as páginas inteiras; as imagens das secções estáticas só são importadas no servidor e têm de ser copiadas para a pasta publicada. |
| `showIllustrativeImagesNotice` retirado de `src/content/company.ts`; a nota de IA do rodapé é calculada em `Footer.tsx` com `hasIllustrativeImages()` | Desvio à Parte 3.3. O `company.ts` é importado pelas ilhas e puxava o registo de imagens inteiro para o JavaScript (achado da ronda 3); um valor calculado também não pode ficar dessincronizado do registo. |
| Texto escrito no formulário antes da hidratação preservado | Achado da ronda 3: o JavaScript chega depois do `load` e a hidratação apagava o que o visitante já tinha escrito. |
| Sem `text-wrap: pretty` nos parágrafos (só no subtítulo do hero abaixo de 380 px) | Custo de disposição alto em telemóvel (Lighthouse). |
| Entrada suave só depois do primeiro scroll, e desarmada com a página parada | O conteúdo nunca fica escondido numa captura de página inteira nem à espera de JavaScript (Parte 5.3). |
| `npm run lighthouse` com a API do Lighthouse e o Chromium do Playwright (`scripts/lighthouse.ts`) | No Windows, o `chrome-launcher` do LHCI falha a apagar a pasta temporária (EPERM) e não guarda resultados. O `lighthouserc.cjs` fica como alternativa em Linux e macOS. |
| Proveniência do build no Lighthouse, nas capturas e nas medições | Achado da ronda 3: cada artefacto regista o build que mediu, e o Lighthouse falha se o `dist/` mudar durante a recolha. |
| axe antes da hidratação com o JavaScript do site bloqueado na rede (em vez de desligado) | O axe precisa de JavaScript na página; o HTML analisado é o mesmo que um visitante vê sem JavaScript. |
| Projeto `mobile` do Playwright só com o `smoke`; as larguras de telemóvel dos outros testes correm no projeto `desktop` com `setViewportSize` | Evita correr duas vezes os mesmos testes; as larguras de 360 e 390 px continuam cobertas (a11y, responsive, nojs). |
| Evidência da matriz em testes, comandos, HTML gerado e `docs/capturas/` | `.revisao/` é ignorada pelo Git (Parte 2.8): fica como artefacto local, regenerável com `npx tsx scripts/revisao.ts --ronda <n>`. |
| Qualidade por formato no hero (AVIF 50, WebP e JPEG 64) | Com a mesma qualidade, o AVIF saía mais pesado do que o WebP; assim fica abaixo, com o mesmo detalhe, e o JPEG de recurso fica dentro do dobro do AVIF (Parte 4.8). |
| Um só candidato do hero (em vez de dois) | O segundo pedido foi recusado pelo limite diário da Higgsfield; o primeiro passou no controlo de qualidade da Parte 4.7. |
| Diferenciação e casa de banho geradas de novo, com dois candidatos cada | As versões de 27 de setembro foram rejeitadas no controlo de qualidade, com os céticos a confirmar: pseudoletras em relevo no cabo da chave de tubos (parece marca de fabricante) e ferramentas vermelhas e amarelas fora da paleta; um espaçador em cruz a meio de uma junta contínua. Não foram retocadas: a 28 de setembro geraram-se dois candidatos de cada, com os prompts corrigidos pelos céticos, para aumentar a probabilidade de passar num só dia (o plano da conta Higgsfield, em período de tolerância, só permite 5 gerações por dia; as recusas não custam créditos). |
| Diferenciação: filtro de mediana de 3 px no original e variantes até 1600 px com AVIF a 48 | A textura do betão tinha um ponteado artificial de alta frequência (medido pela lente de estilo como cerca de 8 vezes o grão das outras imagens) e o AVIF a 2048 px ficava em cerca de 270 KiB, acima dos 120 KiB da Parte 4.8. A mediana tira o ponteado sem mexer nas ferramentas (comparação a 100%); 1600 px é mais do dobro dos 732 px em que a imagem aparece em computador. |
| Acerto de cor local em duas imagens (cozinha: saturação a 92%; fachada: luminosidade a 90% e saturação a 95%) | A lente de estilo do controlo de qualidade mediu-as como as mais saturada e mais clara da série; o acerto aproxima-as do hero sem nova geração. Registado em `manifest.json` (`tratamento_local`). |
| Fachada da recuperação aceite apesar da rejeição da lente de estilo | A lente achou-a pouco portuguesa (portadas exteriores, candeeiro); o cético refutou com evidência (portadas pedidas no prompt do brief, cunhal, soco de cantaria, telha de canudo e calçada; os pormenores estrangeiros quase desaparecem a 408 px). Candidata a refazer quando houver gerações livres. |
| AVIF a 56 nos cartões de serviço e na Transparência (50 no hero, no Sobre e no CTA; 48 na Diferenciação) | A 50, o AVIF destas imagens comprimia tanto que o JPEG de recurso passava do dobro do AVIF (Parte 4.8). |
| Textos alternativos do Sobre, da cozinha e da fachada ajustados ao que as imagens mostram | O controlo de qualidade confirmou que as amostras do Sobre são pedra (não betão), que a cozinha mostra a verificação com um nível e que a fachada tem andaime. |
| Favicons: recorte do grafismo do próprio logótipo, completado em quadrado com a cor de fundo do logótipo (`#292929`) | O ficheiro não é quadrado nem vetorial; sem redesenho. **A aprovar pelo Andre** (Parte 4.9). |
| Linha do título do IMPIC também na secção Sobre, com placeholders | A Parte 5.6 prevê-a "se fizer sentido"; mostra três `[A CONFIRMAR]` até haver dados. |
| Galeria antes e depois também em `<details>` sem JavaScript | O diálogo só existe no cliente; assim o requisito A7-15 funciona sem JavaScript quando houver fotografias. |
| Nome do campo-armadilha `campo_k7x` (e não o exemplo `empresa_url_x`) | O preenchimento automático reconhece "empresa" e podia preencher o campo, descartando um pedido real. |
| Intervalos do "Orçamento previsto" propostos (até 10 000 €, …, mais de 250 000 €, "Prefiro não indicar"), com `confirmado: false` | O brief pede intervalos em `contact.ts` para a empresa rever (chave `intervalos-orcamento`). |
| Marca `html[data-hydrated]` depois da hidratação | Para os testes E2E esperarem pela interatividade (o JavaScript chega depois do `load`). |
| README escrito em paralelo com a ronda 1 da Fase 6 | Não depende dos ficheiros que a ronda pode corrigir; foi revisto e testado no fim. |
| Textos do Anexo A mantidos à letra quando o brief os fixa (texto do CTA, linha de confiança do hero) | Dois revisores propuseram mudanças; foram refutadas porque a Parte 5.4 manda usar esses textos. Mudá-los é decisão do Andre. |
| Commits por fase até à ronda 1 da Fase 6; por correção a partir da ronda 2 | Os primeiros commits juntam fases inteiras (R-8 parcial); não foram divididos porque isso reescreveria o histórico, o que a mesma regra proíbe. |
| PR normal, não rascunho | Os pendentes que restam dependem do Andre (dados legais, testemunhos, fotografias, conta Higgsfield) ou só se corrigiam reescrevendo o histórico (Parte 2.8, ponto 5). |

## Resultados dos gates

Medidos na Fase 8, a 25 de setembro de 2026, sobre o build final (`npm ci` seguido de `npm run check`, e `npm run build:pages` seguido de `npm run lighthouse`), e medidos de novo a 26, 27 e 28 de setembro depois de integradas as imagens novas, com os mesmos resultados salvo onde a tabela indica.

| Gate | Comando | Resultado |
|---|---|---|
| Tipos | `npm run typecheck` | 0 erros |
| Lint | `npm run lint` | 0 erros, 0 avisos |
| Build (GitHub Pages) | `npm run build:pages` | OK; `dist/` com as cinco páginas, `sitemap.xml`, `robots.txt`, `og-image.jpg`, favicons e `site.webmanifest` |
| Build (domínio próprio) | `npm run build:root` | OK; 0 ligações ou assets partidos em `.tmp/dist-root` com base `/` |
| Ligações e assets | `npm run check:links` | 0 partidos (base `/LMDreams/`, `SITE_URL` `https://wakenac.github.io/LMDreams`) |
| Contraste | `npm run check:contrast` | Todos os pares usados passam (texto ≥ 4,5:1; texto grande e componentes ≥ 3:1) |
| Placeholders | `npm run check:placeholders` | 90 pendentes em 22 chaves; 18 bloqueiam a publicação, em 13 chaves; 0 erros de estrutura |
| SEO e HTML pré-renderizado | `npm run check:seo` | OK nas cinco páginas |
| Proibições e conformidade | `npm run check:forbidden` | 0 ocorrências |
| Antes e depois | `npm run check:before-after` | Comparador e galeria estática renderizados com fotografias de teste |
| Peso | `npm run check:budget` | JavaScript inicial 96,2 KiB gzip de 100 KiB (98 510 B de 102 400 B; aviso a partir de 95%); CSS 12,8 KiB de 30 KiB; as 11 imagens dentro dos objetivos da Parte 4.8 na variante que o navegador escolhe (maior AVIF: Diferenciação, 103,8 KiB a 1600 px); total aproximado do primeiro carregamento em telemóvel 274,8 KiB |
| Testes E2E e acessibilidade | `npm run test:e2e` | 97 testes: 96 passam, 1 saltado (fotografias antes e depois sem JavaScript, enquanto não houver fotografias de projetos) |
| axe | `tests/e2e/a11y.spec.ts`, `smoke.spec.ts`, `nojs.spec.ts`, `projects.spec.ts` | 0 violações "serious" ou "critical" nas cinco páginas a 390, 768 e 1440 px, depois e antes da hidratação, e com o diálogo de projeto aberto |
| Pedidos externos e consola | `tests/e2e/smoke.spec.ts` | 0 pedidos a outros domínios; 0 erros e 0 avisos de hidratação (o 404 da própria página 404 é o estado esperado) |

### Lighthouse (`npm run lighthouse`)

| Perfil | Página | Desempenho | Acessibilidade | Boas práticas | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|---|
| Telemóvel | Principal | 98 | 100 | 100 | 100 | 2256 ms | 0,000 | 0 ms |
| Telemóvel | Política de privacidade | 100 | 100 | 100 | 100 | 1584 ms | 0,000 | 0 ms |
| Telemóvel | Política de cookies | 100 | 100 | 100 | 100 | 1581 ms | 0,000 | 0 ms |
| Telemóvel | Termos e condições | 100 | 100 | 100 | 100 | 1581 ms | 0,000 | 0 ms |
| Computador | Principal | 100 | 100 | 100 | 100 | 467 ms | 0,000 | 0 ms |
| Computador | Política de privacidade | 100 | 100 | 100 | 100 | 487 ms | 0,000 | 0 ms |
| Computador | Política de cookies | 100 | 100 | 100 | 100 | 487 ms | 0,000 | 0 ms |
| Computador | Termos e condições | 100 | 100 | 100 | 100 | 485 ms | 0,000 | 0 ms |

As oito recolhas estão dentro dos limites da Parte 6.1 (desempenho ≥ 90 em telemóvel e ≥ 95 em computador; acessibilidade 100; boas práticas ≥ 95; SEO 100; CLS ≤ 0,05; LCP < 2,5 s em telemóvel). Valores medidos a 28 de setembro, com as 11 imagens integradas. O LCP da página principal em telemóvel foi subindo com as imagens: 1956 ms só com o hero, 2104 ms com 6 imagens (26 de setembro), 2106 ms com 9 (27) e 2256 ms com 11 (28). Na simulação de rede lenta, as imagens com `loading="lazy"` perto do topo começam a descarregar cedo e dividem a banda com o hero. Continua dentro do limite (2,5 s), mas a folga é de cerca de 240 ms: qualquer imagem nova perto do topo deve ser medida com `npm run lighthouse`. No CI, o passo do Lighthouse fica como aviso (`continue-on-error`, Parte 3.13).

### Comandos locais do README

Corridos na Fase 7 tal como estão escritos no README:

| Comando | Resultado |
|---|---|
| `npm ci` | Saída 0 (só o aviso do npm 11 sobre os scripts de instalação do esbuild, sem efeito) |
| `npm run build:pages` | Saída 0 |
| `npm run preview` | Responde 200 em `http://localhost:4173/LMDreams/` |
| `npm run dev` | Responde 200 em `http://localhost:5173/LMDreams/`; a página principal e a Política de privacidade renderizam com o H1 e o título certos, hidratadas e sem erros na consola; parado a seguir |
| `npm run check` | Saída 0 (todos os gates acima) |

## Imagens geradas

Saldo da Higgsfield: **255,5 créditos antes** e **200,25 depois** (55,25 gastos, dentro do teto de 65; confirmado com `balance`). Sobram 9,75 créditos no teto aprovado. Registo em `assets-src/ilustrativas/manifest.json` (imagens publicadas) e `assets-src/ilustrativas/jobs.json`.

| Imagem | Modelo | Créditos | Uso |
|---|---|---|---|
| `board-hero-A-v1`, `board-hero-B-v1`, `board-hero-C-v1` | `nano_banana_pro` (2k) | 6 | Boards da Fase 1 (`design/boards/`) |
| `board-diferenciacao-C-v1`, `board-servicos-C-v1`, `board-metodo-C-v1`, `board-contactos-C-v1` | `nano_banana_pro` (2k) | 8 | Ronda 2 de boards (`design/boards/`) |
| `hero` (e o recorte 4:5 para telemóvel, feito localmente) | `gpt_image_2_5` (high, 2k) | 2,75 | Hero e imagem OG, com a legenda "Imagem ilustrativa gerada por IA" |
| `hero-v2` (segundo candidato) | `gpt_image_2_5` | 0 | Recusado pelo limite diário, sem custo |
| `sobre` (imagem de teste com o hero como referência de estilo) | `gpt_image_2_5` (flare, high, 2k) | 2,75 | Sobre nós |
| `servico-cozinhas`, `servico-recuperacao`, `servico-exteriores` | `gpt_image_2_5` (flare, high, 2k), referência de estilo do hero | 8,25 | Cartões de serviço |
| `cta` | `gpt_image_2_5` (flare, high, 2k), referência de estilo do hero | 2,75 | Fundo da chamada para ação, sob o véu |
| `diferenciacao`, `servico-construcao`, `servico-casas-de-banho`, `servico-pavimentos`, `transparencia` (26 de setembro) | `gpt_image_2_5` | 0 | Recusadas pelo limite de 5 gerações por dia, sem custo |
| `servico-construcao`, `servico-pavimentos` (27 de setembro) | `gpt_image_2_5` (flare, high, 2k), referência de estilo do hero | 5,5 | Cartões de serviço |
| `transparencia` (27 de setembro) | `gpt_image_2_5` (flare, high, 2k), referência de estilo do hero | 2,75 | Transparência |
| `diferenciacao`, `servico-casas-de-banho` (27 de setembro) | `gpt_image_2_5` (flare, high, 2k), referência de estilo do hero | 5,5 | Rejeitadas no controlo de qualidade (originais em `assets-src/ilustrativas/_rejeitadas/`, fora do Git) |
| `diferenciacao` v2 e v3 (28 de setembro) | `gpt_image_2_5` (flare, high, 2k), referência de estilo do hero, prompt corrigido | 5,5 | Escolhida a v3 (Diferenciação); a v2 era aceitável, com ferramentas menos credíveis |
| `servico-casas-de-banho` v2 e v3 (28 de setembro) | `gpt_image_2_5` (flare, high, 2k), referência de estilo do hero, prompt corrigido | 5,5 | Escolhida a v3 (cartão das casas de banho); a v2 foi rejeitada (espaçador fora do cruzamento de juntas; manga cortada pela aresta da parede) |

Controlo de qualidade de cada lote (Parte 4.7), a 26, 27 e 28 de setembro: três lentes independentes, cada uma com recortes a 100% (anatomia e física; texto, marcas, rostos e resolução; coerência de estilo com folha de contacto ao lado do hero) e um cético para as rejeições. A 26 de setembro, as 5 foram aceites. A 27 de setembro, foram aceites 3 e rejeitadas 2, com os céticos a confirmar as rejeições. A 28 de setembro, as três lentes preferiram a v3 de cada par; na casa de banho, uma lente viu uma microtextura de cerca de 10 × 12 px na tampa da torneira, e o cético refutou-a (ilegível no original e invisível nos tamanhos servidos). Nas aceites, os defeitos encontrados só se veem a 100% e desaparecem no tamanho de apresentação (andaime com um prumo incompleto, microtextura nas cantarias, estribos da armadura atados em vez de dobrados, grampo da cofragem com cor de latão). Pessoas só de costas ou só mãos e antebraços; sem texto, marcas nem rostos. A folha de contacto final (`npm run contact-sheet`, com as 11 imagens e o recorte do hero) confirma a mesma sessão fotográfica. Os prompts completos estão no `manifest.json`.

Já não há imagens em plano B. As correções de prompt que resolveram as duas rejeições (propostas pelos céticos): na Diferenciação, alicate com punhos pretos mate, chave de tubos em aço forjado escuro sem pintura e com o cabo liso, nenhuma letra, marca ou número em relevo em nenhuma ferramenta, e ampolas do nível incolores; na casa de banho, um só espaçador, assente exatamente num cruzamento de juntas, e as duas mãos a segurar o nível. O placeholder gerado em código continua no componente `Picture`, para o caso de uma imagem ser retirada.

Feitos localmente, sem Higgsfield: favicons (`scripts/favicons.ts`, a partir do logótipo), imagem OG 1200 × 630 (`scripts/og-image.ts`, cartão HTML com o recorte do hero, véu, logótipo, frase e legenda de IA) e folha de contacto (`scripts/contact-sheet.ts`).

## Conteúdos a substituir

Resumo de `CONTEUDO-A-SUBSTITUIR.md` (gerado por `npm run check:placeholders`, coerente com o Anexo B): **90 pendentes em 22 chaves**.

**Bloqueiam a publicação (18 pendentes em 13 chaves):** `forma-juridica`, `denominacao-social`, `nipc`, `sede`, `titulo-impic`, `ral`, `registo-comercial`, `responsavel-dados`, `prazo-conservacao`, `fornecedores-dados`, `data-politicas`, `capital-realizado-proprio` e `epd`. Enquanto faltarem, o `deploy.yml` falha de propósito no passo `npm run check:placeholders -- --strict`.

**Outros pendentes (72 em 9 chaves):** `validade-orcamento`, `garantia-comercial`, `icone-livro-reclamacoes`, `horario`, `redes-sociais`, `servicos` (16 serviços por confirmar), `testemunhos` (15 campos nos testemunhos provisórios), `projetos` (35 campos nos sete projetos provisórios) e `intervalos-orcamento`.

O ficheiro explica como substituir cada campo e tem ainda as secções "Dados já preenchidos que podem mudar", "Para o jurista" e "A fazer fora do código" (por exemplo, a adesão ao Livro de Reclamações Eletrónico).

## Comandos não executados de propósito

| Comando | Onde aparece | Porquê | Verificação feita |
|---|---|---|---|
| `npm run deploy` (`gh workflow run deploy.yml --ref main`) | README, secções 3, 6 e 7 | Dispara a publicação; negado na Parte 2.2 | Sintaxe confirmada com `gh help workflow run` |
| `gh workflow run` | README, secção 6 | Idem | `gh help workflow run` |
| `gh api -X PUT repos/WakenAc/LMDreams/pages -f cname=…` | README, secção 7 (domínio próprio) | Altera a configuração do GitHub Pages; pede autorização | Sintaxe confirmada com `gh help api` |
| `gh repo clone WakenAc/LMDreams` | README, secção 2 | Não é preciso (o repositório já está na máquina) | |
| Ativação do GitHub Pages (Parte 3.15) | Fase 8 | Indisponível enquanto o repositório for privado num plano gratuito; a visibilidade é decisão do Andre | `gh api repos/WakenAc/LMDreams/pages` → 404 no pré-voo |

O YAML de `.github/workflows/ci.yml` e `.github/workflows/deploy.yml` foi validado com `npx -y js-yaml <ficheiro>` (sem erros). O `gh workflow view deploy.yml` só funciona depois de o workflow chegar ao branch por omissão (`main`), no merge.

## Ficheiros existentes que foram substituídos ou removidos

- Nenhum. `git log --diff-filter=D main..feat/site-institucional` não lista ficheiros apagados. `images.jpg` (cópia em JPEG do logótipo) ficou na pasta local, fora do Git.

## Pendentes

A PR abre como PR normal: não há gates vermelhos nem achados confirmados que dependam só de código. Ficam registados:

1. **Dados da empresa** (dependem do Andre): os 18 pendentes que bloqueiam a publicação e os outros 72 (secção "Conteúdos a substituir").
2. **Folga do LCP em telemóvel:** 2256 ms para um limite de 2500 ms, depois das 11 imagens. Qualquer imagem nova perto do topo deve ser medida com `npm run lighthouse`.
3. **Regra de commits pequenos (R-8), parcial:** os commits por fase até à ronda 1 ficam como estão, porque dividi-los reescreveria o histórico.
4. **Favicons por aprovar** (Parte 4.9).
5. **Folga do JavaScript inicial:** 3 890 B em gzip. Qualquer ilha nova tem de ser medida com `npm run check:budget`.

## Próximos passos para o Andre

1. Preencher os campos "Bloqueia publicação" de `CONTEUDO-A-SUBSTITUIR.md` (sobretudo os dados legais em `src/content/company.ts`) e pedir a um jurista que valide as páginas legais; correr `npm run check:placeholders` para confirmar.
2. Aderir ao Livro de Reclamações Eletrónico e confirmar a entidade RAL.
3. Substituir os testemunhos e os projetos provisórios por reais (`placeholder: false`) e confirmar os serviços e os intervalos de orçamento (`confirmado: true`).
4. Aprovar os favicons ou fornecer um logótipo vetorial.
5. Quando houver fotografias de obras da LMDreams (com autorização dos clientes), substituir as ilustrativas e preencher os projetos (README, secção 9). Para gerar mais imagens com IA, a pesquisa de 27 de setembro recomenda a API direta da OpenAI com o mesmo modelo (sem limite diário) ou regularizar o plano da Higgsfield.
6. Com os dados legais preenchidos e o `npm run check:placeholders -- --strict` a passar, voltar a ativar o GitHub Pages com a origem **"GitHub Actions"** (Settings → Pages; nunca "Deploy from a branch"), como explica o README na secção 6. O repositório já é público.
7. Rever a PR das imagens e fazer o merge em `main`. Se o Pages já estiver ativo com a origem "GitHub Actions", a publicação corre sozinha; se for ativado depois do merge, publicar com `npm run deploy` (ou *Actions → Deploy to GitHub Pages → Run workflow*).
