import { useState } from 'react'
import { Gift, Menu as MenuIcon, Phone, ShoppingBasket, Sparkles, Truck, X } from 'lucide-react'
import { usePulse } from '../../lib/hooks'
import { photoUrl } from '../../lib/photos'
import { useCart } from '../../store/cart'
import { buttonStyles } from '../../ui/Button'
import { IconButton } from '../../ui/Bits'

const NAV = [
  { href: '#finder', label: 'Подобрать подарок' },
  { href: '#catalog', label: 'Каталог' },
  { href: '#why', label: 'Почему мы' },
  { href: '#contacts', label: 'Контакты' },
]

export function ToysHeader() {
  const { count, open } = useCart()
  const pulsing = usePulse(count)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/92 backdrop-blur-xl">
      <div className="mx-auto flex h-[70px] w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <a href="#top" className="flex shrink-0 items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand font-head text-xl font-black text-on-brand">
            И
          </span>
          <span className="font-head text-[17px] font-extrabold tracking-tight text-ink">
            ИГРО<span className="text-brand">ГРАД</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-[15px] font-bold text-ink-soft transition hover:bg-brand-soft hover:text-brand"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="tel:+74951112233"
            className="hidden items-center gap-2 text-[15px] font-bold text-ink transition hover:text-brand md:flex"
          >
            <Phone size={15} />
            +7 (495) 111-22-33
          </a>
          <IconButton label="Корзина" badge={count} pulsing={pulsing} onClick={open}>
            <ShoppingBasket size={19} />
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
              className="block rounded-2xl px-4 py-3 text-[15px] font-bold text-ink-soft transition hover:bg-brand-soft hover:text-brand"
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}

export function ToysHero() {
  return (
    <section id="top" className="relative overflow-hidden px-4 pb-14 pt-10 sm:px-6 sm:pb-20 sm:pt-16">
      {/* Цветные пятна вместо фотографии */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full opacity-40 blur-[80px]"
        style={{ background: 'radial-gradient(circle, #c4b5fd 0%, transparent 70%)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-32 h-72 w-72 rounded-full opacity-45 blur-[80px]"
        style={{ background: 'radial-gradient(circle, #fcd34d 0%, transparent 70%)' }}
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-[13px] font-extrabold text-[#3d2a08]">
            <Sparkles size={15} />
            Бесплатная доставка от 3000 ₽
          </span>

          <h1 className="mt-6 font-head text-[2.4rem] font-black leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-[3.6rem]">
            Подарок, который
            <br />
            <span className="text-brand">не забросят через день</span>
          </h1>

          <p className="mt-5 max-w-lg text-[17px] font-medium leading-relaxed text-ink-soft">
            Восемнадцать игрушек, отобранных по возрасту и интересам. Не знаете, что выбрать —
            ответьте на три вопроса, и мы подберём сами.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#finder" className={buttonStyles('primary', 'lg', 'w-full sm:w-auto')}>
              <Gift size={19} />
              Подобрать подарок
            </a>
            <a href="#catalog" className={buttonStyles('outline', 'lg', 'w-full sm:w-auto')}>
              Весь каталог
            </a>
          </div>

          <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
            {[
              { icon: Truck, value: '1–2 дня', label: 'доставка по городу' },
              { icon: Gift, value: '250 ₽', label: 'подарочная упаковка' },
              { icon: Sparkles, value: '14 дней', label: 'на возврат' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-soft text-brand">
                  <Icon size={18} />
                </span>
                <span>
                  <dt className="font-head text-[17px] font-black text-ink">{value}</dt>
                  <dd className="text-[13px] font-semibold text-ink-soft">{label}</dd>
                </span>
              </div>
            ))}
          </dl>
        </div>

        {/* Весёлая композиция из игрушек: фото в цветных рамках, слегка вразброс */}
        <div className="relative mx-auto hidden aspect-square w-full max-w-sm lg:block">
          {[
            { id: 'cr-paint', pos: 'left-0 top-4 -rotate-6', size: 'h-32 w-32', hue: 30, delay: '0s' },
            { id: 'tr-railway', pos: 'right-2 top-0 rotate-3', size: 'h-28 w-28', hue: 10, delay: '.15s' },
            { id: 'ot-kite', pos: 'left-8 bottom-2 rotate-6', size: 'h-28 w-28', hue: 270, delay: '.3s' },
            { id: 'ct-blocks', pos: 'right-0 bottom-10 -rotate-3', size: 'h-32 w-32', hue: 320, delay: '.45s' },
            // В центре — самый узнаваемый и тёплый кадр
            { id: 'sf-bear', pos: 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2', size: 'h-36 w-36', hue: 190, delay: '.6s' },
          ].map(({ id, pos, size, hue, delay }) => (
            <span
              key={id}
              aria-hidden="true"
              className={`absolute rounded-[2rem] p-1.5 shadow-card ${pos} ${size}`}
              style={{
                background: `linear-gradient(140deg, hsl(${hue} 88% 82%), hsl(${(hue + 30) % 360} 80% 66%))`,
                animation: `pop-in 0.6s cubic-bezier(0.2,0.9,0.3,1) ${delay} both`,
              }}
            >
              <img
                src={photoUrl(id)}
                alt=""
                decoding="async"
                className="h-full w-full rounded-[1.6rem] object-cover"
              />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
