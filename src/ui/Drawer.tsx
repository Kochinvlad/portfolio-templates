import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../lib/cn'
import { useBodyLock, useEscape, useFocusTrap } from '../lib/hooks'

type Props = {
  open: boolean
  onClose: () => void
  title: ReactNode
  children: ReactNode
  /** Закреплённый низ панели — итоги и кнопка оформления. */
  footer?: ReactNode
  label: string
}

export function Drawer({ open, onClose, title, children, footer, label }: Props) {
  useBodyLock(open)
  useEscape(open, onClose)
  const trapRef = useFocusTrap<HTMLDivElement>(open)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        type="button"
        aria-label="Закрыть"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in cursor-default"
      />
      <div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={cn(
          'absolute right-0 top-0 flex h-full w-full max-w-[440px] flex-col',
          'bg-surface text-ink shadow-pop animate-slide-in-right',
        )}
      >
        <header className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
          <h2 className="font-head text-lg font-bold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть корзину"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-ink-soft transition hover:bg-surface-3 hover:text-ink cursor-pointer"
          >
            <X size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto thin-scroll px-5 py-4">{children}</div>

        {footer && <div className="border-t border-line bg-surface-2 px-5 py-4">{footer}</div>}
      </div>
    </div>
  )
}
