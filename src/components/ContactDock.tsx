'use client'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { PHONE, TELEGRAM, CLOSES, OPENS, useWorkshopNow } from '@/lib/workshop'

// The contact section sits at the very end of a long page. This bar keeps the
// workshop one tap away from anywhere in between: it appears past the hero
// and leaves once the contact section arrives.

export default function ContactDock() {
  const t   = useTranslations('contact.desk')
  const now = useWorkshopNow()
  const [between, setBetween] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const contact = document.getElementById('contact')
      const beforeContact = !contact || contact.getBoundingClientRect().top > window.innerHeight
      setBetween(window.scrollY > window.innerHeight * 0.6 && beforeContact)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const best  = now?.open ? 'call' : 'telegram'

  const actions = [
    { id: 'call',     icon: 'call',      label: t('call'),     href: `tel:${PHONE}`, external: false },
    { id: 'telegram', icon: 'send',      label: t('telegram'), href: TELEGRAM,       external: true },
  ]

  return (
    <aside
      aria-label={t('dock_label')}
      inert={!between}
      className={`fixed z-40 bottom-4 inset-x-4 md:inset-x-auto md:right-8 md:bottom-8 transition-all duration-500 ${
        between ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex items-stretch bg-charcoal-900/90 backdrop-blur-md text-white shadow-[0_24px_60px_-20px_rgba(20,15,8,0.7)]">

        {/* Status */}
        <div className="flex-1 min-w-0 flex items-center gap-3 pl-4 pr-3 md:pl-5 md:pr-6 py-2.5">
          <span className="relative flex w-2 h-2 shrink-0">
            {now?.open && <span className="absolute inset-0 rounded-full bg-secondary-container motion-safe:animate-ping" />}
            <span className={`relative w-2 h-2 rounded-full ${now?.open ? 'bg-secondary-container' : 'bg-white/30'}`} />
          </span>
          <span className="min-w-0">
            <span className="block font-label text-[10px] uppercase tracking-[0.2em] text-white/70 truncate">
              {now?.open ? t('open') : t('closed')}
            </span>
            <span className="block font-headline text-sm leading-tight truncate">
              {now?.open
                ? t('until', { time: `${CLOSES}:00` })
                : t(`opens_${now?.next ?? 'today'}`, { time: `${OPENS}:00` })}
            </span>
          </span>
        </div>

        {/* Actions: the one that suits the hour is filled */}
        {actions.map(({ id, icon, label, href, external }) => (
          <a
            key={id}
            href={href}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className={`shrink-0 w-[4.25rem] md:w-20 flex flex-col items-center justify-center gap-1 py-2.5 border-l border-white/10 transition-colors duration-[400ms] ${
              best === id
                ? 'bg-secondary-container text-charcoal-900 hover:bg-white'
                : 'text-white/90 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined !text-xl">{icon}</span>
            <span className="font-label text-[10px] uppercase tracking-[0.12em]">{label}</span>
          </a>
        ))}

      </div>
    </aside>
  )
}
