// Contraste dos pares de tokens de cor usados em texto e componentes (Partes 3.12 e 6.1;
// tabela da secção 3 de design/direcao-visual.md).
//
// Lê os valores --color-* do bloco @theme de src/styles/index.css e aplica a fórmula
// WCAG 2.x (linearização sRGB com limiar 0,04045): texto >= 4,5:1; texto grande e
// componentes >= 3:1. As camadas semitransparentes misturam-se em sRGB.
//
// Uso: tsx scripts/check-contrast.ts [--css <ficheiro>]

import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// ---------------------------------------------------------------------------
// Pares verificados
// ---------------------------------------------------------------------------

type Tipo = 'texto' | 'texto-grande-ui' | 'componente' | 'informativo'

const MINIMO: Record<Tipo, number | null> = {
  texto: 4.5,
  'texto-grande-ui': 3,
  componente: 3,
  informativo: null,
}

const ROTULO_TIPO: Record<Tipo, string> = {
  texto: 'texto',
  'texto-grande-ui': 'texto grande e UI',
  componente: 'componente',
  informativo: 'informativo',
}

/** Camada de um token com opacidade `alfa`, por cima de um píxel branco (pior caso de uma fotografia). */
interface CamadaSobreBranco {
  camada: string
  alfa: number
}

interface Par {
  frente: string
  fundo: string | CamadaSobreBranco
  tipo: Tipo
  uso: string
}

const PARES: readonly Par[] = [
  { frente: 'ink', fundo: 'bg', tipo: 'texto', uso: 'Texto e títulos' },
  { frente: 'ink', fundo: 'surface', tipo: 'texto', uso: 'Texto sobre surface' },
  { frente: 'ink', fundo: 'sand', tipo: 'texto', uso: 'Texto em placeholders' },
  { frente: 'muted', fundo: 'bg', tipo: 'texto', uso: 'Texto secundário' },
  { frente: 'muted', fundo: 'surface', tipo: 'texto', uso: 'Texto secundário sobre surface' },
  { frente: 'muted', fundo: 'sand', tipo: 'texto', uso: 'Texto secundário sobre sand' },
  { frente: 'accent', fundo: 'bg', tipo: 'texto', uso: 'Acento em texto pequeno (só sobre bg)' },
  { frente: 'white', fundo: 'accent', tipo: 'texto', uso: 'Texto do botão primário' },
  { frente: 'white', fundo: 'accent-hover', tipo: 'texto', uso: 'Botão primário em hover' },
  {
    frente: 'accent',
    fundo: 'surface',
    tipo: 'texto-grande-ui',
    uso: 'Acento sobre surface (em texto pequeno usa-se accent-hover)',
  },
  { frente: 'accent-hover', fundo: 'surface', tipo: 'texto', uso: 'Acento em texto sobre surface' },
  { frente: 'accent-hover', fundo: 'bg', tipo: 'texto', uso: 'Ligações em hover' },
  { frente: 'dark', fundo: 'bg', tipo: 'texto', uso: 'Nome LMDreams no cabeçalho' },
  { frente: 'on-dark', fundo: 'dark', tipo: 'texto', uso: 'Texto nas faixas escuras' },
  { frente: 'accent-on-dark', fundo: 'dark', tipo: 'texto', uso: 'Acento nas faixas escuras' },
  {
    frente: 'muted-on-dark',
    fundo: 'dark',
    tipo: 'texto',
    uso: 'Texto secundário nas faixas escuras',
  },
  { frente: 'focus', fundo: 'bg', tipo: 'componente', uso: 'Anel de foco' },
  { frente: 'focus', fundo: 'surface', tipo: 'componente', uso: 'Anel de foco sobre surface' },
  { frente: 'focus', fundo: 'dark', tipo: 'componente', uso: 'Anel de foco nas faixas escuras' },
  { frente: 'error', fundo: 'bg', tipo: 'texto', uso: 'Erros do formulário' },
  { frente: 'error', fundo: 'surface', tipo: 'texto', uso: 'Erros sobre surface' },
  {
    frente: 'muted',
    fundo: 'bg',
    tipo: 'componente',
    uso: 'Fronteira dos campos de formulário e filtros',
  },
  {
    frente: 'on-dark',
    fundo: { camada: 'dark', alfa: 0.72 },
    tipo: 'texto',
    uso: 'Texto do CTA sobre o véu (pior caso: píxel branco)',
  },
  {
    frente: 'on-dark',
    fundo: { camada: 'dark', alfa: 0.86 },
    tipo: 'texto',
    uso: 'Legenda "Imagem ilustrativa gerada por IA"',
  },
  {
    frente: 'accent',
    fundo: 'dark',
    tipo: 'informativo',
    uso: 'Contorno do botão primário numa faixa escura (identifica-se pelo texto)',
  },
  {
    frente: 'line',
    fundo: 'bg',
    tipo: 'informativo',
    uso: 'Linhas decorativas (nunca fronteira de controlo)',
  },
]

// ---------------------------------------------------------------------------
// Argumentos
// ---------------------------------------------------------------------------

const argumentos = process.argv.slice(2)
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function valorDaOpcao(opcao: string): string | undefined {
  const i = argumentos.indexOf(opcao)
  if (i === -1) return undefined
  const valor = argumentos[i + 1]
  if (valor === undefined || valor.startsWith('--')) {
    console.error(`Falta o valor da opção ${opcao}.`)
    process.exit(1)
  }
  return valor
}

const opcaoCss = valorDaOpcao('--css')
const FICHEIRO_CSS = opcaoCss ? path.resolve(opcaoCss) : path.join(RAIZ, 'src/styles/index.css')

// ---------------------------------------------------------------------------
// Cores
// ---------------------------------------------------------------------------

/** Canais de 0 a 255 (sem arredondar, para as misturas) e alfa de 0 a 1. */
interface Cor {
  r: number
  g: number
  b: number
  a: number
}

const BRANCO: Cor = { r: 255, g: 255, b: 255, a: 1 }

function lerHex(valor: string): Cor | null {
  const m = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(valor)
  const hex = m?.[1]
  if (!hex) return null
  const longo =
    hex.length <= 4
      ? hex
          .split('')
          .map((c) => c + c)
          .join('')
      : hex
  const canal = (i: number) => Number.parseInt(longo.slice(i * 2, i * 2 + 2), 16)
  return { r: canal(0), g: canal(1), b: canal(2), a: longo.length === 8 ? canal(3) / 255 : 1 }
}

/** Número CSS, com percentagem relativa a `escala` (255 nos canais rgb, 1 no alfa). */
function numeroCss(p: string | undefined, escala: number): number {
  if (p === undefined) return Number.NaN
  return p.endsWith('%') ? (Number.parseFloat(p) / 100) * escala : Number.parseFloat(p)
}

/** Canal linear (0 a 1) para sRGB codificado (0 a 255). */
function codificarSrgb(v: number): number {
  const x = Math.min(1, Math.max(0, v))
  return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055)
}

/** Canal sRGB (0 a 255) linearizado com o limiar 0,04045 da WCAG 2.x. */
function canalLinear(c: number): number {
  const s = c / 255
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}

function hexDoCanal(c: number): string {
  return Math.round(Math.min(255, Math.max(0, c)))
    .toString(16)
    .padStart(2, '0')
}

/** rgb()/rgba() nas sintaxes com vírgulas ou com espaços e barra. */
function lerRgb(valor: string): Cor | null {
  const m = /^rgba?\(\s*([^)]*)\)$/i.exec(valor)
  const corpo = m?.[1]
  if (!corpo) return null
  const partes = corpo
    .replace('/', ' ')
    .split(/[\s,]+/)
    .filter(Boolean)
  if (partes.length !== 3 && partes.length !== 4) return null
  const [r, g, b, a] = partes
  const cor: Cor = {
    r: numeroCss(r, 255),
    g: numeroCss(g, 255),
    b: numeroCss(b, 255),
    a: a === undefined ? 1 : numeroCss(a, 1),
  }
  return Object.values(cor).every((v) => Number.isFinite(v)) ? cor : null
}

/** oklch(L C h [/ a]) convertido para sRGB; fora da gama sRGB devolve texto de erro. */
function lerOklch(valor: string): Cor | string | null {
  const m = /^oklch\(\s*([^)]*)\)$/i.exec(valor)
  const corpo = m?.[1]
  if (!corpo) return null
  const [lTexto, cTexto, hTexto, aTexto] = corpo
    .replace('/', ' ')
    .split(/\s+/)
    .filter(Boolean)
  const l = numeroCss(lTexto, 1)
  const c = numeroCss(cTexto, 0.4)
  const h = (Number.parseFloat(hTexto ?? '') * Math.PI) / 180
  const a = aTexto === undefined ? 1 : numeroCss(aTexto, 1)
  if (![l, c, h, a].every((v) => Number.isFinite(v))) return null
  const oa = c * Math.cos(h)
  const ob = c * Math.sin(h)
  const lms = [
    (l + 0.3963377774 * oa + 0.2158037573 * ob) ** 3,
    (l - 0.1055613458 * oa - 0.0638541728 * ob) ** 3,
    (l - 0.0894841775 * oa - 1.291485548 * ob) ** 3,
  ] as const
  const lineares = [
    4.0767416621 * lms[0] - 3.3077115913 * lms[1] + 0.2309699292 * lms[2],
    -1.2684380046 * lms[0] + 2.6097574011 * lms[1] - 0.3413193965 * lms[2],
    -0.0041960863 * lms[0] - 0.7034186147 * lms[1] + 1.707614701 * lms[2],
  ]
  if (lineares.some((v) => v < -0.0005 || v > 1.0005)) {
    return `o valor "${valor}" está fora da gama sRGB; use uma cor hexadecimal`
  }
  const [r, g, b] = lineares.map(codificarSrgb)
  return { r: r ?? 0, g: g ?? 0, b: b ?? 0, a }
}

function misturar(cima: Cor, baixo: Cor, alfa = cima.a): Cor {
  const canal = (c: number, f: number) => c * alfa + f * (1 - alfa)
  return { r: canal(cima.r, baixo.r), g: canal(cima.g, baixo.g), b: canal(cima.b, baixo.b), a: 1 }
}

function paraHex(cor: Cor): string {
  return `#${hexDoCanal(cor.r)}${hexDoCanal(cor.g)}${hexDoCanal(cor.b)}`
}

/** Luminância relativa WCAG 2.x. */
function luminancia(cor: Cor): number {
  return 0.2126 * canalLinear(cor.r) + 0.7152 * canalLinear(cor.g) + 0.0722 * canalLinear(cor.b)
}

function razaoDeContraste(a: Cor, b: Cor): number {
  const la = luminancia(a)
  const lb = luminancia(b)
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

/** Duas casas decimais; numa falha trunca, para nunca mostrar um valor igual ao mínimo. */
function formatarRazao(valor: number, truncar = false): string {
  const mostrado = truncar ? Math.floor(valor * 100) / 100 : valor
  return `${mostrado.toFixed(2).replace('.', ',')}:1`
}

function formatarMinimo(valor: number | null): string {
  return valor === null ? '-' : `${String(valor).replace('.', ',')}:1`
}

// ---------------------------------------------------------------------------
// Leitura dos tokens do @theme
// ---------------------------------------------------------------------------

function lerTokens(css: string): Map<string, string> {
  const semComentarios = css.replace(/\/\*[\s\S]*?\*\//g, '')
  const tokens = new Map<string, string>()
  for (const inicio of semComentarios.matchAll(/@theme\b[^{;]*\{/g)) {
    let profundidade = 1
    let i = inicio.index + inicio[0].length
    const comeco = i
    while (i < semComentarios.length && profundidade > 0) {
      const c = semComentarios[i]
      if (c === '{') profundidade++
      else if (c === '}') profundidade--
      i++
    }
    const corpo = semComentarios.slice(comeco, i - 1)
    for (const d of corpo.matchAll(/--color-([a-z0-9-]+)\s*:\s*([^;{}]+);/gi)) {
      const [, nome, valor] = d
      if (nome && valor) tokens.set(nome.toLowerCase(), valor.trim())
    }
  }
  return tokens
}

function resolverToken(
  nome: string,
  tokens: ReadonlyMap<string, string>,
  visitados: readonly string[] = [],
): Cor | string {
  const valor = tokens.get(nome)
  if (valor === undefined) return `o token --color-${nome} não existe no @theme`
  if (visitados.includes(nome)) return `referência circular em --color-${nome}`
  const referencia = /^var\(\s*--color-([a-z0-9-]+)\s*\)$/i.exec(valor)?.[1]
  if (referencia) return resolverToken(referencia.toLowerCase(), tokens, [...visitados, nome])
  return (
    lerHex(valor) ??
    lerRgb(valor) ??
    lerOklch(valor) ??
    `o valor de --color-${nome} ("${valor}") não é uma cor hexadecimal, rgb() ou oklch()`
  )
}

// ---------------------------------------------------------------------------
// Execução
// ---------------------------------------------------------------------------

const relCss = path.relative(process.cwd(), FICHEIRO_CSS).split(path.sep).join('/')
if (!existsSync(FICHEIRO_CSS)) {
  console.error(`check:contrast: não encontrei ${relCss}.`)
  process.exit(1)
}
const tokens = lerTokens(readFileSync(FICHEIRO_CSS, 'utf8'))
if (tokens.size === 0) {
  console.error(`check:contrast: não encontrei tokens --color-* num bloco @theme de ${relCss}.`)
  process.exit(1)
}

interface Linha {
  par: string
  tipo: string
  razao: string
  minimo: string
  resultado: string
  uso: string
}

const linhas: Linha[] = []
const falhas: string[] = []
let verificados = 0
let passam = 0
let informativos = 0
let errosDeLeitura = 0

for (const par of PARES) {
  const minimo = MINIMO[par.tipo]
  const frente = resolverToken(par.frente, tokens)
  let fundo: Cor | string
  let rotuloFundo: string
  if (typeof par.fundo === 'string') {
    fundo = resolverToken(par.fundo, tokens)
    rotuloFundo = par.fundo
  } else {
    const camada = resolverToken(par.fundo.camada, tokens)
    const percentagem = Math.round(par.fundo.alfa * 100)
    fundo = typeof camada === 'string' ? camada : misturar(camada, BRANCO, par.fundo.alfa)
    rotuloFundo = `${par.fundo.camada} a ${percentagem}% sobre branco`
    if (typeof fundo !== 'string') rotuloFundo += ` (${paraHex(fundo)})`
  }
  const rotulo = `${par.frente} / ${rotuloFundo}`

  if (minimo === null) informativos++
  else verificados++

  if (typeof frente === 'string' || typeof fundo === 'string') {
    const motivo = [frente, fundo].filter((v): v is string => typeof v === 'string').join('; ')
    linhas.push({
      par: rotulo,
      tipo: ROTULO_TIPO[par.tipo],
      razao: '?',
      minimo: formatarMinimo(minimo),
      resultado: 'ERRO',
      uso: par.uso,
    })
    falhas.push(`${rotulo}: ${motivo}`)
    errosDeLeitura++
    continue
  }

  // Um fundo semitransparente assenta no branco; um texto semitransparente, no fundo.
  const fundoOpaco = fundo.a < 1 ? misturar(fundo, BRANCO) : fundo
  const frenteOpaca = frente.a < 1 ? misturar(frente, fundoOpaco) : frente
  const razao = razaoDeContraste(frenteOpaca, fundoOpaco)
  const passa = minimo === null || razao >= minimo
  linhas.push({
    par: rotulo,
    tipo: ROTULO_TIPO[par.tipo],
    razao: formatarRazao(razao, !passa),
    minimo: formatarMinimo(minimo),
    resultado: minimo === null ? 'informativo' : passa ? 'passa' : 'FALHA',
    uso: par.uso,
  })
  if (minimo !== null && passa) passam++
  if (!passa) {
    falhas.push(
      `${rotulo}: ${formatarRazao(razao, true)}, abaixo do mínimo de ${formatarMinimo(minimo)} (${ROTULO_TIPO[par.tipo]}: ${par.uso})`,
    )
  }
}

const cabecalho: Linha = {
  par: 'Par',
  tipo: 'Tipo',
  razao: 'Razão',
  minimo: 'Mínimo',
  resultado: 'Resultado',
  uso: 'Uso',
}
const colunas = ['par', 'tipo', 'razao', 'minimo', 'resultado'] as const
const largura = Object.fromEntries(
  colunas.map((c) => [c, Math.max(...[cabecalho, ...linhas].map((l) => l[c].length))]),
) as Record<(typeof colunas)[number], number>
const formatarLinha = (l: Linha) =>
  `  ${colunas.map((c) => (c === 'razao' ? l[c].padStart(largura[c]) : l[c].padEnd(largura[c]))).join('  ')}  ${l.uso}`

console.log(`check:contrast (${relCss}, ${tokens.size} tokens --color-* lidos do @theme)`)
console.log('  Mínimos WCAG 2.x: texto 4,5:1; texto grande, UI e componentes 3:1.\n')
console.log(formatarLinha(cabecalho))
console.log(`  ${colunas.map((c) => '-'.repeat(largura[c])).join('  ')}  ${'-'.repeat(3)}`)
for (const l of linhas) console.log(formatarLinha(l))

console.log(
  `\nPares verificados: ${verificados} (${passam} passam, ${verificados - passam} falham); informativos: ${informativos}${errosDeLeitura > 0 ? `; pares com tokens ilegíveis: ${errosDeLeitura}` : ''}.`,
)
if (falhas.length > 0) {
  console.log('\nFalhas:')
  for (const f of falhas) console.log(`  ${f}`)
  console.log(`\nResultado: falhou. Ajuste os tokens em ${relCss} (@theme) e em design/direcao-visual.md.`)
  process.exit(1)
}
console.log('\nResultado: passou.')
