import { useState } from 'react'
import { Menu as MenuIcon, Phone, X } from 'lucide-react'
import { buttonStyles } from '../../ui/Button'

const NAV = [
  { href: '#menu', label: 'Меню' },
  { href: '#about', label: 'О нас' },
  { href: '#gallery', label: 'Интерьер' },
  { href: '#reviews', label: 'Отзывы' },
  { href: '#contacts', label: 'Контакты' },
]

const PHONE = '+7 (495) 987-65-43'

export function RestaurantHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/92 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" className="flex shrink-0 flex-col leading-none">
          <span className="font-head text-xl font-bold tracking-[0.18em] text-ink">ТЕРРАСА</span>
          <span className="mt-1 text-[10px] uppercase tracking-[0.3em] text-ink-soft">
            кухня и вино
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative text-[14px] font-medium tracking-wide text-ink-soft transition after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-brand after:transition-all after:duration-300 hover:text-ink hover:after:w-full"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="tel:+74959876543"
            className="hidden items-center gap-2 text-[14px] font-semibold text-ink transition hover:text-brand md:flex"
          >
            <Phone size={15} />
            {PHONE}
          </a>
          {/* Обёртка, а не класс на кнопке: inline-flex из базовых стилей перебивает hidden */}
          <span className="hidden sm:inline-flex">
            <a href="#booking" className={buttonStyles('primary', 'sm')}>
              Забронировать
            </a>
          </span>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={open}
            className="grid h-11 w-11 cursor-pointer place-items-center border border-line text-ink transition hover:border-brand hover:text-brand lg:hidden"
          >
            {open ? <X size={19} /> : <MenuIcon size={19} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="animate-fade-in border-t border-line bg-surface px-4 py-2 lg:hidden">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block px-2 py-3 text-[15px] font-medium text-ink-soft transition hover:text-ink"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#booking"
            onClick={() => setOpen(false)}
            className={buttonStyles('primary', 'md', 'my-2 w-full')}
          >
            Забронировать столик
          </a>
        </nav>
      )}
    </header>
  )
}

export function RestaurantHero() {
  return (
    <section id="top" className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-28">
      {/* Тёплая подложка вместо фотографии зала */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 0%, rgba(140,106,63,0.14) 0%, transparent 70%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent"
      />

      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-brand">
          Москва · Чистые пруды
        </span>

        <h1 className="mt-7 font-head text-[2.6rem] font-semibold leading-[1.08] text-ink sm:text-6xl">
          Европейская кухня
          <br />
          <span className="italic text-brand">на открытом огне</span>
        </h1>

        <div aria-hidden="true" className="my-8 flex items-center gap-4">
          <span className="h-px w-16 bg-line" />
          <span className="text-2xl">🍽️</span>
          <span className="h-px w-16 bg-line" />
        </div>

        <p className="max-w-xl text-[17px] leading-relaxed text-ink-soft">
          Открытая кухня, сорок посадочных мест и терраса на бульвар. Готовим на углях, работаем с
          локальными фермерами и не делаем заготовок дольше одного дня.
        </p>

        <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <a href="#booking" className={buttonStyles('primary', 'lg', 'w-full sm:w-auto')}>
            Забронировать столик
          </a>
          <a href="#menu" className={buttonStyles('outline', 'lg', 'w-full sm:w-auto')}>
            Посмотреть меню
          </a>
        </div>

        <dl className="mt-16 grid w-full grid-cols-3 gap-6 border-t border-line pt-8">
          {[
            { value: '2016', label: 'год открытия' },
            { value: '4.8', label: 'оценка гостей' },
            { value: '12:00', label: 'открываемся' },
          ].map(({ value, label }) => (
            <div key={label}>
              <dt className="font-head text-2xl font-semibold text-ink sm:text-3xl">{value}</dt>
              <dd className="mt-1 text-[12px] uppercase tracking-[0.15em] text-ink-soft">
                {label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

/* ---------- О ресторане ---------- */

export function RestaurantAbout() {
  return (
    <section id="about" className="border-t border-line px-4 py-16 sm:px-6 sm:py-24">
      <div className="reveal mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden bg-surface-3">
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, hsl(32 45% 72%) 0%, hsl(24 40% 52%) 55%, hsl(150 22% 32%) 100%)',
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
              backgroundSize: '18px 18px',
            }}
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 grid place-items-center text-[7rem] drop-shadow-2xl"
          >
            🔥
          </span>
          <span className="absolute bottom-5 left-5 bg-surface px-4 py-2 text-[12px] uppercase tracking-[0.2em] text-ink">
            открытая кухня
          </span>
        </div>

        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
            О нас
          </span>
          <h2 className="mt-5 font-head text-3xl font-semibold leading-tight text-ink sm:text-4xl">
            Восемь лет на одном месте — и ни одной заготовки на неделю
          </h2>
          <div className="mt-6 flex flex-col gap-4 text-[16px] leading-relaxed text-ink-soft">
            <p>
              «Терраса» открылась в 2016 году на первом этаже дома у Чистых прудов. С тех пор
              поменялись два шефа и три раза — меню, но принцип остался прежним: мы готовим ровно
              столько, сколько съедят сегодня.
            </p>
            <p>
              Мясо берём у фермы в Калужской области, рыбу привозят с Мурманска два раза в неделю,
              овощи — с рынка каждое утро. Если что-то закончилось, мы честно говорим об этом, а не
              подаём вчерашнее.
            </p>
          </div>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              { title: 'Своя пекарня', text: 'Хлеб печём с шести утра каждый день' },
              { title: 'Сомелье в зале', text: 'Подберёт вино под блюдо, а не по цене' },
              { title: 'Детское меню', text: 'Отдельная страница и стульчики' },
              { title: 'Можно с собакой', text: 'На террасе — с мая по сентябрь' },
            ].map(({ title, text }) => (
              <li key={title} className="border-l-2 border-brand pl-4">
                <h3 className="font-head text-[17px] font-semibold text-ink">{title}</h3>
                <p className="mt-1 text-[14px] leading-relaxed text-ink-soft">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
