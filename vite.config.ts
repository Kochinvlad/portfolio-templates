import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

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
 * Два файла, без которых GitHub Pages ломает SPA.
 *
 * 1. 404.html — копия index.html. GitHub Pages не умеет переписывать адреса,
 *    поэтому прямой заход на /sushi отдал бы ошибку. Вместо этого отдаётся
 *    404.html, то есть то же приложение, а маршрут разбирает React Router.
 * 2. .nojekyll — отключает Jekyll, который иначе игнорирует файлы и папки,
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
      fs.copyFileSync(indexHtml, path.join(outDir, '404.html'))
      fs.writeFileSync(path.join(outDir, '.nojekyll'), '')
    },
  }
}

export default defineConfig({
  base,
  plugins: [react(), tailwindcss(), githubPagesFiles()],
  server: {
    // Явный IPv4-адрес: иначе Vite слушает только [::1] и браузер не достучится
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
  },
})
