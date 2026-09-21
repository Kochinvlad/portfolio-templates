import { useMemo, useState, type FormEvent } from 'react'
import { CalendarCheck, Check, Users } from 'lucide-react'
import { cn } from '../../lib/cn'
import {
  formatDateLong,
  formatPhone,
  isPhoneComplete,
  makeOrderNumber,
  plural,
  todayISO,
} from '../../lib/format'
import { Button } from '../../ui/Button'
import { Input, Select, Textarea } from '../../ui/Field'
import { QtyStepper } from '../../ui/Bits'
import { useToast } from '../../ui/Toast'
import { REST_TIME_SLOTS } from './data'

type Errors = Partial<Record<'date' | 'time' | 'name' | 'phone', string>>

type Confirmed = {
  code: string
  date: string
  time: string
  guests: number
  name: string
}

const OCCASIONS = [
  'Просто ужин',
  'День рождения',
  'Свидание',
  'Деловая встреча',
  'Семейный обед',
]

/**
 * Занятые слоты вычисляются детерминированно по дате — при смене даты
 * набор меняется, как на настоящем сайте бронирования.
 */
function busySlotsFor(dateISO: string): string[] {
  if (!dateISO) return []
  let hash = 0
  for (let i = 0; i < dateISO.length; i++) {
    hash = (hash * 31 + dateISO.charCodeAt(i)) % 9973
  }
  const n = REST_TIME_SLOTS.length
  const picked = new Set([hash % n, (hash * 7) % n, (hash * 13) % n])
  return [...picked].map((i) => REST_TIME_SLOTS[i])
}

export function RestaurantBooking() {
  const { toast } = useToast()
  const [date, setDate] = useState(todayISO())
  const [time, setTime] = useState('')
  const [guests, setGuests] = useState(2)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [occasion, setOccasion] = useState(OCCASIONS[0])
  const [comment, setComment] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [sending, setSending] = useState(false)
  const [confirmed, setConfirmed] = useState<Confirmed | null>(null)

  const busy = useMemo(() => busySlotsFor(date), [date])

  function validate(): Errors {
    const next: Errors = {}
    if (!date) next.date = 'Выберите дату'
    if (!time) next.time = 'Выберите время'
    if (name.trim().length < 2) next.name = 'Как вас записать?'
    if (!isPhoneComplete(phone)) next.phone = 'Телефон из 11 цифр — подтвердим бронь'
    return next
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) {
      toast('Проверьте поля формы', 'error')
      return
    }
    setSending(true)
    // Демонстрация: бронь никуда не отправляется. Здесь подключается система бронирования.
    window.setTimeout(() => {
      setSending(false)
      setConfirmed({ code: makeOrderNumber(), date, time, guests, name })
      toast('Столик забронирован')
    }, 800)
  }

  if (confirmed) {
    return (
      <section id="booking" className="border-t border-line px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto w-full max-w-2xl border border-line bg-surface-2 p-8 text-center sm:p-12">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-600/12 text-emerald-700">
            <Check size={32} />
          </span>
          <h2 className="mt-6 font-head text-3xl font-semibold text-ink">Столик ваш</h2>
          <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">
            {confirmed.name}, ждём вас. Бронь № {confirmed.code} — назовите этот номер
            администратору на входе.
          </p>

          <dl className="mt-8 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
            {[
              { label: 'Дата', value: formatDateLong(confirmed.date) },
              { label: 'Время', value: confirmed.time },
              {
                label: 'Гостей',
                value: `${confirmed.guests} ${plural(confirmed.guests, ['гость', 'гостя', 'гостей'])}`,
              },
            ].map(({ label, value }) => (
              <div key={label} className="bg-surface px-4 py-5">
                <dt className="text-[11px] uppercase tracking-[0.2em] text-ink-soft">{label}</dt>
                <dd className="mt-2 font-head text-[17px] font-semibold text-ink">{value}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 text-[13px] leading-relaxed text-ink-soft opacity-70">
            Это демонстрация: бронь никуда не отправлена. В боевой версии она попадает в систему
            бронирования и в чат администратора.
          </p>

          <Button
            variant="outline"
            className="mt-6"
            onClick={() => {
              setConfirmed(null)
              setTime('')
              setName('')
              setPhone('')
              setComment('')
              setErrors({})
            }}
          >
            Забронировать ещё один
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section id="booking" className="border-t border-line px-4 py-16 sm:px-6 sm:py-24">
      <div className="reveal mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
            Бронирование
          </span>
          <h2 className="mt-5 font-head text-3xl font-semibold leading-tight text-ink sm:text-4xl">
            Забронировать столик
          </h2>
          <p className="mt-5 text-[16px] leading-relaxed text-ink-soft">
            Бронь держим 20 минут после назначенного времени. Если опаздываете — позвоните, мы
            подождём.
          </p>

          <ul className="mt-8 flex flex-col gap-4">
            {[
              { icon: CalendarCheck, title: 'Подтверждаем за час', text: 'Перезвоним и уточним детали' },
              { icon: Users, title: 'Компании от 8 человек', text: 'Бронируем приватный зал, меню согласуем заранее' },
            ].map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4 border-l-2 border-brand pl-4">
                <Icon size={20} className="mt-0.5 shrink-0 text-brand" />
                <span>
                  <span className="block font-head text-[17px] font-semibold text-ink">{title}</span>
                  <span className="mt-1 block text-[14px] leading-relaxed text-ink-soft">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-6 border border-line bg-surface-2 p-6 sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Дата"
              type="date"
              required
              min={todayISO()}
              value={date}
              onChange={(e) => {
                setDate(e.target.value)
                setTime('')
                if (errors.date) setErrors((p) => ({ ...p, date: undefined }))
              }}
              error={errors.date}
            />
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-ink">
                Гостей<span className="text-brand"> *</span>
              </span>
              <div className="flex h-[50px] items-center justify-between border border-line bg-surface px-4">
                <span className="text-[15px] text-ink-soft">
                  {plural(guests, ['гость', 'гостя', 'гостей'])}
                </span>
                <QtyStepper value={guests} onChange={setGuests} min={1} max={12} size="sm" label="Количество гостей" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-ink">
              Время<span className="text-brand"> *</span>
            </span>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
              {REST_TIME_SLOTS.map((slot) => {
                const isBusy = busy.includes(slot)
                const active = slot === time
                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={isBusy}
                    aria-pressed={active}
                    aria-label={isBusy ? `${slot} — занято` : `Выбрать время ${slot}`}
                    onClick={() => {
                      setTime(slot)
                      if (errors.time) setErrors((p) => ({ ...p, time: undefined }))
                    }}
                    className={cn(
                      'border py-2.5 text-[14px] font-semibold tabular-nums transition',
                      isBusy
                        ? 'cursor-not-allowed border-line bg-surface-3 text-ink-soft line-through opacity-50'
                        : active
                          ? 'cursor-pointer border-brand bg-brand text-on-brand'
                          : 'cursor-pointer border-line bg-surface text-ink hover:border-brand',
                    )}
                  >
                    {slot}
                  </button>
                )
              })}
            </div>
            {errors.time ? (
              <p className="text-sm font-medium text-red-500">{errors.time}</p>
            ) : (
              <p className="text-sm text-ink-soft">
                Зачёркнутое время уже занято — попробуйте другую дату
              </p>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Имя"
              placeholder="Анна"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (errors.name) setErrors((p) => ({ ...p, name: undefined }))
              }}
              error={errors.name}
            />
            <Input
              label="Телефон"
              type="tel"
              placeholder="+7 (999) 123-45-67"
              required
              value={phone}
              onChange={(e) => {
                setPhone(formatPhone(e.target.value))
                if (errors.phone) setErrors((p) => ({ ...p, phone: undefined }))
              }}
              error={errors.phone}
            />
          </div>

          <Select label="Повод" value={occasion} onChange={(e) => setOccasion(e.target.value)}>
            {OCCASIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </Select>

          <Textarea
            label="Пожелания"
            placeholder="Столик у окна, детский стульчик, торт к десерту"
            rows={2}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <Button type="submit" size="lg" full disabled={sending}>
            {sending ? 'Отправляю…' : 'Забронировать'}
          </Button>
          <p className="text-center text-[13px] text-ink-soft">
            Нажимая кнопку, вы соглашаетесь на обработку персональных данных
          </p>
        </form>
      </div>
    </section>
  )
}
