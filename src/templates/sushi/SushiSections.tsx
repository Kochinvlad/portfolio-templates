import { useState } from 'react'
import { Menu as MenuIcon, Phone, ShoppingBag, Star, Timer, Truck, Wallet, X } from 'lucide-react'
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

export function SushiHeader() {
  const { count, open } = useCart()
  const pulsing = usePulse(count)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/88 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <a href="#top" className="flex shrink-0 items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand font-head text-lg font-extrabold text-on-brand">
            С
          </span>
          <span className="font-head text-[15px] font-extrabold tracking-tight text-ink">
            САКУРА
          </span>
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
            className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-ink transition hover:text-brand sm:flex"
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
            className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-line text-ink transition hover:border-brand hover:text-brand lg:hidden"
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
            className="block rounded-lg px-3 py-3 text-[15px] font-semibold text-brand"
          >
            {PHONE}
          </a>
        </nav>
      )}
    </header>
  )
}

export function SushiHero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-[-14rem] h-[34rem] w-[34rem] rounded-full opacity-30 blur-[100px]"
        style={{ background: 'radial-gradient(circle, #e02b3c 0%, transparent 70%)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-[-12rem] h-[28rem] w-[28rem] rounded-full opacity-25 blur-[100px]"
        style={{ background: 'radial-gradient(circle, #f5c542 0%, transparent 70%)' }}
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-2 px-4 py-1.5 text-[13px] font-semibold text-ink-soft">
            <Timer size={14} className="text-brand" />
            Доставка по Москве за 60 минут
          </span>

          <h1 className="mt-6 font-head text-[2.3rem] font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Роллы, которые крутят
            <span className="text-brand"> после вашего заказа</span>
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

          <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
            {[
              { icon: Star, value: '4.9', label: 'средняя оценка' },
              { icon: Truck, value: '60 мин', label: 'среднее время' },
              { icon: Wallet, value: 'от 1500 ₽', label: 'бесплатная доставка' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-3">
                <Icon size={18} className="text-brand" />
                <span>
                  <dt className="font-head text-lg font-extrabold text-ink">{value}</dt>
                  <dd className="text-[13px] text-ink-soft">{label}</dd>
                </span>
              </div>
            ))}
          </dl>
        </div>

        {/* Композиция из фото блюд вокруг счётчика позиций */}
        <div className="relative mx-auto hidden aspect-square w-full max-w-md lg:block">
          <div className="absolute inset-0 rounded-full border border-line" />
          <div className="absolute inset-[12%] rounded-full border border-line" />
          {[
            { id: 'roll-dragon', pos: 'left-1/2 top-0 -translate-x-1/2', size: 'h-28 w-28', delay: '0s' },
            { id: 'set-tokyo', pos: 'right-0 top-1/2 -translate-y-1/2', size: 'h-24 w-24', delay: '.4s' },
            { id: 'hot-ramen', pos: 'bottom-0 left-1/2 -translate-x-1/2', size: 'h-24 w-24', delay: '.8s' },
            { id: 'nigiri-salmon', pos: 'left-0 top-1/2 -translate-y-1/2', size: 'h-20 w-20', delay: '1.2s' },
          ].map(({ id, pos, size, delay }) => (
            <img
              key={id}
              src={photoUrl(id)}
              alt=""
              aria-hidden="true"
              decoding="async"
              className={cn(
                'absolute rounded-full object-cover shadow-pop ring-4 ring-surface-2',
                pos,
                size,
              )}
              style={{ animation: `pop-in 0.6s cubic-bezier(0.2,0.9,0.3,1) ${delay} both` }}
            />
          ))}
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 grid h-40 w-40 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-brand text-center font-head text-lg font-extrabold leading-tight text-on-brand"
          >
            22
            <br />
            позиции
          </span>
        </div>
      </div>
    </section>
  )
}
