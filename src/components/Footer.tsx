import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export default async function Footer() {
  const t  = await getTranslations('footer')
  const tn = await getTranslations('nav')
  const year = new Date().getFullYear()

  const internalLinks = [
    { label: tn('gallery'),  href: '/portfolio' as const },
    { label: tn('master'),   href: '/about'     as const },
    { label: tn('contact'),  href: '/contact'   as const },
  ]

  return (
    <footer className="bg-[#f0eee9] py-20 px-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full items-end max-w-[1920px] mx-auto">

        {/* Brand + address */}
        <div className="space-y-8">
          <Link href="/" className="font-headline text-lg tracking-tighter text-[#5f5e5e] block">
            IGOR VASYLKOV
          </Link>
          <div className="font-label tracking-wider text-[10px] uppercase text-[#5f5e5e]/60 leading-relaxed">
            Odessa, Ukraine<br />
            <span>+380 67 486 4629</span><br />
            <a href="mailto:ive@ukr.net" className="hover:text-[#775a19] transition-colors duration-[400ms]">
              ive@ukr.net
            </a>
          </div>
        </div>

        {/* Nav + social links */}
        <div className="flex flex-wrap gap-8 justify-center md:justify-start">
          {internalLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="font-label tracking-wider text-[10px] uppercase text-[#5f5e5e]/60 hover:text-[#775a19] transition-all duration-[400ms]"
            >
              {label}
            </Link>
          ))}
          <a
            href="https://www.instagram.com/igorvasylkov/"
            className="font-label tracking-wider text-[10px] uppercase text-[#5f5e5e]/60 hover:text-[#775a19] transition-all duration-[400ms]"
          >
            Instagram
          </a>
          <a
            href="tg://resolve?phone=380977939401"
            className="font-label tracking-wider text-[10px] uppercase text-[#5f5e5e]/60 hover:text-[#775a19] transition-all duration-[400ms]"
          >
            Telegram
          </a>
        </div>

        {/* Copyright */}
        <div className="text-right">
          <p className="font-label tracking-wider text-[10px] uppercase text-[#5f5e5e]/60">
            {t('copyright', { year })}
          </p>
        </div>

      </div>
    </footer>
  )
}
