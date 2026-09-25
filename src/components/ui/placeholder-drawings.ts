// Desenhos dos placeholders de imagem (plano B, Parte 4.2; "placeholders elegantes", Parte
// 5.3). Um desenho por assunto, todos no mesmo estilo: traço fino `muted` sobre `sand`,
// sem papel de desenho nem cotas (esses motivos ficam só no Hero e no Método; direção
// visual, secções 6 e 11). Coordenadas numa caixa de 400 × 300; o essencial fica entre
// x 80 e 320 e y 70 e 230, para sobreviver aos recortes 4:5, 4:3, 3:2, 16:9 e 21:9
// (preserveAspectRatio="xMidYMid slice").

export type PlaceholderVariant =
  | 'planta'
  | 'estrutura'
  | 'cozinha'
  | 'casa-de-banho'
  | 'pavimento'
  | 'fachada'
  | 'exterior'
  | 'cronograma'
  | 'corte'

/** Um traço do desenho; `faint` para padrões densos (pavimento, tramas), mais leves. */
export interface DrawingPath {
  d: string
  faint?: boolean
}

/** Círculo como caminho (centro e raio). */
function circle(cx: number, cy: number, r: number): string {
  return `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`
}

/** Elipse como caminho (centro e raios). */
function ellipse(cx: number, cy: number, rx: number, ry: number): string {
  return `M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0`
}

/** Trama a 45 graus dentro de um retângulo (betão, alvenaria em corte). */
function hatch(x0: number, y0: number, x1: number, y1: number, step: number): string {
  let d = ''
  for (let k = x0 + y0 + step; k < x1 + y1; k += step) {
    const xa = Math.max(x0, k - y1)
    const xb = Math.min(x1, k - y0)
    if (xb > xa) d += `M${xa} ${k - xa}L${xb} ${k - xb}`
  }
  return d
}

/** Soalho em espinha (chevron): réguas entre linhas em ziguezague e juntas verticais. */
function chevron(): string {
  let d = ''
  for (let y = 70; y <= 196; y += 18) {
    d += `M80 ${y}`
    for (let i = 1; i <= 10; i++) d += `L${80 + 24 * i} ${y + (i % 2) * 24}`
  }
  for (let i = 1; i < 10; i++) d += `M${80 + 24 * i} 70V230`
  return d
}

/** Lajeado de terraço em fiadas desencontradas. */
function paving(): string {
  let d = ''
  for (let r = 0; r < 5; r++) {
    const y = 116 + r * 23
    if (r > 0) d += `M80 ${y}H320`
    for (let x = r % 2 === 0 ? 128 : 104; x < 320; x += 48) d += `M${x} ${y}v23`
  }
  return d
}

/** Pilares (quadrado com as diagonais) e vigas numa malha de 3 × 3. */
function structure(): string {
  const xs = [90, 200, 310]
  const ys = [80, 150, 220]
  let d = ''
  for (const x of xs) {
    for (const y of ys) d += `M${x - 7} ${y - 7}h14v14h-14zl14 14M${x + 7} ${y - 7}l-14 14`
    d += `M${x} 87V143M${x} 157V213`
  }
  for (const y of ys) d += `M97 ${y}H193M207 ${y}H303`
  return d
}

/** Janela de fachada com moldura de cantaria e peitoril. */
function facadeWindow(x: number, y: number, h: number): string {
  return `M${x} ${y}h34v${h}h-34zM${x + 4} ${y + 4}h26v${h - 8}h-26zM${x - 4} ${y + h}h42`
}

const DRAWINGS: Record<PlaceholderVariant, () => DrawingPath[]> = {
  // Planta de uma casa: divisões, uma porta e um vão.
  planta: () => [
    { d: 'M60 60H340V240H60Z' },
    { d: 'M60 150H190V240M190 60V120M250 150H340M250 150V240' },
    { d: 'M190 120a30 30 0 0 1 30 30M110 240v-14h40v14' },
  ],
  // Construção: malha de pilares e vigas.
  estrutura: () => [{ d: structure() }],
  // Cozinha: bancada em L com lava-loiça e placa, e uma ilha.
  cozinha: () => [
    { d: 'M80 70H320V230H80Z' },
    { d: 'M80 96H262V70M106 96V196H80' },
    { d: `M140 75h44v16h-44z${circle(216, 77, 4)}${circle(236, 77, 4)}${circle(216, 89, 4)}${circle(236, 89, 4)}` },
    { d: 'M180 142h96v40h-96z' },
  ],
  // Casa de banho: base de duche com escoamento, lavatório e sanita.
  'casa-de-banho': () => [
    { d: 'M100 70H300V230H100Z' },
    { d: `M232 70V136H300M232 70L300 136M300 70L232 136${circle(266, 103, 4)}` },
    { d: `M100 104H128V172H100${ellipse(114, 138, 8, 18)}` },
    { d: `M184 214h32v16h-32z${ellipse(200, 197, 12, 16)}` },
  ],
  // Pavimentos: soalho em espinha.
  pavimento: () => [{ d: 'M80 70H320V230H80Z' }, { d: chevron(), faint: true }],
  // Recuperação: alçado de uma fachada tradicional com platibanda, vãos e soco.
  fachada: () => [
    { d: 'M90 86H310V230H90ZM84 78H316V86H84Z' },
    { d: 'M90 214H183M217 214H310M183 230V162H217V230M187 230V166H213V230' },
    { d: `${facadeWindow(107, 104, 42)}${facadeWindow(183, 104, 42)}${facadeWindow(259, 104, 42)}` },
    { d: `${facadeWindow(107, 164, 36)}${facadeWindow(259, 164, 36)}` },
  ],
  // Exteriores: guarda de um terraço e lajeado de pedra.
  exterior: () => [
    { d: 'M80 80H320M80 108H320M80 80V108M128 80V108M176 80V108M224 80V108M272 80V108M320 80V108' },
    { d: 'M80 116H320V231H80Z' },
    { d: paving(), faint: true },
  ],
  // Transparência: planeamento dos trabalhos em barras (sem texto nem números).
  cronograma: () => [
    { d: 'M80 76H320M80 72v8M120 72v8M160 72v8M200 72v8M240 72v8M280 72v8M320 72v8' },
    {
      d:
        'M80 91h70v10h-70zM120 115h80v10h-80zM150 139h80v10h-80zM190 163h80v10h-80z' +
        'M230 187h70v10h-70zM260 211h60v10h-60z',
    },
    { d: 'M80 108H320M80 132H320M80 156H320M80 180H320M80 204H320M80 228H320', faint: true },
  ],
  // Diferenciação: corte de uma parede com várias especialidades (alvenaria, isolamento,
  // reboco, laje e uma tubagem).
  corte: () => [
    { d: 'M166 64V196M172 64V196M228 64V196M250 64V196M60 196H340V222H60ZM60 188H166' },
    { d: hatch(172, 64, 228, 196, 12), faint: true },
    { d: `M228 64${Array.from({ length: 16 }, (_, i) => `L${i % 2 === 0 ? 246 : 228} ${72 + i * 8}`).join('')}` },
    { d: circle(116, 209, 6) },
  ],
}

/** Traços do desenho de um placeholder. */
export function drawingPaths(variant: PlaceholderVariant): DrawingPath[] {
  return DRAWINGS[variant]()
}
