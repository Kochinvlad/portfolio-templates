import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Rating } from '../../ui/Bits'
import { Modal } from '../../ui/Modal'
import { ProductArt } from '../../ui/ProductArt'
import { REST_GALLERY, REST_REVIEWS } from './data'

export function RestaurantGallery() {
  const [index, setIndex] = useState<number | null>(null)
  const current = index !== null ? REST_GALLERY[index] : null

  const go = useCallback((delta: number) => {
    setIndex((i) => (i === null ? null : (i + delta + REST_GALLERY.length) % REST_GALLERY.length))
  }, [])

  // Листание стрелками, пока открыт лайтбокс
  useEffect(() => {
    if (index === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [index, go])

  return (
    <section id="gallery" className="border-t border-line px-4 py-16 sm:px-6 sm:py-24">
      <div className="reveal mx-auto w-full max-w-6xl">
        <div className="flex flex-col items-center text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
            Интерьер
          </span>
          <h2 className="mt-5 font-head text-3xl font-semibold leading-tight text-ink sm:text-4xl">
            Как у нас внутри
          </h2>
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-ink-soft">
            Нажмите на любой кадр, чтобы рассмотреть подробнее. Листать можно стрелками на
            клавиатуре.
          </p>
        </div>

        <div className="mt-12 grid auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[220px] lg:grid-cols-4">
          {REST_GALLERY.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Открыть: ${item.title}`}
              className={cn(
                'group relative cursor-pointer overflow-hidden',
                item.wide && 'col-span-2',
              )}
            >
              <ProductArt
                glyph={item.glyph}
                hue={item.hue}
                scale="lg"
                className="h-full w-full transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4 text-left">
                <span className="font-head text-[17px] font-semibold text-white drop-shadow">
                  {item.title}
                </span>
                <Expand
                  size={18}
                  className="shrink-0 text-white opacity-0 transition group-hover:opacity-100"
                />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Лайтбокс */}
      <Modal
        open={current !== null}
        onClose={() => setIndex(null)}
        size="lg"
        label={current?.title ?? 'Фотография'}
      >
        {current && (
          <div>
            <div className="relative">
              <ProductArt
                glyph={current.glyph}
                hue={current.hue}
                scale="xl"
                className="h-72 w-full sm:h-[26rem]"
              />
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Предыдущий кадр"
                className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-black/45 text-white backdrop-blur transition hover:bg-black/70"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Следующий кадр"
                className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-black/45 text-white backdrop-blur transition hover:bg-black/70"
              >
                <ChevronRight size={22} />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-head text-2xl font-semibold text-ink">{current.title}</h2>
                <span className="shrink-0 text-[13px] tabular-nums text-ink-soft">
                  {(index ?? 0) + 1} / {REST_GALLERY.length}
                </span>
              </div>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{current.caption}</p>
            </div>
          </div>
        )}
      </Modal>
    </section>
  )
}

/* ============================ ОТЗЫВЫ ============================ */

export function RestaurantReviews() {
  return (
    <section id="reviews" className="border-t border-line px-4 py-16 sm:px-6 sm:py-24">
      <div className="reveal mx-auto w-full max-w-6xl">
        <div className="flex flex-col items-center text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
            Отзывы
          </span>
          <h2 className="mt-5 font-head text-3xl font-semibold leading-tight text-ink sm:text-4xl">
            Что говорят гости
          </h2>
          <div className="mt-5 flex items-center gap-3">
            <Rating value={4.8} size={18} />
            <span className="text-[15px] text-ink-soft">на основе 412 оценок</span>
          </div>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {REST_REVIEWS.map((review) => (
            <figure
              key={review.id}
              className="flex flex-col gap-4 border border-line bg-surface-2 p-6 transition hover:border-brand/40"
            >
              <Rating value={review.rating} size={15} />
              <blockquote className="flex-1 text-[15px] leading-relaxed text-ink">
                «{review.text}»
              </blockquote>
              <figcaption className="flex items-center gap-3 border-t border-line pt-4">
                <span
                  aria-hidden="true"
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full font-head text-lg font-semibold text-white"
                  style={{ backgroundColor: `hsl(${review.hue} 42% 45%)` }}
                >
                  {review.initial}
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold text-ink">{review.name}</span>
                  <span className="block text-[13px] text-ink-soft">{review.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
