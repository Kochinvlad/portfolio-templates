import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react'
import { useLocalStorage } from '../lib/hooks'

type FavoritesApi = {
  ids: string[]
  count: number
  has: (id: string) => boolean
  toggle: (id: string) => void
  clear: () => void
}

const FavoritesContext = createContext<FavoritesApi | null>(null)

export function FavoritesProvider({
  children,
  storageKey,
}: {
  children: ReactNode
  storageKey: string
}) {
  const [ids, setIds] = useLocalStorage<string[]>(`${storageKey}:favorites`, [])

  const toggle = useCallback(
    (id: string) => {
      setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
    },
    [setIds],
  )

  const clear = useCallback(() => setIds([]), [setIds])

  const value = useMemo<FavoritesApi>(
    () => ({
      ids,
      count: ids.length,
      has: (id: string) => ids.includes(id),
      toggle,
      clear,
    }),
    [ids, toggle, clear],
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites(): FavoritesApi {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites можно вызывать только внутри <FavoritesProvider>')
  return ctx
}
