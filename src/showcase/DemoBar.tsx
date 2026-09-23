import { useEffect, useState } from 'react'
import { ArrowLeft, Info, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

/** Сколько висит подсказка про демо-контакты. */
const NOTICE_MS = 3200

/**
 * Плашка «назад к витрине» поверх каждого демо-шаблона.
 * Всегда в тёмном оформлении, чтобы одинаково читаться на любой теме.
 *
 * Заодно глушит ссылки tel: и mailto: внутри демо. Номера в шаблонах выглядят
 * настоящими, и звонок мог бы уйти постороннему человеку. Сами шаблоны при этом
 * не меняются: отдали шаблон клиенту — его телефон звонит как обычно.
 */
export function DemoBar({ name }: { name: string }) {
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    let timer = 0

    function handleClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return
      const link = event.target.closest('a[href^="tel:"], a[href^="mailto:"]')
      if (!link) return

      event.preventDefault()
      const isPhone = link.getAttribute('href')?.startsWith('tel:')
      setNotice(
        isPhone
          ? 'Это демо: номер для примера, звонок не пойдёт'
          : 'Это демо: адрес для примера, письмо не уйдёт',
      )
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setNotice(null), NOTICE_MS)
    }

    // Фаза перехвата — срабатывает раньше обработчиков внутри шаблона
    document.addEventListener('click', handleClick, true)
    return () => {
      document.removeEventListener('click', handleClick, true)
      window.clearTimeout(timer)
    }
  }, [])

  return (
    <>
      {/* Отступ в конце страницы, чтобы плашка не перекрывала последние строки */}
      <div aria-hidden="true" className="h-16" />

      {/* z-60: выше контента и шапки (z-50), но ниже модалок (z-70) и корзины (z-80) */}
      {/* data-demo-bar — по нему скрипт снимков превью прячет плашку */}
      <div data-demo-bar className="fixed bottom-4 left-4 z-[60] print:hidden">
        <div
          role="status"
          aria-live="polite"
          className="absolute bottom-full left-0 mb-2 w-max max-w-[calc(100vw-2rem)]"
        >
          {notice && (
            <p className="animate-toast-in flex items-center gap-2 rounded-xl bg-[#101017]/95 px-3.5 py-2.5 text-[13px] font-medium text-white shadow-pop ring-1 ring-white/12">
              <Info size={15} className="shrink-0 text-sky-400" />
              {notice}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 rounded-full bg-[#101017]/92 p-1 pr-3 text-white shadow-pop ring-1 ring-white/12 backdrop-blur-md">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm font-semibold transition hover:bg-white/20"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Все шаблоны</span>
          </Link>
          <span className="flex items-center gap-1.5 pl-2 text-xs font-semibold text-white/70">
            <Sparkles size={13} className="text-[#f472b6]" />
            <span className="hidden sm:inline">Демо ·</span> {name}
          </span>
        </div>
      </div>
    </>
  )
}
