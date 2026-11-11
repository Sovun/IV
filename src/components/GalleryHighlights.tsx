'use client'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import type { CategoryKey } from '@/lib/categories'
import type { GalleryPhoto } from '@/lib/gallery'
import { setGalleryCategory } from '@/lib/galleryCategory'
import GalleryGrid from './GalleryGrid'

// The gallery as the home page shows it: a short selection, one photo per
// project, then the way into the full gallery, whole or by category.

export default function GalleryHighlights({ photos, categories }: {
  photos: GalleryPhoto[]
  categories: { key: CategoryKey; count: number }[]
}) {
  const t    = useTranslations('portfolio')
  const tCat = useTranslations('categories')
  const total = categories.reduce((n, c) => n + c.count, 0)

  return (
    <section id="gallery" className="bg-surface text-primary scroll-mt-14">

      {/* Section header */}
      <div className="text-center py-16 md:py-28 px-6 bg-surface-container">
        <span className="font-label text-[10px] uppercase tracking-[0.3em] text-secondary mb-6 block">
          {t('label')}
        </span>
        <h2 className="font-headline text-4xl md:text-6xl tracking-tight text-primary">
          {t('highlights_title')}
        </h2>
        <p className="mt-6 font-label text-[10px] uppercase tracking-[0.25em] text-primary/50">
          {t('highlights_note', { shown: photos.length, total })}
        </p>
      </div>

      <div className="py-6 md:py-16 px-2 md:px-12">
        <div className="max-w-[1920px] mx-auto">
          <GalleryGrid photos={photos} />
        </div>
      </div>

      {/* The way into the full gallery. No bottom padding: the workshop section
          below shares this background and brings its own top padding. */}
      <div className="bg-surface-container pt-14 md:pt-24 px-6 md:px-12">
        <div className="max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-start">
          <div className="md:col-span-5">
            <h3 className="font-headline text-3xl md:text-5xl leading-tight mb-5">{t('all_title')}</h3>
            <p className="font-body text-primary/70 leading-relaxed max-w-md mb-8 md:mb-10">
              {t('all_body', { total, count: categories.length })}
            </p>
            <Link
              href="/portfolio"
              className="inline-block bg-primary text-on-primary px-10 py-5 text-xs font-label uppercase tracking-widest hover:bg-secondary transition-colors duration-[400ms]"
            >
              {t('all_cta')}
            </Link>
          </div>

          <ul className="md:col-span-6 md:col-start-7 grid grid-cols-1 sm:grid-cols-2 gap-x-10 border-b border-outline-variant/60 sm:border-b-0">
            {categories.map(({ key, count }) => (
              <li key={key}>
                <Link
                  href="/portfolio#works"
                  onClick={() => setGalleryCategory(key)}
                  className="group flex items-baseline justify-between gap-4 border-t border-outline-variant/60 py-4 md:py-5"
                >
                  <span className="font-headline text-lg md:text-xl leading-tight group-hover:text-secondary transition-colors duration-[400ms]">
                    {tCat(key)}
                  </span>
                  <span className="flex items-center gap-3 shrink-0 font-label text-[11px] tabular-nums tracking-widest text-primary/50">
                    {count}
                    <span className="material-symbols-outlined !text-base text-secondary transition-transform duration-[400ms] group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </section>
  )
}
