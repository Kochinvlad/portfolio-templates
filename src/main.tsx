import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
// Шрифты раздаются с нашего сайта, а не с Google: не зависят от чужого сервера
// и не требуют лишних подключений. Браузер скачивает только те алфавиты
// (латиница, кириллица), которые реально встречаются на странице.
import '@fontsource-variable/inter'
import '@fontsource-variable/manrope'
import '@fontsource-variable/nunito'
import '@fontsource-variable/playfair-display'
import '@fontsource-variable/unbounded'
import './index.css'

// Позицией прокрутки управляем сами (ScrollToTop в App),
// иначе браузер возвращает старый скролл после подгрузки шаблона.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

const root = document.getElementById('root')
if (!root) throw new Error('Не найден контейнер #root')

createRoot(root).render(
  <StrictMode>
    {/* basename берётся из base в vite.config.ts: на GitHub Pages сайт лежит
        в подпапке с именем репозитория, и без этого маршруты не совпадут. */}
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
