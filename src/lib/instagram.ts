import type { CategoryKey } from './categories'

export interface InstagramPhoto {
  id: string
  media_url: string
  thumbnail_url?: string
  caption?: string
  timestamp: string
  category: CategoryKey
}

function classifyCaption(caption: string): CategoryKey {
  const lower = caption.toLowerCase()
  if (['кухня', 'кухні', 'kitchen'].some(kw => lower.includes(kw))) return 'Kitchens'
  if (['шафа', 'гардероб', 'wardrobe', 'closet', 'bedroom'].some(kw => lower.includes(kw))) return 'Wardrobes_and_Bedroom'
  if (['ванна', 'баня', 'сауна', 'bathroom', 'sauna'].some(kw => lower.includes(kw))) return 'Bathroom_and_Sauna'
  if (['двері', 'door'].some(kw => lower.includes(kw))) return 'Doors'
  if (['сходи', 'stairs'].some(kw => lower.includes(kw))) return 'Stairs'
  if (['декор', 'interior'].some(kw => lower.includes(kw))) return 'Interior_Decorations'
  return 'Kitchens'
}

export async function getInstagramPhotos(): Promise<InstagramPhoto[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN
  if (!token) return []

  try {
    const res = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_url,thumbnail_url,media_type,timestamp&access_token=${token}`,
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) throw new Error('Instagram API error')

    const data = await res.json()
    return (data.data as Array<{
      id: string
      media_url?: string
      thumbnail_url?: string
      caption?: string
      timestamp: string
      media_type: string
    }>)
      .filter(item => item.media_type === 'IMAGE' || item.media_type === 'CAROUSEL_ALBUM')
      .map(item => ({
        id: item.id,
        media_url: item.media_url || item.thumbnail_url || '',
        thumbnail_url: item.thumbnail_url,
        caption: item.caption,
        timestamp: item.timestamp,
        category: item.caption ? classifyCaption(item.caption) : 'Kitchens',
      }))
  } catch {
    return []
  }
}
