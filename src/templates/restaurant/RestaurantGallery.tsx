import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Rating } from '../../ui/Bits'
import { Modal } from '../../ui/Modal'
import { photoUrl } from '../../lib/photos'
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
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-12">
          <h2 className="font-head text-4xl font-normal leading-[1.1] text-ink sm:text-5xl">
            Как у нас внутри
          </h2>
          <p className="max-w-sm text-[15px] leading-relaxed text-ink-soft">
            Нажмите на кадр, чтобы рассмотреть подробнее. Листать можно стрелками на клавиатуре.
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
                photo={photoUrl(item.id)}
                alt={item.caption}
                scale="lg"
                className="h-full w-full transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4 text-left">
                <span className="font-head text-[19px] text-white drop-shadow">
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
                photo={photoUrl(current.id)}
                alt={current.caption}
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
                <h2 className="font-head text-[26px] font-normal text-ink">{current.title}</h2>
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
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-12">
          <h2 className="font-head text-4xl font-normal leading-[1.1] text-ink sm:text-5xl">
            Что говорят гости
          </h2>
          <div className="flex items-center gap-3">
            <Rating value={4.8} size={18} />
            <span className="text-[15px] text-ink-soft">по 412 оценкам</span>
          </div>
        </div>

        {/* Без карточек и аватарок: в отзыве главное — слова гостя */}
        <div className="mt-12 grid gap-10 lg:grid-cols-3 lg:gap-12">
          {REST_REVIEWS.map((review) => (
            <figure key={review.id} className="flex flex-col border-t border-ink pt-6">
              <Rating value={review.rating} size={14} />
              <blockquote className="mt-5 flex-1 font-head text-[20px] leading-snug text-ink">
                «{review.text}»
              </blockquote>
              <figcaption className="mt-6 text-[14px] leading-snug">
                <span className="block font-semibold text-ink">{review.name}</span>
                <span className="text-ink-soft">{review.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
