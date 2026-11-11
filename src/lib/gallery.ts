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

// The home page shows only these: the strongest photo of a project, and no
// project twice. Order matters: the 1st, 6th, 7th and 12th land in the large
// frames, so they want the sharpest shots. Edit this list to change the selection.
const HIGHLIGHTS = [
  'Kitchens/DSC_5405.JPG',
  'Stairs/ig_Cm109A6otIA.jpg',
  'Study/cover_DOvx5msiILd.jpg',
  'Tables/cover_Cuvqd9qo_hh.jpg',
  'Doors/ig_CkltvfHIdC5.jpg',
  'Wardrobes_and_Bedroom/DSC_5338.JPG',
  'Interior_Decorations/DSC_5365.JPG',
  'Kitchens/ig_C0Ussm8IY5W.jpg',
  'Bathroom_and_Sauna/ig_Cpw2m2AIdJP.jpg',
  'Interior_Decorations/ig_Cuj1_GPoTuf.jpg',
  'Wardrobes_and_Bedroom/ig_CuhktvHoMBY.jpg',
  'Bathroom_and_Sauna/DSC_5367.JPG',
]

export function getHighlights(): GalleryPhoto[] {
  const galleryRoot = path.join(process.cwd(), 'public', 'gallery')
  return HIGHLIGHTS
    .filter(f => fs.existsSync(path.join(galleryRoot, f)))
    .map(f => ({ id: f, src: `/gallery/${f}`, category: f.split('/')[0] as CategoryKey }))
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
