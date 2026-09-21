import { CheckCircle2, Info, XCircle } from 'lucide-react'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

type ToastKind = 'success' | 'error' | 'info'

type Toast = {
  id: number
  kind: ToastKind
  text: string
}

type ToastApi = {
  toast: (text: string, kind?: ToastKind) => void
}

const ToastContext = createContext<ToastApi | null>(null)

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
}

const accents: Record<ToastKind, string> = {
  success: 'text-emerald-400',
  error: 'text-red-400',
  info: 'text-sky-400',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(1)

  const toast = useCallback((text: string, kind: ToastKind = 'success') => {
    const id = nextId.current++
    setToasts((prev) => [...prev.slice(-2), { id, kind, text }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 2600)
  }, [])

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[95] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-6 sm:items-end"
        role="status"
        aria-live="polite"
      >
        {toasts.map((t) => {
          const Icon = icons[t.kind]
          return (
            <div
              key={t.id}
              className="animate-toast-in pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-xl bg-[#14141a] px-4 py-3 text-[15px] font-medium text-white shadow-pop ring-1 ring-white/10"
            >
              <Icon size={19} className={accents[t.kind]} />
              <span className="leading-snug">{t.text}</span>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast можно вызывать только внутри <ToastProvider>')
  return ctx
}
