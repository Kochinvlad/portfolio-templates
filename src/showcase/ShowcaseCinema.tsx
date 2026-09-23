import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { HeroActions, HeroBadge, HeroGlow, HeroLead, HeroStats, HeroTitle } from './ShowcaseHeroParts'
import { TEMPLATES } from './templates'

/*
  Кинематографичный первый экран: при прокрутке камера летит сквозь тёмное
  пространство, где висят экраны с настоящими шаблонами, и по очереди
  останавливается у каждого.

  Как устроено:
  - секция высотой в несколько экранов, внутри неё сцена прилипает к окну (sticky);
  - GSAP ScrollTrigger переводит прокрутку в движение виртуальной камеры;
  - экраны — картинки с 3D-трансформацией, их положение считается от камеры
    на каждом кадре. Меняются только transform и opacity — это делает видеокарта,
    страница не перерисовывается.
*/

/** Перспектива сцены в пикселях: чем меньше, тем сильнее ощущение глубины. */
const PERSPECTIVE = 1000
/** Расстояние между экранами по глубине. */
const DEPTH_STEP = 1600
/** Сколько экранов прокрутки занимает полёт. */
const SCROLL_SCREENS = 5
/** Какую долю высоты окна занимает экран шаблона, когда камера у него остановилась. */
const FOCUS_HEIGHT = 0.5

/** Разброс экранов по сторонам, в процентах от их размера, — чтобы сцена не была коридором. */
const LAYOUT = [
  { x: -22, y: 8 },
  { x: 24, y: -10 },
  { x: -18, y: -6 },
  { x: 20, y: 10 },
]

type Camera = {
  x: number
  y: number
  z: number
  /**
   * Проявленность сцены, 0–1. На первом кадре экраны спрятаны, чтобы не раскрывать,
   * что будет дальше: они выплывают из дымки, только когда начинаешь листать.
   */
  reveal: number
}

const START: Camera = { x: 0, y: 0, z: 0, reveal: 0 }

/** Яркость экрана по расстоянию до камеры: вдали — как в дымке, при пролёте сквозь — гаснет. */
function panelOpacity(depth: number): number {
  if (depth > 0) return Math.max(0, 1 - depth / 350)
  const haze = Math.min(1, Math.max(0, (-depth - 600) / 4000))
  return 1 - haze * 0.8
}

function panelStyle(index: number, cam: Camera) {
  const spot = LAYOUT[index % LAYOUT.length]
  // Глубина экрана относительно камеры: отрицательная — экран перед камерой
  const depth = cam.z - DEPTH_STEP * (index + 1)
  return {
    transform: `translate(-50%, -50%) translate3d(${spot.x - cam.x}%, ${spot.y - cam.y}%, ${depth}px)`,
    opacity: panelOpacity(depth) * cam.reveal,
  }
}

const FLOOR_LINES =
  'linear-gradient(rgba(129,140,248,0.45) 1px, transparent 1px), linear-gradient(90deg, rgba(129,140,248,0.45) 1px, transparent 1px)'
const FLOOR_FADE = 'linear-gradient(to top, #000 0%, transparent 85%)'

export function CinemaHero({ fallback }: { fallback: ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const outroRef = useRef<HTMLDivElement>(null)
  const floorRef = useRef<HTMLDivElement>(null)
  const panelRefs = useRef<Array<HTMLDivElement | null>>([])
  const captionRefs = useRef<Array<HTMLDivElement | null>>([])
  // GSAP не загрузился (например, оборвалась сеть) — показываем статичный экран
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let disposed = false
    let revert = () => {}

    async function setup() {
      // GSAP грузим только здесь: страницам шаблонов он не нужен
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])
      if (disposed) return
      gsap.registerPlugin(ScrollTrigger)
      // Адресная строка на телефоне меняет только высоту окна — позиции пересчитывать
      // не нужно (секция задана в vh), а пересчёт на лету дёргал бы сцену
      ScrollTrigger.config({ ignoreMobileResize: true })

      const cam: Camera = { ...START }
      const render = () => {
        panelRefs.current.forEach((panel, i) => {
          if (!panel) return
          const { transform, opacity } = panelStyle(i, cam)
          panel.style.transform = transform
          panel.style.opacity = String(opacity)
        })
        // Пол бежит навстречу — так полёт читается даже между экранами
        if (floorRef.current) {
          floorRef.current.style.transform = `translate3d(0, ${(cam.z * 0.35) % 80}px, 0)`
        }
      }

      // На какой глубине остановиться у экрана, чтобы он занял FOCUS_HEIGHT окна
      const panelHeight = panelRefs.current[0]?.offsetHeight ?? 400
      const focus = Math.max(
        120,
        PERSPECTIVE * (panelHeight / (window.innerHeight * FOCUS_HEIGHT) - 1),
      )

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' }, onUpdate: render })

        tl.to(introRef.current, { autoAlpha: 0, y: -60, duration: 0.5, ease: 'power1.in' }, 0)
        // Экраны проявляются, пока уходит вступление, — сюрприз с первого движения колеса
        tl.to(cam, { reveal: 1, duration: 0.45, ease: 'power1.out' }, 0.05)

        TEMPLATES.forEach((_, i) => {
          const spot = LAYOUT[i % LAYOUT.length]
          const caption = captionRefs.current[i]
          // Первый перелёт начинается вместе с уходом вступления, следующие — с уходом подписи
          tl.to(
            cam,
            { x: spot.x, y: spot.y, z: DEPTH_STEP * (i + 1) - focus, duration: 1 },
            i === 0 ? 0.1 : '<',
          )
          tl.fromTo(
            caption,
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out' },
            '>-0.2',
          )
          tl.to({}, { duration: 0.5 }) // пауза у экрана — успеть прочитать
          tl.to(caption, { autoAlpha: 0, y: -16, duration: 0.25, ease: 'power1.in' })
        })

        // Финал: камера пролетает сквозь последний экран, появляется призыв
        tl.to(cam, { z: DEPTH_STEP * TEMPLATES.length + 700, duration: 1 }, '<')
        tl.fromTo(
          outroRef.current,
          { autoAlpha: 0, y: 30 },
          { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' },
          '-=0.35',
        )
        tl.to({}, { duration: 0.4 })

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          animation: tl,
        })
      }, sectionRef)

      revert = () => ctx.revert()
    }

    setup().catch(() => {
      if (!disposed) setFailed(true)
    })

    return () => {
      disposed = true
      revert()
    }
  }, [])

  if (failed) return <>{fallback}</>

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative"
      style={{ height: `${SCROLL_SCREENS * 100}vh` }}
    >
      {/* dvh, а не svh: на телефоне адресная строка прячется при прокрутке, и сцена должна
          вырасти вместе с окном — иначе снизу откроется полоса со следующим разделом */}
      <div className="sticky top-0 h-dvh overflow-hidden">
        <HeroGlow />

        {/* Светящийся пол уходит к горизонту. Маска на родителе, движение — на дочернем слое */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] overflow-hidden"
          style={{
            perspective: '500px',
            perspectiveOrigin: '50% 0%',
            maskImage: FLOOR_FADE,
            WebkitMaskImage: FLOOR_FADE,
          }}
        >
          <div className="absolute inset-x-[-60%] top-0 h-[300%] origin-top" style={{ transform: 'rotateX(72deg)' }}>
            <div
              ref={floorRef}
              className="absolute inset-x-0 -top-20 bottom-0 opacity-50 will-change-transform"
              style={{ backgroundImage: FLOOR_LINES, backgroundSize: '80px 80px' }}
            />
          </div>
        </div>

        {/* Экраны с шаблонами в 3D-пространстве */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ perspective: `${PERSPECTIVE}px`, perspectiveOrigin: '50% 45%' }}
        >
          <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
            {TEMPLATES.map((template, i) => (
              <div
                key={template.slug}
                ref={(el) => {
                  panelRefs.current[i] = el
                }}
                className="absolute left-1/2 top-1/2 w-[88vw] max-w-[880px] will-change-transform sm:w-[78vw]"
                style={panelStyle(i, START)}
              >
                <div
                  className="overflow-hidden rounded-2xl border border-white/10 bg-surface-2"
                  style={{
                    boxShadow: `0 40px 140px -30px hsl(${template.hue} 85% 55% / 0.55), 0 0 0 1px hsl(${template.hue} 80% 70% / 0.18)`,
                  }}
                >
                  <div className="flex h-7 items-center gap-1.5 border-b border-white/10 bg-surface-3 px-3.5">
                    <span className="h-2 w-2 rounded-full bg-white/25" />
                    <span className="h-2 w-2 rounded-full bg-white/25" />
                    <span className="h-2 w-2 rounded-full bg-white/25" />
                    <span className="ml-2 text-[11px] text-ink-soft">{template.slug}.ru</span>
                  </div>
                  <img
                    src={`${import.meta.env.BASE_URL}previews/${template.slug}.webp`}
                    alt=""
                    decoding="async"
                    className="aspect-[16/10] w-full object-cover object-top"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Затемнение снизу — подписи читаются поверх любого кадра */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-surface/90 to-transparent"
        />

        {/* Вступление: видно до начала полёта */}
        <div
          ref={introRef}
          className="absolute inset-0 flex flex-col items-center justify-center px-4 pt-16 text-center sm:px-6"
        >
          <div className="relative mx-auto w-full max-w-4xl">
            {/* Мягкая подложка под текстом: экраны позади не спорят с заголовком */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-10 -inset-y-16 rounded-full bg-surface/85 blur-3xl"
            />
            <div className="relative">
              <HeroBadge />
              <HeroTitle />
              <HeroLead />
              <HeroActions className="mt-8" />
            </div>
          </div>
          <span className="absolute bottom-6 flex items-center gap-2 text-[13px] font-medium text-ink-soft">
            <ArrowDown size={15} className="animate-bounce" />
            Листайте — покажем шаблоны
          </span>
        </div>

        {/* Подписи к экранам: появляются, когда камера останавливается у шаблона */}
        {TEMPLATES.map((template, i) => (
          <div
            key={template.slug}
            ref={(el) => {
              captionRefs.current[i] = el
            }}
            className="invisible absolute inset-x-0 bottom-[7%] mx-auto w-[min(92vw,640px)] px-4 text-center opacity-0"
          >
            <p className="font-head text-[12px] font-bold uppercase tracking-[0.25em] text-[#a5b4fc]">
              {String(i + 1).padStart(2, '0')} / {String(TEMPLATES.length).padStart(2, '0')}
            </p>
            <p className="mt-2 font-head text-2xl font-extrabold text-ink sm:text-3xl">
              {template.name}
            </p>
            <p className="mt-1.5 text-[15px] text-ink-soft">
              {template.tagline} · {template.price} · {template.term}
            </p>
            <Link
              to={`/${template.slug}`}
              className="mt-4 inline-flex items-center gap-1.5 text-[15px] font-semibold text-[#a5b4fc] transition hover:text-white"
            >
              Открыть демо
              <ArrowRight size={16} />
            </Link>
          </div>
        ))}

        {/* Финал: камера пролетела сквозь экраны */}
        <div
          ref={outroRef}
          className="invisible absolute inset-0 flex flex-col items-center justify-center px-4 pt-16 text-center opacity-0 sm:px-6"
        >
          <h2 className="max-w-3xl text-balance font-head text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Выбирайте основу — остальное соберём под вас
          </h2>
          <HeroActions className="mt-8" />
          <HeroStats className="mt-10 w-full" />
        </div>
      </div>
    </section>
  )
}
