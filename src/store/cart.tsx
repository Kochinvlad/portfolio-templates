import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { CartLine, Product } from '../lib/types'
import { useLocalStorage } from '../lib/hooks'

type AddOptions = {
  qty?: number
  variant?: string
  variantPrice?: number
}

export type PromoCode = {
  /** Скидка в процентах от суммы товаров. */
  percent: number
  label: string
}

type CartApi = {
  lines: CartLine[]
  /** Общее количество единиц товара. */
  count: number
  /** Сумма товаров без скидки и доставки. */
  subtotal: number
  /** Размер скидки по промокоду. */
  discount: number
  /** Стоимость доставки (0, если бесплатная). */
  delivery: number
  /** Итог к оплате. */
  total: number
  /** Сколько не хватает до бесплатной доставки (0 — уже бесплатно). */
  freeDeliveryLeft: number
  appliedPromo: { code: string; percent: number; label: string } | null
  isOpen: boolean
  add: (product: Product, options?: AddOptions) => void
  setQty: (key: string, qty: number) => void
  remove: (key: string) => void
  clear: () => void
  open: () => void
  close: () => void
  toggle: () => void
  /** Сколько штук этого товара уже в корзине. */
  qtyOf: (productId: string) => number
  /** Возвращает false, если код не найден. */
  applyPromo: (code: string) => boolean
  clearPromo: () => void
}

const CartContext = createContext<CartApi | null>(null)

function makeKey(product: Product, variant?: string): string {
  return variant ? `${product.id}::${variant}` : product.id
}

export function CartProvider({
  children,
  storageKey,
  promoCodes = {},
  deliveryFee = 0,
  freeDeliveryFrom = 0,
}: {
  children: ReactNode
  /** Свой ключ для каждого шаблона, чтобы корзины не смешивались. */
  storageKey: string
  promoCodes?: Record<string, PromoCode>
  deliveryFee?: number
  /** Сумма товаров, начиная с которой доставка бесплатна. 0 — всегда платная. */
  freeDeliveryFrom?: number
}) {
  const [lines, setLines] = useLocalStorage<CartLine[]>(`${storageKey}:lines`, [])
  const [promoCode, setPromoCode] = useLocalStorage<string | null>(`${storageKey}:promo`, null)
  const [isOpen, setIsOpen] = useState(false)

  const add = useCallback(
    (product: Product, options: AddOptions = {}) => {
      if (product.outOfStock) return
      const { qty = 1, variant, variantPrice = 0 } = options
      const key = makeKey(product, variant)
      setLines((prev) => {
        const existing = prev.find((l) => l.key === key)
        if (existing) {
          return prev.map((l) =>
            l.key === key ? { ...l, qty: Math.min(l.qty + qty, 99) } : l,
          )
        }
        return [...prev, { key, product, qty, variant, variantPrice }]
      })
    },
    [setLines],
  )

  const setQty = useCallback(
    (key: string, qty: number) => {
      setLines((prev) =>
        qty <= 0
          ? prev.filter((l) => l.key !== key)
          : prev.map((l) => (l.key === key ? { ...l, qty: Math.min(qty, 99) } : l)),
      )
    },
    [setLines],
  )

  const remove = useCallback(
    (key: string) => setLines((prev) => prev.filter((l) => l.key !== key)),
    [setLines],
  )

  const clear = useCallback(() => {
    setLines([])
    setPromoCode(null)
  }, [setLines, setPromoCode])

  const applyPromo = useCallback(
    (code: string) => {
      const normalized = code.trim().toUpperCase()
      if (!promoCodes[normalized]) return false
      setPromoCode(normalized)
      return true
    },
    [promoCodes, setPromoCode],
  )

  const clearPromo = useCallback(() => setPromoCode(null), [setPromoCode])

  const value = useMemo<CartApi>(() => {
    const count = lines.reduce((sum, l) => sum + l.qty, 0)
    const subtotal = lines.reduce(
      (sum, l) => sum + (l.product.price + (l.variantPrice ?? 0)) * l.qty,
      0,
    )

    const promo = promoCode && promoCodes[promoCode] ? promoCodes[promoCode] : null
    const discount = promo ? Math.round((subtotal * promo.percent) / 100) : 0

    const freeDeliveryReached = freeDeliveryFrom > 0 && subtotal >= freeDeliveryFrom
    const delivery = count === 0 || freeDeliveryReached ? 0 : deliveryFee
    const freeDeliveryLeft =
      freeDeliveryFrom > 0 && !freeDeliveryReached ? freeDeliveryFrom - subtotal : 0

    return {
      lines,
      count,
      subtotal,
      discount,
      delivery,
      total: Math.max(subtotal - discount + delivery, 0),
      freeDeliveryLeft,
      appliedPromo: promo && promoCode ? { code: promoCode, ...promo } : null,
      isOpen,
      add,
      setQty,
      remove,
      clear,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen((v) => !v),
      qtyOf: (productId: string) =>
        lines.filter((l) => l.product.id === productId).reduce((s, l) => s + l.qty, 0),
      applyPromo,
      clearPromo,
    }
  }, [
    lines,
    promoCode,
    promoCodes,
    deliveryFee,
    freeDeliveryFrom,
    isOpen,
    add,
    setQty,
    remove,
    clear,
    applyPromo,
    clearPromo,
  ])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartApi {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart можно вызывать только внутри <CartProvider>')
  return ctx
}
