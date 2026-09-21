import { Link } from 'react-router-dom'
import { buttonStyles } from '../ui/Button'

export function NotFoundPage() {
  return (
    <div className="theme-showcase min-h-screen bg-surface text-ink">
      <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-5 px-6 text-center">
        <span className="font-head text-7xl font-extrabold text-brand">404</span>
        <h1 className="font-head text-2xl font-bold">Такой страницы нет</h1>
        <p className="text-ink-soft">
          Возможно, вы перешли по старой ссылке. Вернитесь к списку шаблонов.
        </p>
        <Link to="/" className={buttonStyles('primary', 'lg')}>
          На главную
        </Link>
      </div>
    </div>
  )
}
