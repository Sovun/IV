import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import './globals.css'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const isUA = locale === 'ua'
  return {
    title: isUA
      ? 'Меблі на замовлення в Одесі | Ігор Васильков'
      : 'Custom Furniture in Odessa, Ukraine | Igor Vasylkov',
    description: isUA
      ? 'Меблі на замовлення будь-якої складності в Одесі. Кухні, шафи, двері, сходи, столи, декор для ресторанів. Телефон: +380674864629'
      : 'Custom furniture of any complexity in Odessa, Ukraine. Kitchens, wardrobes, doors, stairs, tables, restaurant décor. Call: +380674864629',
    keywords: isUA
      ? ['меблі на замовлення', 'меблі Одеса', 'кухні на замовлення', 'шафи на замовлення', 'Ігор Васильков']
      : ['custom furniture Odessa', 'bespoke furniture Ukraine', 'kitchen furniture Odessa', 'Igor Vasylkov'],
    alternates: {
      canonical: `/${locale}`,
      languages: { 'uk': '/ua', 'en': '/en' },
    },
    openGraph: {
      title: isUA ? 'Ігор Васильков — Меблі на замовлення' : 'Igor Vasylkov — Custom Furniture',
      description: isUA ? 'Майстерність у кожній деталі. Одеса, Україна.' : 'Mastery in Every Detail. Odessa, Ukraine.',
      locale: isUA ? 'uk_UA' : 'en_US',
      type: 'website',
    },
  }
}

const schemaOrg = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'FurnitureStore'],
  name: 'Igor Vasylkov Custom Furniture',
  alternateName: 'Ігор Васильков Меблі на замовлення',
  description: 'Custom furniture of any complexity in Odessa, Ukraine. Kitchens, wardrobes, doors, stairs, tables, restaurant décor.',
  url: 'https://igorvasylkov.com',
  telephone: '+380674864629',
  email: 'ive@ukr.net',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Odessa',
    addressCountry: 'UA',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 46.4825,
    longitude: 30.7233,
  },
  areaServed: { '@type': 'City', name: 'Odessa' },
  priceRange: '$$',
  openingHours: 'Mo-Sa 09:00-19:00',
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'ua' | 'en')) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale === 'ua' ? 'uk' : 'en'}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500&family=Noto+Serif:ital,wght@0,400;0,700;1,400&family=Manrope:wght@400;500;700&display=swap&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      </head>
      <body className="bg-surface text-on-surface font-body antialiased">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
