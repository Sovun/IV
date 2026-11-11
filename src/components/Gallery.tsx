'use client'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import type { GalleryCategory } from '@/lib/gallery'
import { setGalleryCategory, useGalleryCategory } from '@/lib/galleryCategory'
import GalleryGrid from './GalleryGrid'

// The full gallery, on its own page: every category as a tile, and every
// photo of the chosen one. The home page shows a short selection instead.

export default function Gallery({ categories }: { categories: GalleryCategory[] }) {
  const t    = useTranslations('portfolio')
  const tCat = useTranslations('categories')

  // Chosen here or on the home page; null means the first category
  const activeKey = useGalleryCategory()
  const activeCategory = categories.find(c => c.key === activeKey) ?? categories[0]

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
                    alt={t('cover_alt', { category: tCat(key) })}
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
                    {tCat(key)}
                  </h3>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Photo grid for selected category; links from the home page land here */}
      {activeCategory && (
        <div id="works" className="bg-surface-container py-10 md:py-16 px-4 md:px-12 scroll-mt-16">
          <div className="max-w-[1920px] mx-auto">
            <div className="flex items-baseline gap-4 mb-8 md:mb-10">
              <h2 className="font-headline text-3xl text-primary">
                {tCat(activeCategory.key)}
              </h2>
              <span className="font-label text-[10px] uppercase tracking-widest text-primary/40">
                {t('works', { count: activeCategory.photos.length })}
              </span>
            </div>
            <GalleryGrid photos={activeCategory.photos} />
          </div>
        </div>
      )}
    </section>
  )
}
