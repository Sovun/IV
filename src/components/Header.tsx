'use client'
import { useLocale, useTranslations } from 'next-intl'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'

// One long page: the menu is a set of anchors, and the item for the section
// under the reader is highlighted as they scroll.
const SECTIONS = ['home', 'gallery', 'master', 'contact'] as const

export default function Header() {
  const locale   = useLocale()
  const pathname = usePathname()
  const router   = useRouter()
  const t        = useTranslations('nav')
  const [open, setOpen]         = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [current, setCurrent]   = useState<string>('home')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // A hash in the first URL (old routes redirect to one) is honoured once the page is up
  useEffect(() => {
    const el = window.location.hash && document.getElementById(window.location.hash.slice(1))
    if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: 'instant' }))
  }, [])

  // A thin band just under the header decides which section is "current"
  useEffect(() => {
    const els = SECTIONS.map(id => document.getElementById(id)).filter((el): el is HTMLElement => !!el)
    if (els.length === 0) return
    const io = new IntersectionObserver(entries => {
      for (const e of entries) if (e.isIntersecting) setCurrent(e.target.id)
    }, { rootMargin: '-15% 0px -80% 0px' })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [pathname])

  const navLinks = SECTIONS.map(id => ({ id, href: `#${id}`, label: t(id) }))

  const switchLocale = () =>
    router.replace(pathname + window.location.hash, { locale: locale === 'ua' ? 'en' : 'ua' })

  const linkClass = (id: string) =>
    `transition-colors duration-[400ms] hover:text-[#775a19] ${current === id ? 'text-[#775a19]' : 'text-[#5f5e5e]'}`

  return (
    <header className="fixed top-0 w-full z-50 bg-[#fbf9f4]/80 backdrop-blur-md transition-all duration-300">
      <nav className={`flex justify-between items-center px-12 max-w-[1920px] mx-auto transition-all duration-300 ${scrolled ? 'py-4' : 'py-8'}`}>

        {/* Logo: the bird and the name, in the language of the page */}
        <Link href="/" className="block hover:opacity-80 transition-all duration-300" aria-label={locale === 'ua' ? 'Іволга' : 'Ivolga'}>
          <Image
            src={`/logo/ivolga-${locale}.svg`}
            alt={locale === 'ua' ? 'Іволга: меблі на замовлення, Одеса' : 'Ivolga: custom furniture, Odessa'}
            width={locale === 'ua' ? 848 : 808}
            height={232}
            priority
            className={`w-auto transition-all duration-300 ${scrolled ? 'h-9' : 'h-12 md:h-14'}`}
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-12 font-headline tracking-[0.2em] uppercase text-xs">
          {navLinks.map(link => (
            <a key={link.id} href={link.href} aria-current={current === link.id ? 'true' : undefined} className={linkClass(link.id)}>
              {link.label}
            </a>
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
            <a
              key={link.id}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`block w-full px-12 py-3 font-headline text-sm tracking-widest uppercase ${linkClass(link.id)}`}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  )
}
