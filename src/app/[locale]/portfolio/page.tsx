import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getGalleryPhotos } from '@/lib/gallery'
import Gallery from '@/components/Gallery'
import ContactDock from '@/components/ContactDock'

// The full gallery: every category and every photo. The home page shows a
// short selection and sends the reader here for the rest.

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const isUA = locale === 'ua'
  return {
    title: isUA
      ? 'Галерея робіт | Іволга, меблі на замовлення в Одесі'
      : 'Gallery | Ivolga custom furniture, Odessa',
    description: isUA
      ? 'Усі роботи майстерні «Іволга»: кухні, кабінети, шафи та спальні, ванні та сауни, декор інтер\'єру, двері, столи, сходи. Одеса.'
      : 'All the work of the Ivolga workshop: kitchens, studies, wardrobes and bedrooms, bathrooms and saunas, interior décor, doors, tables, stairs. Odessa.',
    alternates: {
      canonical: `/${locale}/portfolio`,
      languages: { 'uk': '/ua/portfolio', 'en': '/en/portfolio', 'x-default': '/ua/portfolio' },
    },
  }
}

export default async function PortfolioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'portfolio' })

  return (
    // The header is fixed, so the page starts below it
    <div className="bg-surface-container pt-16 md:pt-20">
      <Gallery categories={getGalleryPhotos()} />

      <div className="bg-surface text-primary text-center py-16 md:py-24 px-6">
        <h2 className="font-headline text-3xl md:text-5xl leading-tight mb-8">{t('outro_title')}</h2>
        <a
          href={`/${locale}#contact`}
          className="inline-block bg-primary text-on-primary px-10 py-5 text-xs font-label uppercase tracking-widest hover:bg-secondary transition-colors duration-[400ms]"
        >
          {t('outro_cta')}
        </a>
      </div>

      <ContactDock />
    </div>
  )
}
