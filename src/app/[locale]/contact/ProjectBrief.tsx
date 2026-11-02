'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import type { CategoryKey } from '@/lib/categories'

const TELEGRAM_URL = 'https://t.me/+380977939401'
const EMAIL        = 'ive@ukr.net'
const PHONE        = '+380674864629'

const STAGES    = ['idea', 'design', 'renovation', 'replica'] as const
const TIMELINES = ['asap', 'months', 'year', 'exploring'] as const

export interface BriefCover {
  key: CategoryKey
  src: string
}

export default function ProjectBrief({ covers }: { covers: BriefCover[] }) {
  const t  = useTranslations('contact.brief')
  const tc = useTranslations('categories')

  const [items, setItems]       = useState<CategoryKey[]>([])
  const [stage, setStage]       = useState<typeof STAGES[number] | null>(null)
  const [timeline, setTimeline] = useState<typeof TIMELINES[number] | null>(null)
  const [place, setPlace]       = useState('')
  const [note, setNote]         = useState('')
  const [name, setName]         = useState('')
  const [copied, setCopied]     = useState(false)

  const toggle = (key: CategoryKey) =>
    setItems(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])

  const ready = items.length > 0 || note.trim().length > 0

  const fields = [
    items.length > 0 && `${t('letter_what')}: ${items.map(k => tc(k)).join(', ')}`,
    stage            && `${t('letter_stage')}: ${t(`stage_${stage}`)}`,
    timeline         && `${t('letter_timeline')}: ${t(`timeline_${timeline}`)}`,
    place.trim()     && `${t('letter_place')}: ${place.trim()}`,
  ].filter(Boolean)

  const letter = [
    t('letter_greeting'),
    t('letter_intro'),
    ...(fields.length > 0 ? ['', ...fields] : []),
    ...(note.trim() ? ['', note.trim()] : []),
    '',
    name.trim() || t('letter_thanks'),
  ].join('\n')

  const sendTelegram = () => {
    navigator.clipboard?.writeText(letter).then(() => setCopied(true), () => {})
  }

  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(t('email_subject'))}&body=${encodeURIComponent(letter)}`

  const chip = (active: boolean) =>
    `px-4 py-2.5 font-label text-xs tracking-wide border transition-colors duration-[400ms] ${
      active
        ? 'bg-primary text-on-primary border-primary'
        : 'border-outline-variant text-primary hover:border-secondary hover:text-secondary'
    }`

  const stepLabel = (n: number, text: string) => (
    <p className="font-label text-[10px] uppercase tracking-[0.3em] text-secondary mb-5">
      <span className="text-primary/40 mr-3">0{n}</span>{text}
    </p>
  )

  return (
    <section id="brief" className="py-16 md:py-24 px-6 md:px-16 bg-surface border-b border-outline-variant/40">
      <div className="max-w-6xl mx-auto">

        <div className="max-w-2xl mb-12 md:mb-16">
          <h2 className="font-headline text-3xl md:text-5xl leading-tight mb-5">{t('title')}</h2>
          <p className="font-body text-primary/70 leading-relaxed">{t('intro')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* ── Steps ─────────────────────────────── */}
          <div className="lg:col-span-7 space-y-12">

            <div>
              {stepLabel(1, t('step_what'))}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                {covers.map(({ key, src }) => {
                  const active = items.includes(key)
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggle(key)}
                      aria-pressed={active}
                      className={`group relative aspect-square sm:aspect-[4/5] overflow-hidden text-left outline-offset-2 transition-all duration-[400ms] ${
                        active ? 'ring-2 ring-secondary ring-offset-2 ring-offset-surface' : ''
                      }`}
                    >
                      <Image
                        src={src}
                        alt={tc(key)}
                        fill
                        sizes="(max-width: 640px) 33vw, 15vw"
                        className={`object-cover transition-transform duration-700 group-hover:scale-105 ${active ? 'scale-105' : ''}`}
                      />
                      <div className={`absolute inset-0 transition-colors duration-[400ms] ${
                        active ? 'bg-charcoal-900/35' : 'bg-gradient-to-t from-charcoal-900/75 via-charcoal-900/10 to-transparent'
                      }`} />
                      <span className={`absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-secondary text-on-secondary transition-all duration-300 ${
                        active ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                      }`}>
                        <span className="material-symbols-outlined !text-base">check</span>
                      </span>
                      <span className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 font-headline text-xs sm:text-sm text-white leading-tight">
                        {tc(key)}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              {stepLabel(2, t('step_stage'))}
              <div className="flex flex-wrap gap-2">
                {STAGES.map(s => (
                  <button key={s} type="button" onClick={() => setStage(stage === s ? null : s)} aria-pressed={stage === s} className={chip(stage === s)}>
                    {t(`stage_${s}`)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              {stepLabel(3, t('step_timeline'))}
              <div className="flex flex-wrap gap-2">
                {TIMELINES.map(s => (
                  <button key={s} type="button" onClick={() => setTimeline(timeline === s ? null : s)} aria-pressed={timeline === s} className={chip(timeline === s)}>
                    {t(`timeline_${s}`)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              {stepLabel(4, t('step_details'))}
              <div className="space-y-6">
                <input
                  value={place}
                  onChange={e => setPlace(e.target.value)}
                  placeholder={t('place_placeholder')}
                  className="w-full bg-transparent border-b border-outline-variant focus:border-secondary outline-none py-3 font-body text-primary placeholder:text-primary/40 transition-colors duration-[400ms]"
                />
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder={t('note_placeholder')}
                  rows={3}
                  className="w-full bg-transparent border-b border-outline-variant focus:border-secondary outline-none py-3 font-body text-primary placeholder:text-primary/40 resize-none transition-colors duration-[400ms]"
                />
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={t('name_placeholder')}
                  autoComplete="name"
                  className="w-full bg-transparent border-b border-outline-variant focus:border-secondary outline-none py-3 font-body text-primary placeholder:text-primary/40 transition-colors duration-[400ms]"
                />
              </div>
            </div>
          </div>

          {/* ── Letter preview ────────────────────── */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <p className="font-label text-[10px] uppercase tracking-[0.3em] text-secondary mb-5">{t('preview_label')}</p>
            <div className="bg-surface-container-lowest shadow-[0_24px_60px_-30px_rgba(40,30,15,0.35)] border-t-2 border-secondary p-8 md:p-10">
              <p className="font-label text-[10px] uppercase tracking-widest text-primary/40 mb-6">
                {t('preview_to')}
              </p>
              <pre className={`whitespace-pre-wrap font-headline text-base md:text-lg leading-relaxed transition-colors duration-[400ms] ${
                ready ? 'text-on-surface' : 'text-primary/40'
              }`}>
                {letter}
              </pre>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={ready ? sendTelegram : e => e.preventDefault()}
                aria-disabled={!ready}
                className={`text-center px-6 py-4 text-xs font-label uppercase tracking-widest transition-all duration-[400ms] ${
                  ready ? 'bg-primary text-on-primary hover:bg-secondary' : 'bg-primary/20 text-on-primary cursor-not-allowed'
                }`}
              >
                {t('send_telegram')}
              </a>
              <a
                href={ready ? mailto : undefined}
                aria-disabled={!ready}
                className={`text-center px-6 py-4 text-xs font-label uppercase tracking-widest border transition-all duration-[400ms] ${
                  ready ? 'border-primary text-primary hover:border-secondary hover:bg-secondary hover:text-white' : 'border-primary/20 text-primary/30 cursor-not-allowed'
                }`}
              >
                {t('send_email')}
              </a>
            </div>
            <p className="mt-4 font-body text-xs text-primary/60 leading-relaxed min-h-[2.5em]">
              {copied ? t('copied') : ready ? t('hint_ready') : t('hint_empty')}{' '}
              <a href={`tel:${PHONE}`} className="text-secondary border-b border-secondary/40 hover:border-secondary">
                {t('or_call')}
              </a>
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
