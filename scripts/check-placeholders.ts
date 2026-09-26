// Verificação dos placeholders (Parte 3.3 e Anexo B do BRIEF-LMDREAMS.md).
//
// Fonte de verdade: src/. Cada PH('<chave>', '<descrição>') é um pendente dessa chave;
// somam-se os itens `placeholder: true` (testemunhos, projetos) e `confirmado: false`
// (serviços, intervalos de orçamento). Escreve sempre CONTEUDO-A-SUBSTITUIR.md.
//
// Falha sempre com erros de estrutura: "[A CONFIRMAR" escrito à mão em src/ (fora de
// src/lib/placeholders.ts) ou em index.html; PH com chave fora do registo; PH com
// descrição vazia. Com --strict (deploy), falha também com pendentes bloqueantes.
//
// Uso: tsx scripts/check-placeholders.ts [--strict] [--root <pasta>] [--out <ficheiro>]

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'
import { REGISTO_PLACEHOLDERS } from '../src/content/placeholders-registo.ts'
import type { RegistoPlaceholder } from '../src/content/placeholders-registo.ts'

// ---------------------------------------------------------------------------
// Configuração
// ---------------------------------------------------------------------------

const MARCADOR = '[A CONFIRMAR'
const FICHEIRO_PH = 'src/lib/placeholders.ts'
const FICHEIRO_EMPRESA = 'src/content/company.ts'
const NOME_SAIDA = 'CONTEUDO-A-SUBSTITUIR.md'

type FormaJuridica = 'sociedade' | 'eni'

interface ItemMarcado {
  ficheiro: string
  propriedade: 'placeholder' | 'confirmado'
  /** Valor da propriedade que torna o item pendente. */
  pendenteQuando: boolean
  chave: string
}

/** Itens de lista provisórios (Parte 3.3): contam como pendentes da chave indicada. */
const ITENS_MARCADOS: readonly ItemMarcado[] = [
  { ficheiro: 'src/content/testimonials.ts', propriedade: 'placeholder', pendenteQuando: true, chave: 'testemunhos' },
  { ficheiro: 'src/content/projects.ts', propriedade: 'placeholder', pendenteQuando: true, chave: 'projetos' },
  { ficheiro: 'src/content/services.ts', propriedade: 'confirmado', pendenteQuando: false, chave: 'servicos' },
  { ficheiro: 'src/content/contact.ts', propriedade: 'confirmado', pendenteQuando: false, chave: 'intervalos-orcamento' },
]

/** Ficheiros de código lidos com o analisador do TypeScript. */
const EXTENSOES_CODIGO = new Set(['.ts', '.tsx', '.mts', '.cts', '.js', '.jsx', '.mjs', '.cjs'])
/** Outros ficheiros de texto onde se procura o marcador escrito à mão. */
const EXTENSOES_TEXTO = new Set(['.css', '.html', '.svg', '.xml', '.json', '.md', '.txt', '.webmanifest'])

// ---------------------------------------------------------------------------
// Argumentos
// ---------------------------------------------------------------------------

const argumentos = process.argv.slice(2)

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

const ESTRITO = argumentos.includes('--strict')
const RAIZ = path.resolve(
  valorDaOpcao('--root') ?? path.join(path.dirname(fileURLToPath(import.meta.url)), '..'),
)
const opcaoSaida = valorDaOpcao('--out')
const SAIDA = opcaoSaida ? path.resolve(opcaoSaida) : path.join(RAIZ, NOME_SAIDA)

// ---------------------------------------------------------------------------
// Estado da verificação
// ---------------------------------------------------------------------------

interface Ocorrencia {
  chave: string
  ficheiro: string
  linha: number
  coluna: number
  campo: string
  descricao: string
}

interface Nota {
  ficheiro: string
  /** 0 quando não se aplica. */
  linha: number
  mensagem: string
}

const REGISTO: readonly RegistoPlaceholder[] = REGISTO_PLACEHOLDERS
const registoPorChave = new Map<string, RegistoPlaceholder>()
const ocorrencias: Ocorrencia[] = []
const erros: Nota[] = []
const avisos: Nota[] = []

for (const entrada of REGISTO) {
  if (registoPorChave.has(entrada.chave)) {
    erros.push({
      ficheiro: 'src/content/placeholders-registo.ts',
      linha: 0,
      mensagem: `a chave '${entrada.chave}' aparece mais de uma vez no registo`,
    })
  }
  registoPorChave.set(entrada.chave, entrada)
}

// ---------------------------------------------------------------------------
// Utilitários
// ---------------------------------------------------------------------------

function comparar(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0
}

function relativo(ficheiro: string): string {
  return path.relative(RAIZ, ficheiro).split(path.sep).join('/')
}

function listarFicheiros(pasta: string): string[] {
  if (!existsSync(pasta)) return []
  const saida: string[] = []
  const entradas = readdirSync(pasta, { withFileTypes: true }).toSorted((a, b) =>
    comparar(a.name, b.name),
  )
  for (const entrada of entradas) {
    if (entrada.name.startsWith('.') || entrada.name === 'node_modules') continue
    const completo = path.join(pasta, entrada.name)
    if (entrada.isDirectory()) saida.push(...listarFicheiros(completo))
    else if (entrada.isFile()) saida.push(completo)
  }
  return saida
}

function posicoes(texto: string, procurado: string): number[] {
  const saida: number[] = []
  for (let i = texto.indexOf(procurado); i !== -1; i = texto.indexOf(procurado, i + 1)) {
    saida.push(i)
  }
  return saida
}

function linhaDoIndice(texto: string, indice: number): number {
  let linha = 1
  for (let i = 0; i < indice; i++) if (texto.charCodeAt(i) === 10) linha++
  return linha
}

/** Junta espaços e quebras de linha, para descrições escritas em várias linhas. */
function compactar(texto: string): string {
  return texto.replace(/\s+/g, ' ').trim()
}

function normalizarNome(nome: string): string {
  return nome.toLowerCase().replace(/[^a-z0-9]/g, '')
}

// ---------------------------------------------------------------------------
// Leitura do código (analisador do TypeScript: comentários, JSX e textos em
// várias linhas ficam tratados corretamente)
// ---------------------------------------------------------------------------

function desembrulhar(expr: ts.Expression): ts.Expression {
  let e = expr
  while (
    ts.isParenthesizedExpression(e) ||
    ts.isAsExpression(e) ||
    ts.isSatisfiesExpression(e) ||
    ts.isNonNullExpression(e) ||
    ts.isTypeAssertionExpression(e)
  ) {
    e = e.expression
  }
  return e
}

/**
 * Valor de um texto literal: aspas simples, duplas ou crases, e concatenações com `+`.
 * Com `comSubstituicoes`, as expressões `${…}` de um template ficam como código.
 */
function avaliarTexto(
  expr: ts.Expression,
  sf: ts.SourceFile,
  comSubstituicoes: boolean,
): string | null {
  const e = desembrulhar(expr)
  if (ts.isStringLiteral(e) || ts.isNoSubstitutionTemplateLiteral(e)) return e.text
  if (ts.isTemplateExpression(e)) {
    if (!comSubstituicoes) return null
    return (
      e.head.text +
      e.templateSpans.map((s) => `\${${s.expression.getText(sf)}}${s.literal.text}`).join('')
    )
  }
  if (ts.isBinaryExpression(e) && e.operatorToken.kind === ts.SyntaxKind.PlusToken) {
    const esquerda = avaliarTexto(e.left, sf, comSubstituicoes)
    const direita = avaliarTexto(e.right, sf, comSubstituicoes)
    return esquerda === null || direita === null ? null : esquerda + direita
  }
  return null
}

function constanteDeTopo(sf: ts.SourceFile, nome: string): ts.Expression | undefined {
  for (const instrucao of sf.statements) {
    if (!ts.isVariableStatement(instrucao)) continue
    for (const decl of instrucao.declarationList.declarations) {
      if (ts.isIdentifier(decl.name) && decl.name.text === nome && decl.initializer) {
        return decl.initializer
      }
    }
  }
  return undefined
}

/** Valor de texto ou número, resolvendo constantes de topo do mesmo ficheiro. */
function avaliarValor(expr: ts.Expression, sf: ts.SourceFile, profundidade = 0): string | null {
  if (profundidade > 8) return null
  const e = desembrulhar(expr)
  if (ts.isStringLiteral(e) || ts.isNoSubstitutionTemplateLiteral(e)) return e.text
  if (ts.isNumericLiteral(e)) return e.text
  if (ts.isIdentifier(e)) {
    const valor = constanteDeTopo(sf, e.text)
    return valor ? avaliarValor(valor, sf, profundidade + 1) : null
  }
  if (ts.isTemplateExpression(e)) {
    let texto = e.head.text
    for (const s of e.templateSpans) {
      const parte = avaliarValor(s.expression, sf, profundidade + 1)
      if (parte === null) return null
      texto += parte + s.literal.text
    }
    return texto
  }
  if (ts.isBinaryExpression(e) && e.operatorToken.kind === ts.SyntaxKind.PlusToken) {
    const esquerda = avaliarValor(e.left, sf, profundidade + 1)
    const direita = avaliarValor(e.right, sf, profundidade + 1)
    return esquerda === null || direita === null ? null : esquerda + direita
  }
  return null
}

function avaliarBooleano(expr: ts.Expression, sf: ts.SourceFile, profundidade = 0): boolean | null {
  if (profundidade > 8) return null
  const e = desembrulhar(expr)
  if (e.kind === ts.SyntaxKind.TrueKeyword) return true
  if (e.kind === ts.SyntaxKind.FalseKeyword) return false
  if (ts.isIdentifier(e)) {
    const valor = constanteDeTopo(sf, e.text)
    return valor ? avaliarBooleano(valor, sf, profundidade + 1) : null
  }
  return null
}

function nomePropriedade(nome: ts.PropertyName, sf: ts.SourceFile): string {
  if (ts.isIdentifier(nome) || ts.isPrivateIdentifier(nome)) return nome.text
  if (ts.isStringLiteral(nome) || ts.isNumericLiteral(nome)) return nome.text
  return nome.getText(sf)
}

function propriedadeDoObjeto(
  obj: ts.ObjectLiteralExpression,
  nome: string,
  sf: ts.SourceFile,
): ts.Expression | undefined {
  for (const p of obj.properties) {
    if (ts.isPropertyAssignment(p) && nomePropriedade(p.name, sf) === nome) return p.initializer
    if (ts.isShorthandPropertyAssignment(p) && p.name.text === nome) return p.name
  }
  return undefined
}

function textoDaPropriedade(
  obj: ts.ObjectLiteralExpression | undefined,
  nome: string,
  sf: ts.SourceFile,
): string | null {
  const valor = obj ? propriedadeDoObjeto(obj, nome, sf) : undefined
  const texto = valor ? avaliarTexto(valor, sf, true) : null
  return texto === null ? null : compactar(texto)
}

/**
 * Caminho da propriedade onde está o nó (por exemplo "legal.name" ou
 * "privacy.sections[2].blocks[0].text[1]"). O nome da variável é omitido quando
 * coincide com o nome do ficheiro (company em company.ts).
 */
function caminhoDoCampo(no: ts.Node, sf: ts.SourceFile, rel: string): string {
  const partes: string[] = []
  let raiz: string | undefined
  let atributoJsx: string | undefined
  let filho: ts.Node = no
  let atual: ts.Node | undefined = no.parent
  while (atual && !ts.isSourceFile(atual)) {
    if (ts.isPropertyAssignment(atual)) {
      if (atual.initializer === filho) partes.unshift(`.${nomePropriedade(atual.name, sf)}`)
    } else if (ts.isShorthandPropertyAssignment(atual)) {
      partes.unshift(`.${atual.name.text}`)
    } else if (ts.isArrayLiteralExpression(atual)) {
      const indice = atual.elements.findIndex((el) => el === filho)
      partes.unshift(`[${indice}]`)
    } else if (ts.isJsxAttribute(atual)) {
      atributoJsx = atual.name.getText(sf)
    } else if (ts.isJsxSelfClosingElement(atual) || ts.isJsxOpeningElement(atual)) {
      raiz = `<${atual.tagName.getText(sf)}${atributoJsx ? ` ${atributoJsx}` : ''}>`
      break
    } else if (ts.isJsxElement(atual)) {
      raiz = `<${atual.openingElement.tagName.getText(sf)}>`
      break
    } else if (ts.isVariableDeclaration(atual) || ts.isPropertyDeclaration(atual)) {
      raiz = atual.name.getText(sf)
      break
    } else if (ts.isFunctionDeclaration(atual) || ts.isMethodDeclaration(atual)) {
      raiz = `${atual.name?.getText(sf) ?? 'função'}()`
      break
    } else if (ts.isArrowFunction(atual) || ts.isFunctionExpression(atual)) {
      partes.unshift('()')
    } else if (ts.isExportAssignment(atual)) {
      raiz = 'default'
      break
    }
    filho = atual
    atual = atual.parent
  }

  let caminho = partes.join('')
  const base = normalizarNome(path.basename(rel).replace(/\.[^.]+$/, ''))
  const omitirRaiz = raiz !== undefined && normalizarNome(raiz) === base && caminho.startsWith('.')
  if (raiz !== undefined && !omitirRaiz) caminho = raiz + caminho
  caminho = caminho.replace(/^\./, '')
  return caminho || '(campo não identificado)'
}

function eTextoLiteral(
  no: ts.Node,
): no is ts.StringLiteral | ts.NoSubstitutionTemplateLiteral | ts.TemplateLiteralLikeNode | ts.JsxText {
  return (
    ts.isStringLiteral(no) ||
    ts.isNoSubstitutionTemplateLiteral(no) ||
    ts.isTemplateHead(no) ||
    ts.isTemplateMiddle(no) ||
    ts.isTemplateTail(no) ||
    ts.isJsxText(no)
  )
}

function nomeDaChamada(no: ts.CallExpression): string | undefined {
  const alvo = no.expression
  if (ts.isIdentifier(alvo)) return alvo.text
  if (ts.isPropertyAccessExpression(alvo)) return alvo.name.text
  return undefined
}

// ---------------------------------------------------------------------------
// Análise de cada ficheiro
// ---------------------------------------------------------------------------

function tratarPH(no: ts.CallExpression, sf: ts.SourceFile, rel: string): void {
  const inicio = sf.getLineAndCharacterOfPosition(no.getStart(sf))
  const linha = inicio.line + 1
  const [argChave, argDescricao] = no.arguments
  if (!argChave) {
    erros.push({ ficheiro: rel, linha, mensagem: 'PH() sem chave nem descrição' })
    return
  }
  const chave = avaliarTexto(argChave, sf, false)
  if (chave === null) {
    erros.push({
      ficheiro: rel,
      linha,
      mensagem: `PH com uma chave que não é texto literal (${argChave.getText(sf)}); não é possível verificá-la no registo`,
    })
    return
  }
  if (!registoPorChave.has(chave)) {
    erros.push({
      ficheiro: rel,
      linha,
      mensagem: `PH com a chave '${chave}', que não existe no registo (src/content/placeholders-registo.ts)`,
    })
    return
  }
  let descricao = argDescricao
    ? (avaliarTexto(argDescricao, sf, true) ?? avaliarValor(argDescricao, sf))
    : ''
  if (argDescricao && descricao === null) {
    descricao = argDescricao.getText(sf)
    avisos.push({
      ficheiro: rel,
      linha,
      mensagem: `PH('${chave}') com uma descrição que não é texto literal; o ficheiro gerado mostra o código (${compactar(descricao)})`,
    })
  }
  descricao = compactar(descricao ?? '')
  if (!descricao) {
    // Continua a ser um pendente da chave, mas sem descrição o site mostraria um marcador vazio.
    erros.push({
      ficheiro: rel,
      linha,
      mensagem: argDescricao
        ? `PH('${chave}') com a descrição vazia`
        : `PH('${chave}') sem descrição`,
    })
    descricao = '(sem descrição)'
  }
  ocorrencias.push({
    chave,
    ficheiro: rel,
    linha,
    coluna: inicio.character + 1,
    campo: caminhoDoCampo(no, sf, rel),
    descricao,
  })
}

function descreverItem(
  item: ItemMarcado,
  obj: ts.ObjectLiteralExpression | undefined,
  sf: ts.SourceFile,
): string {
  const id = textoDaPropriedade(obj, 'id', sf)
  const nome = textoDaPropriedade(obj, 'nome', sf) ?? textoDaPropriedade(obj, 'name', sf)
  const identificacao = [id ? `"${id}"` : null, nome && nome !== id ? `(${nome})` : null]
    .filter((p): p is string => p !== null)
    .join(' ')
  switch (item.chave) {
    case 'testemunhos':
      return `Testemunho provisório ${identificacao}`.trim()
    case 'projetos':
      return `Projeto provisório ${identificacao}`.trim()
    case 'servicos': {
      const descricao =
        textoDaPropriedade(obj, 'description', sf) ?? textoDaPropriedade(obj, 'descricao', sf)
      const titulo = nome ?? id
      return `Serviço ${titulo ? `"${titulo}"` : 'sem nome'} por confirmar${descricao ? `; descrição proposta: "${descricao}"` : ''}`
    }
    case 'intervalos-orcamento': {
      const lista = obj ? propriedadeDoObjeto(obj, 'options', sf) : undefined
      const elementos = lista ? desembrulhar(lista) : undefined
      if (elementos && ts.isArrayLiteralExpression(elementos) && elementos.elements.length > 0) {
        const opcoes = elementos.elements.map(
          (el) => `"${compactar(avaliarTexto(el, sf, true) ?? el.getText(sf))}"`,
        )
        return `Intervalos propostos: ${opcoes.join('; ')}`
      }
      return 'Intervalos propostos por confirmar'
    }
    default:
      return `Item por confirmar ${identificacao}`.trim()
  }
}

function tratarItemMarcado(
  no: ts.PropertyAssignment | ts.ShorthandPropertyAssignment,
  item: ItemMarcado,
  sf: ts.SourceFile,
  rel: string,
): void {
  const valor = ts.isShorthandPropertyAssignment(no)
    ? avaliarBooleano(no.name, sf)
    : avaliarBooleano(no.initializer, sf)
  const linha = sf.getLineAndCharacterOfPosition(no.getStart(sf)).line + 1
  if (valor === null) {
    avisos.push({
      ficheiro: rel,
      linha,
      mensagem: `"${item.propriedade}" sem valor literal (true ou false); não foi contado`,
    })
    return
  }
  if (valor !== item.pendenteQuando) return
  const obj = ts.isObjectLiteralExpression(no.parent) ? no.parent : undefined
  const alvo = ts.isShorthandPropertyAssignment(no) ? no.name : no.initializer
  ocorrencias.push({
    chave: item.chave,
    ficheiro: rel,
    linha,
    coluna: sf.getLineAndCharacterOfPosition(no.getStart(sf)).character + 1,
    campo: caminhoDoCampo(alvo, sf, rel),
    descricao: descreverItem(item, obj, sf),
  })
}

function analisarCodigo(rel: string, texto: string): void {
  const extensao = path.extname(rel)
  const tipo =
    extensao === '.tsx'
      ? ts.ScriptKind.TSX
      : extensao === '.jsx'
        ? ts.ScriptKind.JSX
        : ['.js', '.mjs', '.cjs'].includes(extensao)
          ? ts.ScriptKind.JS
          : ts.ScriptKind.TS
  const sf = ts.createSourceFile(rel, texto, ts.ScriptTarget.Latest, true, tipo)
  const item = ITENS_MARCADOS.find((i) => i.ficheiro === rel)
  const procurarMarcador = rel !== FICHEIRO_PH
  const textosComMarcador: [number, number][] = []

  const visitar = (no: ts.Node): void => {
    if (ts.isCallExpression(no) && nomeDaChamada(no) === 'PH') tratarPH(no, sf, rel)
    if (
      item &&
      (ts.isPropertyAssignment(no) || ts.isShorthandPropertyAssignment(no)) &&
      nomePropriedade(no.name, sf) === item.propriedade
    ) {
      tratarItemMarcado(no, item, sf, rel)
    }
    if (procurarMarcador && eTextoLiteral(no) && no.text.includes(MARCADOR)) {
      const inicio = no.getStart(sf)
      textosComMarcador.push([inicio, no.end])
      erros.push({
        ficheiro: rel,
        linha: sf.getLineAndCharacterOfPosition(inicio).line + 1,
        mensagem: `"${MARCADOR}" escrito à mão; use PH(chave, descrição) de src/lib/placeholders.ts`,
      })
    }
    ts.forEachChild(no, visitar)
  }
  visitar(sf)

  // O marcador fora de textos (em comentários) não chega ao site: só aviso.
  if (!procurarMarcador) return
  for (const pos of posicoes(texto, MARCADOR)) {
    if (textosComMarcador.some(([a, b]) => pos >= a && pos < b)) continue
    avisos.push({
      ficheiro: rel,
      linha: linhaDoIndice(texto, pos),
      mensagem: `"${MARCADOR}" num comentário (ignorado; prefira descrever o formato sem o marcador)`,
    })
  }
}

function intervalosDeComentario(texto: string, extensao: string): [number, number][] {
  const padrao =
    extensao === '.css'
      ? /\/\*[\s\S]*?\*\//g
      : ['.html', '.svg', '.xml'].includes(extensao)
        ? /<!--[\s\S]*?-->/g
        : null
  if (!padrao) return []
  return [...texto.matchAll(padrao)].map((m) => [m.index, m.index + m[0].length])
}

function analisarTexto(rel: string, texto: string): void {
  const comentarios = intervalosDeComentario(texto, path.extname(rel))
  for (const pos of posicoes(texto, MARCADOR)) {
    const linha = linhaDoIndice(texto, pos)
    if (comentarios.some(([a, b]) => pos >= a && pos < b)) {
      avisos.push({ ficheiro: rel, linha, mensagem: `"${MARCADOR}" num comentário (ignorado)` })
    } else {
      erros.push({
        ficheiro: rel,
        linha,
        mensagem: `"${MARCADOR}" escrito à mão; os placeholders só se criam com PH(chave, descrição)`,
      })
    }
  }
}

// ---------------------------------------------------------------------------
// Forma jurídica e dados já preenchidos (src/content/company.ts)
// ---------------------------------------------------------------------------

function lerFormaJuridica(texto: string | undefined): { forma: FormaJuridica; lida: boolean } {
  const m = /const\s+legalForm\s*:\s*LegalForm\s*=\s*(['"`])(sociedade|eni)\1/.exec(texto ?? '')
  const forma = m?.[2]
  if (forma === 'sociedade' || forma === 'eni') return { forma, lida: true }
  avisos.push({
    ficheiro: FICHEIRO_EMPRESA,
    linha: 0,
    mensagem:
      "não foi possível ler a forma jurídica (const legalForm: LegalForm = 'sociedade' | 'eni'); considera-se 'sociedade'",
  })
  return { forma: 'sociedade', lida: false }
}

interface DadoPreenchido {
  rotulo: string
  valor: string | null
  campo: string
  nota?: string
}

function lerDadosEmpresa(texto: string | undefined): DadoPreenchido[] {
  const sf = texto
    ? ts.createSourceFile(FICHEIRO_EMPRESA, texto, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
    : undefined
  const inicial = sf ? constanteDeTopo(sf, 'company') : undefined
  const empresa = inicial ? desembrulhar(inicial) : undefined
  const obj = empresa && ts.isObjectLiteralExpression(empresa) ? empresa : undefined

  const valor = (caminho: string): string | null => {
    if (!sf || !obj) return null
    let atual: ts.Expression | undefined = obj
    for (const parte of caminho.split('.')) {
      const e: ts.Expression | undefined = atual ? desembrulhar(atual) : undefined
      atual = e && ts.isObjectLiteralExpression(e) ? propriedadeDoObjeto(e, parte, sf) : undefined
    }
    return atual ? avaliarValor(atual, sf) : null
  }

  const whatsapp = valor('whatsapp.number')
  const anos = valor('experienceYears')
  return [
    {
      rotulo: 'Telefone',
      valor: valor('phone.display'),
      campo: 'phone',
      nota: '`display`, `href` e `e164` mudam em conjunto',
    },
    {
      rotulo: 'WhatsApp',
      valor: whatsapp && /^351\d{9}$/.test(whatsapp)
        ? `+351 ${whatsapp.slice(3, 6)} ${whatsapp.slice(6, 9)} ${whatsapp.slice(9)}`
        : whatsapp,
      campo: 'whatsapp',
      nota: 'número (`number`) e mensagem inicial (`message`)',
    },
    { rotulo: 'E-mail', valor: valor('email'), campo: 'email' },
    { rotulo: 'Área de atuação', valor: valor('areaServed'), campo: 'areaServed' },
    {
      rotulo: 'Experiência',
      valor: valor('experienceText') ?? (anos ? `mais de ${anos} anos` : null),
      campo: 'experienceYears',
      nota: 'experiência dos profissionais (nunca a idade da empresa), da qual deriva o texto `experienceText` (ver a chave `experiencia`)',
    },
    {
      rotulo: 'Tipo de chamada',
      valor: valor('phoneCallNote'),
      campo: 'phoneCallNote',
      nota: 'acompanha cada ocorrência visível do número e tem de ser ajustado se o número passar a uma rede fixa',
    },
  ]
}

// ---------------------------------------------------------------------------
// Ficheiro gerado
// ---------------------------------------------------------------------------

/** Escapa os caracteres que o Markdown interpretaria em texto corrido. */
function md(texto: string): string {
  return texto.replace(/[\\`*<]/g, (c) => `\\${c}`)
}

function bloqueia(entrada: RegistoPlaceholder, forma: FormaJuridica): boolean {
  if (entrada.bloqueia === 'sim') return true
  if (entrada.bloqueia === 'se-sociedade' || entrada.bloqueia === 'se-aplicavel') {
    return forma === 'sociedade'
  }
  return false
}

function textoBloqueio(entrada: RegistoPlaceholder, forma: FormaJuridica): string {
  if (entrada.bloqueia !== 'se-sociedade' && entrada.bloqueia !== 'se-aplicavel') {
    return md(entrada.bloqueiaTexto)
  }
  const estado =
    forma === 'sociedade'
      ? 'a forma jurídica atual é sociedade, por isso bloqueia'
      : 'a forma jurídica atual é empresário em nome individual, por isso não bloqueia'
  return `${md(entrada.bloqueiaTexto)} (${estado})`
}

function blocoDaChave(
  entrada: RegistoPlaceholder,
  lista: readonly Ocorrencia[],
  forma: FormaJuridica,
): string[] {
  return [
    `### \`${entrada.chave}\` (${lista.length})`,
    '',
    `- Onde aparece: ${md(entrada.ondeAparece)}`,
    `- Ficheiro e campo: ${md(entrada.ficheiroCampo)}`,
    `- O que fornecer: ${md(entrada.oQueFornecer)}`,
    `- Bloqueia publicação: ${textoBloqueio(entrada, forma)}`,
    `- Ocorrências:`,
    ...lista.map((o) => `  - \`${o.ficheiro}:${o.linha}\`, campo \`${o.campo}\`: ${md(o.descricao)}`),
    '',
  ]
}

function gerarMarkdown(
  porChave: ReadonlyMap<string, Ocorrencia[]>,
  forma: FormaJuridica,
  formaLida: boolean,
  dados: readonly DadoPreenchido[],
): string {
  const comPendentes = REGISTO.filter((r) => (porChave.get(r.chave)?.length ?? 0) > 0)
  const bloqueantes = comPendentes.filter((r) => bloqueia(r, forma))
  const outros = comPendentes.filter((r) => !bloqueia(r, forma))
  const semOcorrencias = REGISTO.filter((r) => !porChave.has(r.chave))
  const contar = (lista: readonly RegistoPlaceholder[]) =>
    lista.reduce((soma, r) => soma + (porChave.get(r.chave)?.length ?? 0), 0)
  const email = dados.find((d) => d.campo === 'email')?.valor

  const linhas: string[] = [
    '# Conteúdo a substituir',
    '',
    '> Ficheiro gerado por `npm run check:placeholders`. Não o edite à mão: é reescrito em cada execução, a partir de `src/` e do registo `src/content/placeholders-registo.ts` (Anexo B do brief).',
    '',
    'Lista os dados que ainda faltam no site: os placeholders criados com `PH(chave, descrição)`, que o site mostra como `[A CONFIRMAR: descrição]`, os testemunhos e projetos provisórios (`placeholder: true`) e os serviços e intervalos de orçamento por confirmar (`confirmado: false`).',
    '',
    '## Como substituir',
    '',
    '1. Abra o ficheiro indicado em cada ocorrência (`ficheiro:linha`) e encontre o campo.',
    "2. Troque a chamada `PH('chave', 'descrição')` pelo valor real, entre aspas: por exemplo, `name: PH('denominacao-social', 'denominação social')` passa a `name: 'Denominação real'`.",
    '3. Um campo que a empresa confirme não se aplicar (por exemplo, o capital realizado ou o capital próprio) passa a `null` e deixa de ser pendente.',
    '4. Testemunhos e projetos provisórios: substitua os dados pelos reais e mude `placeholder: true` para `placeholder: false`. Serviços e intervalos de orçamento: depois de a empresa validar o texto, mude `confirmado: false` para `confirmado: true`.',
    '5. Corra `npm run check:placeholders` para atualizar este ficheiro. A publicação usa `npm run check:placeholders -- --strict`, que falha enquanto houver pendentes em "Bloqueia publicação".',
    '',
    '## Resumo',
    '',
    `- Pendentes: ${contar(comPendentes)}, em ${comPendentes.length} chaves`,
    `- Bloqueiam a publicação: ${contar(bloqueantes)}, em ${bloqueantes.length} chaves`,
    `- Outros pendentes: ${contar(outros)}, em ${outros.length} chaves`,
    `- Chaves do registo sem ocorrências (só informação): ${semOcorrencias.length}`,
    `- Erros de estrutura: ${erros.length}`,
    `- Forma jurídica considerada: ${forma === 'sociedade' ? 'sociedade' : 'empresário em nome individual'} (${formaLida ? '`legalForm` em `src/content/company.ts`' : 'valor por omissão: não foi possível ler `legalForm` em `src/content/company.ts`'}). As chaves "Sim, se for sociedade" e "Sim, se aplicável" só bloqueiam quando a forma jurídica é sociedade.`,
    '',
  ]

  if (erros.length > 0) {
    linhas.push(
      '## Erros de estrutura',
      '',
      'Estes erros fazem falhar sempre o `npm run check:placeholders`:',
      '',
      ...erros.map(
        (e) => `- \`${e.ficheiro}${e.linha > 0 ? `:${e.linha}` : ''}\`: ${md(e.mensagem)}`,
      ),
      '',
    )
  }

  linhas.push('## Bloqueia publicação', '')
  if (bloqueantes.length === 0) linhas.push('Nenhum pendente bloqueia a publicação.', '')
  for (const r of bloqueantes) linhas.push(...blocoDaChave(r, porChave.get(r.chave) ?? [], forma))

  linhas.push('## Outros pendentes', '')
  if (outros.length === 0) linhas.push('Não há outros pendentes.', '')
  for (const r of outros) linhas.push(...blocoDaChave(r, porChave.get(r.chave) ?? [], forma))

  linhas.push(
    '## Chaves do registo sem ocorrências',
    '',
    'Só para informação: estas chaves não têm pendentes no código. É normal, porque são dados já preenchidos, opcionais ou tratados fora do código.',
    '',
  )
  if (semOcorrencias.length === 0) linhas.push('Todas as chaves do registo têm ocorrências.')
  for (const r of semOcorrencias) {
    linhas.push(
      `- \`${r.chave}\`: ${md(r.oQueFornecer)}`,
      `  - Onde aparece: ${md(r.ondeAparece)}`,
      `  - Ficheiro e campo: ${md(r.ficheiroCampo)}`,
    )
  }
  linhas.push(
    '',
    '## Dados já preenchidos que podem mudar',
    '',
    'Estes dados já estão no site. Se mudarem, altere-os no ficheiro e no campo indicados.',
    '',
  )
  for (const d of dados) {
    const valor = d.valor === null ? '(valor não encontrado)' : `"${md(d.valor)}"`
    linhas.push(
      `- ${d.rotulo}: ${valor}, em \`${FICHEIRO_EMPRESA}\` → \`${d.campo}\`${d.nota ? `; ${d.nota}` : ''}.`,
    )
  }

  linhas.push(
    '',
    '## Para o jurista',
    '',
    'As páginas legais (Política de privacidade, Política de cookies e Termos e condições) e o bloco "Informação legal" do rodapé são **minutas**: têm de ser validadas por um jurista ou por um contabilista antes da publicação. Seguem a Parte 5.6 do brief, com placeholders onde faltam dados, e não substituem aconselhamento jurídico.',
    '',
    '### Pontos que a pesquisa não confirmou',
    '',
    'A pesquisa de referência foi feita a 24 de setembro de 2026. Falta confirmar:',
    '',
    '- As alterações de 2025 e 2026 ao DL n.º 156/2005 (Livro de Reclamações): DL n.º 103/2025, Lei n.º 69/2025 e DL n.º 102/2026.',
    '- O DL n.º 59/2021, quanto à indicação do tipo de chamada junto ao número de telefone.',
    '- A redação atual do art. 18.º da Lei n.º 144/2015 (informação sobre a resolução alternativa de litígios).',
    '- O art. 50.º do Regulamento (UE) 2024/1689 (Regulamento da IA), depois do Regulamento (UE) 2026/1744, quanto à legenda das imagens geradas por IA.',
    '- A transposição da Diretiva (UE) 2024/825 (alegações ambientais e práticas comerciais).',
    '',
  )
  if (email && /@gmail\.com$/i.test(email)) {
    linhas.push(
      '### E-mail de contacto',
      '',
      `O e-mail de contacto (${md(email)}) é uma conta Gmail pessoal. Para tratar pedidos de clientes, convém um e-mail profissional com contrato de subcontratação (RGPD, art. 28.º). A decisão é da empresa: os contactos do site só mudam com essa decisão.`,
      '',
    )
  }
  linhas.push(
    '### A fazer fora do código',
    '',
    '- Registar a empresa no Livro de Reclamações Eletrónico (https://www.livroreclamacoes.pt/inicio) e descarregar o ícone oficial, sem o redesenhar, para `public/livro-reclamacoes.svg` (chave `icone-livro-reclamacoes`).',
    '- Confirmar com a empresa a lista de serviços, com o nome e a descrição de cada um (`src/content/services.ts` → `confirmado`).',
    '- Escolher o serviço de formulários e definir as Repository variables `VITE_FORM_ENDPOINT`, `VITE_FORM_ACCEPTS_FILES` e, se o serviço exigir, `VITE_FORM_ACCESS_KEY` (chave `endpoint-formulario`). Até lá, o formulário usa a alternativa por e-mail.',
    '',
  )
  return linhas.join('\n')
}

// ---------------------------------------------------------------------------
// Execução
// ---------------------------------------------------------------------------

const ficheiros = listarFicheiros(path.join(RAIZ, 'src'))
const indexHtml = path.join(RAIZ, 'index.html')
if (existsSync(indexHtml)) ficheiros.push(indexHtml)

const textos = new Map<string, string>()
let analisados = 0
for (const ficheiro of ficheiros) {
  const rel = relativo(ficheiro)
  const extensao = path.extname(ficheiro).toLowerCase()
  if (!EXTENSOES_CODIGO.has(extensao) && !EXTENSOES_TEXTO.has(extensao)) continue
  const texto = readFileSync(ficheiro, 'utf8')
  textos.set(rel, texto)
  analisados++
  if (EXTENSOES_CODIGO.has(extensao)) analisarCodigo(rel, texto)
  else analisarTexto(rel, texto)
}

const textoEmpresa = textos.get(FICHEIRO_EMPRESA)
const { forma, lida: formaLida } = lerFormaJuridica(textoEmpresa)
const dados = lerDadosEmpresa(textoEmpresa)

const ordemDaChave = new Map(REGISTO.map((r, i) => [r.chave, i]))
ocorrencias.sort(
  (a, b) =>
    (ordemDaChave.get(a.chave) ?? 0) - (ordemDaChave.get(b.chave) ?? 0) ||
    comparar(a.ficheiro, b.ficheiro) ||
    a.linha - b.linha ||
    a.coluna - b.coluna,
)
const ordenarNotas = (a: Nota, b: Nota) => comparar(a.ficheiro, b.ficheiro) || a.linha - b.linha
erros.sort(ordenarNotas)
avisos.sort(ordenarNotas)

const porChave = new Map<string, Ocorrencia[]>()
for (const o of ocorrencias) {
  const lista = porChave.get(o.chave) ?? []
  lista.push(o)
  porChave.set(o.chave, lista)
}

mkdirSync(path.dirname(SAIDA), { recursive: true })
writeFileSync(SAIDA, gerarMarkdown(porChave, forma, formaLida, dados), 'utf8')

// ---------------------------------------------------------------------------
// Resumo na consola
// ---------------------------------------------------------------------------

const nomeSaida = path.relative(process.cwd(), SAIDA).split(path.sep).join('/') || NOME_SAIDA
const chavesBloqueantes = REGISTO.filter(
  (r) => porChave.has(r.chave) && bloqueia(r, forma),
)
const totalBloqueantes = chavesBloqueantes.reduce(
  (soma, r) => soma + (porChave.get(r.chave)?.length ?? 0),
  0,
)
const local = (n: Nota) => `${n.ficheiro}${n.linha > 0 ? `:${n.linha}` : ''}`

console.log(`check:placeholders${ESTRITO ? ' --strict' : ''}`)
console.log(`  Ficheiros analisados: ${analisados} (src/ e index.html)`)
console.log(
  `  Forma jurídica: ${forma}${formaLida ? '' : ' (valor por omissão)'}`,
)
console.log(
  `  Pendentes: ${ocorrencias.length} em ${porChave.size} chaves; bloqueiam a publicação: ${totalBloqueantes} em ${chavesBloqueantes.length} chaves`,
)
console.log(`  Ficheiro gerado: ${nomeSaida}`)

if (avisos.length > 0) {
  console.log(`\nAvisos (${avisos.length}, não fazem falhar):`)
  for (const a of avisos) console.log(`  ${local(a)}  ${a.mensagem}`)
}

if (erros.length > 0) {
  console.log(`\nErros de estrutura (${erros.length}, falham sempre):`)
  for (const e of erros) console.log(`  ${local(e)}  ${e.mensagem}`)
}

const falhaEstrita = ESTRITO && totalBloqueantes > 0
if (chavesBloqueantes.length > 0) {
  if (ESTRITO) {
    console.log(`\nPendentes que bloqueiam a publicação (${totalBloqueantes}):`)
    for (const r of chavesBloqueantes) {
      const lista = porChave.get(r.chave) ?? []
      console.log(`  ${r.chave} (${lista.length}): ${r.oQueFornecer}`)
      for (const o of lista) console.log(`    ${o.ficheiro}:${o.linha}  ${o.campo}: ${o.descricao}`)
    }
    console.log(`\nPreencha os dados marcados Bloqueia publicação em ${NOME_SAIDA}.`)
  } else {
    console.log(
      `\nCom --strict (deploy), ${totalBloqueantes} pendentes bloqueariam a publicação: ${chavesBloqueantes.map((r) => r.chave).join(', ')}.`,
    )
  }
}

if (erros.length > 0 || falhaEstrita) {
  console.log('\nResultado: falhou.')
  process.exit(1)
}
console.log('\nResultado: passou.')
