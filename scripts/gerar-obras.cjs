// Gera as páginas das obras a partir de assets/js/projetos.js:
//   obras/index.html          lista de todas as obras
//   obras/<slug>/index.html   uma página por obra (texto, antes/depois e fotografias em HTML)
// São páginas estáticas: os motores de pesquisa e os assistentes de IA leem-nas sem JavaScript.
// O cabeçalho, o rodapé (com a informação legal) e o símbolo vêm de politica-de-cookies/index.html.
// Uso: node scripts/gerar-obras.cjs   (sempre que projetos.js, o rodapé ou o CSS mudarem; o CI confirma)
const fs = require('fs')
const path = require('path')
const vm = require('vm')

const root = path.resolve(__dirname, '..')
const SITE = 'https://www.lmdreams.pt/'

// ---------- dados dos projetos, validados
const ctx = { window: {} }
vm.runInNewContext(fs.readFileSync(path.join(root, 'assets/js/projetos.js'), 'utf8'), ctx)
const projetos = ctx.window.LM_PROJETOS
const slugs = new Set()
for (const p of projetos) {
  for (const k of ['slug', 'nome', 'tipoDeIntervencao', 'onde', 'ano', 'resumo', 'descricao', 'capa']) {
    if (!p[k]) throw new Error(`Projeto ${p.id}: falta o campo ${k}`)
  }
  if (slugs.has(p.slug)) throw new Error(`Slug repetido: ${p.slug}`)
  slugs.add(p.slug)
}
// apaga páginas de obras que já não existem em projetos.js
fs.mkdirSync(path.join(root, 'obras'), { recursive: true })
for (const d of fs.readdirSync(path.join(root, 'obras'), { withFileTypes: true })) {
  if (d.isDirectory() && !slugs.has(d.name)) fs.rmSync(path.join(root, 'obras', d.name), { recursive: true })
}
const CATEGORIAS = {
  remodelacoes: 'Remodelações', cozinhas: 'Cozinhas', 'casas-de-banho': 'Casas de banho', interiores: 'Interiores',
  exteriores: 'Exteriores', construcao: 'Construção', recuperacao: 'Recuperação de imóveis',
}

// ---------- partes partilhadas (a página legal está um nível abaixo da raiz)
const shell = fs.readFileSync(path.join(root, 'politica-de-cookies/index.html'), 'utf8')
const cut = (start, end) => {
  const a = shell.indexOf(start)
  const b = shell.indexOf(end, a)
  if (a < 0 || b < 0) throw new Error(`Não encontrei ${start} na página modelo`)
  return shell.slice(a, b + end.length)
}
const symbol = cut('<svg width="0" height="0"', '</svg>')
const header = cut('<header class="hdr">', '</header>')
const footer = cut('<footer class="ftr">', '</footer>')
const cssV = (fs.readFileSync(path.join(root, 'index.html'), 'utf8').match(/style\.css\?v=(\d+)/) || [])[1] || '1'
// muda a profundidade dos caminhos relativos ("../" → "../../")
const deeper = (html, prefix) => html.replace(/(href|src)="\.\.\//g, `$1="${prefix}`)

const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const lugar = (p) => (p.concelho && p.concelho !== p.localidade ? `${p.localidade}, ${p.concelho}` : p.localidade)
const semPrefixo = (t) => t.replace(/^(Antes|Depois)( da obra)?:\s*/i, '')
const ldJson = (o) => JSON.stringify(o).replace(/</g, '\\u003c')

function page({ title, description, canonical, image, prefix, main, jsonld }) {
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
  <meta property="og:type" content="article">
  <meta property="og:locale" content="pt_PT">
  <meta property="og:site_name" content="LMDreams">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${SITE}${image.src}">
  <meta property="og:image:width" content="${image.width}">
  <meta property="og:image:height" content="${image.height}">
  <meta property="og:image:alt" content="${esc(image.alt)}">
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
<body class="page-legal page-obra">
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

const img = (i, prefix, { eager = false, high = false, alt } = {}) => `<img src="${prefix}${i.src}" width="${i.width}" height="${i.height}" alt="${esc(alt === undefined ? i.alt : alt)}"${eager ? '' : ' loading="lazy"'}${high ? ' fetchpriority="high"' : ''} decoding="async">`
const empresa = { '@type': 'GeneralContractor', '@id': `${SITE}#empresa`, name: 'LMDreams', url: SITE }
const crumb = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, item], k) => ({ '@type': 'ListItem', position: k + 1, name, ...(item ? { item } : {}) })),
})

// ---------- uma página por obra
for (const p of projetos) {
  const prefix = '../../'
  const titulo = `${p.tipoDeIntervencao} ${p.onde}, ${p.ano}`
  const canonical = `${SITE}obras/${p.slug}/`
  // pares antes/depois: texto alternativo curto e a descrição detalhada visível uma só vez
  const pares = p.antes.map((a, k) => `      <div class="obra__par">
        <figure>${img(a, prefix, { eager: k === 0, high: k === 0, alt: `${p.nome}: antes da obra` })}<figcaption>Antes</figcaption></figure>
        <figure>${img(p.depois[k], prefix, { eager: k === 0, alt: `${p.nome}: depois da obra` })}<figcaption>Depois</figcaption></figure>
      </div>
      <p class="obra__legenda">${esc(semPrefixo(p.depois[k].alt))}</p>`).join('\n')
  const primeira = !p.antes.length
  const resto = p.depois.slice(p.antes.length)
    .map((d, k) => `        <figure>${img(d, prefix, { eager: primeira && k === 0, high: primeira && k === 0, alt: '' })}<figcaption>${esc(semPrefixo(d.alt))}</figcaption></figure>`).join('\n')
  const outras = projetos.filter((o) => o !== p)
    .map((o) => `        <li><a href="../${o.slug}/">${esc(o.nome)}</a> <span>${esc(lugar(o))}, ${o.ano}</span></li>`).join('\n')

  const main = `    <article class="legal obra wrap" aria-labelledby="documento-titulo">
      <nav class="crumbs" aria-label="Localização no site">
        <a href="${prefix}">Início</a> <span aria-hidden="true">/</span> <a href="../">Obras</a> <span aria-hidden="true">/</span> <span aria-current="page">${esc(p.nome)}</span>
      </nav>
      <p class="obra__cat">${esc(CATEGORIAS[p.categoria] || '')}</p>
      <h1 id="documento-titulo">${esc(p.nome)}</h1>
      <p class="obra__lead">${esc(titulo)}.</p>
      <p>${esc(p.descricao)}</p>
      <dl class="tblock obra__meta">
        <div><dt>Tipo de intervenção</dt><dd>${esc(p.tipoDeIntervencao)}</dd></div>
        <div><dt>Localidade</dt><dd>${esc(lugar(p))}</dd></div>
        <div><dt>Ano</dt><dd>${p.ano}</dd></div>
      </dl>
${pares ? `      <h2>Antes e depois</h2>\n${pares}\n` : ''}${resto ? `      <h2>${pares ? 'Mais fotografias' : 'Fotografias'}</h2>\n      <div class="obra__fotos">\n${resto}\n      </div>\n` : ''}      <section class="obra__cta" aria-labelledby="cta-t">
        <h2 id="cta-t">Tem uma obra parecida em mente?</h2>
        <p>Descreva a obra por telefone, WhatsApp ou e-mail. O orçamento é gratuito e respondemos no prazo máximo de 8 dias úteis.</p>
        <p class="legal__actions"><a class="btn btn--brass" href="${prefix}#contactos">Pedir orçamento</a> <a class="btn btn--ghost" href="../">Ver outras obras</a></p>
        <p>Gostava de trabalhar em obras como esta? <a href="${prefix}trabalhe-connosco/">Veja as vagas e candidate-se</a>.</p>
      </section>
      <nav class="obra__outras" aria-labelledby="outras-t">
        <h2 id="outras-t">Outras obras</h2>
        <ul>
${outras}
        </ul>
      </nav>
      <p class="obra__nota">Fotografias de uma obra realizada pela LMDreams, publicadas com autorização do cliente.</p>
    </article>`

  const dir = path.join(root, 'obras', p.slug)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.html'), page({
    title: `${p.tipoDeIntervencao} ${p.onde} | LMDreams`,
    description: `${titulo}. ${p.resumo}`,
    canonical,
    image: p.capa,
    prefix,
    main,
    jsonld: {
      '@context': 'https://schema.org',
      '@graph': [
        crumb([['Início', SITE], ['Obras', `${SITE}obras/`], [p.nome]]),
        {
          '@type': 'WebPage', '@id': canonical, url: canonical, name: p.nome, inLanguage: 'pt-PT',
          primaryImageOfPage: `${SITE}${p.capa.src}`, isPartOf: { '@id': `${SITE}#site` },
          about: { '@type': 'Place', name: lugar(p) }, publisher: empresa,
        },
      ],
    },
  }))
}

// ---------- lista de obras
const cards = projetos.map((p, k) => `        <li class="card">
          <a class="obra__link" href="${p.slug}/">
            <figure class="card__media">${img(p.capa, '../', { eager: k < 3, high: k === 0 })}</figure>
            <p class="card__cat">${esc(CATEGORIAS[p.categoria] || '')}</p>
            <h2 class="card__t">${esc(p.nome)}</h2>
          </a>
          <p class="card__d">${esc(p.tipoDeIntervencao)} ${esc(p.onde)}, ${p.ano}.</p>
        </li>`).join('\n')
const lista = `    <article class="legal obras wrap" aria-labelledby="documento-titulo">
      <nav class="crumbs" aria-label="Localização no site">
        <a href="../">Início</a> <span aria-hidden="true">/</span> <span aria-current="page">Obras</span>
      </nav>
      <h1 id="documento-titulo">Obras realizadas pela LMDreams</h1>
      <p class="obra__lead">Seixal, Almada, Lisboa e Sintra.</p>
      <p>Fotografias de obras realizadas pela LMDreams, publicadas com autorização dos clientes. Em cada obra encontra o que foi feito e, quando existem, as fotografias de antes e depois.</p>
      <p>Estamos a contratar profissionais da construção civil (m/f) para obras como estas: <a href="../trabalhe-connosco/">veja as vagas e candidate-se</a>.</p>
      <ul class="obras__grid">
${cards}
      </ul>
    </article>`
const capaLista = projetos[projetos.length - 1].capa
fs.writeFileSync(path.join(root, 'obras', 'index.html'), page({
  title: 'Obras realizadas no Seixal, em Almada, Lisboa e Sintra | LMDreams',
  description: 'Obras da LMDreams no Seixal, em Almada, Lisboa e Sintra: remodelações, cozinhas, casas de banho, ampliação, exteriores e recuperação de imóveis.',
  canonical: `${SITE}obras/`,
  image: capaLista,
  prefix: '../',
  main: lista,
  jsonld: {
    '@context': 'https://schema.org',
    '@graph': [
      crumb([['Início', SITE], ['Obras']]),
      {
        '@type': 'CollectionPage', '@id': `${SITE}obras/`, url: `${SITE}obras/`, name: 'Obras realizadas pela LMDreams',
        inLanguage: 'pt-PT', isPartOf: { '@id': `${SITE}#site` }, publisher: empresa,
        hasPart: projetos.map((p) => ({ '@type': 'WebPage', '@id': `${SITE}obras/${p.slug}/`, name: p.nome })),
      },
    ],
  },
}))
console.log(`obras: ${projetos.length} páginas + lista`)
