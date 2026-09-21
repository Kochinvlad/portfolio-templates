import { useState, type FormEvent } from 'react'
import {
  Banknote,
  Check,
  CreditCard,
  MapPin,
  Package,
  Store,
  Truck,
} from 'lucide-react'
import { cn } from '../../lib/cn'
import { formatPhone, formatPrice, isPhoneComplete, makeOrderNumber } from '../../lib/format'
import { useCart } from '../../store/cart'
import { Button } from '../../ui/Button'
import { Input, OptionCards, Select } from '../../ui/Field'
import { Modal } from '../../ui/Modal'
import { useToast } from '../../ui/Toast'

type Delivery = 'courier' | 'pickup' | 'post'
type Payment = 'online' | 'card-courier' | 'cash' | 'installment'
type Step = 1 | 2
type Errors = Partial<Record<'name' | 'phone' | 'email' | 'address' | 'agree', string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const PICKUP_POINTS = [
  'Москва, Тверская 18 — ежедневно 10:00–22:00',
  'Москва, Ленинский проспект 42 — ежедневно 9:00–21:00',
  'Москва, Кутузовский проспект 7 — пн–сб 10:00–20:00',
]

const DELIVERY_OPTIONS = [
  { value: 'courier' as const, title: 'Курьер', note: 'Завтра, 490 ₽', icon: <Truck size={18} /> },
  { value: 'pickup' as const, title: 'Пункт выдачи', note: 'Послезавтра, бесплатно', icon: <Store size={18} /> },
  { value: 'post' as const, title: 'Почта России', note: '5–10 дней, 350 ₽', icon: <Package size={18} /> },
]

const PAYMENT_OPTIONS = [
  { value: 'online' as const, title: 'Картой онлайн', note: 'Оплата сразу', icon: <CreditCard size={18} /> },
  { value: 'card-courier' as const, title: 'Картой при получении', note: 'Терминал у курьера', icon: <CreditCard size={18} /> },
  { value: 'cash' as const, title: 'Наличными', note: 'При получении', icon: <Banknote size={18} /> },
  { value: 'installment' as const, title: 'Рассрочка', note: '6 платежей без процентов', icon: <Package size={18} /> },
]

export function ShopCheckout({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lines, count, subtotal, discount, delivery: deliveryFee, total, clear } = useCart()
  const { toast } = useToast()

  const [step, setStep] = useState<Step>(1)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [delivery, setDelivery] = useState<Delivery>('courier')
  const [address, setAddress] = useState('')
  const [pickupPoint, setPickupPoint] = useState(PICKUP_POINTS[0])
  const [payment, setPayment] = useState<Payment>('online')
  const [agree, setAgree] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [sending, setSending] = useState(false)
  const [placed, setPlaced] = useState<{ number: string; total: number } | null>(null)

  function validateStep1(): Errors {
    const next: Errors = {}
    if (name.trim().length < 2) next.name = 'Введите имя'
    if (!isPhoneComplete(phone)) next.phone = 'Телефон из 11 цифр'
    if (!EMAIL_RE.test(email.trim())) next.email = 'Нужна почта для чека'
    if (delivery !== 'pickup' && address.trim().length < 5) {
      next.address = 'Укажите адрес доставки'
    }
    return next
  }

  function goToStep2() {
    const next = validateStep1()
    setErrors(next)
    if (Object.keys(next).length > 0) {
      toast('Заполните данные получателя', 'error')
      return
    }
    setStep(2)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!agree) {
      setErrors({ agree: 'Нужно согласие на обработку данных' })
      toast('Подтвердите согласие', 'error')
      return
    }
    setSending(true)
    // Демонстрация: заказ никуда не отправляется. Здесь подключается API магазина.
    window.setTimeout(() => {
      setSending(false)
      setPlaced({ number: makeOrderNumber(), total })
      clear()
      toast('Заказ оформлен')
    }, 800)
  }

  function handleClose() {
    onClose()
    window.setTimeout(() => {
      setPlaced(null)
      setStep(1)
      setAgree(false)
      setErrors({})
    }, 250)
  }

  if (placed) {
    return (
      <Modal open={open} onClose={handleClose} size="sm" label="Заказ оформлен">
        <div className="flex flex-col items-center gap-4 p-8 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-emerald-500/12 text-emerald-600">
            <Check size={32} />
          </span>
          <h2 className="font-head text-2xl font-extrabold text-ink">Заказ № {placed.number}</h2>
          <p className="text-[15px] leading-relaxed text-ink-soft">
            Отправили подтверждение на {email}. Менеджер позвонит на {phone}, чтобы согласовать
            время доставки.
          </p>
          <dl className="flex w-full items-center justify-between rounded-control bg-surface-2 px-4 py-3">
            <dt className="text-ink-soft">К оплате</dt>
            <dd className="font-head text-lg font-extrabold text-brand">
              {formatPrice(placed.total)}
            </dd>
          </dl>
          <p className="text-[13px] leading-relaxed text-ink-soft opacity-70">
            Это демонстрация: заказ никуда не отправлен. В боевой версии он попадает в CRM, а
            покупатель получает письмо и SMS.
          </p>
          <Button size="lg" full onClick={handleClose}>
            Хорошо
          </Button>
        </div>
      </Modal>
    )
  }

  return (
    <Modal open={open} onClose={handleClose} size="md" label="Оформление заказа">
      <div className="p-6 sm:p-8">
        <h2 className="font-head text-2xl font-extrabold text-ink">Оформление заказа</h2>

        {/* Шаги */}
        <ol className="mt-6 flex items-center gap-3">
          {[
            { n: 1 as const, label: 'Получатель' },
            { n: 2 as const, label: 'Оплата' },
          ].map(({ n, label }, i) => (
            <li key={n} className="flex flex-1 items-center gap-3">
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className={cn('h-px flex-1', step >= n ? 'bg-brand' : 'bg-line')}
                />
              )}
              <span className="flex items-center gap-2.5">
                <span
                  className={cn(
                    'grid h-8 w-8 shrink-0 place-items-center rounded-full text-[14px] font-extrabold transition',
                    step >= n ? 'bg-brand text-on-brand' : 'bg-surface-3 text-ink-soft',
                  )}
                >
                  {step > n ? <Check size={16} /> : n}
                </span>
                <span
                  className={cn(
                    'text-[14px] font-semibold',
                    step >= n ? 'text-ink' : 'text-ink-soft',
                  )}
                >
                  {label}
                </span>
              </span>
              {i === 0 && (
                <span
                  aria-hidden="true"
                  className={cn('h-px flex-1', step > 1 ? 'bg-brand' : 'bg-line')}
                />
              )}
            </li>
          ))}
        </ol>

        {step === 1 ? (
          <div className="mt-7 flex flex-col gap-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Имя и фамилия"
                placeholder="Иван Петров"
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

            <Input
              label="Электронная почта"
              type="email"
              placeholder="ivan@mail.ru"
              hint="Отправим чек и накладную"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) setErrors((p) => ({ ...p, email: undefined }))
              }}
              error={errors.email}
            />

            <OptionCards<Delivery>
              label="Способ получения"
              value={delivery}
              onChange={setDelivery}
              options={DELIVERY_OPTIONS}
              columns={3}
            />

            {delivery === 'pickup' ? (
              <Select
                label="Пункт выдачи"
                value={pickupPoint}
                onChange={(e) => setPickupPoint(e.target.value)}
                className="animate-fade-in"
              >
                {PICKUP_POINTS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </Select>
            ) : (
              <Input
                label="Адрес доставки"
                placeholder="Москва, ул. Тверская, 18, кв. 45"
                required
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value)
                  if (errors.address) setErrors((p) => ({ ...p, address: undefined }))
                }}
                error={errors.address}
                className="animate-fade-in"
              />
            )}

            <Button size="lg" full onClick={goToStep2} disabled={lines.length === 0}>
              Дальше — к оплате
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-7 flex flex-col gap-5">
            <div className="rounded-control border border-line bg-surface-2 p-4">
              <h3 className="flex items-center gap-2 font-head text-[15px] font-bold text-ink">
                <MapPin size={16} className="text-brand" />
                Куда везём
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
                {name}, {phone}
                <br />
                {delivery === 'pickup' ? pickupPoint : address}
              </p>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="mt-3 cursor-pointer text-[13px] font-semibold text-brand underline"
              >
                Изменить
              </button>
            </div>

            <OptionCards<Payment>
              label="Способ оплаты"
              value={payment}
              onChange={setPayment}
              options={PAYMENT_OPTIONS}
            />

            <dl className="flex flex-col gap-2 rounded-control border border-line p-4 text-[15px]">
              <div className="flex justify-between">
                <dt className="text-ink-soft">
                  Товары{count > 0 ? `, ${count} шт.` : ''}
                </dt>
                <dd className="font-semibold text-ink">{formatPrice(subtotal)}</dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between">
                  <dt className="text-ink-soft">Скидка</dt>
                  <dd className="font-semibold text-emerald-600">−{formatPrice(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-ink-soft">Доставка</dt>
                <dd className="font-semibold text-ink">
                  {deliveryFee === 0 ? 'бесплатно' : formatPrice(deliveryFee)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-line pt-2">
                <dt className="font-head text-lg font-bold text-ink">Итого</dt>
                <dd className="font-head text-lg font-extrabold text-brand">
                  {formatPrice(total)}
                </dd>
              </div>
            </dl>

            <label className="flex cursor-pointer items-start gap-3 text-[14px] leading-relaxed text-ink-soft">
              <span
                className={cn(
                  'mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border transition',
                  agree ? 'border-brand bg-brand text-on-brand' : 'border-line bg-surface',
                  errors.agree && !agree && 'border-red-500',
                )}
              >
                {agree && <Check size={13} />}
              </span>
              <input
                type="checkbox"
                checked={agree}
                onChange={() => {
                  setAgree((v) => !v)
                  if (errors.agree) setErrors((p) => ({ ...p, agree: undefined }))
                }}
                className="sr-only"
              />
              Согласен на обработку персональных данных и с условиями продажи
            </label>
            {errors.agree && <p className="-mt-3 text-sm font-medium text-red-500">{errors.agree}</p>}

            <div className="flex gap-3">
              <Button variant="outline" size="lg" onClick={() => setStep(1)}>
                Назад
              </Button>
              <Button type="submit" size="lg" className="flex-1" disabled={sending}>
                {sending ? 'Отправляю…' : `Оплатить ${formatPrice(total)}`}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  )
}
