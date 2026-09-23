/** Название сайта — в превью ссылок и в подписи писем с заявками. */
export const SITE_NAME = 'Витрина шаблонов'

export type TemplateMeta = {
  slug: string
  name: string
  tagline: string
  description: string
  /** CSS-класс темы из index.css */
  themeClass: string
  glyph: string
  hue: number
  /** Что умеет демо — показывается на карточке. */
  features: string[]
  /** Ориентировочный срок и цена — правьте под себя. */
  price: string
  term: string
  /** Тёмная ли тема шаблона (для превью-подложки). */
  dark: boolean
}

export const TEMPLATES: TemplateMeta[] = [
  {
    slug: 'sushi',
    name: 'Суши и роллы',
    tagline: 'Доставка с корзиной и промокодами',
    description:
      'Тёмный аппетитный лендинг: меню по категориям, конструктор сетов, корзина с промокодом, оформление доставки и акция с обратным отсчётом.',
    themeClass: 'theme-sushi',
    glyph: '🍣',
    hue: 355,
    features: ['Меню по категориям', 'Корзина + промокоды', 'Оформление доставки', 'Таймер акции'],
    price: 'от 45 000 ₽',
    term: '7–10 дней',
    dark: true,
  },
  {
    slug: 'restaurant',
    name: 'Ресторан и кафе',
    tagline: 'Атмосфера и бронь столика',
    description:
      'Светлый элегантный сайт: меню с фильтрами, галерея интерьера, отзывы гостей и форма брони столика с выбором даты, времени и числа гостей.',
    themeClass: 'theme-restaurant',
    glyph: '🍽️',
    hue: 32,
    features: ['Бронь столика', 'Меню и винная карта', 'Галерея с лайтбоксом', 'Отзывы гостей'],
    price: 'от 38 000 ₽',
    term: '5–8 дней',
    dark: false,
  },
  {
    slug: 'shop',
    name: 'Интернет-магазин',
    tagline: 'Каталог, фильтры, чекаут',
    description:
      'Магазин техники: поиск, фильтры по цене и брендам, сортировка, избранное, карточка товара и оформление заказа в два шага с валидацией.',
    themeClass: 'theme-shop',
    glyph: '🛍️',
    hue: 220,
    features: ['Поиск и фильтры', 'Избранное', 'Карточка товара', 'Чекаут в 2 шага'],
    price: 'от 65 000 ₽',
    term: '10–14 дней',
    dark: false,
  },
  {
    slug: 'toys',
    name: 'Магазин игрушек',
    tagline: 'Подбор по возрасту и подарки',
    description:
      'Яркий детский магазин: фильтр по возрасту и категориям, подбор подарка по параметрам, подарочная упаковка при заказе и весёлая анимация.',
    themeClass: 'theme-toys',
    glyph: '🧸',
    hue: 275,
    features: ['Фильтр по возрасту', 'Подбор подарка', 'Подарочная упаковка', 'Корзина'],
    price: 'от 42 000 ₽',
    term: '7–10 дней',
    dark: false,
  },
]

export function findTemplate(slug: string): TemplateMeta | undefined {
  return TEMPLATES.find((t) => t.slug === slug)
}
