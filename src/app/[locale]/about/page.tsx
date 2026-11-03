import { redirect } from 'next/navigation'

// The site is one long page now; the old route lands on its section.
export default async function AboutRedirect({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  redirect(`/${locale}#master`)
}
