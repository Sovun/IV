import { getTranslations } from 'next-intl/server'

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })

  return (
    <div className="pt-24">
      <div className="text-center py-16 px-6 bg-cream-100">
        <h1 className="font-serif text-4xl md:text-5xl font-light text-charcoal-900 mb-4">{t('title')}</h1>
        <div className="divider mb-4" />
        <p className="font-sans text-sm text-charcoal-700">{t('subtitle')}</p>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 gap-10">
          {/* Phone */}
          <div className="border-b border-cream-300 pb-10">
            <p className="font-sans text-xs tracking-widest uppercase text-gold-500 mb-3">{t('phone_label')}</p>
            <span className="font-serif text-2xl font-light text-charcoal-900 select-all">
              +380 67 486 4629
            </span>
          </div>

          {/* Email */}
          <div className="border-b border-cream-300 pb-10">
            <p className="font-sans text-xs tracking-widest uppercase text-gold-500 mb-3">{t('email_label')}</p>
            <a href="mailto:ive@ukr.net" className="font-serif text-2xl font-light text-charcoal-900 hover:text-gold-500 transition-colors">
              ive@ukr.net
            </a>
          </div>

          {/* Telegram */}
          <div className="border-b border-cream-300 pb-10">
            <p className="font-sans text-xs tracking-widest uppercase text-gold-500 mb-3">{t('telegram_label')}</p>
            <a href="https://t.me/+380977939401" className="font-serif text-2xl font-light text-charcoal-900 hover:text-gold-500 transition-colors">
              @igorvasylkov
            </a>
          </div>

          {/* Hours */}
          <div>
            <p className="font-sans text-xs tracking-widest uppercase text-gold-500 mb-3">{t('hours_label')}</p>
            <p className="font-serif text-xl font-light text-charcoal-900">{t('hours')}</p>
            <p className="font-sans text-sm text-charcoal-700 mt-2">{t('location')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
