import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'
import { useId } from 'react'
import { cn } from '../lib/cn'

const controlBase =
  'w-full rounded-control border bg-surface-2 px-4 py-3 text-[15px] text-ink placeholder:text-ink-soft/70 ' +
  'transition-[border-color,box-shadow] outline-none focus:border-brand focus:ring-2 focus:ring-brand/25'

function Wrapper({
  label,
  hint,
  error,
  required,
  htmlFor,
  children,
  className,
}: {
  label?: string
  hint?: string
  error?: string
  required?: boolean
  htmlFor: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={htmlFor} className="text-sm font-semibold text-ink">
          {label}
          {required && <span className="text-brand"> *</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-sm font-medium text-red-500">{error}</p>
      ) : hint ? (
        <p className="text-sm text-ink-soft">{hint}</p>
      ) : null}
    </div>
  )
}

type FieldShared = {
  label?: string
  hint?: string
  error?: string
  className?: string
}

export function Input({
  label,
  hint,
  error,
  className,
  required,
  ...rest
}: FieldShared & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId()
  return (
    <Wrapper
      label={label}
      hint={hint}
      error={error}
      required={required}
      htmlFor={id}
      className={className}
    >
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        className={cn(controlBase, error ? 'border-red-500' : 'border-line')}
        {...rest}
      />
    </Wrapper>
  )
}

export function Textarea({
  label,
  hint,
  error,
  className,
  required,
  rows = 3,
  ...rest
}: FieldShared & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId()
  return (
    <Wrapper
      label={label}
      hint={hint}
      error={error}
      required={required}
      htmlFor={id}
      className={className}
    >
      <textarea
        id={id}
        rows={rows}
        aria-invalid={error ? true : undefined}
        className={cn(controlBase, 'resize-y', error ? 'border-red-500' : 'border-line')}
        {...rest}
      />
    </Wrapper>
  )
}

export function Select({
  label,
  hint,
  error,
  className,
  required,
  children,
  ...rest
}: FieldShared & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId()
  return (
    <Wrapper
      label={label}
      hint={hint}
      error={error}
      required={required}
      htmlFor={id}
      className={className}
    >
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        className={cn(controlBase, 'cursor-pointer appearance-none pr-10', error ? 'border-red-500' : 'border-line')}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2.5' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 14px center',
        }}
        {...rest}
      >
        {children}
      </select>
    </Wrapper>
  )
}

/** Радио-группа в виде кликабельных плиток. */
export function OptionCards<T extends string>({
  label,
  value,
  onChange,
  options,
  columns = 2,
  className,
}: {
  label?: string
  value: T
  onChange: (value: T) => void
  options: Array<{ value: T; title: string; note?: string; icon?: ReactNode }>
  columns?: 2 | 3
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && <span className="text-sm font-semibold text-ink">{label}</span>}
      <div
        className={cn('grid gap-2', columns === 3 ? 'grid-cols-3' : 'grid-cols-1 sm:grid-cols-2')}
      >
        {options.map((opt) => {
          const active = opt.value === value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              aria-pressed={active}
              aria-label={opt.note ? `${opt.title} — ${opt.note}` : opt.title}
              className={cn(
                'flex items-center gap-3 rounded-control border px-4 py-3 text-left transition cursor-pointer',
                active
                  ? 'border-brand bg-brand-soft ring-2 ring-brand/25'
                  : 'border-line bg-surface-2 hover:border-brand/45',
              )}
            >
              {opt.icon && <span className={active ? 'text-brand' : 'text-ink-soft'}>{opt.icon}</span>}
              <span className="min-w-0">
                <span className="block text-[15px] font-semibold text-ink">{opt.title}</span>
                {opt.note && <span className="block text-sm text-ink-soft">{opt.note}</span>}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
