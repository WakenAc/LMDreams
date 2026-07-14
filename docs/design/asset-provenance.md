# Proveniência de ativos

## Registo de ativos não originais

| Ficheiro | Fonte | Autor/Gerador | Licença/Permissão | Data de adição | Uso previsto | Tipo de ativo | Pode aparecer no portefólio real? |
|---|---|---|---|---|---|---|---|
| `public/brand/lmdreams-logo.png` | Ficheiro fornecido pelo cliente (anexo da sessão) | LMDreams (fornecido pelo cliente) | Uso permitido pelo cliente para este website | 2026-07-14 | Branding institucional (header/footer) | real/company brand | Não (não é fotografia de obra) |
| `public/illustrative/hero-grid.svg` | Recurso local do projeto | Equipa de desenvolvimento | SVG criado para suporte visual do layout | Pré-existente no repositório | Imagem ilustrativa do hero | illustrative | Não |
| `public/illustrative/project-placeholder.svg` | Recurso local do projeto | Equipa de desenvolvimento | SVG criado para estado vazio | Pré-existente no repositório | Estado vazio de projetos | placeholder | Não |
| `public/social/og-default.svg` | Recurso local do projeto | Equipa de desenvolvimento | SVG criado para partilha social | Pré-existente no repositório | Imagem OG padrão | illustrative | Não |
| `public/favicon.svg` | Recurso local do projeto | Equipa de desenvolvimento | Ícone técnico local | Pré-existente no repositório | Favicon temporário | illustrative | Não |

## Taxonomia obrigatória

Todos os ativos visuais de projetos devem indicar o tipo:

- `real-project-photo`
- `company-photo`
- `stock-photo`
- `generated-image`
- `illustrative-image`
- `placeholder`

## Regra de publicação do portefólio

Só podem ser apresentados em `/projetos/` itens com:

1. `published: true`
2. `authorizedForPublication: true`
3. imagens com `authorizedForPublication: true`
4. pelo menos uma imagem com `assetType` real (`real-project-photo` ou `company-photo`)

Imagens stock, geradas, ilustrativas ou placeholders nunca podem ser apresentadas como prova de obra real.
