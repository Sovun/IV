import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getInstagramPhotos } from '@/lib/instagram'
import Image from 'next/image'

// Fallback images from local gallery (used when Instagram token is not set)
const STITCH = {
  hero:         '/DSC_5392.JPG',
  heritage:     '/gallery/Interior_Decorations/DSC_5346.JPG',
  galleryLarge: '/gallery/Kitchens/DSC_5404.JPG',
  gallerySide:  '/gallery/Wardrobes_and_Bedroom/DSC_5330.JPG',
  galleryAccent:'/gallery/Stairs/DSC_5373.JPG',
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const photos = await getInstagramPhotos()
  const t = await getTranslations({ locale, namespace: 'home' })

  const img = (idx: number, fallback: string) =>
    photos[idx]?.media_url || fallback

  return (
    <div className="bg-surface text-primary selection:bg-secondary selection:text-on-secondary">

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={img(0, STITCH.hero)}
            alt="Bespoke Contemporary Kitchen — Igor Vasylkov, Odessa"
            fill
            sizes="100vw"
            quality={90}
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/90 via-charcoal-900/55 to-transparent" />
        </div>

        <div className="container mx-auto px-12 relative z-10">
          <div className="max-w-3xl">
            <span className="font-label text-[10px] uppercase tracking-[0.3em] text-secondary-container mb-6 block">
              {t('hero_label')}
            </span>
            <h1 className="text-6xl md:text-8xl font-headline tracking-tighter leading-tight text-white mb-8">
              {t('hero_title_1')} <br />{t('hero_title_2')}
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-xl mb-12 leading-relaxed">
              {t('hero_description')}
            </p>
            <div className="flex items-center gap-12">
              <Link
                href="/contact"
                className="bg-white text-charcoal-900 px-10 py-5 text-xs font-label uppercase tracking-widest hover:bg-secondary hover:text-white transition-all duration-[400ms]"
              >
                {t('hero_cta_primary')}
              </Link>
              <Link
                href="/portfolio"
                className="bg-black/50 text-white px-10 py-5 text-xs font-label uppercase tracking-widest hover:bg-secondary hover:text-white transition-all duration-[400ms]"
              >
                {t('hero_cta_secondary')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Philosophy ───────────────────────────── */}
      <section className="bg-surface-container py-32 px-12">
        <div className="max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 items-center">

          {/* Image — left on desktop */}
          <div className="md:col-span-5 order-2 md:order-1">
            <div className="aspect-[4/5] bg-surface-container-low relative overflow-hidden">
              <Image
                src={img(1, STITCH.heritage)}
                alt="Exquisite hand-crafted desk and shelving by Igor Vasylkov — master joinery and natural wood grain"
                fill
                sizes="(max-width: 768px) 100vw, 42vw"
                quality={90}
                className="object-cover transition-all duration-700"
              />
            </div>
          </div>

          {/* Text — right on desktop */}
          <div className="md:col-span-7 order-1 md:order-2">
            <h2 className="text-4xl md:text-5xl font-headline mb-12 leading-tight">
              {t('philosophy_title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <p className="text-primary/70 leading-relaxed italic font-headline text-lg">
                  &ldquo;{t('philosophy_quote')}&rdquo;
                </p>
                <span className="block font-label text-[10px] uppercase tracking-widest text-secondary">
                  {t('philosophy_attribution')}
                </span>
              </div>
              <div className="space-y-6">
                <p className="text-primary/80 leading-relaxed font-body">
                  {t('philosophy_body')}
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── Curated Highlights ───────────────────────── */}
      <section className="bg-surface py-32 px-12">
        <div className="max-w-[1920px] mx-auto">

          <div className="flex justify-between items-end mb-20">
            <div>
              <span className="font-label text-[10px] uppercase tracking-[0.3em] text-secondary mb-4 block">
                {t('highlights_label')}
              </span>
              <h2 className="text-4xl md:text-5xl font-headline">{t('highlights_title')}</h2>
            </div>
            <Link
              href="/portfolio"
              className="font-label font-bold text-[10px] uppercase tracking-[0.2em] border-b border-secondary pb-1 text-primary hover:text-secondary transition-colors duration-[400ms] hidden md:block"
            >
              {t('highlights_view_all')}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

            {/* Large Feature */}
            <Link href="/portfolio" className="md:col-span-8 group cursor-pointer block">
              <div className="aspect-[16/9] bg-surface-container-low mb-8 overflow-hidden relative">
                <Image
                  src={img(2, STITCH.galleryLarge)}
                  alt="The Minimalist Penthouse Kitchen — custom cabinetry by Igor Vasylkov, Odessa"
                  fill
                  sizes="(max-width: 768px) 100vw, 66vw"
                  quality={90}
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-headline mb-2">{t('highlight_1_title')}</h3>
                  <p className="font-label text-[10px] uppercase tracking-widest text-primary/50">
                    {t('highlight_1_meta')}
                  </p>
                </div>
                <span className="material-symbols-outlined text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-[400ms]">
                  north_east
                </span>
              </div>
            </Link>

            {/* Side Feature */}
            <Link href="/portfolio" className="md:col-span-4 mt-24 md:mt-0 group cursor-pointer block">
              <div className="aspect-[3/4] bg-surface-container-low mb-8 overflow-hidden relative">
                <Image
                  src={img(3, STITCH.gallerySide)}
                  alt="Bespoke dressing room — smoked glass doors and leather-lined drawers by Igor Vasylkov"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  quality={90}
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div>
                <h3 className="text-2xl font-headline mb-2">{t('highlight_2_title')}</h3>
                <p className="font-label text-[10px] uppercase tracking-widest text-primary/50">
                  {t('highlight_2_meta')}
                </p>
              </div>
            </Link>

            {/* Bottom Accent */}
            <Link href="/portfolio" className="md:col-span-5 md:col-start-2 group cursor-pointer block">
              <div className="aspect-square bg-surface-container-low mb-8 overflow-hidden relative">
                <Image
                  src={img(4, STITCH.galleryAccent)}
                  alt="Refined dovetail joinery detail — hand-cut walnut by master craftsman Igor Vasylkov"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  quality={90}
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div>
                <h3 className="text-2xl font-headline mb-2">{t('highlight_3_title')}</h3>
                <p className="font-label text-[10px] uppercase tracking-widest text-primary/50">
                  {t('highlight_3_meta')}
                </p>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────── */}
      <section className="py-40 bg-surface-container-high relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: 'radial-gradient(#5f5e5e 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>
        <div className="max-w-4xl mx-auto px-12 text-center relative z-10">
          <span className="font-label text-[10px] uppercase tracking-[0.3em] text-secondary mb-8 block">
            {t('cta_label')}
          </span>
          <h2 className="text-5xl md:text-7xl font-headline mb-12 tracking-tight">
            {t('cta_title')}
          </h2>
          <p className="text-lg text-primary/70 mb-16 max-w-2xl mx-auto leading-relaxed font-body">
            {t('cta_body')}
          </p>
          <Link
            href="/contact"
            className="bg-primary text-on-primary px-16 py-6 text-sm font-label uppercase tracking-[0.2em] hover:bg-secondary transition-all duration-[400ms] inline-block"
          >
            {t('cta_button')}
          </Link>
        </div>
      </section>

    </div>
  )
}
