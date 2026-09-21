import { CartPanel } from '../../ui/CartPanel'
import { SHOP_FREE_DELIVERY_FROM } from './data'

/** Корзина магазина: общий компонент плюс тексты этого шаблона. */
export function ShopCartDrawer({ onCheckout }: { onCheckout: () => void }) {
  return (
    <CartPanel
      title="Корзина"
      itemsLabel="Товары"
      emptyTitle="Корзина пуста"
      emptyText="Добавьте товары из каталога — доставка бесплатна от 5000 ₽."
      emptyActionLabel="Перейти в каталог"
      freeDeliveryFrom={SHOP_FREE_DELIVERY_FROM}
      promoHint="Для демонстрации работают коды: SALE10, TECH15"
      checkoutLabel="Перейти к оформлению"
      onCheckout={onCheckout}
    />
  )
}
