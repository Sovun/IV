'use client'
import { useSyncExternalStore } from 'react'
import type { CategoryKey } from './categories'

// The gallery category chosen anywhere on the page (a room on the plan, a
// tile in the gallery), shared without lifting state through the page.
// Null means "the first category".

const listeners = new Set<() => void>()
let current: CategoryKey | null = null

export function setGalleryCategory(key: CategoryKey) {
  current = key
  listeners.forEach(l => l())
}

export function useGalleryCategory() {
  return useSyncExternalStore(
    l => { listeners.add(l); return () => { listeners.delete(l) } },
    () => current,
    () => null,
  )
}
