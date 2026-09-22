import { useState } from 'react'
import { Check, Heart, ShoppingCart, Truck } from 'lucide-react'
import type { Product } from '../../lib/types'
import { cn } from '../../lib/cn'
import { formatPrice } from '../../lib/format'
import { useCart } from '../../store/cart'
import { useFavorites } from '../../store/favorites'
import { Button } from '../../ui/Button'
import { Badge, QtyStepper, Rating } from '../../ui/Bits'
import { Modal } from '../../ui/Modal'
import { photoUrl } from '../../lib/photos'
import { ProductArt } from '../../ui/ProductArt'
import { useToast } from '../../ui/Toast'

function discountPercent(product: Product): number | null {
  if (!product.oldPrice) return null
  return Math.round((1 - product.price / product.oldPrice) * 100)
}

/** Кнопка «в избранное» — сердечко. */
function FavoriteButton({ id, name }: { id: string; name: string }) {
  const { has, toggle } = useFavorites()
  const { toast } = useToast()
  const active = has(id)

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        toggle(id)
        toast(active ? `«${name}» убран из избранного` : `«${name}» в избранном`, 'info')
      }}
      aria-label={active ? `Убрать «${name}» из избранного` : `Добавить «${name}» в избранное`}
      aria-pressed={active}
      className={cn(
        'grid h-9 w-9 cursor-pointer place-items-center rounded-full border transition',
        active
          ? 'border-red-200 bg-red-50 text-red-500'
          : 'border-line bg-surface text-ink-soft hover:border-red-300 hover:text-red-500',
      )}
    >
      <Heart size={17} fill={active ? 'currentColor' : 'none'} />
    </button>
  )
}

export function ShopCard({ product, onOpen }: { product: Product; onOpen: () => void }) {
  const { add, qtyOf } = useCart()
  const { toast } = useToast()
  const inCart = qtyOf(product.id)
  const discount = discountPercent(product)

  return (
    <article
      onClick={product.outOfStock ? undefined : onOpen}
      className={cn(
        'group flex flex-col overflow-hidden rounded-card border border-line bg-surface transition duration-300',
        product.outOfStock
          ? 'opacity-60'
          : 'cursor-pointer hover:-translate-y-1 hover:border-brand/45 hover:shadow-card',
      )}
    >
      <div className="relative bg-surface-2">
        <ProductArt
          glyph={product.glyph}
          hue={product.hue}
          photo={photoUrl(product.id)}
          scale="lg"
          className="h-48 w-full transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {discount && <Badge tone="sale">−{discount} %</Badge>}
          {product.badge && <Badge tone="brand">{product.badge}</Badge>}
          {product.outOfStock && <Badge tone="neutral">Нет в наличии</Badge>}
        </div>
        <div className="absolute right-3 top-3">
          <FavoriteButton id={product.id} name={product.name} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        {product.brand && (
          <span className="text-[12px] font-semibold uppercase tracking-wider text-ink-soft">
            {product.brand}
          </span>
        )}
        <h3 className="font-head text-[16px] font-bold leading-snug text-ink">{product.name}</h3>
        {product.rating && <Rating value={product.rating} reviews={product.reviews} size={13} />}
        <p className="line-clamp-2 text-[14px] leading-relaxed text-ink-soft">
          {product.description}
        </p>

        <div className="mt-auto pt-3">
          <div className="flex items-baseline gap-2">
            <span className="font-head text-xl font-extrabold text-ink">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-[14px] text-ink-soft line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
          <Button
            full
            size="sm"
            className="mt-3"
            variant={inCart > 0 ? 'outline' : 'primary'}
            disabled={product.outOfStock}
            onClick={(e) => {
              e.stopPropagation()
              add(product)
              toast(`«${product.name}» в корзине`)
            }}
            aria-label={`Добавить «${product.name}» в корзину`}
          >
            {inCart > 0 ? (
              <>
                <Check size={16} /> В корзине · {inCart}
              </>
            ) : (
              <>
                <ShoppingCart size={16} /> В корзину
              </>
            )}
          </Button>
        </div>
      </div>
    </article>
  )
}

/** Подробная карточка товара. */
export function ShopProductModal({
  product,
  onClose,
}: {
  product: Product | null
  onClose: () => void
}) {
  const { add } = useCart()
  const { toast } = useToast()
  const [qty, setQty] = useState(1)
  const [lastId, setLastId] = useState<string | null>(null)

  if (product && product.id !== lastId) {
    setLastId(product.id)
    setQty(1)
  }

  const discount = product ? discountPercent(product) : null

  return (
    <Modal open={product !== null} onClose={onClose} size="lg" label={product?.name ?? 'Товар'}>
      {product && (
        <div className="grid lg:grid-cols-2">
          <div className="relative bg-surface-2">
            <ProductArt
              glyph={product.glyph}
              hue={product.hue}
              photo={photoUrl(product.id)}
              scale="xl"
              className="h-64 w-full lg:h-full lg:min-h-[28rem]"
            />
            <div className="absolute left-4 top-4 flex flex-col gap-1.5">
              {discount && <Badge tone="sale">−{discount} %</Badge>}
              {product.badge && <Badge tone="brand">{product.badge}</Badge>}
            </div>
          </div>

          <div className="flex flex-col gap-5 p-6 sm:p-8">
            <div>
              {product.brand && (
                <span className="text-[12px] font-semibold uppercase tracking-wider text-ink-soft">
                  {product.brand}
                </span>
              )}
              <h2 className="mt-1 font-head text-2xl font-extrabold leading-tight text-ink">
                {product.name}
              </h2>
              {product.rating && (
                <Rating value={product.rating} reviews={product.reviews} className="mt-2.5" />
              )}
            </div>

            <p className="text-[15px] leading-relaxed text-ink-soft">{product.description}</p>

            {product.specs && (
              <dl className="overflow-hidden rounded-control border border-line">
                {product.specs.map((spec, i) => (
                  <div
                    key={spec.label}
                    className={cn(
                      'flex items-baseline justify-between gap-4 px-4 py-3 text-[14px]',
                      i % 2 === 0 ? 'bg-surface-2' : 'bg-surface',
                    )}
                  >
                    <dt className="text-ink-soft">{spec.label}</dt>
                    <dd className="text-right font-semibold text-ink">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="flex items-center gap-2.5 rounded-control bg-brand-soft px-4 py-3 text-[14px] text-ink">
              <Truck size={17} className="shrink-0 text-brand" />
              {product.outOfStock
                ? 'Товара нет в наличии — сообщим, когда появится'
                : 'Доставим завтра при заказе до 18:00'}
            </div>

            <div className="mt-auto flex flex-col gap-4 border-t border-line pt-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  {product.oldPrice && (
                    <span className="block text-[14px] text-ink-soft line-through">
                      {formatPrice(product.oldPrice * qty)}
                    </span>
                  )}
                  <span className="font-head text-2xl font-extrabold text-ink">
                    {formatPrice(product.price * qty)}
                  </span>
                </div>
                <QtyStepper value={qty} onChange={setQty} min={1} max={10} />
              </div>

              <div className="flex gap-2">
                <Button
                  size="lg"
                  className="flex-1"
                  disabled={product.outOfStock}
                  onClick={() => {
                    add(product, { qty })
                    toast(`«${product.name}» × ${qty} в корзине`)
                    onClose()
                  }}
                >
                  <ShoppingCart size={18} />
                  {product.outOfStock ? 'Нет в наличии' : 'Добавить в корзину'}
                </Button>
                <FavoriteButton id={product.id} name={product.name} />
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}
