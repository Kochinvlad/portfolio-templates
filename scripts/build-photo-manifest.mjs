/**
 * Собирает список доступных фотографий в src/lib/photos.ts.
 *
 * Фотографии лежат в public/photos и называются по id товара. Манифест нужен,
 * чтобы код заранее знал, у какого товара снимок есть, и не дёргал 404 за теми,
 * у кого его нет, — там останется генеративная подложка.
 *
 * Запускать после добавления или удаления файлов:
 *   node scripts/build-photo-manifest.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const DIR = path.join(ROOT, 'public', 'photos')
const OUT = path.join(ROOT, 'src', 'lib', 'photos.ts')

const ids = fs
  .readdirSync(DIR)
  .filter((f) => f.endsWith('.webp'))
  .map((f) => f.replace(/\.webp$/, ''))
  .sort()

const file = `// Файл создаётся скриптом scripts/build-photo-manifest.mjs — править руками не нужно.

/** Идентификаторы товаров, для которых в public/photos лежит фотография. */
const WITH_PHOTO = new Set<string>([
${ids.map((id) => `  '${id}',`).join('\n')}
])

/** Есть ли у товара настоящее фото. */
export function hasPhoto(id: string): boolean {
  return WITH_PHOTO.has(id)
}

/**
 * Адрес фотографии товара. Учитывает базовый путь сайта,
 * поэтому работает и в подпапке на GitHub Pages.
 */
export function photoUrl(id: string): string | undefined {
  return hasPhoto(id) ? \`\${import.meta.env.BASE_URL}photos/\${id}.webp\` : undefined
}
`

fs.writeFileSync(OUT, file)
console.log(`манифест собран: ${ids.length} фотографий`)

// Таблица авторов в CREDITS.md собирается из credits.json — так она не расходится с файлами.
const CREDITS_JSON = path.join(DIR, 'credits.json')
const CREDITS_MD = path.join(DIR, 'CREDITS.md')
const TABLE_HEAD = '| Файл | Автор |'

if (fs.existsSync(CREDITS_JSON) && fs.existsSync(CREDITS_MD)) {
  const credits = JSON.parse(fs.readFileSync(CREDITS_JSON, 'utf8'))
  const md = fs.readFileSync(CREDITS_MD, 'utf8')
  const tableStart = md.indexOf(TABLE_HEAD)

  if (tableStart < 0) {
    console.warn(`в CREDITS.md нет строки «${TABLE_HEAD}» — таблица не обновлена`)
  } else {
    // Вертикальная черта в имени автора ломает таблицу Markdown
    const cell = (text) => text.replace(/\|/g, '\\|')
    const rows = ids.map((id) => {
      const credit = credits[id]
      // Своё фото, положенное вручную, в credits.json не попадает
      const author = credit ? `[${cell(credit.author)}](${credit.authorLink})` : '—'
      return `| \`${id}.webp\` | ${author} |`
    })
    fs.writeFileSync(CREDITS_MD, `${md.slice(0, tableStart)}${TABLE_HEAD}\n|---|---|\n${rows.join('\n')}\n`)
    console.log(`CREDITS.md обновлён: ${rows.length} строк`)
  }
}
