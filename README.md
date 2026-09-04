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
- Sem backend próprio: o formulário de contacto envia através de um
  serviço externo configurável — ver [Formulário de contacto](#formulário-de-contacto).

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

## Imagens

O site usa duas pastas distintas:

- **`public/images/`** — as imagens efetivamente publicadas: WebP,
  redimensionadas e comprimidas (≈400 KB no total para seis fotografias).
- **`design/originais/`** — os ficheiros de origem em alta resolução.
  Esta pasta **não** é copiada para o site publicado; serve para poder
  recortar ou re-exportar mais tarde.

### Substituir por fotografias reais

As fotografias atuais são composições geradas por IA e servem apenas de
ambiente visual — **não são obras da LMDreams**. Por isso são
apresentadas com a etiqueta discreta "Imagem ilustrativa".

Para trocar uma delas por uma fotografia real:

1. Substituir o ficheiro correspondente em `public/images/`, mantendo o
   nome e o formato (ver tabela abaixo).
2. Remover a etiqueta:
   - nas secções que usam o componente `Photo` (Sobre, Método,
     Transparência), passar `illustrative={false}`;
   - no hero e no CTA, apagar o `<span>` com o texto "Imagem
     ilustrativa" no fim de `src/sections/Hero.tsx` e
     `src/sections/CtaBanner.tsx`.
3. Atualizar o `alt` da imagem para descrever a obra real.

| Ficheiro | Onde aparece | Dimensões |
|---|---|---|
| `hero.webp` | Fundo do hero | 1920×1080 |
| `obra.webp` | Sobre a LMDreams | 1200×800 |
| `especialistas.webp` | Fundo da secção "A nossa diferença" | 1200×800 |
| `planeamento.webp` | Transparência e confiança | 1200×800 |
| `interior.webp` | Fim do método de trabalho | 1200×800 |
| `cta.webp` | Fundo da chamada para ação | 1600×900 |

A secção **Projetos** mantém-se propositadamente com placeholders: aí só
devem entrar fotografias reais de obras concluídas.

## Formulário de contacto

O site é estático, pelo que o envio do e-mail é feito por um **serviço
externo**: o formulário faz um `POST` para um endpoint, e esse serviço
encaminha o pedido para o e-mail da empresa.

A configuração está isolada em `src/lib/contactForm.ts` e é feita por
variáveis de ambiente, o que permite **trocar de serviço sem mexer em
nenhum componente**:

| Variável | O que é |
|---|---|
| `VITE_FORM_ENDPOINT` | URL para onde o formulário é enviado |
| `VITE_FORM_ACCESS_KEY` | Chave pública do serviço (opcional — o Formspree, por exemplo, não usa) |

Enquanto `VITE_FORM_ENDPOINT` não estiver definida, o site funciona
normalmente mas o botão de envio fica desativado e o formulário avisa que
o envio automático ainda não está ligado, remetendo para telefone,
e-mail e WhatsApp.

### Ativar (Web3Forms, gratuito)

1. Em [web3forms.com](https://web3forms.com), indicar o e-mail que deve
   receber os pedidos (`mendes3pm@gmail.com`) e confirmar. Recebe uma
   *access key*.
2. **Para testar localmente:** copiar `.env.example` para `.env` e colar
   a chave em `VITE_FORM_ACCESS_KEY`. Depois `npm run dev`.
3. **Para o site publicado:** no GitHub, em **Settings → Secrets and
   variables → Actions → New repository secret**, criar dois segredos:
   - `VITE_FORM_ENDPOINT` = `https://api.web3forms.com/submit`
   - `VITE_FORM_ACCESS_KEY` = a chave do passo 1
4. Correr o workflow de deployment (ou fazer um push para `main`).

### Trocar de serviço

Basta mudar os dois segredos. Exemplos:

- **Formspree** — `VITE_FORM_ENDPOINT=https://formspree.io/f/xxxxxxxx`,
  sem access key.
- **Função serverless própria** (Cloudflare Workers, Vercel…) —
  apontar `VITE_FORM_ENDPOINT` para o endpoint criado. É a opção
  recomendada quando existir domínio próprio, porque permite enviar os
  e-mails a partir de um endereço da empresa (ex.: `geral@lmdreams.pt`),
  o que melhora bastante a entregabilidade e a credibilidade.

### O que já está tratado

- **Spam:** o formulário inclui um campo-armadilha (*honeypot*) invisível.
  Se os pedidos de spam se tornarem um problema, o passo seguinte é
  acrescentar o [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/),
  que é gratuito e não obriga o visitante a resolver puzzles.
- **Erros:** se o envio falhar, o formulário mostra o motivo e os
  contactos alternativos, em vez de deixar o visitante sem resposta.
- **Fotografias:** não são anexadas no formulário — a esmagadora maioria
  dos serviços gratuitos não aceita anexos, e fotografias de telemóvel
  ultrapassam depressa os limites. Em vez disso, o formulário convida a
  enviá-las por WhatsApp.

> ⚠️ **RGPD:** seja qual for o serviço escolhido, ele passa a subcontratante
> do tratamento dos dados. A Política de Privacidade
> (`src/pages/PrivacyPolicy.tsx`, secção 4) tem um placeholder à espera do
> nome do serviço e da localização dos servidores. Serviços com servidores
> na UE simplificam o cumprimento.

## Elementos a substituir antes de publicar

Por instrução do pedido original, **não foram inventados** dados de
contacto, números, certificações, localidades, preços, prazos ou
testemunhos. Os seguintes pontos têm placeholders claramente identificados
que devem ser substituídos por informação real da LMDreams antes de o site
ir para produção:

| Elemento | Localização | Nota |
|---|---|---|
| Logótipo | `public/logo.png`, `public/favicon.png` | Logótipo oficial da LMDreams. Para o trocar, basta substituir estes ficheiros — nenhum código precisa de mudar. |
| Horário de atendimento | `src/lib/site.ts` (`SITE.horario`) | Valor de exemplo — confirmar horário real. |
| Redes sociais | `src/lib/site.ts` (`SITE.instagramHref`, `SITE.facebookHref`) | Ligações a `#` — substituir pelos perfis reais assim que existirem. |
| Fotografias de projetos | `src/sections/Projects.tsx`, `src/data/projects.ts`, `src/components/ui/PlaceholderImage.tsx` | Todos os projetos são exemplos de estrutura, com nome, localidade e imagens claramente marcados como placeholder. Substituir por projetos reais e fotografias próprias (nunca imagens geradas por IA apresentadas como obras reais). |
| Testemunhos | `src/sections/Testimonials.tsx` | Cartões identificados como "Conteúdo de exemplo" — nunca foram inventados nomes, citações ou classificações. Substituir apenas por testemunhos reais e verificados. |
| Lista de serviços | `src/data/services.ts` | Lista indicativa, com aviso no próprio site a pedir confirmação — validar com a empresa quais os serviços efetivamente disponíveis. |
| Páginas legais | `src/pages/PrivacyPolicy.tsx`, `CookiePolicy.tsx`, `Terms.tsx` | Modelos genéricos, sinalizados no topo de cada página. Devem ser revistos por um profissional habilitado antes da publicação. |
| Livro de reclamações | `src/components/Footer.tsx` | Liga atualmente ao portal oficial [livroreclamacoes.pt](https://www.livroreclamacoes.pt/Inicio/). Se a empresa tiver um código/QR específico do livro de reclamações físico ou eletrónico, adicionar aqui. |
| Imagem Open Graph | `public/og-image.jpg` | 1200×630px, gerada a partir da fotografia do hero. Substituir por uma fotografia real de uma obra quando existir. |
| Fotografias de ambiente | `public/images/*.webp` | Composições geradas por IA, usadas como ambiente visual no hero, Sobre, Diferenciação, Método, Transparência e CTA. Cada uma aparece no site com a etiqueta **"Imagem ilustrativa"** — ver secção [Imagens](#imagens) para as substituir por fotografias reais. |
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
