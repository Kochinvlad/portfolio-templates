import { useCallback, useState } from 'react'
import type { Product } from '../../lib/types'
import { useDocumentMeta } from '../../lib/hooks'
import { CartProvider, useCart } from '../../store/cart'
import { FavoritesProvider } from '../../store/favorites'
import { ToastProvider } from '../../ui/Toast'
import { DemoBar } from '../../showcase/DemoBar'
import { SHOP_CATALOG, SHOP_DELIVERY_FEE, SHOP_FREE_DELIVERY_FROM, SHOP_PROMO_CODES } from './data'
import { ShopCartDrawer } from './ShopCart'
import { ShopCatalog } from './ShopCatalog'
import { ShopCheckout } from './ShopCheckout'
import { ShopHeader } from './ShopHeader'
import { ShopProductModal } from './ShopProduct'
import { ShopBenefits, ShopFooter, ShopHero } from './ShopSections'

function ShopInner() {
  const { close } = useCart()
  const [query, setQuery] = useState('')
  const [onlyFavorites, setOnlyFavorites] = useState(false)
  const [pickedCategory, setPickedCategory] = useState<string | null>(null)
  const [product, setProduct] = useState<Product | null>(null)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  useDocumentMeta(
    'ТЕХНОПОРТ — интернет-магазин техники с доставкой завтра',
    'Ноутбуки, смартфоны, аудио и аксессуары. Гарантия 2 года, возврат 14 дней, рассрочка 0 %.',
  )

  const consumeCategory = useCallback(() => setPickedCategory(null), [])

  function pickCategory(id: string) {
    setPickedCategory(id)
    setOnlyFavorites(false)
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <ShopHeader
        query={query}
        onQuery={setQuery}
        onlyFavorites={onlyFavorites}
        onToggleFavorites={() => setOnlyFavorites((v) => !v)}
        onPickCategory={pickCategory}
      />
      <main>
        <ShopHero
          onOpenFeatured={() =>
            setProduct(SHOP_CATALOG.find((p) => p.id === 'lp-nord-14') ?? SHOP_CATALOG[0])
          }
        />
        <ShopBenefits />
        <ShopCatalog
          query={query}
          onQuery={setQuery}
          onlyFavorites={onlyFavorites}
          onClearFavoritesFilter={() => setOnlyFavorites(false)}
          onOpenProduct={setProduct}
          pickedCategory={pickedCategory}
          onCategoryConsumed={consumeCategory}
        />
      </main>
      <ShopFooter />

      <ShopProductModal product={product} onClose={() => setProduct(null)} />
      <ShopCartDrawer
        onCheckout={() => {
          close()
          setCheckoutOpen(true)
        }}
      />
      <ShopCheckout open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
      <DemoBar name="Интернет-магазин" />
    </>
  )
}

export function ShopTemplate() {
  return (
    <CartProvider
      storageKey="shop"
      promoCodes={SHOP_PROMO_CODES}
      deliveryFee={SHOP_DELIVERY_FEE}
      freeDeliveryFrom={SHOP_FREE_DELIVERY_FROM}
    >
      <FavoritesProvider storageKey="shop">
        <div className="theme-shop min-h-screen bg-surface text-ink">
          <ToastProvider>
            <ShopInner />
          </ToastProvider>
        </div>
      </FavoritesProvider>
    </CartProvider>
  )
}
