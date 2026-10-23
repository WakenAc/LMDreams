# Recrutamento: plano para chegar a quem procura trabalho

Pesquisa de 23 de outubro de 2026, com contraprova das fontes oficiais. A empresa tem obras marcadas até março de 2027 e precisa de mais mão de obra.

## Factos confirmados

- **Google for Jobs:** a pesquisa de emprego do Google está disponível em Portugal ([documentação do Google](https://developers.google.com/search/docs/appearance/structured-data/job-posting)). No dia 23 de outubro, a caixa "Empregos" apareceu em pesquisas como "emprego pedreiro seixal", "vagas construção civil lisboa", "trabalho servente obras barreiro" e "emprego pintor construção civil almada".
- **Quem aparece nessa caixa:** sobretudo o Net-Empregos, e também a OLX, a Indeed, o LinkedIn, o Jooble, a Randstad e outros. Os anúncios destes portais trazem dados estruturados `JobPosting`.
- **Regras do Google para uma vaga entrar na caixa:**
  - só para ofertas reais e abertas;
  - **uma vaga por página**: uma página com várias vagas não pode ter os dados;
  - os dados têm de corresponder ao texto visível;
  - a remuneração, se for indicada, tem de ser o valor real do empregador;
  - as vagas preenchidas saem no próprio dia.
- **Campos obrigatórios:** título, descrição completa (funções, requisitos, horário, experiência), data de publicação, empresa e local de trabalho (com o país). `validThrough` só é obrigatório se a vaga tiver data de fim.
- **API de indexação do Google:** pode ser usada em páginas com `JobPosting` e serve para pedir ao Google que as visite mais cedo. É gratuita, mas precisa de uma conta de serviço no Google Cloud ligada ao Search Console.
- **Páginas por localidade** (por exemplo `/emprego-pedreiro-seixal/`) são *doorway pages* para o Google e são proibidas. As localidades reais entram dentro de cada vaga.

## O que já está no site

- **Página `trabalhe-connosco/`**: título "Emprego na construção civil no Seixal e Margem Sul", título principal com as localidades, texto de vagas e não de bolsa de currículos, e o formulário de candidatura.
- **Ligações para a página:** cabeçalho ("Estamos a recrutar" nos ecrãs largos e "Vagas" no telemóvel), menu, secção "Estamos a recrutar" na página inicial, perguntas frequentes, Contactos, rodapé e páginas das obras.
- **Search Console:** a página `trabalhe-connosco/` já está indexada (verificado a 23 de outubro).

## Próximo passo no site (depende das respostas do cliente)

Para cada vaga confirmada, uma página `trabalhe-connosco/<profissão>/`. Tem de ter:
- **Texto visível:** funções, requisitos, o que a empresa oferece, local, início e como se candidatar, com o formulário e a profissão já escolhida.
- **Dados `JobPosting`** com os mesmos factos.

A página `trabalhe-connosco/` passa a listar as vagas, sem dados `JobPosting`, e mantém o formulário para candidaturas espontâneas.

As perguntas a fazer estão em [`perguntas-ao-cliente.md`](perguntas-ao-cliente.md).

## Fora do site (o mais rápido: dias, não semanas)

| Canal | Custo | Notas |
|---|---|---|
| Facebook e Instagram da empresa | Gratuito; promoção opcional | Um anúncio de emprego pago usa a categoria especial "Emprego" da Meta (sem filtros por idade ou sexo). |
| **Net-Empregos** (Construção Civil) | Gratuito; destaques pagos | É a fonte mais frequente na caixa "Empregos". Os anúncios expiram ao fim de cerca de 30 dias. |
| Indeed Portugal | Gratuito; patrocínio opcional | Também aparece na caixa "Empregos". |
| OLX Emprego | Pago (pacotes de 28 dias; confirmar o preço na compra) | Também aparece na caixa "Empregos". |
| IEFP | Sem custo indicado | Só para contratos de trabalho. O apoio +Emprego exige a oferta no iefponline até 2 de dezembro de 2026. |
| Recomendações dos trabalhadores, placards nas obras e carrinhas | Impressão e, se quiserem, um prémio | |

**Em todos os anúncios:**
- profissão no masculino e no feminino, ou "(m/f)" (Código do Trabalho, art. 30.º);
- sem limites de idade ou de nacionalidade;
- remuneração só se for real.

## A confirmar com um jurista ou contabilista

- O Código do Trabalho (art. 32.º) parece obrigar a guardar os registos dos processos de recrutamento durante 5 anos, enquanto a Política de privacidade indica 12 meses para as candidaturas.
- A frase "destina-se a maiores de 18 anos" no formulário de candidatura.

## Como medir

- **Todos os dias:** contar as candidaturas por profissão e por canal, perguntando "Como soube desta vaga?".
- **Todas as semanas, no Search Console:** o relatório *Desempenho* filtrado por `/trabalhe-connosco/` e, depois de haver vagas, o relatório de ofertas de emprego.
- **Duas vezes por semana:** procurar no Google, por exemplo "emprego pedreiro seixal" ou "vagas construção civil lisboa", e ver se a LMDreams aparece na caixa "Empregos".
