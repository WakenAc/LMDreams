// Redução das fotografias no navegador, antes de as validar e enviar (src/lib/lead.ts).
// Fica num módulo próprio, carregado só quando o visitante escolhe fotografias (import()
// em src/sections/Contact.tsx): não pesa no JavaScript inicial da página.
//
// Porquê: com fotografias de telemóvel (3 a 6 MB cada), o envio
// de 25 MB não cabia nos 15 s numa rede móvel comum. Reduzidas a 2000 px de lado, em JPEG,
// ficam com poucas centenas de KB e perdem os metadados (por exemplo, a localização).
const REDUZIR_LADO_MAXIMO = 2000
const REDUZIR_QUALIDADE_JPEG = 0.82
/** Até este tamanho, a fotografia segue como está (não vale a pena descodificá-la). */
const REDUZIR_ACIMA_DE = 1024 * 1024
/** Acima deste tamanho, não se tenta descodificar (memória do telemóvel); fica recusada pelo limite. */
const REDUZIR_ATE = 50 * 1024 * 1024

/** Formato que vale a pena reduzir (os mesmos que o formulário aceita). */
function formatoReduzivel(ficheiro: File): boolean {
  return /^image\/(jpeg|png|webp)$/.test(ficheiro.type) || (ficheiro.type === '' && /\.(jpe?g|png|webp)$/i.test(ficheiro.name))
}

/** Descodifica a imagem (já com a orientação da fotografia aplicada pelo navegador). */
async function carregarImagem(ficheiro: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(ficheiro)
  try {
    const imagem = new Image()
    imagem.src = url
    await imagem.decode()
    return imagem
  } finally {
    URL.revokeObjectURL(url)
  }
}

/**
 * Reduz uma fotografia para JPEG com 2000 px no lado maior. Devolve a original se não for
 * preciso (até 1 MB), se não for possível (navegador, formato) ou se não ficar mais pequena.
 */
async function reduzirFotografia(ficheiro: File): Promise<File> {
  if (typeof document === 'undefined') return ficheiro
  if (ficheiro.size <= REDUZIR_ACIMA_DE || ficheiro.size > REDUZIR_ATE || !formatoReduzivel(ficheiro)) return ficheiro
  try {
    const imagem = await carregarImagem(ficheiro)
    const escala = Math.min(1, REDUZIR_LADO_MAXIMO / Math.max(imagem.naturalWidth, imagem.naturalHeight))
    const largura = Math.max(1, Math.round(imagem.naturalWidth * escala))
    const altura = Math.max(1, Math.round(imagem.naturalHeight * escala))
    const tela = document.createElement('canvas')
    tela.width = largura
    tela.height = altura
    const contexto = tela.getContext('2d')
    if (!contexto) return ficheiro
    // Fundo branco: o JPEG não tem transparência (fotografias em PNG ou WebP).
    contexto.fillStyle = '#ffffff'
    contexto.fillRect(0, 0, largura, altura)
    contexto.drawImage(imagem, 0, 0, largura, altura)
    const blob = await new Promise<Blob | null>((resolve) => {
      tela.toBlob(resolve, 'image/jpeg', REDUZIR_QUALIDADE_JPEG)
    })
    if (!blob || blob.size >= ficheiro.size) return ficheiro
    const nome = `${ficheiro.name.replace(/\.[^.]*$/, '') || 'fotografia'}.jpg`
    return new File([blob], nome, { type: 'image/jpeg', lastModified: ficheiro.lastModified })
  } catch {
    // Formato que o navegador não descodifica, ou memória insuficiente: segue a original.
    return ficheiro
  }
}

/**
 * Prepara as fotografias escolhidas antes de as validar com addLeadFiles: reduz as que estão
 * num formato aceite (uma de cada vez, para poupar memória no telemóvel). As outras seguem
 * como estão, para serem recusadas com a mensagem certa.
 */
export async function reduceLeadFiles(novos: readonly File[]): Promise<File[]> {
  const reduzidas: File[] = []
  for (const ficheiro of novos) reduzidas.push(await reduzirFotografia(ficheiro))
  return reduzidas
}

