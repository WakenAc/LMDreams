# LMDreams

Site da LMDreams (www.lmdreams.pt): construção civil e remodelações em Portugal continental.
Uma página com a obra contada pelo scroll, em 12 fases, mais as páginas legais.

Site estático, sem build: HTML, CSS e JavaScript. O GSAP, o ScrollTrigger e o Lenis tratam do scroll.

## Estrutura

| Caminho | O que é |
|---|---|
| `index.html` | Página inicial: a obra (13 quadros) e as secções Sobre, Serviços, Método, Projetos e Contactos (com o formulário de pedido de orçamento) |
| `trabalhe-connosco/` | Página com o formulário de candidatura (cabeçalho e rodapé copiados das páginas legais) |
| `politica-de-privacidade/`, `politica-de-cookies/`, `termos-e-condicoes/` | Páginas legais |
| `404.html` | Página de erro do GitHub Pages |
| `assets/css/style.css` | Estilos |
| `assets/js/main.js` | Linha do tempo do scroll, menus, janela dos projetos |
| `assets/js/projetos.js` | Dados dos projetos reais (fotografias autorizadas e tratadas) |
| `assets/js/formularios.js` | Validação e envio dos dois formulários para o Google Apps Script (`const ENDPOINT`) |
| `assets/img/` | Imagens WebP: fases da obra (ilustrativas, geradas por IA) e `projetos/` (fotografias reais) |
| `obras/` | Uma página por obra e a lista `/obras/`, geradas a partir de `assets/js/projetos.js` |
| `scripts/gerar-obras.cjs` | Gera `obras/` (correr sempre que `projetos.js`, o rodapé ou o CSS mudarem; o CI confirma) |
| `scripts/publicar.cjs` | Copia só os ficheiros do site para `dist/` e gera o `sitemap.xml` |
| `scripts/verificar.cjs` | Bloqueia a publicação se houver ligações partidas, recursos de terceiros ou originais em `dist/`, ou se os formulários não tiverem o endereço do Apps Script, o aviso RGPD ou as mesmas listas que o script |
| `scripts/otimizar-imagens.cjs` | Converte os PNG do Higgsfield para WebP |
| `docs/formularios/` | Formulários: desenho e proteção contra spam (`README.md`), script do Apps Script e guia de instalação (`apps-script/`), testes (`testar-formularios.mjs`) e o teste de 23 de outubro de 2026 (`teste-apps-script/`) |
| `docs/` | Registo das fotografias dos projetos, prompts das imagens e relatórios do site anterior (`docs/site-v1/`) |

## Pré-visualizar

```bash
node scripts/gerar-obras.cjs
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

## Formulários

O pedido de orçamento (secção Contactos) e a candidatura (`trabalhe-connosco/`) gravam cada envio numa folha de cálculo do Google Sheets, através de uma aplicação Web do Google Apps Script. Não há servidor próprio nem recursos de terceiros carregados com a página: o site só contacta o Google quando a pessoa carrega em "Enviar".

- Desenho, proteção contra spam e o que fazer se houver ataques: `docs/formularios/README.md`.
- Instalação e manutenção do script (propriedades, limpeza diária, publicação, mudança de conta): `docs/formularios/apps-script/GUIA.md`.
- O endereço da aplicação Web fica em `assets/js/formularios.js` (`const ENDPOINT`). Sem ele, os formulários mostram o telefone e o e-mail, e o `scripts/verificar.cjs` não deixa publicar.
- As listas de opções (tipo de serviço, início, profissão, experiência, disponibilidade) existem no HTML e em `LISTAS`, no `Codigo.gs`. O `scripts/verificar.cjs` compara-as.
- A página `trabalhe-connosco/` tem cópias do cabeçalho e do rodapé, como as páginas legais: uma mudança no rodapé tem de ser feita também nela.

Testes com o Apps Script simulado, em que nada é enviado ao Google (precisam do Playwright e do axe em `node_modules`). Para verificar o script publicado, ver `docs/formularios/README.md`, secção "Testes".

```bash
node scripts/publicar.cjs
node docs/formularios/testar-formularios.mjs
```

## Imagens

1. Os PNG do Higgsfield ficam em `rss/imgs/`, fora do Git.
2. Para os converter, corre `node scripts/otimizar-imagens.cjs rss/imgs assets/img`. O script precisa do `sharp` (`npm i --no-save sharp`).
3. Cada fase ganha versões de 1920 e de 1280 px. O site escolhe a mais leve que chega para o ecrã e carrega as fases à medida do scroll.

## Voltar ao site anterior

O site anterior (Vite/React, com o formulário Formward) é o commit `bc63c39` (merge da PR #7). Para o repor:

1. Confirma que as variáveis do repositório `VITE_FORM_ENDPOINT` e `VITE_FORM_ACCEPTS_FILES` têm os valores certos: o build antigo usa-as.
2. Faz `git revert -m 1 <commit do merge da v2>` em `main`, ou cria um ramo a partir de `bc63c39` e faz o merge.

## Por decidir com o cliente

- **Formulários na conta pessoal do Andre.** A folha e o script estão, por enquanto, na conta Google pessoal do Andre, que os mantém por conta da empresa. Falta um acordo de subcontratação entre o Andre e a LMDreams (RGPD, art. 28.º) e, mais tarde, a passagem para uma conta Google Workspace da empresa (`docs/formularios/apps-script/GUIA.md`, "Mudar de conta").
- **Avaliações Google.** A secção já existe, mas só aparece quando `assets/js/avaliacoes.js` tiver o link do perfil e pelo menos uma avaliação. As instruções estão no início desse ficheiro.
- **Textos do site anterior que não passaram para o novo:** a secção "Transparência em todas as fases da obra" e a frase final da chamada para contacto. Ver `docs/site-v1/`.
