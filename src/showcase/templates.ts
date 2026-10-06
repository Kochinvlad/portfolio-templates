/** Название сайта — в превью ссылок и в подписи писем с заявками. */
export const SITE_NAME = 'UltraTeam'

export type TemplateMeta = {
  slug: string
  name: string
  /** Вымышленная компания из демо — подпись в рамке браузера на карточке. */
  brand: string
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
}

export const TEMPLATES: TemplateMeta[] = [
  {
    slug: 'sushi',
    brand: 'Сакура',
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
  },
  {
    slug: 'restaurant',
    brand: 'Терраса',
    name: 'Ресторан и кафе',
    tagline: 'Атмосфера и бронь столика',
    description:
      'Огонь на первом экране и меню в виде печатной карты. Галерея интерьера, отзывы гостей и бронь столика с выбором даты, времени и числа гостей.',
    themeClass: 'theme-restaurant',
    glyph: '🍽️',
    hue: 32,
    features: ['Бронь столика', 'Меню и винная карта', 'Галерея с лайтбоксом', 'Отзывы гостей'],
    price: 'от 38 000 ₽',
    term: '5–8 дней',
  },
  {
    slug: 'shop',
    brand: 'Технопорт',
    name: 'Интернет-магазин',
    tagline: 'Каталог, фильтры и заказ',
    description:
      'Магазин техники: поиск, фильтры по цене и брендам, сортировка, избранное, карточка товара и оформление заказа в два шага с валидацией.',
    themeClass: 'theme-shop',
    glyph: '🛍️',
    hue: 220,
    features: ['Поиск и фильтры', 'Избранное', 'Карточка товара', 'Заказ в 2 шага'],
    price: 'от 65 000 ₽',
    term: '10–14 дней',
  },
  {
    slug: 'toys',
    brand: 'Игроград',
    name: 'Магазин игрушек',
    tagline: 'Подбор по возрасту и подарки',
    description:
      'Магазин в духе деревянных кубиков: фильтр по возрасту и категориям, подбор подарка за три вопроса и подарочная упаковка при заказе.',
    themeClass: 'theme-toys',
    glyph: '🧸',
    hue: 218,
    features: ['Фильтр по возрасту', 'Подбор подарка', 'Подарочная упаковка', 'Корзина'],
    price: 'от 42 000 ₽',
    term: '7–10 дней',
  },
]

export function findTemplate(slug: string): TemplateMeta | undefined {
  return TEMPLATES.find((t) => t.slug === slug)
}
