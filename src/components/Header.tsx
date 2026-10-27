'use client'
import { useLocale, useTranslations } from 'next-intl'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { useState, useEffect } from 'react'

export default function Header() {
  const locale   = useLocale()
  const pathname = usePathname()
  const router   = useRouter()
  const t        = useTranslations('nav')
  const [open, setOpen]       = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { href: '/',          label: t('home') },
    { href: '/portfolio', label: t('gallery') },
    { href: '/about',     label: t('master') },
    { href: '/contact',   label: t('contact') },
  ]

  const switchLocale = () =>
    router.replace(pathname, { locale: locale === 'ua' ? 'en' : 'ua' })

  return (
    <header className="fixed top-0 w-full z-50 bg-[#fbf9f4]/80 backdrop-blur-md transition-all duration-300">
      <nav className={`flex justify-between items-center px-12 max-w-[1920px] mx-auto transition-all duration-300 ${scrolled ? 'py-4' : 'py-8'}`}>

        {/* Wordmark */}
        <Link
          href="/"
          className={`font-headline tracking-widest text-[#5f5e5e] uppercase hover:text-[#775a19] transition-all duration-300 ${scrolled ? 'text-lg' : 'text-2xl'}`}
        >
          Igor Vasylkov
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-12 font-headline tracking-[0.2em] uppercase text-xs">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[#5f5e5e] hover:text-[#775a19] transition-colors duration-[400ms]"
            >
              {link.label}
            </Link>
          ))}
          {/* Language switcher */}
          <button
            onClick={switchLocale}
            className="text-[#5f5e5e] hover:text-[#775a19] transition-colors duration-[400ms] px-3 py-1.5 font-label tracking-widest text-xs bg-surface-container-high hover:bg-surface-container-highest"
          >
            {locale === 'ua' ? 'EN' : 'UA'}
          </button>
        </div>

        {/* Mobile: lang + burger */}
        <div className="flex md:hidden items-center gap-5">
          <button
            onClick={switchLocale}
            className="font-label text-xs tracking-widest uppercase text-[#5f5e5e]"
          >
            {locale === 'ua' ? 'EN' : 'UA'}
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="flex flex-col gap-1.5 w-6"
            aria-label="Toggle menu"
          >
            <span className={`block h-px bg-[#5f5e5e] transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-px bg-[#5f5e5e] transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-px bg-[#5f5e5e] transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

      </nav>

      {/* Mobile drawer */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-80 shadow-sm' : 'max-h-0'}`}>
        <div className={`bg-[#fbf9f4] flex flex-col transition-all duration-300 ${open ? (scrolled ? 'pt-2 pb-2' : 'pt-4 pb-4') : 'pt-0 pb-0'}`}>
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block w-full px-12 py-3 font-headline text-sm tracking-widest uppercase text-[#5f5e5e] hover:text-[#775a19] transition-colors duration-[400ms]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
