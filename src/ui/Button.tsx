import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-control ' +
  'transition-[transform,background-color,color,border-color,box-shadow] duration-200 ' +
  'active:scale-[0.97] disabled:opacity-45 disabled:cursor-not-allowed disabled:active:scale-100 ' +
  'cursor-pointer select-none whitespace-nowrap'

const sizes: Record<ButtonSize, string> = {
  sm: 'text-sm px-3.5 py-2',
  md: 'text-[15px] px-5 py-2.5',
  lg: 'text-base px-7 py-3.5',
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-on-brand hover:bg-brand-hover shadow-sm',
  secondary: 'bg-surface-3 text-ink hover:opacity-80',
  outline: 'border border-line text-ink hover:bg-surface-3 bg-transparent',
  ghost: 'text-ink hover:bg-surface-3 bg-transparent',
  danger: 'bg-red-600 text-white hover:bg-red-700',
}

export function buttonStyles(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  extra?: string,
): string {
  return cn(base, sizes[size], variants[variant], extra)
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  full?: boolean
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  full = false,
  className,
  type = 'button',
  children,
  ...rest
}: Props) {
  return (
    <button
      type={type}
      className={buttonStyles(variant, size, cn(full && 'w-full', className))}
      {...rest}
    >
      {children}
    </button>
  )
}
