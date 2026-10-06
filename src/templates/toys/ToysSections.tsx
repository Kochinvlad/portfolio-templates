import { Gift, HeartHandshake, PackageCheck, ShieldCheck, Truck } from 'lucide-react'
import { TOYS_CATEGORIES } from './data'
import { LetterBlock } from './ToysHeader'

/** Цвет полосы над пунктом — краски кубиков по очереди. */
const WHY = [
  {
    icon: ShieldCheck,
    color: 'var(--block-red)',
    title: 'Сертификаты на всё',
    text: 'У каждой игрушки есть документы. Материалы безопасные, краски нетоксичные\u00a0— это можно проверить.',
  },
  {
    icon: PackageCheck,
    color: 'var(--brand)',
    title: 'Проверяем перед отправкой',
    text: 'Вскрываем коробку, смотрим комплектность и работу электроники. Битое до вас не доедет.',
  },
  {
    icon: Truck,
    color: 'var(--accent)',
    title: 'Доставка за 1–2 дня',
    text: 'По городу\u00a0— на следующий день. Курьер подождёт, пока ребёнок распакует и проверит.',
  },
  {
    icon: HeartHandshake,
    color: 'var(--block-red)',
    title: 'Возврат без вопросов',
    text: 'Четырнадцать дней на возврат, даже если просто не подошло по возрасту. Деньги за три дня.',
  },
]

export function ToysWhy() {
  return (
    <section id="why" className="px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto w-full max-w-6xl">
        <h2 className="font-head text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
          Почему у нас спокойно покупать
        </h2>
        <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map(({ icon: Icon, color, title, text }) => (
            <div key={title}>
              <span aria-hidden="true" className="block h-2 w-16 rounded-full" style={{ backgroundColor: color }} />
              <h3 className="mt-5 flex items-start gap-2.5 font-head text-[18px] font-bold leading-snug text-ink">
                <Icon size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-ink-soft" />
                {title}
              </h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-ink-soft">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================ БАННЕР УПАКОВКИ ============================ */

/** Баннер выглядит как сам подарок: крафтовая бумага, красная лента, бант — значок. */
export function ToysGiftBanner() {
  return (
    <section className="px-4 py-6 sm:px-6">
      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-6 overflow-hidden rounded-card bg-[var(--kraft)] px-6 py-10 text-center sm:px-12 lg:flex-row lg:text-left">
        {/* Лента по оси значка: отступ 48 + полкруга 40 = 88, минус полширины ленты. На телефоне закрыла бы текст */}
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-20 hidden w-4 bg-[var(--block-red)] lg:block"
        />
        <span
          aria-hidden="true"
          className="relative grid h-20 w-20 shrink-0 place-items-center rounded-full bg-[var(--block-red)] text-white ring-8 ring-[var(--kraft)]"
        >
          <Gift size={38} strokeWidth={1.8} />
        </span>
        <div className="relative flex-1">
          <h2 className="font-head text-2xl font-extrabold leading-tight text-ink sm:text-3xl">
            Упакуем как подарок за 250&nbsp;₽
          </h2>
          <p className="mt-2 max-w-xl text-[16px] leading-relaxed text-ink">
            Крафтовая бумага, атласная лента и открытка, подписанная от руки. Отметьте упаковку в
            карточке игрушки&nbsp;— текст открытки спросим при оформлении.
          </p>
        </div>
        <span className="relative flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-3 font-head text-[15px] font-bold text-ink">
          <Gift size={18} aria-hidden="true" className="text-[var(--block-red)]" />
          Есть у каждой игрушки
        </span>
      </div>
    </section>
  )
}

/* ============================ ПОДВАЛ ============================ */

export function ToysFooter() {
  return (
    <footer id="contacts" className="border-t border-line bg-surface-3 px-4 py-12 sm:px-6">
      <div className="mx-auto grid w-full max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="flex items-center gap-2.5">
            <span className="w-10 shrink-0">
              <LetterBlock letter="И" color="var(--block-red)" />
            </span>
            <span className="font-head text-[18px] font-extrabold text-ink">ИГРОГРАД</span>
          </span>
          <p className="mt-4 text-[14px] leading-relaxed text-ink-soft">
            Магазин игрушек для детей от нуля до подростков. Работаем с 2020 года.
          </p>
        </div>

        <div>
          <h3 className="font-head text-[16px] font-bold text-ink">Категории</h3>
          <ul className="mt-4 flex flex-col gap-2.5">
            {TOYS_CATEGORIES.map((cat) => (
              <li key={cat.id}>
                <a href="#catalog" className="text-[14px] text-ink-soft transition hover:text-brand-hover">
                  {cat.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-head text-[16px] font-bold text-ink">Покупателям</h3>
          <ul className="mt-4 flex flex-col gap-2.5">
            {['Доставка и оплата', 'Возврат товара', 'Подарочная упаковка', 'Сертификаты'].map(
              (link) => (
                <li key={link}>
                  <a href="#why" className="text-[14px] text-ink-soft transition hover:text-brand-hover">
                    {link}
                  </a>
                </li>
              ),
            )}
          </ul>
        </div>

        <div>
          <h3 className="font-head text-[16px] font-bold text-ink">Контакты</h3>
          <a
            href="tel:+74951112233"
            className="mt-4 block font-head text-lg font-bold text-ink transition hover:text-brand-hover"
          >
            +7 (495) 111-22-33
          </a>
          <p className="mt-1 text-[13px] text-ink-soft">Ежедневно с 9:00 до 21:00</p>
          <p className="mt-4 text-[14px] leading-relaxed text-ink-soft">
            Москва, ул. Садовая, 5
            <br />
            Пункт выдачи и шоурум
          </p>
        </div>
      </div>

      <div className="mx-auto mt-10 w-full max-w-6xl border-t border-line pt-6">
        <p className="text-[13px] leading-relaxed text-ink-soft">
          Демонстрационный шаблон. Магазин «Игроград», товары, цены и контакты вымышлены, заказы не
          обрабатываются.
        </p>
      </div>
    </footer>
  )
}
