import { Link } from '@/i18n/navigation'
import { getInstagramPhotos } from '@/lib/instagram'
import Image from 'next/image'

// Stitch design placeholder images (replaced by Instagram photos in production)
const STITCH = {
  hero: '/DSC_5392.JPG',
  heritage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbvL3MnQSiTRpodTU97laOSQm-BHM84n-tjtF8olCJ6w0dnTnz4C0FHRpa6mb3S63hCbcNgt4Cknm9nT6x_3rPKqg3Iauj53w1aSvpu91-loBke1tzMtK_zOAsdDSvi7cNzRw5AI4PwPD27nJrFfFeLx8auHxHJE8BgMRc6DrXXUCkf8faYn8TC5tkVppj_oHRcL3KL_1qEJM6YIcqS2WazuXdbwRNIS7_6tq-y8189C58kt9kBamDE8W96yGGRIf01R03YOtRMxjt',
  galleryLarge: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCugfUqPJMZ9pgSWh_LH8gCjTz4c2agrDBxtjT00b7CQV__w-v0fbyGm6X9De91UiLStAjgYYTkx1szJamFD-G1nC-uLWRKsWsTA5Zq5wZXDCkbh_Ui7QeoLjFDZv7llJnRHk04jOgcRLPp1zGT_ToXWI19ENXDvVadhm9WVxIjWy_-iOwYfBFzK6KMdhwIYXOuBcNYWCykNH7-yxfEJGPY0bnxVYWxr3T8M_XRPdf9jFIIDjmBSOriKcJJL8chbsdvEk3Cl2xII8qM',
  gallerySide: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQUZHKmx6SSsyJSlBBSYQBhAWdevcdyMMwBJnFk5FOi9JHi7qK4mJJ1ugNVCGdQLIo0KZ6vdObxLrOZQqkP6fTNvlFY9SrsTsDE4VnDQ3uLXJMaUD202ZzbHJiyp8bs_x7DVrpqfRJHWkfPHuTnf1B8j3FaYJR6WQDq9-ITZA6D_4r5ae-6oT5MTC77gnbmCo2wIjJ4Dd7z85JFro0OEGnA7EI5B4us1GFOfK0JwYL2RjoepHBvWSdIlWrbigMC_C1w-we1vBtQsM2',
  galleryAccent: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5x8XOPtx8Njuw4h67eK0aVPRKHXk4aOeAGgv2BuQf8Ctukx02zXsxck_S1yGa1dTJx5UbokxdbtsRJwd1QKy89Adb0wyGiHVTIfYKCnm9wKDI5SSHIkhlILWTweQPLeV9WVuLcyft6cedDrgO9PF_P7ZdQYsQKPS8Nr8UXCVhCvVbB3jgNylrm7xncShZq8LR7q1M_yjpcQHfSSZ2uml3zCvgevWN1XmSsRjYSQ7k1g2_m61jBHLw8nQe-fR7o99cTx_bDhuP4pyp',
}

export default async function HomePage() {
  const photos = await getInstagramPhotos()

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
          {/* Match Stitch gradient exactly: from-background/70 via-background/30 to-transparent */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-background/30 to-transparent" />
        </div>

        <div className="container mx-auto px-12 relative z-10">
          <div className="max-w-3xl">
            <span className="font-label text-[10px] uppercase tracking-[0.3em] text-secondary mb-6 block">
              Est. in the Heart of Odessa
            </span>
            <h1 className="text-6xl md:text-8xl font-headline tracking-tighter leading-tight text-primary mb-8">
              The Art of <br />Bespoke Living
            </h1>
            <p className="text-lg md:text-xl text-primary/90 max-w-xl mb-12 leading-relaxed">
              Where Italian precision meets the architectural soul of Ukraine. We craft more than furniture; we forge the heritage of your home.
            </p>
            <div className="flex items-center gap-12">
              <Link
                href="/portfolio"
                className="bg-primary text-on-primary px-10 py-5 text-xs font-label uppercase tracking-widest hover:bg-secondary transition-all duration-[400ms]"
              >
                Begin Your Journey
              </Link>
              <Link
                href="/portfolio"
                className="font-label font-bold text-[10px] uppercase tracking-[0.2em] border-b border-secondary pb-1 text-primary hover:text-secondary transition-colors duration-[400ms]"
              >
                Explore Collection
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
              Heritage in Every Grain
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <p className="text-primary/70 leading-relaxed italic font-headline text-lg">
                  "We do not believe in the temporary. Every piece that leaves our workshop is built to witness a century of family gatherings."
                </p>
                <span className="block font-label text-[10px] uppercase tracking-widest text-secondary">
                  — Igor Vasylkov&apos;s Philosophy
                </span>
              </div>
              <div className="space-y-6">
                <p className="text-primary/80 leading-relaxed font-body">
                  Rooted in the rich artisan traditions of Odessa and inspired by Italian furniture design, our atelier specialises in hand-crafted joinery that defies mass-market standards. We source only sustainable hardwoods, treated with natural oils to preserve the living soul of the material.
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
                Selection
              </span>
              <h2 className="text-4xl md:text-5xl font-headline">Curated Highlights</h2>
            </div>
            <Link
              href="/portfolio"
              className="font-label font-bold text-[10px] uppercase tracking-[0.2em] border-b border-secondary pb-1 text-primary hover:text-secondary transition-colors duration-[400ms] hidden md:block"
            >
              View Full Gallery
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
                  <h3 className="text-2xl font-headline mb-2">The Penthouse Suite</h3>
                  <p className="font-label text-[10px] uppercase tracking-widest text-primary/50">
                    Muted Oak · Italian Calacatta Marble
                  </p>
                </div>
                <span className="material-symbols-outlined text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-[400ms]">
                  north_east
                </span>
              </div>
            </Link>

            {/* Side Feature — mt-24 on mobile only, aligned top on desktop */}
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
                <h3 className="text-2xl font-headline mb-2">The Heritage Closet</h3>
                <p className="font-label text-[10px] uppercase tracking-widest text-primary/50">
                  Smoked Eucalyptus · Nappa Leather
                </p>
              </div>
            </Link>

            {/* Bottom Accent — offset one column from left */}
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
                <h3 className="text-2xl font-headline mb-2">Artisan Detail No. 42</h3>
                <p className="font-label text-[10px] uppercase tracking-widest text-primary/50">
                  Hand-Cut Walnut · Natural Oil Finish
                </p>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────── */}
      <section className="py-40 bg-surface-container-high relative overflow-hidden">
        {/* Dot pattern — exact Stitch arbitrary value */}
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
            Your Vision, Our Craft
          </span>
          <h2 className="text-5xl md:text-7xl font-headline mb-12 tracking-tight">
            Let Us Build Your Legacy
          </h2>
          <p className="text-lg text-primary/70 mb-16 max-w-2xl mx-auto leading-relaxed font-body">
            Contact our head atelier for a private consultation. We specialise in full-home interior solutions and unique standalone statements.
          </p>
          <a
            href="tel:+380674864629"
            className="bg-primary text-on-primary px-16 py-6 text-sm font-label uppercase tracking-[0.2em] hover:bg-secondary transition-all duration-[400ms] inline-block"
          >
            Schedule a Meeting
          </a>
        </div>
      </section>

    </div>
  )
}
