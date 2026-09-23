import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { SITE_NAME, TEMPLATES } from './src/showcase/templates'

/**
 * Базовый путь сайта.
 *
 * На GitHub Pages проект живёт не в корне домена, а по адресу
 * https://<ник>.github.io/<репозиторий>/ — поэтому все ссылки на скрипты и стили
 * должны начинаться с имени репозитория. Значение подставляет GitHub Actions,
 * локально и на других хостингах остаётся обычный корень.
 */
const base = process.env.VITE_BASE || '/'

/**
 * Версия сборки. В GitHub Actions подставляется хеш коммита, локально — время сборки.
 * Нужна, чтобы открытая у посетителя страница могла заметить, что вышла новая версия.
 */
const appVersion = process.env.VITE_APP_VERSION || new Date().toISOString()

/**
 * Полный адрес сайта — для превью ссылок. Мессенджеры принимают только
 * абсолютные ссылки на картинку. В GitHub Actions адрес приходит от
 * configure-pages; локально превью не нужны, остаётся базовый путь.
 */
const siteUrl = (process.env.VITE_SITE_URL || base).replace(/\/?$/, '/')

type PageMeta = {
  /** Путь страницы от корня сайта: '' для главной, 'sushi/' для шаблона. */
  path: string
  title: string
  description: string
  /** Файл из public/og или null, если картинку ещё не сняли. */
  image: string | null
  imageAlt: string
}

/** Экранирует текст для значения атрибута в HTML. */
function attr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}

/** Заголовок и описание, которые уже записаны в index.html. */
function readMeta(html: string): Pick<PageMeta, 'title' | 'description'> {
  return {
    title: html.match(/<title>([^<]*)<\/title>/)?.[1] ?? SITE_NAME,
    description: html.match(/<meta\s+name="description"\s+content="([^"]*)"/)?.[1] ?? '',
  }
}

/**
 * Прописывает странице заголовок, описание и метатеги Open Graph — по ним VK,
 * Telegram, WhatsApp и другие мессенджеры рисуют карточку ссылки.
 * Картинки лежат в public/og, снимает их scripts/build-og-images.mjs.
 */
function withPageMeta(html: string, page: PageMeta): string {
  const url = siteUrl + page.path
  const tags = [
    `<link rel="canonical" href="${attr(url)}" />`,
    '<meta property="og:type" content="website" />',
    '<meta property="og:locale" content="ru_RU" />',
    `<meta property="og:site_name" content="${attr(SITE_NAME)}" />`,
    `<meta property="og:title" content="${attr(page.title)}" />`,
    `<meta property="og:description" content="${attr(page.description)}" />`,
    `<meta property="og:url" content="${attr(url)}" />`,
  ]

  if (page.image) {
    tags.push(
      `<meta property="og:image" content="${attr(`${siteUrl}og/${page.image}`)}" />`,
      '<meta property="og:image:width" content="1200" />',
      '<meta property="og:image:height" content="630" />',
      `<meta property="og:image:alt" content="${attr(page.imageAlt)}" />`,
      '<meta name="twitter:card" content="summary_large_image" />',
    )
  } else {
    console.warn(`[превью] нет картинки для «${page.title}» — запустите scripts/build-og-images.mjs`)
  }

  return html
    .replace(/<title>[^<]*<\/title>/, () => `<title>${attr(page.title)}</title>`)
    .replace(
      /(<meta\s+name="description"\s+content=")[^"]*"/,
      (_, start: string) => `${start}${attr(page.description)}"`,
    )
    .replace('</head>', () => `${tags.map((tag) => `    ${tag}`).join('\n')}\n  </head>`)
}

/**
 * Файлы, без которых GitHub Pages ломает SPA.
 *
 * 1. Папка на каждый маршрут с копией index.html внутри. GitHub Pages не умеет
 *    переписывать адреса, зато отдаёт index.html из папки. Благодаря этому
 *    /sushi возвращает нормальный статус 200, страницу индексируют поисковики
 *    и мессенджеры показывают превью ссылки.
 * 2. 404.html — та же копия, страховка для всех прочих адресов: приложение
 *    загрузится и покажет свою страницу «не найдено» вместо заглушки GitHub.
 * 3. .nojekyll — отключает Jekyll, который иначе игнорирует файлы и папки,
 *    начинающиеся с подчёркивания.
 */
function githubPagesFiles(): Plugin {
  let outDir = 'dist'

  return {
    name: 'github-pages-files',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      const indexHtml = path.join(outDir, 'index.html')
      if (!fs.existsSync(indexHtml)) return

      const html = fs.readFileSync(indexHtml, 'utf8')
      const ogImage = (file: string) => (fs.existsSync(path.join(outDir, 'og', file)) ? file : null)

      // Список маршрутов берём из витрины — добавили шаблон, папка появится сама.
      // У каждой страницы свои заголовок, описание и картинка для превью ссылки.
      for (const template of TEMPLATES) {
        const dir = path.join(outDir, template.slug)
        fs.mkdirSync(dir, { recursive: true })
        const page = withPageMeta(html, {
          path: `${template.slug}/`,
          title: `${template.name} — демо-шаблон сайта | ${SITE_NAME}`,
          description: template.description,
          image: ogImage(`${template.slug}.jpg`),
          imageAlt: `Первый экран шаблона «${template.name}»`,
        })
        fs.writeFileSync(path.join(dir, 'index.html'), page)
      }

      // Главная: заголовок и описание остаются из index.html, добавляется превью
      fs.writeFileSync(
        indexHtml,
        withPageMeta(html, {
          path: '',
          ...readMeta(html),
          image: ogImage('showcase.jpg'),
          imageAlt: 'Витрина шаблонов сайтов: доставка суши, ресторан, магазин техники и игрушек',
        }),
      )

      fs.copyFileSync(indexHtml, path.join(outDir, '404.html'))
      fs.writeFileSync(path.join(outDir, '.nojekyll'), '')

      // Файл с версией: страница периодически сверяется с ним и узнаёт про обновление
      fs.writeFileSync(
        path.join(outDir, 'version.json'),
        JSON.stringify({ version: appVersion, builtAt: new Date().toISOString() }, null, 2),
      )
    },
  }
}

export default defineConfig({
  base,
  // Версия попадает в бандл — с ней страница и сравнивает version.json
  define: { 'import.meta.env.VITE_APP_VERSION': JSON.stringify(appVersion) },
  plugins: [react(), tailwindcss(), githubPagesFiles()],
  server: {
    // Явный IPv4-адрес: иначе Vite слушает только [::1] и браузер не достучится
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
  },
})
