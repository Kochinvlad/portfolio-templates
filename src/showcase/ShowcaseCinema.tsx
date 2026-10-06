import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '../lib/cn'
import { useMediaQuery } from '../lib/hooks'
import { buttonStyles } from '../ui/Button'
import { HeroActions, HeroBadge, HeroGlow, HeroLead, HeroStats, HeroTitle } from './ShowcaseHeroParts'
import { STICKY_LAYERS } from './stickyLayers'
import { TEMPLATES, type TemplateMeta } from './templates'

/*
  Кинематографичный первый экран: при прокрутке камера летит сквозь тёмное
  пространство и по очереди останавливается у каждого шаблона.

  Как устроено:
  - секция высотой в несколько экранов, внутри неё сцена прилипает к окну (sticky);
  - GSAP ScrollTrigger переводит прокрутку в движение виртуальной камеры;
  - у каждой остановки страница шаблона листается внутри рамки браузера и телефона —
    видно весь сайт, а шапка и панель фильтров прилипают, как на настоящей странице;
    пространство вокруг перекрашивается в цвета шаблона;
  - на каждом кадре меняются только transform и opacity — это делает видеокарта,
    страница не перерисовывается.
*/

/** Перспектива сцены в пикселях: чем меньше, тем сильнее ощущение глубины. */
const PERSPECTIVE = 1000
/** Расстояние между экранами по глубине. */
const DEPTH_STEP = 1600
/** Сколько экранов прокрутки занимает полёт. */
const SCROLL_SCREENS = 7

/** Разброс экранов по сторонам, в процентах от их размера, — чтобы сцена не была коридором. */
const LAYOUT = [
  { x: -22, y: 8 },
  { x: 24, y: -10 },
  { x: -18, y: -6 },
  { x: 20, y: 10 },
]

/**
 * Как ставить экран при остановке, в зависимости от ширины окна:
 * height — доля высоты окна, width — предельная доля ширины,
 * shiftX/shiftY — сдвиг экрана в процентах его размера (освободить место подписи).
 */
const FRAMING = {
  phone: { height: 0.5, width: 0.62, shiftX: 0, shiftY: 8 },
  tablet: { height: 0.5, width: 0.86, shiftX: 0, shiftY: 0 },
  desktop: { height: 0.6, width: 0.58, shiftX: 25, shiftY: 0 },
}

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

/** Расстояние остановки по умолчанию — для первого кадра, пока не измерены экраны. */
const DEFAULT_FOCUS = 900

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/**
 * Яркость экрана по расстоянию до камеры. Вдали — как в дымке. Ближе точки остановки
 * экран гаснет: иначе при пролёте сквозь него раздувался полупрозрачный кадр,
 * а за ним просвечивал следующий шаблон.
 */
function panelOpacity(depth: number, focus: number): number {
  const distance = -depth
  if (distance < focus) return clamp01((distance - 0.4 * focus) / (0.5 * focus))
  const haze = clamp01((distance - focus - 600) / 4000)
  return 1 - haze * 0.8
}

function panelStyle(index: number, cam: Camera, focus = DEFAULT_FOCUS) {
  const spot = LAYOUT[index % LAYOUT.length]
  // Глубина экрана относительно камеры: отрицательная — экран перед камерой
  const depth = cam.z - DEPTH_STEP * (index + 1)
  return {
    transform: `translate(-50%, -50%) translate3d(${spot.x - cam.x}%, ${spot.y - cam.y}%, ${depth}px)`,
    opacity: panelOpacity(depth, focus) * cam.reveal,
  }
}

/** Пол — нейтральные линии: цвет пространству дают слои шаблонов под ним. */
const FLOOR_LINES =
  'linear-gradient(rgba(255,255,255,0.32) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.32) 1px, transparent 1px)'
const FLOOR_FADE = 'linear-gradient(to top, #000 0%, transparent 85%)'

const previewUrl = (file: string) => `${import.meta.env.BASE_URL}previews/${file}.webp`

/** Свет и фон «мира» шаблона. Неподвижны, меняется только прозрачность слоя. */
function sceneBackground({ scene }: TemplateMeta) {
  return [
    `radial-gradient(70% 55% at 50% 0%, ${scene.glow}59, transparent 70%)`,
    `radial-gradient(45% 45% at 88% 100%, ${scene.accent}40, transparent 70%)`,
    `radial-gradient(40% 40% at 8% 70%, ${scene.glow}26, transparent 70%)`,
    scene.bg,
  ].join(', ')
}

type ShotRefs = {
  viewport: (el: HTMLDivElement | null) => void
  image: (el: HTMLImageElement | null) => void
  layer: (index: number) => (el: HTMLImageElement | null) => void
  onLoad: () => void
}

const percent = (value: number, of: number) => `${(value / of) * 100}%`

/**
 * Страница шаблона в окне: длинный снимок уезжает вверх, а то, что на сайте прилипает
 * при прокрутке (шапка, панель фильтров), лежит поверх отдельными картинками и ведёт себя
 * как на сайте — см. scrollShot. file — имя длинного снимка без расширения; нет — ещё не грузим.
 */
function ScrollingPage({ file, refs }: { file?: string; refs: ShotRefs }) {
  if (!file) return null
  const sticky = STICKY_LAYERS[file]
  return (
    <>
      <img
        ref={refs.image}
        src={previewUrl(file)}
        alt=""
        decoding="async"
        onLoad={refs.onLoad}
        className="absolute inset-x-0 top-0 w-full"
      />
      {/* Отступ сверху в процентах считается от ширины окна: слой стоит на своём месте
          страницы ещё до первого кадра полёта */}
      {sticky?.layers.map((layer, j) => (
        <img
          key={layer.file}
          ref={refs.layer(j)}
          src={previewUrl(layer.file)}
          alt=""
          decoding="async"
          className="absolute top-0"
          style={{
            left: percent(layer.x, sticky.width),
            width: percent(layer.width, sticky.width),
            marginTop: percent(layer.y, sticky.width),
            zIndex: layer.z,
          }}
        />
      ))}
    </>
  )
}

/** Окно браузера: страница шаблона листается внутри, пока камера стоит рядом. */
function BrowserShot({ template, file, refs }: { template: TemplateMeta; file?: string; refs: ShotRefs }) {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-white/10 bg-surface-2"
      style={{
        boxShadow: `0 40px 140px -30px hsl(${template.hue} 85% 55% / 0.5), 0 0 0 1px hsl(${template.hue} 80% 70% / 0.18)`,
      }}
    >
      <div className="flex h-7 items-center gap-1.5 border-b border-white/10 bg-surface-3 px-3.5">
        <span className="h-2 w-2 rounded-full bg-white/25" />
        <span className="h-2 w-2 rounded-full bg-white/25" />
        <span className="h-2 w-2 rounded-full bg-white/25" />
        <span className="ml-2 text-[11px] text-ink-soft">{template.brand}</span>
      </div>
      {/* Пока грузится длинный снимок, видно превью: оно снято при той же ширине */}
      <div
        ref={refs.viewport}
        className="relative aspect-[16/10] overflow-hidden bg-top bg-no-repeat"
        style={{ backgroundImage: `url(${previewUrl(template.slug)})`, backgroundSize: '100% auto' }}
      >
        <ScrollingPage file={file} refs={refs} />
      </div>
    </div>
  )
}

/** Телефон с мобильной версией — видно, что сайт удобен и с маленького экрана. */
function PhoneShot({ file, refs, className }: { file?: string; refs: ShotRefs; className?: string }) {
  return (
    <div
      className={cn(
        'rounded-[1.7rem] border-[5px] border-[#0b0b10] bg-[#0b0b10] shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8)]',
        className,
      )}
    >
      <div ref={refs.viewport} className="relative aspect-[9/19.5] overflow-hidden rounded-[1.3rem] bg-surface-3">
        <ScrollingPage file={file} refs={refs} />
      </div>
    </div>
  )
}

/**
 * Одна листаемая картинка: окно, сам снимок, прилипающие слои поверх, сколько пикселей
 * можно пролистать и ширина окна.
 */
type Shot = {
  viewport: HTMLDivElement | null
  image: HTMLImageElement | null
  layers: Array<HTMLImageElement | null>
  range: number
  width: number
}

const emptyShots = (): Shot[] =>
  TEMPLATES.map(() => ({ viewport: null, image: null, layers: [], range: 0, width: 0 }))

/**
 * Листает снимок на долю p. Прилипающие слои — как на сайте: едут вместе со страницей,
 * пока не дойдут до своей отметки от верха окна, там стоят, а у конца родителя уезжают дальше.
 */
function scrollShot(shot: Shot, file: string, p: number) {
  if (!shot.image) return
  const offset = p * shot.range
  shot.image.style.transform = `translate3d(0, ${-offset}px, 0)`
  const sticky = STICKY_LAYERS[file]
  if (!sticky) return
  // Пикселей окна на пиксель снимка
  const k = shot.width / sticky.width
  sticky.layers.forEach((layer, j) => {
    const el = shot.layers[j]
    if (!el) return
    const top = Math.min(Math.max(layer.y * k - offset, layer.stick * k), layer.limit * k - offset)
    el.style.transform = `translate3d(0, ${top - layer.y * k}px, 0)`
  })
}

export function CinemaHero({ fallback }: { fallback: ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const outroRef = useRef<HTMLDivElement>(null)
  const floorRef = useRef<HTMLDivElement>(null)
  const panelRefs = useRef<Array<HTMLDivElement | null>>([])
  const captionRefs = useRef<Array<HTMLDivElement | null>>([])
  const sceneRefs = useRef<Array<HTMLDivElement | null>>([])
  const pageShots = useRef<Shot[]>(emptyShots())
  const phoneShots = useRef<Shot[]>(emptyShots())
  // GSAP не загрузился (например, оборвалась сеть) — показываем статичный экран
  const [failed, setFailed] = useState(false)
  /**
   * У какой остановки камера: -1 — полёт ещё не начался. Длинные снимки грузим только
   * для неё и соседних: первый экран не тяжелеет, а в памяти не висят все восемь картинок.
   */
  const [near, setNear] = useState(-1)

  const wide = useMediaQuery('(min-width: 640px)')
  const desktop = useMediaQuery('(min-width: 1024px)')
  const framing = desktop ? FRAMING.desktop : wide ? FRAMING.tablet : FRAMING.phone

  /** Перерисовка сцены по текущей прокрутке. Пока GSAP не загружен (и после разбора сцены) — пустышка. */
  const renderRef = useRef(() => {})

  /** Ширина окон и сколько можно пролистать каждый снимок. Меряем при загрузке и смене размера. */
  const measure = () => {
    for (const shot of [...pageShots.current, ...phoneShots.current]) {
      if (!shot.viewport) continue
      shot.width = shot.viewport.clientWidth
      if (!shot.image || !shot.image.complete) continue
      shot.range = Math.max(0, shot.image.offsetHeight - shot.viewport.clientHeight)
    }
  }

  const shotRefs = (store: typeof pageShots, i: number): ShotRefs => ({
    viewport: (el) => {
      store.current[i].viewport = el
    },
    image: (el) => {
      store.current[i].image = el
    },
    layer: (j) => (el) => {
      store.current[i].layers[j] = el
    },
    // Снимок догрузился, когда камера уже стоит: сразу ставим его на нужное место, не дожидаясь прокрутки
    onLoad: () => {
      measure()
      renderRef.current()
    },
  })

  // Новые снимки появились в окне загрузки — расставляем их слои по текущей прокрутке
  useEffect(() => {
    renderRef.current()
  }, [near])

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

      // На какой глубине остановиться у экрана, чтобы он занял нужную долю окна
      const panel = panelRefs.current[0]
      const panelHeight = panel?.offsetHeight ?? 400
      const panelWidth = panel?.offsetWidth ?? 640
      const targetHeight = Math.min(
        window.innerHeight * framing.height,
        ((window.innerWidth * framing.width) / panelWidth) * panelHeight,
      )
      const focus = Math.max(120, PERSPECTIVE * (panelHeight / targetHeight - 1))
      const stopZ = (i: number) => DEPTH_STEP * (i + 1) - focus

      const cam: Camera = { ...START }
      let lastNear = -1
      // Насколько пролистана страница каждого шаблона, 0–1
      const pages = TEMPLATES.map(() => ({ p: 0 }))

      const render = () => {
        panelRefs.current.forEach((el, i) => {
          if (!el) return
          const { transform, opacity } = panelStyle(i, cam, focus)
          el.style.transform = transform
          el.style.opacity = String(opacity)
        })
        // Мир шаблона проявляется, пока камера рядом с ним, и гаснет на перелёте
        sceneRefs.current.forEach((el, i) => {
          if (!el) return
          const near = clamp01(1 - Math.abs(cam.z - stopZ(i)) / (DEPTH_STEP * 0.6))
          el.style.opacity = String(near * cam.reveal)
        })
        TEMPLATES.forEach(({ slug }, i) => {
          scrollShot(pageShots.current[i], `${slug}-page`, pages[i].p)
          scrollShot(phoneShots.current[i], `${slug}-phone`, pages[i].p)
        })
        // Ближайшая остановка: по ней решаем, какие длинные снимки держать загруженными
        if (cam.reveal > 0) {
          const index = Math.round((cam.z - stopZ(0)) / DEPTH_STEP)
          const current = Math.min(TEMPLATES.length - 1, Math.max(0, index))
          if (current !== lastNear) {
            lastNear = current
            setNear(current)
          }
        }
        // Пол бежит навстречу — так полёт читается даже между экранами
        if (floorRef.current) {
          floorRef.current.style.transform = `translate3d(0, ${(cam.z * 0.35) % 80}px, 0)`
        }
      }

      measure()
      renderRef.current = render
      const onResize = () => {
        measure()
        render()
      }
      window.addEventListener('resize', onResize)

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' }, onUpdate: render })

        // Вступление уходит целиком до того, как проявятся экраны: без двойной экспозиции
        tl.to(introRef.current, { autoAlpha: 0, y: -60, duration: 0.4, ease: 'power1.in' }, 0)
        tl.to(cam, { reveal: 1, duration: 0.4, ease: 'power1.out' }, 0.35)

        TEMPLATES.forEach((_, i) => {
          const spot = LAYOUT[i % LAYOUT.length]
          const caption = captionRefs.current[i]
          // Первый перелёт начинается вместе с уходом вступления, следующие — с уходом подписи
          tl.to(
            cam,
            { x: spot.x - framing.shiftX, y: spot.y + framing.shiftY, z: stopZ(i), duration: 1 },
            i === 0 ? 0.2 : '<',
          )
          tl.fromTo(
            caption,
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out' },
            '>-0.2',
          )
          // Пока камера стоит, страница шаблона листается сверху донизу
          tl.to(pages[i], { p: 1, duration: 1.6, ease: 'none' }, '<')
          tl.to(caption, { autoAlpha: 0, y: -16, duration: 0.25, ease: 'power1.in' }, '>-0.05')
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

      revert = () => {
        renderRef.current = () => {}
        window.removeEventListener('resize', onResize)
        ctx.revert()
      }
    }

    setup().catch(() => {
      if (!disposed) setFailed(true)
    })

    return () => {
      disposed = true
      revert()
    }
    // Раскладка зависит от ширины окна: при смене ширины сцену собираем заново
  }, [framing])

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

        {/* Миры шаблонов: у каждого свой фон и свет, проявляются по очереди */}
        {TEMPLATES.map((template, i) => (
          <div
            key={template.slug}
            ref={(el) => {
              sceneRefs.current[i] = el
            }}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 will-change-[opacity]"
            style={{ background: sceneBackground(template) }}
          />
        ))}

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
              className="absolute inset-x-0 -top-20 bottom-0 opacity-40 will-change-transform"
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
            {TEMPLATES.map((template, i) => {
              // Текущая остановка и соседние; мобильную версию первого шаблона грузим сразу —
              // на телефоне это первый же кадр
              const inWindow = near >= 0 && Math.abs(i - near) <= 1
              const phoneFile = inWindow || i === 0 ? `${template.slug}-phone` : undefined
              const pageFile = inWindow ? `${template.slug}-page` : undefined
              return (
                <div
                  key={template.slug}
                  ref={(el) => {
                    panelRefs.current[i] = el
                  }}
                  className={cn(
                    'absolute left-1/2 top-1/2 will-change-transform',
                    wide ? 'w-[78vw] max-w-[860px]' : 'w-[62vw] max-w-[300px]',
                  )}
                  style={panelStyle(i, START)}
                >
                  {wide ? (
                    <div className="relative">
                      <BrowserShot template={template} file={pageFile} refs={shotRefs(pageShots, i)} />
                      <PhoneShot
                        file={phoneFile}
                        refs={shotRefs(phoneShots, i)}
                        className="absolute -bottom-[9%] -right-[5%] w-[21%]"
                      />
                    </div>
                  ) : (
                    <PhoneShot file={phoneFile} refs={shotRefs(phoneShots, i)} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Затемнение снизу — подписи читаются поверх любого кадра */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-surface/90 to-transparent lg:hidden"
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

        {/*
          Подписи к шаблонам: появляются, когда камера останавливается.
          На компьютере — слева от экрана, на телефоне и планшете — под ним.
        */}
        {TEMPLATES.map((template, i) => (
          <div
            key={template.slug}
            ref={(el) => {
              captionRefs.current[i] = el
            }}
            className="invisible absolute inset-x-0 bottom-[5%] mx-auto w-[min(92vw,640px)] px-4 text-center opacity-0 lg:inset-x-auto lg:bottom-auto lg:left-[4vw] lg:top-1/2 lg:mx-0 lg:w-[min(28vw,360px)] lg:-translate-y-1/2 lg:px-0 lg:text-left"
          >
            <p className="font-head text-[13px] font-bold tabular-nums text-brand-text">
              {String(i + 1).padStart(2, '0')} / {String(TEMPLATES.length).padStart(2, '0')}
            </p>
            <p className="mt-2 font-head text-2xl font-extrabold text-ink sm:text-3xl lg:text-4xl">
              {template.name}
            </p>
            <p className="mt-2 text-[15px] text-ink-soft lg:text-[16px]">{template.tagline}</p>
            <p className="mt-0.5 text-[15px] text-ink-soft lg:text-[16px]">
              {template.price}, {template.term}
            </p>
            <Link to={`/${template.slug}`} className={buttonStyles('primary', 'md', 'mt-4 lg:mt-6')}>
              Открыть демо
            </Link>
          </div>
        ))}

        {/* Финал: камера пролетела сквозь экраны */}
        <div
          ref={outroRef}
          className="invisible absolute inset-0 flex flex-col items-center justify-center px-4 pt-16 text-center opacity-0 sm:px-6"
        >
          <h2 className="max-w-3xl text-balance font-head text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Выбирайте основу&nbsp;— остальное соберём под вас
          </h2>
          <HeroActions className="mt-8" />
          <HeroStats className="mt-10 w-full" />
        </div>
      </div>
    </section>
  )
}
