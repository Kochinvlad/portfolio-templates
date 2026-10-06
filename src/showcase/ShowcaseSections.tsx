import { Check, Clock, Gauge, Layers, Package, Search, ShieldCheck, Smartphone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { buttonStyles } from '../ui/Button'
import { Section, SectionHeading } from '../ui/Bits'
import { TEMPLATES, type TemplateMeta } from './templates'

/* ============================ ШАБЛОНЫ ============================ */

function TemplateCard({ template }: { template: TemplateMeta }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-card border border-line bg-surface-2 transition duration-300 hover:border-brand/45">
      {/*
        Превью — настоящий скриншот шаблона, снятый с живой страницы.
        Раньше здесь был нарисованный макет браузера: он сразу выдавал,
        что за карточкой ничего не стоит.
        Как обновить снимки — в README, раздел «Превью на витрине».
      */}
      <div className="relative h-56 overflow-hidden border-b border-line bg-surface-3">
        {/*
          Тонкая полоса окна браузера — чтобы снимок читался как сайт, а не как фото.
          В ней название вымышленной компании: настоящие домены вроде sushi.ru чужие.
        */}
        <div className="flex h-7 items-center gap-1.5 border-b border-line bg-surface-2 px-3.5">
          <span className="h-2 w-2 rounded-full bg-ink-soft opacity-40" />
          <span className="h-2 w-2 rounded-full bg-ink-soft opacity-40" />
          <span className="h-2 w-2 rounded-full bg-ink-soft opacity-40" />
          <span className="ml-2 truncate text-[11px] text-ink-soft">{template.brand}</span>
        </div>

        <img
          src={`${import.meta.env.BASE_URL}previews/${template.slug}.webp`}
          alt={`Как выглядит шаблон «${template.name}»`}
          loading="lazy"
          decoding="async"
          className="h-[calc(100%-1.75rem)] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <h3 className="font-head text-xl font-bold text-ink">{template.name}</h3>
          <p className="mt-1 text-[15px] font-medium text-brand-text">{template.tagline}</p>
        </div>

        <p className="text-[15px] leading-relaxed text-ink-soft">{template.description}</p>

        <ul className="flex flex-wrap gap-2">
          {template.features.map((f) => (
            <li
              key={f}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-[13px] font-medium text-ink-soft"
            >
              <Check size={13} className="text-brand-text" />
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
            className={buttonStyles('primary', 'md')}
            aria-label={`Открыть демо: ${template.name}`}
          >
            Открыть демо
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

/** Языком владельца кафе или магазина: что он получит, а не на чём это сделано. */
const FEATURES = [
  {
    icon: Smartphone,
    title: 'Удобно с телефона',
    text: 'Большинство заказов делают с телефона. Проверяем сайт на маленьких экранах: кнопки крупные, корзина и меню всегда под рукой.',
  },
  {
    icon: Gauge,
    title: 'Открывается сразу',
    text: 'Страница загружается за секунду даже на мобильном интернете. Покупатель не уходит к конкурентам, пока ждёт.',
  },
  {
    icon: Layers,
    title: 'Всё работает по\u2011настоящему', // неразрывный дефис
    text: 'Корзина, фильтры, бронь и заявки работают с первого дня. Это не картинка, которую потом ещё нужно оживлять.',
  },
  {
    icon: ShieldCheck,
    title: 'Удобно всем гостям',
    text: 'Крупный читаемый текст, заметные кнопки, можно пройти без мыши. Сайтом спокойно пользуются и пожилые покупатели.',
  },
  {
    icon: Search,
    title: 'Находят в поиске',
    text: 'Правильные заголовки и описания страниц: Яндекс и Google понимают, о чём сайт, и показывают его по нужным запросам.',
  },
  {
    icon: Package,
    title: 'Сайт остаётся вашим',
    text: 'Отдаём все файлы и доступы. Захотите — дорабатываете с нами или с любым другим разработчиком.',
  },
]

export function FeaturesSection() {
  return (
    <Section id="features" className="border-t border-line py-16 sm:py-24">
      <SectionHeading
        title="Что получаете в любом из шаблонов"
        subtitle="Основа одна и та же — меняются дизайн, тексты и набор экранов под ваш бизнес."
      />
      {/* Без одинаковых карточек: шесть коротких ответов под чертой читаются быстрее */}
      <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <div key={title} className="border-t border-line pt-5">
            <h3 className="flex items-center gap-2.5 font-head text-lg font-bold text-ink">
              <Icon size={20} aria-hidden="true" className="shrink-0 text-brand-text" />
              {title}
            </h3>
            <p className="mt-2.5 text-[15px] leading-relaxed text-ink-soft">{text}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}

/* ============================ ПРОЦЕСС ============================ */

const STEPS = [
  {
    title: 'Разговор',
    text: 'Созваниваемся на 20 минут. Выясняем, что продаёте, кому и что должно происходить на сайте.',
    time: '1 день',
  },
  {
    title: 'Прототип',
    text: 'Собираем кликабельный макет из подходящего шаблона с вашими текстами и товарами.',
    time: '2–4 дня',
  },
  {
    title: 'Правки',
    text: 'Смотрите на живом сайте и говорите, что поменять. Два круга правок входят в стоимость.',
    time: '1–3 дня',
  },
  {
    title: 'Запуск',
    text: 'Подключаем домен, настраиваем хостинг и аналитику. Показываем, как менять тексты и цены.',
    time: '1 день',
  },
]

/** Этапы идут по порядку, поэтому здесь номера — по делу, а не для украшения. */
export function ProcessSection() {
  return (
    <Section id="process" className="border-t border-line py-16 sm:py-24">
      <SectionHeading
        title="Как идёт работа"
        subtitle="Без месяцев согласований. Вы видите живой сайт уже на третий день и правите его по факту, а не по картинке."
      />

      <ol className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map(({ title, text, time }, i) => (
          <li key={title} className="border-t-2 border-brand pt-5">
            <span className="font-head text-3xl font-extrabold text-brand-text">{i + 1}</span>
            <h3 className="mt-3 font-head text-lg font-bold text-ink">{title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{text}</p>
            <p className="mt-4 flex items-center gap-1.5 text-[13px] font-semibold text-ink-soft">
              <Clock size={13} aria-hidden="true" /> {time}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  )
}
