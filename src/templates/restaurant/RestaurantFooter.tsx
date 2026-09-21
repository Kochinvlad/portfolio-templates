import { Camera, Clock, MapPin, Phone, Send } from 'lucide-react'

export function RestaurantFooter() {
  return (
    <footer id="contacts" className="border-t border-line bg-surface-3">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <span className="flex flex-col leading-none">
            <span className="font-head text-xl font-bold tracking-[0.18em] text-ink">ТЕРРАСА</span>
            <span className="mt-1 text-[10px] uppercase tracking-[0.3em] text-ink-soft">
              кухня и вино
            </span>
          </span>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-ink-soft">
            Европейская кухня на открытом огне у Чистых прудов. Работаем с 2016 года.
          </p>
          <div className="mt-6 flex gap-2">
            {[
              { icon: Camera, label: 'Фотографии зала в соцсети' },
              { icon: Send, label: 'Наш Telegram' },
            ].map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#contacts"
                aria-label={label}
                className="grid h-11 w-11 place-items-center border border-line bg-surface text-ink transition hover:border-brand hover:text-brand"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-brand">
            Контакты
          </h3>
          <ul className="mt-5 flex flex-col gap-4 text-[15px] text-ink-soft">
            <li className="flex gap-3">
              <MapPin size={17} className="mt-0.5 shrink-0 text-brand" />
              <span>
                Москва, Чистопрудный бульвар, 14с3
                <br />
                <span className="text-[13px]">2 минуты от метро «Чистые пруды»</span>
              </span>
            </li>
            <li className="flex gap-3">
              <Phone size={17} className="mt-0.5 shrink-0 text-brand" />
              <a href="tel:+74959876543" className="transition hover:text-brand">
                +7 (495) 987-65-43
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-brand">
            Часы работы
          </h3>
          <ul className="mt-5 flex flex-col gap-3 text-[15px] text-ink-soft">
            <li className="flex gap-3">
              <Clock size={17} className="mt-0.5 shrink-0 text-brand" />
              <span>
                Пн–Чт: 12:00 – 23:00
                <br />
                Пт–Сб: 12:00 – 01:00
                <br />
                Вс: 12:00 – 22:00
              </span>
            </li>
            <li className="text-[13px]">
              Кухня принимает заказы до 22:00, в пятницу и субботу — до полуночи.
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <p className="mx-auto w-full max-w-6xl px-4 py-6 text-[13px] text-ink-soft sm:px-6">
          Демонстрационный шаблон. Ресторан «Терраса», адреса, телефоны и цены вымышлены,
          бронирования не обрабатываются.
        </p>
      </div>
    </footer>
  )
}
