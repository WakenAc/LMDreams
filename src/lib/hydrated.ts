import { useSyncExternalStore } from 'react'

// "Já hidratado?" sem setState num efeito: o React usa o valor do servidor (false) no HTML
// pré-renderizado e no render de hidratação, e volta a renderizar com o do cliente (true)
// logo a seguir, sem erro de hidratação.

const subscribeNothing = () => () => {}
const clientSnapshot = () => true
const serverSnapshot = () => false

/** Falso no HTML pré-renderizado e durante a hidratação; verdadeiro depois. */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribeNothing, clientSnapshot, serverSnapshot)
}
