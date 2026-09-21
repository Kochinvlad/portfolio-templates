import { CartPanel } from '../../ui/CartPanel'
import { SUSHI_FREE_DELIVERY_FROM } from './data'

/** Корзина суши-бара: общий компонент плюс тексты этого шаблона. */
export function SushiCartDrawer({ onCheckout }: { onCheckout: () => void }) {
  return (
    <CartPanel
      title="Корзина"
      itemsLabel="Блюда"
      emptyTitle="Пока пусто"
      emptyText="Выберите что-нибудь из меню — сеты выгоднее, чем роллы по отдельности."
      emptyActionLabel="Вернуться к меню"
      freeDeliveryFrom={SUSHI_FREE_DELIVERY_FROM}
      promoHint="Для демонстрации работают коды: ROLL15, FIRST10, VECHER20"
      checkoutLabel="Оформить заказ"
      onCheckout={onCheckout}
    />
  )
}
