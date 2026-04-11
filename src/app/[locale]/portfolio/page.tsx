import { getGalleryPhotos } from '@/lib/gallery'
import PortfolioPage from './PortfolioPage'

export default function Page() {
  const categories = getGalleryPhotos()
  return <PortfolioPage categories={categories} />
}
