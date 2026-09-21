import { useCallback, useState } from 'react'
import type { Product } from '../../lib/types'
import { useDocumentMeta, useRevealOnScroll } from '../../lib/hooks'
import { CartProvider, useCart } from '../../store/cart'
import { ToastProvider } from '../../ui/Toast'
import { DemoBar } from '../../showcase/DemoBar'
import { TOYS_DELIVERY_FEE, TOYS_FREE_DELIVERY_FROM, TOYS_PROMO_CODES } from './data'
import { ToysCartDrawer } from './ToysCart'
import { ToysCatalog } from './ToysCatalog'
import { ToysCheckout } from './ToysCheckout'
import { ToysGiftFinder } from './ToysGiftFinder'
import { ToysHeader, ToysHero } from './ToysHeader'
import { ToysProductModal } from './ToysProduct'
import { ToysFooter, ToysGiftBanner, ToysWhy } from './ToysSections'

function ToysInner() {
  const { close } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [picked, setPicked] = useState<{ ageGroupId: string; categoryId: string } | null>(null)

  useDocumentMeta(
    'ИГРОГРАД — магазин игрушек с подбором по возрасту',
    'Игрушки для детей от 0 до 14 лет. Подбор подарка за три вопроса, подарочная упаковка, доставка за 1–2 дня.',
  )
  useRevealOnScroll()

  const consumePicked = useCallback(() => setPicked(null), [])

  return (
    <>
      <ToysHeader />
      <main>
        <ToysHero />
        <ToysGiftFinder
          onOpenProduct={setProduct}
          onShowAll={(ageGroupId, categoryId) => {
            setPicked({ ageGroupId, categoryId })
            document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })
          }}
        />
        <ToysGiftBanner />
        <ToysCatalog
          onOpenProduct={setProduct}
          picked={picked}
          onPickedConsumed={consumePicked}
        />
        <ToysWhy />
      </main>
      <ToysFooter />

      <ToysProductModal product={product} onClose={() => setProduct(null)} />
      <ToysCartDrawer
        onCheckout={() => {
          close()
          setCheckoutOpen(true)
        }}
      />
      <ToysCheckout open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
      <DemoBar name="Магазин игрушек" />
    </>
  )
}

export function ToysTemplate() {
  return (
    <CartProvider
      storageKey="toys"
      promoCodes={TOYS_PROMO_CODES}
      deliveryFee={TOYS_DELIVERY_FEE}
      freeDeliveryFrom={TOYS_FREE_DELIVERY_FROM}
    >
      <div className="theme-toys min-h-screen bg-surface text-ink">
        <ToastProvider>
          <ToysInner />
        </ToastProvider>
      </div>
    </CartProvider>
  )
}
