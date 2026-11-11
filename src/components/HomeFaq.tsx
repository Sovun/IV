import { getTranslations } from 'next-intl/server'

// The questions people ask before they call, answered plainly. Every answer is
// in the HTML even while folded, and the same text feeds the FAQPage schema.

type Item = { q: string; a: string }

export default async function HomeFaq() {
  const t = await getTranslations('home.faq')
  const items = t.raw('items') as Item[]

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  return (
    <section id="faq" className="bg-surface-container text-primary py-16 md:py-32 px-6 md:px-12 scroll-mt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-start">

        <div className="md:col-span-4">
          <span className="font-label text-[10px] uppercase tracking-[0.3em] text-secondary mb-4 block">
            {t('label')}
          </span>
          <h2 className="font-headline text-3xl md:text-5xl leading-tight">{t('title')}</h2>
        </div>

        <div className="md:col-span-7 md:col-start-6 border-b border-outline-variant/60">
          {items.map(({ q, a }) => (
            <details key={q} className="group border-t border-outline-variant/60">
              <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 py-6 md:py-7 [&::-webkit-details-marker]:hidden">
                <h3 className="font-headline text-xl md:text-2xl leading-snug group-hover:text-secondary transition-colors duration-[400ms]">
                  {q}
                </h3>
                <span className="material-symbols-outlined shrink-0 text-secondary transition-transform duration-[400ms] group-open:rotate-45" aria-hidden="true">
                  add
                </span>
              </summary>
              <p className="pb-7 md:pb-8 max-w-2xl font-body text-primary/75 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>

      </div>
    </section>
  )
}
