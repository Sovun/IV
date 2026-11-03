import { getTranslations } from 'next-intl/server'
import Image from 'next/image'

// The workshop and its founder as an editorial dossier: a masthead with the
// founder's portrait hanging over the fold, the story of the business told as
// three dated chapters, a strip of plain facts, the craft text beside its own
// closing line and the question the team keeps asking, set on aged oak.

const PORTRAIT = '/igor-bird.jpg'
const WOOD     = '/japan_gate.jpg'

const MILESTONES = ['m1', 'm2', 'm3'] as const

export default async function Master({ rooms, pieces }: { rooms: number; pieces: number }) {
  const t = await getTranslations('about')

  const chapters = t('body').split('\n\n')
  const craft    = t('craft_text').split('\n\n')
  const closing  = craft.length > 1 ? craft.pop() : undefined

  const facts = [
    { value: '2002',  label: t('fact_since') },
    { value: rooms,   label: t('fact_rooms',  { count: rooms }) },
    { value: pieces,  label: t('fact_pieces', { count: pieces }) },
    { value: '1',     label: t('fact_hands') },
  ]

  const label = 'font-label text-[10px] uppercase tracking-[0.3em] text-secondary block'

  return (
    <section id="master" className="bg-surface text-primary scroll-mt-14">

      {/* ── Masthead ─────────────────────────────────── */}
      <div className="bg-surface-container pt-20 md:pt-32 pb-16 md:pb-0 px-6 md:px-12">
        <div className="max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-end">

          <div className="md:col-span-7 md:pb-28">
            <span className={`${label} mb-6`}>{t('subtitle')}</span>
            <h2 className="font-headline text-5xl md:text-8xl tracking-tighter leading-[0.95] mb-8 md:mb-10">
              {t('title')}
            </h2>
            <p className="font-headline italic text-xl md:text-2xl text-primary/80 leading-relaxed max-w-2xl">
              {t('lede')}
            </p>
          </div>

          {/* The portrait hangs over the edge into the next block */}
          <div className="md:col-span-4 md:col-start-9 md:translate-y-28">
            <div className="relative aspect-[4/5] overflow-hidden bg-surface-container-low">
              <Image
                src={PORTRAIT}
                alt="Igor Vasylkov — founder and managing director of the custom furniture workshop, Odessa / Ігор Васильков — засновник і керівник меблевої майстерні, Одеса"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                quality={85}
                className="object-cover"
              />
            </div>
            <p className="mt-4 flex justify-between font-label text-[10px] uppercase tracking-[0.25em] text-primary/50">
              <span>Igor Vasylkov</span>
              <span>{t('location')}</span>
            </p>
          </div>

        </div>
      </div>

      {/* ── Three chapters ───────────────────────────── */}
      <div className="bg-surface pt-16 md:pt-48 pb-16 md:pb-32 px-6 md:px-12">
        <div className="max-w-[1920px] mx-auto">
          <span className={`${label} mb-10 md:mb-14`}>{t('timeline_label')}</span>

          <ol className="relative grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10">
            {/* Rail: down the left on mobile, across the top on desktop */}
            <span aria-hidden className="absolute left-[3px] top-2 bottom-2 w-px bg-secondary/30 md:left-0 md:right-0 md:top-[5px] md:bottom-auto md:h-px md:w-auto" />

            {MILESTONES.map((m, i) => (
              <li key={m} className="relative pl-8 md:pl-0 md:pt-12">
                <span aria-hidden className="absolute left-0 top-2 w-[7px] h-[7px] bg-secondary md:top-[2px]" />
                <p className="font-headline text-5xl md:text-7xl tracking-tighter leading-none mb-5 tabular-nums">
                  {t(`${m}_year`)}
                </p>
                <p className={`${label} mb-5`}>
                  <span className="text-primary/40 mr-3">0{i + 1}</span>{t(`${m}_title`)}
                </p>
                <p className="font-body text-primary/70 leading-relaxed max-w-md">
                  {chapters[i]}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* ── Facts ────────────────────────────────────── */}
      <div className="bg-surface-container-low py-12 md:py-20 px-6 md:px-12">
        <dl className="max-w-[1920px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-8">
          {facts.map(({ value, label: text }) => (
            <div key={text}>
              <dd className="font-headline text-5xl md:text-7xl tracking-tighter leading-none tabular-nums mb-3">
                {value}
              </dd>
              <dt className="font-label text-[10px] uppercase tracking-[0.2em] text-primary/50 leading-relaxed max-w-[14rem]">
                {text}
              </dt>
            </div>
          ))}
        </dl>
      </div>

      {/* ── The craft ────────────────────────────────── */}
      <div className="bg-surface py-16 md:py-32 px-6 md:px-12">
        <div className="max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-start">
          <div className="md:col-span-5 md:sticky md:top-28">
            <h3 className="font-headline text-3xl md:text-5xl leading-tight">{t('craft_title')}</h3>
          </div>
          <div className="md:col-span-6 md:col-start-7 space-y-6">
            {craft.map((para, i) => (
              <p key={i} className="font-body text-primary/70 leading-relaxed">{para}</p>
            ))}
            {closing && (
              <p className="font-headline text-2xl md:text-3xl leading-snug pt-4">{closing}</p>
            )}
          </div>
        </div>
      </div>

      {/* ── The question, on wood ────────────────────── */}
      <div className="relative overflow-hidden min-h-[20rem] md:min-h-[26rem] flex items-center">
        <Image
          src={WOOD}
          alt="Aged oak door with hand-forged iron plates — matched finishes in an old building / Старі дубові двері з кованими пластинами"
          fill
          sizes="100vw"
          quality={80}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-charcoal-900/65" />
        <blockquote className="relative max-w-4xl mx-auto px-6 md:px-12 py-16 text-center">
          <p className="font-headline italic text-2xl md:text-5xl leading-snug text-white">
            {t('craft_quote')}
          </p>
          <footer className="mt-6 font-label text-[10px] uppercase tracking-[0.3em] text-secondary-container">
            Igor Vasylkov
          </footer>
        </blockquote>
      </div>

    </section>
  )
}
