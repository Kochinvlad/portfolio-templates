import { useState } from 'react'
import { cn } from '../lib/cn'

type Props = {
  glyph: string
  /** Оттенок 0–360 — определяет цвет запасной подложки. */
  hue: number
  /** Адрес фотографии. Если её нет, рисуется подложка с эмодзи. */
  photo?: string
  /** Описание для скринридеров. Пусто — картинка считается декоративной. */
  alt?: string
  className?: string
  /** Размер эмодзи на запасной подложке. */
  scale?: 'sm' | 'md' | 'lg' | 'xl'
  /** Затемнённая подложка — для тёмных тем. */
  dark?: boolean
}

const scales = {
  sm: 'text-4xl',
  md: 'text-6xl',
  lg: 'text-7xl sm:text-8xl',
  xl: 'text-8xl sm:text-9xl',
}

/**
 * Изображение товара.
 *
 * Показывает фотографию из public/photos, а если её нет или она не загрузилась —
 * генеративную подложку с эмодзи. Так карточка не разваливается ни при добавлении
 * нового товара без снимка, ни при проблемах с сетью.
 *
 * Чтобы поставить свои фотографии, положите файлы в public/photos с именем
 * по id товара и выполните: node scripts/build-photo-manifest.mjs
 */
export function ProductArt({ glyph, hue, photo, alt = '', className, scale = 'md', dark = false }: Props) {
  const [failed, setFailed] = useState(false)
  const showPhoto = Boolean(photo) && !failed

  if (showPhoto) {
    return (
      <div className={cn('relative overflow-hidden bg-surface-3', className)}>
        <img
          src={photo}
          alt={alt}
          aria-hidden={alt ? undefined : true}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      </div>
    )
  }

  const from = dark ? `hsl(${hue} 55% 26%)` : `hsl(${hue} 78% 66%)`
  const to = dark ? `hsl(${(hue + 32) % 360} 60% 14%)` : `hsl(${(hue + 32) % 360} 70% 48%)`

  return (
    <div
      aria-hidden="true"
      className={cn('relative overflow-hidden isolate grid place-items-center', className)}
      style={{ background: `linear-gradient(140deg, ${from} 0%, ${to} 100%)` }}
    >
      <div
        className="absolute -left-[18%] -top-[26%] h-[70%] w-[70%] rounded-full blur-2xl opacity-45"
        style={{ background: `hsl(${(hue + 50) % 360} 95% 80%)` }}
      />
      <div
        className="absolute -right-[14%] bottom-[-22%] h-[60%] w-[60%] rounded-full blur-2xl opacity-30"
        style={{ background: `hsl(${(hue + 300) % 360} 90% 72%)` }}
      />
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
          backgroundSize: '14px 14px',
          color: '#ffffff',
        }}
      />
      <div className="absolute inset-[14%] rounded-full border border-white/20" />
      <span
        className={cn(
          'relative z-10 leading-none drop-shadow-[0_6px_18px_rgba(0,0,0,0.35)]',
          scales[scale],
        )}
        style={{
          fontFamily: '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif',
        }}
      >
        {glyph}
      </span>
    </div>
  )
}
