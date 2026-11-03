import { getGalleryPhotos } from '@/lib/gallery'
import PortfolioPage from './PortfolioPage'

export default async function Page({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams
  const categories = getGalleryPhotos()
  return <PortfolioPage categories={categories} initialKey={category} />
}
