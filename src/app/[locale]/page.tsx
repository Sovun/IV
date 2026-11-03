import { getTranslations } from 'next-intl/server'
import { getInstagramPhotos } from '@/lib/instagram'
import { getGalleryPhotos } from '@/lib/gallery'
import HomePlan from '@/components/HomePlan'
import HomeProcess from '@/components/HomeProcess'
import Gallery from '@/components/Gallery'
import Master from '@/components/Master'
import Contact from '@/components/Contact'
import Image from 'next/image'

// The whole site is one long page. The menu items are its four chapters:
// home (hero, philosophy, plan, process), gallery, the master, contact.

// Fallback images from local gallery (used when Instagram token is not set)
const STITCH = {
  hero:         '/DSC_5392.JPG',
  heritage:     '/gallery/Interior_Decorations/DSC_5346.JPG',
}

// One photo per step of the process story: the room, the joinery, the grain, the fit
const PROCESS = [
  '/gallery/Interior_Decorations/DSC_5363.JPG',
  '/gallery/Wardrobes_and_Bedroom/DSC_5340.JPG',
  '/gallery/Kitchens/DSC_5410.JPG',
  '/gallery/Stairs/DSC_5373.JPG',
]

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const photos = await getInstagramPhotos()
  const t = await getTranslations({ locale, namespace: 'home' })
  const gallery = getGalleryPhotos()
  const rooms  = gallery.map(({ key, photos }) => ({ key, src: photos[0].src, count: photos.length }))
  const covers = gallery.map(({ key, photos }) => ({ key, src: photos[0].src }))
  const pieces = gallery.reduce((n, c) => n + c.photos.length, 0)

  const img = (idx: number, fallback: string) =>
    photos[idx]?.media_url || fallback

  return (
    <div className="bg-surface text-primary selection:bg-secondary selection:text-on-secondary">

      <div id="home">

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

          <div className="container mx-auto px-6 md:px-12 relative z-10">
            <div className="max-w-3xl">
              <span className="font-label text-[10px] uppercase tracking-[0.3em] text-secondary-container mb-6 block">
                {t('hero_label')}
              </span>
              <h1 className="text-5xl md:text-8xl font-headline tracking-tighter leading-tight text-white mb-6 md:mb-8">
                {t('hero_title_1')} <br />{t('hero_title_2')}
              </h1>
              <p className="text-base md:text-xl text-white/80 max-w-xl mb-8 md:mb-12 leading-relaxed">
                {t('hero_description')}
              </p>
              <div className="flex items-center gap-4 md:gap-12">
                <a
                  href="#contact"
                  className="flex-1 md:flex-none text-center bg-white text-charcoal-900 px-6 md:px-10 py-4 md:py-5 text-xs font-label uppercase tracking-widest hover:bg-secondary hover:text-white transition-all duration-[400ms]"
                >
                  {t('hero_cta_primary')}
                </a>
                <a
                  href="#gallery"
                  className="flex-1 md:flex-none text-center border border-white/50 text-white px-6 md:px-10 py-4 md:py-5 text-xs font-label uppercase tracking-widest hover:border-secondary hover:bg-secondary hover:text-white transition-all duration-[400ms]"
                >
                  {t('hero_cta_secondary')}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Our Philosophy ───────────────────────────── */}
        <section className="bg-surface-container py-16 md:py-32 px-6 md:px-12">
          <div className="max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">

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
              <h2 className="text-3xl md:text-5xl font-headline mb-8 md:mb-12 leading-tight">
                {t('philosophy_title')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div className="space-y-4 md:space-y-6">
                  <p className="text-primary/70 leading-relaxed italic font-headline text-lg">
                    &ldquo;{t('philosophy_quote')}&rdquo;
                  </p>
                  <span className="block font-label text-[10px] uppercase tracking-widest text-secondary">
                    {t('philosophy_attribution')}
                  </span>
                </div>
                <div className="space-y-4 md:space-y-6">
                  <p className="text-primary/80 leading-relaxed font-body">
                    {t('philosophy_body')}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── The Whole Home (floor plan) ──────────────── */}
        <section className="bg-surface py-16 md:py-32 px-6 md:px-12">
          <div className="max-w-[1920px] mx-auto">

            <div className="flex justify-between items-end gap-8 mb-10 md:mb-20">
              <div className="max-w-2xl">
                <span className="font-label text-[10px] uppercase tracking-[0.3em] text-secondary mb-4 block">
                  {t('plan_label')}
                </span>
                <h2 className="text-3xl md:text-5xl font-headline mb-6">{t('plan_title')}</h2>
                <p className="text-primary/70 leading-relaxed font-body">{t('plan_body')}</p>
              </div>
              <a
                href="#gallery"
                className="font-label font-bold text-[10px] uppercase tracking-[0.2em] border-b border-secondary pb-1 text-primary hover:text-secondary transition-colors duration-[400ms] hidden md:block whitespace-nowrap"
              >
                {t('plan_all')}
              </a>
            </div>

            <HomePlan rooms={rooms} />

            {/* Mobile: view all link */}
            <div className="mt-10 text-center md:hidden">
              <a
                href="#gallery"
                className="font-label font-bold text-[10px] uppercase tracking-[0.2em] border-b border-secondary pb-1 text-primary hover:text-secondary transition-colors duration-[400ms]"
              >
                {t('plan_all')}
              </a>
            </div>
          </div>
        </section>

        {/* ── How it happens (process story) ───────────── */}
        <HomeProcess photos={PROCESS} />

      </div>

      {/* ── Gallery ──────────────────────────────────── */}
      <Gallery categories={gallery} />

      {/* ── The master ───────────────────────────────── */}
      <Master rooms={gallery.length} pieces={pieces} />

      {/* ── Contact ──────────────────────────────────── */}
      <Contact covers={covers} />

    </div>
  )
}
