import { useState } from 'react'
import { Heart, Menu as MenuIcon, Search, ShoppingCart, X } from 'lucide-react'
import { cn } from '../../lib/cn'
import { usePulse } from '../../lib/hooks'
import { useCart } from '../../store/cart'
import { useFavorites } from '../../store/favorites'
import { IconButton } from '../../ui/Bits'
import { CategoryIcon } from '../../ui/CategoryIcon'
import { SHOP_CATEGORIES } from './data'

type Props = {
  query: string
  onQuery: (value: string) => void
  onlyFavorites: boolean
  onToggleFavorites: () => void
  onPickCategory: (id: string) => void
}

export function ShopHeader({
  query,
  onQuery,
  onlyFavorites,
  onToggleFavorites,
  onPickCategory,
}: Props) {
  const { count, open } = useCart()
  const { count: favCount } = useFavorites()
  const pulsing = usePulse(count)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] w-full max-w-6xl items-center gap-3 px-4 sm:gap-5 sm:px-6">
        <a href="#top" className="flex shrink-0 items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-control bg-brand font-head text-lg font-extrabold text-on-brand">
            Т
          </span>
          <span className="hidden font-head text-[16px] font-extrabold tracking-tight text-ink sm:block">
            ТЕХНО<span className="text-brand">ПОРТ</span>
          </span>
        </a>

        <label className="relative min-w-0 flex-1">
          <Search
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft"
          />
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Поиск по каталогу"
            aria-label="Поиск по каталогу"
            className="w-full rounded-control border border-line bg-surface-2 py-2.5 pl-11 pr-10 text-[15px] text-ink outline-none transition placeholder:text-ink-soft focus:border-brand focus:bg-surface"
          />
          {query && (
            <button
              type="button"
              onClick={() => onQuery('')}
              aria-label="Очистить поиск"
              className="absolute right-2.5 top-1/2 grid h-7 w-7 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-ink-soft transition hover:bg-surface-3 hover:text-ink"
            >
              <X size={15} />
            </button>
          )}
        </label>

        <div className="flex shrink-0 items-center gap-2">
          <IconButton
            label={onlyFavorites ? 'Показать весь каталог' : 'Показать избранное'}
            badge={favCount}
            onClick={onToggleFavorites}
            className={cn(onlyFavorites && 'border-brand text-brand')}
          >
            <Heart size={19} fill={onlyFavorites ? 'currentColor' : 'none'} />
          </IconButton>
          <IconButton label="Корзина" badge={count} pulsing={pulsing} onClick={open}>
            <ShoppingCart size={19} />
          </IconButton>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Закрыть категории' : 'Открыть категории'}
            aria-expanded={menuOpen}
            className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-line text-ink transition hover:border-brand hover:text-brand lg:hidden"
          >
            {menuOpen ? <X size={19} /> : <MenuIcon size={19} />}
          </button>
        </div>
      </div>

      {/* Категории — строка под шапкой */}
      <nav className="hidden border-t border-line lg:block">
        <div className="mx-auto flex w-full max-w-6xl gap-1 px-6 py-1.5">
          {SHOP_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onPickCategory(cat.id)}
              className="flex cursor-pointer items-center gap-2 rounded-full px-3.5 py-2 text-[14px] font-medium text-ink-soft transition hover:bg-surface-2 hover:text-ink"
            >
              <CategoryIcon icon={cat.icon} size={17} />
              {cat.name}
            </button>
          ))}
        </div>
      </nav>

      {menuOpen && (
        <nav className="animate-fade-in grid grid-cols-2 gap-1 border-t border-line bg-surface p-3 lg:hidden">
          {SHOP_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                onPickCategory(cat.id)
                setMenuOpen(false)
              }}
              className="flex cursor-pointer items-center gap-2 rounded-control px-3 py-3 text-left text-[15px] font-medium text-ink-soft transition hover:bg-surface-2 hover:text-ink"
            >
              <CategoryIcon icon={cat.icon} size={17} />
              {cat.name}
            </button>
          ))}
        </nav>
      )}
    </header>
  )
}
