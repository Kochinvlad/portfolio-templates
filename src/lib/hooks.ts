import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Состояние, которое переживает перезагрузку страницы.
 * Если localStorage недоступен (приватный режим), тихо работает как обычный useState.
 */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* квота исчерпана или хранилище заблокировано — не критично */
    }
  }, [key, value])

  return [value, setValue] as const
}

/** Блокирует прокрутку страницы, пока открыта модалка или корзина. */
export function useBodyLock(active: boolean) {
  useEffect(() => {
    if (!active) return
    const { body } = document
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    body.classList.add('is-locked')
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`
    return () => {
      body.classList.remove('is-locked')
      body.style.paddingRight = ''
    }
  }, [active])
}

/** Вызывает onClose по нажатию Escape. */
export function useEscape(active: boolean, onClose: () => void) {
  useEffect(() => {
    if (!active) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [active, onClose])
}

/**
 * Плавное появление блоков при прокрутке: элементы с классом .reveal
 * получают .is-visible, когда попадают во вьюпорт.
 *
 * Следим не только за тем, что есть при монтировании: секции появляются и позже —
 * например, экран «Заявка принята» вместо формы. Без MutationObserver такой блок
 * навсегда оставался с opacity: 0, и пользователь видел пустое место.
 */
export function useRevealOnScroll() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach((n) => n.classList.add('is-visible'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )

    // Повторный observe уже наблюдаемого элемента ничего не делает, так что вызывать безопасно
    const observeAll = () => {
      document.querySelectorAll('.reveal:not(.is-visible)').forEach((n) => io.observe(n))
    }
    observeAll()

    let frame = 0
    const mo = new MutationObserver(() => {
      // Склеиваем серию правок DOM в один проход
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        observeAll()
      })
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      if (frame) cancelAnimationFrame(frame)
      mo.disconnect()
      io.disconnect()
    }
  }, [])
}

/** true, если media-запрос выполняется. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )
  useEffect(() => {
    const mql = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    setMatches(mql.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [query])
  return matches
}

/** Прокрутка наверх при смене страницы. */
export function useScrollTop(trigger: unknown) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [trigger])
}

/**
 * Возвращает true на короткое время после изменения value —
 * используется для «подпрыгивания» иконки корзины.
 */
export function usePulse(value: number, ms = 400): boolean {
  const [pulsing, setPulsing] = useState(false)
  const prev = useRef(value)

  useEffect(() => {
    if (value > prev.current) {
      setPulsing(true)
      const t = window.setTimeout(() => setPulsing(false), ms)
      prev.current = value
      return () => window.clearTimeout(t)
    }
    prev.current = value
  }, [value, ms])

  return pulsing
}

/** Значение, обновляющееся не чаще, чем раз в delay мс — для поиска. */
export function useDebounced<T>(value: T, delay = 250): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(t)
  }, [value, delay])
  return debounced
}

/** Ловушка фокуса внутри модального окна (Tab не убегает на фон). */
export function useFocusTrap<T extends HTMLElement>(active: boolean) {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (!active || !ref.current) return
    const root = ref.current
    const selector =
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

    const first = root.querySelector<HTMLElement>(selector)
    first?.focus()

    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const items = Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(
        (el) => el.offsetParent !== null,
      )
      if (items.length === 0) return
      const firstEl = items[0]
      const lastEl = items[items.length - 1]
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault()
        lastEl.focus()
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault()
        firstEl.focus()
      }
    }

    root.addEventListener('keydown', handler)
    return () => root.removeEventListener('keydown', handler)
  }, [active])

  return ref
}

/** Обработчик клика вне элемента. */
export function useClickOutside<T extends HTMLElement>(onOutside: () => void) {
  const ref = useRef<T>(null)
  const saved = useRef(onOutside)
  saved.current = onOutside

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) saved.current()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return ref
}

/** Обратный отсчёт в секундах — для таймера акции. */
export function useCountdown(seconds: number) {
  const [left, setLeft] = useState(seconds)
  const reset = useCallback(() => setLeft(seconds), [seconds])

  useEffect(() => {
    const id = window.setInterval(() => {
      setLeft((v) => (v > 0 ? v - 1 : 0))
    }, 1000)
    return () => window.clearInterval(id)
  }, [])

  return { left, reset }
}

/** Заголовок вкладки и meta-описание для конкретной страницы. */
export function useDocumentMeta(title: string, description?: string) {
  useEffect(() => {
    const prevTitle = document.title
    document.title = title

    const tag = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const prevDescription = tag?.content
    if (tag && description) tag.content = description

    return () => {
      document.title = prevTitle
      if (tag && prevDescription !== undefined) tag.content = prevDescription
    }
  }, [title, description])
}

/** Версия, зашитая в текущую сборку. */
export const APP_VERSION: string = import.meta.env.VITE_APP_VERSION ?? 'dev'

/**
 * Следит за тем, не вышла ли новая версия сайта.
 *
 * GitHub Pages держит index.html в кэше около десяти минут, поэтому у посетителя
 * (и у разработчика) легко остаётся открытой устаревшая страница. Здесь мы сами
 * сверяемся с version.json и предлагаем обновиться, когда версия изменилась.
 *
 * Проверяем не по таймеру в лоб, а ещё и при возвращении на вкладку — так реже
 * дёргаем сеть и быстрее замечаем обновление.
 */
export function useAppUpdate(checkEveryMs = 5 * 60 * 1000) {
  const [updateAvailable, setUpdateAvailable] = useState(false)

  useEffect(() => {
    // В режиме разработки version.json не создаётся — проверять нечего
    if (import.meta.env.DEV) return
    let cancelled = false

    async function check() {
      if (cancelled || document.hidden) return
      try {
        const url = `${import.meta.env.BASE_URL}version.json?t=${Date.now()}`
        const res = await fetch(url, { cache: 'no-store' })
        if (!res.ok) return
        const data: { version?: string } = await res.json()
        if (!cancelled && data.version && data.version !== APP_VERSION) {
          setUpdateAvailable(true)
        }
      } catch {
        // Нет сети или файл недоступен — молча ждём следующей попытки
      }
    }

    const timer = window.setInterval(check, checkEveryMs)
    document.addEventListener('visibilitychange', check)
    check()

    return () => {
      cancelled = true
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', check)
    }
  }, [checkEveryMs])

  return updateAvailable
}
