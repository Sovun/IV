'use client'
import { useSyncExternalStore } from 'react'

// How to reach the workshop, and whether it is open at this minute in Odessa.

export const PHONE     = '+380977939401'
export const PHONE_FMT = '+380 97 793 9401'
export const EMAIL     = 'ive@ukr.net'
export const TELEGRAM  = 'https://t.me/+380977939401'
export const INSTAGRAM = 'https://www.instagram.com/igorvasylkov/'

// Monday to Saturday, the same hours the schema.org block in the layout states
export const OPENS     = 9
export const CLOSES    = 19
export const WORK_DAYS = 6

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const clock = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Kiev',
  weekday: 'short',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

// "day|HH:MM" in Odessa: a string, so the snapshot only changes once a minute
function read() {
  const parts = clock.formatToParts(new Date())
  const get = (type: string) => parts.find(p => p.type === type)?.value ?? ''
  return `${DAYS.indexOf(get('weekday'))}|${get('hour')}:${get('minute')}`
}

function subscribe(listener: () => void) {
  const id = setInterval(listener, 10_000)
  return () => clearInterval(id)
}

export interface WorkshopNow {
  day: number                                   // 0 is Monday
  time: string                                  // HH:MM in Odessa
  open: boolean
  next: 'today' | 'tomorrow' | 'monday' | null  // when it opens again, if closed
}

// null on the server and during hydration: the hour is only known in the browser
export function useWorkshopNow(): WorkshopNow | null {
  const snap = useSyncExternalStore(subscribe, read, () => null)
  if (!snap) return null
  const [d, time] = snap.split('|')
  const day  = Number(d)
  const hour = Number(time.slice(0, 2))
  const workday = day < WORK_DAYS
  const open = workday && hour >= OPENS && hour < CLOSES
  const next = open ? null
    : workday && hour < OPENS ? 'today'
    : day >= WORK_DAYS - 1 ? 'monday'
    : 'tomorrow'
  return { day, time, open, next }
}
