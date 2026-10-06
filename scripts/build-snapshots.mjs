/**
 * Снимает с настоящих страниц две серии картинок:
 *
 * 1. public/og/*.jpg — превью ссылок (Open Graph), 1200×630. Их показывают
 *    мессенджеры, когда в чат кидают ссылку на сайт.
 * 2. public/previews/*.webp — скриншоты шаблонов, 1660×900. Они стоят на карточках
 *    витрины и в 3D-сцене на первом экране. Там же страницы целиком для «полёта»
 *    (<шаблон>-page и -phone) и их шапки отдельными картинками (-page-head, -phone-head).
 *
 * После правок внешнего вида снимки стоит переснять:
 *   npm run build && node scripts/build-snapshots.mjs
 *
 * Нужен установленный Edge или Chrome; другой путь можно указать в BROWSER_PATH.
 * Скрипт сам поднимает vite preview и управляет браузером через протокол DevTools —
 * лишних зависимостей в проект не добавляет.
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { TEMPLATES } from '../src/showcase/templates.ts'

const ROOT = path.resolve(import.meta.dirname, '..')
const OUT_DIR = path.join(ROOT, 'public', 'og')
const PREVIEW_PORT = 4199
const DEBUG_PORT = 9333
const WIDTH = 1200
const HEIGHT = 630
/** Качество JPEG: WhatsApp не показывает превью тяжелее 300 КБ. */
const QUALITY = 82
/** Пауза после загрузки: шрифты, анимации появления, фотографии. */
const SETTLE_MS = 2500
/** Сколько ждать ответа браузера на одну команду. */
const COMMAND_TIMEOUT_MS = 30000

const PAGES = [
  { file: 'showcase.jpg', route: '' },
  ...TEMPLATES.map(({ slug }) => ({ file: `${slug}.jpg`, route: slug })),
]

const PREVIEW_DIR = path.join(ROOT, 'public', 'previews')
const PREVIEW_WIDTH = 1660
const PREVIEW_HEIGHT = 900
const PREVIEW_QUALITY = 80

/**
 * Страницы целиком — для «полёта» на витрине: сайт листается внутри экрана.
 * Компьютер снимается при той же ширине, что и превью, поэтому превью служит
 * заглушкой, пока грузится длинный снимок. Высоту ограничиваем ради веса: в полёте
 * страница листается секунды, и первых экранов хватает, чтобы понять сайт.
 */
const PAGE_SHOTS = [
  { suffix: 'page', width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT, mobile: false, scale: 1200 / PREVIEW_WIDTH, maxHeight: 5000 },
  // Телефон чуть крупнее родного размера — иначе на экранах с плотными пикселями мыльно
  { suffix: 'phone', width: 390, height: 844, mobile: true, scale: 1.2, maxHeight: 4200 },
]
const PAGE_QUALITY = 60

/**
 * Нижний край шапки, которая прилипает к верху окна. В «полёте» её показывают отдельной
 * картинкой поверх страницы: страница листается, а шапка стоит на месте, как на сайте.
 */
const STICKY_HEADER_BOTTOM = `(() => {
  const header = [...document.querySelectorAll('header')].find((el) => getComputedStyle(el).position === 'sticky')
  return header ? Math.ceil(header.getBoundingClientRect().bottom) : 0
})()`

/** Пролистывает страницу, чтобы подгрузились отложенные картинки, и возвращает высоту. */
const LOAD_WHOLE_PAGE = `(async () => {
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
  for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.8) {
    window.scrollTo({ top: y, behavior: 'instant' })
    await wait(120)
  }
  window.scrollTo({ top: 0, behavior: 'instant' })
  await Promise.all([...document.images].map((img) => img.complete ? null : new Promise((resolve) => {
    img.addEventListener('load', resolve, { once: true })
    img.addEventListener('error', resolve, { once: true })
    setTimeout(resolve, 5000)
  })))
  await wait(300)
  return document.documentElement.scrollHeight
})()`

/**
 * Какое место шаблона показать на скриншоте — то, где видно, что сайт живой:
 * меню или каталог с фотографиями, а не пустая шапка. Нет записи — снимается верх страницы.
 */
const PREVIEW_ANCHORS = {
  // У суши, ресторана и игрушек самое узнаваемое — первый экран (сет с печатью,
  // огонь, кубики), поэтому для них записи нет и снимается верх
  shop: '#catalog',
}

/** Прокручивает к нужному месту под шапку и ждёт, пока догрузятся фото в кадре. */
const scrollToAnchor = (selector) => `(async () => {
  const target = ${JSON.stringify(selector ?? null)}
  // Шаблон грузится отдельным файлом: сначала в #root стоит заглушка, якоря ещё нет
  for (let i = 0; target && i < 50 && !document.querySelector(target); i++) {
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  const el = target && document.querySelector(target)
  const header = document.querySelector('header')
  const offset = (header ? header.offsetHeight : 0) + 16
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: 'instant' })
  await new Promise((resolve) => setTimeout(resolve, 300))
  const inView = [...document.images].filter((img) => {
    const r = img.getBoundingClientRect()
    return r.bottom > 0 && r.top < window.innerHeight
  })
  await Promise.all(inView.map((img) => img.complete ? null : new Promise((resolve) => {
    img.addEventListener('load', resolve, { once: true })
    img.addEventListener('error', resolve, { once: true })
    setTimeout(resolve, 5000)
  })))
  return { found: Boolean(el), y: Math.round(window.scrollY) }
})()`

const BROWSERS = [
  process.env.BROWSER_PATH,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean)

/**
 * Ждём, пока приложение отрисуется, прячем плашку «Демо» и сразу показываем блоки,
 * которые обычно выезжают при прокрутке.
 */
const PREPARE_PAGE = `(async () => {
  for (let i = 0; i < 100 && !document.querySelector('#root > *'); i++) {
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  const style = document.createElement('style')
  style.textContent = '[data-demo-bar] { display: none !important }'
  document.head.append(style)
  await document.fonts.ready
})()`

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Без нового кадра браузер отдаёт старую картинку — ту, что была до прокрутки или смены
 * размеров (так вместо каталога выходила шапка). Выводим вкладку вперёд и ждём два кадра.
 */
async function freshFrame(cdp) {
  await cdp.send('Page.bringToFront')
  await cdp.send('Runtime.evaluate', {
    awaitPromise: true,
    expression: `Promise.race([
      new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
      new Promise((resolve) => setTimeout(resolve, 1500)),
    ])`,
  })
}

/** Сохраняет снимок из ответа браузера (base64) в public/previews/<name>.webp. */
function savePreview(name, data) {
  const image = Buffer.from(data, 'base64')
  fs.writeFileSync(path.join(PREVIEW_DIR, `${name}.webp`), image)
  console.log(`  previews/${name}.webp — ${Math.round(image.length / 1024)} КБ`)
}

/**
 * Ждёт выхода процесса: сначала даёт завершиться самому, потом завершает принудительно.
 * Браузер держит файлы профиля, пока не закроется целиком.
 */
function stop(child, graceMs) {
  return new Promise((resolve) => {
    if (child.exitCode !== null) return resolve()
    const giveUp = setTimeout(resolve, graceMs + 3000)
    child.once('exit', () => {
      clearTimeout(giveUp)
      resolve()
    })
    setTimeout(() => child.kill(), graceMs)
  })
}

/** Удаляет папку, как только браузер её отпустит. Не блокирует поток, пока ждёт. */
async function removeWhenReleased(dir, attempts = 20) {
  for (let i = 0; i < attempts; i++) {
    try {
      fs.rmSync(dir, { recursive: true, force: true })
      return
    } catch {
      await sleep(250)
    }
  }
  // Не страшно: это папка во временном каталоге, система уберёт её сама
  console.warn(`не удалось удалить временный профиль браузера: ${dir}`)
}

async function waitFor(url, timeoutMs = 20000) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url)
      if (res.ok) return res
    } catch {
      // сервер ещё не поднялся — пробуем снова
    }
    await sleep(200)
  }
  throw new Error(`не дождался ответа от ${url}`)
}

/**
 * Ограничивает ожидание ответа браузера. Зависшая страница должна падать с понятной
 * ошибкой, а не вешать скрипт. Таймер не держит процесс, если ждать больше нечего.
 */
function withTimeout(promise, what) {
  let timer
  const timeout = new Promise((_, fail) => {
    timer = setTimeout(() => fail(new Error(`${what}: браузер не ответил за ${COMMAND_TIMEOUT_MS / 1000} с`)), COMMAND_TIMEOUT_MS)
    timer.unref()
  })
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer))
}

/** Минимальный клиент протокола DevTools: команды и одноразовая подписка на событие. */
function connect(wsUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl)
    const pending = new Map()
    const waiters = new Map()
    let nextId = 1

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data)
      if (msg.id && pending.has(msg.id)) {
        const { ok, fail } = pending.get(msg.id)
        pending.delete(msg.id)
        if (msg.error) fail(new Error(msg.error.message))
        else ok(msg.result)
      } else if (msg.method && waiters.has(msg.method)) {
        waiters.get(msg.method).ok(msg.params)
        waiters.delete(msg.method)
      }
    }
    // Браузер упал или закрылся — всё, что ждало ответа, получает ошибку, а не висит
    ws.onclose = () => {
      const error = new Error('браузер закрыл соединение')
      for (const { fail } of [...pending.values(), ...waiters.values()]) fail(error)
      pending.clear()
      waiters.clear()
    }
    ws.onerror = () => reject(new Error('не удалось подключиться к браузеру'))
    ws.onopen = () =>
      resolve({
        send(method, params = {}) {
          const id = nextId++
          ws.send(JSON.stringify({ id, method, params }))
          return withTimeout(new Promise((ok, fail) => pending.set(id, { ok, fail })), method)
        },
        once(method) {
          return withTimeout(new Promise((ok, fail) => waiters.set(method, { ok, fail })), method)
        },
        close: () => ws.close(),
      })
  })
}

if (!fs.existsSync(path.join(ROOT, 'dist', 'index.html'))) {
  console.error('Нет папки dist — сначала выполните npm run build')
  process.exit(1)
}

const browserPath = BROWSERS.find((candidate) => fs.existsSync(candidate))
if (!browserPath) {
  console.error('Не нашёл Edge или Chrome — укажите путь в переменной BROWSER_PATH')
  process.exit(1)
}

fs.mkdirSync(OUT_DIR, { recursive: true })
const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'og-shots-'))

const preview = spawn(
  process.execPath,
  [path.join(ROOT, 'node_modules', 'vite', 'bin', 'vite.js'), 'preview', '--port', String(PREVIEW_PORT), '--strictPort', '--host', '127.0.0.1'],
  { cwd: ROOT, stdio: 'ignore' },
)
const browser = spawn(
  browserPath,
  [
    '--headless=new',
    `--remote-debugging-port=${DEBUG_PORT}`,
    `--user-data-dir=${profileDir}`,
    '--hide-scrollbars',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank',
  ],
  { stdio: 'ignore' },
)

// Управление самим браузером — чтобы в конце закрыть его штатно
let browserControl = null

try {
  const site = `http://127.0.0.1:${PREVIEW_PORT}/`
  await waitFor(site)
  const version = await (await waitFor(`http://127.0.0.1:${DEBUG_PORT}/json/version`)).json()
  browserControl = await connect(version.webSocketDebuggerUrl)

  const targets = await (await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/list`)).json()
  const tab = targets.find((target) => target.type === 'page')
  const cdp = await connect(tab.webSocketDebuggerUrl)

  await cdp.send('Page.enable')
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: WIDTH,
    height: HEIGHT,
    deviceScaleFactor: 1,
    mobile: false,
  })

  for (const { file, route } of PAGES) {
    // Подписываемся после перехода: иначе поймаем запоздалое событие от прошлой страницы
    await cdp.send('Page.navigate', { url: site + route })
    await cdp.once('Page.loadEventFired')
    await cdp.send('Runtime.evaluate', { expression: PREPARE_PAGE, awaitPromise: true })
    await sleep(SETTLE_MS)

    const { data } = await cdp.send('Page.captureScreenshot', {
      format: 'jpeg',
      quality: QUALITY,
      clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT, scale: 1 },
    })
    const image = Buffer.from(data, 'base64')
    fs.writeFileSync(path.join(OUT_DIR, file), image)
    console.log(`  og/${file} — ${Math.round(image.length / 1024)} КБ`)
  }

  // Скриншоты шаблонов для витрины: окно шире, и снимается не верх, а меню или каталог
  fs.mkdirSync(PREVIEW_DIR, { recursive: true })
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: PREVIEW_WIDTH,
    height: PREVIEW_HEIGHT,
    deviceScaleFactor: 1,
    mobile: false,
  })

  for (const { slug } of TEMPLATES) {
    await cdp.send('Page.navigate', { url: site + slug })
    await cdp.once('Page.loadEventFired')
    await cdp.send('Runtime.evaluate', { expression: PREPARE_PAGE, awaitPromise: true })
    await sleep(SETTLE_MS)
    const scrolled = await cdp.send('Runtime.evaluate', {
      expression: scrollToAnchor(PREVIEW_ANCHORS[slug]),
      awaitPromise: true,
      returnByValue: true,
    })
    // Без проверки неудачная прокрутка молча давала снимок шапки вместо каталога
    const where = scrolled.result?.value
    if (PREVIEW_ANCHORS[slug] && !(where?.found && where.y > 0)) {
      console.warn(`  previews/${slug}: не удалось прокрутить к ${PREVIEW_ANCHORS[slug]}`, JSON.stringify(where))
    }
    await sleep(800)
    await freshFrame(cdp)

    // Область — от текущей прокрутки, в координатах страницы
    const { data } = await cdp.send('Page.captureScreenshot', {
      format: 'webp',
      quality: PREVIEW_QUALITY,
      clip: { x: 0, y: where?.y ?? 0, width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT, scale: 1 },
    })
    savePreview(slug, data)
  }

  let heads = 0
  for (const shot of PAGE_SHOTS) {
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: shot.width,
      height: shot.height,
      deviceScaleFactor: 1,
      mobile: shot.mobile,
    })
    for (const { slug } of TEMPLATES) {
      await cdp.send('Page.navigate', { url: site + slug })
      await cdp.once('Page.loadEventFired')
      await cdp.send('Runtime.evaluate', { expression: PREPARE_PAGE, awaitPromise: true })
      await sleep(SETTLE_MS)
      const loaded = await cdp.send('Runtime.evaluate', {
        expression: LOAD_WHOLE_PAGE,
        awaitPromise: true,
        returnByValue: true,
      })
      const pageHeight = loaded.result?.value
      if (typeof pageHeight !== 'number') {
        console.warn(`  previews/${slug}-${shot.suffix}: не удалось пролистать страницу, снимок в один экран`)
      }
      const height = Math.min(typeof pageHeight === 'number' ? pageHeight : shot.height, shot.maxHeight)
      // Старую шапку убираем до записи новой страницы: если скрипт оборвётся между снимками,
      // шапка от прежней вёрстки не ляжет поверх новой страницы
      const headFile = `${slug}-${shot.suffix}-head`
      fs.rmSync(path.join(PREVIEW_DIR, `${headFile}.webp`), { force: true })
      // captureBeyondViewport рисует страницу за пределами окна целиком, шапка остаётся вверху
      const { data } = await cdp.send('Page.captureScreenshot', {
        format: 'webp',
        quality: PAGE_QUALITY,
        captureBeyondViewport: true,
        clip: { x: 0, y: 0, width: shot.width, height, scale: shot.scale },
      })
      savePreview(`${slug}-${shot.suffix}`, data)

      // Шапка — тем же масштабом, что и страница, чтобы легла поверх неё точно
      const header = await cdp.send('Runtime.evaluate', { expression: STICKY_HEADER_BOTTOM, returnByValue: true })
      const headerBottom = header.result?.value
      if (!(headerBottom > 0)) {
        console.warn(`  previews/${headFile}: не нашёл прилипающую шапку — в полёте она уедет вместе со страницей`)
        continue
      }
      await freshFrame(cdp)
      const head = await cdp.send('Page.captureScreenshot', {
        format: 'webp',
        quality: PREVIEW_QUALITY,
        clip: { x: 0, y: 0, width: shot.width, height: headerBottom, scale: shot.scale },
      })
      savePreview(headFile, head.data)
      heads++
    }
  }

  cdp.close()
  console.log(
    `\nготово: ${PAGES.length} превью ссылок, ${TEMPLATES.length} скриншотов шаблонов, ` +
      `${TEMPLATES.length * PAGE_SHOTS.length} страниц целиком и ${heads} шапок к ним`,
  )
} finally {
  // Штатное закрытие: браузер сам завершит все свои процессы и отпустит профиль.
  // Процесс, который мы запустили, на Windows бывает лишь пусковым — поэтому
  // закрываем через DevTools, а не убийством процесса. Браузер может закрыться
  // раньше, чем ответит, — ждём не дольше трёх секунд.
  if (browserControl) {
    await Promise.race([browserControl.send('Browser.close').catch(() => {}), sleep(3000)])
  }
  await Promise.all([stop(browser, 3000), stop(preview, 0)])
  await removeWhenReleased(profileDir)
}
