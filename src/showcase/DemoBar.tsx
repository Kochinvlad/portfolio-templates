import { ArrowLeft, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

/**
 * Плашка «назад к витрине» поверх каждого демо-шаблона.
 * Всегда в тёмном оформлении, чтобы одинаково читаться на любой теме.
 */
export function DemoBar({ name }: { name: string }) {
  return (
    <>
      {/* Отступ в конце страницы, чтобы плашка не перекрывала последние строки */}
      <div aria-hidden="true" className="h-16" />

      {/* z-60: выше контента и шапки (z-50), но ниже модалок (z-70) и корзины (z-80) */}
      <div className="fixed bottom-4 left-4 z-[60] print:hidden">
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
