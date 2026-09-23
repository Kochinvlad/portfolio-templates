import { Baby, Bike, Gamepad2, Microscope, Puzzle, type LucideIcon } from 'lucide-react'
import type { Category, Product } from '../../lib/types'
import type { PromoCode } from '../../store/cart'

// Обложка категории — фото одной из её игрушек
export const TOYS_CATEGORIES: Category[] = [
  { id: 'constructors', name: 'Конструкторы', coverId: 'ct-blocks' },
  { id: 'soft', name: 'Мягкие игрушки', coverId: 'sf-bear' },
  { id: 'board', name: 'Настольные игры', coverId: 'bd-cards' },
  { id: 'creative', name: 'Творчество', coverId: 'cr-paint' },
  { id: 'transport', name: 'Транспорт', coverId: 'tr-cars' },
  { id: 'outdoor', name: 'Для улицы', coverId: 'ot-kite' },
]

export type AgeGroup = {
  id: string
  label: string
  min: number
  max: number
  icon: LucideIcon
}

export const TOYS_AGE_GROUPS: AgeGroup[] = [
  { id: 'baby', label: '0–3 года', min: 0, max: 3, icon: Baby },
  { id: 'preschool', label: '3–6 лет', min: 3, max: 6, icon: Puzzle },
  { id: 'junior', label: '6–9 лет', min: 6, max: 9, icon: Bike },
  { id: 'middle', label: '9–12 лет', min: 9, max: 12, icon: Microscope },
  { id: 'teen', label: '12+ лет', min: 12, max: 16, icon: Gamepad2 },
]

export const TOYS_PROMO_CODES: Record<string, PromoCode> = {
  TOY10: { percent: 10, label: 'Скидка 10 % на всё' },
  PODAROK15: { percent: 15, label: 'Подарочная скидка 15 %' },
}

export const TOYS_DELIVERY_FEE = 300
export const TOYS_FREE_DELIVERY_FROM = 3000
/** Надбавка за подарочную упаковку. */
export const TOYS_GIFT_WRAP_PRICE = 250

export const TOYS_PRODUCTS: Product[] = [
  {
    id: 'ct-castle',
    name: 'Конструктор «Замок дракона»',
    description: 'Восемьсот деталей, три башни, подвижный мост и фигурка дракона. Инструкция с картинками.',
    price: 4990,
    oldPrice: 5990,
    category: 'constructors',
    glyph: '🏰',
    hue: 270,
    ageMin: 6,
    ageMax: 12,
    badge: 'Хит',
    rating: 4.9,
    reviews: 284,
  },
  {
    id: 'ct-blocks',
    name: 'Мягкие кубики «Первый город»',
    description: 'Сорок крупных кубиков из мягкого пластика. Не бьются, не имеют острых углов, моются.',
    price: 1890,
    category: 'constructors',
    glyph: '🧱',
    hue: 18,
    ageMin: 1,
    ageMax: 4,
    rating: 4.7,
    reviews: 156,
  },
  {
    id: 'ct-robot',
    name: 'Робот-конструктор «Шестерёнка»',
    description: 'Собирается в шесть разных роботов, ездит и мигает глазами. Питание от батареек.',
    price: 3490,
    category: 'constructors',
    glyph: '🤖',
    hue: 200,
    ageMin: 8,
    ageMax: 14,
    badge: 'Новинка',
    rating: 4.8,
    reviews: 93,
  },
  {
    id: 'sf-bear',
    name: 'Медведь Барни, 60 см',
    description: 'Большой плюшевый медведь с вышитыми глазами — безопасно даже для самых маленьких.',
    price: 2690,
    category: 'soft',
    glyph: '🧸',
    hue: 30,
    ageMin: 0,
    ageMax: 10,
    badge: 'Хит',
    rating: 4.9,
    reviews: 412,
  },
  {
    id: 'sf-fox',
    name: 'Лисёнок Рыжик',
    description: 'Мягкая игрушка-обнимашка с утяжелителем внутри. Помогает малышам засыпать.',
    price: 1490,
    oldPrice: 1890,
    category: 'soft',
    glyph: '🦊',
    hue: 22,
    ageMin: 0,
    ageMax: 8,
    rating: 4.8,
    reviews: 221,
  },
  {
    id: 'sf-whale',
    name: 'Кит-ночник',
    description: 'Плюшевый кит с мягкой подсветкой и белым шумом. Выключается через 20 минут.',
    price: 2290,
    category: 'soft',
    glyph: '🐳',
    hue: 205,
    ageMin: 0,
    ageMax: 6,
    rating: 4.7,
    reviews: 134,
  },
]

export const TOYS_PRODUCTS_GAMES: Product[] = [
  {
    id: 'bd-quest',
    name: 'Настольная игра «Остров сокровищ»',
    description: 'Приключенческая игра на 2–4 игроков. Одна партия — примерно 40 минут.',
    price: 2990,
    category: 'board',
    glyph: '🗺️',
    hue: 160,
    ageMin: 7,
    ageMax: 14,
    rating: 4.8,
    reviews: 178,
  },
  {
    id: 'bd-cards',
    name: 'Карточная игра «Зверополис»',
    description: 'Быстрая игра на внимательность. Правила объясняются за две минуты, партия — за десять.',
    price: 890,
    category: 'board',
    glyph: '🃏',
    hue: 340,
    ageMin: 5,
    ageMax: 12,
    badge: 'Хит',
    rating: 4.7,
    reviews: 305,
  },
  {
    id: 'bd-logic',
    name: 'Головоломка «Лабиринт шаров»',
    description: 'Сто уровней сложности в одной коробке. Развивает пространственное мышление.',
    price: 1690,
    category: 'board',
    glyph: '🧩',
    hue: 258,
    ageMin: 9,
    ageMax: 16,
    rating: 4.6,
    reviews: 87,
  },
  {
    id: 'cr-paint',
    name: 'Набор для рисования «Палитра»',
    description: 'Сорок восемь фломастеров, акварель, кисти и альбом. Всё в жёстком кейсе.',
    price: 2190,
    oldPrice: 2690,
    category: 'creative',
    glyph: '🎨',
    hue: 320,
    ageMin: 4,
    ageMax: 12,
    rating: 4.8,
    reviews: 263,
  },
  {
    id: 'cr-slime',
    name: 'Лаборатория слаймов',
    description: 'Всё для шести слаймов: блёстки, красители, ароматизаторы и понятная инструкция.',
    price: 1290,
    category: 'creative',
    glyph: '🧪',
    hue: 120,
    ageMin: 6,
    ageMax: 12,
    badge: 'Новинка',
    rating: 4.5,
    reviews: 341,
  },
  {
    id: 'cr-clay',
    name: 'Мягкий пластилин, 24 цвета',
    description: 'Не липнет к рукам и не пачкает одежду. Застывает на воздухе за сутки.',
    price: 790,
    category: 'creative',
    glyph: '🪀',
    hue: 45,
    ageMin: 3,
    ageMax: 9,
    rating: 4.6,
    reviews: 198,
  },
]

export const TOYS_PRODUCTS_REST: Product[] = [
  {
    id: 'tr-excavator',
    name: 'Экскаватор на радиоуправлении',
    description: 'Ковш поднимается и поворачивается, кабина крутится на 360°. Работает 40 минут.',
    price: 3890,
    category: 'transport',
    glyph: '🚜',
    hue: 45,
    ageMin: 5,
    ageMax: 12,
    rating: 4.7,
    reviews: 142,
  },
  {
    id: 'tr-railway',
    name: 'Железная дорога «Экспресс»',
    description: 'Три метра путей, два вагона, мост и тоннель. Локомотив идёт на батарейках.',
    price: 4590,
    category: 'transport',
    glyph: '🚂',
    hue: 10,
    ageMin: 4,
    ageMax: 10,
    badge: 'Хит',
    rating: 4.8,
    reviews: 217,
  },
  {
    id: 'tr-cars',
    name: 'Набор машинок, 12 штук',
    description: 'Металлические машинки в масштабе 1:64. Колёса крутятся, двери открываются.',
    price: 1590,
    category: 'transport',
    glyph: '🚗',
    hue: 220,
    ageMin: 3,
    ageMax: 9,
    rating: 4.5,
    reviews: 389,
  },
  {
    id: 'ot-kite',
    name: 'Воздушный змей «Дракон»',
    description: 'Полтора метра в размахе, прочный каркас и катушка с леской 50 метров.',
    price: 1190,
    category: 'outdoor',
    glyph: '🪁',
    hue: 190,
    ageMin: 6,
    ageMax: 14,
    rating: 4.4,
    reviews: 76,
  },
  {
    id: 'ot-scooter',
    name: 'Самокат «Ветерок»',
    description: 'Трёхколёсный самокат с регулируемой ручкой и светящимися колёсами. До 50 кг.',
    price: 5490,
    oldPrice: 6490,
    category: 'outdoor',
    glyph: '🛴',
    hue: 290,
    ageMin: 3,
    ageMax: 8,
    rating: 4.8,
    reviews: 254,
  },
  {
    id: 'ot-bubbles',
    name: 'Генератор мыльных пузырей',
    description: 'Выпускает до пятисот пузырей в минуту. Раствор в комплекте, работает от батареек.',
    price: 990,
    category: 'outdoor',
    glyph: '🫧',
    hue: 180,
    ageMin: 2,
    ageMax: 8,
    rating: 4.3,
    reviews: 168,
    outOfStock: true,
  },
]

/** Полный каталог игрушек. */
export const TOYS_CATALOG: Product[] = [
  ...TOYS_PRODUCTS,
  ...TOYS_PRODUCTS_GAMES,
  ...TOYS_PRODUCTS_REST,
]

/** Интересы для подбора подарка. id совпадает с категорией — обложка берётся оттуда же. */
export const TOYS_INTERESTS = [
  { id: 'constructors', label: 'Строить и собирать' },
  { id: 'soft', label: 'Обнимать и играть в дом' },
  { id: 'board', label: 'Играть с семьёй' },
  { id: 'creative', label: 'Рисовать и мастерить' },
  { id: 'transport', label: 'Машинки и техника' },
  { id: 'outdoor', label: 'Бегать на улице' },
].map((interest) => ({
  ...interest,
  coverId: TOYS_CATEGORIES.find((cat) => cat.id === interest.id)?.coverId,
}))

/** Диапазоны бюджета для подбора подарка. */
export const TOYS_BUDGETS = [
  { id: 'low', label: 'До 1500 ₽', min: 0, max: 1500 },
  { id: 'mid', label: '1500 – 3000 ₽', min: 1500, max: 3000 },
  { id: 'high', label: 'От 3000 ₽', min: 3000, max: Infinity },
]

/**
 * Подходит ли игрушка возрастной группе.
 *
 * Проверять простое пересечение диапазонов бесполезно: «медведь 0–10 лет»
 * пересекается почти с каждой группой, и фильтр перестаёт отсекать хоть что-то.
 * Поэтому требуем, чтобы середина выбранной группы попадала в диапазон товара.
 */
export function matchesAgeGroup(product: Product, group: AgeGroup): boolean {
  const middle = (group.min + group.max) / 2
  const min = product.ageMin ?? 0
  const max = product.ageMax ?? 18
  return middle >= min && middle <= max
}
