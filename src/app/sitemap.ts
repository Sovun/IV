import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { SITE_URL } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return ['', '/portfolio'].flatMap((page) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${page}`,
      lastModified,
      alternates: {
        languages: { uk: `${SITE_URL}/ua${page}`, en: `${SITE_URL}/en${page}` },
      },
    }))
  )
}
