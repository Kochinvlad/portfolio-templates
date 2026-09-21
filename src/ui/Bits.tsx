import { Minus, Plus, Star } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

/** Счётчик количества «− 1 +». */
export function QtyStepper({
  value,
  onChange,
  min = 0,
  max = 99,
  size = 'md',
  label = 'Количество',
}: {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  size?: 'sm' | 'md'
  label?: string
}) {
  const btn =
    'grid place-items-center rounded-full border border-line text-ink transition ' +
    'hover:border-brand hover:text-brand disabled:opacity-35 disabled:hover:border-line ' +
    'disabled:hover:text-ink disabled:cursor-not-allowed cursor-pointer'
  const dim = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'
  const iconSize = size === 'sm' ? 14 : 17

  return (
    <div className="inline-flex items-center gap-2" role="group" aria-label={label}>
      <button
        type="button"
        className={cn(btn, dim)}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Уменьшить количество"
      >
        <Minus size={iconSize} />
      </button>
      <span
        className={cn(
          'text-center font-bold tabular-nums text-ink',
          size === 'sm' ? 'w-6 text-sm' : 'w-8 text-base',
        )}
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        className={cn(btn, dim)}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Увеличить количество"
      >
        <Plus size={iconSize} />
      </button>
    </div>
  )
}

/** Звёздный рейтинг. */
export function Rating({
  value,
  reviews,
  size = 14,
  className,
}: {
  value: number
  reviews?: number
  size?: number
  className?: string
}) {
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className="flex" aria-label={`Рейтинг ${value} из 5`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={size}
            className={i <= Math.round(value) ? 'text-accent' : 'text-ink-soft/35'}
            fill={i <= Math.round(value) ? 'currentColor' : 'none'}
            strokeWidth={2}
          />
        ))}
      </div>
      <span className="text-sm font-semibold text-ink">{value.toFixed(1)}</span>
      {reviews !== undefined && (
        <span className="text-sm text-ink-soft">· {reviews}</span>
      )}
    </div>
  )
}

/** Небольшая цветная плашка: «Хит», «−20 %», «Новинка». */
export function Badge({
  children,
  tone = 'brand',
  className,
}: {
  children: ReactNode
  tone?: 'brand' | 'accent' | 'neutral' | 'sale'
  className?: string
}) {
  const tones = {
    brand: 'bg-brand text-on-brand',
    accent: 'bg-accent text-[#20160a]',
    neutral: 'bg-surface-3 text-ink',
    sale: 'bg-red-500 text-white',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

/** Секция страницы с центрирующим контейнером и появлением при скролле. */
export function Section({
  children,
  className,
  containerClassName,
  id,
  reveal = true,
}: {
  children: ReactNode
  className?: string
  containerClassName?: string
  id?: string
  reveal?: boolean
}) {
  return (
    <section id={id} className={cn('px-4 sm:px-6', className)}>
      <div className={cn('mx-auto w-full max-w-6xl', reveal && 'reveal', containerClassName)}>
        {children}
      </div>
    </section>
  )
}

/** Заголовок секции: надзаголовок + H2 + подпись. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  className,
}: {
  eyebrow?: string
  title: ReactNode
  subtitle?: ReactNode
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      {eyebrow && (
        <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand">
          {eyebrow}
        </span>
      )}
      <h2 className="font-head text-3xl font-bold leading-tight text-ink sm:text-4xl">{title}</h2>
      {subtitle && (
        <p className="max-w-2xl text-[17px] leading-relaxed text-ink-soft">{subtitle}</p>
      )}
    </div>
  )
}

/** Пустое состояние: иконка, текст, действие. */
export function EmptyState({
  icon,
  title,
  text,
  action,
  className,
}: {
  icon: ReactNode
  title: string
  text?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col items-center gap-3 px-6 py-14 text-center', className)}>
      <div className="grid h-16 w-16 place-items-center rounded-full bg-surface-3 text-ink-soft">
        {icon}
      </div>
      <h3 className="font-head text-lg font-bold text-ink">{title}</h3>
      {text && <p className="max-w-sm text-[15px] leading-relaxed text-ink-soft">{text}</p>}
      {action && <div className="pt-2">{action}</div>}
    </div>
  )
}

/** Круглая иконка-кнопка в шапке (корзина, избранное, меню). */
export function IconButton({
  children,
  label,
  onClick,
  badge,
  pulsing = false,
  className,
}: {
  children: ReactNode
  label: string
  onClick?: () => void
  badge?: number
  pulsing?: boolean
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={badge ? `${label}: ${badge}` : label}
      className={cn(
        'relative grid h-11 w-11 place-items-center rounded-full border border-line text-ink transition cursor-pointer',
        'hover:border-brand hover:text-brand',
        pulsing && 'animate-cart-bump',
        className,
      )}
    >
      {children}
      {badge !== undefined && badge > 0 && (
        <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[11px] font-extrabold text-on-brand tabular-nums">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </button>
  )
}
