/**
 * Скачивает фотографии товаров с Unsplash в public/photos.
 *
 * Ключ берётся из переменной окружения и в репозиторий не попадает:
 *   UNSPLASH_KEY=ваш_ключ node scripts/fetch-photos.mjs
 *
 * Уже скачанные файлы пропускаются, поэтому скрипт можно запускать повторно —
 * например, чтобы добрать фото для новых товаров.
 *
 * Рядом пишется credits.json с авторами: лицензия Unsplash не требует указания
 * авторства, но указать его правильно, и данные пригодятся для страницы благодарностей.
 */
import fs from 'node:fs'
import path from 'node:path'

const KEY = process.env.UNSPLASH_KEY
if (!KEY) {
  console.error('Не задан UNSPLASH_KEY')
  process.exit(1)
}

const ROOT = path.resolve(import.meta.dirname, '..')
const OUT_DIR = path.join(ROOT, 'public', 'photos')
const CREDITS_FILE = path.join(OUT_DIR, 'credits.json')
// Можно передать свой файл запросов: node scripts/fetch-photos.mjs scripts/photo-fixes.json
const QUERIES_FILE = process.argv[2] ?? path.join(ROOT, 'scripts', 'photo-queries.json')
const QUERIES = JSON.parse(fs.readFileSync(QUERIES_FILE, 'utf8'))

/** Ширина и качество: карточкам хватает 700px, WebP жмёт вдвое лучше JPEG. */
const IMAGE_PARAMS = 'w=700&h=520&fit=crop&crop=entropy&q=72&fm=webp'

fs.mkdirSync(OUT_DIR, { recursive: true })
const credits = fs.existsSync(CREDITS_FILE) ? JSON.parse(fs.readFileSync(CREDITS_FILE, 'utf8')) : {}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function search(query, count) {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
    query,
  )}&per_page=${count + 4}&orientation=landscape&content_filter=high`
  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${KEY}`, 'Accept-Version': 'v1' },
  })
  if (!res.ok) throw new Error(`поиск «${query}»: HTTP ${res.status}`)
  const data = await res.json()
  return data.results ?? []
}

/** Конкретный снимок по его id на Unsplash — когда поиск выдаёт не то. */
async function fetchPhoto(photoId) {
  const res = await fetch(`https://api.unsplash.com/photos/${photoId}`, {
    headers: { Authorization: `Client-ID ${KEY}`, 'Accept-Version': 'v1' },
  })
  if (!res.ok) throw new Error(`снимок ${photoId}: HTTP ${res.status}`)
  return res.json()
}

async function download(photo, id) {
  const file = path.join(OUT_DIR, `${id}.webp`)
  const url = `${photo.urls.raw}&${IMAGE_PARAMS}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`загрузка ${id}: HTTP ${res.status}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  fs.writeFileSync(file, buffer)
  credits[id] = {
    photo: photo.id,
    author: photo.user.name,
    authorLink: photo.user.links.html,
    description: photo.alt_description ?? '',
  }
  return buffer.length
}

let downloaded = 0
let skipped = 0
let failed = 0

for (const { q, photo: pick, ids } of QUERIES) {
  const missing = ids.filter((id) => !fs.existsSync(path.join(OUT_DIR, `${id}.webp`)))
  if (missing.length === 0) {
    skipped += ids.length
    continue
  }

  try {
    const results = pick ? [await fetchPhoto(pick)] : await search(q, missing.length)
    if (results.length < missing.length) {
      console.warn(`  мало результатов для «${q ?? pick}»: ${results.length} из ${missing.length}`)
    }
    for (let i = 0; i < missing.length; i++) {
      const photo = results[i]
      if (!photo) {
        failed++
        console.warn(`  нет фото для ${missing[i]}`)
        continue
      }
      const size = await download(photo, missing[i])
      downloaded++
      console.log(`  ${missing[i]} — ${(size / 1024).toFixed(0)} КБ — ${photo.user.name}`)
    }
  } catch (e) {
    failed += missing.length
    console.error(`  ${e.message}`)
  }

  await sleep(400)
}

fs.writeFileSync(CREDITS_FILE, JSON.stringify(credits, null, 2) + '\n')
console.log(`\nскачано: ${downloaded}, пропущено: ${skipped}, не вышло: ${failed}`)
