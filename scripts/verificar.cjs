// Verifica a pasta dist/ antes de publicar. Falha (código 1) se encontrar:
//  1. ligações, imagens ou âncoras locais que não existem (HTML, srcset, CSS, meta, JSON-LD, sitemap);
//  2. recursos carregados de servidores de terceiros (a Política de cookies garante que não há nenhum);
//  3. ficheiros de rss/ ou das fotografias originais;
//  4. páginas sem a informação legal obrigatória no rodapé, ou com marcas "POR DEFINIR";
//  5. imagens demasiado pesadas;
//  6. formulários sem o endereço do Apps Script, sem o aviso RGPD ou com listas diferentes das do
//     script (docs/formularios/apps-script/Codigo.gs);
//  7. ofertas de emprego (JobPosting) com mais de uma vaga na página, sem os campos que o Google
//     exige, com o título diferente do H1 ou sem ligação para o formulário de candidatura.
// Uso: node scripts/verificar.cjs   (corre depois de node scripts/publicar.cjs)
const fs = require('fs')
const path = require('path')

const SITE = 'https://www.lmdreams.pt/'
const MAX_IMG = 1.5 * 1024 * 1024
// Informação legal que tem de estar em todas as páginas (CSC art. 171.º, DL 7/2004, Lei 144/2015, DL 59/2021)
const LEGAL = [
  'LMDreams, Unipessoal Lda.',
  'Rua António Silva, Lote 2037 B, 2975-257 Quinta do Conde',
  '516383370',
  'Conservatória do Registo Comercial',
  'Capital social',
  '101097-PAR',
  '(chamada para a rede móvel nacional)',
  'livroreclamacoes.pt',
  'centroarbitragemlisboa.pt',
  'cniacc.pt',
  'consumidor.gov.pt',
  'geradas por IA',
]

const root = path.resolve(__dirname, '..')
const dist = path.join(root, 'dist')
// Único destino externo permitido no JavaScript do site: a aplicação Web do Google Apps Script que
// recebe os formulários (um envio feito quando a pessoa carrega em "Enviar", não um recurso carregado).
const APPS_SCRIPT = /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]{20,}\/exec$/
if (!fs.existsSync(dist)) { console.error('Falta dist/: corre primeiro node scripts/publicar.cjs'); process.exit(1) }

const files = []
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).forEach((e) => {
  const p = path.join(dir, e.name)
  if (e.isDirectory()) walk(p)
  else files.push(p)
})
walk(dist)

const problems = []
const rel = (p) => path.relative(dist, p).split(path.sep).join('/')
const exists = (p) => fs.existsSync(p)

// 3. nada de originais
files.filter((f) => /(^|\/)(rss|fotos-originais)(\/|$)/i.test(rel(f))).forEach((f) => problems.push(`ficheiro proibido: ${rel(f)}`))

// 5. peso das imagens
files.filter((f) => /\.(webp|jpe?g|png|avif)$/i.test(f)).forEach((f) => {
  const s = fs.statSync(f).size
  if (s > MAX_IMG) problems.push(`imagem pesada (${(s / 1024 / 1024).toFixed(1)} MB): ${rel(f)}`)
})

const idsCache = new Map()
const idsOf = (file) => {
  if (!idsCache.has(file)) {
    const html = exists(file) ? fs.readFileSync(file, 'utf8') : ''
    idsCache.set(file, new Set([...html.matchAll(/\sid\s*=\s*["']?([^"'\s>]+)/g)].map((m) => m[1])))
  }
  return idsCache.get(file)
}
const attrsOf = (raw) => Object.fromEntries([...raw.matchAll(/([\w:-]+)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/g)]
  .map((m) => [m[1].toLowerCase(), m[2].replace(/^["']|["']$/g, '')]))

// Resolve um caminho local (relativo ao ficheiro ou absoluto ao site) e verifica-o
function checkLocal(url, from, where) {
  if (!url || /^(mailto:|tel:|data:|javascript:)/i.test(url)) return
  const [pathPart, hash] = url.split('#')
  const clean = decodeURI(pathPart.split('?')[0])
  let target = from
  if (clean) {
    target = clean.startsWith('/') ? path.join(dist, clean) : path.resolve(path.dirname(from), clean)
    if (clean.endsWith('/')) target = path.join(target, 'index.html')
    if (!exists(target)) { problems.push(`não existe (${where}): ${url}`); return }
    if (fs.statSync(target).isDirectory()) target = path.join(target, 'index.html')
  }
  if (hash && target.endsWith('.html') && !idsOf(target).has(hash)) problems.push(`âncora em falta (${where}): ${url}`)
}
// URLs absolutas do próprio site (canonical, og:image, JSON-LD, sitemap) têm de existir em dist/
function checkOwnAbsolute(url, where) {
  if (!url.startsWith(SITE)) return
  checkLocal(`/${url.slice(SITE.length)}`, path.join(dist, 'index.html'), where)
}
const isExternal = (u) => /^(https?:)?\/\//i.test(u)
const LOADS = new Set(['stylesheet', 'preconnect', 'preload', 'modulepreload', 'dns-prefetch', 'icon', 'apple-touch-icon', 'manifest', 'prefetch'])

function checkCss(css, from, where) {
  for (const m of css.matchAll(/@import\s+(?:url\()?\s*['"]?([^'")\s;]+)|url\(\s*['"]?([^'")]+?)['"]?\s*\)/g)) {
    const u = (m[1] || m[2] || '').trim()
    if (!u || u.startsWith('data:') || u.startsWith('#')) continue
    if (isExternal(u)) problems.push(`recurso de terceiros (${where}): ${u}`)
    else checkLocal(u, from, where)
  }
}

for (const file of files.filter((f) => f.endsWith('.html'))) {
  const html = fs.readFileSync(file, 'utf8')
  const where = rel(file)

  // 4. informação legal e marcas de trabalho
  LEGAL.filter((t) => !html.includes(t)).forEach((t) => problems.push(`falta no rodapé de ${where}: "${t}"`))
  if (/POR DEFINIR/i.test(html)) problems.push(`marca "POR DEFINIR" em ${where}`)
  // texto gerado com um campo em falta (por exemplo, uma vaga sem marca)
  if (/\bundefined\b/.test(html.replace(/<script\b[\s\S]*?<\/script>/gi, ''))) problems.push(`texto "undefined" em ${where}`)

  for (const tag of html.matchAll(/<(a|link|script|img|use|source|iframe|video|audio|object|embed|meta)\b([^>]*)>/gi)) {
    const name = tag[1].toLowerCase()
    const a = attrsOf(tag[2])
    if (name === 'meta') {
      if (/^(og:image|og:url|twitter:image)$/.test(a.property || a.name || '') && a.content) checkOwnAbsolute(a.content, where)
      continue
    }
    const urls = [a.src, a.href, a.data, a['xlink:href']].filter(Boolean)
    for (const s of [a.srcset, a.imagesrcset].filter(Boolean)) urls.push(...s.split(',').map((c) => c.trim().split(/\s+/)[0]))
    for (const url of urls) {
      if (isExternal(url)) {
        // 2. só as ligações <a> e o canonical podem apontar para fora
        const rels = (a.rel || '').toLowerCase().split(/\s+/)
        const loads = name !== 'a' && !(name === 'link' && !rels.some((r) => LOADS.has(r)))
        if (loads && !url.startsWith(SITE)) problems.push(`recurso de terceiros (${where}): ${url}`)
        if (url.startsWith(SITE)) checkOwnAbsolute(url, where)
        continue
      }
      checkLocal(url, file, where)
    }
  }
  // estilos embutidos
  for (const m of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) checkCss(m[1], file, `${where} <style>`)
  for (const m of html.matchAll(/\sstyle\s*=\s*"([^"]*)"/gi)) checkCss(m[1], file, `${where} style=""`)
  // imagens carregadas pelo JavaScript a partir de data-img
  for (const m of html.matchAll(/\sdata-img\s*=\s*"([^"]+)"/g)) {
    if (!exists(path.join(dist, 'assets', 'img', `${m[1]}.webp`))) problems.push(`imagem em falta (${where}): assets/img/${m[1]}.webp`)
  }
  // JSON-LD
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    // os "@id" com # (por exemplo /#empresa) são identificadores, não âncoras
    for (const u of m[1].match(/https:\/\/www\.lmdreams\.pt\/[^"#]*(?=")/g) || []) checkOwnAbsolute(u, `${where} JSON-LD`)
  }
}

for (const file of files.filter((f) => f.endsWith('.css'))) checkCss(fs.readFileSync(file, 'utf8'), file, rel(file))

// scripts do site (as bibliotecas em assets/vendor têm URLs nos comentários de licença)
for (const file of files.filter((f) => f.endsWith('.js') && !rel(f).startsWith('assets/vendor/'))) {
  const js = fs.readFileSync(file, 'utf8')
  for (const m of js.matchAll(/["'`](https?:\/\/[^"'`\s]+)["'`]/g)) {
    // o link do perfil no Google (avaliações) é uma ligação, não um recurso carregado
    if (/^https:\/\/((www\.)?google\.[a-z.]+\/maps|maps\.app\.goo\.gl|g\.page)\//.test(m[1])) continue
    // o endereço de envio dos formulários (só em formularios.js)
    if (rel(file) === 'assets/js/formularios.js' && APPS_SCRIPT.test(m[1])) continue
    problems.push(`URL externa em ${rel(file)}: ${m[1]}`)
  }
}

// manifesto e sitemap
const manifest = path.join(dist, 'site.webmanifest')
if (exists(manifest)) JSON.parse(fs.readFileSync(manifest, 'utf8')).icons.forEach((i) => checkLocal(i.src, manifest, 'site.webmanifest'))
const sitemap = path.join(dist, 'sitemap.xml')
if (exists(sitemap)) for (const m of fs.readFileSync(sitemap, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)) checkOwnAbsolute(m[1], 'sitemap.xml')

// 6. formulários
const formularios = path.join(dist, 'assets', 'js', 'formularios.js')
if (exists(formularios)) {
  const js = fs.readFileSync(formularios, 'utf8')
  const endpoint = (js.match(/const ENDPOINT = '([^']*)'/) || [])[1]
  if (!endpoint) problems.push('formularios.js: falta o endereço da aplicação Web do Apps Script (const ENDPOINT)')
  else if (!APPS_SCRIPT.test(endpoint)) problems.push(`formularios.js: endereço inesperado em ENDPOINT: ${endpoint}`)
}
const codigoGs = path.join(root, 'docs', 'formularios', 'apps-script', 'Codigo.gs')
const listas = (() => {
  const m = exists(codigoGs) && fs.readFileSync(codigoGs, 'utf8').match(/const LISTAS = (\{[\s\S]*?\n\})/)
  if (!m) { problems.push('docs/formularios/apps-script/Codigo.gs: não encontrei LISTAS'); return {} }
  return JSON.parse(m[1])
})()
for (const file of files.filter((f) => f.endsWith('.html'))) {
  const html = fs.readFileSync(file, 'utf8')
  for (const m of html.matchAll(/<form\b[^>]*data-formulario="([^"]+)"[^>]*>([\s\S]*?)<\/form>/g)) {
    const where = `${rel(file)} (formulário ${m[1]})`
    const corpo = m[2]
    if (!/data-rgpd/.test(corpo)) problems.push(`${where}: falta o aviso RGPD junto ao botão`)
    if (!/politica-de-privacidade\//.test(corpo)) problems.push(`${where}: falta a ligação à Política de privacidade`)
    if (!/name="campo_k7x"/.test(corpo)) problems.push(`${where}: falta o campo-armadilha`)
    if (/<form\b[^>]*\saction=/.test(m[0])) problems.push(`${where}: o formulário não pode ter action (o envio é feito por formularios.js)`)
    for (const sel of corpo.matchAll(/<select\b[^>]*name="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g)) {
      const opcoes = [...sel[2].matchAll(/<option\b([^>]*)>([^<]*)<\/option>/g)]
        .filter((o) => !/value=""/.test(o[1]))
        .map((o) => (o[1].match(/value="([^"]*)"/) || [])[1] ?? o[2].trim())
      const esperado = listas[sel[1]]
      if (!esperado) problems.push(`${where}: a lista "${sel[1]}" não existe em LISTAS do Codigo.gs`)
      else if (JSON.stringify(opcoes) !== JSON.stringify(esperado)) problems.push(`${where}: as opções de "${sel[1]}" são diferentes das de LISTAS no Codigo.gs`)
    }
  }
}

// 7. ofertas de emprego (páginas geradas por scripts/gerar-vagas.cjs). Uma vaga já terminada não
//    bloqueia a publicação (com validThrough no passado, o Google trata-a como fechada), mas fica o aviso.
const avisos = []
const trabalhe = path.join(dist, 'trabalhe-connosco', 'index.html')
const vagasDoFormulario = new Set(exists(trabalhe)
  ? [...fs.readFileSync(trabalhe, 'utf8').matchAll(/<option data-vaga="([^"]+)">/g)].map((m) => m[1]) : [])
for (const file of files.filter((f) => f.endsWith('.html'))) {
  const html = fs.readFileSync(file, 'utf8')
  const where = rel(file)
  const ofertas = []
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let dados
    try { dados = JSON.parse(m[1]) } catch { problems.push(`${where}: JSON-LD inválido`); continue }
    ofertas.push(...[dados, ...(dados['@graph'] || [])].filter((n) => n && n['@type'] === 'JobPosting'))
  }
  if (!ofertas.length) continue
  if (ofertas.length > 1) problems.push(`${where}: ${ofertas.length} JobPosting na mesma página (o Google só aceita uma vaga por página)`)
  // o texto do H1, sem etiquetas nem entidades, para comparar com o título do JobPosting
  const h1 = ((html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || '').replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim()
  for (const o of ofertas) {
    for (const k of ['title', 'description', 'datePosted', 'validThrough']) if (!o[k]) problems.push(`${where}: JobPosting sem ${k}`)
    if (!o.hiringOrganization || !o.hiringOrganization.name) problems.push(`${where}: JobPosting sem hiringOrganization.name`)
    const locais = [].concat(o.jobLocation || [])
    if (!locais.length || locais.some((l) => !l.address || !l.address.addressCountry)) problems.push(`${where}: JobPosting sem jobLocation com addressCountry`)
    if (o.validThrough && Number.isNaN(Date.parse(o.validThrough))) problems.push(`${where}: validThrough inválido (${o.validThrough})`)
    else if (o.validThrough && Date.parse(o.validThrough) < Date.now()) avisos.push(`${where}: a vaga terminou a ${o.validThrough}; tire-a de scripts/gerar-vagas.cjs`)
    if (o.title && o.title !== h1) problems.push(`${where}: o título do JobPosting ("${o.title}") é diferente do H1 ("${h1}")`)
  }
  const ligacoes = [...html.matchAll(/href="[^"]*\?vaga=([^"#&]+)#candidatura"/g)].map((m) => m[1])
  if (!ligacoes.length) problems.push(`${where}: a vaga não tem ligação para o formulário de candidatura (?vaga=…#candidatura)`)
  ligacoes.filter((v) => !vagasDoFormulario.has(v)).forEach((v) => problems.push(`${where}: ?vaga=${v} não corresponde a nenhuma opção data-vaga do formulário`))
}
avisos.forEach((a) => console.warn(`aviso: ${a}`))

if (problems.length) {
  console.error(`verificar: ${problems.length} problema(s)`)
  problems.forEach((p) => console.error(`  - ${p}`))
  process.exit(1)
}
console.log(`verificar: ok (${files.length} ficheiros; ligações, informação legal e recursos verificados)`)
