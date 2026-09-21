import { useState } from 'react'
import { Cake, Check, Gift, Plus, ShoppingBasket } from 'lucide-react'
import type { Product } from '../../lib/types'
import { cn } from '../../lib/cn'
import { formatPrice } from '../../lib/format'
import { useCart } from '../../store/cart'
import { Button } from '../../ui/Button'
import { Badge, QtyStepper, Rating } from '../../ui/Bits'
import { Modal } from '../../ui/Modal'
import { ProductArt } from '../../ui/ProductArt'
import { useToast } from '../../ui/Toast'
import { TOYS_GIFT_WRAP_PRICE } from './data'

function ageLabel(product: Product): string {
  const min = product.ageMin ?? 0
  const max = product.ageMax ?? 18
  if (min === 0) return `до ${max} лет`
  if (max >= 16) return `${min}+ лет`
  return `${min}–${max} лет`
}

export function ToysCard({ product, onOpen }: { product: Product; onOpen: () => void }) {
  const { add, qtyOf } = useCart()
  const { toast } = useToast()
  const inCart = qtyOf(product.id)

  return (
    <article
      onClick={product.outOfStock ? undefined : onOpen}
      className={cn(
        'group flex flex-col overflow-hidden rounded-card border-2 border-line bg-surface-2 transition duration-300',
        product.outOfStock
          ? 'opacity-60'
          : 'cursor-pointer hover:-translate-y-1.5 hover:border-brand hover:shadow-card',
      )}
    >
      <div className="relative">
        <ProductArt
          glyph={product.glyph}
          hue={product.hue}
          scale="lg"
          className="h-44 w-full transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.badge && <Badge tone="accent">{product.badge}</Badge>}
          {product.oldPrice && (
            <Badge tone="sale">−{Math.round((1 - product.price / product.oldPrice) * 100)} %</Badge>
          )}
          {product.outOfStock && <Badge tone="neutral">Нет в наличии</Badge>}
        </div>
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-[12px] font-extrabold text-ink">
          <Cake size={12} className="text-brand" />
          {ageLabel(product)}
        </span>
        {inCart > 0 && (
          <span className="absolute right-3 top-3 grid h-7 min-w-7 place-items-center rounded-full bg-brand px-2 text-[12px] font-extrabold text-on-brand">
            {inCart}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-head text-[17px] font-extrabold leading-snug text-ink">
          {product.name}
        </h3>
        {product.rating && <Rating value={product.rating} reviews={product.reviews} size={13} />}
        <p className="line-clamp-2 text-[14px] font-medium leading-relaxed text-ink-soft">
          {product.description}
        </p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div>
            {product.oldPrice && (
              <span className="block text-[13px] font-semibold text-ink-soft line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
            <span className="font-head text-xl font-black text-ink">
              {formatPrice(product.price)}
            </span>
          </div>
          <Button
            size="sm"
            disabled={product.outOfStock}
            onClick={(e) => {
              e.stopPropagation()
              add(product)
              toast(`«${product.name}» в корзине`)
            }}
            aria-label={`Добавить «${product.name}» в корзину`}
          >
            <Plus size={16} />
            {inCart > 0 ? 'Ещё' : 'В корзину'}
          </Button>
        </div>
      </div>
    </article>
  )
}

export function ToysProductModal({
  product,
  onClose,
}: {
  product: Product | null
  onClose: () => void
}) {
  const { add } = useCart()
  const { toast } = useToast()
  const [qty, setQty] = useState(1)
  const [giftWrap, setGiftWrap] = useState(false)
  const [lastId, setLastId] = useState<string | null>(null)

  if (product && product.id !== lastId) {
    setLastId(product.id)
    setQty(1)
    setGiftWrap(false)
  }

  const unitPrice = product ? product.price + (giftWrap ? TOYS_GIFT_WRAP_PRICE : 0) : 0

  function handleAdd() {
    if (!product) return
    add(product, {
      qty,
      variant: giftWrap ? 'Подарочная упаковка' : undefined,
      variantPrice: giftWrap ? TOYS_GIFT_WRAP_PRICE : 0,
    })
    toast(`«${product.name}» × ${qty} в корзине`)
    onClose()
  }

  return (
    <Modal open={product !== null} onClose={onClose} size="md" label={product?.name ?? 'Игрушка'}>
      {product && (
        <div className="grid sm:grid-cols-2">
          <ProductArt
            glyph={product.glyph}
            hue={product.hue}
            scale="xl"
            className="h-56 w-full sm:h-full sm:min-h-[24rem]"
          />

          <div className="flex flex-col gap-4 p-6">
            <div className="flex flex-wrap gap-2">
              {product.badge && <Badge tone="accent">{product.badge}</Badge>}
              <Badge tone="neutral">{ageLabel(product)}</Badge>
            </div>

            <div>
              <h2 className="font-head text-2xl font-black leading-tight text-ink">
                {product.name}
              </h2>
              {product.rating && (
                <Rating value={product.rating} reviews={product.reviews} className="mt-2" />
              )}
            </div>

            <p className="text-[15px] font-medium leading-relaxed text-ink-soft">
              {product.description}
            </p>

            {/* Подарочная упаковка */}
            <label
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-control border-2 px-4 py-3 transition',
                giftWrap ? 'border-brand bg-brand-soft' : 'border-line bg-surface-2 hover:border-brand/50',
              )}
            >
              <span
                className={cn(
                  'grid h-6 w-6 shrink-0 place-items-center rounded-lg border-2 transition',
                  giftWrap ? 'border-brand bg-brand text-on-brand' : 'border-line bg-surface',
                )}
              >
                {giftWrap && <Check size={14} />}
              </span>
              <input
                type="checkbox"
                checked={giftWrap}
                onChange={() => setGiftWrap((v) => !v)}
                className="sr-only"
              />
              <Gift size={18} className={giftWrap ? 'text-brand' : 'text-ink-soft'} />
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-bold text-ink">Подарочная упаковка</span>
                <span className="block text-[13px] font-medium text-ink-soft">
                  Крафтовая бумага, лента и открытка
                </span>
              </span>
              <span className="shrink-0 font-head font-extrabold text-brand">
                +{formatPrice(TOYS_GIFT_WRAP_PRICE)}
              </span>
            </label>

            <div className="mt-auto flex flex-col gap-4 border-t border-line pt-5">
              <div className="flex items-end justify-between gap-3">
                <div>
                  {product.oldPrice && (
                    <span className="block text-[14px] font-semibold text-ink-soft line-through">
                      {formatPrice(product.oldPrice * qty)}
                    </span>
                  )}
                  <span className="font-head text-2xl font-black text-ink">
                    {formatPrice(unitPrice * qty)}
                  </span>
                </div>
                <QtyStepper value={qty} onChange={setQty} min={1} max={10} />
              </div>

              <Button size="lg" full onClick={handleAdd} disabled={product.outOfStock}>
                <ShoppingBasket size={18} />
                {product.outOfStock ? 'Нет в наличии' : 'Добавить в корзину'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}
