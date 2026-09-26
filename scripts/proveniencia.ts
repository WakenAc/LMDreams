// Proveniência de um build (Parte 2.8): o chunk de entrada do carregador (data-src do
// <script data-lmd-loader> em index.html) e a data do index.html. Os scripts que recolhem
// evidência sobre a pasta de saída (lighthouse.ts, revisao.ts) gravam-na em cada artefacto
// e voltam a lê-la no fim: se o dist mudou a meio (outro build), a recolha falha, para os
// resultados nunca misturarem dois builds.
import fs from 'node:fs'
import path from 'node:path'

export interface BuildProvenance {
  /** Caminho publicado do chunk de entrada (ex.: /LMDreams/assets/index-<hash>.js). */
  entrada: string
  /** Data de escrita do index.html (ISO 8601). */
  buildEm: string
}

export function readProvenance(dir: string): BuildProvenance {
  const index = path.join(dir, 'index.html')
  if (!fs.existsSync(index)) return { entrada: '', buildEm: '' }
  const entrada = fs.readFileSync(index, 'utf8').match(/<script data-lmd-loader data-src="([^"]+)"/)?.[1] ?? ''
  return { entrada, buildEm: fs.statSync(index).mtime.toISOString() }
}

/** Descrição da mudança, ou null se o dist continua a ser o mesmo build. */
export function provenanceChange(before: BuildProvenance, after: BuildProvenance): string | null {
  if (before.entrada === after.entrada && before.buildEm === after.buildEm) return null
  return `o dist mudou durante a recolha (entrada ${before.entrada || '?'} de ${before.buildEm || '?'} passou a ${after.entrada || '?'} de ${after.buildEm || '?'})`
}
