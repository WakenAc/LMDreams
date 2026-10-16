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
