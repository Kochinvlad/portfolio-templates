import { useMemo, useState } from 'react'
import { Leaf } from 'lucide-react'
import type { Product } from '../../lib/types'
import { cn } from '../../lib/cn'
import { formatPrice } from '../../lib/format'
import { buttonStyles } from '../../ui/Button'
import { Badge } from '../../ui/Bits'
import { Modal } from '../../ui/Modal'
import { photoUrl } from '../../lib/photos'
import { ProductArt } from '../../ui/ProductArt'
import { REST_CATEGORIES, REST_FULL_MENU } from './data'

/** Строка меню: название, точечный лидер, цена. */
function MenuRow({ item, onOpen }: { item: Product; onOpen: () => void }) {
  return (
    <li>
      <button
        type="button"
        onClick={onOpen}
        className="group w-full cursor-pointer border-b border-line py-5 text-left transition hover:bg-surface-2"
      >
        <div className="flex items-baseline gap-3">
          <h3 className="font-head text-[19px] font-semibold text-ink transition group-hover:text-brand">
            {item.name}
          </h3>
          <span
            aria-hidden="true"
            className="min-w-6 flex-1 translate-y-[-3px] border-b border-dotted"
            style={{ borderColor: `color-mix(in srgb, var(--ink-soft) 50%, transparent)` }}
          />
          <span className="font-head text-[17px] font-semibold text-ink">
            {formatPrice(item.price)}
          </span>
        </div>
        <p className="mt-1.5 pr-16 text-[14px] leading-relaxed text-ink-soft">{item.description}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {item.badge && <Badge tone="brand">{item.badge}</Badge>}
          {item.tags?.includes('Вегетарианское') && (
            <span className="inline-flex items-center gap-1 text-[12px] font-semibold uppercase tracking-wider text-emerald-700">
              <Leaf size={12} /> вегетарианское
            </span>
          )}
        </div>
      </button>
    </li>
  )
}

export function RestaurantMenu() {
  const [category, setCategory] = useState(REST_CATEGORIES[0].id)
  const [opened, setOpened] = useState<Product | null>(null)

  const items = useMemo(
    () => REST_FULL_MENU.filter((p) => p.category === category),
    [category],
  )

  return (
    <section id="menu" className="border-t border-line px-4 py-16 sm:px-6 sm:py-24">
      <div className="reveal mx-auto w-full max-w-5xl">
        <div className="flex flex-col items-center text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
            Меню
          </span>
          <h2 className="mt-5 font-head text-3xl font-semibold leading-tight text-ink sm:text-4xl">
            Что мы готовим сегодня
          </h2>
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-ink-soft">
            Меню меняется четыре раза в год вместе с сезоном. Основа остаётся, детали — нет.
          </p>
        </div>

        {/* Категории */}
        <div className="no-scrollbar -mx-4 mt-10 flex justify-start gap-1 overflow-x-auto px-4 sm:mx-0 sm:justify-center sm:px-0">
          {REST_CATEGORIES.map((cat) => {
            const active = cat.id === category
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                aria-pressed={active}
                className={cn(
                  'shrink-0 cursor-pointer border-b-2 px-5 py-3 text-[14px] font-semibold uppercase tracking-[0.1em] transition',
                  active
                    ? 'border-brand text-ink'
                    : 'border-transparent text-ink-soft hover:text-ink',
                )}
              >
                {cat.name}
              </button>
            )
          })}
        </div>

        <ul className="mt-6 grid gap-x-12 md:grid-cols-2">
          {items.map((item) => (
            <MenuRow key={item.id} item={item} onOpen={() => setOpened(item)} />
          ))}
        </ul>

        <div className="mt-12 flex flex-col items-center gap-4 text-center">
          <p className="text-[15px] text-ink-soft">
            Есть аллергия или ограничения? Скажите официанту — на кухне подберут замену.
          </p>
          <a href="#booking" className={buttonStyles('primary', 'lg')}>
            Забронировать столик
          </a>
        </div>
      </div>

      <Modal
        open={opened !== null}
        onClose={() => setOpened(null)}
        size="sm"
        label={opened?.name ?? 'Блюдо'}
      >
        {opened && (
          <div>
            <ProductArt
              glyph={opened.glyph}
              hue={opened.hue}
              photo={photoUrl(opened.id)}
              alt={opened.name}
              scale="xl"
              className="h-56 w-full"
            />
            <div className="flex flex-col gap-4 p-6">
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-head text-2xl font-semibold leading-tight text-ink">
                  {opened.name}
                </h2>
                <span className="shrink-0 font-head text-xl font-semibold text-brand">
                  {formatPrice(opened.price)}
                </span>
              </div>
              <p className="text-[15px] leading-relaxed text-ink-soft">{opened.description}</p>
              <div className="flex flex-wrap gap-2">
                {opened.badge && <Badge tone="brand">{opened.badge}</Badge>}
                {opened.tags?.map((t) => (
                  <Badge key={t} tone="neutral">
                    {t}
                  </Badge>
                ))}
              </div>
              <a
                href="#booking"
                onClick={() => setOpened(null)}
                className={buttonStyles('primary', 'md', 'w-full')}
              >
                Забронировать столик
              </a>
            </div>
          </div>
        )}
      </Modal>
    </section>
  )
}
