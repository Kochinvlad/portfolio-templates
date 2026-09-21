import { cn } from '../lib/cn'

type Props = {
  glyph: string
  /** Оттенок 0–360 — определяет цвет подложки. */
  hue: number
  className?: string
  /** Размер эмодзи. */
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
 * Генеративная иллюстрация товара: градиент по hue + декоративные круги + эмодзи.
 * Полностью локальная — не зависит от внешних картинок и никогда не «отваливается».
 * Чтобы подставить настоящее фото — замените этот компонент на <img src={product.image} />.
 */
export function ProductArt({ glyph, hue, className, scale = 'md', dark = false }: Props) {
  const from = dark ? `hsl(${hue} 55% 26%)` : `hsl(${hue} 78% 66%)`
  const to = dark ? `hsl(${(hue + 32) % 360} 60% 14%)` : `hsl(${(hue + 32) % 360} 70% 48%)`

  return (
    <div
      aria-hidden="true"
      className={cn('relative overflow-hidden isolate grid place-items-center', className)}
      style={{ background: `linear-gradient(140deg, ${from} 0%, ${to} 100%)` }}
    >
      {/* мягкие световые пятна */}
      <div
        className="absolute -left-[18%] -top-[26%] h-[70%] w-[70%] rounded-full blur-2xl opacity-45"
        style={{ background: `hsl(${(hue + 50) % 360} 95% 80%)` }}
      />
      <div
        className="absolute -right-[14%] bottom-[-22%] h-[60%] w-[60%] rounded-full blur-2xl opacity-30"
        style={{ background: `hsl(${(hue + 300) % 360} 90% 72%)` }}
      />
      {/* тонкая сетка точек для «текстуры» */}
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
          backgroundSize: '14px 14px',
          color: '#ffffff',
        }}
      />
      {/* кольцо */}
      <div className="absolute inset-[14%] rounded-full border border-white/20" />
      <span
        className={cn('relative z-10 leading-none drop-shadow-[0_6px_18px_rgba(0,0,0,0.35)]', scales[scale])}
        style={{ fontFamily: '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif' }}
      >
        {glyph}
      </span>
    </div>
  )
}
