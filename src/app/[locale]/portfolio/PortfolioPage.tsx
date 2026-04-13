'use client'
import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import type { GalleryCategory } from '@/lib/gallery'

export default function PortfolioPage({ categories }: { categories: GalleryCategory[] }) {
  const t    = useTranslations('portfolio')
  const tCat = useTranslations('categories')

  const [activeKey, setActiveKey] = useState<string>(categories[0]?.key ?? '')
  const [lightboxIndex, setLightboxIndex] = useState(-1)

  const activeCategory = categories.find(c => c.key === activeKey)
  const slides = (activeCategory?.photos ?? []).map(p => ({
    src: p.src,
    width: 2000,
    height: 1333,
  }))

  const openLightbox = useCallback((idx: number) => setLightboxIndex(idx), [])

  // Reset to first category if it changes (e.g. locale switch)
  useEffect(() => {
    if (categories.length && !categories.find(c => c.key === activeKey)) {
      setActiveKey(categories[0].key)
    }
  }, [categories, activeKey])

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
            const isActive = key === activeKey
            return (
              <button
                key={key}
                onClick={() => setActiveKey(key)}
                className={`group relative aspect-[3/4] overflow-hidden text-left transition-all duration-500 ${
                  isActive ? 'ring-2 ring-secondary ring-offset-2 ring-offset-surface' : ''
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
                  className="aspect-square overflow-hidden group cursor-pointer bg-surface-container-low"
                  onClick={() => openLightbox(idx)}
                >
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
        carousel={{ finite: false }}
        animation={{ fade: 300 }}
        controller={{ closeOnBackdropClick: true }}
        on={{
          view: ({ index }) => setLightboxIndex(index),
        }}
      />
    </div>
  )
}
