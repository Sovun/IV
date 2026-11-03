import { getTranslations } from 'next-intl/server'
import ProjectBrief, { type BriefCover } from './ProjectBrief'

// The end of the page: the project brief composer, then every channel spelled out.

const TELEGRAM  = 'https://t.me/+380977939401'
const PHONE     = '+380674864629'
const PHONE_FMT = '+380 67 486 4629'

export default async function Contact({ covers }: { covers: BriefCover[] }) {
  const t  = await getTranslations('contact')

  const channel = (label: string, body: React.ReactNode, bg: string) => (
    <div className={`py-16 md:py-20 px-6 md:px-16 ${bg}`}>
      <div className="max-w-3xl mx-auto">
        <p className="font-label text-[10px] uppercase tracking-widest text-secondary mb-5">{label}</p>
        {body}
      </div>
    </div>
  )
  const big = 'font-headline text-3xl md:text-5xl hover:text-secondary transition-colors duration-[400ms] block'

  return (
    <section id="contact" className="bg-surface text-primary scroll-mt-14">

      <ProjectBrief covers={covers} />

      {channel(t('phone_label'),
        <a href={`tel:${PHONE}`} className={big}>{PHONE_FMT}</a>, 'bg-surface')}
      {channel(t('email_label'),
        <a href="mailto:ive@ukr.net" className={big}>ive@ukr.net</a>, 'bg-surface-container-low')}
      {channel(t('telegram_label'),
        <a href={TELEGRAM} className={big}>@igorvasylkov</a>, 'bg-surface')}
      {channel(t('hours_label'),
        <>
          <p className="font-headline text-3xl md:text-5xl mb-4">{t('hours')}</p>
          <p className="font-body text-sm text-primary/70 tracking-wide">{t('location')}</p>
        </>, 'bg-surface-container-low')}

    </section>
  )
}
