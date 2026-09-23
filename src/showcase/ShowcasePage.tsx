import { useState } from 'react'
import { ArrowRight, Menu, MousePointerClick, Smartphone, Wallet, X, Zap } from 'lucide-react'
import { useDocumentMeta, useRevealOnScroll } from '../lib/hooks'
import { buttonStyles } from '../ui/Button'
import { ToastProvider } from '../ui/Toast'
import { FeaturesSection, ProcessSection, TemplatesSection } from './ShowcaseSections'
import { ContactSection, FaqSection, ShowcaseFooter } from './ShowcaseContact'

const NAV = [
  { href: '#templates', label: 'Шаблоны' },
  { href: '#features', label: 'Что входит' },
  { href: '#process', label: 'Как работаем' },
  { href: '#faq', label: 'Вопросы' },
]

const STATS = [
  { icon: MousePointerClick, value: '4', label: 'живых демо — можно кликать' },
  { icon: Zap, value: '5–14', label: 'дней от брифа до запуска' },
  { icon: Smartphone, value: '320px', label: 'минимальная ширина адаптива' },
  { icon: Wallet, value: '0 ₽', label: 'хостинг на статике' },
]

function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-on-brand font-head text-lg font-extrabold">
            U
          </span>
          <span className="font-head text-[15px] font-bold tracking-tight">
            Ultra<span className="text-brand">Team</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-ink-soft transition hover:bg-surface-2 hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Обёртка, а не класс на кнопке: inline-flex из базовых стилей перебивает hidden */}
          <span className="hidden sm:inline-flex">
            <a href="#contact" className={buttonStyles('primary', 'sm')}>
              Обсудить проект
            </a>
          </span>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink transition hover:border-brand hover:text-brand cursor-pointer md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="animate-fade-in border-t border-line bg-surface px-4 py-3 md:hidden">
          <nav className="flex flex-col">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-[15px] font-medium text-ink-soft transition hover:bg-surface-2 hover:text-ink"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className={buttonStyles('primary', 'md', 'mt-2')}
            >
              Обсудить проект
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-4 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-20">
      {/* Живой фон: два пятна света, медленно дрейфующие в противофазе */}
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
      {/*
        Сетка в два слоя: тусклая основа и бегущая по её линиям подсветка.
        Оба слоя лежат внутри общей маски, которая мягко гасит сетку к низу шапки.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          maskImage: 'radial-gradient(ellipse 80% 55% at 50% 0%, #000 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 55% at 50% 0%, #000 40%, transparent 100%)',
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        {/*
          Маска-сетка на родителе, движение — на дочернем слое.
          Так свет виден только на линиях разметки, но маска не пересчитывается:
          браузер двигает уже готовый слой силами видеокарты.
        */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            maskImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            WebkitMaskImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            maskSize: '64px 64px',
            WebkitMaskSize: '64px 64px',
          }}
        >
          <div
            className="absolute inset-y-0 -left-1/2 -right-1/2 will-change-transform"
            style={{
              backgroundImage:
                'linear-gradient(115deg, transparent 38%, rgba(165,180,252,0.9) 50%, transparent 62%)',
              animation: 'grid-sweep 9s ease-in-out infinite alternate',
            }}
          />
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-4xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-2 px-4 py-1.5 text-[13px] font-semibold text-ink-soft">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Берём новые проекты
        </span>

        <h1 className="mt-6 font-head text-[2.1rem] font-extrabold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
          Сайты, в которых
          <br className="hidden sm:block" />{' '}
          <span className="bg-gradient-to-r from-[#818cf8] via-[#c084fc] to-[#f472b6] bg-clip-text text-transparent">
            всё нажимается
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-[17px] leading-relaxed text-ink-soft sm:text-lg">
          Делаем сайты для доставки еды, ресторанов и магазинов. Ниже — четыре готовых шаблона.
          Это не картинки: открывайте и кликайте — корзина считает, фильтры фильтруют, формы
          проверяют ввод.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="#templates" className={buttonStyles('primary', 'lg', 'w-full sm:w-auto')}>
            Открыть шаблоны
            <ArrowRight size={18} />
          </a>
          <a href="#contact" className={buttonStyles('outline', 'lg', 'w-full sm:w-auto')}>
            Нужен свой вариант
          </a>
        </div>

        <dl className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="rounded-card border border-line bg-surface-2 px-4 py-5 text-left"
            >
              <Icon size={18} className="text-brand" />
              <dt className="mt-3 font-head text-2xl font-extrabold text-ink">{value}</dt>
              <dd className="mt-1 text-[13px] leading-snug text-ink-soft">{label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

export function ShowcasePage() {
  useDocumentMeta(
    'UltraTeam — сайты для доставки еды, ресторанов и магазинов',
    'Живые интерактивные шаблоны сайтов: доставка суши, ресторан, интернет-магазин, магазин игрушек.',
  )
  useRevealOnScroll()

  return (
    <ToastProvider>
      <div className="theme-showcase min-h-screen bg-surface text-ink">
        <Header />
        <main>
          <Hero />
          <TemplatesSection />
          <FeaturesSection />
          <ProcessSection />
          <FaqSection />
          <ContactSection />
        </main>
        <ShowcaseFooter />
      </div>
    </ToastProvider>
  )
}
