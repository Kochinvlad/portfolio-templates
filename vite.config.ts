import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { TEMPLATES } from './src/showcase/templates'

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

      // Список маршрутов берём из витрины — добавили шаблон, папка появится сама
      for (const { slug } of TEMPLATES) {
        const dir = path.join(outDir, slug)
        fs.mkdirSync(dir, { recursive: true })
        fs.copyFileSync(indexHtml, path.join(dir, 'index.html'))
      }

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
