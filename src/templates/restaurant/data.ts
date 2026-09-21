import type { Category, Product } from '../../lib/types'

export const REST_CATEGORIES: Category[] = [
  { id: 'starters', name: 'Закуски' },
  { id: 'mains', name: 'Основные блюда' },
  { id: 'pasta', name: 'Паста и ризотто' },
  { id: 'desserts', name: 'Десерты' },
  { id: 'wine', name: 'Вино' },
]

export const REST_MENU: Product[] = [
  // ---------- Закуски ----------
  {
    id: 'st-burrata',
    name: 'Буррата с томатами',
    description: 'Сливочная буррата, розовые томаты, базилик и оливковое масло первого отжима',
    price: 890,
    category: 'starters',
    glyph: '🧀',
    hue: 44,
    badge: 'Хит',
    tags: ['Вегетарианское'],
  },
  {
    id: 'st-tartare',
    name: 'Тартар из говядины',
    description: 'Вырезка, каперсы, корнишоны, перепелиный желток и хрустящие тосты',
    price: 1150,
    category: 'starters',
    glyph: '🥩',
    hue: 8,
  },
  {
    id: 'st-scallops',
    name: 'Гребешки на гриле',
    description: 'Морские гребешки, крем из цветной капусты, масло с трюфелем',
    price: 1390,
    category: 'starters',
    glyph: '🐚',
    hue: 32,
  },
  {
    id: 'st-hummus',
    name: 'Хумус с кедровыми орехами',
    description: 'Нутовая паста, тахини, обжаренные кедровые орехи и пита из печи',
    price: 590,
    category: 'starters',
    glyph: '🫓',
    hue: 40,
    tags: ['Вегетарианское'],
  },
  // ---------- Основные ----------
  {
    id: 'mn-ribeye',
    name: 'Рибай сухой выдержки',
    description: 'Мраморная говядина 28 дней выдержки, картофель конфи, соус демигляс',
    price: 2890,
    category: 'mains',
    glyph: '🥩',
    hue: 6,
    badge: 'Шеф рекомендует',
  },
  {
    id: 'mn-duck',
    name: 'Утиная грудка',
    description: 'Утка с вишнёвым соусом, пюре из пастернака и карамелизованным луком',
    price: 1690,
    category: 'mains',
    glyph: '🦆',
    hue: 18,
  },
  {
    id: 'mn-seabass',
    name: 'Сибас на углях',
    description: 'Целый сибас, запечённый на открытом огне, лимон, тимьян, овощи гриль',
    price: 1790,
    category: 'mains',
    glyph: '🐟',
    hue: 196,
  },
  {
    id: 'mn-lamb',
    name: 'Каре ягнёнка',
    description: 'Ягнёнок в травяной корочке, баклажаны с мятой, соус из красного вина',
    price: 2190,
    category: 'mains',
    glyph: '🍖',
    hue: 14,
  },
  {
    id: 'mn-vegetables',
    name: 'Овощи с огня',
    description: 'Сезонные овощи на углях, ромеско, лимонное масло и свежие травы',
    price: 890,
    category: 'mains',
    glyph: '🥬',
    hue: 116,
    tags: ['Вегетарианское'],
  },
]

/* ---------- Паста, десерты, вино ---------- */
export const REST_MENU_REST: Product[] = [
  {
    id: 'ps-carbonara',
    name: 'Карбонара',
    description: 'Спагетти, гуанчале, пекорино романо, желток и чёрный перец. Без сливок',
    price: 890,
    category: 'pasta',
    glyph: '🍝',
    hue: 46,
    badge: 'Хит',
  },
  {
    id: 'ps-truffle',
    name: 'Ризотто с белыми грибами',
    description: 'Карнароли, белые грибы, пармезан и капля трюфельного масла',
    price: 1090,
    category: 'pasta',
    glyph: '🍄',
    hue: 30,
    tags: ['Вегетарианское'],
  },
  {
    id: 'ps-vongole',
    name: 'Вонголе',
    description: 'Лингвини с моллюсками, белым вином, чесноком и петрушкой',
    price: 1290,
    category: 'pasta',
    glyph: '🦪',
    hue: 190,
  },
  {
    id: 'ds-tiramisu',
    name: 'Тирамису',
    description: 'Савоярди, маскарпоне, эспрессо и какао. Готовим порционно каждое утро',
    price: 590,
    category: 'desserts',
    glyph: '🍰',
    hue: 28,
    badge: 'Хит',
  },
  {
    id: 'ds-fondant',
    name: 'Шоколадный фондан',
    description: 'Тёплый шоколадный кекс с жидким центром и шариком ванильного мороженого',
    price: 650,
    category: 'desserts',
    glyph: '🍫',
    hue: 20,
  },
  {
    id: 'ds-pavlova',
    name: 'Павлова с ягодами',
    description: 'Хрустящий безе, взбитые сливки и сезонные ягоды',
    price: 620,
    category: 'desserts',
    glyph: '🍓',
    hue: 340,
    tags: ['Вегетарианское'],
  },
  {
    id: 'wn-chardonnay',
    name: 'Шардоне, Бургундия',
    description: 'Сухое белое. Яблоко, ваниль, лёгкая минеральность. Бокал 150 мл',
    price: 790,
    category: 'wine',
    glyph: '🥂',
    hue: 50,
  },
  {
    id: 'wn-barolo',
    name: 'Бароло, Пьемонт',
    description: 'Сухое красное. Вишня, кожа, табак. Плотное тело. Бокал 150 мл',
    price: 1190,
    category: 'wine',
    glyph: '🍷',
    hue: 348,
  },
  {
    id: 'wn-prosecco',
    name: 'Просекко Брют',
    description: 'Игристое сухое. Груша, цитрус, тонкий перляж. Бокал 150 мл',
    price: 690,
    category: 'wine',
    glyph: '🍾',
    hue: 54,
  },
]

export const REST_FULL_MENU: Product[] = [...REST_MENU, ...REST_MENU_REST]

/* ---------- Галерея ---------- */
export type GalleryItem = {
  id: string
  title: string
  caption: string
  glyph: string
  hue: number
  /** Крупная ячейка в сетке. */
  wide?: boolean
}

export const REST_GALLERY: GalleryItem[] = [
  {
    id: 'g-hall',
    title: 'Основной зал',
    caption: 'Сорок посадочных мест, высокие потолки и мягкий вечерний свет',
    glyph: '🕯️',
    hue: 34,
    wide: true,
  },
  {
    id: 'g-terrace',
    title: 'Летняя терраса',
    caption: 'Работает с мая по сентябрь, двадцать мест с видом на бульвар',
    glyph: '🌿',
    hue: 120,
  },
  {
    id: 'g-bar',
    title: 'Барная стойка',
    caption: 'Восемь мест у стойки — можно поужинать в одиночку и не скучать',
    glyph: '🍸',
    hue: 268,
  },
  {
    id: 'g-kitchen',
    title: 'Открытая кухня',
    caption: 'Видно, как работает бригада: ничего не прячем за стеной',
    glyph: '👨‍🍳',
    hue: 14,
  },
  {
    id: 'g-private',
    title: 'Приватная комната',
    caption: 'Отдельный зал на двенадцать человек для встреч и дней рождения',
    glyph: '🍾',
    hue: 300,
  },
  {
    id: 'g-dish',
    title: 'Подача',
    caption: 'Каждое блюдо собирают вручную перед подачей',
    glyph: '🍽️',
    hue: 40,
    wide: true,
  },
]

/* ---------- Отзывы ---------- */
export type Review = {
  id: string
  name: string
  role: string
  rating: number
  text: string
  initial: string
  hue: number
}

export const REST_REVIEWS: Review[] = [
  {
    id: 'rv-1',
    name: 'Анна К.',
    role: 'была на ужине вдвоём',
    rating: 5,
    text: 'Пришли без брони в пятницу вечером — посадили за барную стойку через десять минут. Сибас на углях лучший, что я ела в этом городе. Официант заметил, что мы никуда не спешим, и не торопил со счётом.',
    initial: 'А',
    hue: 340,
  },
  {
    id: 'rv-2',
    name: 'Дмитрий М.',
    role: 'отмечал день рождения',
    rating: 5,
    text: 'Бронировали приватную комнату на двенадцать человек. Согласовали меню заранее по телефону, всё вынесли вовремя и одновременно. Отдельное спасибо за то, что не поставили музыку громче, чем нужно.',
    initial: 'Д',
    hue: 220,
  },
  {
    id: 'rv-3',
    name: 'Ольга П.',
    role: 'приходит на бизнес-ланч',
    rating: 4,
    text: 'Хожу на обед пару раз в неделю. Готовят стабильно, порции нормальные, укладываюсь в час. Минус один балл за то, что в дождь на террасе прохладно, а внутри в обед бывает шумно.',
    initial: 'О',
    hue: 160,
  },
]

/** Доступные слоты для брони — используются в форме. */
export const REST_TIME_SLOTS = [
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
]

/** Слоты, которые «уже заняты» — чтобы показать реальную логику. */
export const REST_BUSY_SLOTS = ['19:00', '19:30', '20:00']
