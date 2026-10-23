# Formulários do site

Dois formulários gravam diretamente numa folha de cálculo do Google Sheets, sem servidor próprio:

| Formulário | Página | Separador da folha | Conservação |
|---|---|---|---|
| Pedido de orçamento | `index.html`, secção `#contactos` | Orçamentos | 12 meses |
| Candidatura | `trabalhe-connosco/index.html` | Candidaturas | 12 meses |
| (envios suspeitos de spam) | | Suspeitos | 30 dias |

## Como funciona

1. `assets/js/formularios.js` valida os campos no navegador e envia-os, por `fetch`, para uma aplicação Web do Google Apps Script (`const ENDPOINT`).
2. O script ([`apps-script/Codigo.gs`](apps-script/Codigo.gs)) volta a validar, protege contra spam, grava a linha no separador certo e envia aos destinatários definidos nas propriedades do script um aviso por e-mail, sem os dados do pedido (só a ligação para a folha).
3. O site mostra "Recebemos o seu pedido" só quando o script responde `{"ok": true}`. Em qualquer falha, mostra o telefone e o e-mail.

Instalação e manutenção do script: [`apps-script/GUIA.md`](apps-script/GUIA.md).

### Regras técnicas confirmadas no teste de 23 de outubro de 2026

O kit do teste está em [`teste-apps-script/`](teste-apps-script/).

- **Envio "simples":** corpo `URLSearchParams` (ou `FormData`, ou texto com JSON) e nenhum cabeçalho próprio. Com `Content-Type: application/json`, o navegador faz uma verificação prévia (OPTIONS) que o Apps Script não suporta, e o envio falha.
- **Respostas:** o Apps Script responde com um redirecionamento 302 para `script.googleusercontent.com`. As duas respostas trazem `Access-Control-Allow-Origin: *`, e o site lê o JSON.
- **Erros:** um erro não tratado no script não chega ao site, que só vê a falha do envio. Por isso o script trata todos os erros e responde sempre em JSON.
- **Linhas:** cada envio grava exatamente uma linha.
- **Fórmulas:** um texto começado por "=" é gravado como fórmula (`=HYPERLINK`, `=IMPORTXML`). Um apóstrofo no início neutraliza-o; o formato "texto" da coluna não neutraliza. Os números com "+", como "+351…", ficam como texto.
- **Peças da proteção:** as expressões por alfabeto (`\p{Script=…}`) e a assinatura HMAC-SHA256 funcionam no Apps Script.
- **Tempos:** cerca de 0,8 s por pedido; o primeiro, com o script a arrancar, chega aos 5 s.
- **Endereço arquivado:** responde 404.

## Proteção contra spam

O Apps Script **não vê o endereço IP nem a origem dos pedidos**, e o endereço do script é público, porque está no código do site. Nenhuma medida trava todo o spam. O objetivo é outro: os robôs genéricos não chegam aos separadores limpos nem ao e-mail, um ataque não enche a folha, e nenhum pedido verdadeiro se perde.

### Camadas ativas (no `Codigo.gs`)

| | Camada | O que faz |
|---|---|---|
| A | Gravação segura | Todo o texto vindo do formulário é gravado com um apóstrofo no início, que o Google Sheets esconde: fica sempre como texto, nunca como fórmula, número ou data. |
| B | Campo-armadilha | `campo_k7x`, escondido fora do ecrã. Se vier preenchido, nada é gravado e a resposta é de sucesso. |
| C | Validação estrita | Só campos conhecidos; tamanhos; telefone e e-mail; opções só das `LISTAS`; corpo até 20 KB. |
| D | Pontuação | Ligações explícitas (+3), domínio solto no texto (+2), HTML (+5), palavras de spam (+2), alfabeto não latino (+3 no orçamento, +1 na candidatura), tudo em maiúsculas (+1), ligação no nome (+3), números no nome (+1), telefone estrangeiro (+1), sem tempo de preenchimento (+3), preenchido em menos de 4 s (+2). Com 3 pontos ou mais, o envio vai para "Suspeitos", sem e-mail, e o visitante vê a mensagem de sucesso. |
| E | Repetidos e picos | O mesmo envio em 30 minutos é ignorado (a marca só fica depois de a linha estar gravada). Mais de 5 pedidos limpos por hora ou 20 por dia: os seguintes vão para "Suspeitos", com um alerta. Mais de 150 gravações por dia: o script deixa de gravar até ao dia seguinte. Os contadores do dia ficam nas propriedades do script, porque a cache do Google só guarda valores durante 6 horas. |
| F | Avisos por e-mail | Só para `DESTINATARIOS`, só para pedidos limpos e sem os dados do pedido. Um erro no envio do e-mail não muda a resposta ao site. Nunca há confirmação automática para o e-mail escrito pelo visitante, que podia ser usada para enviar spam a terceiros. |
| G | Controlo | `FORMULARIOS_ATIVOS = nao` desliga tudo; limpeza diária pelos prazos da Política de privacidade; o site mostra sempre o telefone e o e-mail quando o envio falha. |

Os limites (5 por hora, 20 por dia, 150 por dia, 3 pontos) são escolhas iniciais, a acertar depois de algumas semanas de uso.

### Se passar spam (por ordem)

1. **Senha assinada pelo script:** quando a pessoa começa a preencher, o site pede ao script uma senha com a hora, assinada com HMAC. O envio sem senha válida, demasiado rápido ou repetido vai para "Suspeitos". Trava os robôs que enviam diretamente para o endereço sem abrir a página.
2. **ALTCHA alojado no site** (código aberto, MIT, BAU Software, Chéquia): um desafio de alguns segundos de cálculo no navegador, verificado no script, sem cookies nem terceiros. Exige uma exceção no `scripts/verificar.cjs`, porque o código do widget tem ligações no texto.
3. **Mudar o endereço do script** (só em emergência): ver `apps-script/GUIA.md`.
4. **Intermediário europeu com limites por endereço IP** (por exemplo, Scaleway Serverless Functions, França): esconde o endereço do script e limita os envios por IP. É um subcontratante novo, que tem de entrar na Política de privacidade.
5. **Friendly Captcha** (Alemanha), em último caso: pago e carrega recursos de terceiros, o que muda a Política de cookies.

Ficam de fora o Google reCAPTCHA, o hCaptcha e o Cloudflare Turnstile. São americanos, correm no navegador do visitante e reaproveitam dados para fins próprios, o que obriga a pedir consentimento.

## Pendentes

- **Acordo de subcontratação:** um acordo entre o Andre e a LMDreams, enquanto a folha estiver na conta pessoal dele (RGPD, art. 28.º).
- **Conta da empresa:** passar para uma conta Google Workspace da empresa, que tem contrato de subcontratação com a Google. Os passos estão em `apps-script/GUIA.md`, secção "Mudar de conta".
