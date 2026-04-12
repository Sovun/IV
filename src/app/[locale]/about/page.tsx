import { getTranslations } from 'next-intl/server'
import Image from 'next/image'

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })

  const bodyParagraphs = t('body').split('\n\n')
  const craftParagraphs = t('craft_text').split('\n\n')

  return (
    <div className="pt-24">
      {/* Header image — japan_gate */}
      <Image
        src="/japan_gate.jpg"
        alt="Artisan workshop doorway — precision and heritage in every detail"
        width={1920}
        height={0}
        sizes="100vw"
        priority
        quality={90}
        className="w-full h-auto"
        style={{ height: 'auto' }}
      />

      <div className="text-center py-16 px-6 bg-cream-100">
        <h1 className="font-serif text-4xl md:text-5xl font-light text-charcoal-900 mb-4">{t('title')}</h1>
        <div className="divider mb-4" />
        <p className="font-sans text-sm text-charcoal-700">{t('subtitle')}</p>
      </div>

      {/* Master photo — full, uncropped */}
      <div className="max-w-3xl mx-auto px-6 pt-16">
        <Image
          src="/20231103_081535.jpg"
          alt="Igor Vasylkov — master furniture craftsman, Odessa"
          width={900}
          height={0}
          sizes="(max-width: 768px) 100vw, 768px"
          quality={90}
          className="w-full h-auto"
          style={{ height: 'auto' }}
        />
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-12 space-y-5">
          {bodyParagraphs.map((para, i) => (
            <p key={i} className="font-sans text-sm leading-relaxed text-charcoal-700">{para}</p>
          ))}
        </div>

        <h2 className="font-serif text-2xl font-light text-charcoal-900 mb-2">{t('craft_title')}</h2>
        <div className="w-10 h-px bg-gold-500 mb-6" />
        <div className="mb-12 space-y-5">
          {craftParagraphs.map((para, i) => (
            <p key={i} className="font-sans text-sm leading-relaxed text-charcoal-700">{para}</p>
          ))}
        </div>

        <div className="border-t border-cream-300 pt-8">
          <p className="font-sans text-xs tracking-widest uppercase text-charcoal-700">{t('location')}</p>
        </div>
      </div>
    </div>
  )
}
