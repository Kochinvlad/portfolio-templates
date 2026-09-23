import { useState } from 'react'
import { Flame, Plus, ShoppingBag, Weight } from 'lucide-react'
import type { Product } from '../../lib/types'
import { formatPrice } from '../../lib/format'
import { cn } from '../../lib/cn'
import { useCart } from '../../store/cart'
import { Button } from '../../ui/Button'
import { Badge, QtyStepper, Rating } from '../../ui/Bits'
import { Modal } from '../../ui/Modal'
import { photoUrl } from '../../lib/photos'
import { ProductArt } from '../../ui/ProductArt'
import { useToast } from '../../ui/Toast'

/** Карточка блюда в меню. */
export function SushiCard({ product, onOpen }: { product: Product; onOpen: () => void }) {
  const { add, qtyOf } = useCart()
  const { toast } = useToast()
  const inCart = qtyOf(product.id)

  function handleAdd(e: React.MouseEvent) {
    e.stopPropagation()
    add(product)
    toast(`«${product.name}» в корзине`)
  }

  return (
    <article
      onClick={product.outOfStock ? undefined : onOpen}
      className={cn(
        'group flex flex-col overflow-hidden rounded-card border border-line bg-surface-2 transition duration-300',
        product.outOfStock
          ? 'opacity-55'
          : 'cursor-pointer hover:-translate-y-1 hover:border-brand/50 hover:shadow-pop',
      )}
    >
      <div className="relative">
        <ProductArt
          glyph={product.glyph}
          hue={product.hue}
          photo={photoUrl(product.id)}
          alt={product.name}
          scale="lg"
          className="h-44 w-full transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.badge && <Badge tone="accent">{product.badge}</Badge>}
          {product.oldPrice && (
            <Badge tone="sale">−{Math.round((1 - product.price / product.oldPrice) * 100)} %</Badge>
          )}
          {product.outOfStock && <Badge tone="neutral">Закончилось</Badge>}
        </div>
        {inCart > 0 && (
          <span className="absolute right-3 top-3 grid h-7 min-w-7 place-items-center rounded-full bg-brand px-2 text-[12px] font-extrabold text-on-brand">
            {inCart}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <h3 className="font-head text-[17px] font-bold leading-snug text-ink">{product.name}</h3>
        <p className="line-clamp-2 text-[14px] leading-relaxed text-ink-soft">
          {product.description}
        </p>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-ink-soft">
          {product.weight && (
            <span className="inline-flex items-center gap-1">
              <Weight size={13} /> {product.weight}
            </span>
          )}
          {product.tags?.includes('Остро') && (
            <span className="inline-flex items-center gap-1 text-brand">
              <Flame size={13} /> остро
            </span>
          )}
        </div>

        {product.rating && <Rating value={product.rating} reviews={product.reviews} />}

        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div>
            {product.oldPrice && (
              <span className="block text-[13px] text-ink-soft line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
            <span className="font-head text-xl font-extrabold text-ink">
              {formatPrice(product.price)}
            </span>
          </div>
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={product.outOfStock}
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

/** Подробная карточка блюда в модальном окне. */
export function SushiProductModal({
  product,
  onClose,
}: {
  product: Product | null
  onClose: () => void
}) {
  const { add } = useCart()
  const { toast } = useToast()
  const [qty, setQty] = useState(1)

  // Сбрасываем количество при смене товара
  const [lastId, setLastId] = useState<string | null>(null)
  if (product && product.id !== lastId) {
    setLastId(product.id)
    setQty(1)
  }

  function handleAdd() {
    if (!product) return
    add(product, { qty })
    toast(`«${product.name}» × ${qty} в корзине`)
    onClose()
  }

  return (
    <Modal open={product !== null} onClose={onClose} size="md" label={product?.name ?? 'Блюдо'}>
      {product && (
        <div className="grid sm:grid-cols-2">
          <ProductArt
            glyph={product.glyph}
            hue={product.hue}
            photo={photoUrl(product.id)}
            alt={product.name}
            scale="xl"
            className="h-56 w-full sm:h-full sm:min-h-[22rem]"
          />

          <div className="flex flex-col gap-4 p-6">
            <div className="flex flex-wrap gap-2">
              {product.badge && <Badge tone="accent">{product.badge}</Badge>}
              {product.tags?.map((t) => (
                <Badge key={t} tone="neutral">
                  {t}
                </Badge>
              ))}
            </div>

            <div>
              <h2 className="font-head text-2xl font-extrabold leading-tight text-ink">
                {product.name}
              </h2>
              {product.rating && (
                <Rating value={product.rating} reviews={product.reviews} className="mt-2" />
              )}
            </div>

            <p className="text-[15px] leading-relaxed text-ink-soft">{product.description}</p>

            {product.weight && (
              <dl className="flex items-center gap-2 rounded-control bg-surface-2 px-4 py-3 text-[14px]">
                <dt className="text-ink-soft">Вес и количество:</dt>
                <dd className="font-semibold text-ink">{product.weight}</dd>
              </dl>
            )}

            <div className="mt-auto flex flex-col gap-4 border-t border-line pt-5">
              <div className="flex items-center justify-between">
                <div>
                  {product.oldPrice && (
                    <span className="block text-[14px] text-ink-soft line-through">
                      {formatPrice(product.oldPrice)}
                    </span>
                  )}
                  <span className="font-head text-2xl font-extrabold text-ink">
                    {formatPrice(product.price * qty)}
                  </span>
                </div>
                <QtyStepper value={qty} onChange={setQty} min={1} max={20} />
              </div>

              <Button size="lg" full onClick={handleAdd} disabled={product.outOfStock}>
                <ShoppingBag size={18} />
                {product.outOfStock ? 'Закончилось' : 'Добавить в корзину'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}
