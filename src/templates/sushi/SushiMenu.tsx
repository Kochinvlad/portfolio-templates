import { useMemo, useState } from 'react'
import { Search, SearchX } from 'lucide-react'
import type { Product } from '../../lib/types'
import { cn } from '../../lib/cn'
import { useDebounced } from '../../lib/hooks'
import { Button } from '../../ui/Button'
import { EmptyState, SectionHeading } from '../../ui/Bits'
import { SUSHI_CATEGORIES, SUSHI_MENU } from './data'
import { SushiCard } from './SushiProduct'

export function SushiMenu({ onOpenProduct }: { onOpenProduct: (p: Product) => void }) {
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const query = useDebounced(search, 200).trim().toLowerCase()

  const visible = useMemo(() => {
    return SUSHI_MENU.filter((p) => {
      const byCategory = category === 'all' || p.category === category
      const byQuery =
        query.length === 0 ||
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      return byCategory && byQuery
    })
  }, [category, query])

  const tabs = [{ id: 'all', name: 'Всё меню', glyph: '✨' }, ...SUSHI_CATEGORIES]

  return (
    <section id="menu" className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto w-full max-w-6xl">
        <div className="reveal flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Меню"
            title="Двадцать две позиции — и все свежие"
            subtitle="Рыбу привозят каждое утро, роллы крутят после того, как вы нажали «Заказать». Поэтому доставка 60 минут, а не 20."
          />
          <label className="relative w-full md:max-w-xs">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Найти блюдо"
              aria-label="Поиск по меню"
              className="w-full rounded-control border border-line bg-surface-2 py-3 pl-11 pr-4 text-[15px] text-ink outline-none transition placeholder:text-ink-soft focus:border-brand"
            />
          </label>
        </div>

        {/* Категории */}
        <div className="no-scrollbar -mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {tabs.map((tab) => {
            const active = tab.id === category
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCategory(tab.id)}
                aria-pressed={active}
                className={cn(
                  'flex shrink-0 cursor-pointer items-center gap-2 rounded-full border px-4 py-2.5 text-[15px] font-semibold transition',
                  active
                    ? 'border-brand bg-brand text-on-brand'
                    : 'border-line bg-surface-2 text-ink-soft hover:border-brand/50 hover:text-ink',
                )}
              >
                <span aria-hidden="true">{tab.glyph}</span>
                {tab.name}
              </button>
            )
          })}
        </div>

        {/* Карточки */}
        {visible.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((product) => (
              <SushiCard key={product.id} product={product} onOpen={() => onOpenProduct(product)} />
            ))}
          </div>
        ) : (
          <EmptyState
            className="mt-8 rounded-card border border-line bg-surface-2"
            icon={<SearchX size={26} />}
            title="Ничего не нашлось"
            text={`По запросу «${search}» в этой категории пусто. Попробуйте другое слово или посмотрите всё меню.`}
            action={
              <Button
                variant="outline"
                onClick={() => {
                  setSearch('')
                  setCategory('all')
                }}
              >
                Сбросить фильтры
              </Button>
            }
          />
        )}
      </div>
    </section>
  )
}
