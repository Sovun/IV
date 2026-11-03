'use client'
import { useRef, type PointerEvent, type ReactNode } from 'react'
import Image from 'next/image'

// The hero opens as a drafted line drawing of the piece, made from the photo
// itself (a blurred, inverted copy colour-dodged over the original, then the
// whole thing inverted). A soft circular lens shows the finished work in colour.
// With a mouse the lens follows the cursor; on touch it slowly drifts on its own.

export default function HeroReveal({ src, alt, hint, children }: {
  src: string
  alt: string
  hint: string
  children: ReactNode
}) {
  const ref = useRef<HTMLElement>(null)

  const move = (e: PointerEvent<HTMLElement>) => {
    const el = ref.current
    if (!el || e.pointerType === 'touch') return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--x', `${(((e.clientX - r.left) / r.width) * 100).toFixed(2)}%`)
    el.style.setProperty('--y', `${(((e.clientY - r.top) / r.height) * 100).toFixed(2)}%`)
    el.dataset.live = ''
  }

  return (
    <section
      ref={ref}
      onPointerMove={move}
      className="hero-reveal relative min-h-screen flex items-center pt-24 overflow-hidden bg-charcoal-900"
    >
      <div className="absolute inset-0 z-0" aria-hidden="true">
        {/* Line drawing */}
        <div className="hero-reveal__sketch absolute inset-0">
          <div className="hero-reveal__trace absolute inset-0">
            <Image src={src} alt="" fill sizes="100vw" quality={90} className="object-cover" priority />
            <Image src={src} alt="" fill sizes="100vw" quality={90} className="object-cover hero-reveal__dodge" />
          </div>
          <div className="hero-reveal__tint absolute inset-0" />
          <div className="hero-reveal__grid absolute inset-0" />
        </div>

        {/* Finished piece, seen through the lens */}
        <div className="hero-reveal__photo absolute inset-0">
          <Image src={src} alt={alt} fill sizes="100vw" quality={90} className="object-cover" priority />
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/85 via-charcoal-900/40 to-transparent" />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {children}
        <p className="hidden md:flex items-center gap-3 mt-14 font-label text-[10px] uppercase tracking-[0.3em] text-white/45">
          <span className="hero-reveal__cursor relative block w-4 h-4 rounded-full border border-white/50" />
          {hint}
        </p>
      </div>
    </section>
  )
}
