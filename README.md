# LMDreams — Website institucional

Website institucional da **LMDreams**, empresa portuguesa de construção civil
e remodelações. Construído em React + Vite + TypeScript + Tailwind CSS,
pronto para publicação em GitHub Pages.

> ⚠️ Este projeto contém **conteúdo de exemplo e placeholders** que têm de
> ser substituídos antes de o site ir para produção. Ver a secção
> [Elementos a substituir antes de publicar](#elementos-a-substituir-antes-de-publicar).

## Stack técnica

- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) (build e dev server)
- [Tailwind CSS v4](https://tailwindcss.com/) (via `@tailwindcss/vite`, sem `tailwind.config.js` — o tema vive em `src/index.css`)
- [React Router](https://reactrouter.com/) (página inicial + páginas legais)
- [lucide-react](https://lucide.dev/) (ícones)
- Sem dependência de backend: o formulário de contacto funciona no
  browser e está preparado para ser ligado a um serviço externo.

## Identidade visual

O site usa um tema **escuro**, alinhado com o logótipo da LMDreams
(fundo carvão + lima). Todas as cores são tokens CSS definidos num único
sítio — o bloco `@theme` em `src/index.css` — pelo que mudar a paleta
inteira é mudar esse bloco.

| Token | Valor | Uso |
|---|---|---|
| `--color-ink` | `#121110` | Fundo principal das secções |
| `--color-surface` | `#1a1816` | Fundo das secções alternadas |
| `--color-surface-2` | `#221f1b` | Cartões e campos de formulário |
| `--color-surface-3` | `#2b2723` | Estado hover de cartões |
| `--color-line` / `--color-line-strong` | `#322d28` / `#443e37` | Bordas e separadores |
| `--color-fg` | `#f6f3ed` | Títulos e texto de destaque |
| `--color-fg-muted` | `#b6afa2` | Texto corrente |
| `--color-fg-subtle` | `#8a8376` | Legendas e texto secundário |
| `--color-brand` | `#c7d436` | Cor de acento — o lima do logótipo |
| `--color-brand-soft` / `--color-brand-deep` | `#dde36d` / `#97a327` | Estados hover/active dos botões |

Nas classes Tailwind estes tokens aparecem como `bg-ink`, `bg-surface-2`,
`text-fg-muted`, `border-line`, `text-brand`, `bg-brand`, etc.

Tipografia: **Fraunces** (títulos) e **Inter** (texto), carregadas do
Google Fonts em `index.html`.

## Estrutura do projeto

```
LMDreams/
├── .github/workflows/deploy.yml   # GitHub Actions: build + deploy no GitHub Pages
├── public/                        # Ficheiros estáticos (favicon, robots, sitemap, 404, og-image)
├── src/
│   ├── components/                # Header, Footer, Logo, componentes de UI reutilizáveis
│   │   └── ui/                    # Button, Container, SectionHeading, PlaceholderImage, PlaceholderBadge
│   ├── sections/                  # Uma secção da landing page por ficheiro (Hero, About, Services, ...)
│   ├── pages/                     # HomePage + páginas legais + 404
│   ├── data/                      # Conteúdo estruturado (nav, serviços, processo, projetos, ...)
│   ├── lib/                       # site.ts (dados de contacto) e utilitários
│   ├── App.tsx                    # Rotas
│   ├── main.tsx                   # Ponto de entrada
│   └── index.css                  # Tema Tailwind (cores, tipografia, animações)
├── index.html                     # Meta tags, SEO, Open Graph, dados estruturados (JSON-LD)
└── vite.config.ts                 # Configuração do Vite, incluindo o base path do GitHub Pages
```

Cada secção da página inicial (`src/sections/*.tsx`) corresponde a um ponto
da estrutura pedida: Hero, Sobre, Diferenciação, Serviços, Método de
trabalho, Projetos, Transparência, Testemunhos, Chamada para ação e
Contactos. O cabeçalho e rodapé estão em `src/components/`.

## Como executar localmente

Requisitos: [Node.js](https://nodejs.org/) 20 ou superior.

```bash
# instalar dependências
npm install

# iniciar o servidor de desenvolvimento (com recarregamento automático)
npm run dev
```

O site fica disponível em `http://localhost:5173/`.

## Build de produção

```bash
npm run build
```

Gera os ficheiros otimizados em `dist/`. Para pré-visualizar essa build
localmente antes de publicar:

```bash
npm run preview
```

## Publicação no GitHub Pages

O projeto já vem preparado para publicação automática:

1. Envie o código para um repositório no GitHub.
2. Em **Settings → Pages**, defina a origem como **GitHub Actions**.
3. Faça push para o branch `main` — o workflow em
   `.github/workflows/deploy.yml` faz o build e publica automaticamente em
   `https://<o-seu-utilizador>.github.io/LMDreams/`.

Também pode acionar o deployment manualmente em **Actions → Publicar no
GitHub Pages → Run workflow**.

### Caminho base (`base path`)

O `vite.config.ts` define `base: "/LMDreams/"`, o valor correto para uma
"página de projeto" do GitHub Pages (`https://<utilizador>.github.io/LMDreams/`).

- **Este valor tem de corresponder exatamente ao nome do repositório no
  GitHub, incluindo maiúsculas/minúsculas** — o GitHub Pages é sensível a
  maiúsculas/minúsculas nos caminhos dos ficheiros. Se o nome do
  repositório for diferente de `LMDreams`, atualize o valor de
  `BASE_PATH` em `vite.config.ts` para corresponder exatamente ao nome
  real do repositório (uma diferença de maiúsculas/minúsculas faz o
  JavaScript e o CSS devolverem 404, resultando numa página em branco).
- **Se for usar um domínio próprio** (ver secção seguinte), mude
  `BASE_PATH` para `"/"`.

Também pode substituir o valor em tempo de build sem editar o ficheiro:

```bash
VITE_BASE_PATH=/ npm run build
```

### Domínio próprio (CNAME)

Para publicar em `www.oseudominio.pt` em vez do domínio `github.io`:

1. Crie um ficheiro `public/CNAME` com uma única linha contendo o domínio,
   por exemplo:
   ```
   www.oseudominio.pt
   ```
2. Configure o DNS do domínio para apontar para o GitHub Pages (registo
   `CNAME` para `<utilizador>.github.io`, seguindo a
   [documentação oficial do GitHub](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site)).
3. Mude `BASE_PATH` para `"/"` em `vite.config.ts` (ver acima).
4. Atualize os URLs absolutos em `index.html` (meta `og:url`, `og:image`,
   `canonical`), `public/robots.txt` e `public/sitemap.xml` para o novo
   domínio.

### Suporte a rotas em GitHub Pages

O GitHub Pages não suporta reescrita de rotas do lado do servidor, pelo
que uma atualização de página (F5) numa rota interna (por exemplo,
`/politica-de-privacidade`) resultaria num 404. Este projeto já inclui o
[truque de redireccionamento `spa-github-pages`](https://github.com/rafgraph/spa-github-pages)
(`public/404.html` + pequeno script em `index.html`), pelo que isto
funciona sem configuração adicional.

## Formulário de contacto

O formulário em `src/sections/Contact.tsx` funciona apenas no browser —
não envia dados para lado nenhum. Ao submeter, mostra uma mensagem de
confirmação local, deixando claro que ainda não está ligado a um serviço
real (ver `handleSubmit` no mesmo ficheiro).

Para ativar o envio real, é necessário escolher um serviço externo (não
requer backend próprio), por exemplo:

- [Formspree](https://formspree.io/)
- [Getform](https://getform.io/)
- [EmailJS](https://www.emailjs.com/)
- Uma função serverless própria (Cloudflare Workers, Vercel Functions, etc.)

e substituir o corpo da função `handleSubmit` por um pedido `fetch`/`POST`
para esse serviço, usando os dados do `FormData` do formulário (incluindo,
se aplicável, os ficheiros anexados no campo "Fotografias").

## Elementos a substituir antes de publicar

Por instrução do pedido original, **não foram inventados** dados de
contacto, números, certificações, localidades, preços, prazos ou
testemunhos. Os seguintes pontos têm placeholders claramente identificados
que devem ser substituídos por informação real da LMDreams antes de o site
ir para produção:

| Elemento | Localização | Nota |
|---|---|---|
| Logótipo | `src/components/Logo.tsx`, `public/favicon.svg`, `public/og-image.svg` | Recriação vetorial aproximada do logótipo fornecido (não foi possível extrair o ficheiro original anexado na conversa). Substituir pelo ficheiro oficial da marca. |
| Horário de atendimento | `src/lib/site.ts` (`SITE.horario`) | Valor de exemplo — confirmar horário real. |
| Redes sociais | `src/lib/site.ts` (`SITE.instagramHref`, `SITE.facebookHref`) | Ligações a `#` — substituir pelos perfis reais assim que existirem. |
| Fotografias de projetos | `src/sections/Projects.tsx`, `src/data/projects.ts`, `src/components/ui/PlaceholderImage.tsx` | Todos os projetos são exemplos de estrutura, com nome, localidade e imagens claramente marcados como placeholder. Substituir por projetos reais e fotografias próprias (nunca imagens geradas por IA apresentadas como obras reais). |
| Testemunhos | `src/sections/Testimonials.tsx` | Cartões identificados como "Conteúdo de exemplo" — nunca foram inventados nomes, citações ou classificações. Substituir apenas por testemunhos reais e verificados. |
| Lista de serviços | `src/data/services.ts` | Lista indicativa, com aviso no próprio site a pedir confirmação — validar com a empresa quais os serviços efetivamente disponíveis. |
| Páginas legais | `src/pages/PrivacyPolicy.tsx`, `CookiePolicy.tsx`, `Terms.tsx` | Modelos genéricos, sinalizados no topo de cada página. Devem ser revistos por um profissional habilitado antes da publicação. |
| Livro de reclamações | `src/components/Footer.tsx` | Liga atualmente ao portal oficial [livroreclamacoes.pt](https://www.livroreclamacoes.pt/Inicio/). Se a empresa tiver um código/QR específico do livro de reclamações físico ou eletrónico, adicionar aqui. |
| Imagem Open Graph | `public/og-image.svg` | Composição gráfica original em SVG. Para melhor compatibilidade em todas as redes sociais, recomenda-se substituir por um ficheiro `.jpg`/`.png` de 1200×630px com uma fotografia real de uma obra, atualizando também as referências em `index.html`. |
| URLs de produção | `index.html`, `public/robots.txt`, `public/sitemap.xml` | Atualmente apontam para `https://wakenac.github.io/LMDreams/`. Atualizar se o repositório, utilizador ou domínio final forem diferentes. |

Dados de contacto **reais**, fornecidos e já em uso no site (`src/lib/site.ts`):

- Telefone / WhatsApp: `+351 919 233 372`
- E-mail: `mendes3pm@gmail.com`
- Área de atuação: Portugal continental

## SEO e desempenho

- Meta tags de título, descrição, Open Graph e Twitter Card em `index.html`.
- Dados estruturados `GeneralContractor` (schema.org) em JSON-LD.
- Hierarquia semântica de títulos (`h1` no Hero, `h2` por secção, `h3` nos cartões).
- `public/sitemap.xml` e `public/robots.txt` incluídos.
- Imagens e ícones em SVG (leves, nítidos em qualquer resolução).
- Suporte a `prefers-reduced-motion`, navegação por teclado, `focus-visible`
  visível e etiquetas (`label`) associadas a todos os campos do formulário.

## Licença de conteúdo

Todo o texto foi escrito de raiz em português de Portugal para este
projeto, sem inventar dados factuais sobre a empresa além dos fornecidos.
