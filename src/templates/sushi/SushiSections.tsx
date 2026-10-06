import { useState } from 'react'
import { Menu as MenuIcon, Phone, ShoppingBag, Truck, X } from 'lucide-react'
import { cn } from '../../lib/cn'
import { usePulse } from '../../lib/hooks'
import { photoUrl } from '../../lib/photos'
import { useCart } from '../../store/cart'
import { buttonStyles } from '../../ui/Button'
import { IconButton } from '../../ui/Bits'

const NAV = [
  { href: '#menu', label: 'Меню' },
  { href: '#promo', label: 'Акции' },
  { href: '#delivery', label: 'Доставка' },
  { href: '#contacts', label: 'Контакты' },
]

const PHONE = '+7 (495) 123-45-67'

/**
 * Лепесток сакуры с вырезом на конце; пять таких по кругу дают цветок.
 * Лепестки не касаются центра: без зазора на маленьком размере знак похож на шестерёнку.
 */
const PETAL = 'M0 -2.2C-4.2-4.5-6.6-9.5-4.2-13.6L0-11.2 4.2-13.6C6.6-9.5 4.2-4.5 0-2.2Z'

/** Знак «Сакуры» — красная печать с цветком, как японская именная печать. */
export function SakuraSeal({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cn('grid place-items-center rounded-[5px] bg-brand', className)}>
      <svg viewBox="-16 -16 32 32" className="h-[74%] w-[74%]">
        {[0, 72, 144, 216, 288].map((angle) => (
          <path key={angle} d={PETAL} transform={`rotate(${angle})`} fill="#fff" />
        ))}
        <circle r="1.6" fill="#fff" />
      </svg>
    </span>
  )
}

export function SushiHeader() {
  const { count, open } = useCart()
  const pulsing = usePulse(count)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/88 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <a href="#top" className="flex shrink-0 items-center gap-2.5">
          <SakuraSeal className="h-9 w-9" />
          <span className="font-head text-[17px] text-ink">САКУРА</span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-ink-soft transition hover:bg-surface-2 hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="tel:+74951234567"
            className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-ink transition hover:text-brand-text sm:flex"
          >
            <Phone size={15} />
            {PHONE}
          </a>
          <IconButton label="Корзина" badge={count} pulsing={pulsing} onClick={open}>
            <ShoppingBag size={19} />
          </IconButton>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={menuOpen}
            className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-line text-ink transition hover:border-brand hover:text-brand-text lg:hidden"
          >
            {menuOpen ? <X size={19} /> : <MenuIcon size={19} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="animate-fade-in border-t border-line bg-surface px-4 py-2 lg:hidden">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="block rounded-lg px-3 py-3 text-[15px] font-medium text-ink-soft transition hover:bg-surface-2 hover:text-ink"
            >
              {item.label}
            </a>
          ))}
          <a
            href="tel:+74951234567"
            className="block rounded-lg px-3 py-3 text-[15px] font-semibold text-brand-text"
          >
            {PHONE}
          </a>
        </nav>
      )}
    </header>
  )
}

/** Обещание доставки, поставленное как печать на чеке. */
function DeliveryStamp({ className }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label="Доставка по Москве за 60 минут"
      className={cn(
        'animate-stamp grid h-24 w-24 place-items-center rounded-[6px] bg-brand text-on-brand shadow-pop lg:h-32 lg:w-32',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="flex h-[calc(100%-12px)] w-[calc(100%-12px)] flex-col items-center justify-center rounded-[3px] border-2 border-white/85"
      >
        <span className="font-head text-[34px] leading-none lg:text-[46px]">60</span>
        <span className="mt-1 text-[12px] font-semibold lg:text-[14px]">минут</span>
      </span>
    </div>
  )
}

/*
  Первый экран — сам сет, вид сверху. На компьютере фото стоит справа во всю высоту,
  на телефоне — полосой под шапкой. Единственное движение на странице — печать.
*/
export function SushiHero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="relative aspect-[16/10] w-full sm:aspect-[2/1] lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-[44%]">
        <picture>
          <source media="(max-width: 1023.98px)" srcSet={photoUrl('sushi-hero-wide')} />
          <img
            src={photoUrl('sushi-hero')}
            alt="Большой сет роллов и суши на тёмной доске"
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </picture>
        {/* Фото растворяется в фоне страницы, а не обрывается краем */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-surface to-transparent to-40% lg:bg-linear-to-r lg:to-30%"
        />
        <DeliveryStamp className="absolute bottom-0 left-4 translate-y-1/2 sm:left-6 lg:bottom-24 lg:left-0 lg:-translate-x-1/2 lg:translate-y-0" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-[4.5rem] sm:px-6 lg:flex lg:min-h-[min(calc(100svh_-_64px),780px)] lg:items-center lg:py-20">
        <div className="lg:max-w-[52%] lg:pr-10">
          <h1 className="font-head text-[2.15rem] leading-[1.1] text-ink sm:text-5xl lg:text-[3.5rem]">
            Роллы, которые крутят после вашего заказа
          </h1>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-ink-soft">
            Никаких заготовок с утра. Рыбу привозят каждый день, рис варят порциями, а сет
            собирают только когда вы нажали кнопку. Поэтому час, а не двадцать минут.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#menu" className={buttonStyles('primary', 'lg', 'w-full sm:w-auto')}>
              Смотреть меню
            </a>
            <a href="#promo" className={buttonStyles('outline', 'lg', 'w-full sm:w-auto')}>
              Акции недели
            </a>
          </div>

          <p className="mt-8 flex items-center gap-2 text-[14px] text-ink-soft">
            <Truck size={16} aria-hidden="true" className="shrink-0 text-accent" />
            Бесплатная доставка от 1500&nbsp;₽ в пределах МКАД
          </p>
        </div>
      </div>
    </section>
  )
}
