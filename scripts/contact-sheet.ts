// Folha de contacto das imagens ilustrativas escolhidas (Parte 4.7): confirma que
// parecem da mesma sessão fotográfica. Resultado em .tmp/folha-de-contacto.jpg.
import fs from 'node:fs'
import path from 'node:path'
import sharp, { type OverlayOptions } from 'sharp'

const DIR = path.resolve('assets-src/ilustrativas')
const OUT = path.resolve('.tmp/folha-de-contacto.jpg')
const CELL_W = 480
const CELL_H = 320
const GAP = 12
const COLS = 4

const files = fs
  .readdirSync(DIR)
  .filter((f) => /\.(png|jpe?g|webp)$/i.test(f) && !/-v\d+\./.test(f))
  .sort()

if (files.length === 0) {
  console.error('contact-sheet: não há imagens escolhidas em assets-src/ilustrativas/')
  process.exit(1)
}

const rows = Math.ceil(files.length / COLS)
const width = COLS * CELL_W + (COLS + 1) * GAP
const height = rows * (CELL_H + 28) + (rows + 1) * GAP

const composites: OverlayOptions[] = []
for (const [i, f] of files.entries()) {
  const col = i % COLS
  const row = Math.floor(i / COLS)
  const left = GAP + col * (CELL_W + GAP)
  const top = GAP + row * (CELL_H + 28 + GAP)
  const img = await sharp(path.join(DIR, f)).resize(CELL_W, CELL_H, { fit: 'cover' }).toBuffer()
  composites.push({ input: img, left, top })
  const label = Buffer.from(
    `<svg width="${CELL_W}" height="24"><text x="0" y="17" font-family="Consolas, monospace" font-size="15" fill="#1a222c">${f}</text></svg>`,
  )
  composites.push({ input: label, left, top: top + CELL_H + 4 })
}

fs.mkdirSync(path.dirname(OUT), { recursive: true })
await sharp({ create: { width, height, channels: 3, background: '#f6f5f1' } })
  .composite(composites)
  .jpeg({ quality: 82 })
  .toFile(OUT)
console.log(`contact-sheet: ${files.length} imagens em ${path.relative(process.cwd(), OUT)}`)
