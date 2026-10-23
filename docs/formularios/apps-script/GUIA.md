# Formulários do site: instalar e manter o Google Apps Script

Os dois formulários do site, o pedido de orçamento em `#contactos` e a candidatura em `trabalhe-connosco/`, gravam cada envio numa folha de cálculo do Google Sheets. O site envia os dados para uma aplicação Web do Google Apps Script ([`Codigo.gs`](Codigo.gs)), que os valida, os protege contra spam, os grava e envia um aviso por e-mail.

Por enquanto, a folha e o script ficam na conta Google pessoal do Andre, que os mantém por conta da empresa (subcontratante, RGPD, art. 28.º). Quando a empresa tiver uma conta Google Workspace, basta repetir esta instalação nessa conta e trocar o endereço no site (secção "Mudar de conta").

O Google pode mostrar os menus em português de Portugal, do Brasil ou em inglês. Nos passos, os nomes aparecem assim: português de Portugal / português do Brasil / inglês. Se tiveres várias contas Google abertas no navegador, faz a instalação numa janela anónima, só com a conta certa.

## 1. Folha de cálculo

1. Cria uma folha nova, por exemplo "LMDreams formularios". Também podes reaproveitar a folha do teste, apagando os separadores "Testes" e "Testes-formulas".
2. Em *Ficheiro → Definições* (*File → Settings*), confirma que o fuso horário é **(GMT+00:00) Lisboa**: é o das datas gravadas.
3. Partilha a folha com o e-mail da empresa (`mendes3pm@gmail.com`, como leitor ou editor) e só com pessoas indicadas pelo nome, nunca com "qualquer pessoa com o link". Os avisos por e-mail não têm os dados do pedido, só a ligação para a folha: sem esta partilha, a empresa não consegue abri-la. Em *Partilhar → Definições*, desmarca "Os editores podem alterar as autorizações e partilhar".

## 2. Script

1. Na folha, abre *Extensões → Apps Script* (*Extensions → Apps Script*).
2. Muda o nome do projeto para "LMDreams formularios".
3. Apaga o conteúdo de `Código.gs`, cola o conteúdo de [`Codigo.gs`](Codigo.gs) e guarda.
4. Em *Definições do projeto* (*Project Settings*, ícone da roda dentada), na secção *Propriedades do script* (*Script properties*), carrega em *Adicionar propriedade do script* e cria:

   | Propriedade | Valor |
   |---|---|
   | `DESTINATARIOS` | `mendes3pm@gmail.com` (os avisos de pedidos novos; vários e-mails separados por vírgulas) |
   | `FORMULARIOS_ATIVOS` | `sim` (pôr `nao` desliga os formulários sem mexer no site) |

   O script cria sozinho propriedades `CONTA_LIMPOS_…` e `CONTA_GRAVACOES_…` (os contadores de cada dia, para os limites) e apaga as dos dias anteriores na limpeza diária. Não é preciso mexer nelas.

## 3. Autorizar, preparar e instalar a limpeza

1. No editor, escolhe a função `prepararFolha` e carrega em *Executar* (*Run*).
2. Autoriza: *Rever autorizações* (*Review permissions*) → a tua conta → *Avançadas* (*Advanced*) → *Aceder a LMDreams formularios (não seguro)* (*Go to … (unsafe)*). É normal num script teu. O script pede três autorizações: editar só esta folha (`@OnlyCurrentDoc`), enviar e-mails em teu nome (os avisos) e correr automaticamente (a limpeza diária).
3. Na folha aparecem os separadores "Orçamentos", "Candidaturas" e "Suspeitos".
4. Escolhe a função `instalarLimpeza` e carrega em *Executar*. Fica instalada a limpeza diária, por volta das 3h00: apaga os orçamentos e as candidaturas com mais de 12 meses e os suspeitos com mais de 30 dias, como diz a Política de privacidade.

## 4. Publicar como aplicação Web

1. *Implementar → Nova implementação* / *Implantar → Nova implantação* (*Deploy → New deployment*).
2. Na roda dentada de "Selecionar tipo", escolhe *Aplicação Web* / *App da Web* (*Web app*).
3. Preenche:
   - **Descrição:** formularios do site
   - **Executar como:** Eu (*Me*)
   - **Quem tem acesso:** **Qualquer pessoa** (*Anyone*), e não "Qualquer pessoa com Conta Google".
4. Carrega em *Implementar* e copia o **URL da aplicação Web** (termina em `/exec`).
5. Envia o URL ao Claude Code, ou põe-no tu em `assets/js/formularios.js`, na linha `const ENDPOINT = '…'`, num ramo com PR. O `scripts/verificar.cjs` não deixa publicar o site sem ele.

## 5. Testar no site publicado

1. Envia um pedido de orçamento e uma candidatura com dados de teste, cada um com uma mensagem de 10 caracteres ou mais e sem ligações.
2. Confirma que chegam aos separadores "Orçamentos" e "Candidaturas" e que o aviso chega ao e-mail de `DESTINATARIOS`.
3. Apaga as duas linhas de teste.

## Uso diário

- **Pedidos novos:** chegam aos separadores "Orçamentos" e "Candidaturas", com um aviso por e-mail que só diz que chegou um pedido novo e traz a ligação para a folha (sem os dados, que ficam só na folha e se apagam nos prazos da Política de privacidade). A coluna "Estado" é livre, para a empresa anotar o seguimento.
- **Suspeitos, uma vez por semana:** o separador "Suspeitos" guarda os envios que a verificação automática considerou spam (com os motivos), sem aviso por e-mail. Se lá estiver um pedido verdadeiro, copia-o para o separador certo. Os suspeitos apagam-se sozinhos ao fim de 30 dias.
- **Alertas:** se houver um pico de envios (mais de 5 pedidos limpos numa hora ou 20 num dia), os seguintes vão para "Suspeitos" e chega um e-mail de alerta. Acima de 150 envios num dia, o script deixa de gravar até ao dia seguinte e o site mostra o telefone e o e-mail.
- **Histórico de versões, uma vez por mês:** o Google guarda versões antigas da folha, com as linhas já apagadas. Em *Ficheiro → Histórico de versões → Ver histórico de versões*, apaga as versões antigas que não tenham nome. A Política de privacidade diz que estas cópias são apagadas uma vez por mês.

## Se houver um ataque de spam

1. **Desligar já:** em *Definições do projeto → Propriedades do script*, muda `FORMULARIOS_ATIVOS` para `nao`. O site passa a mostrar o erro com o telefone e o e-mail.
2. **Mudar o endereço:** cria uma *Nova implementação* (novo URL), põe o URL novo em `assets/js/formularios.js` (PR) e, depois de publicado, arquiva a implementação antiga em *Gerir implementações*. Testado a 23 de outubro de 2026: um endereço arquivado responde 404.
3. Se os ataques se repetirem, há mais camadas possíveis (senha assinada, desafio ALTCHA alojado no site, intermediário europeu com limites por endereço IP): ver `docs/formularios/README.md`.

## Mudar o script

Depois de colares o código novo e guardares, o endereço continua a correr a versão antiga até atualizares a implementação: *Implementar → Gerir implementações*, ícone do lápis (*Edit*), em **Versão** escolhe *Nova versão* (*New version*) e carrega em *Implementar*. O endereço mantém-se.

As listas de opções (tipo de serviço, início, profissão, experiência, disponibilidade) estão em `LISTAS`, no início do script, e têm de ser iguais às dos formulários do site: o `scripts/verificar.cjs` compara-as e bloqueia a publicação se forem diferentes.

## Mudar de conta (por exemplo, para o Google Workspace da empresa)

1. Repete os passos 1 a 4 na conta nova.
2. Copia para a folha nova os pedidos que ainda estejam dentro dos prazos.
3. Põe o URL novo em `assets/js/formularios.js` (PR) e, depois de publicado, arquiva a implementação antiga e apaga a folha antiga.
4. Atualiza a Política de privacidade (secção 06, "Destinatários e subcontratantes"), que hoje refere o prestador técnico do site.
