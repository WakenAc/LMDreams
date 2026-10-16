// Converte as imagens do Higgsfield (rss/imgs) para WebP otimizado em assets/img.
// Uso: node scripts/otimizar-imagens.cjs rss/imgs assets/img
// Precisa do sharp: usa o do projeto LMDreams anterior (caminho abaixo) ou instala com "npm i sharp".
// Fases 05 e 11 ficam a 3840 px (a câmara aproxima-se até ~6x da janela); outras imagens deitadas
// a 2560 px; verticais (4:5) a 1200 px. Só converte as novas ou alteradas (--todas refaz tudo).
const sharp = (() => {
  try { return require('sharp') } catch {
    return require('C:/Users/andre/Desktop/Claude_playground/websites/LMDreams/LMDreams/node_modules/sharp')
  }
})()
const fs = require('fs'), path = require('path')
const [src, out] = process.argv.slice(2).filter((a) => !a.startsWith('--'))
// largura pela orientação: imagens deitadas (fases, 404) a 2560 px, verticais (4:5) a 1200 px
const widthFor = (n, m) => (/^fase-(05|11)-/.test(n) ? 3840 : m.width > m.height ? 2560 : 1200)
;(async () => {
  let total = 0
  // só converte o que ainda não existe ou mudou (passa --todas para refazer tudo)
  const todas = process.argv.includes('--todas')
  for (const f of fs.readdirSync(src).filter((f) => /\.png$/i.test(f)).sort()) {
    const name = f.replace(/\.png$/i, '')
    const dest = path.join(out, name + '.webp')
    if (!todas && fs.existsSync(dest) && fs.statSync(dest).mtimeMs > fs.statSync(path.join(src, f)).mtimeMs) continue
    const meta = await sharp(path.join(src, f)).metadata()
    const info = await sharp(path.join(src, f))
      .resize({ width: widthFor(name, meta), withoutEnlargement: true })
      .webp({ quality: 80, effort: 5, smartSubsample: true })
      .toFile(dest)
    total += info.size
    console.log(name.padEnd(28), `${info.width}x${info.height}`.padEnd(10), (info.size / 1024).toFixed(0) + ' KB')
  }
  console.log('TOTAL', (total / 1024 / 1024).toFixed(2) + ' MB')
})()
