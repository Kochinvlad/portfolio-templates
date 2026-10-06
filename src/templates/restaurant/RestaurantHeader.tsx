import { useState } from 'react'
import { Clock, MapPin, Menu as MenuIcon, Phone, X } from 'lucide-react'
import { photoUrl } from '../../lib/photos'
import { buttonStyles } from '../../ui/Button'
import { restHoursToday } from './data'

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
        {/* Вывеска: прописные с разрядкой здесь — часть знака, а не подпись */}
        <a href="#top" className="flex shrink-0 flex-col leading-none">
          <span className="font-head text-xl font-bold tracking-[0.18em] text-ink">ТЕРРАСА</span>
          <span className="mt-1 font-head text-[13px] italic text-ink-soft">кухня и вино</span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative text-[14px] font-medium text-ink-soft transition after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-brand after:transition-all after:duration-300 hover:text-ink hover:after:w-full"
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

/*
  Первый экран — огонь, ради которого сюда идут. Единственное движение на странице:
  фото медленно оседает, текст появляется следом. Остальные блоки стоят на месте.
*/
export function RestaurantHero() {
  const today = restHoursToday()

  return (
    <section id="top" className="relative isolate overflow-hidden bg-[#15110e] text-white">
      <picture>
        {/* На телефоне — вертикальный кадр того же снимка, иначе мясо уходит за край */}
        {/* Граница совпадает с sm: в Tailwind — с 640px уже раскладка для компьютера */}
        <source media="(max-width: 639.98px)" srcSet={photoUrl('rest-hero-tall')} />
        <img
          src={photoUrl('rest-hero')}
          alt="Стейк на кости над открытым огнём гриля"
          fetchPriority="high"
          decoding="async"
          className="animate-hero-settle absolute inset-0 -z-10 h-full w-full object-cover"
        />
      </picture>
      {/*
        Затемнение там, где лежит текст. На компьютере текст слева внизу, на телефоне
        заголовок вверху на тёмной стене, кнопки внизу — мясо и пламя видны между ними.
      */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 sm:hidden"
        style={{
          background:
            'linear-gradient(to bottom, rgb(21 17 14 / 0.8), rgb(21 17 14 / 0) 35%),' +
            'linear-gradient(to top, rgb(21 17 14 / 0.92), rgb(21 17 14 / 0) 45%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 hidden sm:block"
        style={{
          background:
            'linear-gradient(to top, rgb(21 17 14 / 0.9), rgb(21 17 14 / 0) 55%),' +
            'linear-gradient(to right, rgb(21 17 14 / 0.85), rgb(21 17 14 / 0.35) 45%, rgb(21 17 14 / 0) 70%)',
        }}
      />

      <div className="mx-auto flex min-h-[min(calc(100svh_-_72px),800px)] w-full max-w-6xl flex-col justify-between px-4 pb-10 pt-10 sm:justify-end sm:px-6 sm:pb-16 sm:pt-48 lg:pb-20">
        <div>
          <h1 className="animate-slide-up max-w-[12ch] font-head text-[2.6rem] font-normal leading-[1.04] sm:text-6xl lg:text-7xl">
            Европейская кухня на открытом огне
          </h1>
          {/* На телефоне абзац закрыл бы мясо, а то же самое рассказано в блоке «О нас» */}
          <p
            className="animate-slide-up mt-6 hidden max-w-md text-[17px] leading-relaxed text-white/80 sm:block"
            style={{ animationDelay: '120ms' }}
          >
            Открытая кухня, сорок мест и терраса на бульвар. Готовим на углях и не делаем
            заготовок дольше одного дня.
          </p>
        </div>

        <div>
          <div
            className="animate-slide-up flex flex-col gap-3 sm:mt-9 sm:flex-row"
            style={{ animationDelay: '240ms' }}
          >
            {/* Винная рамка фокуса на тёмном фото не видна — делаем белую */}
            <a href="#booking" className={buttonStyles('primary', 'lg', 'focus-visible:outline-white')}>
              Забронировать столик
            </a>
            <a href="#menu" className={buttonStyles('inverse', 'lg')}>
              Посмотреть меню
            </a>
          </div>
          <ul
            className="animate-slide-up mt-6 flex flex-col gap-2 text-[15px] text-white/75 sm:mt-10 sm:flex-row sm:gap-8"
            style={{ animationDelay: '360ms' }}
          >
            <li className="flex items-center gap-2">
              <MapPin size={16} aria-hidden="true" />
              Чистопрудный бульвар, 14с3
            </li>
            <li className="flex items-center gap-2">
              <Clock size={16} aria-hidden="true" />
              Сегодня с {today.open} до {today.close}
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}

/* ---------- О ресторане ---------- */

export function RestaurantAbout() {
  return (
    <section id="about" className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden bg-surface-3">
          <img
            src={photoUrl('about-open-kitchen')}
            alt="Повар готовит на открытом огне у стойки открытой кухни"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        <div>
          <h2 className="font-head text-4xl font-normal leading-[1.1] text-ink sm:text-5xl">
            Восемь лет на одном месте и ни одной заготовки на неделю
          </h2>
          <div className="mt-6 flex flex-col gap-4 text-[16px] leading-relaxed text-ink-soft">
            <p>
              «Терраса» открылась в 2016 году на первом этаже дома у Чистых прудов. С тех пор
              поменялись два шефа и три раза&nbsp;— меню, но принцип остался прежним: мы готовим ровно
              столько, сколько съедят сегодня.
            </p>
            <p>
              Мясо берём у фермы в Калужской области, рыбу привозят с Мурманска два раза в неделю,
              овощи&nbsp;— с рынка каждое утро. Если что-то закончилось, мы честно говорим об этом, а не
              подаём вчерашнее.
            </p>
          </div>

          <ul className="mt-8 grid gap-5 sm:grid-cols-2">
            {[
              { title: 'Своя пекарня', text: 'Хлеб печём с шести утра каждый день' },
              { title: 'Сомелье в зале', text: 'Подберёт вино под блюдо, а не по цене' },
              { title: 'Детское меню', text: 'Отдельная страница и стульчики' },
              { title: 'Можно с собакой', text: 'На террасе\u00a0— с мая по сентябрь' },
            ].map(({ title, text }) => (
              <li key={title} className="border-l-2 border-brand pl-4">
                <h3 className="font-head text-[21px] font-normal leading-tight text-ink">{title}</h3>
                <p className="mt-1 text-[14px] leading-relaxed text-ink-soft">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
