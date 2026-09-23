import { Check, Copy, Fish, MapPin, Snowflake, Timer, Truck } from 'lucide-react'
import { useState } from 'react'
import { useCountdown } from '../../lib/hooks'
import { buttonStyles } from '../../ui/Button'
import { SectionHeading } from '../../ui/Bits'
import { useToast } from '../../ui/Toast'

const PROMO_CODE = 'VECHER20'

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

/** Акция с обратным отсчётом и копированием промокода. */
export function SushiPromo() {
  const { left } = useCountdown(3 * 60 * 60 + 25 * 60)
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  const hours = Math.floor(left / 3600)
  const minutes = Math.floor((left % 3600) / 60)
  const seconds = left % 60

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(PROMO_CODE)
      setCopied(true)
      toast('Промокод скопирован')
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // буфер обмена может быть недоступен — показываем код текстом
      toast(`Скопируйте вручную: ${PROMO_CODE}`, 'info')
    }
  }

  return (
    <section id="promo" className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="reveal mx-auto w-full max-w-6xl overflow-hidden rounded-card border border-line bg-surface-2">
        <div className="grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-1.5 text-[13px] font-extrabold uppercase tracking-wider text-on-brand">
              <Timer size={14} />
              Только сегодня
            </span>
            <h2 className="mt-5 font-head text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
              Минус 20 % на вечерний заказ
            </h2>
            <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-ink-soft">
              Скидка действует на заказы после 18:00. Введите промокод в корзине — он применится
              ко всей сумме, кроме доставки.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={copyCode}
                className="group flex cursor-pointer items-center justify-between gap-4 rounded-control border-2 border-dashed border-brand bg-brand-soft px-5 py-3.5 transition hover:bg-brand/15"
              >
                <span className="font-head text-xl font-extrabold tracking-[0.15em] text-ink">
                  {PROMO_CODE}
                </span>
                {copied ? (
                  <Check size={18} className="text-emerald-400" />
                ) : (
                  <Copy size={18} className="text-brand transition group-hover:scale-110" />
                )}
              </button>
              <a href="#menu" className={buttonStyles('primary', 'lg')}>
                Собрать заказ
              </a>
            </div>
          </div>

          {/* Таймер */}
          <div className="flex flex-col items-center gap-4 rounded-card border border-line bg-surface p-6">
            <span className="text-[13px] font-semibold uppercase tracking-wider text-ink-soft">
              До конца акции
            </span>
            <div className="flex items-center gap-2">
              {[
                { value: pad(hours), label: 'часов' },
                { value: pad(minutes), label: 'минут' },
                { value: pad(seconds), label: 'секунд' },
              ].map(({ value, label }, i) => (
                <div key={label} className="flex items-center gap-2">
                  {i > 0 && <span className="font-head text-2xl text-ink-soft">:</span>}
                  <div className="flex flex-col items-center">
                    <span className="grid h-16 w-16 place-items-center rounded-control bg-surface-2 font-head text-2xl font-extrabold tabular-nums text-brand">
                      {value}
                    </span>
                    <span className="mt-1.5 text-[12px] text-ink-soft">{label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ============================ ДОСТАВКА ============================ */

const DELIVERY = [
  {
    icon: Fish,
    title: 'Рыба каждое утро',
    text: 'Поставка в 7:00, к вечеру ничего не остаётся. Если позиция закончилась — она просто пропадает из меню, а не едет к вам вчерашней.',
  },
  {
    icon: Truck,
    title: '60 минут по городу',
    text: 'В пределах МКАД — час. За МКАД считаем отдельно по километражу, курьер скажет сумму до выезда.',
  },
  {
    icon: Snowflake,
    title: 'Термосумка обязательна',
    text: 'Роллы едут при +4 °C, горячее — в отдельном отсеке. Ничего не нагревается и не остывает по дороге.',
  },
  {
    icon: MapPin,
    title: 'Бесплатно от 1500 ₽',
    text: 'Заказ меньше — доставка 250 ₽. Самовывоз со скидкой 10 %, забрать можно через 25 минут после заказа.',
  },
]

export function SushiDelivery() {
  return (
    <section id="delivery" className="border-t border-line px-4 py-16 sm:px-6 sm:py-24">
      <div className="reveal mx-auto w-full max-w-6xl">
        <SectionHeading
          eyebrow="Доставка"
          title="Как мы довозим"
          subtitle="Короткий и честный ответ на четыре вопроса, которые задают чаще всего."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {DELIVERY.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-card border border-line bg-surface-2 p-6 transition hover:border-brand/40"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand">
                <Icon size={20} />
              </span>
              <h3 className="mt-4 font-head text-lg font-bold text-ink">{title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================ ПОДВАЛ ============================ */

export function SushiFooter() {
  return (
    <footer id="contacts" className="border-t border-line px-4 py-12 sm:px-6">
      <div className="mx-auto grid w-full max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand font-head text-lg font-extrabold text-on-brand">
              С
            </span>
            <span className="font-head text-[15px] font-extrabold text-ink">САКУРА</span>
          </span>
          <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">
            Суши-бар и доставка японской кухни. Работаем с 2019 года.
          </p>
        </div>

        <div>
          <h3 className="font-head text-[15px] font-bold text-ink">Контакты</h3>
          <ul className="mt-3 flex flex-col gap-2 text-[14px] text-ink-soft">
            <li>
              <a href="tel:+74951234567" className="transition hover:text-brand">
                +7 (495) 123-45-67
              </a>
            </li>
            <li>
              <a href="mailto:order@sakura.example" className="transition hover:text-brand">
                order@sakura.example
              </a>
            </li>
            <li>Москва, ул. Арбат, 12</li>
          </ul>
        </div>

        <div>
          <h3 className="font-head text-[15px] font-bold text-ink">Часы работы</h3>
          <ul className="mt-3 flex flex-col gap-2 text-[14px] text-ink-soft">
            <li>Пн–Чт: 11:00 – 23:00</li>
            <li>Пт–Вс: 11:00 – 01:00</li>
            <li>Последний заказ за час до закрытия</li>
          </ul>
        </div>

        <div>
          <h3 className="font-head text-[15px] font-bold text-ink">Разделы</h3>
          <ul className="mt-3 flex flex-col gap-2 text-[14px] text-ink-soft">
            {[
              { href: '#menu', label: 'Меню' },
              { href: '#promo', label: 'Акции' },
              { href: '#delivery', label: 'Доставка' },
            ].map((l) => (
              <li key={l.href}>
                <a href={l.href} className="transition hover:text-brand">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-10 w-full max-w-6xl border-t border-line pt-6">
        <p className="text-[13px] text-ink-soft">
          Демонстрационный шаблон. Компания «Сакура», адреса, телефоны и цены вымышлены, заказы не
          обрабатываются.
        </p>
      </div>
    </footer>
  )
}
