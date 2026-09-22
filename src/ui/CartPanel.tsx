import { useState } from 'react'
import { BadgePercent, ShoppingBag, Truck, X } from 'lucide-react'
import type { CartLine } from '../lib/types'
import { formatPrice, pluralWithCount } from '../lib/format'
import { useCart } from '../store/cart'
import { Button } from './Button'
import { EmptyState, QtyStepper } from './Bits'
import { Drawer } from './Drawer'
import { photoUrl } from '../lib/photos'
import { ProductArt } from './ProductArt'
import { useToast } from './Toast'

function CartRow({ line }: { line: CartLine }) {
  const { setQty, remove } = useCart()
  const price = (line.product.price + (line.variantPrice ?? 0)) * line.qty

  return (
    <li className="flex gap-3 border-b border-line py-4 last:border-b-0">
      <ProductArt
        glyph={line.product.glyph}
        hue={line.product.hue}
        photo={photoUrl(line.product.id)}
        scale="sm"
        className="h-20 w-20 shrink-0 rounded-control"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-ink">{line.product.name}</h3>
            <p className="text-[13px] text-ink-soft">
              {line.variant ?? line.product.weight ?? line.product.brand ?? ''}
            </p>
          </div>
          <button
            type="button"
            onClick={() => remove(line.key)}
            aria-label={`Убрать «${line.product.name}» из корзины`}
            className="grid h-7 w-7 shrink-0 cursor-pointer place-items-center rounded-full text-ink-soft transition hover:bg-surface-3 hover:text-ink"
          >
            <X size={15} />
          </button>
        </div>
        <div className="flex items-center justify-between gap-2">
          <QtyStepper value={line.qty} onChange={(v) => setQty(line.key, v)} size="sm" min={0} />
          <span className="font-head font-extrabold text-ink">{formatPrice(price)}</span>
        </div>
      </div>
    </li>
  )
}

function FreeDeliveryBar({ threshold }: { threshold: number }) {
  const { subtotal, freeDeliveryLeft } = useCart()
  const progress = Math.min(100, Math.round((subtotal / threshold) * 100))

  return (
    <div className="mb-4 rounded-control bg-surface-2 p-4">
      <p className="flex items-center gap-2 text-[14px] text-ink">
        <Truck size={16} className="shrink-0 text-brand" />
        {freeDeliveryLeft > 0 ? (
          <span>
            До бесплатной доставки <b className="text-brand">{formatPrice(freeDeliveryLeft)}</b>
          </span>
        ) : (
          <span className="font-semibold text-emerald-600">Доставка бесплатная</span>
        )}
      </p>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-3">
        <div
          className="h-full rounded-full bg-brand transition-[width] duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

function PromoField({ hint }: { hint: string }) {
  const { appliedPromo, applyPromo, clearPromo } = useCart()
  const { toast } = useToast()
  const [code, setCode] = useState('')

  if (appliedPromo) {
    return (
      <div className="mb-4 flex items-center justify-between gap-3 rounded-control border border-emerald-500/40 bg-emerald-500/10 px-4 py-3">
        <span className="flex min-w-0 items-center gap-2 text-[14px]">
          <BadgePercent size={16} className="shrink-0 text-emerald-600" />
          <span className="truncate text-ink">
            <b>{appliedPromo.code}</b> · {appliedPromo.label}
          </span>
        </span>
        <button
          type="button"
          onClick={() => {
            clearPromo()
            toast('Промокод отменён', 'info')
          }}
          className="shrink-0 cursor-pointer text-[13px] font-semibold text-ink-soft underline transition hover:text-ink"
        >
          отменить
        </button>
      </div>
    )
  }

  return (
    <div className="mb-4">
      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Промокод"
          aria-label="Промокод"
          className="min-w-0 flex-1 rounded-control border border-line bg-surface-2 px-4 py-2.5 text-[15px] uppercase text-ink outline-none transition placeholder:normal-case placeholder:text-ink-soft focus:border-brand"
        />
        <Button
          variant="outline"
          onClick={() => {
            if (applyPromo(code)) {
              toast('Промокод применён')
              setCode('')
            } else {
              toast('Такого промокода нет', 'error')
            }
          }}
          disabled={code.trim().length === 0}
        >
          Применить
        </Button>
      </div>
      <p className="mt-2 text-[13px] text-ink-soft">{hint}</p>
    </div>
  )
}

type CartPanelProps = {
  /** Заголовок панели: «Корзина». */
  title: string
  /** Подпись строки с суммой товаров: «Блюда» или «Товары». */
  itemsLabel: string
  emptyTitle: string
  emptyText: string
  emptyActionLabel: string
  /** Порог бесплатной доставки. 0 — полосу не показываем. */
  freeDeliveryFrom?: number
  /** Подсказка под полем промокода. Пусто — поле скрыто. */
  promoHint?: string
  checkoutLabel: string
  onCheckout: () => void
}

/**
 * Выдвижная корзина. Одна на все шаблоны — различается только текстами
 * и настройками доставки, которые приходят пропсами.
 */
export function CartPanel({
  title,
  itemsLabel,
  emptyTitle,
  emptyText,
  emptyActionLabel,
  freeDeliveryFrom = 0,
  promoHint,
  checkoutLabel,
  onCheckout,
}: CartPanelProps) {
  const { lines, isOpen, close, count, subtotal, discount, delivery, total, clear } = useCart()

  return (
    <Drawer
      open={isOpen}
      onClose={close}
      label={title}
      title={
        <span className="flex items-baseline gap-2">
          {title}
          {count > 0 && (
            <span className="text-[14px] font-medium text-ink-soft">
              {pluralWithCount(count, ['позиция', 'позиции', 'позиций'])}
            </span>
          )}
        </span>
      }
      footer={
        lines.length > 0 ? (
          <div className="flex flex-col gap-3">
            <dl className="flex flex-col gap-2 text-[15px]">
              <div className="flex justify-between">
                <dt className="text-ink-soft">{itemsLabel}</dt>
                <dd className="font-semibold text-ink">{formatPrice(subtotal)}</dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between">
                  <dt className="text-ink-soft">Скидка по промокоду</dt>
                  <dd className="font-semibold text-emerald-600">−{formatPrice(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-ink-soft">Доставка</dt>
                <dd className="font-semibold text-ink">
                  {delivery === 0 ? 'бесплатно' : formatPrice(delivery)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-line pt-2">
                <dt className="font-head text-lg font-bold text-ink">Итого</dt>
                <dd className="font-head text-lg font-extrabold text-brand">
                  {formatPrice(total)}
                </dd>
              </div>
            </dl>
            <Button size="lg" full onClick={onCheckout}>
              {checkoutLabel}
            </Button>
            <button
              type="button"
              onClick={clear}
              className="cursor-pointer text-[13px] font-medium text-ink-soft underline transition hover:text-ink"
            >
              Очистить корзину
            </button>
          </div>
        ) : undefined
      }
    >
      {lines.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag size={26} />}
          title={emptyTitle}
          text={emptyText}
          action={<Button onClick={close}>{emptyActionLabel}</Button>}
        />
      ) : (
        <>
          {freeDeliveryFrom > 0 && <FreeDeliveryBar threshold={freeDeliveryFrom} />}
          {promoHint && <PromoField hint={promoHint} />}
          <ul>
            {lines.map((line) => (
              <CartRow key={line.key} line={line} />
            ))}
          </ul>
        </>
      )}
    </Drawer>
  )
}
