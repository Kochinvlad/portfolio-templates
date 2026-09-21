import { useState } from 'react'
import type { Product } from '../../lib/types'
import { useDocumentMeta, useRevealOnScroll } from '../../lib/hooks'
import { CartProvider, useCart } from '../../store/cart'
import { ToastProvider } from '../../ui/Toast'
import { DemoBar } from '../../showcase/DemoBar'
import {
  SUSHI_DELIVERY_FEE,
  SUSHI_FREE_DELIVERY_FROM,
  SUSHI_PROMO_CODES,
} from './data'
import { SushiCartDrawer } from './SushiCart'
import { SushiCheckout } from './SushiCheckout'
import { SushiMenu } from './SushiMenu'
import { SushiDelivery, SushiFooter, SushiPromo } from './SushiPromo'
import { SushiProductModal } from './SushiProduct'
import { SushiHeader, SushiHero } from './SushiSections'

/** Внутренняя часть — живёт внутри провайдеров, поэтому может читать корзину. */
function SushiInner() {
  const { close } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  useDocumentMeta(
    'САКУРА — доставка суши и роллов за 60 минут',
    'Доставка суши, роллов и горячих блюд по Москве за 60 минут. Бесплатно от 1500 ₽.',
  )
  useRevealOnScroll()

  return (
    <>
      <SushiHeader />
      <main>
        <SushiHero />
        <SushiMenu onOpenProduct={setProduct} />
        <SushiPromo />
        <SushiDelivery />
      </main>
      <SushiFooter />

      <SushiProductModal product={product} onClose={() => setProduct(null)} />
      <SushiCartDrawer
        onCheckout={() => {
          close()
          setCheckoutOpen(true)
        }}
      />
      <SushiCheckout open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
      <DemoBar name="Суши и роллы" />
    </>
  )
}

export function SushiTemplate() {
  return (
    <CartProvider
      storageKey="sushi"
      promoCodes={SUSHI_PROMO_CODES}
      deliveryFee={SUSHI_DELIVERY_FEE}
      freeDeliveryFrom={SUSHI_FREE_DELIVERY_FROM}
    >
      <div className="theme-sushi min-h-screen bg-surface text-ink">
        <ToastProvider>
          <SushiInner />
        </ToastProvider>
      </div>
    </CartProvider>
  )
}
