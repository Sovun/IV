import { Link } from '@/i18n/navigation'

export default function Footer() {
  const year = new Date().getFullYear()

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
            <a href="tel:+380674864629" className="hover:text-[#775a19] transition-colors duration-[400ms]">
              +380 67 486 4629
            </a><br />
            <a href="mailto:ive@ukr.net" className="hover:text-[#775a19] transition-colors duration-[400ms]">
              ive@ukr.net
            </a>
          </div>
        </div>

        {/* Nav + social links */}
        <div className="flex flex-wrap gap-8 justify-center md:justify-start">
          {[
            { label: 'Gallery',    href: '/portfolio',                  external: false },
            { label: 'The Master', href: '/about',                      external: false },
            { label: 'Contact',    href: '/contact',                    external: false },
            { label: 'Instagram',  href: 'https://instagram.com',       external: true  },
            { label: 'Telegram',   href: 'tg://resolve?phone=380977939401', external: true },
          ].map(({ label, href, external }) =>
            external ? (
              <a
                key={label}
                href={href}
                className="font-label tracking-wider text-[10px] uppercase text-[#5f5e5e]/60 hover:text-[#775a19] transition-all duration-[400ms]"
              >
                {label}
              </a>
            ) : (
              <Link
                key={label}
                href={href as '/portfolio' | '/about' | '/contact'}
                className="font-label tracking-wider text-[10px] uppercase text-[#5f5e5e]/60 hover:text-[#775a19] transition-all duration-[400ms]"
              >
                {label}
              </Link>
            )
          )}
        </div>

        {/* Copyright */}
        <div className="text-right">
          <p className="font-label tracking-wider text-[10px] uppercase text-[#5f5e5e]/60">
            © {year} Igor Vasylkov. Crafted in Odessa.
          </p>
        </div>

      </div>
    </footer>
  )
}
