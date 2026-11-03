'use client'
import { useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import type { CategoryKey } from '@/lib/categories'
import { setGalleryCategory } from '@/lib/galleryCategory'

// A ground-floor plan drawn to architectural convention: cut walls as solid
// poché, openings as gaps, thin lines for furniture, dimension strings outside.
// Units are centimetres: 12.0 x 9.0 m, exterior walls 30, interior 12.
// Each room is one gallery category. Hovering previews, clicking opens it.

export interface PlanRoom {
  key: CategoryKey
  src: string
  count: number
}

interface Room {
  key: CategoryKey
  x: number; y: number; w: number; h: number
  label: [number, number]
  area: number
}

const ROOMS: Room[] = [
  { key: 'Kitchens',              x: 30,  y: 30,  w: 400, h: 340, label: [120, 150], area: 13.6 },
  { key: 'Interior_Decorations',  x: 442, y: 30,  w: 728, h: 340, label: [800, 90],  area: 24.8 },
  { key: 'Doors',                 x: 30,  y: 382, w: 840, h: 120, label: [470, 418], area: 10.1 },
  { key: 'Stairs',                x: 882, y: 382, w: 288, h: 488, label: [910, 560], area: 14.1 },
  { key: 'Wardrobes_and_Bedroom', x: 30,  y: 514, w: 500, h: 356, label: [290, 650], area: 17.8 },
  { key: 'Bathroom_and_Sauna',    x: 542, y: 514, w: 328, h: 356, label: [560, 616], area: 11.7 },
]

// Interior walls as filled rectangles (the exterior wall is a path below)
const WALLS = [
  [430, 30, 12, 352],   // kitchen | living
  [30, 370, 1140, 12],  // top row | hall
  [30, 502, 840, 12],   // hall | bottom row
  [870, 382, 12, 488],  // hall | stair hall
  [530, 514, 12, 356],  // bedroom | bath
  [690, 700, 8, 170],   // sauna cabin
  [690, 692, 180, 8],
]

// Openings cut out of the walls, then doors and windows drawn into them
const OPENINGS = [
  [0, 400, 30, 90],     // entrance
  [300, 370, 90, 12],   // kitchen
  [480, 370, 90, 12],   // living
  [380, 502, 90, 12],   // bedroom
  [680, 502, 90, 12],   // bath
  [870, 410, 12, 90],   // stair hall
  [690, 720, 8, 70],    // sauna
]

// Hinge, leaf end, far side of the opening. Leaves swing into the room, against a wall.
const DOORS = [
  [30, 490, 120, 490, 30, 400],
  [390, 370, 390, 280, 300, 370],
  [480, 370, 480, 280, 570, 370],
  [380, 514, 380, 604, 470, 514],
  [770, 514, 770, 604, 680, 514],
  [882, 410, 972, 410, 882, 500],
  [690, 790, 620, 790, 690, 720],
]

const WINDOWS = [
  [140, 0, 200, 30],
  [560, 0, 200, 30],
  [900, 0, 200, 30],
  [1170, 110, 30, 180],
  [1170, 600, 30, 160],
  [160, 870, 240, 30],
]

function Door({ d: [hx, hy, ex, ey, ox, oy] }: { d: number[] }) {
  const r = Math.hypot(ex - hx, ey - hy)
  const sweep = (ex - hx) * (oy - hy) - (ey - hy) * (ox - hx) > 0 ? 1 : 0
  return (
    <g>
      <line x1={hx} y1={hy} x2={ex} y2={ey} className="stroke-primary" strokeWidth={1.4} />
      <path d={`M${ex} ${ey} A${r} ${r} 0 0 ${sweep} ${ox} ${oy}`} className="stroke-primary/45 fill-none" strokeWidth={0.8} />
    </g>
  )
}

function Window({ d: [x, y, w, h] }: { d: number[] }) {
  const horizontal = w > h
  return (
    <g className="stroke-primary" strokeWidth={0.9}>
      <rect x={x} y={y} width={w} height={h} className="fill-surface" stroke="none" />
      {horizontal ? (
        <>
          <line x1={x} y1={y + 10} x2={x + w} y2={y + 10} />
          <line x1={x} y1={y + 20} x2={x + w} y2={y + 20} />
          <line x1={x} y1={y} x2={x} y2={y + h} />
          <line x1={x + w} y1={y} x2={x + w} y2={y + h} />
        </>
      ) : (
        <>
          <line x1={x + 10} y1={y} x2={x + 10} y2={y + h} />
          <line x1={x + 20} y1={y} x2={x + 20} y2={y + h} />
          <line x1={x} y1={y} x2={x + w} y2={y} />
          <line x1={x} y1={y + h} x2={x + w} y2={y + h} />
        </>
      )}
    </g>
  )
}

// Dimension string with architectural ticks. `from` is the wall face the extension lines start at.
function Dim({ a, b, at, from, label, vertical = false }: { a: number; b: number; at: number; from: number; label: string; vertical?: boolean }) {
  const dir = at < from ? -1 : 1
  const ext = (p: number) => vertical
    ? <line x1={from + dir * 4} y1={p} x2={at + dir * 10} y2={p} />
    : <line x1={p} y1={from + dir * 4} x2={p} y2={at + dir * 10} />
  const tick = (p: number) => vertical
    ? <line x1={at - 6} y1={p + 6} x2={at + 6} y2={p - 6} />
    : <line x1={p - 6} y1={at + 6} x2={p + 6} y2={at - 6} />
  const mid = (a + b) / 2
  return (
    <g className="stroke-primary/50" strokeWidth={0.8}>
      {vertical ? <line x1={at} y1={a} x2={at} y2={b} /> : <line x1={a} y1={at} x2={b} y2={at} />}
      {ext(a)}{ext(b)}{tick(a)}{tick(b)}
      <text
        x={vertical ? at - 8 : mid}
        y={vertical ? mid : at - 8}
        transform={vertical ? `rotate(-90 ${at - 8} ${mid})` : undefined}
        textAnchor="middle"
        stroke="none"
        className="fill-primary/60 font-label text-[24px] md:text-[15px] tracking-wider"
      >
        {label}
      </text>
    </g>
  )
}

export default function HomePlan({ rooms }: { rooms: PlanRoom[] }) {
  const t      = useTranslations('home')
  const tCat   = useTranslations('categories')
  const locale = useLocale()

  const byKey  = new Map(rooms.map(r => [r.key, r]))
  const shapes = ROOMS.filter(s => byKey.has(s.key))
  const [activeKey, setActiveKey] = useState<CategoryKey | undefined>(shapes[0]?.key)
  const active = activeKey ? byKey.get(activeKey) : undefined
  const activeIndex = shapes.findIndex(s => s.key === activeKey)
  // Touch fires a synthetic mouseenter right before click, so the pointer type decides
  // what a click does: mouse opens, first tap previews, second tap opens.
  const pointer = useRef('mouse')

  if (!active) return null

  // The gallery lower on the page switches to the room and the page scrolls there
  const go = (key: CategoryKey) => {
    setGalleryCategory(key)
    document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })
  }
  const open = (key: CategoryKey) => {
    if (pointer.current === 'mouse' || key === activeKey) go(key)
    else setActiveKey(key)
  }

  const area = (m2: number) =>
    t('plan_area', { area: new Intl.NumberFormat(locale === 'ua' ? 'uk' : 'en', { minimumFractionDigits: 1 }).format(m2) })

  const thin = { vectorEffect: 'non-scaling-stroke' as const }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">

      {/* ── Plan ─────────────────────────────────── */}
      <div className="md:col-span-7">
        <svg
          viewBox="-110 -110 1340 1075"
          role="group"
          aria-label={t('plan_hint')}
          className="w-full h-auto text-primary select-none"
        >
          <defs>
            <pattern id="plan-grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M50 0H0V50" fill="none" stroke="currentColor" strokeOpacity={0.07} style={thin} />
            </pattern>
          </defs>
          <rect x={-110} y={-110} width={1340} height={1075} fill="url(#plan-grid)" />

          {/* Room fills, labels and hit areas */}
          {shapes.map((s, i) => {
            const on = s.key === activeKey
            const [lx, ly] = s.label
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
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(s.key) } }}
              >
                <rect
                  x={s.x} y={s.y} width={s.w} height={s.h}
                  style={{ fillOpacity: on ? 0.14 : 0 }}
                  className="fill-secondary transition-[fill-opacity] duration-500"
                />
                <text x={lx} y={ly} className={`font-label text-[26px] md:text-[16px] uppercase tracking-[0.2em] transition-[fill] duration-300 ${on ? 'fill-secondary' : 'fill-primary/45'}`}>
                  0{i + 1}
                </text>
                <text x={lx} y={ly + 30} className={`font-headline text-[46px] md:text-[30px] transition-[fill] duration-300 ${on ? 'fill-on-surface' : 'fill-primary'}`}>
                  {t(`plan_rooms.${s.key}`)}
                </text>
                <text x={lx} y={ly + 54} className="font-label text-[26px] md:text-[16px] tracking-wider fill-primary/50">
                  {area(s.area)}
                </text>
              </g>
            )
          })}

          {/* Furniture and fixtures: thin lines, never in a door swing */}
          <g className="stroke-primary/55 fill-none" strokeWidth={1} style={thin} pointerEvents="none" strokeLinejoin="round">
            {/* Kitchen: L-shaped run, sink under the window, hob at the far end, fridge at the end of the run, table for four */}
            <rect x={30} y={30} width={400} height={60} />
            <rect x={30} y={90} width={60} height={170} />
            <rect x={205} y={42} width={36} height={36} rx={6} /><rect x={245} y={42} width={36} height={36} rx={6} />
            <circle cx={243} cy={36} r={3} />
            <rect x={335} y={38} width={62} height={46} rx={3} />
            <circle cx={351} cy={52} r={8} /><circle cx={381} cy={52} r={8} /><circle cx={351} cy={72} r={8} /><circle cx={381} cy={72} r={8} />
            <rect x={32} y={262} width={68} height={68} />
            <line x1={32} y1={262} x2={100} y2={330} /><line x1={100} y1={262} x2={32} y2={330} />
            <rect x={200} y={200} width={120} height={80} />
            <rect x={220} y={160} width={38} height={36} rx={6} /><rect x={264} y={160} width={38} height={36} rx={6} />
            <rect x={220} y={284} width={38} height={36} rx={6} /><rect x={264} y={284} width={38} height={36} rx={6} />

            {/* Living: media wall opposite the sofa, rug, reading corner at the side window, shelving on the back wall */}
            <rect x={442} y={90} width={38} height={170} />
            <line x1={484} y1={120} x2={484} y2={230} strokeWidth={2} />
            <rect x={520} y={70} width={260} height={260} strokeDasharray="4 6" />
            <rect x={650} y={110} width={80} height={180} rx={6} />
            <line x1={718} y1={118} x2={718} y2={282} />
            <line x1={650} y1={130} x2={718} y2={130} /><line x1={650} y1={270} x2={718} y2={270} />
            <line x1={650} y1={200} x2={718} y2={200} />
            <rect x={560} y={160} width={56} height={80} rx={10} />
            <rect x={1080} y={150} width={70} height={70} rx={10} />
            <line x1={1138} y1={158} x2={1138} y2={212} />
            <circle cx={1150} cy={125} r={9} />
            <rect x={880} y={334} width={270} height={36} />
            <line x1={934} y1={334} x2={934} y2={370} /><line x1={988} y1={334} x2={988} y2={370} />
            <line x1={1042} y1={334} x2={1042} y2={370} /><line x1={1096} y1={334} x2={1096} y2={370} />
            <circle cx={1140} cy={60} r={18} /><circle cx={1140} cy={60} r={8} />

            {/* Hall: wardrobe past the entrance swing, bench by the bedroom door */}
            <rect x={140} y={382} width={160} height={60} />
            <line x1={150} y1={412} x2={290} y2={412} strokeDasharray="6 4" />
            <line x1={220} y1={382} x2={220} y2={442} />
            <rect x={300} y={466} width={70} height={36} />

            {/* Bedroom: headboard on the solid wall, nightstands, dresser, wardrobe on the far wall */}
            <rect x={30} y={590} width={14} height={180} />
            <rect x={44} y={600} width={200} height={160} />
            <rect x={56} y={612} width={44} height={66} rx={8} /><rect x={56} y={682} width={44} height={66} rx={8} />
            <line x1={120} y1={600} x2={120} y2={760} />
            <rect x={44} y={546} width={48} height={44} /><circle cx={68} cy={568} r={9} />
            <rect x={44} y={770} width={48} height={44} /><circle cx={68} cy={792} r={9} />
            <rect x={240} y={524} width={110} height={50} />
            <rect x={470} y={600} width={60} height={260} />
            <line x1={500} y1={610} x2={500} y2={850} strokeDasharray="6 4" />
            <line x1={470} y1={687} x2={530} y2={687} /><line x1={470} y1={773} x2={530} y2={773} />

            {/* Bath and sauna: vanity by the door, WC in the corner, tub along the wall, sauna cabin with benches and heater */}
            <rect x={560} y={514} width={110} height={60} />
            <ellipse cx={615} cy={544} rx={22} ry={16} /><circle cx={615} cy={524} r={3} />
            <rect x={790} y={514} width={60} height={22} />
            <ellipse cx={820} cy={566} rx={24} ry={30} />
            <rect x={542} y={690} width={70} height={180} rx={24} />
            <rect x={550} y={700} width={54} height={160} rx={20} />
            <circle cx={577} cy={714} r={5} />
            <rect x={800} y={708} width={62} height={154} />
            <rect x={706} y={812} width={94} height={50} />
            <rect x={706} y={708} width={34} height={34} />
            <line x1={706} y1={708} x2={740} y2={742} /><line x1={740} y1={708} x2={706} y2={742} />

            {/* Stair hall: straight flight along the outer wall, rising away from the door */}
            {Array.from({ length: 17 }, (_, i) => (
              <line key={i} x1={1070} y1={430 + i * 27} x2={1170} y2={430 + i * 27} />
            ))}
            <line x1={1070} y1={430} x2={1070} y2={862} strokeWidth={1.4} />
            <circle cx={1120} cy={445} r={5} className="fill-primary/55" />
            <line x1={1120} y1={445} x2={1120} y2={840} />
            <path d="M1110 836 L1120 852 L1130 836" />
          </g>

          {/* Walls: cut elements, drawn heaviest as solid poché */}
          <g className="fill-primary" pointerEvents="none">
            <path d="M0 0H1200V900H0Z M30 30V870H1170V30Z" fillRule="evenodd" />
            {WALLS.map(([x, y, w, h], i) => <rect key={i} x={x} y={y} width={w} height={h} />)}
          </g>

          {/* Openings, then doors and windows */}
          <g pointerEvents="none" style={thin}>
            {OPENINGS.map(([x, y, w, h], i) => <rect key={i} x={x} y={y} width={w} height={h} className="fill-surface" />)}
            {DOORS.map((d, i) => <Door key={i} d={d} />)}
            {WINDOWS.map((w, i) => <Window key={i} d={w} />)}
          </g>

          {/* Dimension strings and annotations */}
          <g pointerEvents="none" style={thin}>
            <Dim a={30} b={430} at={-40} from={0} label="4 000" />
            <Dim a={442} b={1170} at={-40} from={0} label="7 280" />
            <Dim a={0} b={1200} at={-80} from={0} label="12 000" />
            <Dim a={30} b={370} at={-40} from={0} label="3 400" vertical />
            <Dim a={382} b={502} at={-40} from={0} label="1 200" vertical />
            <Dim a={514} b={870} at={-40} from={0} label="3 560" vertical />
            <Dim a={0} b={900} at={-80} from={0} label="9 000" vertical />

            {/* North */}
            <g className="stroke-primary/50 fill-none" strokeWidth={0.8} transform="translate(1160 -60)">
              <circle r={24} />
              <path d="M0 -20 L8 8 L0 2 L-8 8 Z" className="fill-primary/60" stroke="none" />
              <text y={-30} textAnchor="middle" stroke="none" className="fill-primary/60 font-label text-[24px] md:text-[15px]">N</text>
            </g>

            <text x={1200} y={940} textAnchor="end" className="fill-primary/50 font-label text-[24px] md:text-[15px] uppercase tracking-[0.2em]">
              {t('plan_scale')}
            </text>
          </g>
        </svg>
        <p className="mt-4 font-label text-[10px] uppercase tracking-[0.25em] text-primary/40 md:hidden">
          {t('plan_hint')}
        </p>
      </div>

      {/* ── Preview ──────────────────────────────── */}
      <div className="md:col-span-5">
        <a href="#gallery" onClick={e => { e.preventDefault(); go(active.key) }} className="group block">
          <div className="relative aspect-[4/5] overflow-hidden bg-surface-container-low">
            {rooms.map(r => (
              <Image
                key={r.key}
                src={r.src}
                alt={`${tCat(r.key)} — Ivolga workshop, Odessa`}
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
        </a>
      </div>

    </div>
  )
}
