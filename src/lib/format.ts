const rub = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
})

/** 1290 → «1 290 ₽» */
export function formatPrice(value: number): string {
  return rub.format(value)
}

/** 1290 → «1 290» (без символа валюты) */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('ru-RU').format(value)
}

/**
 * Русское склонение: plural(5, ['товар', 'товара', 'товаров']) → «товаров»
 */
export function plural(count: number, forms: [string, string, string]): string {
  const n = Math.abs(count) % 100
  const n1 = n % 10
  if (n > 10 && n < 20) return forms[2]
  if (n1 > 1 && n1 < 5) return forms[1]
  if (n1 === 1) return forms[0]
  return forms[2]
}

/** 5 → «5 товаров» */
export function pluralWithCount(count: number, forms: [string, string, string]): string {
  return `${formatNumber(count)} ${plural(count, forms)}`
}

/** Маска телефона: 79991234567 → «+7 (999) 123-45-67» */
export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').replace(/^8/, '7').slice(0, 11)
  if (!digits) return ''
  const rest = digits.startsWith('7') ? digits.slice(1) : digits
  const parts = [
    rest.slice(0, 3),
    rest.slice(3, 6),
    rest.slice(6, 8),
    rest.slice(8, 10),
  ].filter(Boolean)
  let out = '+7'
  if (parts[0]) out += ` (${parts[0]}`
  if (parts[0] && parts[0].length === 3) out += ')'
  if (parts[1]) out += ` ${parts[1]}`
  if (parts[2]) out += `-${parts[2]}`
  if (parts[3]) out += `-${parts[3]}`
  return out
}

/** Проверка, что в телефоне набрано 11 цифр. */
export function isPhoneComplete(raw: string): boolean {
  return raw.replace(/\D/g, '').replace(/^8/, '7').length === 11
}

/** Дата в формате «пт, 25 сентября» */
export function formatDateLong(iso: string): string {
  if (!iso) return ''
  const d = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(d.getTime())) return ''
  return new Intl.DateTimeFormat('ru-RU', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  }).format(d)
}

/** ISO-дата сегодняшнего дня — для минимума в <input type="date">. */
export function todayISO(): string {
  const d = new Date()
  const tz = d.getTimezoneOffset() * 60_000
  return new Date(d.getTime() - tz).toISOString().slice(0, 10)
}

/** Псевдослучайный номер заказа — для экрана «успех». */
export function makeOrderNumber(): string {
  return String(Math.floor(100_000 + Math.random() * 900_000))
}
