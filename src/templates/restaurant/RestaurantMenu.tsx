import { useMemo, useState } from 'react'
import { Leaf } from 'lucide-react'
import type { Product } from '../../lib/types'
import { cn } from '../../lib/cn'
import { formatPrice } from '../../lib/format'
import { buttonStyles } from '../../ui/Button'
import { Modal } from '../../ui/Modal'
import { photoUrl } from '../../lib/photos'
import { ProductArt } from '../../ui/ProductArt'
import { REST_CATEGORIES, REST_FULL_MENU } from './data'

const VEGETARIAN = 'Вегетарианское'

/** Пометка шефа курсивом — как приписка на печатном меню, а не цветная плашка. */
function ChefNote({ children }: { children: string }) {
  return <span className="font-head text-[15px] italic text-brand">{children}</span>
}

function VegetarianNote() {
  return (
    <span className="inline-flex items-center gap-1 text-[13px] font-medium text-accent">
      <Leaf size={13} aria-hidden="true" /> вегетарианское
    </span>
  )
}

/** Пометки блюда одной строкой: приписка шефа и вегетарианское. */
function DishNotes({ item, className }: { item: Product; className?: string }) {
  const vegetarian = item.tags?.includes(VEGETARIAN)
  if (!item.badge && !vegetarian) return null
  return (
    <div className={cn('flex flex-wrap items-baseline gap-x-4 gap-y-1', className)}>
      {item.badge && <ChefNote>{item.badge}</ChefNote>}
      {vegetarian && <VegetarianNote />}
    </div>
  )
}

/** Строка меню: название, точечный лидер, цена. */
function MenuRow({ item, onOpen }: { item: Product; onOpen: () => void }) {
  return (
    <li>
      <button
        type="button"
        onClick={onOpen}
        className="group w-full cursor-pointer border-b border-line py-5 text-left transition hover:bg-surface"
      >
        <div className="flex items-baseline gap-3">
          <h3 className="font-head text-[19px] font-normal text-ink transition group-hover:text-brand sm:text-[21px]">
            {item.name}
          </h3>
          <span
            aria-hidden="true"
            className="min-w-6 flex-1 translate-y-[-3px] border-b border-dotted"
            style={{ borderColor: `color-mix(in srgb, var(--ink-soft) 50%, transparent)` }}
          />
          <span className="font-head text-[19px] text-ink">{formatPrice(item.price)}</span>
        </div>
        <p className="mt-1.5 pr-16 text-[14px] leading-relaxed text-ink-soft">{item.description}</p>
        <DishNotes item={item} className="mt-2" />
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
      <div className="mx-auto w-full max-w-5xl">
        <div className="flex flex-col items-center text-center">
          <h2 className="font-head text-4xl font-normal leading-[1.1] text-ink sm:text-5xl">
            Что мы готовим сегодня
          </h2>
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-ink-soft">
            Меню меняется четыре раза в год вместе с сезоном. Основа остаётся, детали&nbsp;— нет.
          </p>
        </div>

        {/* Лист меню: единственный блок на странице, оформленный как предмет */}
        <div className="mt-10 border border-line bg-surface-2 px-4 pb-4 sm:px-12 sm:pb-8">
          <div className="no-scrollbar -mx-4 flex justify-start gap-1 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:justify-center sm:px-0">
            {REST_CATEGORIES.map((cat) => {
              const active = cat.id === category
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  aria-pressed={active}
                  className={cn(
                    '-mb-px shrink-0 cursor-pointer border-b-2 px-4 pb-4 pt-5 font-head text-[18px] transition',
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

          <ul className="mt-2 grid gap-x-12 md:grid-cols-2">
            {items.map((item) => (
              <MenuRow key={item.id} item={item} onOpen={() => setOpened(item)} />
            ))}
          </ul>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 text-center">
          <p className="text-[15px] text-ink-soft">
            Есть аллергия или ограничения? Скажите официанту&nbsp;— на кухне подберут замену.
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
                <h2 className="font-head text-[26px] font-normal leading-tight text-ink">
                  {opened.name}
                </h2>
                <span className="shrink-0 font-head text-[21px] text-brand">
                  {formatPrice(opened.price)}
                </span>
              </div>
              <p className="text-[15px] leading-relaxed text-ink-soft">{opened.description}</p>
              <DishNotes item={opened} />
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
