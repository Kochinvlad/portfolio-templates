import { useState, type CSSProperties } from 'react'
import { Gift, Menu as MenuIcon, Phone, ShoppingBasket, Truck, X } from 'lucide-react'
import { cn } from '../../lib/cn'
import { usePulse } from '../../lib/hooks'
import { photoUrl } from '../../lib/photos'
import { useCart } from '../../store/cart'
import { buttonStyles } from '../../ui/Button'
import { IconButton } from '../../ui/Bits'

const NAV = [
  { href: '#finder', label: 'Подобрать подарок' },
  { href: '#catalog', label: 'Каталог' },
  { href: '#why', label: 'Почему мы' },
  { href: '#contacts', label: 'Контакты' },
]

const RED = 'var(--block-red)'
const BLUE = 'var(--brand)'
const YELLOW = 'var(--accent)'

/** Грань кубика: цветная рамка и жёсткая тень снизу — толщина дерева, а не свечение. */
const BLOCK = 'block aspect-square rounded-[22%] p-[8%] shadow-[0_5px_0_rgb(43_36_32/0.14)]'

/**
 * Деревянный кубик с буквой. Буква считается от ширины самого кубика
 * (контейнерные единицы), поэтому одинаково ложится и в логотип, и в пирамиду.
 */
export function LetterBlock({
  letter,
  color,
  className,
  style,
}: {
  letter: string
  color: string
  className?: string
  style?: CSSProperties
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(BLOCK, '[container-type:inline-size]', className)}
      style={{ backgroundColor: color, ...style }}
    >
      <span
        className="grid h-full w-full place-items-center rounded-[16%] bg-[var(--wood)] font-head font-black leading-none"
        style={{ color, fontSize: 'min(3.6rem, 60cqw)' }}
      >
        {letter}
      </span>
    </span>
  )
}

/** Тот же кубик, но с картинкой — как на азбуке из кубиков. */
function PhotoBlock({ id, color, className, style }: {
  id: string
  color: string
  className?: string
  style?: CSSProperties
}) {
  return (
    <span aria-hidden="true" className={cn(BLOCK, className)} style={{ backgroundColor: color, ...style }}>
      <img src={photoUrl(id)} alt="" decoding="async" className="h-full w-full rounded-[16%] object-cover" />
    </span>
  )
}

type Block = { letter: string; color: string } | { photo: string; color: string }

/** Пирамида сверху вниз: 2, 3 и 4 кубика. Буквы по порядку складываются в «ИГРА». */
const PYRAMID: Block[][] = [
  [{ letter: 'И', color: RED }, { photo: 'sf-bear', color: YELLOW }],
  [{ photo: 'tr-railway', color: BLUE }, { letter: 'Г', color: RED }, { letter: 'Р', color: BLUE }],
  [
    { photo: 'cr-paint', color: YELLOW },
    { letter: 'А', color: RED },
    { photo: 'ot-kite', color: BLUE },
    { photo: 'ct-blocks', color: YELLOW },
  ],
]

/** Кубики падают снизу вверх, как их складывает ребёнок: сначала нижний ряд. */
function BlockPyramid({ className }: { className?: string }) {
  const rows = [...PYRAMID].reverse()
  let order = 0
  return (
    <div aria-hidden="true" className={cn('flex flex-col-reverse gap-2 sm:gap-3', className)}>
      {rows.map((row, r) => (
        <div key={r} className="flex justify-center gap-[2.5%]">
          {row.map((block) => {
            const style = { animationDelay: `${order++ * 70}ms` }
            return (
              <span key={'letter' in block ? block.letter : block.photo} className="w-[23%]">
                {'letter' in block ? (
                  <LetterBlock letter={block.letter} color={block.color} className="animate-block-drop" style={style} />
                ) : (
                  <PhotoBlock id={block.photo} color={block.color} className="animate-block-drop" style={style} />
                )}
              </span>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export function ToysHeader() {
  const { count, open } = useCart()
  const pulsing = usePulse(count)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/92 backdrop-blur-xl">
      <div className="mx-auto flex h-[70px] w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <a href="#top" className="flex shrink-0 items-center gap-2.5">
          {/* Обёртка задаёт размер: отступы кубика в процентах считаются от родителя */}
          <span className="w-10 shrink-0">
            <LetterBlock letter="И" color={RED} />
          </span>
          <span className="font-head text-[18px] font-extrabold text-ink">ИГРОГРАД</span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-[15px] font-semibold text-ink-soft transition hover:bg-brand-soft hover:text-brand-hover"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="tel:+74951112233"
            className="hidden items-center gap-2 text-[15px] font-semibold text-ink transition hover:text-brand-hover md:flex"
          >
            <Phone size={15} />
            +7 (495) 111-22-33
          </a>
          <IconButton label="Корзина" badge={count} pulsing={pulsing} onClick={open}>
            <ShoppingBasket size={19} />
          </IconButton>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={menuOpen}
            className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-line text-ink transition hover:border-brand hover:text-brand-hover lg:hidden"
          >
            {menuOpen ? <X size={19} /> : <MenuIcon size={19} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="animate-fade-in border-t border-line bg-surface px-4 py-2 lg:hidden">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="block rounded-2xl px-4 py-3 text-[15px] font-semibold text-ink-soft transition hover:bg-brand-soft hover:text-brand-hover"
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}

/*
  Первый экран — кубики с буквами и картинками, самая узнаваемая игрушка детства.
  Единственное движение на странице: кубики складываются в пирамиду.
*/
export function ToysHero() {
  return (
    <section id="top" className="px-4 pb-14 pt-8 sm:px-6 sm:pb-20 sm:pt-14">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
        <BlockPyramid className="mx-auto w-full max-w-[300px] sm:max-w-[380px] lg:order-last lg:max-w-[470px]" />

        <div>
          <h1 className="font-head text-[2.3rem] font-extrabold leading-[1.06] text-ink sm:text-5xl lg:text-[3.5rem]">
            Подарок, который не забросят через день
          </h1>

          <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-ink-soft">
            Восемнадцать игрушек, отобранных по возрасту и интересам. Не знаете, что выбрать&nbsp;—
            ответьте на три вопроса, и мы подберём сами.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#finder" className={buttonStyles('primary', 'lg', 'w-full sm:w-auto')}>
              <Gift size={19} />
              Подобрать подарок
            </a>
            <a href="#catalog" className={buttonStyles('outline', 'lg', 'w-full sm:w-auto')}>
              Весь каталог
            </a>
          </div>

          <p className="mt-8 flex items-center gap-2 text-[15px] text-ink-soft">
            <Truck size={17} aria-hidden="true" className="shrink-0 text-brand" />
            Доставка за 1–2 дня, от 3000&nbsp;₽&nbsp;— бесплатно
          </p>
        </div>
      </div>
    </section>
  )
}
