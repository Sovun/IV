'use client'
import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

// How a piece comes to be, told as a scroll story: the steps pass down the
// right column while a photo for the current step stays pinned on the left.

const STEPS = ['talk', 'draw', 'make', 'fit'] as const

export default function HomeProcess({ photos }: { photos: string[] }) {
  const t = useTranslations('home.process')
  const [active, setActive] = useState(0)
  const stepRefs = useRef<(HTMLLIElement | null)[]>([])
  const inView   = useRef(new Set<number>())

  // The current step is the last one that has reached the upper half of the
  // viewport. Tracking a set rather than the latest crossing keeps it right
  // after a jump (anchor link, fast scroll) that skips a step entirely.
  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      for (const e of entries) {
        const i = Number((e.target as HTMLElement).dataset.step)
        if (e.isIntersecting) inView.current.add(i); else inView.current.delete(i)
      }
      if (inView.current.size > 0) setActive(Math.max(...inView.current))
    }, { rootMargin: '0px 0px -50% 0px' })
    stepRefs.current.forEach(el => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  const num = (i: number) => String(i + 1).padStart(2, '0')

  return (
    <section className="bg-surface-container-low py-16 md:py-32 px-6 md:px-12">
      <div className="max-w-[1920px] mx-auto">

        <div className="max-w-2xl mb-12 md:mb-24">
          <span className="font-label text-[10px] uppercase tracking-[0.3em] text-secondary mb-4 block">
            {t('label')}
          </span>
          <h2 className="text-3xl md:text-5xl font-headline mb-6">{t('title')}</h2>
          <p className="text-primary/70 leading-relaxed font-body">{t('body')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-start">

          {/* ── Pinned photo (desktop) ───────────────── */}
          <div className="hidden md:block md:col-span-5 md:sticky md:top-28">
            <div className="relative aspect-[4/5] max-h-[calc(100vh-11rem)] overflow-hidden bg-surface-container">
              {STEPS.map((key, i) => (
                <Image
                  key={key}
                  src={photos[i]}
                  alt={`${t(`${key}_title`)} — Ivolga workshop, Odessa`}
                  fill
                  sizes="40vw"
                  quality={85}
                  className={`object-cover transition-all duration-1000 ease-out ${
                    i === active ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                  }`}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/70 via-transparent to-transparent" />
              <div className="absolute left-8 bottom-6 flex items-baseline gap-4 text-white">
                <span className="font-headline text-[9rem] leading-none tracking-tighter tabular-nums">
                  {num(active)}
                </span>
                <span className="font-label text-[10px] uppercase tracking-[0.3em] text-white/70 pb-6">
                  / {num(STEPS.length - 1)}
                </span>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-6 flex gap-2">
              {STEPS.map((key, i) => (
                <span
                  key={key}
                  className={`h-px flex-1 transition-colors duration-500 ${i <= active ? 'bg-secondary' : 'bg-primary/15'}`}
                />
              ))}
            </div>
          </div>

          {/* ── Steps ────────────────────────────────── */}
          <ol className="md:col-span-6 md:col-start-7">
            {STEPS.map((key, i) => {
              const on = i === active
              return (
                <li
                  key={key}
                  data-step={i}
                  ref={el => { stepRefs.current[i] = el }}
                  className={`py-10 md:py-0 md:min-h-[60vh] md:flex md:flex-col md:justify-center transition-opacity duration-500 ${on ? 'opacity-100' : 'md:opacity-30'}`}
                >
                  {/* Mobile: the photo travels with its step */}
                  <div className="relative aspect-[3/2] overflow-hidden bg-surface-container mb-6 md:hidden">
                    <Image
                      src={photos[i]}
                      alt={`${t(`${key}_title`)} — Ivolga workshop, Odessa`}
                      fill
                      sizes="100vw"
                      quality={80}
                      className="object-cover"
                    />
                  </div>

                  <p className="flex items-center gap-4 font-label text-[10px] uppercase tracking-[0.3em] text-secondary mb-5">
                    <span className={`h-px bg-secondary transition-all duration-700 ${on ? 'w-10' : 'w-0 md:w-4'}`} />
                    <span className="text-primary/40">{num(i)}</span>
                    {t(`${key}_label`)}
                  </p>
                  <h3 className="font-headline text-2xl md:text-4xl leading-tight mb-5">{t(`${key}_title`)}</h3>
                  <p className="font-body text-primary/70 leading-relaxed max-w-xl">{t(`${key}_body`)}</p>
                </li>
              )
            })}

            <li className="pt-6 md:pt-0 md:min-h-[30vh] md:flex md:items-center">
              <a
                href="#contact"
                className="inline-flex items-center gap-4 font-label font-bold text-[10px] uppercase tracking-[0.2em] text-primary hover:text-secondary transition-colors duration-[400ms] group"
              >
                <span className="border-b border-secondary pb-1">{t('cta')}</span>
                <span className="material-symbols-outlined text-secondary transition-transform duration-[400ms] group-hover:translate-x-1">
                  arrow_forward
                </span>
              </a>
            </li>
          </ol>

        </div>
      </div>
    </section>
  )
}
