'use client'
import { useTranslations } from 'next-intl'
import {
  PHONE, PHONE_FMT, EMAIL, TELEGRAM, INSTAGRAM,
  OPENS, CLOSES, WORK_DAYS, useWorkshopNow,
} from '@/lib/workshop'

// The contact section, as the workshop's desk: Odessa's clock and whether the workshop is open this
// minute, the working week, and every channel as one large line. The channel
// that suits the hour (a call while open, a message while closed) is marked.

export default function ContactDesk() {
  const t   = useTranslations('contact')
  const td  = useTranslations('contact.desk')
  const now = useWorkshopNow()

  const days  = td('days').split(' ')
  const opens = `${OPENS}:00`
  const best  = now ? (now.open ? 'phone' : 'telegram') : null

  const channels = [
    { id: 'phone',     label: t('phone_label'),     value: PHONE_FMT,       href: `tel:${PHONE}`,    external: false },
    { id: 'telegram',  label: t('telegram_label'),  value: '@igorvasylkov', href: TELEGRAM,          external: true },
    { id: 'email',     label: t('email_label'),     value: EMAIL,           href: `mailto:${EMAIL}`, external: false },
    { id: 'instagram', label: t('instagram_label'), value: '@igorvasylkov', href: INSTAGRAM,         external: true },
  ]

  return (
    <section id="contact" className="bg-charcoal-900 text-white py-20 md:py-32 px-6 md:px-12 overflow-hidden scroll-mt-14">
      <div className="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16 items-start">

        {/* ── The clock and the week ─────────────────── */}
        <div className="lg:col-span-6">
          <span className="font-label text-[11px] uppercase tracking-[0.3em] text-secondary-container mb-4 block">
            {td('label')}
          </span>
          <h2 className="font-headline text-3xl md:text-5xl leading-tight mb-5">{td('title')}</h2>
          <p className="font-body text-white/75 leading-relaxed max-w-md">{td('body')}</p>

          {/* Filled in once the browser knows the hour; the space is held so nothing jumps */}
          <div
            className={`mt-12 md:mt-16 transition-opacity duration-700 ${now ? 'opacity-100' : 'opacity-0'}`}
            aria-live="off"
          >
            <p className="font-label text-[11px] uppercase tracking-[0.3em] text-white/65 mb-2">{td('now')}</p>
            <p className="font-headline tabular-nums tracking-tighter leading-none text-[clamp(5.5rem,14vw,13rem)] -ml-1 md:-ml-2">
              {now ? now.time.slice(0, 2) : '00'}
              <span className="text-secondary-container motion-safe:animate-pulse">:</span>
              {now ? now.time.slice(3) : '00'}
            </p>
            <p className="mt-6 flex items-center gap-3 font-label text-xs uppercase tracking-[0.2em]">
              <span className="relative flex w-2.5 h-2.5">
                {now?.open && <span className="absolute inset-0 rounded-full bg-secondary-container motion-safe:animate-ping" />}
                <span className={`relative w-2.5 h-2.5 rounded-full ${now?.open ? 'bg-secondary-container' : 'bg-white/30'}`} />
              </span>
              <span className={now?.open ? 'text-secondary-container' : 'text-white/80'}>
                {now?.open ? td('open') : td('closed')}
              </span>
              <span className="text-white/75 normal-case tracking-wide text-[13px]">
                {now?.open ? td('until', { time: `${CLOSES}:00` }) : td(`opens_${now?.next ?? 'today'}`, { time: opens })}
              </span>
            </p>
          </div>

          {/* The week, with today marked */}
          <ol className="mt-10 md:mt-12 grid grid-cols-7 gap-1.5 md:gap-2 max-w-xl">
            {days.map((name, i) => {
              const works = i < WORK_DAYS
              const today = now?.day === i
              return (
                <li key={name} aria-current={today ? 'date' : undefined}>
                  <span className={`block h-px mb-3 transition-all duration-700 ${
                    today ? 'bg-secondary-container h-0.5' : works ? 'bg-white/40' : 'bg-white/20'
                  }`} />
                  <span className={`block font-label text-[11px] uppercase tracking-[0.2em] mb-1.5 transition-colors duration-700 ${
                    today ? 'text-secondary-container' : works ? 'text-white/85' : 'text-white/50'
                  }`}>
                    {name}
                  </span>
                  <span className={`block font-body text-[11px] md:text-[13px] tabular-nums ${works ? 'text-white/65' : 'text-white/45'}`}>
                    {works ? `${OPENS}–${CLOSES}` : td('day_off')}
                  </span>
                </li>
              )
            })}
          </ol>
          <p className="mt-8 font-body text-sm text-white/70 tracking-wide">
            {t('hours')} · {t('location')}
          </p>
        </div>

        {/* ── Channels ───────────────────────────────── */}
        <ul className="lg:col-span-6 border-b border-white/10">
          {channels.map(({ id, label, value, href, external }) => (
            <li key={id}>
              <a
                href={href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="group flex items-end justify-between gap-6 border-t border-white/10 py-7 md:py-9"
              >
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3">
                    <span className="font-label text-[11px] uppercase tracking-[0.3em] text-white/65">{label}</span>
                    {best === id && (
                      <span className="font-label text-[11px] uppercase tracking-[0.2em] text-secondary-container">
                        {td(now?.open ? 'tip_call' : 'tip_write')}
                      </span>
                    )}
                  </span>
                  <span className="block font-headline text-[1.7rem] sm:text-4xl md:text-5xl leading-tight whitespace-nowrap transition-colors duration-[400ms] group-hover:text-secondary-container">
                    {value}
                  </span>
                </span>
                <span className="material-symbols-outlined !text-2xl md:!text-3xl text-white/55 mb-1 md:mb-2 transition-all duration-[400ms] group-hover:text-secondary-container group-hover:translate-x-1 group-hover:-translate-y-1">
                  arrow_outward
                </span>
              </a>
            </li>
          ))}
        </ul>

      </div>
    </section>
  )
}
