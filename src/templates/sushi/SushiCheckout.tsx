import { useState, type FormEvent } from 'react'
import { Banknote, Check, Clock, CreditCard, Smartphone, Utensils } from 'lucide-react'
import { formatPhone, formatPrice, isPhoneComplete, makeOrderNumber } from '../../lib/format'
import { useCart } from '../../store/cart'
import { Button } from '../../ui/Button'
import { Input, OptionCards, Textarea } from '../../ui/Field'
import { QtyStepper } from '../../ui/Bits'
import { Modal } from '../../ui/Modal'
import { useToast } from '../../ui/Toast'

type DeliveryType = 'asap' | 'time'
type Payment = 'online' | 'card-courier' | 'cash'
type Errors = Partial<Record<'name' | 'phone' | 'address' | 'time', string>>

type Placed = { number: string; total: number; eta: string }

const PAYMENT_OPTIONS = [
  { value: 'online' as const, title: 'Картой онлайн', note: 'Оплата при оформлении', icon: <CreditCard size={18} /> },
  { value: 'card-courier' as const, title: 'Картой курьеру', note: 'Терминал с собой', icon: <Smartphone size={18} /> },
  { value: 'cash' as const, title: 'Наличными', note: 'Подготовьте сумму', icon: <Banknote size={18} /> },
]

export function SushiCheckout({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lines, total, clear } = useCart()
  const { toast } = useToast()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [flat, setFlat] = useState('')
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('asap')
  const [time, setTime] = useState('')
  const [payment, setPayment] = useState<Payment>('online')
  const [persons, setPersons] = useState(2)
  const [comment, setComment] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [sending, setSending] = useState(false)
  const [placed, setPlaced] = useState<Placed | null>(null)

  function validate(): Errors {
    const next: Errors = {}
    if (name.trim().length < 2) next.name = 'Как к вам обращаться?'
    if (!isPhoneComplete(phone)) next.phone = 'Телефон из 11 цифр — курьер позвонит'
    if (address.trim().length < 5) next.address = 'Укажите улицу и номер дома'
    if (deliveryType === 'time' && !time) next.time = 'Выберите время доставки'
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
    // Демонстрация: заказ никуда не отправляется. Здесь подключается API или Telegram-бот.
    window.setTimeout(() => {
      setSending(false)
      setPlaced({
        number: makeOrderNumber(),
        total,
        eta: deliveryType === 'asap' ? 'примерно через 60 минут' : `к ${time}`,
      })
      clear()
      toast('Заказ оформлен')
    }, 800)
  }

  function handleClose() {
    onClose()
    // сбрасываем экран успеха, чтобы в следующий раз открылась форма
    window.setTimeout(() => setPlaced(null), 250)
  }

  if (placed) {
    return (
      <Modal open={open} onClose={handleClose} size="sm" label="Заказ оформлен">
        <div className="flex flex-col items-center gap-4 p-8 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-emerald-500/15 text-emerald-400">
            <Check size={32} />
          </span>
          <h2 className="font-head text-2xl font-extrabold text-ink">Заказ принят</h2>
          <p className="text-[15px] leading-relaxed text-ink-soft">
            Номер заказа <b className="text-ink">№ {placed.number}</b>. Курьер приедет{' '}
            {placed.eta}. Мы позвоним на {phone} для подтверждения.
          </p>
          <dl className="flex w-full items-center justify-between rounded-control bg-surface-2 px-4 py-3">
            <dt className="text-ink-soft">К оплате</dt>
            <dd className="font-head text-lg font-extrabold text-brand">
              {formatPrice(placed.total)}
            </dd>
          </dl>
          <p className="text-[13px] text-ink-soft opacity-70">
            Это демонстрация: заказ никуда не отправлен. В боевой версии он попадает в CRM и в
            Telegram кухни.
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
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 p-6 sm:p-8">
        <header>
          <h2 className="font-head text-2xl font-extrabold text-ink">Оформление заказа</h2>
          <p className="mt-1 text-[15px] text-ink-soft">
            {lines.length > 0
              ? `К оплате ${formatPrice(total)} — доставим по Москве в пределах МКАД`
              : 'Корзина пуста'}
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Имя"
            placeholder="Иван"
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

        <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
          <Input
            label="Улица и дом"
            placeholder="ул. Арбат, 12"
            required
            value={address}
            onChange={(e) => {
              setAddress(e.target.value)
              if (errors.address) setErrors((p) => ({ ...p, address: undefined }))
            }}
            error={errors.address}
          />
          <Input
            label="Кв. / офис"
            placeholder="45"
            value={flat}
            onChange={(e) => setFlat(e.target.value)}
          />
        </div>

        <OptionCards<DeliveryType>
          label="Когда доставить"
          value={deliveryType}
          onChange={setDeliveryType}
          options={[
            { value: 'asap', title: 'Как можно скорее', note: '60–90 минут', icon: <Clock size={18} /> },
            { value: 'time', title: 'Ко времени', note: 'Выберу сам', icon: <Clock size={18} /> },
          ]}
        />

        {deliveryType === 'time' && (
          <Input
            label="Время доставки"
            type="time"
            required
            value={time}
            onChange={(e) => {
              setTime(e.target.value)
              if (errors.time) setErrors((p) => ({ ...p, time: undefined }))
            }}
            error={errors.time}
            className="animate-fade-in sm:max-w-[200px]"
          />
        )}

        <OptionCards<Payment>
          label="Способ оплаты"
          value={payment}
          onChange={setPayment}
          options={PAYMENT_OPTIONS}
        />

        <div className="flex items-center justify-between gap-4 rounded-control border border-line bg-surface-2 px-4 py-3">
          <span className="flex items-center gap-2.5">
            <Utensils size={18} className="text-brand" />
            <span>
              <span className="block font-semibold text-ink">Приборы и палочки</span>
              <span className="block text-[13px] text-ink-soft">Положим нужное количество</span>
            </span>
          </span>
          <QtyStepper value={persons} onChange={setPersons} min={0} max={10} size="sm" />
        </div>

        <Textarea
          label="Комментарий курьеру"
          placeholder="Домофон не работает, позвоните за 5 минут"
          rows={2}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <Button type="submit" size="lg" full disabled={sending || lines.length === 0}>
          {sending ? 'Отправляю…' : `Заказать за ${formatPrice(total)}`}
        </Button>
        <p className="text-center text-[13px] text-ink-soft">
          Нажимая кнопку, вы соглашаетесь на обработку персональных данных
        </p>
      </form>
    </Modal>
  )
}
