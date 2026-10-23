// Gera tudo o que fala das vagas a partir da lista VAGAS (abaixo):
//   trabalhe-connosco/<slug>/index.html   uma página por vaga, com os dados estruturados JobPosting
//   trabalhe-connosco/index.html          a descrição (meta e og), o primeiro parágrafo e a lista das vagas
//   index.html                            as frases sobre as vagas (Estamos a recrutar, pergunta e Contactos)
// Nas páginas escritas à mão, só muda o que está entre <!-- vagas:<nome>:inicio --> e <!-- vagas:<nome>:fim -->.
// Todas as vagas usam o mesmo formulário de candidatura (trabalhe-connosco/#candidatura). A ligação
// ?vaga=<slug> deixa a profissão já escolhida (assets/js/formularios.js, opção com data-vaga).
// Regras do Google: uma vaga real por página, os dados iguais ao texto visível e, logo que a vaga é
// preenchida, sai de VAGAS (corre o script e publica: a página deixa de existir).
// O cabeçalho, o rodapé (com a informação legal) e o símbolo vêm de politica-de-cookies/index.html.
// Uso: node scripts/gerar-vagas.cjs   (o CI confirma que as páginas estão atualizadas)
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const SITE = 'https://www.lmdreams.pt/'
const BASE = `${SITE}trabalhe-connosco/`

// ---------- condições comuns, dadas pelo cliente a 23 de outubro de 2026 (o que ainda não entra nas
// páginas está em docs/recrutamento/README.md, "Pontos por confirmar")
const COMUM = {
  // fim do dia 31 de dezembro em Lisboa (inverno: UTC+0)
  validaAte: '2026-12-31T23:59:59+00:00',
  local: 'Lisboa e Margem Sul (península de Setúbal), sobretudo Seixal, Almada e Sesimbra',
  frase: 'Obras em Lisboa e na Margem Sul (península de Setúbal), sobretudo no Seixal, em Almada e em Sesimbra.',
  // os mesmos sítios do texto, para o Google (jobLocation): onde ficam as obras
  locais: [['Lisboa', 'Lisboa'], ['Seixal', 'Setúbal'], ['Almada', 'Setúbal'], ['Sesimbra', 'Setúbal']],
  encontro: 'Na obra ou no ponto de recolha da carrinha da empresa',
  horario: 'Das 8h às 17h',
  inicio: 'Imediato',
  contrato: 'Contrato de trabalho a tempo completo',
  remuneracao: 'De acordo com a lei e com a experiência, a combinar com a empresa',
  oferecemos: [
    'Transporte na carrinha da empresa, a partir do ponto de recolha.',
    'Equipamento de proteção: luvas, capacete e botas.',
    'Seguro de acidentes de trabalho.',
    'Alojamento nas obras a mais de 100 km.',
    'Horas extra e sábados pagos.',
    'Subsídio de alimentação.',
    'Pagamento semanal ou mensal, a combinar.',
  ],
  pedimos: [
    'Comunicar em português no dia a dia da obra (nível básico).',
    'Carta de condução: não é obrigatória.',
  ],
  atendimento: 'de segunda a sexta-feira, das 9h às 18h',
}

// ---------- vagas abertas
//   profissao  igual a uma opção da lista do formulário (e do Codigo.gs), com data-vaga="<slug>"
//   titulo     só o nome da profissão, sem sítios nem empresa (regra do Google)
//   marca      '' quando o título já tem "/a"; ' (m/f)' quando o nome não muda com o género
//              (Código do Trabalho, art. 30.º; parecer CITE 10/91)
//   plural     como aparece nas frases ("vagas para pedreiros/as, ...")
//   publicada  o dia em que a vaga foi para o site (AAAA-MM-DD). Nunca muda depois.
const VAGAS = [
  {
    slug: 'pedreiro',
    profissao: 'Pedreiro/a',
    titulo: 'Pedreiro/a',
    marca: '',
    plural: 'pedreiros/as',
    publicada: '2026-10-23',
    resumo: 'Alvenarias e rebocos. Com experiência como oficial.',
    trabalho: 'Trabalho de pedreiro/a em obras de construção, remodelação e recuperação de casas: alvenarias e rebocos.',
    pedimos: ['Experiência como pedreiro/a (oficial).'],
  },
  {
    slug: 'servente',
    profissao: 'Servente',
    titulo: 'Servente de construção civil',
    marca: ' (m/f)',
    plural: 'serventes',
    publicada: '2026-10-23',
    resumo: 'Apoio às equipas na obra. Com ou sem experiência.',
    trabalho: 'Servente de obras e ajudante de pedreiro: apoio às equipas na obra, preparar e transportar materiais, fazer argamassas e manter a obra limpa e arrumada.',
    pedimos: ['Com ou sem experiência: basta vontade de aprender.'],
    semExperiencia: true,
  },
  {
    slug: 'pintor',
    profissao: 'Pintor/a',
    titulo: 'Pintor/a de construção civil',
    marca: '',
    plural: 'pintores/as',
    publicada: '2026-10-23',
    resumo: 'Preparação de superfícies e pinturas interiores e exteriores. Com experiência.',
    trabalho: 'Trabalho de pintura em obras de construção e remodelação: preparação de superfícies, barramentos, lixagem e pinturas interiores e exteriores (não é pintura automóvel nem industrial).',
    pedimos: ['Experiência como pintor/a de construção civil.'],
  },
]
const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
const dataPorExtenso = (iso) => { const [a, m, d] = iso.slice(0, 10).split('-').map(Number); return `${d} de ${MESES[m - 1]} de ${a}` }
// "a, b e c"
const juntar = (itens) => (itens.length < 2 ? itens.join('') : `${itens.slice(0, -1).join(', ')} e ${itens[itens.length - 1]}`)

// ---------- validação
const ficheiro = (f) => path.join(root, f)
let trabalhe = fs.readFileSync(ficheiro('trabalhe-connosco/index.html'), 'utf8')
let inicial = fs.readFileSync(ficheiro('index.html'), 'utf8')
const slugs = new Set()
for (const v of VAGAS) {
  for (const k of ['slug', 'profissao', 'titulo', 'plural', 'publicada', 'resumo', 'trabalho']) {
    if (!v[k] || typeof v[k] !== 'string') throw new Error(`Vaga ${v.slug}: falta o campo ${k}`)
  }
  v.marca = v.marca ?? ''
  if (typeof v.marca !== 'string') throw new Error(`Vaga ${v.slug}: marca inválida`)
  if (!Array.isArray(v.pedimos) || !v.pedimos.length) throw new Error(`Vaga ${v.slug}: falta pedimos`)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v.publicada)) throw new Error(`Vaga ${v.slug}: publicada tem de ser AAAA-MM-DD`)
  if (!/^[a-z0-9-]+$/.test(v.slug)) throw new Error(`Vaga ${v.slug}: slug inválido`)
  if (slugs.has(v.slug)) throw new Error(`Slug repetido: ${v.slug}`)
  slugs.add(v.slug)
  // a opção do formulário que a ligação ?vaga= escolhe
  if (!trabalhe.includes(`<option data-vaga="${v.slug}">${v.profissao}</option>`)) {
    throw new Error(`Vaga ${v.slug}: falta <option data-vaga="${v.slug}">${v.profissao}</option> no formulário`)
  }
}
if (!/id="candidatura"/.test(trabalhe)) throw new Error('Falta id="candidatura" no formulário de trabalhe-connosco/index.html')

// ---------- partes partilhadas (a página legal está um nível abaixo da raiz)
const shell = fs.readFileSync(ficheiro('politica-de-cookies/index.html'), 'utf8')
const cut = (start, end) => {
  const a = shell.indexOf(start)
  const b = shell.indexOf(end, a)
  if (a < 0 || b < 0) throw new Error(`Não encontrei ${start} na página modelo`)
  return shell.slice(a, b + end.length)
}
const symbol = cut('<svg width="0" height="0"', '</svg>')
const header = cut('<header class="hdr">', '</header>')
const footer = cut('<footer class="ftr">', '</footer>')
const cssV = (inicial.match(/style\.css\?v=(\d+)/) || [])[1] || '1'
// muda a profundidade dos caminhos relativos ("../" → "../../")
const deeper = (html, prefix) => html.replace(/(href|src)="\.\.\//g, `$1="${prefix}`)
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const ldJson = (o) => JSON.stringify(o).replace(/</g, '\\u003c')
const crumb = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, item], k) => ({ '@type': 'ListItem', position: k + 1, name, ...(item ? { item } : {}) })),
})
const lista = (itens, ind) => itens.map((t) => `${ind}<li>${esc(t)}</li>`).join('\n')
// substitui o que está entre <!-- vagas:<nome>:inicio --> e <!-- vagas:<nome>:fim --> (linhas próprias)
function preencher(html, nome, conteudo, onde) {
  const INI = `<!-- vagas:${nome}:inicio -->`
  const FIM = `<!-- vagas:${nome}:fim -->`
  const a = html.indexOf(INI)
  const b = html.indexOf(FIM)
  if (a < 0 || b < a || html.indexOf(INI, a + 1) >= 0) throw new Error(`${onde}: faltam ${INI} e ${FIM}`)
  const indent = html.slice(html.lastIndexOf('\n', a) + 1, a)
  return `${html.slice(0, a + INI.length)}\n${conteudo.split('\n').map((l) => indent + l).join('\n')}\n${indent}${html.slice(b)}`
}
// troca o valor de content="" de uma meta, que tem de existir uma só vez
function meta(html, chave, valor, onde) {
  const re = new RegExp(`(<meta ${chave} content=")[^"]*(">)`)
  if (!re.test(html)) throw new Error(`${onde}: falta <meta ${chave}>`)
  return html.replace(re, (_, a, b) => `${a}${esc(valor)}${b}`)
}

function page({ title, description, canonical, prefix, main, jsonld }) {
  return `<!doctype html>
<html lang="pt-PT">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="format-detection" content="telephone=no">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="index,follow">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="pt_PT">
  <meta property="og:site_name" content="LMDreams">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${SITE}og-image.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#12171c">
  <link rel="icon" href="${prefix}assets/icons/favicon.ico" sizes="any">
  <link rel="icon" href="${prefix}assets/icons/favicon-32.png" type="image/png" sizes="32x32">
  <link rel="apple-touch-icon" href="${prefix}assets/icons/apple-touch-icon.png">
  <link rel="manifest" href="${prefix}site.webmanifest">
  <link rel="preload" href="${prefix}assets/fonts/archivo-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="${prefix}assets/css/style.css?v=${cssV}">
  <script type="application/ld+json">${ldJson(jsonld)}</script>
</head>
<body class="page-legal page-vaga">
  ${symbol}
  <a class="skip" href="#conteudo">Saltar para o conteúdo</a>

  ${deeper(header, prefix)}

  <main id="conteudo" tabindex="-1">
${main}
  </main>

  ${deeper(footer, prefix)}
</body>
</html>
`
}

// apaga páginas de vagas que já não existem em VAGAS
for (const d of fs.readdirSync(ficheiro('trabalhe-connosco'), { withFileTypes: true })) {
  if (d.isDirectory() && !slugs.has(d.name)) fs.rmSync(path.join(ficheiro('trabalhe-connosco'), d.name), { recursive: true })
}

// ---------- uma página por vaga
const TELEFONE = '+351 919 233 372'
for (const v of VAGAS) {
  const prefix = '../../'
  const canonical = `${BASE}${v.slug}/`
  const nome = `${v.titulo}${v.marca}`
  const pedimos = [...v.pedimos, ...COMUM.pedimos]
  const condicoes = [
    ['Local', COMUM.local],
    ['Ponto de encontro', COMUM.encontro],
    ['Horário', COMUM.horario],
    ['Início', COMUM.inicio],
    ['Tipo de contrato', COMUM.contrato],
    ['Remuneração', COMUM.remuneracao],
    ['Vaga aberta até', dataPorExtenso(COMUM.validaAte)],
  ]
  const lead = `${COMUM.frase} Início imediato.`
  // a mesma frase na página (com ligações) e na descrição do JobPosting (sem ligações)
  const comoCandidatar = (telefone, whatsapp) => `Preencha o formulário de candidatura: leva menos de dois minutos e a profissão ${esc(v.profissao)} já vem escolhida. Também pode ligar para o ${telefone} (chamada para a rede móvel nacional) ou enviar mensagem por ${whatsapp}, ${esc(COMUM.atendimento)}.`

  // a descrição do JobPosting usa os mesmos textos da página (as condições aparecem na página como lista dt/dd)
  const descricao = [
    `<p>${esc(lead)}</p>`,
    '<h2>O trabalho</h2>',
    `<p>${esc(v.trabalho)}</p>`,
    '<h2>O que pedimos</h2>',
    `<ul>\n${lista(pedimos, '  ')}\n</ul>`,
    '<h2>O que oferecemos</h2>',
    `<ul>\n${lista(COMUM.oferecemos, '  ')}\n</ul>`,
    '<h2>Condições</h2>',
    // a seguir aos dois pontos, minúscula (menos o local, que começa por um nome próprio, e a data)
    `<ul>\n${lista(condicoes.map(([k, t]) => `${k}: ${k === 'Local' ? t : t[0].toLowerCase() + t.slice(1)}.`), '  ')}\n</ul>`,
    '<h2>Como se candidatar</h2>',
    `<p>${comoCandidatar(TELEFONE, 'WhatsApp')}</p>`,
  ].join('\n')

  const outras = VAGAS.filter((o) => o !== v)
    .map((o) => `        <li><a href="../${o.slug}/">${esc(o.titulo + o.marca)}</a> <span>${esc(o.resumo)}</span></li>`).join('\n')
  const outrasNav = outras
    ? `      <nav class="obra__outras" aria-labelledby="outras-t">
        <h2 id="outras-t">Outras vagas</h2>
        <ul>
${outras}
        </ul>
      </nav>`
    : '      <p>Também recebemos candidaturas de todas as especialidades da construção civil, com o <a href="../#candidatura">mesmo formulário</a>.</p>'

  const main = `    <article class="legal obra vaga wrap" aria-labelledby="documento-titulo">
      <nav class="crumbs" aria-label="Localização no site">
        <a href="${prefix}">Início</a> <span aria-hidden="true">/</span> <a href="../">Trabalhe connosco</a> <span aria-hidden="true">/</span> <span aria-current="page">${esc(v.titulo)}</span>
      </nav>
      <p class="obra__cat">Vaga aberta</p>
      <h1 id="documento-titulo">${esc(nome)}</h1>
      <p class="obra__lead">${esc(lead)}</p>
      <dl class="tblock obra__meta">
${condicoes.map(([k, t]) => `        <div><dt>${esc(k)}</dt><dd>${esc(t)}</dd></div>`).join('\n')}
      </dl>
      <h2>O trabalho</h2>
      <p>${esc(v.trabalho)}</p>
      <h2>O que pedimos</h2>
      <ul>
${lista(pedimos, '        ')}
      </ul>
      <h2>O que oferecemos</h2>
      <ul>
${lista(COMUM.oferecemos, '        ')}
      </ul>
      <section class="obra__cta" aria-labelledby="cta-t">
        <h2 id="cta-t">Como se candidatar</h2>
        <p>${comoCandidatar(`<a href="tel:+351919233372">${TELEFONE}</a>`, '<a href="https://wa.me/351919233372" target="_blank" rel="noopener">WhatsApp<span class="sr-only"> (abre numa nova janela)</span></a>')}</p>
        <p class="legal__actions"><a class="btn btn--brass" href="../?vaga=${v.slug}#candidatura">Candidatar-me a esta vaga</a> <a class="btn btn--ghost" href="tel:+351919233372">Ligar</a></p>
      </section>
${outrasNav}
      <p class="obra__nota">Oferta da LMDreams, Unipessoal Lda., empresa de construção civil com escritório em Amora (Seixal) e alvará de empreiteiro n.º 101097-PAR. Publicada a ${dataPorExtenso(v.publicada)}.</p>
    </article>`

  const jobPosting = {
    '@type': 'JobPosting',
    '@id': `${canonical}#vaga`,
    title: nome,
    description: descricao,
    datePosted: v.publicada,
    validThrough: COMUM.validaAte,
    employmentType: 'FULL_TIME',
    hiringOrganization: {
      '@type': 'Organization',
      name: 'LMDreams',
      legalName: 'LMDreams, Unipessoal Lda.',
      sameAs: SITE,
      logo: `${SITE}assets/icons/logo-lmdreams.png`,
    },
    jobLocation: COMUM.locais.map(([localidade, distrito]) => ({
      '@type': 'Place',
      address: { '@type': 'PostalAddress', addressLocality: localidade, addressRegion: distrito, addressCountry: 'PT' },
    })),
    // um clique da página da vaga para o formulário do próprio site, mais o telefone da empresa
    directApply: true,
    identifier: { '@type': 'PropertyValue', name: 'LMDreams', value: `lmdreams-${v.publicada.slice(0, 4)}-${v.slug}` },
    industry: 'Construção civil',
    workHours: COMUM.horario,
    jobBenefits: COMUM.oferecemos.join(' '),
    // o cliente não deu um mínimo de meses para os oficiais: só o servente leva o valor do Google para "sem requisitos"
    ...(v.semExperiencia ? { experienceRequirements: 'no requirements' } : {}),
  }

  const dir = path.join(ficheiro('trabalhe-connosco'), v.slug)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.html'), page({
    title: `${nome} em Lisboa e Margem Sul | LMDreams`,
    description: `${nome} para obras em Lisboa e na Margem Sul. Início imediato e transporte da empresa. Candidate-se online ou ligue 919 233 372.`,
    canonical,
    prefix,
    main,
    jsonld: {
      '@context': 'https://schema.org',
      '@graph': [
        crumb([['Início', SITE], ['Trabalhe connosco', BASE], [v.titulo]]),
        jobPosting,
      ],
    },
  }))
}

// ---------- frases sobre as vagas nas páginas escritas à mão
const plurais = juntar(VAGAS.map((v) => esc(v.plural)))
const comLigacoes = juntar(VAGAS.map((v) => `<a class="link" href="trabalhe-connosco/${v.slug}/">${esc(v.plural)}</a>${v.semExperiencia ? ' (com ou sem experiência)' : ''}`))
const zona = 'Lisboa e na Margem Sul (Seixal, Almada e Sesimbra)'
const descricaoTrabalhe = VAGAS.length
  ? `Estamos a contratar ${juntar(VAGAS.map((v) => v.plural))} (m/f) para obras em ${zona}. Início imediato.`
  : `Candidaturas para trabalhar na construção civil, em obras em ${zona}.`

trabalhe = meta(trabalhe, 'name="description"', `${descricaoTrabalhe} Candidate-se online ou ligue 919 233 372.`, 'trabalhe-connosco/index.html')
trabalhe = meta(trabalhe, 'property="og:description"', descricaoTrabalhe, 'trabalhe-connosco/index.html')
trabalhe = preencher(trabalhe, 'intro', VAGAS.length
  ? `<p>Temos obras em curso e marcadas para os próximos meses e estamos a contratar ${plurais} (m/f) para reforçar as nossas equipas, com início imediato.</p>`
  : '<p>Temos obras em curso e marcadas para os próximos meses. De momento não temos vagas abertas, mas recebemos candidaturas de todas as especialidades da construção civil (m/f).</p>', 'trabalhe-connosco/index.html')
trabalhe = preencher(trabalhe, 'lista', VAGAS.length
  ? `<h2>Vagas abertas</h2>
<p>${esc(COMUM.frase)} Início imediato.</p>
<ul class="vagas">
${VAGAS.map((v) => `  <li><a href="${v.slug}/">${esc(v.titulo + v.marca)}</a> <span>${esc(v.resumo)}</span></li>`).join('\n')}
</ul>
<p>Também recebemos candidaturas de outras especialidades da construção civil, com o mesmo formulário.</p>`
  : '<p>Pode deixar a sua candidatura com o formulário abaixo: guardamo-la para as próximas vagas.</p>', 'trabalhe-connosco/index.html')

inicial = preencher(inicial, 'recrutamento', VAGAS.length
  ? `<p>Temos obras em curso e marcadas para os próximos meses, e vagas para ${comLigacoes} (m/f), com início imediato. Também recebemos candidaturas de outras especialidades da construção civil.</p>`
  : '<p>Temos obras em curso e marcadas para os próximos meses, e recebemos candidaturas de profissionais de todas as especialidades da construção civil (m/f).</p>', 'index.html')
inicial = preencher(inicial, 'faq', `${VAGAS.length
  ? `<p>Sim. Temos vagas para ${comLigacoes} (m/f), com início imediato, e recebemos candidaturas de outras especialidades da construção civil.`
  : '<p>De momento não temos vagas abertas, mas recebemos candidaturas de todas as especialidades da construção civil (m/f).'} Pode candidatar-se na página <a class="link" href="trabalhe-connosco/">Trabalhe connosco</a> ou ligar para o ${TELEFONE} (chamada para a rede móvel nacional).</p>`, 'index.html')
inicial = preencher(inicial, 'contactos', VAGAS.length
  ? `<p class="contact__small">Temos vagas para ${plurais} (m/f): <a class="link" href="trabalhe-connosco/">candidate-se aqui</a>.</p>`
  : '<p class="contact__small">Recebemos candidaturas de profissionais da construção civil (m/f): <a class="link" href="trabalhe-connosco/">candidate-se aqui</a>.</p>', 'index.html')

fs.writeFileSync(ficheiro('trabalhe-connosco/index.html'), trabalhe)
fs.writeFileSync(ficheiro('index.html'), inicial)
console.log(`vagas: ${VAGAS.length} páginas + frases em trabalhe-connosco/index.html e index.html`)
