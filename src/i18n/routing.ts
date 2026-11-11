import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['ua', 'en'],
  defaultLocale: 'ua',
  // The middleware's own Link header would tag Ukrainian as "ua" (not a valid
  // language code); the pages declare correct hreflang tags in <head> instead.
  alternateLinks: false
})
