import { useEffect, useMemo, useState } from 'react'
import { PackageSearch, SlidersHorizontal, X } from 'lucide-react'
import type { Product } from '../../lib/types'
import { cn } from '../../lib/cn'
import { formatNumber, formatPrice, pluralWithCount } from '../../lib/format'
import { useDebounced } from '../../lib/hooks'
import { useFavorites } from '../../store/favorites'
import { Button } from '../../ui/Button'
import { EmptyState } from '../../ui/Bits'
import { SHOP_BRANDS, SHOP_CATALOG, SHOP_CATEGORIES, SHOP_PRICE_MAX } from './data'
import { ShopCard } from './ShopProduct'

export type SortKey = 'popular' | 'price-asc' | 'price-desc' | 'rating' | 'discount'

const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: 'popular', label: 'Сначала популярные' },
  { value: 'price-asc', label: 'Сначала дешёвые' },
  { value: 'price-desc', label: 'Сначала дорогие' },
  { value: 'rating', label: 'По оценке' },
  { value: 'discount', label: 'По размеру скидки' },
]

function Checkbox({
  checked,
  onChange,
  children,
}: {
  checked: boolean
  onChange: () => void
  children: React.ReactNode
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 py-1.5 text-[15px] text-ink">
      <span
        className={cn(
          'grid h-5 w-5 shrink-0 place-items-center rounded border transition',
          checked ? 'border-brand bg-brand text-on-brand' : 'border-line bg-surface',
        )}
      >
        {checked && (
          <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
            <path
              d="M1.5 6.5 4.5 9.5 10.5 2.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      {children}
    </label>
  )
}

type Filters = {
  categories: string[]
  brands: string[]
  maxPrice: number
  onlyDiscount: boolean
  onlyInStock: boolean
  minRating: number
}

const EMPTY_FILTERS: Filters = {
  categories: [],
  brands: [],
  maxPrice: SHOP_PRICE_MAX,
  onlyDiscount: false,
  onlyInStock: false,
  minRating: 0,
}

function FilterPanel({
  filters,
  setFilters,
  onReset,
}: {
  filters: Filters
  setFilters: React.Dispatch<React.SetStateAction<Filters>>
  onReset: () => void
}) {
  function toggleIn(key: 'categories' | 'brands', value: string) {
    setFilters((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value],
    }))
  }

  return (
    <div className="flex flex-col gap-7">
      <section>
        <h3 className="font-head text-[15px] font-bold text-ink">Категория</h3>
        <div className="mt-2.5">
          {SHOP_CATEGORIES.map((cat) => (
            <Checkbox
              key={cat.id}
              checked={filters.categories.includes(cat.id)}
              onChange={() => toggleIn('categories', cat.id)}
            >
              <span aria-hidden="true" className="mr-1">
                {cat.glyph}
              </span>
              {cat.name}
            </Checkbox>
          ))}
        </div>
      </section>

      <section>
        <h3 className="font-head text-[15px] font-bold text-ink">Бренд</h3>
        <div className="mt-2.5">
          {SHOP_BRANDS.map((brand) => (
            <Checkbox
              key={brand}
              checked={filters.brands.includes(brand)}
              onChange={() => toggleIn('brands', brand)}
            >
              {brand}
            </Checkbox>
          ))}
        </div>
      </section>

      <section>
        <h3 className="font-head text-[15px] font-bold text-ink">Цена до</h3>
        <p className="mt-2 font-head text-lg font-extrabold text-brand">
          {formatPrice(filters.maxPrice)}
        </p>
        <input
          type="range"
          min={3000}
          max={SHOP_PRICE_MAX}
          step={1000}
          value={filters.maxPrice}
          onChange={(e) => setFilters((f) => ({ ...f, maxPrice: Number(e.target.value) }))}
          aria-label="Максимальная цена"
          className="mt-3 w-full cursor-pointer accent-[var(--brand)]"
        />
        <div className="mt-1 flex justify-between text-[12px] text-ink-soft">
          <span>{formatNumber(3000)} ₽</span>
          <span>{formatNumber(SHOP_PRICE_MAX)} ₽</span>
        </div>
      </section>

      <section>
        <h3 className="font-head text-[15px] font-bold text-ink">Дополнительно</h3>
        <div className="mt-2.5">
          <Checkbox
            checked={filters.onlyDiscount}
            onChange={() => setFilters((f) => ({ ...f, onlyDiscount: !f.onlyDiscount }))}
          >
            Только со скидкой
          </Checkbox>
          <Checkbox
            checked={filters.onlyInStock}
            onChange={() => setFilters((f) => ({ ...f, onlyInStock: !f.onlyInStock }))}
          >
            Только в наличии
          </Checkbox>
          <Checkbox
            checked={filters.minRating >= 4.5}
            onChange={() => setFilters((f) => ({ ...f, minRating: f.minRating >= 4.5 ? 0 : 4.5 }))}
          >
            Оценка от 4,5
          </Checkbox>
        </div>
      </section>

      <Button variant="outline" onClick={onReset} full>
        Сбросить фильтры
      </Button>
    </div>
  )
}

type CatalogProps = {
  query: string
  onQuery: (value: string) => void
  onlyFavorites: boolean
  onClearFavoritesFilter: () => void
  onOpenProduct: (product: Product) => void
  /** Категория, выбранная в шапке — подставляется в фильтры. */
  pickedCategory: string | null
  onCategoryConsumed: () => void
}

export function ShopCatalog({
  query,
  onQuery,
  onlyFavorites,
  onClearFavoritesFilter,
  onOpenProduct,
  pickedCategory,
  onCategoryConsumed,
}: CatalogProps) {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const [sort, setSort] = useState<SortKey>('popular')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const { ids: favoriteIds } = useFavorites()
  const debouncedQuery = useDebounced(query, 200).trim().toLowerCase()

  // Клик по категории в шапке подставляет её в фильтры.
  // Только в эффекте: вызывать setState родителя во время рендера нельзя.
  useEffect(() => {
    if (!pickedCategory) return
    setFilters((f) => ({ ...f, categories: [pickedCategory] }))
    onCategoryConsumed()
  }, [pickedCategory, onCategoryConsumed])

  const visible = useMemo(() => {
    const filtered = SHOP_CATALOG.filter((p) => {
      if (onlyFavorites && !favoriteIds.includes(p.id)) return false
      if (filters.categories.length > 0 && !filters.categories.includes(p.category)) return false
      if (filters.brands.length > 0 && (!p.brand || !filters.brands.includes(p.brand))) return false
      if (p.price > filters.maxPrice) return false
      if (filters.onlyDiscount && !p.oldPrice) return false
      if (filters.onlyInStock && p.outOfStock) return false
      if (filters.minRating > 0 && (p.rating ?? 0) < filters.minRating) return false
      if (debouncedQuery) {
        const haystack = `${p.name} ${p.description} ${p.brand ?? ''}`.toLowerCase()
        if (!haystack.includes(debouncedQuery)) return false
      }
      return true
    })

    const sorted = [...filtered]
    switch (sort) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
        break
      case 'discount':
        sorted.sort(
          (a, b) =>
            (b.oldPrice ? 1 - b.price / b.oldPrice : 0) - (a.oldPrice ? 1 - a.price / a.oldPrice : 0),
        )
        break
      default:
        sorted.sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0))
    }
    return sorted
  }, [filters, sort, debouncedQuery, onlyFavorites, favoriteIds])

  function resetAll() {
    setFilters(EMPTY_FILTERS)
    onQuery('')
    if (onlyFavorites) onClearFavoritesFilter()
  }

  const activeCount =
    filters.categories.length +
    filters.brands.length +
    (filters.onlyDiscount ? 1 : 0) +
    (filters.onlyInStock ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.maxPrice < SHOP_PRICE_MAX ? 1 : 0)

  return (
    <section id="catalog" className="px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-head text-2xl font-extrabold text-ink sm:text-3xl">
              {onlyFavorites ? 'Избранное' : 'Каталог'}
            </h2>
            <p className="mt-1.5 text-[15px] text-ink-soft">
              {pluralWithCount(visible.length, ['товар', 'товара', 'товаров'])}
              {debouncedQuery && ` по запросу «${query}»`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="flex cursor-pointer items-center gap-2 rounded-control border border-line bg-surface px-4 py-2.5 text-[15px] font-semibold text-ink transition hover:border-brand lg:hidden"
            >
              <SlidersHorizontal size={16} />
              Фильтры
              {activeCount > 0 && (
                <span className="grid h-5 w-5 place-items-center rounded-full bg-brand text-[11px] font-extrabold text-on-brand">
                  {activeCount}
                </span>
              )}
            </button>
            <label className="flex items-center gap-2">
              <span className="sr-only">Сортировка</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="cursor-pointer rounded-control border border-line bg-surface px-4 py-2.5 text-[15px] font-medium text-ink outline-none transition focus:border-brand"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {onlyFavorites && (
          <button
            type="button"
            onClick={onClearFavoritesFilter}
            className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full bg-brand-soft px-4 py-2 text-[14px] font-semibold text-brand transition hover:opacity-80"
          >
            Показаны только избранные
            <X size={15} />
          </button>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[250px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-[140px]">
              <FilterPanel filters={filters} setFilters={setFilters} onReset={resetAll} />
            </div>
          </aside>

          <div>
            {visible.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {visible.map((product) => (
                  <ShopCard
                    key={product.id}
                    product={product}
                    onOpen={() => onOpenProduct(product)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                className="rounded-card border border-line bg-surface-2"
                icon={<PackageSearch size={26} />}
                title={onlyFavorites ? 'В избранном пусто' : 'Ничего не нашлось'}
                text={
                  onlyFavorites
                    ? 'Нажмите на сердечко у товара, чтобы сохранить его и вернуться позже.'
                    : 'Попробуйте смягчить фильтры или изменить поисковый запрос.'
                }
                action={<Button onClick={resetAll}>Сбросить всё</Button>}
              />
            )}
          </div>
        </div>
      </div>

      {/* Фильтры на телефоне */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <button
            type="button"
            aria-label="Закрыть фильтры"
            onClick={() => setMobileFiltersOpen(false)}
            className="absolute inset-0 cursor-default bg-black/55 backdrop-blur-sm animate-fade-in"
          />
          <div className="animate-slide-in-right absolute right-0 top-0 flex h-full w-full max-w-[340px] flex-col bg-surface shadow-pop">
            <header className="flex items-center justify-between border-b border-line px-5 py-4">
              <h3 className="font-head text-lg font-bold text-ink">Фильтры</h3>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Закрыть фильтры"
                className="grid h-10 w-10 cursor-pointer place-items-center rounded-full text-ink-soft transition hover:bg-surface-3 hover:text-ink"
              >
                <X size={20} />
              </button>
            </header>
            <div className="thin-scroll flex-1 overflow-y-auto px-5 py-5">
              <FilterPanel filters={filters} setFilters={setFilters} onReset={resetAll} />
            </div>
            <div className="border-t border-line p-5">
              <Button full size="lg" onClick={() => setMobileFiltersOpen(false)}>
                Показать {pluralWithCount(visible.length, ['товар', 'товара', 'товаров'])}
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
