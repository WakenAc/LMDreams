# Teste: ligação do site a uma folha de cálculo (Google Apps Script)

O teste confirma, antes de construirmos os formulários, que:

1. o site consegue enviar dados para a folha e ler a resposta;
2. cada envio grava exatamente uma linha;
3. um texto começado por "=" fica gravado como texto, e não como fórmula;
4. o site sabe quando o script dá erro;
5. funcionam as peças da proteção contra spam.

Usa só dados fictícios e a tua conta Gmail pessoal. Demora cerca de 10 minutos do teu lado.

O Google pode mostrar os menus em português de Portugal, do Brasil ou em inglês, conforme a conta. Nos passos, os nomes aparecem assim: português de Portugal / português do Brasil / inglês.

**Se tiveres várias contas Google abertas no navegador**, faz o teste numa janela anónima (ou noutro perfil do navegador) com só a tua conta pessoal. O Apps Script costuma falhar na autorização com várias contas abertas.

## 1. Criar a folha

1. Em [sheets.google.com](https://sheets.google.com), cria uma folha em branco.
2. Dá-lhe um nome, por exemplo "LMDreams teste formularios".

## 2. Colar o script

1. Na folha, abre *Extensões → Apps Script* (*Extensions → Apps Script*). Abre-se o editor num separador novo.
2. Muda o nome do projeto (no topo, "Projeto sem título") para "LMDreams teste".
3. No ficheiro `Código.gs`, apaga tudo o que lá estiver e cola o conteúdo de [`Codigo.gs`](Codigo.gs).
4. Guarda (ícone da disquete, ou Ctrl+S).

## 3. Autorizar e preparar a folha

1. Na barra de cima do editor, escolhe a função `prepararFolha` e carrega em *Executar* (*Run*).
2. Aparece "Autorização necessária": carrega em *Rever autorizações* / *Revisar permissões* (*Review permissions*) e escolhe a tua conta.
3. Aparece o aviso de que a Google não validou a app. É normal num script teu: carrega em *Avançadas* / *Avançado* (*Advanced*) e depois em *Aceder a LMDreams teste (não seguro)* / *Acessar LMDreams teste (não seguro)* (*Go to LMDreams teste (unsafe)*).
4. Confirma a autorização pedida: ver e editar só a folha de cálculo onde o script está instalado (o script tem a indicação `@OnlyCurrentDoc`).
5. No registo de execução deve aparecer "Separadores prontos.". Na folha, aparecem os separadores "Testes" e "Testes-formulas".

## 4. Publicar como aplicação Web

1. No editor, no canto superior direito, carrega em *Implementar → Nova implementação* / *Implantar → Nova implantação* (*Deploy → New deployment*).
2. Na roda dentada ao lado de "Selecionar tipo" (*Select type*), escolhe *Aplicação Web* / *App da Web* (*Web app*).
3. Preenche:
   - **Descrição** (*Description*): teste
   - **Executar como** (*Execute as*): Eu, com o teu e-mail (*Me*)
   - **Quem tem acesso** / **Quem pode acessar** (*Who has access*): **Qualquer pessoa** (*Anyone*). Atenção: não escolhas "Qualquer pessoa com Conta Google" (*Anyone with Google account*), senão os testes falham.
4. Carrega em *Implementar* / *Implantar* (*Deploy*). Se o Google voltar a pedir autorização, repete o passo 3.
5. Copia o **URL da aplicação Web** (*Web app URL*). Começa por `https://script.google.com/macros/s/` e termina em `/exec`.

## 5. Enviar-me o URL

Cola o URL na conversa. Eu corro os testes daqui:

```bash
node docs/formularios/teste-apps-script/correr-testes.mjs https://script.google.com/macros/s/…/exec
```

Durante o teste vão aparecer linhas fictícias nos separadores "Testes" e "Testes-formulas".

**Não carregues em "Permitir acesso"** se a folha mostrar esse aviso no separador "Testes-formulas". É de propósito: uma das linhas tenta uma fórmula `IMPORTXML`, para provar que a proteção funciona.

## 6. Depois do teste

1. No editor, abre *Implementar → Gerir implementações* / *Implantar → Gerenciar implantações* (*Deploy → Manage deployments*), escolhe a implementação "teste" e carrega em *Arquivar* (*Archive*). A seguir, eu confirmo que o endereço deixou de responder.
2. Podes apagar a folha, ou guardá-la para a fase seguinte. Nesse caso, eu substituo o script pelo dos formulários.

## Se eu te enviar uma versão nova do script

Depois de colares o código novo e guardares, o endereço continua a correr a versão antiga até atualizares a implementação: *Implementar → Gerir implementações*, ícone do lápis (*Edit*), em **Versão** escolhe *Nova versão* (*New version*) e carrega em *Implementar*. O endereço mantém-se.

## Notas

- Enquanto estiver publicado, o endereço é público. O script de teste nunca grava mais de 300 linhas, não envia e-mails e não lê mais nada da tua conta.
- O script só tem acesso a esta folha (indicação `@OnlyCurrentDoc` no início do código). Não mexe nos teus outros ficheiros.
