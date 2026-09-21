import { Gift, HeartHandshake, PackageCheck, ShieldCheck, Truck } from 'lucide-react'
import { TOYS_CATEGORIES } from './data'

const WHY = [
  {
    icon: ShieldCheck,
    title: 'Сертификаты на всё',
    text: 'У каждой игрушки есть документы. Материалы безопасные, краски нетоксичные — это можно проверить.',
  },
  {
    icon: PackageCheck,
    title: 'Проверяем перед отправкой',
    text: 'Вскрываем коробку, смотрим комплектность и работу электроники. Битое до вас не доедет.',
  },
  {
    icon: Truck,
    title: 'Доставка за 1–2 дня',
    text: 'По городу — на следующий день. Курьер подождёт, пока ребёнок распакует и проверит.',
  },
  {
    icon: HeartHandshake,
    title: 'Возврат без вопросов',
    text: 'Четырнадцать дней на возврат, даже если просто не подошло по возрасту. Деньги за три дня.',
  },
]

export function ToysWhy() {
  return (
    <section id="why" className="px-4 py-14 sm:px-6 sm:py-20">
      <div className="reveal mx-auto w-full max-w-6xl">
        <h2 className="text-center font-head text-3xl font-black leading-tight text-ink sm:text-4xl">
          Почему у нас спокойно покупать
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-card border-2 border-line bg-surface-2 p-6 transition hover:-translate-y-1 hover:border-brand"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand text-on-brand">
                <Icon size={22} />
              </span>
              <h3 className="mt-4 font-head text-[17px] font-extrabold text-ink">{title}</h3>
              <p className="mt-2 text-[14px] font-medium leading-relaxed text-ink-soft">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================ БАННЕР УПАКОВКИ ============================ */

export function ToysGiftBanner() {
  return (
    <section className="px-4 py-6 sm:px-6">
      <div
        className="reveal mx-auto flex w-full max-w-6xl flex-col items-center gap-6 overflow-hidden rounded-card px-6 py-10 text-center sm:px-12 lg:flex-row lg:text-left"
        style={{ background: 'linear-gradient(120deg, #7c4dff 0%, #b388ff 55%, #ffb020 100%)' }}
      >
        <span
          aria-hidden="true"
          className="grid h-24 w-24 shrink-0 place-items-center rounded-3xl bg-white/25 text-5xl backdrop-blur"
        >
          🎁
        </span>
        <div className="flex-1">
          <h2 className="font-head text-2xl font-black leading-tight text-white sm:text-3xl">
            Упакуем как подарок за 250 ₽
          </h2>
          <p className="mt-2 max-w-xl text-[16px] font-medium leading-relaxed text-white/90">
            Крафтовая бумага, атласная лента и открытка, подписанная от руки. Отметьте упаковку в
            карточке игрушки — текст открытки спросим при оформлении.
          </p>
        </div>
        <span className="flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-3 font-head text-[15px] font-extrabold text-[#5b2bd6]">
          <Gift size={18} />
          Есть у каждой игрушки
        </span>
      </div>
    </section>
  )
}

/* ============================ ПОДВАЛ ============================ */

export function ToysFooter() {
  return (
    <footer id="contacts" className="border-t-2 border-line bg-surface-3 px-4 py-12 sm:px-6">
      <div className="mx-auto grid w-full max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand text-xl">
              🧸
            </span>
            <span className="font-head text-[17px] font-extrabold tracking-tight text-ink">
              ИГРО<span className="text-brand">ГРАД</span>
            </span>
          </span>
          <p className="mt-4 text-[14px] font-medium leading-relaxed text-ink-soft">
            Магазин игрушек для детей от нуля до подростков. Работаем с 2020 года.
          </p>
        </div>

        <div>
          <h3 className="font-head text-[15px] font-extrabold text-ink">Категории</h3>
          <ul className="mt-4 flex flex-col gap-2.5">
            {TOYS_CATEGORIES.map((cat) => (
              <li key={cat.id}>
                <a
                  href="#catalog"
                  className="text-[14px] font-semibold text-ink-soft transition hover:text-brand"
                >
                  {cat.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-head text-[15px] font-extrabold text-ink">Покупателям</h3>
          <ul className="mt-4 flex flex-col gap-2.5">
            {['Доставка и оплата', 'Возврат товара', 'Подарочная упаковка', 'Сертификаты'].map(
              (link) => (
                <li key={link}>
                  <a
                    href="#why"
                    className="text-[14px] font-semibold text-ink-soft transition hover:text-brand"
                  >
                    {link}
                  </a>
                </li>
              ),
            )}
          </ul>
        </div>

        <div>
          <h3 className="font-head text-[15px] font-extrabold text-ink">Контакты</h3>
          <a
            href="tel:+74951112233"
            className="mt-4 block font-head text-lg font-black text-ink transition hover:text-brand"
          >
            +7 (495) 111-22-33
          </a>
          <p className="mt-1 text-[13px] font-medium text-ink-soft">Ежедневно с 9:00 до 21:00</p>
          <p className="mt-4 text-[14px] font-medium leading-relaxed text-ink-soft">
            Москва, ул. Садовая, 5
            <br />
            Пункт выдачи и шоурум
          </p>
        </div>
      </div>

      <div className="mx-auto mt-10 w-full max-w-6xl border-t-2 border-line pt-6">
        <p className="text-[13px] font-medium leading-relaxed text-ink-soft">
          Демонстрационный шаблон. Магазин «Игроград», товары, цены и контакты вымышлены, заказы не
          обрабатываются.
        </p>
      </div>
    </footer>
  )
}
