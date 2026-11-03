'use client'
import { useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Link, useRouter } from '@/i18n/navigation'
import type { CategoryKey } from '@/lib/categories'

// A stylised apartment plan where each room is one gallery category.
// Hovering a room previews its work; clicking opens the portfolio on it.

export interface PlanRoom {
  key: CategoryKey
  src: string
  count: number
}

interface RoomShape {
  key: CategoryKey
  x: number
  y: number
  w: number
  h: number
}

// Rooms in the 600x420 drawing. Only rooms with a matching category render as links.
const SHAPES: RoomShape[] = [
  { key: 'Kitchens',              x: 0,   y: 0,   w: 220, h: 180 },
  { key: 'Interior_Decorations',  x: 220, y: 0,   w: 380, h: 180 },
  { key: 'Doors',                 x: 0,   y: 180, w: 440, h: 70  },
  { key: 'Stairs',                x: 440, y: 180, w: 160, h: 240 },
  { key: 'Wardrobes_and_Bedroom', x: 0,   y: 250, w: 280, h: 170 },
  { key: 'Bathroom_and_Sauna',    x: 280, y: 250, w: 160, h: 170 },
]

// Door swing: gap in the wall along the local x axis, leaf opening along local y.
function Door({ x, y, r = 30, rotate = 0 }: { x: number; y: number; r?: number; rotate?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <line x1={0} y1={0} x2={r} y2={0} className="stroke-surface-container" strokeWidth={4} />
      <line x1={0} y1={0} x2={0} y2={r} className="stroke-primary" strokeWidth={1.5} />
      <path d={`M0 ${r} A${r} ${r} 0 0 0 ${r} 0`} fill="none" className="stroke-primary/50" strokeWidth={1} strokeDasharray="2 3" />
    </g>
  )
}

export default function HomePlan({ rooms }: { rooms: PlanRoom[] }) {
  const t      = useTranslations('home')
  const tCat   = useTranslations('categories')
  const router = useRouter()

  const byKey  = new Map(rooms.map(r => [r.key, r]))
  const shapes = SHAPES.filter(s => byKey.has(s.key))
  const [activeKey, setActiveKey] = useState<CategoryKey | undefined>(shapes[0]?.key)
  const active = activeKey ? byKey.get(activeKey) : undefined
  const activeIndex = shapes.findIndex(s => s.key === activeKey)
  // Touch fires a synthetic mouseenter right before click, so the pointer type decides
  // what a click does: mouse opens, first tap previews, second tap opens.
  const pointer = useRef('mouse')

  if (!active) return null

  const href = (key: CategoryKey) => ({ pathname: '/portfolio', query: { category: key } })

  const open = (key: CategoryKey) => {
    if (pointer.current === 'mouse' || key === activeKey) router.push(href(key))
    else setActiveKey(key)
  }

  const furniture = 'stroke-primary/45 fill-none'

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">

      {/* ── Plan ─────────────────────────────────── */}
      <div className="md:col-span-7">
        <svg
          viewBox="-16 -16 632 452"
          role="group"
          aria-label={t('plan_hint')}
          className="w-full h-auto text-primary select-none"
        >
          <defs>
            <pattern id="plan-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0H0V20" fill="none" stroke="currentColor" strokeOpacity={0.08} />
            </pattern>
          </defs>
          <rect x={-16} y={-16} width={632} height={452} fill="url(#plan-grid)" />

          {/* Room fills + hit areas */}
          {shapes.map((s, i) => {
            const on = s.key === activeKey
            return (
              <g
                key={s.key}
                role="link"
                tabIndex={0}
                aria-label={`${t(`plan_rooms.${s.key}`)} — ${tCat(s.key)}`}
                aria-current={on ? 'true' : undefined}
                className="cursor-pointer outline-none"
                onPointerEnter={e => { if (e.pointerType === 'mouse') setActiveKey(s.key) }}
                onPointerDown={e => { pointer.current = e.pointerType }}
                onFocus={() => setActiveKey(s.key)}
                onClick={() => open(s.key)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); router.push(href(s.key)) } }}
              >
                <rect
                  x={s.x} y={s.y} width={s.w} height={s.h}
                  style={{ fillOpacity: on ? 0.16 : 0 }}
                  className="fill-secondary transition-[fill-opacity] duration-500"
                />
                <text
                  x={s.x + 14} y={s.y + 26}
                  className={`font-label text-[10px] uppercase tracking-[0.25em] transition-[fill] duration-300 ${on ? 'fill-secondary' : 'fill-primary/45'}`}
                >
                  0{i + 1}
                </text>
                <text
                  x={s.x + 14} y={s.y + 44}
                  className={`font-headline text-[17px] transition-[fill] duration-300 ${on ? 'fill-on-surface' : 'fill-primary'}`}
                >
                  {t(`plan_rooms.${s.key}`)}
                </text>
              </g>
            )
          })}

          {/* Furniture */}
          <g className={furniture} strokeWidth={1.25} pointerEvents="none">
            {/* Kitchen: counter, sink, hob, island */}
            <rect x={10} y={144} width={200} height={26} />
            <circle cx={60} cy={157} r={7} />
            <circle cx={150} cy={153} r={3} /><circle cx={162} cy={153} r={3} />
            <circle cx={150} cy={161} r={3} /><circle cx={162} cy={161} r={3} />
            <rect x={70} y={70} width={80} height={34} />
            {/* Living: rug, sofa, table, shelving */}
            <rect x={270} y={54} width={210} height={108} strokeDasharray="3 4" />
            <rect x={300} y={118} width={130} height={36} rx={4} />
            <line x1={365} y1={118} x2={365} y2={154} />
            <rect x={340} y={72} width={50} height={28} />
            <rect x={580} y={24} width={10} height={130} />
            <line x1={580} y1={56} x2={590} y2={56} /><line x1={580} y1={88} x2={590} y2={88} /><line x1={580} y1={120} x2={590} y2={120} />
            {/* Hall: console */}
            <rect x={250} y={232} width={70} height={8} />
            {/* Bedroom: bed, wardrobe */}
            <rect x={30} y={300} width={120} height={100} />
            <rect x={38} y={308} width={46} height={22} rx={3} />
            <rect x={96} y={308} width={46} height={22} rx={3} />
            <line x1={30} y1={340} x2={150} y2={340} />
            <rect x={236} y={262} width={36} height={148} />
            <line x1={254} y1={262} x2={254} y2={410} />
            {/* Bathroom and sauna: tub, basin, benches */}
            <rect x={292} y={304} width={50} height={104} rx={18} />
            <rect x={300} y={312} width={34} height={88} rx={14} />
            <circle cx={418} cy={278} r={11} />
            <rect x={380} y={330} width={52} height={80} />
            <line x1={380} y1={356} x2={432} y2={356} /><line x1={380} y1={383} x2={432} y2={383} />
            {/* Stairs: treads and direction */}
            {Array.from({ length: 11 }, (_, i) => (
              <line key={i} x1={470} y1={236 + i * 16} x2={570} y2={236 + i * 16} />
            ))}
            <line x1={520} y1={404} x2={520} y2={228} className="stroke-primary/70" />
            <path d="M514 236 L520 228 L526 236" className="stroke-primary/70" />
          </g>

          {/* Walls */}
          <g fill="none" className="stroke-primary" strokeWidth={2} strokeLinejoin="miter" pointerEvents="none">
            {shapes.map(s => <rect key={s.key} x={s.x} y={s.y} width={s.w} height={s.h} />)}
            <rect x={0} y={0} width={600} height={420} strokeWidth={5} />
          </g>

          {/* Doors */}
          <g pointerEvents="none">
            <Door x={0}   y={230} rotate={270} />   {/* entrance */}
            <Door x={160} y={180} />                 {/* kitchen */}
            <Door x={300} y={180} />                 {/* living */}
            <Door x={40}  y={250} />                 {/* bedroom */}
            <Door x={340} y={250} />                 {/* bathroom */}
            <Door x={440} y={230} rotate={270} />   {/* stairs */}
          </g>
        </svg>
        <p className="mt-4 font-label text-[10px] uppercase tracking-[0.25em] text-primary/40 md:hidden">
          {t('plan_hint')}
        </p>
      </div>

      {/* ── Preview ──────────────────────────────── */}
      <div className="md:col-span-5">
        <Link href={href(active.key)} className="group block">
          <div className="relative aspect-[4/5] overflow-hidden bg-surface-container-low">
            {rooms.map(r => (
              <Image
                key={r.key}
                src={r.src}
                alt={`${tCat(r.key)} — Igor Vasylkov, Odessa`}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                quality={85}
                className={`object-cover transition-all duration-700 ${
                  r.key === active.key ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                }`}
              />
            ))}
          </div>
          <div className="mt-6 flex justify-between items-end gap-6">
            <div className="min-w-0">
              <p className="font-label text-[10px] uppercase tracking-[0.3em] text-secondary mb-2">
                0{activeIndex + 1} · {t(`plan_rooms.${active.key}`)}
              </p>
              <h3 className="font-headline text-2xl md:text-3xl leading-tight">{tCat(active.key)}</h3>
              <p className="mt-2 font-label text-[10px] uppercase tracking-widest text-primary/50">
                {t('plan_works', { count: active.count })}
              </p>
            </div>
            <span className="shrink-0 font-label font-bold text-[10px] uppercase tracking-[0.2em] border-b border-secondary pb-1 text-primary group-hover:text-secondary transition-colors duration-[400ms] whitespace-nowrap">
              {t('plan_view')}
            </span>
          </div>
        </Link>
      </div>

    </div>
  )
}
