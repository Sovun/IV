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

    // The newest stairs are the strongest work, so that category runs newest first.
    if (category === 'Stairs') files.reverse()

    // A file named cover_* is the category's chosen face: it leads whatever the order.
    const isCover = (f: string) => f.startsWith('cover_')
    files.sort((a, b) => Number(isCover(b)) - Number(isCover(a)))

    if (files.length === 0) return []

    const photos: GalleryPhoto[] = files.map(f => ({
      id: `${category}-${f}`,
      src: `/gallery/${category}/${f}`,
      category,
    }))

    return [{ key: category, photos }]
  })
}
