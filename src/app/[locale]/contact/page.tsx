import { getTranslations } from 'next-intl/server'

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })

  return (
    <div className="bg-surface text-primary">

      {/* Header */}
      <div className="text-center pt-40 pb-16 px-6 bg-surface-container">
        <span className="font-label text-[10px] uppercase tracking-[0.3em] text-secondary mb-6 block">{t('subtitle')}</span>
        <h1 className="font-headline text-4xl md:text-6xl leading-tight">{t('title')}</h1>
      </div>

      {/* Phone */}
      <div className="py-16 md:py-20 px-6 md:px-16 bg-surface">
        <div className="max-w-3xl mx-auto">
          <p className="font-label text-[10px] uppercase tracking-widest text-secondary mb-5">{t('phone_label')}</p>
          <span className="font-headline text-3xl md:text-5xl select-all block">
            +380 67 486 4629
          </span>
        </div>
      </div>

      {/* Email */}
      <div className="py-16 md:py-20 px-6 md:px-16 bg-surface-container-low">
        <div className="max-w-3xl mx-auto">
          <p className="font-label text-[10px] uppercase tracking-widest text-secondary mb-5">{t('email_label')}</p>
          <a href="mailto:ive@ukr.net" className="font-headline text-3xl md:text-5xl hover:text-secondary transition-colors duration-[400ms] block">
            ive@ukr.net
          </a>
        </div>
      </div>

      {/* Telegram */}
      <div className="py-16 md:py-20 px-6 md:px-16 bg-surface">
        <div className="max-w-3xl mx-auto">
          <p className="font-label text-[10px] uppercase tracking-widest text-secondary mb-5">{t('telegram_label')}</p>
          <a href="https://t.me/+380977939401" className="font-headline text-3xl md:text-5xl hover:text-secondary transition-colors duration-[400ms] block">
            @igorvasylkov
          </a>
        </div>
      </div>

      {/* Hours */}
      <div className="py-16 md:py-20 px-6 md:px-16 bg-surface-container-low">
        <div className="max-w-3xl mx-auto">
          <p className="font-label text-[10px] uppercase tracking-widest text-secondary mb-5">{t('hours_label')}</p>
          <p className="font-headline text-3xl md:text-5xl mb-4">{t('hours')}</p>
          <p className="font-body text-sm text-primary/70 tracking-wide">{t('location')}</p>
        </div>
      </div>

    </div>
  )
}
