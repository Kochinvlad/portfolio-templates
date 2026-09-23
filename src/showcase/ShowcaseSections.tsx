import {
  ArrowRight,
  Check,
  Clock,
  Gauge,
  Layers,
  MessageCircle,
  Package,
  PenTool,
  Rocket,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '../lib/cn'
import { useInView } from '../lib/hooks'
import { buttonStyles } from '../ui/Button'
import { Section, SectionHeading } from '../ui/Bits'
import { TEMPLATES, type TemplateMeta } from './templates'

/* ============================ ШАБЛОНЫ ============================ */

function TemplateCard({ template }: { template: TemplateMeta }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-card border border-line bg-surface-2 transition duration-300 hover:border-brand/45 hover:shadow-pop">
      {/*
        Превью — настоящий скриншот шаблона, снятый с живой страницы.
        Раньше здесь был нарисованный макет браузера: он сразу выдавал,
        что за карточкой ничего не стоит.
        Как обновить снимки — в README, раздел «Превью на витрине».
      */}
      <div className="relative h-56 overflow-hidden border-b border-line bg-surface-3">
        {/* Тонкая полоса окна браузера — чтобы снимок читался как сайт, а не как фото */}
        <div className="flex h-7 items-center gap-1.5 border-b border-line bg-surface-2 px-3.5">
          <span className="h-2 w-2 rounded-full bg-ink-soft opacity-40" />
          <span className="h-2 w-2 rounded-full bg-ink-soft opacity-40" />
          <span className="h-2 w-2 rounded-full bg-ink-soft opacity-40" />
          <span className="ml-2 truncate text-[11px] text-ink-soft opacity-70">
            {template.slug}.ru
          </span>
        </div>

        <img
          src={`${import.meta.env.BASE_URL}previews/${template.slug}.webp`}
          alt={`Как выглядит шаблон «${template.name}»`}
          loading="lazy"
          decoding="async"
          className="h-[calc(100%-1.75rem)] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
        />

        <span className="absolute bottom-3 left-3.5 rounded-full bg-black/60 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white backdrop-blur">
          {template.dark ? 'тёмная тема' : 'светлая тема'}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <h3 className="font-head text-xl font-bold text-ink">{template.name}</h3>
          <p className="mt-1 text-[15px] font-medium text-brand">{template.tagline}</p>
        </div>

        <p className="text-[15px] leading-relaxed text-ink-soft">{template.description}</p>

        <ul className="flex flex-wrap gap-2">
          {template.features.map((f) => (
            <li
              key={f}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-[13px] font-medium text-ink-soft"
            >
              <Check size={13} className="text-brand" />
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-5">
          <div>
            <p className="font-head text-lg font-extrabold text-ink">{template.price}</p>
            <p className="flex items-center gap-1.5 text-[13px] text-ink-soft">
              <Clock size={13} /> {template.term}
            </p>
          </div>
          <Link
            to={`/${template.slug}`}
            className={buttonStyles('primary', 'md', 'group/btn')}
            aria-label={`Открыть демо: ${template.name}`}
          >
            Открыть демо
            <ArrowRight size={17} className="transition-transform group-hover/btn:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  )
}

export function TemplatesSection() {
  return (
    <Section id="templates" className="py-16 sm:py-24">
      <SectionHeading
        eyebrow="Портфолио"
        title="Четыре шаблона, которые можно потрогать"
        subtitle="Каждое демо — рабочий прототип, а не скриншот. Кладите товары в корзину, применяйте промокод, бронируйте столик: всё отвечает на клики."
        align="center"
        className="mx-auto items-center"
      />
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {TEMPLATES.map((t) => (
          <TemplateCard key={t.slug} template={t} />
        ))}
      </div>
    </Section>
  )
}

/* ============================ ЧТО ВХОДИТ ============================ */

const FEATURES = [
  {
    icon: Smartphone,
    title: 'Адаптив от 320 px',
    text: 'Проверяем на телефоне, планшете и десктопе. Меню сворачивается в бургер, сетки не разъезжаются, ничего не уезжает за экран.',
  },
  {
    icon: Gauge,
    title: 'Быстрая загрузка',
    text: 'Сборка через Vite, без тяжёлых библиотек. Статика раздаётся с CDN и открывается за доли секунды.',
  },
  {
    icon: Layers,
    title: 'Живой интерфейс',
    text: 'Корзина, фильтры, модальные окна, уведомления, проверка форм. Кнопки не декоративные — они действительно работают.',
  },
  {
    icon: ShieldCheck,
    title: 'Доступность',
    text: 'Видимый фокус, управление с клавиатуры, ловушка фокуса в модальных окнах, подписи у иконок для скринридеров.',
  },
  {
    icon: Search,
    title: 'Базовое SEO',
    text: 'Осмысленные заголовки, meta-описания, семантическая вёрстка и человекопонятные адреса страниц.',
  },
  {
    icon: Package,
    title: 'Исходники ваши',
    text: 'Отдаём репозиторий целиком. Хотите — дорабатываете сами или зовёте любого другого разработчика.',
  },
]

export function FeaturesSection() {
  return (
    <Section id="features" className="border-t border-line py-16 sm:py-24">
      <SectionHeading
        eyebrow="Что входит"
        title="Что получаете в любом из шаблонов"
        subtitle="Базовый набор одинаковый — меняются дизайн, тексты и набор экранов под вашу нишу."
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="rounded-card border border-line bg-surface-2 p-6 transition hover:border-brand/40"
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand">
              <Icon size={20} />
            </span>
            <h3 className="mt-4 font-head text-lg font-bold text-ink">{title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{text}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}

/* ============================ ПРОЦЕСС ============================ */

const STEPS = [
  {
    icon: MessageCircle,
    title: 'Разговор',
    text: 'Созваниваемся на 20 минут. Выясняем, что продаёте, кому и что должно происходить на сайте.',
    time: '1 день',
  },
  {
    icon: PenTool,
    title: 'Прототип',
    text: 'Собираем кликабельный макет из подходящего шаблона с вашими текстами и товарами.',
    time: '2–4 дня',
  },
  {
    icon: Sparkles,
    title: 'Правки',
    text: 'Смотрите на живом сайте и говорите, что поменять. Два круга правок входят в стоимость.',
    time: '1–3 дня',
  },
  {
    icon: Rocket,
    title: 'Запуск',
    text: 'Подключаем домен, настраиваем хостинг и аналитику. Показываем, как менять тексты и цены.',
    time: '1 день',
  },
]

/** Пауза между появлением соседних этапов: волна должна быть бодрой, а не тягучей. */
const STEP_DELAY_MS = 90

/** Сглаживание: быстрый старт, мягкое торможение. */
const STEP_EASING = 'cubic-bezier(0.16, 0.8, 0.32, 1)'

export function ProcessSection() {
  const [listRef, inView] = useInView<HTMLOListElement>()

  return (
    <Section id="process" className="border-t border-line py-16 sm:py-24" reveal={false}>
      <SectionHeading
        eyebrow="Процесс"
        title="Как идёт работа"
        subtitle="Без месяцев согласований. Вы видите живой сайт уже на третий день и правите его по факту, а не по картинке."
      />

      <ol ref={listRef} className="relative mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/*
          Линия между этапами. Лежит под карточками и видна только в промежутках,
          поэтому читается как соединитель. Прочерчивается слева направо ровно
          столько времени, сколько появляются все четыре карточки.
        */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[12%] top-[2.9rem] hidden h-0.5 origin-left bg-brand/40 transition-transform ease-out lg:block"
          style={{
            transform: inView ? 'scaleX(1)' : 'scaleX(0)',
            transitionDuration: `${STEPS.length * STEP_DELAY_MS + 500}ms`,
          }}
        />

        {STEPS.map(({ icon: Icon, title, text, time }, i) => (
          <li
            key={title}
            style={{
              transitionDelay: `${i * STEP_DELAY_MS}ms`,
              transitionTimingFunction: STEP_EASING,
            }}
            className={cn(
              'relative rounded-card border border-line bg-surface-2 p-6',
              'transition-[opacity,transform,filter] duration-700',
              inView
                ? 'translate-y-0 scale-100 opacity-100 blur-0'
                : 'translate-y-[26px] scale-[0.98] opacity-0 blur-[6px]',
            )}
          >
            <span
              aria-hidden="true"
              className="absolute right-5 top-4 font-head text-4xl font-extrabold text-ink opacity-10"
            >
              {i + 1}
            </span>
            <span
              style={{ transitionDelay: `${i * STEP_DELAY_MS + 120}ms` }}
              className={cn(
                'grid h-11 w-11 place-items-center rounded-xl bg-brand text-on-brand',
                'transition-transform duration-500 ease-out',
                inView ? 'scale-100' : 'scale-75',
              )}
            >
              <Icon size={20} />
            </span>
            <h3 className="mt-4 font-head text-lg font-bold text-ink">{title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{text}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-[13px] font-semibold text-brand">
              <Clock size={13} /> {time}
            </span>
          </li>
        ))}
      </ol>
    </Section>
  )
}
