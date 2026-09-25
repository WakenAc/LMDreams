# LMDreams — regras do projeto

- Site institucional estático (React + Vite + TypeScript + Tailwind CSS v4), publicado no GitHub Pages
  (https://wakenac.github.io/LMDreams/, base /LMDreams/). Especificação original: BRIEF-LMDREAMS.md
  (longo: ler por blocos).
- Todo o texto visível em português de Portugal (AO90). Tom profissional, confiante, próximo, claro, honesto,
  direto e credível; sem exageros publicitários, promessas impossíveis ou linguagem excessivamente técnica
  (guia: Parte 5.5 do BRIEF-LMDREAMS.md).
- Textos e dados editáveis em src/content/. Nunca inventar dados da empresa: usar PH(chave, descrição)
  → [A CONFIRMAR: …] e correr `npm run check:placeholders` (atualiza CONTEUDO-A-SUBSTITUIR.md).
- Experiência: "mais de 30 anos" dos profissionais (src/content/company.ts). Contactos reais: +351 919 233 372
  (chamada para a rede móvel nacional), mendes3pm@gmail.com.
- Imagens geradas com IA são ilustrativas, com legenda "Imagem ilustrativa gerada por IA"; nunca no
  portefólio nem apresentadas como obras. Proveniência em assets-src/ilustrativas/manifest.json.
- Higgsfield só como estúdio de imagem; nunca usar o construtor de websites da Higgsfield.
- Sem dependências externas em runtime: fontes autoalojadas; sem analytics, cookies, localStorage, sessionStorage
  nem recursos de terceiros. Se algum for adicionado, atualizar a Política de cookies e pedir consentimento prévio
  quando não for estritamente necessário.
- Conformidade (não remover): bloco "Informação legal", Livro de Reclamações Eletrónico e informação RAL no rodapé;
  "(chamada para a rede móvel nacional)" junto ao número (ajustar se o tipo de número mudar); legenda
  "Imagem ilustrativa gerada por IA" em cada imagem de IA; aviso RGPD junto ao botão do formulário;
  deploy bloqueado enquanto faltarem dados legais (check:placeholders --strict).
- Variáveis de build só através dos scripts npm (build:pages, build:root); nunca na linha de comandos.
- Antes de dar uma alteração por concluída: `npm run check`.
- Git: trabalhar em branches e abrir PR; nunca push direto para main.
