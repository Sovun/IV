import { useTranslations } from 'next-intl'

export default function AboutPage() {
  const t = useTranslations('about')

  return (
    <div className="pt-24">
      <div className="text-center py-16 px-6 bg-cream-100">
        <h1 className="font-serif text-4xl md:text-5xl font-light text-charcoal-900 mb-4">{t('title')}</h1>
        <div className="divider mb-4" />
        <p className="font-sans text-sm text-charcoal-700">{t('subtitle')}</p>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-20">
        <p className="font-sans text-sm leading-relaxed text-charcoal-700 mb-12">{t('body')}</p>

        <h2 className="font-serif text-2xl font-light text-charcoal-900 mb-2">{t('craft_title')}</h2>
        <div className="w-10 h-px bg-gold-500 mb-6" />
        <p className="font-sans text-sm leading-relaxed text-charcoal-700 mb-12">{t('craft_text')}</p>

        <div className="border-t border-cream-300 pt-8">
          <p className="font-sans text-xs tracking-widest uppercase text-charcoal-700">{t('location')}</p>
        </div>
      </div>
    </div>
  )
}
