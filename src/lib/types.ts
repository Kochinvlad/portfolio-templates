/** Общие типы, которые переиспользуют все шаблоны. */

import type { LucideIcon } from 'lucide-react'

export type Product = {
  id: string
  name: string
  description: string
  /** Цена в рублях (целое число, без копеек). */
  price: number
  /** Старая цена — если есть, рисуется зачёркнутой. */
  oldPrice?: number
  category: string
  /** Эмодзи-глиф для генеративной иллюстрации. */
  glyph: string
  /** Оттенок 0–360 для градиента подложки. */
  hue: number
  badge?: string
  tags?: string[]
  weight?: string
  rating?: number
  reviews?: number
  /** Товара нет в наличии — кнопка блокируется. */
  outOfStock?: boolean
  /** Производитель — используется в фильтрах магазина. */
  brand?: string
  /** Характеристики для карточки товара. */
  specs?: Array<{ label: string; value: string }>
  /** Возрастная группа — используется в магазине игрушек. */
  ageMin?: number
  ageMax?: number
}

/**
 * Значок категории: либо иконка, либо фото товара-представителя.
 * Технику узнают по силуэту — ей подходят иконки. Еду и игрушки по силуэту
 * не отличить, поэтому у них маленькое круглое фото, как в приложениях доставки.
 */
export type CategoryMark = {
  icon?: LucideIcon
  /** id товара, чьё фото служит обложкой категории. */
  coverId?: string
}

export type Category = CategoryMark & {
  id: string
  name: string
}

/** Позиция в корзине. */
export type CartLine = {
  /** Уникальный ключ позиции: id товара + вариант, если он есть. */
  key: string
  product: Product
  qty: number
  /** Человекочитаемое описание варианта, например «Подарочная упаковка». */
  variant?: string
  /** Надбавка к цене за вариант. */
  variantPrice?: number
}
