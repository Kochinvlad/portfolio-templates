import { useEffect, useMemo, useState } from 'react'
import { PackageSearch, Search } from 'lucide-react'
import type { Product } from '../../lib/types'
import { cn } from '../../lib/cn'
import { pluralWithCount } from '../../lib/format'
import { useDebounced } from '../../lib/hooks'
import { Button } from '../../ui/Button'
import { EmptyState } from '../../ui/Bits'
import { TOYS_AGE_GROUPS, TOYS_CATALOG, TOYS_CATEGORIES, matchesAgeGroup } from './data'
import { ToysCard } from './ToysProduct'

type SortKey = 'popular' | 'price-asc' | 'price-desc'

const SORTS: Array<{ value: SortKey; label: string }> = [
  { value: 'popular', label: 'Сначала популярные' },
  { value: 'price-asc', label: 'Сначала недорогие' },
  { value: 'price-desc', label: 'Сначала дорогие' },
]

/** Круглая кнопка-фишка для фильтров. */
function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'flex shrink-0 cursor-pointer items-center gap-2 rounded-full border-2 px-4 py-2.5 text-[15px] font-bold transition',
        active
          ? 'border-brand bg-brand text-on-brand'
          : 'border-line bg-surface-2 text-ink-soft hover:border-brand/50 hover:text-ink',
      )}
    >
      {children}
    </button>
  )
}

type Props = {
  onOpenProduct: (product: Product) => void
  /** Возраст и категория, пришедшие из подбора подарка. */
  picked: { ageGroupId: string; categoryId: string } | null
  onPickedConsumed: () => void
}

export function ToysCatalog({ onOpenProduct, picked, onPickedConsumed }: Props) {
  const [ageGroup, setAgeGroup] = useState<string | null>(null)
  const [category, setCategory] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortKey>('popular')
  const query = useDebounced(search, 200).trim().toLowerCase()

  // Результат подбора подарка подставляется в фильтры каталога
  useEffect(() => {
    if (!picked) return
    setAgeGroup(picked.ageGroupId)
    setCategory(picked.categoryId)
    onPickedConsumed()
  }, [picked, onPickedConsumed])

  const visible = useMemo(() => {
    const age = ageGroup ? TOYS_AGE_GROUPS.find((a) => a.id === ageGroup) : null

    const filtered = TOYS_CATALOG.filter((p) => {
      if (category && p.category !== category) return false
      if (age && !matchesAgeGroup(p, age)) return false
      if (query) {
        const haystack = `${p.name} ${p.description}`.toLowerCase()
        if (!haystack.includes(query)) return false
      }
      return true
    })

    const sorted = [...filtered]
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price)
    else sorted.sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0))
    return sorted
  }, [ageGroup, category, query, sort])

  function resetAll() {
    setAgeGroup(null)
    setCategory(null)
    setSearch('')
  }

  return (
    <section id="catalog" className="px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto w-full max-w-6xl">
        <div className="reveal flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-head text-3xl font-black leading-tight text-ink sm:text-4xl">
              Каталог игрушек
            </h2>
            <p className="mt-2 text-[16px] font-medium text-ink-soft">
              {pluralWithCount(visible.length, ['игрушка', 'игрушки', 'игрушек'])}
              {query && ` по запросу «${search}»`}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Найти игрушку"
                aria-label="Поиск по каталогу"
                className="w-full rounded-control border-2 border-line bg-surface-2 py-2.5 pl-11 pr-4 text-[15px] font-medium text-ink outline-none transition placeholder:text-ink-soft focus:border-brand sm:w-56"
              />
            </label>
            <label>
              <span className="sr-only">Сортировка</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="w-full cursor-pointer rounded-control border-2 border-line bg-surface-2 px-4 py-2.5 text-[15px] font-bold text-ink outline-none transition focus:border-brand"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {/* Фильтр по возрасту */}
        <div className="mt-8">
          <h3 className="text-[13px] font-extrabold uppercase tracking-wider text-ink-soft">
            Возраст
          </h3>
          <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
            <Chip active={ageGroup === null} onClick={() => setAgeGroup(null)}>
              Любой
            </Chip>
            {TOYS_AGE_GROUPS.map((group) => (
              <Chip
                key={group.id}
                active={ageGroup === group.id}
                onClick={() => setAgeGroup(ageGroup === group.id ? null : group.id)}
              >
                <span aria-hidden="true">{group.glyph}</span>
                {group.label}
              </Chip>
            ))}
          </div>
        </div>

        {/* Фильтр по категории */}
        <div className="mt-6">
          <h3 className="text-[13px] font-extrabold uppercase tracking-wider text-ink-soft">
            Категория
          </h3>
          <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
            <Chip active={category === null} onClick={() => setCategory(null)}>
              Все
            </Chip>
            {TOYS_CATEGORIES.map((cat) => (
              <Chip
                key={cat.id}
                active={category === cat.id}
                onClick={() => setCategory(category === cat.id ? null : cat.id)}
              >
                <span aria-hidden="true">{cat.glyph}</span>
                {cat.name}
              </Chip>
            ))}
          </div>
        </div>

        {visible.length > 0 ? (
          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((product) => (
              <ToysCard key={product.id} product={product} onOpen={() => onOpenProduct(product)} />
            ))}
          </div>
        ) : (
          <EmptyState
            className="mt-9 rounded-card border-2 border-line bg-surface-2"
            icon={<PackageSearch size={26} />}
            title="Ничего не нашлось"
            text="Для такого возраста в этой категории пока пусто. Попробуйте выбрать другую категорию."
            action={<Button onClick={resetAll}>Показать все игрушки</Button>}
          />
        )}
      </div>
    </section>
  )
}
