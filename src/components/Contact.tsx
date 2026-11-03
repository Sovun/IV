import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import ProjectBrief, { type BriefCover } from './ProjectBrief'

// The end of the page: a direct line to Igor, the project brief composer,
// then every channel spelled out.

const AVATAR    = '/igor.jpg'
const TELEGRAM  = 'https://t.me/+380977939401'
const PHONE     = '+380674864629'
const PHONE_FMT = '+380 67 486 4629'

export default async function Contact({ covers }: { covers: BriefCover[] }) {
  const t  = await getTranslations('contact')
  const ta = await getTranslations('about')

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

      {/* ── Talk to Igor ─────────────────────────────── */}
      <div className="bg-surface-container-high py-20 md:py-32 px-6 md:px-12">
        <div className="max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">

          <div className="md:col-span-2 flex md:justify-end">
            <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden bg-surface-container">
              <Image
                src={AVATAR}
                alt="Igor Vasylkov / Ігор Васильков"
                fill
                sizes="144px"
                quality={85}
                className="object-cover"
              />
            </div>
          </div>

          <div className="md:col-span-5">
            <span className="font-label text-[10px] uppercase tracking-[0.3em] text-secondary mb-5 block">{ta('talk_label')}</span>
            <h2 className="font-headline text-4xl md:text-6xl tracking-tight leading-none mb-6">{ta('talk_title')}</h2>
            <p className="font-body text-primary/70 leading-relaxed max-w-xl">{ta('talk_body')}</p>
          </div>

          <div className="md:col-span-4 md:col-start-9 flex flex-col gap-3">
            <a
              href={TELEGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center bg-primary text-on-primary px-8 py-5 text-xs font-label uppercase tracking-widest hover:bg-secondary transition-colors duration-[400ms]"
            >
              {ta('talk_telegram')}
            </a>
            <a
              href={`tel:${PHONE}`}
              className="group flex justify-between items-baseline px-1 pt-3 font-label text-[10px] uppercase tracking-[0.2em] text-primary/60 hover:text-secondary transition-colors duration-[400ms]"
            >
              <span>{ta('talk_call')}</span>
              <span className="font-headline normal-case tracking-normal text-xl text-primary group-hover:text-secondary transition-colors duration-[400ms]">
                {PHONE_FMT}
              </span>
            </a>
            <p className="px-1 font-label text-[10px] uppercase tracking-[0.2em] text-primary/40">
              {t('hours')}
            </p>
          </div>

        </div>
      </div>

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
