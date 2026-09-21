import { useDocumentMeta, useRevealOnScroll } from '../../lib/hooks'
import { ToastProvider } from '../../ui/Toast'
import { DemoBar } from '../../showcase/DemoBar'
import { RestaurantAbout, RestaurantHeader, RestaurantHero } from './RestaurantHeader'
import { RestaurantMenu } from './RestaurantMenu'
import { RestaurantGallery, RestaurantReviews } from './RestaurantGallery'
import { RestaurantBooking } from './RestaurantBooking'
import { RestaurantFooter } from './RestaurantFooter'

function RestaurantInner() {
  useDocumentMeta(
    'ТЕРРАСА — ресторан европейской кухни на Чистых прудах',
    'Европейская кухня на открытом огне, летняя терраса и бронирование столика онлайн.',
  )
  useRevealOnScroll()

  return (
    <>
      <RestaurantHeader />
      <main>
        <RestaurantHero />
        <RestaurantAbout />
        <RestaurantMenu />
        <RestaurantGallery />
        <RestaurantReviews />
        <RestaurantBooking />
      </main>
      <RestaurantFooter />
      <DemoBar name="Ресторан и кафе" />
    </>
  )
}

export function RestaurantTemplate() {
  return (
    <div className="theme-restaurant min-h-screen bg-surface text-ink">
      <ToastProvider>
        <RestaurantInner />
      </ToastProvider>
    </div>
  )
}
