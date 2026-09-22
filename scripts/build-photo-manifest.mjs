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
