// Файл создаётся скриптом scripts/build-snapshots.mjs — править руками не нужно.

/**
 * Что на страницах шаблонов прилипает при прокрутке (шапка, панель фильтров) — для «полёта»
 * на витрине. Ключ — имя длинного снимка из public/previews, сам снимок снят без этих
 * элементов. Все размеры — в пикселях снимка: width — его ширина; у слоя x и y — где он стоит
 * на странице, stick — на каком расстоянии от верха окна останавливается, limit — ниже какой
 * точки страницы не опускается его верхний край (дальше слой уезжает вместе с родителем),
 * z — его z-index.
 */
export type StickyLayer = {
  file: string
  x: number
  y: number
  width: number
  stick: number
  limit: number
  z: number
}

export const STICKY_LAYERS: Record<string, { width: number; layers: StickyLayer[] }> = {
  'sushi-page': {
    width: 1200,
    layers: [
      { file: 'sushi-page-sticky-1', x: 0, y: 0, width: 1200, stick: 0, limit: 4321.72, z: 50 },
    ],
  },
  'restaurant-page': {
    width: 1200,
    layers: [
      { file: 'restaurant-page-sticky-1', x: 0, y: 0, width: 1200, stick: 0, limit: 3750.75, z: 50 },
    ],
  },
  'shop-page': {
    width: 1200,
    layers: [
      { file: 'shop-page-sticky-1', x: 0, y: 0, width: 1200, stick: 0, limit: 3068.22, z: 50 },
      { file: 'shop-page-sticky-2', x: 183.61, y: 762.29, width: 180.72, stick: 101.2, limit: 2183.86, z: 0 },
    ],
  },
  'toys-page': {
    width: 1200,
    layers: [
      { file: 'toys-page-sticky-1', x: 0, y: 0, width: 1200, stick: 0, limit: 3753.31, z: 50 },
    ],
  },
  'sushi-phone': {
    width: 468,
    layers: [
      { file: 'sushi-phone-sticky-1', x: 0, y: 0, width: 468, stick: 0, limit: 15808.69, z: 50 },
    ],
  },
  'restaurant-phone': {
    width: 468,
    layers: [
      { file: 'restaurant-phone-sticky-1', x: 0, y: 0, width: 468, stick: 0, limit: 9334.95, z: 50 },
    ],
  },
  'shop-phone': {
    width: 468,
    layers: [
      { file: 'shop-phone-sticky-1', x: 0, y: 0, width: 468, stick: 0, limit: 12696.69, z: 50 },
    ],
  },
  'toys-phone': {
    width: 468,
    layers: [
      { file: 'toys-phone-sticky-1', x: 0, y: 0, width: 468, stick: 0, limit: 14183.85, z: 50 },
    ],
  },
}
