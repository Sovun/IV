import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { SITE_URL } from '@/lib/site'
import './globals.css'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const isUA = locale === 'ua'
  return {
    metadataBase: new URL(SITE_URL),
    title: isUA
      ? 'Іволга | Меблі на замовлення в Одесі'
      : 'Ivolga | Custom Furniture in Odessa, Ukraine',
    description: isUA
      ? 'Іволга: майстерня меблів на замовлення в Одесі, з 2002 року. Кухні, шафи, двері, сходи, столи, декор для ресторанів. Власник майстерні: Ігор Васильков. Телефон: +380674864629'
      : 'Ivolga: custom furniture workshop in Odessa, Ukraine, since 2002. Kitchens, wardrobes, doors, stairs, tables, restaurant décor. Owner: Igor Vasylkov. Call: +380674864629',
    keywords: isUA
      ? ['Іволга', 'меблі на замовлення', 'меблі Одеса', 'кухні на замовлення', 'шафи на замовлення', 'Ігор Васильков']
      : ['Ivolga', 'custom furniture Odessa', 'bespoke furniture Ukraine', 'kitchen furniture Odessa', 'Igor Vasylkov'],
    alternates: {
      canonical: `/${locale}`,
      languages: { 'uk': '/ua', 'en': '/en' },
    },
    openGraph: {
      title: isUA ? 'Іволга: меблі на замовлення' : 'Ivolga: custom furniture',
      siteName: isUA ? 'Іволга' : 'Ivolga',
      images: [{ url: '/logo/ivolga-mark.svg', alt: isUA ? 'Іволга' : 'Ivolga' }],
      description: isUA ? 'Майстерність у кожній деталі. Одеса, Україна.' : 'Mastery in Every Detail. Odessa, Ukraine.',
      locale: isUA ? 'uk_UA' : 'en_US',
      type: 'website',
    },
  }
}

const schemaOrg = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'FurnitureStore'],
  name: 'Ivolga',
  alternateName: ['Іволга', 'Ivolga Custom Furniture', 'Іволга Меблі на замовлення'],
  description: 'Ivolga is a custom furniture workshop in Odessa, Ukraine, with a team of professional craftsmen. Kitchens, wardrobes, doors, stairs, tables, restaurant décor.',
  foundingDate: '2002',
  founder: {
    '@type': 'Person',
    name: 'Igor Vasylkov',
    alternateName: 'Ігор Васильков',
    jobTitle: 'Owner and Managing Director',
  },
  url: SITE_URL,
  logo: `${SITE_URL}/logo/ivolga-mark.svg`,
  image: `${SITE_URL}/logo/ivolga-en.svg`,
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

  setRequestLocale(locale)
  const messages = await getMessages({ locale })

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
      {/* suppressHydrationWarning: browser extensions add attributes to <body> before React loads */}
      <body className="bg-surface text-on-surface font-body antialiased" suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
