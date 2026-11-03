'use client'
import { useState, useCallback, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import type { GalleryCategory } from '@/lib/gallery'
import { useMoodboard } from '@/lib/moodboard'
import { setGalleryCategory, useGalleryCategory } from '@/lib/galleryCategory'

// Editorial layout for 3:2 photographs: every three pieces form a module with
// one large image (two columns, two rows) beside two stacked small ones. The
// large side alternates. Two stacked 3:2 frames are as tall as one at double
// width, so nothing is cropped beyond a few pixels of gutter.
function place(i: number, n: number) {
  const modules = Math.floor(n / 3)
  const m = Math.floor(i / 3)
  if (m < modules) {
    const k = i % 3
    const bigLeft = m % 2 === 0
    const row = 2 * m + 1
    if (bigLeft ? k === 0 : k === 2) {
      return { col: bigLeft ? '1 / span 2' : '2 / span 2', row: `${row} / span 2`, big: true, fill: true }
    }
    const stack = bigLeft ? k - 1 : k
    return { col: bigLeft ? '3' : '1', row: `${row + stack}`, big: false, fill: false }
  }
  // Leftovers: a single piece takes a wide frame, a pair sits side by side.
  // Nothing shares these rows, so the frames keep their own 3:2 height.
  const row = 2 * modules + 1
  const rest = n - modules * 3
  if (rest === 1) return { col: '1 / span 2', row: `${row}`, big: true, fill: false }
  return { col: `${i - modules * 3 + 1}`, row: `${row}`, big: false, fill: false }
}

export default function Gallery({ categories }: { categories: GalleryCategory[] }) {
  const t    = useTranslations('portfolio')
  const tCat = useTranslations('categories')

  // Chosen here or on the home plan; null means the first category
  const activeKey = useGalleryCategory()
  const [lightboxIndex, setLightboxIndex] = useState(-1)

  const activeCategory = categories.find(c => c.key === activeKey) ?? categories[0]
  const slides = (activeCategory?.photos ?? []).map(p => ({
    src: p.src,
    width: 2000,
    height: 1333,
  }))

  const openLightbox = useCallback((idx: number) => setLightboxIndex(idx), [])

  const { saved, isSaved, toggle } = useMoodboard()

  // The brief lower on the page shows the saved photos itself, so the bar steps aside there
  const [briefInView, setBriefInView] = useState(false)
  useEffect(() => {
    const brief = document.getElementById('brief')
    if (!brief) return
    const io = new IntersectionObserver(([e]) => setBriefInView(e.isIntersecting))
    io.observe(brief)
    return () => io.disconnect()
  }, [])
  const currentPhoto = activeCategory?.photos[lightboxIndex]

  // Carry the photo into the brief as a reference, then go there
  const keep = (photo: GalleryCategory['photos'][number]) => {
    if (!isSaved(photo.src)) toggle({ src: photo.src, category: photo.category })
  }

  // Fade each piece in as it scrolls into view; re-run when the category changes
  const gridRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    const io = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        e.target.classList.add('is-in')
        io.unobserve(e.target)
      }
    }, { rootMargin: '0px 0px -8% 0px' })
    grid.querySelectorAll('.reveal').forEach(n => io.observe(n))
    return () => io.disconnect()
  }, [activeCategory?.key])

  const saveButton = (photo: GalleryCategory['photos'][number], className: string) => {
    const on = isSaved(photo.src)
    return (
      <button
        key="moodboard"
        type="button"
        onClick={e => { e.stopPropagation(); toggle({ src: photo.src, category: photo.category }) }}
        aria-pressed={on}
        aria-label={on ? t('saved') : t('save')}
        title={on ? t('saved') : t('save')}
        className={className}
      >
        <span
          className="material-symbols-outlined !text-xl"
          style={{ fontVariationSettings: `'FILL' ${on ? 1 : 0}` }}
        >
          favorite
        </span>
      </button>
    )
  }

  return (
    <section id="gallery" className="bg-surface text-primary scroll-mt-14">

      {/* Section header */}
      <div className="text-center py-20 md:py-28 px-6 bg-surface-container">
        <span className="font-label text-[10px] uppercase tracking-[0.3em] text-secondary mb-6 block">
          {t('label')}
        </span>
        <h1 className="font-headline text-5xl md:text-6xl tracking-tight text-primary">
          {t('title')}
        </h1>
      </div>

      {/* Category tiles */}
      <div className="bg-surface py-10 md:py-16 px-4 md:px-12">
        <div className="max-w-[1920px] mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {categories.map(({ key, photos }) => {
            const cover = photos[0]?.src
            const isActive = key === activeCategory?.key
            return (
              <button
                key={key}
                onClick={() => setGalleryCategory(key)}
                className={`group relative aspect-[3/4] overflow-hidden text-left transition-all duration-500 ${
                  isActive ? 'scale-[1.02]' : 'opacity-80 hover:opacity-100'
                }`}
              >
                {cover && (
                  <Image
                    src={cover}
                    alt={tCat(key as Parameters<typeof tCat>[0])}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className={`object-cover transition-transform duration-700 ${
                      isActive ? 'scale-105' : 'group-hover:scale-105'
                    }`}
                  />
                )}
                {/* Gradient overlay */}
                <div className={`absolute inset-0 transition-opacity duration-500 ${
                  isActive
                    ? 'bg-gradient-to-t from-primary/90 via-primary/30 to-transparent'
                    : 'bg-gradient-to-t from-primary/70 via-primary/10 to-transparent group-hover:from-primary/80'
                }`} />
                {/* Label */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className={`font-label text-[9px] uppercase tracking-[0.25em] mb-1 transition-colors duration-300 ${
                    isActive ? 'text-secondary' : 'text-on-primary/60'
                  }`}>
                    {t('pieces', { count: photos.length })}
                  </p>
                  <h3 className="font-headline text-on-primary text-base leading-tight">
                    {tCat(key as Parameters<typeof tCat>[0])}
                  </h3>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Photo grid for selected category */}
      {activeCategory && (
        <div className="bg-surface-container py-10 md:py-16 px-4 md:px-12">
          <div className="max-w-[1920px] mx-auto">
            <div className="flex items-baseline gap-4 mb-8 md:mb-10">
              <h2 className="font-headline text-3xl text-primary">
                {tCat(activeCategory.key as Parameters<typeof tCat>[0])}
              </h2>
              <span className="font-label text-[10px] uppercase tracking-widest text-primary/40">
                {t('works', { count: activeCategory.photos.length })}
              </span>
            </div>
            <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              {activeCategory.photos.map((photo, idx) => {
                const { col, row, big, fill } = place(idx, activeCategory.photos.length)
                const on = isSaved(photo.src)
                return (
                  <div
                    key={photo.id}
                    style={{ '--c': col, '--r': row, transitionDelay: `${(idx % 3) * 90}ms` } as React.CSSProperties}
                    className={`reveal group relative overflow-hidden cursor-pointer bg-surface-container-low aspect-[3/2] md:[grid-column:var(--c)] md:[grid-row:var(--r)] ${
                      fill ? 'md:aspect-auto md:h-full' : ''
                    }`}
                    onClick={() => openLightbox(idx)}
                  >
                    <Image
                      src={photo.src}
                      alt={`Custom furniture by Igor Vasylkov — ${tCat(photo.category as Parameters<typeof tCat>[0])}`}
                      fill
                      sizes={big ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
                      quality={85}
                      className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                    />

                    {/* Editorial caption: hover on desktop, always on touch */}
                    <div className="absolute inset-x-0 bottom-0 pt-20 pb-4 px-4 md:pb-5 md:px-5 flex items-end justify-between gap-4 bg-gradient-to-t from-charcoal-900/70 via-charcoal-900/20 to-transparent transition-opacity duration-500 md:opacity-0 md:group-hover:opacity-100">
                      <div className="min-w-0 translate-y-0 md:translate-y-2 md:group-hover:translate-y-0 transition-transform duration-500">
                        <p className="font-label text-[9px] uppercase tracking-[0.3em] text-white/60 mb-1">
                          {String(idx + 1).padStart(2, '0')} / {String(activeCategory.photos.length).padStart(2, '0')}
                        </p>
                        <p className={`font-headline text-white leading-tight truncate ${big ? 'text-xl md:text-2xl' : 'text-base'}`}>
                          {tCat(activeCategory.key as Parameters<typeof tCat>[0])}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-px" onClick={e => e.stopPropagation()}>
                        {saveButton(photo, `w-11 h-11 flex items-center justify-center backdrop-blur-sm transition-colors duration-[400ms] ${
                          on ? 'bg-secondary text-on-secondary' : 'bg-white/15 text-white hover:bg-secondary'
                        }`)}
                        <a
                          href="#brief"
                          onClick={() => keep(photo)}
                          aria-label={t('ask')}
                          title={t('ask')}
                          className="w-11 h-11 flex items-center justify-center backdrop-blur-sm bg-white/15 text-white hover:bg-secondary transition-colors duration-[400ms]"
                        >
                          <span className="material-symbols-outlined !text-xl">forum</span>
                        </a>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={slides}
        styles={{
          container: { backgroundColor: 'rgba(31, 30, 29, 0.97)' },
        }}
        toolbar={{
          buttons: [
            currentPhoto && saveButton(currentPhoto, `yarl__button flex items-center gap-2 ${isSaved(currentPhoto.src) ? '!text-secondary' : ''}`),
            'close',
          ],
        }}
        carousel={{ finite: false }}
        animation={{ fade: 300 }}
        controller={{ closeOnBackdropClick: true }}
        on={{
          view: ({ index }) => setLightboxIndex(index),
        }}
      />

      {/* Moodboard bar */}
      <div className={`fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-md transition-all duration-500 ${
        saved.length > 0 && !briefInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'
      }`}>
        <a
          href="#brief"
          className="group flex items-center gap-4 bg-primary text-on-primary pl-2 pr-5 py-2 shadow-[0_24px_60px_-20px_rgba(40,30,15,0.6)] hover:bg-secondary transition-colors duration-[400ms]"
        >
          <span className="flex -space-x-3 shrink-0">
            {saved.slice(-3).map(p => (
              <span key={p.src} className="relative w-10 h-10 overflow-hidden ring-2 ring-primary group-hover:ring-secondary transition-all duration-[400ms]">
                <Image src={p.src} alt="" fill sizes="40px" className="object-cover" />
              </span>
            ))}
          </span>
          <span className="flex-1 min-w-0">
            <span className="block font-label text-[9px] uppercase tracking-[0.25em] text-on-primary/60">
              {t('board_count', { count: saved.length })}
            </span>
            <span className="block font-headline text-base leading-tight truncate">{t('board_cta')}</span>
          </span>
          <span className="material-symbols-outlined text-secondary group-hover:text-on-primary transition-colors duration-[400ms]">
            arrow_forward
          </span>
        </a>
      </div>
    </section>
  )
}
