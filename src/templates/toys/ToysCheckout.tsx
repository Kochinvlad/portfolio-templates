import { useState, type FormEvent } from 'react'
import { Banknote, Check, CreditCard, Gift, PartyPopper } from 'lucide-react'
import { formatPhone, formatPrice, isPhoneComplete, makeOrderNumber } from '../../lib/format'
import { useCart } from '../../store/cart'
import { Button } from '../../ui/Button'
import { Input, OptionCards, Select, Textarea } from '../../ui/Field'
import { Modal } from '../../ui/Modal'
import { useToast } from '../../ui/Toast'

type Payment = 'online' | 'card-courier' | 'cash'
type Errors = Partial<Record<'name' | 'phone' | 'address', string>>

const TIME_SLOTS = ['10:00 – 14:00', '14:00 – 18:00', '18:00 – 22:00']

const PAYMENT_OPTIONS = [
  { value: 'online' as const, title: 'Картой онлайн', note: 'Оплата сразу', icon: <CreditCard size={18} /> },
  { value: 'card-courier' as const, title: 'Картой курьеру', note: 'Терминал с собой', icon: <CreditCard size={18} /> },
  { value: 'cash' as const, title: 'Наличными', note: 'При получении', icon: <Banknote size={18} /> },
]

export function ToysCheckout({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lines, total, clear } = useCart()
  const { toast } = useToast()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [slot, setSlot] = useState(TIME_SLOTS[0])
  const [postcard, setPostcard] = useState('')
  const [payment, setPayment] = useState<Payment>('online')
  const [errors, setErrors] = useState<Errors>({})
  const [sending, setSending] = useState(false)
  const [placed, setPlaced] = useState<{ number: string; total: number } | null>(null)

  // Открытка нужна, только если в корзине есть подарочная упаковка
  const hasGiftWrap = lines.some((l) => l.variant === 'Подарочная упаковка')

  function validate(): Errors {
    const next: Errors = {}
    if (name.trim().length < 2) next.name = 'Как вас зовут?'
    if (!isPhoneComplete(phone)) next.phone = 'Телефон из 11 цифр'
    if (address.trim().length < 5) next.address = 'Укажите адрес доставки'
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
    // Демонстрация: заказ никуда не отправляется.
    window.setTimeout(() => {
      setSending(false)
      setPlaced({ number: makeOrderNumber(), total })
      clear()
      toast('Заказ оформлен')
    }, 800)
  }

  function handleClose() {
    onClose()
    window.setTimeout(() => setPlaced(null), 250)
  }

  if (placed) {
    return (
      <Modal open={open} onClose={handleClose} size="sm" label="Заказ оформлен">
        <div className="flex flex-col items-center gap-4 p-8 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-brand-soft text-brand">
            <PartyPopper size={32} />
          </span>
          <h2 className="font-head text-2xl font-black text-ink">Заказ № {placed.number}</h2>
          <p className="text-[15px] font-medium leading-relaxed text-ink-soft">
            {name}, спасибо. Привезём {slot.toLowerCase()} по адресу: {address}. Курьер позвонит на{' '}
            {phone} за полчаса до приезда.
          </p>
          <dl className="flex w-full items-center justify-between rounded-control bg-surface-2 px-4 py-3">
            <dt className="font-semibold text-ink-soft">К оплате</dt>
            <dd className="font-head text-lg font-black text-brand">{formatPrice(placed.total)}</dd>
          </dl>
          <p className="text-[13px] leading-relaxed text-ink-soft opacity-70">
            Это демонстрация: заказ никуда не отправлен. В боевой версии он попадает в CRM и
            складскую программу.
          </p>
          <Button size="lg" full onClick={handleClose}>
            Ура!
          </Button>
        </div>
      </Modal>
    )
  }

  return (
    <Modal open={open} onClose={handleClose} size="md" label="Оформление заказа">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 p-6 sm:p-8">
        <header>
          <h2 className="font-head text-2xl font-black text-ink">Оформление заказа</h2>
          <p className="mt-1 text-[15px] font-medium text-ink-soft">
            {lines.length > 0 ? `К оплате ${formatPrice(total)}` : 'Корзина пуста'}
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Имя"
            placeholder="Мария"
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
          label="Адрес доставки"
          placeholder="Москва, ул. Садовая, 5, кв. 12"
          required
          value={address}
          onChange={(e) => {
            setAddress(e.target.value)
            if (errors.address) setErrors((p) => ({ ...p, address: undefined }))
          }}
          error={errors.address}
        />

        <Select label="Удобное время" value={slot} onChange={(e) => setSlot(e.target.value)}>
          {TIME_SLOTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>

        {hasGiftWrap && (
          <div className="animate-fade-in rounded-control border-2 border-brand bg-brand-soft p-4">
            <h3 className="flex items-center gap-2 font-head text-[15px] font-extrabold text-ink">
              <Gift size={17} className="text-brand" />
              Текст на открытку
            </h3>
            <p className="mt-1 text-[13px] font-medium text-ink-soft">
              В заказе есть подарочная упаковка — напишем от руки на открытке.
            </p>
            <Textarea
              className="mt-3"
              placeholder="С днём рождения, Соня! Расти счастливой."
              rows={2}
              maxLength={120}
              value={postcard}
              onChange={(e) => setPostcard(e.target.value)}
              hint={`${postcard.length} из 120 символов`}
            />
          </div>
        )}

        <OptionCards<Payment>
          label="Способ оплаты"
          value={payment}
          onChange={setPayment}
          options={PAYMENT_OPTIONS}
          columns={3}
        />

        <Button type="submit" size="lg" full disabled={sending || lines.length === 0}>
          {sending ? 'Отправляю…' : `Заказать за ${formatPrice(total)}`}
          {!sending && <Check size={18} />}
        </Button>
        <p className="text-center text-[13px] font-medium text-ink-soft">
          Нажимая кнопку, вы соглашаетесь на обработку персональных данных
        </p>
      </form>
    </Modal>
  )
}
