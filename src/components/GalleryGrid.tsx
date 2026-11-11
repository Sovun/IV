'use client'
import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import type { GalleryPhoto } from '@/lib/gallery'

// Editorial layout for 3:2 photographs: every three pieces form a module with
// one large image (two columns, two rows) beside two stacked small ones. The
// large side alternates. Two stacked 3:2 frames are as tall as one at double
// width, so nothing is cropped beyond a few pixels of gutter.
// On a phone the same module is one full-width frame and two halves side by side.
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

export default function GalleryGrid({ photos }: { photos: GalleryPhoto[] }) {
  const tCat = useTranslations('categories')
  const t    = useTranslations('portfolio')
  const [lightboxIndex, setLightboxIndex] = useState(-1)

  // Fade each piece in as it scrolls into view; re-run when the set changes
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
  }, [photos])

  return (
    <>
      <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
        {photos.map((photo, idx) => {
          const { col, row, big, fill } = place(idx, photos.length)
          const name = tCat(photo.category)
          return (
            <button
              key={photo.id}
              type="button"
              style={{ '--c': col, '--r': row, transitionDelay: `${(idx % 3) * 90}ms` } as React.CSSProperties}
              className={`reveal group relative overflow-hidden text-left cursor-pointer bg-surface-container-low aspect-[3/2] md:[grid-column:var(--c)] md:[grid-row:var(--r)] ${
                big ? 'col-span-2' : ''
              } ${fill ? 'md:aspect-auto md:h-full' : ''}`}
              onClick={() => setLightboxIndex(idx)}
            >
              <Image
                src={photo.src}
                alt={t('photo_alt', { category: name, n: idx + 1, total: photos.length })}
                fill
                sizes={big ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 50vw, 33vw'}
                quality={85}
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
              />

              {/* Editorial caption: hover on desktop, always on touch */}
              <span className={`absolute inset-x-0 bottom-0 block bg-gradient-to-t from-charcoal-900/70 via-charcoal-900/20 to-transparent transition-opacity duration-500 md:opacity-0 md:group-hover:opacity-100 md:pt-20 md:pb-5 md:px-5 ${
                big ? 'pt-16 pb-4 px-4' : 'pt-8 pb-2 px-2.5'
              }`}>
                <span className="block translate-y-0 md:translate-y-2 md:group-hover:translate-y-0 transition-transform duration-500">
                  <span className={`font-label text-[9px] uppercase tracking-[0.3em] text-white/60 mb-1 md:block ${big ? 'block' : 'hidden'}`}>
                    {String(idx + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
                  </span>
                  <span className={`block font-headline text-white leading-tight truncate ${big ? 'text-xl md:text-2xl' : 'text-xs md:text-base'}`}>
                    {name}
                  </span>
                </span>
              </span>
            </button>
          )
        })}
      </div>

      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={photos.map(p => ({ src: p.src, width: 2000, height: 1333 }))}
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
    </>
  )
}
