import { CartPanel } from '../../ui/CartPanel'
import { TOYS_FREE_DELIVERY_FROM } from './data'

/** Корзина магазина игрушек. */
export function ToysCartDrawer({ onCheckout }: { onCheckout: () => void }) {
  return (
    <CartPanel
      title="Корзина"
      itemsLabel="Игрушки"
      emptyTitle="Корзина пустая"
      emptyText="Не знаете, что выбрать — ответьте на три вопроса в подборе подарка, это быстро."
      emptyActionLabel="Вернуться в каталог"
      freeDeliveryFrom={TOYS_FREE_DELIVERY_FROM}
      promoHint="Для демонстрации работают коды: TOY10, PODAROK15"
      checkoutLabel="Оформить заказ"
      onCheckout={onCheckout}
    />
  )
}
