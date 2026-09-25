// Servidor estático que imita o GitHub Pages (Parte 3.12): serve a pasta de saída
// debaixo do base path, com índice de pastas, 301 para a barra final, 404.html com
// estado 404 e `Cache-Control: max-age=600`. Sem dependências.
//
// Uso: tsx scripts/serve-dist.ts [--dir dist] [--base /LMDreams/] [--port 4173]
// Também é importado: `startServer()` e os pequenos auxiliares de linha de comandos.

import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import zlib from 'node:zlib'

export const DEFAULT_BASE = '/LMDreams/'
export const DEFAULT_PORT = 4173
export const DEFAULT_SITE_URL = 'https://wakenac.github.io/LMDreams'

const MIME: Readonly<Record<string, string>> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
}

// O GitHub Pages comprime o texto em gzip; sem isto o Lighthouse local penalizaria
// a "compressão de texto", que no site publicado já existe.
const COMPRESSIBLE = new Set(['.html', '.css', '.js', '.mjs', '.json', '.map', '.webmanifest', '.xml', '.txt', '.svg'])

// ---------------------------------------------------------------------------
// Auxiliares partilhados pelos scripts de verificação
// ---------------------------------------------------------------------------

/** Valor de `--nome valor` ou `--nome=valor`; undefined se a opção não existir. */
export function argValue(name: string, argv: readonly string[] = process.argv.slice(2)): string | undefined {
  const flag = `--${name}`
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === flag) {
      const next = argv[i + 1]
      if (next === undefined || next.startsWith('--')) throw new Error(`A opção ${flag} precisa de um valor.`)
      return next
    }
    if (arg?.startsWith(`${flag}=`)) return arg.slice(flag.length + 1)
  }
  return undefined
}

/** Normaliza o base path para começar e acabar em "/" e valida-o (Parte 3.5). */
export function normalizeBase(raw: string): string {
  const trimmed = raw.trim()
  if (/^[A-Za-z]:[\\/]/.test(trimmed)) {
    throw new Error(
      `Base path inválido: "${raw}". Parece um caminho do Windows: o Git Bash converte "/…" em ` +
        '"C:/Program Files/Git/…". Corre o comando pelos scripts npm, no PowerShell ou na linha de comandos do Windows.',
    )
  }
  let base = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  if (!base.endsWith('/')) base += '/'
  if (!/^\/([\w.-]+\/)*$/.test(base)) {
    throw new Error(`Base path inválido: "${raw}" (esperado, por exemplo, /LMDreams/ ou /).`)
  }
  return base
}

function comparablePath(file: string): string {
  const resolved = path.resolve(file).replace(/\.[cm]?[jt]s$/, '')
  return process.platform === 'win32' ? resolved.toLowerCase() : resolved
}

/** Verdadeiro quando o ficheiro de `metaUrl` foi o corrido diretamente (e não importado). */
export function isMainModule(metaUrl: string): boolean {
  const entry = process.argv[1]
  return entry !== undefined && comparablePath(fileURLToPath(metaUrl)) === comparablePath(entry)
}

// ---------------------------------------------------------------------------
// Resposta a um pedido (função pura sobre o disco, testável sem rede)
// ---------------------------------------------------------------------------

export interface ServeConfig {
  /** Pasta servida (caminho absoluto). */
  root: string
  /** Base path normalizado, por exemplo "/LMDreams/". */
  base: string
}

export interface ResponsePlan {
  status: number
  headers: Record<string, string>
  body: Buffer
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] ?? c)
}

function isFile(file: string): boolean {
  try {
    return fs.statSync(file).isFile()
  } catch {
    return false
  }
}

function isDirectory(file: string): boolean {
  try {
    return fs.statSync(file).isDirectory()
  } catch {
    return false
  }
}

function fileResponse(file: string, status: number, acceptEncoding: string): ResponsePlan {
  const ext = path.extname(file).toLowerCase()
  let body = fs.readFileSync(file)
  const headers: Record<string, string> = {
    'Content-Type': MIME[ext] ?? 'application/octet-stream',
    'Cache-Control': 'max-age=600',
    'Last-Modified': fs.statSync(file).mtime.toUTCString(),
  }
  if (COMPRESSIBLE.has(ext)) {
    headers.Vary = 'Accept-Encoding'
    if (body.length > 0 && /\bgzip\b/i.test(acceptEncoding)) {
      body = zlib.gzipSync(body)
      headers['Content-Encoding'] = 'gzip'
    }
  }
  headers['Content-Length'] = String(body.length)
  return { status, headers, body }
}

function simpleResponse(status: number, html: string, extra: Record<string, string> = {}): ResponsePlan {
  const body = Buffer.from(html, 'utf8')
  return {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'max-age=600',
      'Content-Length': String(body.length),
      ...extra,
    },
    body,
  }
}

function redirect(location: string): ResponsePlan {
  const safe = escapeHtml(location)
  return simpleResponse(301, `<!doctype html><title>301</title><a href="${safe}">${safe}</a>\n`, { Location: location })
}

function notFound(config: ServeConfig, acceptEncoding: string): ResponsePlan {
  const page = path.join(config.root, '404.html')
  if (isFile(page)) return fileResponse(page, 404, acceptEncoding)
  return simpleResponse(404, '<!doctype html><html lang="pt-PT"><title>404</title><h1>Página não encontrada</h1></html>\n')
}

/**
 * Decide a resposta a um pedido como o GitHub Pages faria. Não escreve nada na rede:
 * o servidor HTTP só envia o resultado.
 */
export function planResponse(config: ServeConfig, method: string, rawUrl: string, acceptEncoding = ''): ResponsePlan {
  if (method !== 'GET' && method !== 'HEAD') {
    return simpleResponse(405, '<!doctype html><title>405</title><h1>Método não permitido</h1>\n', { Allow: 'GET, HEAD' })
  }

  let url: URL
  try {
    // Prefixar a origem impede que "//outro.dominio/" seja lido como outro anfitrião.
    url = rawUrl.startsWith('/') ? new URL(`http://localhost${rawUrl}`) : new URL(rawUrl)
  } catch {
    return simpleResponse(400, '<!doctype html><title>400</title><h1>Pedido inválido</h1>\n')
  }

  let pathname: string
  try {
    pathname = decodeURIComponent(url.pathname)
  } catch {
    return simpleResponse(400, '<!doctype html><title>400</title><h1>Pedido inválido</h1>\n')
  }
  if (pathname.includes('\0')) return simpleResponse(400, '<!doctype html><title>400</title><h1>Pedido inválido</h1>\n')

  const { base, root } = config
  if (!pathname.startsWith(base)) {
    // "/" e "/LMDreams" (sem barra) levam ao base path; o resto não existe.
    if (base !== '/' && (pathname === '/' || pathname === base.slice(0, -1))) return redirect(base + url.search)
    return notFound(config, acceptEncoding)
  }

  const rel = pathname.slice(base.length)
  const target = path.resolve(root, rel)
  const relative = path.relative(root, target)
  if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    return notFound(config, acceptEncoding)
  }

  if (isDirectory(target)) {
    const index = path.join(target, 'index.html')
    if (!isFile(index)) return notFound(config, acceptEncoding)
    if (!pathname.endsWith('/')) return redirect(`${url.pathname}/${url.search}`)
    return fileResponse(index, 200, acceptEncoding)
  }
  if (isFile(target)) return fileResponse(target, 200, acceptEncoding)
  // O GitHub Pages também serve "pagina.html" quando se pede "pagina".
  if (!pathname.endsWith('/') && isFile(`${target}.html`)) return fileResponse(`${target}.html`, 200, acceptEncoding)
  return notFound(config, acceptEncoding)
}

// ---------------------------------------------------------------------------
// Servidor HTTP
// ---------------------------------------------------------------------------

export interface StartOptions {
  /** Pasta a servir (por omissão OUT_DIR ou "dist"). */
  dir?: string
  /** Base path (por omissão "/LMDreams/"). */
  base?: string
  /** Porta (por omissão 4173; 0 escolhe uma livre). */
  port?: number
  /** Endereço de escuta (por omissão 127.0.0.1). */
  host?: string
}

export interface RunningServer {
  url: string
  port: number
  close: () => Promise<void>
}

export async function startServer(options: StartOptions = {}): Promise<RunningServer> {
  const root = path.resolve(options.dir ?? process.env.OUT_DIR ?? 'dist')
  const base = normalizeBase(options.base ?? DEFAULT_BASE)
  const port = options.port ?? DEFAULT_PORT
  const host = options.host ?? '127.0.0.1'
  if (!isDirectory(root)) {
    throw new Error(`A pasta "${root}" não existe. Corre primeiro "npm run build:pages".`)
  }

  const config: ServeConfig = { root, base }
  const server = http.createServer((req, res) => {
    let plan: ResponsePlan
    try {
      plan = planResponse(config, req.method ?? 'GET', req.url ?? '/', String(req.headers['accept-encoding'] ?? ''))
    } catch (error) {
      console.error(error)
      plan = simpleResponse(500, '<!doctype html><title>500</title><h1>Erro interno</h1>\n')
    }
    res.writeHead(plan.status, plan.headers)
    res.end(req.method === 'HEAD' ? undefined : plan.body)
  })

  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(port, host, () => {
      server.off('error', reject)
      resolve()
    })
  })

  const address = server.address()
  const actualPort = typeof address === 'object' && address ? address.port : port
  return {
    url: `http://localhost:${actualPort}${base}`,
    port: actualPort,
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()))
        server.closeAllConnections()
      }),
  }
}

async function main(): Promise<void> {
  const dir = argValue('dir') ?? process.env.OUT_DIR ?? 'dist'
  const base = normalizeBase(argValue('base') ?? process.env.BASE_PATH ?? DEFAULT_BASE)
  const portRaw = argValue('port') ?? process.env.PORT
  const port = portRaw === undefined ? DEFAULT_PORT : Number(portRaw)
  if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error(`Porta inválida: ${portRaw}`)

  let server: RunningServer
  try {
    server = await startServer({ dir, base, port })
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'EADDRINUSE') {
      throw new Error(`A porta ${port} já está em uso. Termina o outro servidor ou usa --port <outra>.`, {
        cause: error,
      })
    }
    throw error
  }

  console.log(`A servir ${path.relative(process.cwd(), path.resolve(dir)) || '.'} como o GitHub Pages (base ${base}).`)
  console.log(`  ${server.url}`)
  console.log('Ctrl+C para terminar.')

  const stop = () => {
    console.log('\nA terminar o servidor…')
    server.close().then(
      () => process.exit(0),
      () => process.exit(1),
    )
  }
  process.once('SIGINT', stop)
  process.once('SIGTERM', stop)
}

if (isMainModule(import.meta.url)) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  })
}
