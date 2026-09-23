import { ArrowRight, BadgeCheck, CreditCard, RotateCcw, Truck } from 'lucide-react'
import { formatPrice } from '../../lib/format'
import { photoUrl } from '../../lib/photos'
import { buttonStyles } from '../../ui/Button'
import { CategoryIcon } from '../../ui/CategoryIcon'
import { SHOP_CATALOG, SHOP_CATEGORIES } from './data'

const FEATURED = SHOP_CATALOG.find((p) => p.id === 'lp-nord-14') ?? SHOP_CATALOG[0]

export function ShopHero({ onOpenFeatured }: { onOpenFeatured: () => void }) {
  const discount = FEATURED.oldPrice
    ? Math.round((1 - FEATURED.price / FEATURED.oldPrice) * 100)
    : 0

  return (
    <section id="top" className="px-4 pt-6 sm:px-6 sm:pt-8">
      <div className="mx-auto w-full max-w-6xl">
        <div
          className="relative overflow-hidden rounded-card px-6 py-10 sm:px-12 sm:py-14"
          style={{
            background: 'linear-gradient(120deg, #1e3a8a 0%, #2563eb 55%, #38bdf8 100%)',
          }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.13]"
            style={{
              backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
              backgroundSize: '18px 18px',
            }}
          />
          <div
            aria-hidden="true"
            className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/15 blur-2xl"
          />

          <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div className="text-white">
              {discount > 0 && (
                <span className="inline-flex items-center rounded-full bg-white/20 px-4 py-1.5 text-[13px] font-extrabold uppercase tracking-wider backdrop-blur">
                  скидка {discount} %
                </span>
              )}
              <h1 className="mt-5 font-head text-[2.1rem] font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
                {FEATURED.name}
              </h1>
              <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-white/85">
                {FEATURED.description}
              </p>
              <div className="mt-6 flex items-baseline gap-3">
                <span className="font-head text-3xl font-extrabold">
                  {formatPrice(FEATURED.price)}
                </span>
                {FEATURED.oldPrice && (
                  <span className="text-lg text-white/60 line-through">
                    {formatPrice(FEATURED.oldPrice)}
                  </span>
                )}
              </div>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={onOpenFeatured}
                  className={buttonStyles(
                    'secondary',
                    'lg',
                    'w-full bg-white text-[#1e3a8a] hover:bg-white/90 sm:w-auto',
                  )}
                >
                  Смотреть товар
                  <ArrowRight size={18} />
                </button>
                <a
                  href="#catalog"
                  className={buttonStyles(
                    'outline',
                    'lg',
                    'w-full border-white/50 text-white hover:bg-white/15 sm:w-auto',
                  )}
                >
                  Весь каталог
                </a>
              </div>
            </div>

            <div className="hidden justify-self-center lg:block">
              <img
                src={photoUrl(FEATURED.id)}
                alt={FEATURED.name}
                width={352}
                height={262}
                decoding="async"
                className="h-[262px] w-[352px] rounded-3xl object-cover shadow-pop ring-4 ring-white/25"
              />
            </div>
          </div>
        </div>

        {/* Категории плитками */}
        <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {SHOP_CATEGORIES.map((cat) => (
            <a
              key={cat.id}
              href="#catalog"
              className="flex flex-col items-center gap-2 rounded-card border border-line bg-surface p-4 text-center transition hover:-translate-y-0.5 hover:border-brand hover:shadow-card"
            >
              <CategoryIcon icon={cat.icon} size={26} className="text-brand" />
              <span className="text-[13px] font-semibold leading-tight text-ink">{cat.name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================ ПРЕИМУЩЕСТВА ============================ */

const BENEFITS = [
  { icon: Truck, title: 'Доставка завтра', text: 'При заказе до 18:00 по Москве и области' },
  { icon: BadgeCheck, title: 'Гарантия 2 года', text: 'Официальная, с сервисными центрами в городе' },
  { icon: RotateCcw, title: 'Возврат 14 дней', text: 'Без объяснения причин, деньги за 3 дня' },
  { icon: CreditCard, title: 'Рассрочка 0 %', text: 'Шесть платежей без переплаты и справок' },
]

export function ShopBenefits() {
  return (
    <section className="border-y border-line bg-surface-2 px-4 py-10 sm:px-6">
      <div className="mx-auto grid w-full max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {BENEFITS.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex gap-3.5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-control bg-brand-soft text-brand">
              <Icon size={20} />
            </span>
            <span>
              <span className="block font-head text-[15px] font-bold text-ink">{title}</span>
              <span className="mt-1 block text-[13px] leading-relaxed text-ink-soft">{text}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ============================ ПОДВАЛ ============================ */

const FOOTER_COLUMNS = [
  {
    title: 'Покупателям',
    links: ['Доставка и оплата', 'Гарантия и возврат', 'Рассрочка', 'Часто задаваемые вопросы'],
  },
  {
    title: 'Компания',
    links: ['О магазине', 'Пункты выдачи', 'Вакансии', 'Контакты'],
  },
  {
    title: 'Каталог',
    links: SHOP_CATEGORIES.slice(0, 4).map((c) => c.name),
  },
]

export function ShopFooter() {
  return (
    <footer className="border-t border-line bg-surface-2 px-4 py-12 sm:px-6">
      <div className="mx-auto grid w-full max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-control bg-brand font-head text-lg font-extrabold text-on-brand">
              Т
            </span>
            <span className="font-head text-[16px] font-extrabold tracking-tight text-ink">
              ТЕХНО<span className="text-brand">ПОРТ</span>
            </span>
          </span>
          <p className="mt-4 text-[14px] leading-relaxed text-ink-soft">
            Интернет-магазин техники. Работаем с 2018 года, три пункта выдачи в Москве.
          </p>
          <a
            href="tel:+78001234567"
            className="mt-4 block font-head text-lg font-extrabold text-ink transition hover:text-brand"
          >
            8 (800) 123-45-67
          </a>
          <p className="mt-1 text-[13px] text-ink-soft">Ежедневно с 9:00 до 21:00</p>
        </div>

        {FOOTER_COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="font-head text-[15px] font-bold text-ink">{col.title}</h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {col.links.map((link) => (
                <li key={link}>
                  <a
                    href="#catalog"
                    className="text-[14px] text-ink-soft transition hover:text-brand"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-10 w-full max-w-6xl border-t border-line pt-6">
        <p className="text-[13px] leading-relaxed text-ink-soft">
          Демонстрационный шаблон. Магазин «Технопорт», бренды, цены и характеристики вымышлены,
          заказы не обрабатываются.
        </p>
      </div>
    </footer>
  )
}
