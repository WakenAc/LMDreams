# Recrutamento: plano para chegar a quem procura trabalho

Pesquisa de 23 de outubro de 2026, com contraprova das fontes oficiais. A empresa tem obras marcadas até março de 2027 e precisa de mais mão de obra.

## Factos confirmados

- **Google for Jobs:** a pesquisa de emprego do Google está disponível em Portugal ([documentação do Google](https://developers.google.com/search/docs/appearance/structured-data/job-posting), atualizada a 8 de setembro de 2026). No dia 23 de outubro, a caixa "Empregos" apareceu em pesquisas como "emprego pedreiro seixal", "vagas construção civil lisboa", "trabalho servente obras barreiro" e "emprego pintor construção civil almada".
- **Quem aparece nessa caixa:** sobretudo o Net-Empregos, e também a OLX, a Indeed, o Braços, o Jooble, o IEFP e outros. Os anúncios destes portais trazem dados estruturados `JobPosting`.
- **Regras do Google para uma vaga entrar na caixa:**
  - só para ofertas reais e abertas;
  - **uma vaga por página**: uma página com várias vagas não pode ter os dados;
  - os dados têm de corresponder ao texto visível, e a página tem de ter forma de se candidatar;
  - a remuneração, se for indicada, tem de ser o valor real do empregador;
  - o local é onde a pessoa se apresenta para trabalhar (as obras), e não o escritório;
  - cada vaga sai do site logo que for preenchida.
- **Campos obrigatórios:** título, descrição completa (funções, requisitos, horário, experiência), data de publicação, empresa e local de trabalho (com o país). `validThrough` é obrigatório quando a vaga tem data de fim.
- **API de indexação do Google:** aceita páginas com `JobPosting` e serve para pedir ao Google que as visite mais cedo. É gratuita (200 pedidos por dia), mas precisa de uma conta de serviço no Google Cloud adicionada como proprietária no Search Console.
- **Páginas por localidade** (por exemplo `/emprego-pedreiro-seixal/`) são *doorway pages* para o Google e são proibidas. As localidades reais entram dentro de cada vaga.
- **Palavras que os candidatos usam** (Net-Empregos, Google e Google Trends, distritos de Lisboa e Setúbal): "pedreiro" (e "oficial de pedreiro"), muito mais do que "trolha", que é sobretudo do Norte; "servente", "servente de obras", "ajudante de obra" e "ajudante de pedreiro"; "pintor de construção civil", porque "pintor" sozinho dá sobretudo pintura automóvel e industrial; e "Margem Sul", mais do que "península de Setúbal".

## O que já está no site

- **Página `trabalhe-connosco/`**: título "Emprego na construção civil no Seixal e Margem Sul", título principal com as localidades, lista das vagas abertas e o formulário de candidatura, o mesmo para todas as vagas e para candidaturas espontâneas. Não tem dados `JobPosting`, porque é uma página de lista.
- **Uma página por vaga aberta**, com dados `JobPosting`, em `trabalhe-connosco/<vaga>/`. A 27 de outubro de 2026, só `pedreiro/`: as vagas de servente (26 de outubro) e de pintor/a (27 de outubro) foram preenchidas e retiradas. O botão "Candidatar-me a esta vaga" abre o formulário com a profissão já escolhida (`?vaga=pedreiro#candidatura`).
- **Ligações para as vagas:** cabeçalho ("Estamos a recrutar" nos ecrãs largos e "Vagas" no telemóvel), menu, secção "Estamos a recrutar" na página inicial (com uma ligação para cada vaga), perguntas frequentes, Contactos, rodapé e páginas das obras.
- **Search Console:** a página `trabalhe-connosco/` já está indexada (verificado a 23 de outubro).

## Abrir, mudar ou fechar uma vaga

As páginas das vagas são geradas por `scripts/gerar-vagas.cjs`, a partir da lista `VAGAS` e das condições comuns `COMUM` no início do script. O script também escreve as frases que falam das vagas na página inicial (secção Estamos a recrutar, pergunta Estão a contratar? e Contactos), em `trabalhe-connosco/` (descrição, primeiro parágrafo e lista) e os textos dos anúncios em [`anuncios.md`](anuncios.md), entre os comentários `<!-- vagas:<nome>:inicio -->` e `<!-- vagas:<nome>:fim -->`. Não edites esse texto à mão.

1. Edita a lista: acrescenta, muda ou **tira a vaga logo que for preenchida**. A profissão tem de existir no formulário com `data-vaga` (por exemplo `<option data-vaga="pedreiro">Pedreiro/a</option>`). Uma vaga nova (ou reaberta) leva em `publicada` a data do dia em que vai para o site; nunca mudes essa data depois.
2. Corre `node scripts/gerar-vagas.cjs`. O script apaga as páginas das vagas que saíram da lista (passam a dar 404, que é uma das formas que o Google aceita) e atualiza a lista em `trabalhe-connosco/`.
3. Se a vaga já estiver anunciada nos portais, fecha-a lá no mesmo dia, à mão: o script só muda o site e o `anuncios.md`, de onde o texto da vaga desaparece. Na Indeed, fecha a oferta; no Net-Empregos, retira o anúncio na área de empresa e não o voltes a publicar; no IEFP, cancela a oferta na Área de Gestão (o IEFP pede um motivo).
4. Corre `node scripts/publicar.cjs` e `node scripts/verificar.cjs`. A verificação confirma que cada página tem uma só vaga, com os campos obrigatórios, o título igual ao H1 e a ligação para o formulário. Avisa, sem bloquear, quando uma vaga já passou da data de fim.
5. Faz commit e abre a PR. O CI confirma que as páginas geradas estão atualizadas.
6. Depois de publicar, testa cada página no [teste de resultados enriquecidos](https://search.google.com/test/rich-results) do Google: tem de aparecer "Oferta de emprego" sem erros, e os locais têm de ser reconhecidos.

As vagas atuais estão abertas até 31 de dezembro de 2026. Se continuarem abertas, muda `validaAte` antes dessa data e corre `node scripts/gerar-vagas.cjs` (os textos de `anuncios.md` mudam sozinhos). Depois, edita os anúncios já publicados e a validade da oferta no IEFP, para a data ficar igual em todo o lado.

As perguntas ao cliente e as respostas estão em `perguntas-ao-cliente.md`, que fica só no computador de quem mantém o site: está no `.gitignore`, porque as respostas têm condições internas que não são para publicar.

## O que as páginas não dizem

Por decisão do cliente (23 de outubro de 2026), as páginas não indicam o tipo de contrato, o trabalho aos sábados nem as ferramentas. A empresa trata destas condições diretamente com cada candidato. Regra para as próximas vagas: o que possa levantar dúvidas legais fica de fora das páginas e dos anúncios. O horário normal está nas páginas: das 8h às 17h, com a hora de almoço subentendida.

As funções de cada vaga foram confirmadas pelo cliente.

## Fora do site (o mais rápido: dias, não semanas)

Os anúncios para o Net-Empregos e a Indeed estão prontos em [`anuncios.md`](anuncios.md), gerados pelo mesmo script das páginas, e ainda não estão publicados. Os do IEFP também lá estão, mas só se usam se o cliente decidir o tipo de contrato e a remuneração, que o formulário do IEFP obriga a indicar.

| Canal | Custo | Notas |
|---|---|---|
| Facebook e Instagram da empresa | Gratuito; promoção opcional | Um anúncio de emprego pago usa a categoria especial "Emprego" da Meta (sem filtros por idade ou sexo). |
| **Net-Empregos** (Construção Civil) | Gratuito; destaques pagos | É a fonte mais frequente na caixa "Empregos". Os anúncios expiram ao fim de cerca de 30 dias. |
| Indeed Portugal | Gratuito; patrocínio opcional | Também aparece na caixa "Empregos". |
| OLX Emprego | Pago (pacotes de 28 dias) | Também aparece na caixa "Empregos". |
| IEFP | Sem custo indicado | Só aceita ofertas de contrato de trabalho. Precisa das credenciais da Segurança Social Direta. |
| Recomendações dos trabalhadores, placards nas obras e carrinhas | Impressão | |

**Em todos os anúncios:**
- profissão no masculino e no feminino ("Pedreiro/a"), ou "(m/f)" quando o nome não muda com o género ("Servente (m/f)") (Código do Trabalho, art. 30.º; parecer CITE 10/91);
- sem limites de idade ou de nacionalidade, e sem "jovem";
- remuneração só se for real.

## A confirmar com um jurista ou contabilista

- O Código do Trabalho (art. 32.º) obriga a guardar os registos dos processos de recrutamento durante 5 anos, enquanto a Política de privacidade indica 12 meses para as candidaturas. Guardar também cada versão publicada das páginas das vagas (o histórico do Git serve).
- A frase "destina-se a maiores de 18 anos" no formulário de candidatura (o contrato coletivo define o servente como maior de 18 anos).
- Se o requisito de português básico é proporcionado (para perceber as instruções de segurança na obra).

## Como medir

- **Todos os dias:** contar as candidaturas por profissão e por canal, perguntando "Como soube desta vaga?".
- **Todas as semanas, no Search Console:** o relatório *Desempenho* filtrado por `/trabalhe-connosco/` (com os filtros de aparência "Ofertas de emprego" e "Detalhes da oferta de emprego", quando houver impressões) e o relatório *Ofertas de emprego*, em Melhorias.
- **Duas vezes por semana:** procurar no Google, por exemplo "emprego pedreiro seixal" ou "vagas construção civil lisboa", e ver se a LMDreams aparece na caixa "Empregos".
- **API de indexação (opcional):** depois de publicar ou mudar uma vaga, pede ao Google para a visitar (`URL_UPDATED`) e, quando a vaga sai, para a retirar (`URL_DELETED`). A chave da conta de serviço nunca vai para este repositório.
