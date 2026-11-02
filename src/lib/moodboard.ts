'use client'
import { useSyncExternalStore } from 'react'
import type { CategoryKey } from './categories'

// Photos a visitor saved while browsing the gallery, kept in their browser
// so they travel to the contact brief as references.

export interface SavedPhoto {
  src: string
  category: CategoryKey
}

const KEY = 'moodboard'
const EMPTY: SavedPhoto[] = []
const listeners = new Set<() => void>()

let cachedRaw: string | null = null
let cached: SavedPhoto[] = EMPTY

function read(): SavedPhoto[] {
  let raw: string | null = null
  try { raw = localStorage.getItem(KEY) } catch {}
  if (raw !== cachedRaw) {
    cachedRaw = raw
    try { cached = raw ? JSON.parse(raw) : EMPTY } catch { cached = EMPTY }
  }
  return cached
}

function write(next: SavedPhoto[]) {
  const raw = JSON.stringify(next)
  try { localStorage.setItem(KEY, raw) } catch {}
  cachedRaw = raw
  cached = next
  listeners.forEach(l => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  window.addEventListener('storage', listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', listener)
  }
}

export function useMoodboard() {
  const saved = useSyncExternalStore(subscribe, read, () => EMPTY)

  const isSaved = (src: string) => saved.some(p => p.src === src)
  const toggle = (photo: SavedPhoto) =>
    write(isSaved(photo.src) ? saved.filter(p => p.src !== photo.src) : [...saved, photo])
  const remove = (src: string) => write(saved.filter(p => p.src !== src))

  return { saved, isSaved, toggle, remove }
}
