import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useDocumentMeta, useMediaQuery, useRevealOnScroll } from '../lib/hooks'
import { buttonStyles } from '../ui/Button'
import { ToastProvider } from '../ui/Toast'
import { CinemaHero } from './ShowcaseCinema'
import { HeroActions, HeroBadge, HeroGlow, HeroLead, HeroStats, HeroTitle } from './ShowcaseHeroParts'
import { FeaturesSection, ProcessSection, TemplatesSection } from './ShowcaseSections'
import { ContactSection, FaqSection, ShowcaseFooter } from './ShowcaseContact'

const NAV = [
  { href: '#templates', label: 'Шаблоны' },
  { href: '#features', label: 'Что входит' },
  { href: '#process', label: 'Как работаем' },
  { href: '#faq', label: 'Вопросы' },
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

/** Статичный первый экран — для тех, у кого в системе отключены анимации. */
function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-4 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-20">
      <HeroGlow />
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
        <HeroBadge />
        <HeroTitle />
        <HeroLead />
        <HeroActions className="mt-8" />
        <HeroStats className="mt-14" />
      </div>
    </section>
  )
}

/**
 * Первый экран: полёт камеры сквозь шаблоны. Если в системе отключены
 * анимации — статичная версия с тем же текстом.
 */
function HeroSection() {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  return reducedMotion ? <Hero /> : <CinemaHero fallback={<Hero />} />
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
          <HeroSection />
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
