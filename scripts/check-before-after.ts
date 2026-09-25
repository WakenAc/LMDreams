// Galeria antes e depois com fotografias (Anexo A §7, A7-15; Partes 1.4, regra 10, e 3.10).
//
// Enquanto nenhum projeto tiver fotografias publicadas, o site não mostra o comparador nem a
// galeria estática, e os testes E2E não os podem exercitar. Este script renderiza os dois
// componentes de src/components/ui/BeforeAfter.tsx com react-dom/server e duas fotografias
// de teste (só dados: nada é descarregado) e verifica o HTML:
// - comparador: <input type="range"> com etiqueta associada (<label for>), aria-valuetext,
//   as etiquetas "Antes" e "Depois" à volta e o recorte (clip-path) da fotografia "depois";
// - galeria estática (sem JavaScript): cada fotografia com alt, largura e altura, e a
//   legenda "Antes" ou "Depois";
// - fotografias sem par: mostradas sem comparador;
// - sem fotografias: os dois placeholders e o texto a explicar.
// Não precisa de variáveis de configuração. Uso: tsx scripts/check-before-after.ts
import { registerHooks } from 'node:module'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { parse, type HTMLElement } from 'node-html-parser'
import * as React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

// Tipos locais, com a forma de ProjectPhoto e ProjectsContent (src/content/tipos.ts), que
// não entra no programa TypeScript dos scripts (resolução nodenext).
interface ProjectPhoto {
  src: string
  alt: string
  width: number
  height: number
}
interface DialogLabels {
  beforeLabel: string
  afterLabel: string
  sliderLabel: string
  noPhotos: string
}

// O registo de imagens (src/content/images.ts) importa ficheiros pelo vite-imagetools
// (alias @ilustrativas, com parâmetros): fora do Vite, esses imports dão um objeto vazio.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (/^@(?:ilustrativas|brand)\//.test(specifier)) {
      return {
        url: 'data:text/javascript,export default {sources:{},img:{src:"",w:1,h:1}}',
        shortCircuit: true,
      }
    }
    return nextResolve(specifier, context)
  },
})

// Os componentes usam JSX sem importar o React: se o tsx os compilar em modo clássico
// (React.createElement), o React tem de existir no âmbito global.
;(globalThis as { React?: unknown }).React = React

interface BeforeAfterProps {
  before: readonly ProjectPhoto[]
  after: readonly ProjectPhoto[]
  className?: string
}
interface BeforeAfterModule {
  BeforeAfter: (props: BeforeAfterProps) => React.ReactNode
  BeforeAfterStatic: (props: BeforeAfterProps) => React.ReactNode
}

// Imports dinâmicos, depois de registar o resolve acima (os estáticos correm antes).
const srcUrl = (file: string) => pathToFileURL(path.resolve('src', file)).href
const { BeforeAfter, BeforeAfterStatic } = (await import(srcUrl('components/ui/BeforeAfter.tsx'))) as BeforeAfterModule
const { projectsSection } = (await import(srcUrl('content/projects.ts'))) as { projectsSection: { dialog: DialogLabels } }

// Fotografias de teste (URLs absolutos: o caminho não depende do base path).
const ANTES: ProjectPhoto = {
  src: 'https://exemplo.invalid/fixtures/cozinha-antes.jpg',
  alt: 'Cozinha antes da obra, com a bancada antiga e azulejos partidos',
  width: 1200,
  height: 900,
}
const DEPOIS: ProjectPhoto = {
  src: 'https://exemplo.invalid/fixtures/cozinha-depois.jpg',
  alt: 'A mesma cozinha depois da obra, com bancada de pedra e armários novos',
  width: 1200,
  height: 900,
}

const t = projectsSection.dialog
const falhas: string[] = []
function check(ok: boolean, msg: string) {
  if (!ok) falhas.push(msg)
}

function render(component: (props: BeforeAfterProps) => React.ReactNode, props: BeforeAfterProps): HTMLElement {
  return parse(renderToStaticMarkup(React.createElement(component, props)))
}

function text(el: HTMLElement | null | undefined): string {
  return (el?.textContent ?? '').replace(/\s+/g, ' ').trim()
}

/** Cada <img> com alt não vazio, width e height. */
function checkImages(root: HTMLElement, where: string, expected: number) {
  const imgs = root.querySelectorAll('img')
  check(imgs.length === expected, `${where}: ${imgs.length} imagens em vez de ${expected}`)
  for (const img of imgs) {
    const src = img.getAttribute('src') ?? ''
    check((img.getAttribute('alt') ?? '').trim() !== '', `${where}: imagem sem alt (${src})`)
    check(Number(img.getAttribute('width')) > 0, `${where}: imagem sem width (${src})`)
    check(Number(img.getAttribute('height')) > 0, `${where}: imagem sem height (${src})`)
  }
}

// 1. Comparador com um par.
{
  const where = 'comparador'
  const root = render(BeforeAfter, { before: [ANTES], after: [DEPOIS] })
  checkImages(root, where, 2)
  const comparators = root.querySelectorAll('[data-comparator]')
  check(comparators.length === 1, `${where}: ${comparators.length} comparadores em vez de 1`)
  const input = root.querySelector('input[type="range"]')
  check(input !== null, `${where}: sem <input type="range">`)
  const id = input?.getAttribute('id') ?? ''
  const label = id ? root.querySelectorAll('label').find((l) => l.getAttribute('for') === id) : undefined
  check(id !== '' && label !== undefined, `${where}: o controlo não tem <label for> associada`)
  check(text(label) === t.sliderLabel, `${where}: etiqueta "${text(label)}" em vez de "${t.sliderLabel}"`)
  const valueText = input?.getAttribute('aria-valuetext') ?? ''
  check(valueText.includes('50') && !valueText.includes('{'), `${where}: aria-valuetext inválido ("${valueText}")`)
  for (const attr of ['min', 'max', 'step', 'value']) {
    check(input?.getAttribute(attr) !== undefined, `${where}: o controlo não tem ${attr}`)
  }
  const around = input?.parentNode ? text(input.parentNode as HTMLElement) : ''
  check(around.startsWith(t.beforeLabel) && around.endsWith(t.afterLabel), `${where}: sem "Antes" e "Depois" à volta ("${around}")`)
  const clipped = root.querySelectorAll('[style]').some((el) => /clip-path:\s*inset\(0 0 0 50%\)/.test(el.getAttribute('style') ?? ''))
  check(clipped, `${where}: a fotografia "depois" não está recortada a 50%`)
  const afterImg = root.querySelectorAll('img').find((img) => img.getAttribute('src') === DEPOIS.src)
  check(afterImg?.getAttribute('alt') === DEPOIS.alt, `${where}: o alt da fotografia "depois" não é o do conteúdo`)
}

// 2. Galeria estática (sem JavaScript), com um par e uma fotografia "antes" a mais.
{
  const where = 'galeria estática'
  const root = render(BeforeAfterStatic, { before: [ANTES, ANTES], after: [DEPOIS] })
  check(root.querySelector('[data-before-after="estatico"]') !== null, `${where}: sem [data-before-after="estatico"]`)
  checkImages(root, where, 3)
  check(root.querySelector('input') === null, `${where}: tem controlos (tem de funcionar sem JavaScript)`)
  const captions = root.querySelectorAll('figcaption').map((c) => text(c))
  const esperado = [t.beforeLabel, t.afterLabel, t.beforeLabel]
  check(captions.join('|') === esperado.join('|'), `${where}: legendas ${captions.join(', ')} em vez de ${esperado.join(', ')}`)
}

// 3. Fotografias sem par: sem comparador, com a legenda de cada uma.
{
  const where = 'fotografias sem par'
  const root = render(BeforeAfter, { before: [ANTES], after: [] })
  checkImages(root, where, 1)
  check(root.querySelector('input[type="range"]') === null, `${where}: comparador sem par de fotografias`)
  check(root.querySelectorAll('figcaption').some((c) => text(c) === t.beforeLabel), `${where}: sem a legenda "${t.beforeLabel}"`)
}

// 4. Sem fotografias: placeholders e texto.
{
  const where = 'sem fotografias'
  const root = render(BeforeAfter, { before: [], after: [] })
  check(root.querySelector('[data-before-after="sem-fotografias"]') !== null, `${where}: sem [data-before-after="sem-fotografias"]`)
  check(root.querySelectorAll('[data-photo-placeholder]').length === 2, `${where}: sem os dois placeholders`)
  check(root.querySelectorAll('img').length === 0, `${where}: tem imagens`)
  check(text(root).includes(t.noPhotos), `${where}: sem o texto "${t.noPhotos}"`)
}

if (falhas.length > 0) {
  console.error(`check-before-after: ${falhas.length} falha(s)`)
  for (const f of falhas) console.error(`  - ${f}`)
  process.exit(1)
}
console.log('check-before-after: comparador, galeria estática, fotografias sem par e placeholders verificados.')
