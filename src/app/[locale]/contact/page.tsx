import { getTranslations } from 'next-intl/server'

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })

  return (
    <div className="bg-surface text-primary pt-24">
      <div className="text-center py-8 md:py-16 px-6 bg-surface-container">
        <span className="font-label text-[10px] uppercase tracking-[0.3em] text-secondary mb-3 md:mb-6 block">{t('subtitle')}</span>
        <h1 className="font-headline text-4xl md:text-5xl leading-tight">{t('title')}</h1>
      </div>

      <div className="max-w-2xl mx-auto px-6 md:px-6 py-8 md:py-20">
        <div className="grid grid-cols-1 gap-0">
          {/* Phone */}
          <div className="border-b border-outline-variant py-5 md:py-8">
            <p className="font-label text-[10px] uppercase tracking-widest text-secondary mb-2">{t('phone_label')}</p>
            <span className="font-headline text-xl md:text-2xl select-all">
              +380 67 486 4629
            </span>
          </div>

          {/* Email */}
          <div className="border-b border-outline-variant py-5 md:py-8">
            <p className="font-label text-[10px] uppercase tracking-widest text-secondary mb-2">{t('email_label')}</p>
            <a href="mailto:ive@ukr.net" className="font-headline text-xl md:text-2xl hover:text-secondary transition-colors duration-[400ms]">
              ive@ukr.net
            </a>
          </div>

          {/* Telegram */}
          <div className="border-b border-outline-variant py-5 md:py-8">
            <p className="font-label text-[10px] uppercase tracking-widest text-secondary mb-2">{t('telegram_label')}</p>
            <a href="https://t.me/+380977939401" className="font-headline text-xl md:text-2xl hover:text-secondary transition-colors duration-[400ms]">
              @igorvasylkov
            </a>
          </div>

          {/* Hours */}
          <div className="py-5 md:py-8">
            <p className="font-label text-[10px] uppercase tracking-widest text-secondary mb-2">{t('hours_label')}</p>
            <p className="font-headline text-xl mb-1">{t('hours')}</p>
            <p className="font-body text-sm text-primary/80">{t('location')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
