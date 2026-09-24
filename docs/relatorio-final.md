# Relatório final: website institucional LMDreams

## Estado

| Fase | Estado | Notas |
|---|---|---|
| Fase 0: Reconhecimento e pré-voo | em curso | Pré-voo feito; a aguardar as respostas do Andre (créditos, GitHub Pages, logótipo). |
| Fase 1: Direção visual | pendente | |
| Fase 2: Fundações e conteúdos | pendente | |
| Fase 3: Imagens | pendente | |
| Fase 4: Secções e páginas | pendente | |
| Fase 5: Integração e revisão editorial | pendente | |
| Fase 6: Verificação adversarial | pendente | |
| Fase 7: Documentação | pendente | |
| Fase 8: Entrega | pendente | |

Última atualização: 25 de setembro de 2026.

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
| Sistema operativo | Windows 11 | Todos os scripts do projeto serão Node/TypeScript (nunca bash). |

### GitHub Pages

- `gh api repos/WakenAc/LMDreams/pages` → 404 (Pages ainda não ativo).
- `gh api user --jq .plan.name` → vazio (o token não tem o âmbito `read:user`).
- Repositório privado com plano desconhecido: ponto de paragem 3 (não bloqueia).

### Logótipo

- `logo-lmdreams.png`: PNG RGBA de 352×188 px, **sem transparência** (fundo sólido carvão `#292928`), grafismo de uma só cor amarelo-lima `#D1CF20` (casa com chaminé e janela), sem texto.
- A parte gráfica ocupa cerca de 241×129 px: abaixo dos 1000 px de largura e dos 512 px de lado pedidos na Parte 4.9. Utilizável mas com pouca qualidade: ponto de paragem 4 (não bloqueia; segue-se com o ficheiro existente).

### Higgsfield

- Ferramentas disponíveis na sessão. Saldo inicial: **255,5 créditos** (plano `starter`). Sem gerações gratuitas de teste (`unlim.available: false`).
- Modelos confirmados com `models_explore`: `gpt_image_2_5` (qualidade `low` por omissão; `high` e `2k` definidos explicitamente; papel de referência `image_references`) e `nano_banana_pro` (2k por omissão; papel `image_references`). Ambos aceitam 16:9, 4:5, 3:2, 4:3 e 21:9.
- Custos estimados com `get_cost: true` (sem gastar créditos): `gpt_image_2_5` high 2k = 2,75 créditos por imagem em todas as proporções; `nano_banana_pro` 2k = 2 créditos por imagem.

### Permissões

- `.claude/settings.local.json` criado (ignorado pelo Git) com as listas `allow` e `deny` da Parte 2.2, usando o prefixo real das ferramentas da Higgsfield (`mcp__520133ef-7fea-484c-bef3-fbdb543fc4ad__…`). A lista `deny` inclui também as restantes ferramentas de vídeo, áudio e 3D da Higgsfield (Parte 4.1).

## Resumo

(a preencher na Fase 8)

## O que foi feito por fase

(a preencher)

## Decisões e desvios ao brief

| Decisão | Motivo |
|---|---|
| Commit inicial em `main` com `.gitignore` e `README.md` | Repositório vazio; exceção prevista na Parte 1.4, regra 8, e na Parte 2.2. |
| `.gitattributes` com `eol=lf` | Evitar diferenças de fins de linha entre o Windows e o CI em Linux. |

## Resultados dos gates

(a preencher nas Fases 6 e 8)

## Imagens geradas

(a preencher na Fase 3)

## Conteúdos a substituir

(a preencher a partir de `CONTEUDO-A-SUBSTITUIR.md`)

## Comandos não executados de propósito

(a preencher na Fase 7)

## Ficheiros existentes que foram substituídos ou removidos

- Nenhum. `images.jpg` (cópia em JPEG do logótipo) ficou na pasta local, fora do Git.

## Pendentes

(a preencher, se a PR for rascunho)

## Próximos passos para o Andre

(a preencher na Fase 8)
