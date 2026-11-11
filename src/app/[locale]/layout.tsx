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
      ? 'Іволга: майстерня меблів на замовлення в Одесі, з 2003 року. Кухні, шафи, двері, сходи, столи, декор для ресторанів. Телефон: +380977939401'
      : 'Ivolga: custom furniture workshop in Odessa, Ukraine, since 2003. Kitchens, wardrobes, doors, stairs, tables, restaurant décor. Call: +380977939401',
    // Russian search terms ride along on both locales: many people in Odessa search in Russian,
    // but the interface stays Ukrainian and English.
    keywords: [
      ...(isUA
        ? ['Іволга', 'меблі на замовлення Одеса', 'кухня на замовлення Одеса', 'шафа на замовлення Одеса', 'гардеробна на замовлення Одеса', 'столярні вироби Одеса', 'меблі з дерева Одеса', 'сходи з дерева Одеса']
        : ['Ivolga', 'custom furniture Odessa', 'bespoke furniture Ukraine', 'custom kitchen Odessa', 'handmade furniture Ukraine', 'wood furniture Odessa']),
      ...RU_KEYWORDS,
    ],
    alternates: {
      canonical: `/${locale}`,
      languages: { 'uk': '/ua', 'en': '/en', 'x-default': '/ua' },
    },
    openGraph: {
      title: isUA ? 'Іволга: меблі на замовлення' : 'Ivolga: custom furniture',
      siteName: isUA ? 'Іволга' : 'Ivolga',
      images: [{ url: '/logo/ivolga-og.jpg', width: 1200, height: 630, alt: isUA ? 'Іволга' : 'Ivolga' }],
      description: isUA ? 'Майстерність у кожній деталі. Одеса, Україна.' : 'Mastery in Every Detail. Odessa, Ukraine.',
      locale: isUA ? 'uk_UA' : 'en_US',
      type: 'website',
    },
  }
}

const RU_KEYWORDS = [
  'Иволга', 'мебель на заказ Одесса', 'изготовление мебели на заказ Одесса', 'кухня на заказ Одесса',
  'шкаф купе на заказ Одесса', 'гардеробная на заказ Одесса', 'столярная мастерская Одесса', 'мебель из дерева Одесса',
]

// What the workshop makes, in English, Ukrainian and Russian, for the offer catalog below
const SERVICES = [
  ['Custom kitchens',            'Кухні на замовлення',          'Кухни на заказ'],
  ['Custom doors',               'Двері на замовлення',          'Двери на заказ'],
  ['Custom tables',              'Столи на замовлення',          'Столы на заказ'],
  ['Custom bedroom furniture',   'Спальні на замовлення',        'Спальни на заказ'],
  ['Custom wardrobes',           'Шафи на замовлення',           'Шкафы на заказ'],
  ['Custom wooden stairs',       'Сходи з дерева на замовлення', 'Лестницы из дерева на заказ'],
]

const schemaOrg = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'FurnitureStore'],
  name: 'Ivolga',
  alternateName: ['Іволга', 'Иволга', 'Ivolga Custom Furniture', 'Іволга Меблі на замовлення', 'Иволга Мебель на заказ'],
  description: 'Ivolga is a custom furniture workshop in Odessa, Ukraine, with a team of professional craftsmen. It designs and makes furniture to order: kitchens, doors, tables, bedrooms, wardrobes and stairs, plus restaurant décor, from practically any wood, with modern hardware and Italian lacquer and paint finishes. Works with interior designers and architecture studios.',
  knowsAbout: ['Custom furniture manufacturing', 'Joinery', 'Wood furniture', 'Interior design'],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Custom furniture manufacturing',
    itemListElement: SERVICES.map(([en, uk, ru]) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: en, alternateName: [uk, ru], serviceType: 'Custom furniture manufacturing', areaServed: 'Odessa, Ukraine' },
    })),
  },
  foundingDate: '2003',
  founder: {
    '@type': 'Person',
    name: 'Igor Vasylkov',
    alternateName: ['Ігор Васильков', 'Игорь Васильков'],
    jobTitle: 'Owner and Managing Director',
  },
  url: SITE_URL,
  logo: `${SITE_URL}/logo/ivolga-logo.jpg`,
  image: `${SITE_URL}/logo/ivolga-og.jpg`,
  telephone: '+380977939401',
  email: 'ive@ukr.net',
  sameAs: ['https://www.instagram.com/igorvasylkov/'],
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
        <link rel="alternate" type="text/markdown" href="/llms.txt" title="llms.txt" />
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
