import { getTranslations } from 'next-intl/server'
import Image from 'next/image'

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })

  const bodyParagraphs = t('body').split('\n\n')
  const craftParagraphs = t('craft_text').split('\n\n')

  return (
    <div className="bg-surface text-primary">
      {/* Header image — japan_gate */}
      <Image
        src="/japan_gate.jpg"
        alt="Artisan workshop doorway — precision and heritage in every detail"
        width={1920}
        height={0}
        sizes="100vw"
        priority
        quality={90}
        className="w-full h-auto pt-24"
        style={{ height: 'auto' }}
      />

      <div className="text-center py-16 px-6 bg-surface-container">
        <span className="font-label text-[10px] uppercase tracking-[0.3em] text-secondary mb-6 block">
          {t('subtitle')}
        </span>
        <h1 className="font-headline text-4xl md:text-5xl leading-tight mb-0">{t('title')}</h1>
      </div>

      {/* Master photo — full, uncropped */}
      <div className="max-w-3xl mx-auto px-4 md:px-6 pt-10 md:pt-16">
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

      <div className="max-w-3xl mx-auto px-4 md:px-6 py-10 md:py-16">
        <div className="mb-12 space-y-5">
          {bodyParagraphs.map((para, i) => (
            <p key={i} className="font-body text-primary/80 text-sm leading-relaxed">{para}</p>
          ))}
        </div>

        <h2 className="font-headline text-2xl mb-2">{t('craft_title')}</h2>
        <div className="w-10 h-px bg-secondary mb-6" />
        <div className="mb-12 space-y-5">
          {craftParagraphs.map((para, i) => (
            <p key={i} className="font-body text-primary/80 text-sm leading-relaxed">{para}</p>
          ))}
        </div>

        <div className="border-t border-outline-variant pt-8">
          <p className="font-label text-[10px] uppercase tracking-widest text-secondary">{t('location')}</p>
        </div>
      </div>
    </div>
  )
}
