import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../lib/cn'
import { useBodyLock, useEscape, useFocusTrap } from '../lib/hooks'

type Props = {
  open: boolean
  onClose: () => void
  children: ReactNode
  /** Максимальная ширина панели. */
  size?: 'sm' | 'md' | 'lg'
  label: string
  className?: string
}

const sizes = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
}

export function Modal({ open, onClose, children, size = 'md', label, className }: Props) {
  useBodyLock(open)
  useEscape(open, onClose)
  const trapRef = useFocusTrap<HTMLDivElement>(open)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-6">
      <button
        type="button"
        aria-label="Закрыть"
        onClick={onClose}
        className="absolute inset-0 bg-black/65 backdrop-blur-sm animate-fade-in cursor-default"
      />
      <div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={cn(
          'relative z-10 w-full bg-surface text-ink shadow-pop animate-pop-in',
          'rounded-t-2xl sm:rounded-card max-h-[92vh] sm:max-h-[86vh] overflow-y-auto thin-scroll',
          sizes[size],
          className,
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть окно"
          className="absolute right-3 top-3 z-20 grid h-10 w-10 place-items-center rounded-full bg-surface-2/90 text-ink backdrop-blur transition hover:bg-surface-3 cursor-pointer"
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  )
}
