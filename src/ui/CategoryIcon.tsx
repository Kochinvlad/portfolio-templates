import type { CategoryMark } from '../lib/types'
import { cn } from '../lib/cn'
import { photoUrl } from '../lib/photos'

type Props = CategoryMark & {
  /** Размер в пикселях — и для иконки, и для круглого фото. */
  size?: number
  className?: string
}

/**
 * Значок категории: иконка или маленькое круглое фото товара.
 * Всегда декоративный — рядом стоит подпись, поэтому скрыт от экранных читалок.
 */
export function CategoryIcon({ icon: Icon, coverId, size = 20, className }: Props) {
  if (Icon) {
    return <Icon size={size} strokeWidth={1.75} aria-hidden="true" className={cn('shrink-0', className)} />
  }

  const src = coverId ? photoUrl(coverId) : undefined
  if (!src) return null

  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      className={cn('shrink-0 rounded-full object-cover', className)}
      style={{ width: size, height: size }}
    />
  )
}
