// Favicons e ícones da aplicação derivados do logótipo fornecido (Parte 4.9).
// Sem redesenho: recorta-se o grafismo do próprio ficheiro e completa-se o quadrado
// com a cor de fundo do próprio logótipo (#292929). Corre-se uma vez (npm run favicons)
// e os ficheiros gerados ficam em public/.
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const SRC = path.resolve('assets-src/brand/logo-original.png')
const OUT = path.resolve('public')
const BG = { r: 41, g: 41, b: 41, alpha: 1 } // fundo medido do logótipo

fs.mkdirSync(OUT, { recursive: true })

// Caixa do grafismo amarelo-lima (medida nos píxeis do ficheiro).
const { data, info } = await sharp(SRC).raw().toBuffer({ resolveWithObject: true })
let x0 = info.width
let y0 = info.height
let x1 = 0
let y1 = 0
for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    const i = (y * info.width + x) * info.channels
    const r = data[i] ?? 0
    const g = data[i + 1] ?? 0
    const b = data[i + 2] ?? 0
    if (r > 90 && g > 90 && b < 90) {
      x0 = Math.min(x0, x)
      y0 = Math.min(y0, y)
      x1 = Math.max(x1, x)
      y1 = Math.max(y1, y)
    }
  }
}
const gw = x1 - x0 + 1
const gh = y1 - y0 + 1
console.log(`favicons: grafismo ${gw}×${gh} px em (${x0}, ${y0})`)

const graphic = await sharp(SRC).extract({ left: x0, top: y0, width: gw, height: gh }).png().toBuffer()

/** Quadrado com o grafismo centrado; `fill` = fração do lado ocupada pelo lado maior do grafismo. */
async function square(size: number, fill: number): Promise<Buffer> {
  const inner = Math.round(size * fill)
  const scale = inner / Math.max(gw, gh)
  const w = Math.max(1, Math.round(gw * scale))
  const h = Math.max(1, Math.round(gh * scale))
  const g = await sharp(graphic).resize(w, h, { kernel: 'lanczos3' }).toBuffer()
  return sharp({ create: { width: size, height: size, channels: 4, background: BG } })
    .composite([{ input: g, left: Math.round((size - w) / 2), top: Math.round((size - h) / 2) }])
    .png({ compressionLevel: 9 })
    .toBuffer()
}

const files: [string, number, number][] = [
  ['favicon-16.png', 16, 0.94],
  ['favicon-32.png', 32, 0.9],
  ['favicon-48.png', 48, 0.88],
  ['apple-touch-icon.png', 180, 0.8],
  ['icon-192.png', 192, 0.84],
  ['icon-512.png', 512, 0.84],
  // Zona segura das máscaras: o grafismo fica dentro do círculo central de 80%.
  ['icon-maskable-512.png', 512, 0.62],
]

const pngs: Record<string, Buffer> = {}
for (const [name, size, fill] of files) {
  pngs[name] = await square(size, fill)
  if (name !== 'favicon-16.png' && name !== 'favicon-48.png') {
    fs.writeFileSync(path.join(OUT, name), pngs[name])
    console.log(`favicons: public/${name}`)
  }
}

// favicon.ico com PNG embebidos (16, 32 e 48 px).
const icoImages = ['favicon-16.png', 'favicon-32.png', 'favicon-48.png'].map((n) => pngs[n] as Buffer)
const header = Buffer.alloc(6)
header.writeUInt16LE(0, 0)
header.writeUInt16LE(1, 2)
header.writeUInt16LE(icoImages.length, 4)
const entries: Buffer[] = []
let offset = 6 + 16 * icoImages.length
for (const [i, img] of icoImages.entries()) {
  const size = [16, 32, 48][i] as number
  const e = Buffer.alloc(16)
  e.writeUInt8(size, 0)
  e.writeUInt8(size, 1)
  e.writeUInt8(0, 2)
  e.writeUInt8(0, 3)
  e.writeUInt16LE(1, 4)
  e.writeUInt16LE(32, 6)
  e.writeUInt32LE(img.length, 8)
  e.writeUInt32LE(offset, 12)
  offset += img.length
  entries.push(e)
}
fs.writeFileSync(path.join(OUT, 'favicon.ico'), Buffer.concat([header, ...entries, ...icoImages]))
console.log('favicons: public/favicon.ico (16, 32, 48)')

// Logótipo original para o JSON-LD (cópia exata do ficheiro fornecido).
fs.copyFileSync(SRC, path.join(OUT, 'logo-lmdreams.png'))
console.log('favicons: public/logo-lmdreams.png (cópia do original)')

// Manifesto com caminhos relativos ao próprio ficheiro (funciona em /LMDreams/ e em /).
const manifest = {
  name: 'LMDreams',
  short_name: 'LMDreams',
  description: 'Construção civil e remodelações por especialistas.',
  lang: 'pt-PT',
  start_url: './',
  scope: './',
  display: 'browser',
  background_color: '#f6f5f1',
  theme_color: '#f6f5f1',
  icons: [
    { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
}
fs.writeFileSync(path.join(OUT, 'site.webmanifest'), `${JSON.stringify(manifest, null, 2)}\n`)
console.log('favicons: public/site.webmanifest')
