# LMDreams

Website institucional da LMDreams, empresa de construção civil e remodelações que atua em Portugal continental.

- Endereço público: <https://wakenac.github.io/LMDreams/>
- Repositório: `WakenAc/LMDreams` (GitHub)

## 1. O que é o projeto

Um site estático de apresentação da empresa, sem vendas online, com:

- **Página principal**, com as secções Início (hero), Sobre nós, Diferenciação, Serviços, Método de trabalho, Projetos, Transparência, Testemunhos, chamada para ação e Contactos (com formulário de pedido de orçamento).
- **Páginas legais**: Política de privacidade (`politica-de-privacidade/`), Política de cookies (`politica-de-cookies/`) e Termos e condições (`termos-e-condicoes/`).
- **Página 404** para endereços que não existem.

Tecnologia: React 19, Vite 8, TypeScript 6 e Tailwind CSS v4. Todas as páginas são **pré-renderizadas**: o HTML completo é gerado no build e o conteúdo aparece mesmo sem JavaScript. Só algumas partes interativas (menu, filtros dos projetos, formulário, barra de contactos no telemóvel) carregam JavaScript, depois de a página abrir.

O site não usa cookies, estatísticas, `localStorage` nem recursos de terceiros; as fontes estão alojadas no próprio site. É publicado no GitHub Pages através do GitHub Actions.

Documentos de referência:

- `BRIEF-LMDREAMS.md`: especificação original (longa).
- `design/direcao-visual.md`: direção visual escolhida, "C · Planta e Latão" (cores, tipografia, fotografia).
- `CONTEUDO-A-SUBSTITUIR.md`: lista do que ainda falta preencher.
- `docs/rastreabilidade.md` e `docs/relatorio-final.md`: estado de cada requisito e relatório do projeto.

## 2. Requisitos e instalação

Precisa de:

- **Node.js 24 LTS** (recomendado; é a versão do `.nvmrc`, usada pelo GitHub Actions). O `package.json` aceita Node 22.19 ou superior (`engines`), mas use a 24 sempre que puder.
- **Git**.
- **GitHub CLI** (`gh`), opcional: serve para clonar o repositório enquanto for privado e para o comando `npm run deploy`.
- **Chromium do Playwright**, só para os testes (`npm run test:e2e`, `npm run check`), para o `npm run lighthouse` e para o `npm run og:image`. Instala-se com um comando, no passo 4 abaixo.

### Windows (PowerShell)

1. Abra o PowerShell e instale as ferramentas com o `winget`:

   ```powershell
   winget install --id Git.Git -e
   winget install --id OpenJS.NodeJS.LTS -e
   winget install --id GitHub.cli -e
   ```

   A terceira linha (GitHub CLI) é opcional, mas enquanto o repositório for privado é a forma mais simples de o descarregar (passo 3).

2. Feche e volte a abrir o PowerShell e confirme as versões (o `node -v` deve mostrar `v24.` seguido de mais números):

   ```powershell
   git --version
   node -v
   npm -v
   ```

3. Descarregue o repositório e entre na pasta. Enquanto o repositório for privado, use o GitHub CLI com a sessão iniciada:

   ```powershell
   gh auth login
   gh repo clone WakenAc/LMDreams
   cd LMDreams
   ```

   Depois de o repositório ser público, também funciona sem sessão:

   ```powershell
   git clone https://github.com/WakenAc/LMDreams.git
   cd LMDreams
   ```

4. Instale as dependências do projeto e o Chromium dos testes:

   ```powershell
   npm install
   npx playwright install chromium
   ```

Se o PowerShell recusar o comando `npm` com uma mensagem sobre a execução de scripts estar desativada, escreva `npm.cmd` em vez de `npm` (por exemplo, `npm.cmd install`). Não é preciso mudar nenhuma definição do Windows.

### macOS

1. Instale o Node.js 24 LTS de uma destas formas:

   - **Instalador:** descarregue a versão LTS (24) em <https://nodejs.org> e abra o ficheiro `.pkg`.
   - **Homebrew:** no Terminal,

     ```bash
     brew install node@24
     echo 'export PATH="$(brew --prefix node@24)/bin:$PATH"' >> ~/.zshrc
     ```

     A segunda linha põe o Node 24 no caminho do Terminal (o Homebrew mostra uma indicação equivalente no fim da instalação).

2. Instale o Git (e, se quiser, o GitHub CLI):

   ```bash
   xcode-select --install
   ```

   ou, com Homebrew:

   ```bash
   brew install git gh
   ```

3. Feche e volte a abrir o Terminal e confirme as versões:

   ```bash
   git --version
   node -v
   npm -v
   ```

4. Descarregue o repositório, entre na pasta e instale as dependências e o Chromium dos testes:

   ```bash
   gh auth login
   gh repo clone WakenAc/LMDreams
   cd LMDreams
   npm install
   npx playwright install chromium
   ```

   Com o repositório público, pode trocar as duas primeiras linhas por `git clone https://github.com/WakenAc/LMDreams.git`.

## 3. Comandos

Todos os comandos correm dentro da pasta `LMDreams` e funcionam da mesma forma no PowerShell e no Terminal do macOS. Para parar um servidor, carregue em Ctrl+C.

```bash
npm install
```

Instala as dependências (só é preciso na primeira vez e quando o `package.json` mudar). Para instalar exatamente as versões do `package-lock.json`, como faz o GitHub Actions, use `npm ci`.

```bash
npm run dev
```

Servidor de desenvolvimento: abra <http://localhost:5173/LMDreams/> no navegador. As alterações aos ficheiros aparecem logo. Se a porta 5173 estiver ocupada, o Vite usa a seguinte e mostra o endereço no terminal.

```bash
npm run build:pages
```

Gera o site tal como vai ser publicado, com o endereço base `/LMDreams/`, na pasta `dist/`.

```bash
npm run preview
```

Serve a pasta `dist/` como o GitHub Pages a serve (endereço base, barra final, página 404): abra <http://localhost:4173/LMDreams/>. Corra antes o `npm run build:pages`.

```bash
npm run check
```

Todas as verificações, por esta ordem: tipos, lint, build do GitHub Pages, ligações, contraste, placeholders, SEO, proibições, peso da página principal, build na raiz e testes E2E. Demora alguns minutos e precisa do Chromium do Playwright. Corra-o antes de dar qualquer alteração por concluída.

Restantes scripts do `package.json`:

| Script | O que faz |
|---|---|
| `npm run build` | Build completo (tipos, cliente, SSR, pré-renderização, `sitemap.xml` e `robots.txt`) com as variáveis já definidas; é o que o `deploy.yml` usa. Localmente, use `build:pages`. |
| `npm run build:root` | Build de teste com endereço base `/` e o domínio de exemplo `https://www.exemplo.pt` em `.tmp/dist-root/`, seguido da verificação das ligações (prova que o domínio próprio é só configuração). |
| `npm run typecheck` | Verificação de tipos do TypeScript (`tsc -b`). |
| `npm run lint` | Análise do código com o `oxlint` (React, acessibilidade do JSX e TypeScript). |
| `npm run format` | Formata os ficheiros com o Prettier (altera-os; respeita o `.prettierignore`). |
| `npm run test:e2e` | Testes Playwright e axe sobre a pasta `dist/` (arranca o servidor na porta 4173); corra antes o `build:pages`. |
| `npm run lighthouse` | Lighthouse em telemóvel e computador na página principal e nas três páginas legais, sobre a pasta `dist/`; relatórios em `.lighthouseci/`. |
| `npm run check:placeholders` | Conta os dados em falta e reescreve o `CONTEUDO-A-SUBSTITUIR.md`; com `-- --strict` falha se faltarem dados que bloqueiam a publicação. |
| `npm run check:contrast` | Contraste das cores usadas em texto e componentes (regras WCAG). |
| `npm run check:links` | Ligações, âncoras, ficheiros, `site.webmanifest`, `sitemap.xml` e `robots.txt` da pasta de saída (aceita `--dir` e `--base`). |
| `npm run check:seo` | Títulos, descrições, meta tags, Open Graph, JSON-LD e HTML pré-renderizado de cada página. |
| `npm run check:forbidden` | Palavras e fórmulas proibidas no texto, APIs de armazenamento no código e marcas de conformidade em todas as páginas. |
| `npm run check:budget` | Peso do JavaScript, do CSS e das imagens da página principal. |
| `npm run og:image` | Gera a imagem de partilha `public/og-image.jpg` (1200 × 630) com o Chromium do Playwright. |
| `npm run favicons` | Gera os favicons, os ícones e o `site.webmanifest` em `public/`: os ícones saem do grafismo da casa do logótipo completo (`assets-src/brand/logotipo-completo.jpeg`) e o `public/logo-lmdreams.png` é uma cópia de `assets-src/brand/logo-original.png`. |
| `npm run contact-sheet` | Folha de contacto das imagens ilustrativas, em `.tmp/folha-de-contacto.jpg`. |
| `npm run deploy` | `gh workflow run deploy.yml --ref main`: volta a publicar o site a partir da `main` (secção 6). |

Nunca defina à mão as variáveis de build (`BASE_PATH`, `SITE_URL`, `OUT_DIR`) na linha de comandos: os scripts `build:pages` e `build:root` já as definem. No Git Bash, um caminho começado por `/` pode ser convertido num caminho do Windows e o build termina com um erro.

## 4. Estrutura de pastas

```text
LMDreams/
├── .github/workflows/
│   ├── ci.yml                 verificações em cada Pull Request
│   └── deploy.yml             publicação no GitHub Pages
├── assets-src/                originais das imagens (o build gera as versões otimizadas)
│   ├── brand/                 logótipo original (logo-original.png)
│   └── ilustrativas/          imagens geradas por IA e manifest.json (proveniência)
├── design/                    direção visual, propostas, boards e maquetas
├── docs/                      rastreabilidade.md e relatorio-final.md
├── public/                    copiado tal como está: favicons, og-image.jpg, site.webmanifest, logótipo
├── scripts/                   build, pré-renderização, servidor local e verificações (TypeScript)
├── src/
│   ├── content/               TEXTOS E DADOS DO SITE (é aqui que se alteram os conteúdos)
│   │   └── legal/             Política de privacidade, Política de cookies, Termos e condições
│   ├── components/            layout/ (cabeçalho, rodapé, menus) e ui/ (botões, imagens, formulário)
│   ├── sections/              secções da página principal
│   ├── pages/                 página principal, páginas legais e 404
│   ├── islands/               partes interativas (cabeçalho, projetos, contactos, barra móvel)
│   ├── lib/                   lógica: formulário (lead.ts), ligações, SEO, placeholders
│   ├── styles/index.css       cores, tipografia e estilos (Tailwind CSS v4)
│   └── types/                 declarações de tipos
├── tests/e2e/                 testes Playwright e axe
├── BRIEF-LMDREAMS.md          especificação original
├── CLAUDE.md                  regras do projeto para o Claude Code
├── CNAME.example              explicação sobre o domínio próprio (não é publicado)
├── CONTEUDO-A-SUBSTITUIR.md   lista do que falta preencher (gerada)
├── index.html                 modelo HTML das páginas
├── vite.config.ts, playwright.config.ts, lighthouserc.cjs, tsconfig*.json
└── package.json, package-lock.json, .nvmrc (Node 24)
```

Pastas geradas, que não vão para o Git: `node_modules/`, `dist/`, `dist-ssr/`, `.tmp/`, `.lighthouseci/`, `.revisao/`, `test-results/` e `playwright-report/`.

## 5. Onde alterar conteúdos

Todos os textos e dados do site estão em `src/content/`. Os componentes não têm texto escrito à mão.

### Contactos

Em `src/content/company.ts`:

- **Telefone:** `phone` (os campos `display`, `href` e `e164` mudam em conjunto). Junto a cada número visível aparece `phoneCallNote` ("chamada para a rede móvel nacional"); se o número passar a uma rede fixa, este texto tem de mudar.
- **WhatsApp:** `whatsapp.number` (só algarismos, com o 351) e `whatsapp.message` (mensagem inicial).
- **E-mail:** `email`.
- **Área de atuação:** `areaServed`.
- Também aqui: horário (`hours`), redes sociais (`social` e `socialPending`), condições do orçamento (`quoteTerms`) e morada pública (`publicAddress`).

### Textos

| Ficheiro em `src/content/` | Conteúdo |
|---|---|
| `hero.ts` | Início: título, subtítulo, lista de confiança e anotações da imagem |
| `about.ts` | Sobre nós |
| `differentiators.ts` | Diferenciação |
| `services.ts` | Serviços |
| `process.ts` | Método de trabalho (oito etapas) |
| `projects.ts` | Projetos |
| `transparency.ts` | Transparência |
| `testimonials.ts` | Testemunhos |
| `cta.ts` | Chamada para ação |
| `contact.ts` | Contactos e formulário (campos, erros, mensagens, rascunho do e-mail, intervalos de orçamento) |
| `navigation.ts` | Menu |
| `footer.ts` | Rodapé (rótulos, informação de resolução de litígios, nota das imagens de IA) |
| `common.ts` | Rótulos comuns (botões, textos de acessibilidade) |
| `notFound.ts` | Página 404 |
| `seo.ts` | Títulos (até 60 caracteres) e descrições (até 155) de cada página |
| `legal/privacy.ts`, `legal/cookies.ts`, `legal/terms.ts` | Páginas legais |

`tipos.ts` e `placeholders-registo.ts` não são textos do site: o primeiro define a forma dos conteúdos e o segundo é o registo dos dados em falta.

### Imagens

Registo de todas as imagens em `src/content/images.ts`; os ficheiros originais ficam em `assets-src/`. Ver a secção 9.

### Testemunhos

`src/content/testimonials.ts`. Os três cartões atuais são provisórios. Para publicar um testemunho real: preencha o texto, o nome, a localidade e o tipo de obra, **com autorização escrita do cliente**, e mude `placeholder: true` para `placeholder: false`. Sem estrelas nem classificações.

### Projetos

`src/content/projects.ts`, com oito projetos de cinco obras reais desde 29 de setembro de 2026 (fotografias em `public/projetos/<obra>/`; origem, autorização e tratamentos de privacidade em `docs/fotografias-projetos.md`). Para acrescentar ou trocar uma obra:

1. Preencha `nome`, `tipoDeIntervencao`, `localidade` e `descricao` (só com factos confirmados pela empresa).
2. Junte **fotografias reais** do antes e do depois, **com autorização do cliente** (nunca imagens geradas por IA). Sem rostos, matrículas, números de porta nem nada que identifique a morada: recorte ou desfoque. Reduza-as (lado maior com 1200 px, WebP) e copie-as para uma pasta em `public/projetos/`. Cada par antes e depois tem de ter as mesmas dimensões e ficar pela mesma ordem nas duas listas.
3. Indique cada fotografia em `capa`, `antes` e `depois` com `src` (caminho relativo, sem `/` no início: `'projetos/cozinha-antes.jpg'`; o site acrescenta o endereço base), `alt` (descrição em português), `width` e `height` (dimensões em píxeis).
4. Mude `placeholder: true` para `placeholder: false` e corra `npm run check`.

### Dados legais

`src/content/company.ts`, bloco `legal`: tipo de sociedade, denominação social, NIPC, sede, conservatória, capital social, título do IMPIC (alvará ou certificado), entidades de resolução alternativa de litígios, dados da Política de privacidade (e-mail para dados pessoais, prazo de conservação, fornecedores, encarregado de proteção de dados), validade dos orçamentos e garantia comercial. A forma jurídica escolhe-se no início do ficheiro, em `legalForm` (`'sociedade'` ou `'eni'`, empresário em nome individual); os rótulos do rodapé mudam sozinhos. Um campo que não se aplique (por exemplo, o capital realizado) passa a `null`.

As páginas legais e o bloco "Informação legal" do rodapé são minutas: têm de ser validadas por um jurista ou contabilista antes da publicação.

### Serviços

`src/content/services.ts`. Os seis primeiros são os serviços em destaque, com imagem. Todos estão com `confirmado: false`: depois de a empresa validar o nome e a descrição de cada um, mude para `confirmado: true`. Só os serviços confirmados entram nos dados estruturados (JSON-LD) da página principal.

### Dados em falta

Os dados que faltam aparecem no site como `[A CONFIRMAR: …]` e no código como `PH('chave', 'descrição')`. Para preencher um, troque a chamada pelo valor real, entre aspas: `name: PH('denominacao-social', 'denominação social')` passa a `name: 'Denominação real'`.

A lista completa, com o ficheiro e a linha de cada ocorrência, está em **`CONTEUDO-A-SUBSTITUIR.md`**. Esse ficheiro é gerado: não o edite à mão. Depois de preencher dados, atualize-o com:

```bash
npm run check:placeholders
```

Na data deste README há 90 pendentes em 22 chaves, dos quais 18 (em 13 chaves) bloqueiam a publicação.

## 6. Publicação no GitHub Pages

A publicação é automática: cada merge na `main` corre o workflow `.github/workflows/deploy.yml`, que faz o build, confirma os dados legais e publica em <https://wakenac.github.io/LMDreams/>. Cada Pull Request corre antes o `.github/workflows/ci.yml` (`npm run check` e Lighthouse), com os relatórios guardados durante 14 dias no separador *Actions*.

### Primeira publicação

1. **Tornar o repositório público.** Numa conta gratuita do GitHub, o GitHub Pages só publica repositórios públicos. No GitHub, abra o repositório, *Settings → General* e, no fim da página, em *Danger Zone*, *Change visibility → Change to public* (tornar público). Confirme; o GitHub pode pedir que escreva o nome do repositório. Tudo o que está no repositório, incluindo o `BRIEF-LMDREAMS.md` e o histórico, passa a ser visível para qualquer pessoa. O projeto não tem segredos. (Com um plano pago, como o Pro, o Pages também publica a partir de um repositório privado, e o site fica público na mesma.)
2. **Ativar a origem "GitHub Actions", antes do merge.** Em *Settings → Pages → Build and deployment → Source*, escolha *GitHub Actions*. **Nunca escolha *Deploy from a branch*:** essa opção publica os ficheiros-fonte do repositório tal como estão, sem build e sem o bloqueio dos dados legais. O resultado é uma página em branco e os documentos internos (brief, relatório, conteúdos a substituir) visíveis no endereço do site. Aconteceu a 26 de setembro de 2026, e o site foi retirado do ar a 27. Se o merge acontecer antes de a origem estar ativa, o `deploy.yml` falha no passo "Configure GitHub Pages"; depois de ativar a origem, publique com `npm run deploy` (secção "Voltar a publicar").
3. **Preencher os dados que bloqueiam a publicação.** O `deploy.yml` corre `npm run check:placeholders -- --strict` depois do build e **falha de propósito** enquanto faltarem os dados marcados "Bloqueia publicação" no `CONTEUDO-A-SUBSTITUIR.md` (forma jurídica, denominação social, NIPC, sede, conservatória e capital social, título do IMPIC, entidades de resolução de litígios e dados da Política de privacidade). Enquanto falhar, o site não fica público. Confirme no seu computador antes do merge:

   ```bash
   npm run check:placeholders -- --strict
   ```

   Tem de terminar com "Resultado: passou." e a primeira linha tem de mostrar `check:placeholders --strict`. Se no PowerShell a primeira linha não mostrar o `--strict`, escreva `npm.cmd` em vez de `npm`.
4. **Fazer merge da Pull Request na `main`.** A publicação arranca sozinha. Acompanhe-a no separador *Actions* ("Deploy to GitHub Pages"); em poucos minutos o site fica em <https://wakenac.github.io/LMDreams/>.

O ambiente `github-pages` só aceita publicações a partir do branch por omissão (`main`).

### Voltar a publicar

Cada merge na `main` publica de novo. Para republicar sem alterações ao código (por exemplo, depois de mudar as variáveis do formulário ou de configurar o domínio próprio):

```bash
npm run deploy
```

É o mesmo que `gh workflow run deploy.yml --ref main` e precisa do GitHub CLI com a sessão iniciada (`gh auth login`). Sem o GitHub CLI: no GitHub, *Actions → Deploy to GitHub Pages → Run workflow*, com o branch `main`.

## 7. Domínio próprio

O site pode passar de `https://wakenac.github.io/LMDreams/` para um domínio próprio, por exemplo `www.dominio.pt`. Não é preciso alterar código nem criar um ficheiro `CNAME`: com a publicação por GitHub Actions, esse ficheiro é ignorado (o `CNAME.example` explica isto e não é publicado).

1. **Comprar o domínio** num registador (por exemplo, `dominio.pt`). O endereço principal recomendado é o `www.dominio.pt`.
2. **Verificar o domínio na conta do GitHub** (impede que outra conta o use no GitHub Pages). Nas definições da conta (imagem do perfil no canto superior direito → *Settings*; não são as definições do repositório), abra *Pages → Add a domain* e escreva `dominio.pt`. O GitHub mostra um registo TXT. No painel de DNS do registador, crie-o:

   | Tipo | Nome | Valor |
   |---|---|---|
   | TXT | `_github-pages-challenge-wakenac.dominio.pt` | o código que o GitHub mostrar |

   Em alguns registadores, o nome escreve-se só `_github-pages-challenge-wakenac` (o registador junta o domínio). Volte ao GitHub e carregue em *Verify*. **Mantenha este registo TXT** depois da verificação.
3. **Apontar a raiz do domínio** (`dominio.pt`, às vezes indicada como `@`) para o GitHub Pages, com estes oito registos:

   | Tipo | Nome | Valor |
   |---|---|---|
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |
   | AAAA | `@` | `2606:50c0:8000::153` |
   | AAAA | `@` | `2606:50c0:8001::153` |
   | AAAA | `@` | `2606:50c0:8002::153` |
   | AAAA | `@` | `2606:50c0:8003::153` |

4. **Apontar o `www`** com um registo CNAME:

   | Tipo | Nome | Valor |
   |---|---|---|
   | CNAME | `www` | `wakenac.github.io` |

   O valor é só `wakenac.github.io`, sem o nome do repositório.
5. **Nunca crie registos com asterisco** (por exemplo, `*.dominio.pt`): permitiriam que outras pessoas publicassem páginas em subdomínios seus. Apague também registos A, AAAA ou CNAME antigos da raiz e do `www` que o registador tenha criado por omissão (por exemplo, uma página de estacionamento).
6. **Definir o domínio no repositório:** *Settings → Pages → Custom domain*, escreva `www.dominio.pt` e carregue em *Save*. O GitHub confirma o DNS e passa a redirecionar `dominio.pt` para `www.dominio.pt`. Em alternativa, com o GitHub CLI:

   ```bash
   gh api -X PUT repos/WakenAc/LMDreams/pages -f cname=www.dominio.pt
   ```

7. **Ativar o HTTPS:** quando o GitHub terminar de emitir o certificado (a propagação do DNS pode demorar até 24 horas), marque *Enforce HTTPS* (forçar HTTPS) na mesma página.
8. **Voltar a publicar** para reconstruir o site com o novo endereço:

   ```bash
   npm run deploy
   ```

   O endereço base muda sozinho: o passo "Configure GitHub Pages" do `deploy.yml` passa a devolver o endereço base `/` e o novo endereço do site, e o build usa-os nos canónicos, no `sitemap.xml`, no `robots.txt`, no Open Graph e nos dados estruturados. O script `npm run build:root` já prova, em cada `npm run check`, que o site funciona na raiz de um domínio.

## 8. Formulário de contacto

O GitHub Pages só serve ficheiros; não recebe dados. Por isso o formulário tem dois modos, e a lógica está em `src/lib/lead.ts`.

### Sem serviço de formulários (modo atual: por e-mail)

Enquanto não houver um serviço configurado, o formulário funciona por e-mail:

- Depois de validar os campos, mostra "Vamos abrir o seu programa de e-mail com o pedido preenchido. Só tem de o enviar." e abre o programa de e-mail do visitante com uma mensagem para `mendes3pm@gmail.com`, com o assunto "Pedido de orçamento pelo site" e o pedido já escrito no corpo.
- Se o pedido for demasiado longo para o endereço `mailto:` (cerca de 1 800 caracteres), a mensagem é encurtada e acaba com "(mensagem encurtada; indique o resto por telefone ou WhatsApp)".
- Mostra o endereço de e-mail em texto e um botão **"Copiar pedido"**, para quem não tiver um programa de e-mail configurado.
- **Nunca mostra "Recebemos o seu pedido"**: o site não sabe se o visitante chegou a enviar o e-mail. O site não envia nem guarda os dados; o pedido segue pelo serviço de e-mail do visitante até à caixa da empresa.
- O campo de fotografias não aparece; em vez dele, o formulário sugere o envio de fotografias por WhatsApp ou e-mail depois do contacto.

### Ligar um serviço de formulários

Serve qualquer serviço que aceite um `POST` a partir do navegador, por exemplo **Formspree**, **Web3Forms** (que exige uma chave de acesso, `VITE_FORM_ACCESS_KEY`), **Getform**, **Basin** ou uma API própria (tem de aceitar pedidos vindos do endereço do site, CORS).

1. Crie a conta e o formulário no serviço e copie o endereço de envio (tem de começar por `https://`). No Formspree é do tipo `https://formspree.io/f/…`; no Web3Forms é `https://api.web3forms.com/submit`, com a chave de acesso à parte.
2. No GitHub, abra *Settings → Secrets and variables → Actions*, separador *Variables* (variáveis), e crie com *New repository variable*:

   | Variável | Valor |
   |---|---|
   | `VITE_FORM_ENDPOINT` | o endereço de envio (`https://…`) |
   | `VITE_FORM_ACCEPTS_FILES` | `true` só se o serviço (e o plano) aceitar ficheiros; qualquer outro valor, ou a ausência da variável, desliga o envio de fotografias |
   | `VITE_FORM_ACCESS_KEY` | a chave de acesso, só se o serviço a exigir (Web3Forms) |

   Estas variáveis **são públicas**: ficam escritas no JavaScript do site, que qualquer visitante pode ler. Por isso configuram-se como *Variables* e **nunca como *Secrets*** (o `deploy.yml` só lê as *Variables*), e nunca se põe nelas uma palavra-passe ou uma chave privada.
3. Volte a publicar (`npm run deploy`, secção 6): as variáveis só entram no site no build.
4. Envie um pedido de teste no site publicado e confirme que chega.

Sem `VITE_FORM_ENDPOINT` (ou com um valor que não comece por `https://`), o formulário volta ao modo por e-mail.

### O que é enviado ao serviço

Um `POST` para o `VITE_FORM_ENDPOINT` com estes campos (os valores seguem sem espaços a mais; os campos opcionais vazios não seguem):

| Campo | Conteúdo | Quando segue |
|---|---|---|
| `access_key` | valor de `VITE_FORM_ACCESS_KEY` | só se a variável existir |
| `subject` | "Pedido de orçamento pelo site" | sempre |
| `name` | Nome | sempre (obrigatório) |
| `phone` | Telefone | se preenchido |
| `email` | E-mail | se preenchido |
| `location` | Localização da obra (concelho ou localidade) | sempre (obrigatório) |
| `service` | Tipo de serviço | se escolhido |
| `budget` | Orçamento previsto | se escolhido |
| `message` | Mensagem (descrição da obra) | sempre (obrigatório) |
| `attachment` | uma fotografia (um campo `attachment` por ficheiro) | só com ficheiros |

O visitante tem de indicar pelo menos um telefone ou um e-mail. A caixa "Tomei conhecimento da Política de privacidade" é obrigatória, mas não é enviada, tal como o campo-armadilha anti-spam.

- **Sem ficheiros:** corpo em JSON, com `Content-Type: application/json` e `Accept: application/json`.
- **Com ficheiros** (só com `VITE_FORM_ACCEPTS_FILES=true` e pelo menos uma fotografia escolhida): `multipart/form-data`, com os mesmos campos e um `attachment` por fotografia, e `Accept: application/json`. Até 5 fotografias JPG, PNG, WebP ou HEIC, com 10 MB no máximo cada uma.
- **Tempo limite:** 15 segundos. O pedido conta como enviado quando o serviço responde com sucesso (código 2xx) e o JSON da resposta não traz `success: false` nem `ok: false`. Só então o site mostra a mensagem de sucesso ("Obrigado. Recebemos o seu pedido e vamos entrar em contacto consigo."). Em caso de falha, erro de rede ou fim do tempo, mostra um erro com a alternativa por telefone ou WhatsApp.
- Se o campo-armadilha vier preenchido (robô), nada é enviado e o site mostra a mensagem de sucesso.

### Notas antes de escolher o serviço

- O **envio de ficheiros costuma exigir um plano pago** do serviço.
- O serviço passa a tratar dados pessoais em nome da empresa: é preciso um **contrato de subcontratação (RGPD, art. 28.º)** e, se possível, **alojamento dos dados na União Europeia**.
- Atualize a Política de privacidade com o serviço escolhido: `src/content/company.ts` → `legal.formService` e `legal.processors` (chave `fornecedores-dados`).

## 9. Imagens ilustrativas

As imagens do site ainda não são fotografias de obras da empresa. As que existem foram **geradas por IA na Higgsfield** e são **ilustrativas**: não representam obras realizadas pela LMDreams. A proveniência (modelo, prompt, identificador do trabalho, data, texto alternativo) está em `assets-src/ilustrativas/manifest.json`.

| Imagem (`id` em `images.ts`) | Onde aparece | Estado |
|---|---|---|
| `hero` | Início, em computador e tablet; imagem de partilha (`public/og-image.jpg`) | Gerada por IA: `assets-src/ilustrativas/hero.jpg` |
| `hero` (telemóvel) | Início, abaixo de 768 px | Recorte 4:5 do mesmo original: `assets-src/ilustrativas/hero-telemovel.jpg` |
| `sobre` | Sobre nós | Gerada por IA: `assets-src/ilustrativas/sobre.jpg` |
| `diferenciacao` | Diferenciação | Gerada por IA: `assets-src/ilustrativas/diferenciacao.jpg` |
| `servico-construcao`, `servico-cozinhas`, `servico-casas-de-banho`, `servico-pavimentos`, `servico-recuperacao`, `servico-exteriores` | Cartões dos seis serviços em destaque | Gerada por IA: `assets-src/ilustrativas/servico-*.jpg` |
| `transparencia` | Transparência | Gerada por IA: `assets-src/ilustrativas/transparencia.jpg` |
| `cta` | Fundo da chamada para ação | Gerada por IA: `assets-src/ilustrativas/cta.jpg` |

Existem as 11 imagens previstas, todas ilustrativas e geradas por IA. As tentativas, as recusas e as rejeições do controlo de qualidade estão registadas em `assets-src/ilustrativas/jobs.json`; os originais rejeitados ficam em `assets-src/ilustrativas/_rejeitadas/`, fora do Git. Se uma imagem for retirada (`picture: null` no `src/content/images.ts`), o site volta a mostrar no lugar dela um placeholder gerado em código ("Imagem a substituir", com a proporção certa e sem saltos de layout).

### Legenda e nota do rodapé

- Cada imagem gerada por IA que aparece no site leva a legenda visível **"Imagem ilustrativa gerada por IA"** (texto real na página, não dentro da imagem), exigida pelo Regulamento (UE) 2024/1689 (Regulamento da IA), art. 50.º. O texto está em `src/content/company.ts` → `aiImageLabel` e aparece sozinho em todas as imagens com `ilustrativa: true`.
- O rodapé mostra a nota "Algumas imagens deste site são ilustrativas, geradas por IA, e não representam obras realizadas pela LMDreams." (`src/content/footer.ts` → `aiNotice`). Só aparece enquanto houver pelo menos uma imagem de IA à vista; quando todas forem fotografias reais, desaparece sozinha.
- Imagens de IA nunca podem ser usadas nos projetos, nos testemunhos nem apresentadas como obras da empresa.

### Substituir por fotografias reais

1. Escolha a fotografia (com autorização, se mostrar a casa de um cliente ou pessoas) e recorte-a na proporção indicada em `ratio` no `src/content/images.ts` (por exemplo, 4:5 no `sobre`, 4:3 nos serviços, 3:2 na diferenciação e na transparência, 21:9 no `cta`), com o lado maior até 2560 px.
2. Copie o ficheiro para `assets-src/`, por exemplo `assets-src/fotografias/sobre.jpg`.
3. No `src/content/images.ts`, troque o import (ou acrescente um, no topo, seguindo o modelo do hero) e, na entrada da imagem, ponha o import em `picture`, atualize o `alt` e mude para `ilustrativa: false`:

   ```ts
   import sobre from '../../assets-src/fotografias/sobre.jpg?w=480;768;1032&format=avif;webp;jpg&quality=60&as=picture'

   // na entrada `sobre`:
   picture: sobre,
   ilustrativa: false,
   ```

   As larguras (`w=`) vão até ao dobro do tamanho máximo em que a imagem aparece (ver o `sizes` da entrada).
4. **No hero**, troque os dois imports (`hero` e `heroMobile`) e reveja `hotspots` e `mobileCrop`: as anotações 01 a 03 (`src/content/hero.ts`) apontam para pontos da fotografia atual. Se retirar as imagens de IA do hero, apague `hero.jpg` e `hero-telemovel.jpg` de `assets-src/ilustrativas/` e as entradas correspondentes do `manifest.json`, e corra `npm run og:image` (sem o hero de IA, a imagem de partilha passa a um fundo escuro com linhas de planta, sem legenda).
5. Corra `npm run check`.

Para acrescentar mais imagens geradas por IA: guarde-as em `assets-src/ilustrativas/`, importe-as com o prefixo `@ilustrativas/` (como o hero), mantenha `ilustrativa: true` e acrescente a entrada ao `manifest.json`.

## 10. Limitações conhecidas

- **Cache do GitHub Pages.** O GitHub Pages envia `Cache-Control: max-age=600` (10 minutos) em todos os ficheiros e não permite cabeçalhos próprios. No site publicado, o Lighthouse assinala a política de cache; é esperado e não se resolve no código. Uma alteração publicada pode demorar até 10 minutos a aparecer a quem já visitou o site.
- **`robots.txt` no endereço de projeto.** O build gera sempre o `robots.txt`, mas os motores de busca só leem o da raiz do domínio (`https://wakenac.github.io/robots.txt`, que não pertence a este repositório). Em `https://wakenac.github.io/LMDreams/` o ficheiro não produz efeito; passa a produzir com um domínio próprio. Até lá, submeta o sitemap (`https://wakenac.github.io/LMDreams/sitemap.xml`) no Google Search Console, com uma propriedade do tipo "prefixo de URL" para `https://wakenac.github.io/LMDreams/`.
- **Resultado enriquecido de empresa local.** O Google só considera o resultado enriquecido de empresa local quando os dados estruturados têm morada (`address`). O site só a inclui quando existir uma morada pública autorizada pela empresa (`src/content/company.ts` → `publicAddress`, chave `morada-publica`), nunca a da sede legal por arrasto. Até lá, esse resultado não aparece.
- **E-mail Gmail.** O e-mail de contacto (`mendes3pm@gmail.com`) é uma conta Gmail pessoal; no modo por e-mail, os pedidos chegam por essa conta (serviço da Google). Para tratar pedidos de clientes, convém um e-mail profissional com contrato de subcontratação (RGPD, art. 28.º). É uma decisão da empresa: os contactos do site só mudam com essa decisão.
- **Termos do GitHub Pages.** Os termos do GitHub Pages dizem que o serviço:

  > "is not intended for or allowed to be used as a free web-hosting service to run your online business, e-commerce site, or any other website that is primarily directed at either facilitating commercial transactions or providing commercial software as a service (SaaS)"

  (Fonte: documentação do GitHub Pages, página “GitHub Pages limits”, consultada em setembro de 2026.) Em português: o GitHub Pages não se destina nem pode ser usado como alojamento gratuito para gerir um negócio online, uma loja online ou qualquer site cujo objetivo principal seja facilitar transações comerciais ou fornecer software comercial como serviço (SaaS). Um site de apresentação sem vendas nem transações é, em princípio, aceitável, mas a decisão é do GitHub. **Alternativa:** um alojamento de sites estáticos na União Europeia, que sirva a pasta gerada pelo build (incluindo a `404.html` para páginas inexistentes). Mudar de alojamento implica um script de build com o endereço definitivo (como o `build:root`, mas com o domínio real) e um novo processo de publicação.
