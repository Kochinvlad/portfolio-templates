import { Suspense, lazy, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { useAppUpdate } from './lib/hooks'
import { ShowcasePage } from './showcase/ShowcasePage'
import { NotFoundPage } from './showcase/NotFoundPage'

// Каждый шаблон грузится отдельным файлом: на витрину не тянется код демо,
// а демо не тянет код соседних шаблонов.
const SushiTemplate = lazy(() =>
  import('./templates/sushi/SushiTemplate').then((m) => ({ default: m.SushiTemplate })),
)
const RestaurantTemplate = lazy(() =>
  import('./templates/restaurant/RestaurantTemplate').then((m) => ({
    default: m.RestaurantTemplate,
  })),
)
const ShopTemplate = lazy(() =>
  import('./templates/shop/ShopTemplate').then((m) => ({ default: m.ShopTemplate })),
)
const ToysTemplate = lazy(() =>
  import('./templates/toys/ToysTemplate').then((m) => ({ default: m.ToysTemplate })),
)

/**
 * При смене страницы прокручиваем наверх.
 * React Router этого сам не делает, поэтому демо открывалось с середины.
 * Якорные ссылки вида #menu не трогаем — там прокрутка нужна своя.
 */
function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return
    window.scrollTo({ top: 0, behavior: 'instant' })
    // Второй проход: шаблон подгружается лениво и становится выше уже после
    // первой прокрутки, поэтому повторяем в следующем кадре.
    const raf = requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    return () => cancelAnimationFrame(raf)
  }, [pathname, hash])

  return null
}

/**
 * Появляется, когда выложена новая версия сайта.
 *
 * Оформлен отдельно от тем шаблонов: плашка показывается на любой странице,
 * поэтому не должна зависеть от того, светлая тема вокруг или тёмная.
 */
function UpdateBanner() {
  const updateAvailable = useAppUpdate()
  if (!updateAvailable) return null

  return (
    <div className="animate-pop-in fixed bottom-4 right-4 z-[65] print:hidden">
      <div className="flex items-center gap-3 rounded-full bg-[#101017]/95 py-2 pl-4 pr-2 text-white shadow-pop ring-1 ring-white/15 backdrop-blur-md">
        <span className="text-sm font-semibold">Вышла новая версия сайта</span>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="flex cursor-pointer items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-sm font-bold text-[#101017] transition hover:bg-white/85"
        >
          <RefreshCw size={14} />
          Обновить
        </button>
      </div>
    </div>
  )
}

/** Заглушка на время загрузки шаблона. */
function TemplateFallback() {
  return (
    <div className="theme-showcase grid min-h-screen place-items-center bg-surface">
      <div className="flex flex-col items-center gap-4">
        <span
          aria-hidden="true"
          className="h-10 w-10 animate-spin rounded-full border-2 border-line border-t-brand"
        />
        <p className="text-[15px] text-ink-soft">Загружаем демо…</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <UpdateBanner />
      <Suspense fallback={<TemplateFallback />}>
        <Routes>
          <Route path="/" element={<ShowcasePage />} />
          <Route path="/sushi" element={<SushiTemplate />} />
          <Route path="/restaurant" element={<RestaurantTemplate />} />
          <Route path="/shop" element={<ShopTemplate />} />
          <Route path="/toys" element={<ToysTemplate />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  )
}
