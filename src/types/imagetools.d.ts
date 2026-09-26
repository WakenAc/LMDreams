// O vite-imagetools não traz tipos para os imports com query (Parte 3.1).
// `as=picture` devolve as fontes por formato e a imagem de recurso.

declare module '*&as=picture' {
  const picture: {
    sources: Record<string, string>
    img: { src: string; w: number; h: number }
  }
  export default picture
}

declare module '*&as=metadata' {
  const metadata: { src: string; width: number; height: number; format: string }[]
  export default metadata
}

declare module '*?url&imagetools' {
  const url: string
  export default url
}

declare module '*&as=srcset' {
  const srcset: string
  export default srcset
}

declare module '*&format=png' {
  const url: string
  export default url
}

declare module '*&format=webp' {
  const url: string
  export default url
}

declare module '*&format=jpg' {
  const url: string
  export default url
}
