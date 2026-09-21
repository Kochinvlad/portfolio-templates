import { useState, type FormEvent } from 'react'
import { AlertTriangle, Check, ChevronDown, Clock, Mail, Send } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '../lib/cn'
import { formatPhone, isPhoneComplete } from '../lib/format'
import { Button, buttonStyles } from '../ui/Button'
import { Input, Select, Textarea } from '../ui/Field'
import { Section, SectionHeading } from '../ui/Bits'
import { useToast } from '../ui/Toast'
import { TEMPLATES } from './templates'

/* ============================ FAQ ============================ */

const FAQ = [
  {
    q: 'Это готовые шаблоны или вы делаете с нуля?',
    a: 'Шаблон — отправная точка: структура, компоненты и логика уже написаны и проверены. Под ваш проект меняются цвета, шрифты, тексты, фотографии и набор блоков. Так выходит быстрее и дешевле, чем рисовать всё заново, а результат не выглядит одинаково у всех.',
  },
  {
    q: 'Можно ли принимать настоящие заказы?',
    a: 'В демо заказы никуда не уходят — это витрина. Для реальных заказов подключается бэкенд: заявка падает вам в Telegram или на почту, заказы складываются в базу, появляется админка. Это отдельный этап, обсуждаем его после запуска витрины.',
  },
  {
    q: 'Сколько стоит поддержка?',
    a: 'Первый месяц после запуска — бесплатно: правлю опечатки, меняю цены, чиню всё, что всплывёт. Дальше — почасово или небольшим ежемесячным пакетом, зависит от того, как часто нужно обновлять контент.',
  },
  {
    q: 'Кто делает тексты и фотографии?',
    a: 'Фотографии — с вашей стороны, это критично: стоковые картинки еды видно сразу, и они снижают доверие. Тексты могу написать по вашим тезисам. В демо вместо фотографий стоят сгенерированные иллюстрации — в реальном проекте на их место встают ваши снимки.',
  },
  {
    q: 'Что с хостингом и доменом?',
    a: 'Статический сайт бесплатно живёт на Vercel или Netlify — платить нужно только за домен, это примерно 200–1500 ₽ в год в зависимости от зоны. Настройку беру на себя, аккаунты регистрируем на вас, чтобы доступы остались у вас.',
  },
  {
    q: 'А если мне не понравится результат?',
    a: 'Работаю поэтапно. После прототипа вы видите живой сайт и решаете, идём дальше или нет. Если на этом этапе не нравится — расходимся, предоплата за прототип остаётся у меня, остальное не платите.',
  },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-line">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-head text-[17px] font-bold text-ink">{q}</span>
        <ChevronDown
          size={20}
          className={cn(
            'shrink-0 text-ink-soft transition-transform duration-300',
            open && 'rotate-180 text-brand',
          )}
        />
      </button>
      <div
        className={cn(
          'grid transition-all duration-300 ease-out',
          open ? 'grid-rows-[1fr] pb-5 opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden">
          <p className="pr-8 text-[15px] leading-relaxed text-ink-soft">{a}</p>
        </div>
      </div>
    </div>
  )
}

export function FaqSection() {
  return (
    <Section id="faq" className="border-t border-line py-16 sm:py-24" containerClassName="max-w-3xl">
      <SectionHeading eyebrow="Вопросы" title="Что обычно спрашивают" />
      <div className="mt-10">
        {FAQ.map((item) => (
          <FaqItem key={item.q} {...item} />
        ))}
      </div>
    </Section>
  )
}

/* ============================ КОНТАКТЫ ============================ */

/** Контакты. Меняются здесь — и сразу везде по странице. */
const EMAIL = 'kochin.web@gmail.com'

/**
 * Ключ Web3Forms — сервиса, который пересылает заявки на почту.
 * Он публичный по своей природе: указывает лишь, на какой адрес доставить
 * письмо, и ничего не открывает в почтовом ящике. Получить свой:
 * web3forms.com → ввести почту → ключ придёт письмом.
 */
const FORM_ACCESS_KEY = 'ЗАМЕНИТЬ_НА_КЛЮЧ'
const FORM_ENDPOINT = 'https://api.web3forms.com/submit'

const CONTACTS = [
  { icon: Mail, label: 'Почта', value: EMAIL, href: `mailto:${EMAIL}` },
  { icon: Clock, label: 'Отвечаю', value: 'Пн–Пт, 10:00–20:00 МСК', href: undefined },
]

type ContactErrors = Partial<Record<'name' | 'contact' | 'message', string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function ContactSection() {
  const { toast } = useToast()
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [topic, setTopic] = useState(TEMPLATES[0].name)
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<ContactErrors>({})
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  // Заявку не удалось отправить — показываем прямые контакты, чтобы не потерять обращение
  const [failed, setFailed] = useState(false)

  function validate(): ContactErrors {
    const next: ContactErrors = {}
    if (name.trim().length < 2) next.name = 'Введите имя — хотя бы 2 символа'
    if (!EMAIL_RE.test(contact.trim()) && !isPhoneComplete(contact)) {
      next.contact = 'Нужна почта или телефон из 11 цифр'
    }
    if (message.trim().length < 10) next.message = 'Опишите задачу — от 10 символов'
    return next
  }

  /** Письмо со всеми полями — запасной путь, если сервис не ответил. */
  function mailtoFallback(): string {
    const body = `Имя: ${name}
Контакт: ${contact}
Интересует шаблон: ${topic}

${message}`
    return `mailto:${EMAIL}?subject=${encodeURIComponent(
      `Заявка с сайта: ${topic}`,
    )}&body=${encodeURIComponent(body)}`
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) {
      toast('Проверьте поля формы', 'error')
      return
    }

    setSending(true)
    setFailed(false)

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: FORM_ACCESS_KEY,
          subject: `Заявка с сайта: ${topic}`,
          from_name: 'Витрина шаблонов',
          Имя: name,
          Контакт: contact,
          'Интересует шаблон': topic,
          Сообщение: message,
        }),
      })

      const result: { success?: boolean; message?: string } = await response.json()
      if (!response.ok || !result.success) {
        throw new Error(result.message ?? `Сервис ответил ${response.status}`)
      }

      setSent(true)
      toast('Заявка отправлена — отвечу в течение дня')
    } catch {
      // Сервис может быть недоступен или заблокирован. Молча «терять» заявку нельзя:
      // показываем прямые контакты и готовое письмо.
      setFailed(true)
      toast('Не удалось отправить — напишите напрямую', 'error')
    } finally {
      setSending(false)
    }
  }

  function reset() {
    setSent(false)
    setName('')
    setContact('')
    setMessage('')
    setErrors({})
  }

  if (sent) {
    return (
      <Section
        id="contact"
        className="border-t border-line py-16 sm:py-24"
        containerClassName="max-w-2xl"
      >
        <div className="rounded-card border border-line bg-surface-2 p-8 text-center sm:p-10">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500/15 text-emerald-400">
            <Check size={30} />
          </span>
          <h2 className="mt-5 font-head text-2xl font-bold text-ink">Заявка принята</h2>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-ink-soft">
            {name}, спасибо. Отвечу в течение рабочего дня и пришлю несколько уточняющих вопросов
            по проекту «{topic}».
          </p>
          <Button variant="outline" className="mt-6" onClick={reset}>
            Отправить ещё одну
          </Button>
        </div>
      </Section>
    )
  }

  return (
    <Section id="contact" className="border-t border-line py-16 sm:py-24">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="Контакты"
            title="Расскажите, что нужно"
            subtitle="Напишите пару предложений о бизнесе и о том, что должен делать сайт. Отвечу в течение рабочего дня и назову срок и цену."
          />
          <ul className="mt-8 flex flex-col gap-3">
            {CONTACTS.map(({ icon: Icon, label, value, href }) => {
              // Почту и мессенджер делаем кликабельными: с телефона это одно касание
              const content = (
                <>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                    <Icon size={18} />
                  </span>
                  <span>
                    <span className="block text-[13px] text-ink-soft">{label}</span>
                    <span className="block font-semibold text-ink">{value}</span>
                  </span>
                </>
              )
              const box =
                'flex items-center gap-4 rounded-card border border-line bg-surface-2 px-5 py-4'

              return (
                <li key={label}>
                  {href ? (
                    <a href={href} className={`${box} transition hover:border-brand`}>
                      {content}
                    </a>
                  ) : (
                    <div className={box}>{content}</div>
                  )}
                </li>
              )
            })}
          </ul>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-5 rounded-card border border-line bg-surface-2 p-6 sm:p-8"
        >
          <Input
            label="Как вас зовут"
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
            label="Почта или телефон"
            placeholder="ivan@mail.ru или +7 (999) 123-45-67"
            required
            value={contact}
            onChange={(e) => {
              const raw = e.target.value
              const digitsOnly = raw.replace(/[\s()+-]/g, '')
              // если введены только цифры — подставляем телефонную маску
              setContact(/^\d+$/.test(digitsOnly) && digitsOnly.length > 1 ? formatPhone(raw) : raw)
              if (errors.contact) setErrors((p) => ({ ...p, contact: undefined }))
            }}
            error={errors.contact}
          />
          <Select
            label="Какой шаблон интересен"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          >
            {TEMPLATES.map((t) => (
              <option key={t.slug} value={t.name}>
                {t.name}
              </option>
            ))}
            <option value="Свой проект">Свой проект — расскажу в сообщении</option>
          </Select>
          <Textarea
            label="Что нужно сделать"
            placeholder="Суши-бар в Казани, нужен сайт с меню и доставкой. Фотографии есть, текстов нет."
            rows={4}
            required
            value={message}
            onChange={(e) => {
              setMessage(e.target.value)
              if (errors.message) setErrors((p) => ({ ...p, message: undefined }))
            }}
            error={errors.message}
          />
          {failed && (
            <div className="animate-fade-in rounded-control border border-red-500/40 bg-red-500/10 p-4">
              <h3 className="flex items-center gap-2 text-[15px] font-bold text-ink">
                <AlertTriangle size={17} className="shrink-0 text-red-400" />
                Заявка не ушла
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
                Сервис отправки не ответил — такое бывает. Ваше сообщение не потерялось: нажмите
                кнопку ниже, откроется письмо с уже заполненным текстом. Или напишите напрямую
                на {EMAIL}.
              </p>
              <a href={mailtoFallback()} className={buttonStyles('outline', 'sm', 'mt-3')}>
                <Mail size={16} />
                Открыть письмо
              </a>
            </div>
          )}

          <Button type="submit" size="lg" full disabled={sending}>
            {sending ? 'Отправляю…' : 'Отправить заявку'}
            {!sending && <Send size={17} />}
          </Button>
          <p className="text-center text-[13px] text-ink-soft">
            Нажимая кнопку, вы соглашаетесь на обработку персональных данных
          </p>
        </form>
      </div>
    </Section>
  )
}

/* ============================ ПОДВАЛ ============================ */

export function ShowcaseFooter() {
  return (
    <footer className="border-t border-line px-4 py-10 sm:px-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="font-head text-[15px] font-bold">
            Витрина<span className="text-brand">.</span>шаблонов
          </span>
          <p className="mt-1 text-[13px] text-ink-soft">
            Демонстрационный проект. Все компании, цены и контакты — вымышленные.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          {TEMPLATES.map((t) => (
            <Link
              key={t.slug}
              to={`/${t.slug}`}
              className="text-[14px] font-medium text-ink-soft transition hover:text-brand"
            >
              {t.name}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
