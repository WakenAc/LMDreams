# LMDreams Construções Lda — Website institucional

Website institucional multi-página em **Astro (static output)** para apresentação da empresa, serviços, processo de trabalho, projetos e contactos.

## Objetivo do projeto

- apresentar a LMDreams com comunicação clara e credível
- explicar o modelo de especialização por área
- permitir pedido de contacto/orçamento
- manter política editorial honesta (sem projetos/testemunhos/factos inventados)

## Stack técnico

- Astro (estático)
- TypeScript (strict)
- CSS nativo com design tokens
- Playwright (E2E + a11y com axe)
- GitHub Actions (validação e deploy Pages)

## Pré-requisitos

- Node.js `>=20 <25`
- npm `>=10`

## Instalação

```bash
npm ci
```

## Desenvolvimento local

```bash
npm run dev
```

## Type checking

```bash
npm run check
```

## Testes

```bash
npm run test:unit
npm run test:e2e
npm run test:a11y
npm run test:links
```

> Instalar browsers Playwright antes dos testes E2E/a11y:
>
> ```bash
> npx playwright install
> ```

## Build de produção

```bash
npm run build
```

## Preview local do build

```bash
npm run preview
```

## Rotas públicas

- `/`
- `/empresa/`
- `/servicos/`
- `/projetos/`
- `/contactos/`
- `/privacidade/`
- `/404.html`

Arquitetura preparada para:

- `/servicos/[slug]/`
- `/projetos/[slug]/`

## Configuração central (GitHub Pages e URLs)

Ficheiro: `site.config.mjs`

Variáveis:

- `SITE_URL` (URL pública)
- `BASE_PATH` (subcaminho, ex.: `/LMDreams`)
- `PAGES_MODE` (`project` ou `custom-domain`)
- `CUSTOM_DOMAIN` (quando existir)
- `CONTACT_FORM_ENDPOINT` (endpoint de submissão do formulário)

## Deploy para GitHub Pages

- **Validação:** `.github/workflows/validate.yml`
- **Deploy:** `.github/workflows/deploy-pages.yml`

Passos:

1. fazer push para `main`
2. confirmar que Pages está configurado para GitHub Actions
3. aguardar workflow `Deploy Pages`
4. validar páginas publicadas e links internos

## Project Pages vs domínio personalizado

### Project Pages

Exemplo: `https://username.github.io/repository-name/`

Configuração típica:

```bash
SITE_URL=https://username.github.io/repository-name
BASE_PATH=/repository-name
PAGES_MODE=project
```

### Domínio personalizado (futuro)

Exemplo: `https://dominio-confirmado.pt/`

```bash
SITE_URL=https://dominio-confirmado.pt
BASE_PATH=/
PAGES_MODE=custom-domain
CUSTOM_DOMAIN=dominio-confirmado.pt
```

> Só criar `public/CNAME` quando o domínio real estiver confirmado.

## Como substituir o logótipo

1. substituir `public/brand/lmdreams-logo.png`
2. manter dimensões proporcionais e boa legibilidade
3. atualizar `docs/design/asset-provenance.md`

## Como atualizar informação da empresa

Editar:

- `src/data/company.ts`
- `src/data/navigation.ts`

## Como adicionar/editar um serviço

Editar `src/data/services.ts`:

1. adicionar entrada com `title`, `slug`, `summary`, `description`, `benefits`, `icon`
2. manter flags de rascunho até aprovação formal

## Como adicionar um projeto real

Criar/editar entrada em `src/content/projects/*.md` com:

- `published: true`
- `authorizedForPublication: true`
- imagens com `authorizedForPublication: true`
- pelo menos uma imagem com `assetType` real (`real-project-photo` ou `company-photo`)

## Como registar proveniência de ativos

Atualizar `docs/design/asset-provenance.md` para cada novo asset:

- ficheiro
- fonte
- autor/gerador
- licença/permissão
- data
- uso
- tipo (real/stock/illustrative/generated/placeholder)
- elegibilidade para portefólio real

## Configuração do formulário de contacto

Definir variável:

```bash
CONTACT_FORM_ENDPOINT=https://<endpoint-real>
```

Sem endpoint configurado, o site entra em modo seguro e não envia submissões.

## Como evitar publicação de placeholders

Checklist mínima antes de lançamento:

- substituir placeholders de telefone/email/área de atuação
- validar lista final de serviços
- adicionar apenas projetos reais autorizados
- rever metadados e textos legais

## Como verificar o site publicado

1. abrir homepage e navegar por todas as rotas principais
2. validar menu mobile e teclado
3. testar formulário (incluindo estados de erro/sucesso)
4. confirmar ausência de links quebrados e imagens em falta
5. correr validações automáticas

## Instruções de teste manual

- navegação por teclado completa
- visibilidade de foco
- leitura com zoom 200%
- teste de `prefers-reduced-motion`
- validação de contraste de cor
- verificação do menu mobile
- verificação do formulário de contacto

## Dependência de Higgsfield

Este website **não tem dependência runtime de Higgsfield**.
