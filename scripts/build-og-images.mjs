/**
 * Снимает картинки для превью ссылок (Open Graph): 1200×630, JPEG, в public/og.
 *
 * Мессенджеры показывают такую картинку, когда в чат кидают ссылку на сайт.
 * Снимок делается с настоящей страницы, поэтому после правок внешнего вида
 * картинки стоит переснять:
 *   npm run build && node scripts/build-og-images.mjs
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
  style.textContent = '[data-demo-bar] { display: none !important } .reveal { opacity: 1 !important; transform: none !important }'
  document.head.append(style)
  await document.fonts.ready
})()`

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

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
    console.log(`  ${file} — ${Math.round(image.length / 1024)} КБ`)
  }

  cdp.close()
  console.log(`\nготово: ${PAGES.length} картинок в public/og`)
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
