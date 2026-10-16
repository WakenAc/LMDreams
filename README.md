# LMDreams

Site da LMDreams (www.lmdreams.pt): construção civil e remodelações em Portugal continental.
Uma página com a obra contada pelo scroll, em 12 fases, mais as páginas legais.

Site estático, sem build: HTML, CSS e JavaScript. O GSAP, o ScrollTrigger e o Lenis tratam do scroll.

## Estrutura

| Caminho | O que é |
|---|---|
| `index.html` | Página inicial: a obra (13 quadros) e as secções Sobre, Serviços, Método, Projetos e Contactos |
| `politica-de-privacidade/`, `politica-de-cookies/`, `termos-e-condicoes/` | Páginas legais |
| `404.html` | Página de erro do GitHub Pages |
| `assets/css/style.css` | Estilos |
| `assets/js/main.js` | Linha do tempo do scroll, menus, janela dos projetos |
| `assets/js/projetos.js` | Dados dos projetos reais (fotografias autorizadas e tratadas) |
| `assets/img/` | Imagens WebP: fases da obra (ilustrativas, geradas por IA) e `projetos/` (fotografias reais) |
| `scripts/publicar.cjs` | Copia só os ficheiros do site para `dist/` |
| `scripts/verificar.cjs` | Bloqueia a publicação se houver ligações partidas, recursos de terceiros ou originais em `dist/` |
| `scripts/otimizar-imagens.cjs` | Converte os PNG do Higgsfield para WebP |
| `docs/` | Registo das fotografias dos projetos, prompts das imagens e relatórios do site anterior (`docs/site-v1/`) |

## Pré-visualizar

```bash
node scripts/publicar.cjs
python -m http.server 5501 --bind 127.0.0.1 --directory dist
```

Depois abre http://127.0.0.1:5501.

## Publicar

Um push para `main` corre o workflow `Deploy to GitHub Pages`. Esse workflow:

1. corre `node scripts/publicar.cjs`;
2. corre `node scripts/verificar.cjs` e para se houver algum problema;
3. publica `dist/` em www.lmdreams.pt.

Nunca publiques a raiz do projeto. Os materiais de trabalho (`rss/`, com os PNG originais e as fotografias do WhatsApp por tratar) ficam só no computador e estão no `.gitignore`.

Sempre que acrescentares uma página ou um ficheiro na raiz, junta-o à lista `SITE` em `scripts/publicar.cjs`.

A verificação (`scripts/verificar.cjs`) bloqueia a publicação se:

- houver ligações, imagens ou âncoras partidas;
- algum recurso vier de servidores de terceiros (a Política de cookies garante que não há nenhum: os tipos de letra e as bibliotecas estão em `assets/fonts` e `assets/vendor`);
- faltar a informação legal no rodapé de alguma página;
- houver uma imagem com mais de 1,5 MB;
- aparecer algum ficheiro de `rss/`.

## Imagens

1. Os PNG do Higgsfield ficam em `rss/imgs/`, fora do Git.
2. Para os converter, corre `node scripts/otimizar-imagens.cjs rss/imgs assets/img`. O script precisa do `sharp` (`npm i --no-save sharp`).
3. Cada fase ganha versões de 1920 e de 1280 px. O site escolhe a mais leve que chega para o ecrã e carrega as fases à medida do scroll.

## Voltar ao site anterior

O site anterior (Vite/React, com o formulário Formward) é o commit `bc63c39` (merge da PR #7). Para o repor:

1. Confirma que as variáveis do repositório `VITE_FORM_ENDPOINT` e `VITE_FORM_ACCEPTS_FILES` têm os valores certos: o build antigo usa-as.
2. Faz `git revert -m 1 <commit do merge da v2>` em `main`, ou cria um ramo a partir de `bc63c39` e faz o merge.

## Por decidir com o cliente

- **Formulário de pedido de orçamento.** O site novo não tem formulário, mas a Política de privacidade (§03 a §07, §12 e §13) e os Termos (§03) ainda o descrevem. Há duas saídas: atualizar o texto, mudando a data "Última atualização", ou voltar a pôr o formulário.
- **Legenda das imagens de IA.** As imagens geradas por IA já não têm a legenda junto a cada uma; só fica a frase geral no rodapé. Os Termos (§05) ainda dizem que "estão identificadas com a legenda «Imagem ilustrativa gerada por IA»". Ou se muda essa frase (atualizando a data), ou voltam as legendas.
- **Avaliações Google.**
- **Textos do site anterior que não passaram para o novo:** a secção "Transparência em todas as fases da obra" e a frase final da chamada para contacto. Ver `docs/site-v1/`.
