// Public origin of the site, without a trailing slash.
// Set NEXT_PUBLIC_SITE_URL on Vercel; the fallback is the production domain.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ivolga.com.ua').replace(/\/$/, '')
