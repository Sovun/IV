'use client'
import { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import type { GalleryCategory } from '@/lib/gallery'
import { Link } from '@/i18n/navigation'
import { useMoodboard } from '@/lib/moodboard'

export default function PortfolioPage({ categories }: { categories: GalleryCategory[] }) {
  const t    = useTranslations('portfolio')
  const tCat = useTranslations('categories')

  const [activeKey, setActiveKey] = useState<string>(categories[0]?.key ?? '')
  const [lightboxIndex, setLightboxIndex] = useState(-1)

  // Fall back to the first category if the active one is missing (e.g. locale switch)
  const activeCategory = categories.find(c => c.key === activeKey) ?? categories[0]
  const slides = (activeCategory?.photos ?? []).map(p => ({
    src: p.src,
    width: 2000,
    height: 1333,
  }))

  const openLightbox = useCallback((idx: number) => setLightboxIndex(idx), [])

  const { saved, isSaved, toggle } = useMoodboard()
  const currentPhoto = activeCategory?.photos[lightboxIndex]

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
    <div className="bg-surface text-primary min-h-screen">

      {/* Page header */}
      <div className="text-center pt-40 pb-20 px-6 bg-surface-container">
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
                onClick={() => setActiveKey(key)}
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {activeCategory.photos.map((photo, idx) => (
                <div
                  key={photo.id}
                  className="relative aspect-square overflow-hidden group cursor-pointer bg-surface-container-low"
                  onClick={() => openLightbox(idx)}
                >
                  {saveButton(photo, `absolute top-2 right-2 z-10 w-10 h-10 flex items-center justify-center backdrop-blur-sm transition-all duration-[400ms] ${
                    isSaved(photo.src)
                      ? 'bg-secondary text-on-secondary opacity-100'
                      : 'bg-charcoal-900/40 text-white md:opacity-0 group-hover:opacity-100 hover:bg-secondary'
                  }`)}
                  <Image
                    src={photo.src}
                    alt={`Custom furniture by Igor Vasylkov — ${tCat(photo.category as Parameters<typeof tCat>[0])}`}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              ))}
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
        saved.length > 0 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'
      }`}>
        <Link
          href="/contact#brief"
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
        </Link>
      </div>
    </div>
  )
}
