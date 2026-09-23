import { ArrowRight, MousePointerClick, Smartphone, Wallet, Zap } from 'lucide-react'
import { cn } from '../lib/cn'
import { buttonStyles } from '../ui/Button'

/*
  Общие части первого экрана. Их собирают и кинематографичная сцена,
  и статичная версия для тех, у кого отключены анимации, — поэтому
  тексты и кнопки живут в одном месте и не разъезжаются.
*/

const STATS = [
  { icon: MousePointerClick, value: '4', label: 'живых демо — можно кликать' },
  { icon: Zap, value: '5–14', label: 'дней от брифа до запуска' },
  { icon: Smartphone, value: '320px', label: 'минимальная ширина адаптива' },
  { icon: Wallet, value: '0 ₽', label: 'хостинг на статике' },
]

/** Живой фон: два пятна света, медленно дрейфующие в противофазе. */
export function HeroGlow() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-18rem] h-[36rem] w-[36rem] rounded-full blur-[110px]"
        style={{
          background: 'radial-gradient(circle, #6366f1 0%, #f472b6 55%, transparent 72%)',
          animation: 'drift-a 26s ease-in-out infinite',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-[6rem] h-[30rem] w-[30rem] rounded-full blur-[120px]"
        style={{
          background: 'radial-gradient(circle, #22d3ee 0%, #6366f1 60%, transparent 75%)',
          animation: 'drift-b 34s ease-in-out infinite',
          animationDelay: '-8s',
        }}
      />
    </>
  )
}

export function HeroBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-2 px-4 py-1.5 text-[13px] font-semibold text-ink-soft">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      Берём новые проекты
    </span>
  )
}

export function HeroTitle() {
  return (
    <h1 className="mt-6 font-head text-[2.1rem] font-extrabold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
      Сайты, в которых
      <br className="hidden sm:block" />{' '}
      <span className="bg-gradient-to-r from-[#818cf8] via-[#c084fc] to-[#f472b6] bg-clip-text text-transparent">
        всё нажимается
      </span>
    </h1>
  )
}

export function HeroLead() {
  return (
    <p className="mx-auto mt-5 max-w-2xl text-[17px] leading-relaxed text-ink-soft sm:text-lg">
      Делаем сайты для доставки еды, ресторанов и магазинов. Ниже — четыре готовых шаблона.
      Это не картинки: открывайте и кликайте — корзина считает, фильтры фильтруют, формы
      проверяют ввод.
    </p>
  )
}

export function HeroActions({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 sm:flex-row', className)}>
      <a href="#templates" className={buttonStyles('primary', 'lg', 'w-full sm:w-auto')}>
        Открыть шаблоны
        <ArrowRight size={18} />
      </a>
      <a href="#contact" className={buttonStyles('outline', 'lg', 'w-full sm:w-auto')}>
        Нужен свой вариант
      </a>
    </div>
  )
}

export function HeroStats({ className }: { className?: string }) {
  return (
    <dl className={cn('mx-auto grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4', className)}>
      {STATS.map(({ icon: Icon, value, label }) => (
        <div key={label} className="rounded-card border border-line bg-surface-2 px-4 py-5 text-left">
          <Icon size={18} className="text-brand" />
          <dt className="mt-3 font-head text-2xl font-extrabold text-ink">{value}</dt>
          <dd className="mt-1 text-[13px] leading-snug text-ink-soft">{label}</dd>
        </div>
      ))}
    </dl>
  )
}
