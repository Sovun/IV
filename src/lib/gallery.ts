import fs from 'fs'
import path from 'path'
import { CATEGORIES, type CategoryKey } from './categories'

export interface GalleryPhoto {
  id: string
  src: string
  category: CategoryKey
}

export interface GalleryCategory {
  key: CategoryKey
  photos: GalleryPhoto[]
}

export function getGalleryPhotos(): GalleryCategory[] {
  const galleryRoot = path.join(process.cwd(), 'public', 'gallery')

  return CATEGORIES.flatMap((category) => {
    const dir = path.join(galleryRoot, category)

    if (!fs.existsSync(dir)) return []

    const files = fs
      .readdirSync(dir)
      .filter(f => /\.(jpe?g|png|webp)$/i.test(f))
      .sort()

    if (files.length === 0) return []

    const photos: GalleryPhoto[] = files.map(f => ({
      id: `${category}-${f}`,
      src: `/gallery/${category}/${f}`,
      category,
    }))

    return [{ key: category, photos }]
  })
}
