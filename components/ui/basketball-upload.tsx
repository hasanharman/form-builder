'use client'

import * as React from 'react'
import { Check, Plus, Upload, X } from 'lucide-react'

import { cn } from '@/lib/utils'

// Sizes, in CSS pixels of the court.
const FILE_W = 46
const FILE_H = 58
const BALL_R = 20 // the file collides as a circle
const RIM_HALF = 56
const RIM_DEPTH = 8
const RIM_TUBE = 5
const NET_H = 84
const FLOOR_GAP = 54 // room under the file for its name

const GRAVITY = 2400 // px/s²
const POWER = 12 // launch speed per pixel of pull
const MAX_PULL = 120
const MIN_PULL = 14
const DEAD_ZONE = RIM_HALF + 62 // no clean arc starts closer to the hoop
const AIM_DOTS = 8

export type BasketballUploadHandle = {
  /** Takes an assisted shot; false if no file was ready. `miss` sends it long. */
  shoot: (options?: { miss?: boolean }) => boolean
  /** Puts files on the floor, as if the user had picked them. */
  add: (files: File[]) => void
}

export type BasketballUploadProps = {
  /** Files that went through the hoop. */
  value?: File[]
  onValueChange?: (files: File[]) => void
  /** Uploads a scored file. `report(0..1)` fills the net; reject to drop it back out. */
  onUpload?: (
    file: File,
    report: (progress: number) => void,
  ) => Promise<unknown>
  accept?: string
  /** Largest file allowed, in bytes. */
  maxSize?: number
  multiple?: boolean
  disabled?: boolean
  title?: string
  description?: string
  className?: string
}

type Queued = { id: number; file: File; at?: { x: number; y: number } }
type Mood = 'idle' | 'miss' | 'uploading' | 'done' | 'error'
type Tone = 'idle' | 'active' | 'miss' | 'done' | 'error'
type Geometry = {
  width: number
  floorY: number
  homeX: number
  rimX: number
  rimY: number
  dead: number
  board: { left: number; top: number; right: number; bottom: number }
}

const TONES: Record<
  Tone,
  { icon: typeof Upload; panel: string; chip: string; target: string }
> = {
  idle: {
    icon: Upload,
    panel: 'border-border',
    chip: 'bg-blue-600',
    target: 'border-muted-foreground/30',
  },
  active: {
    icon: Upload,
    panel: 'border-blue-500 ring-4 ring-blue-500/10',
    chip: 'bg-blue-600',
    target: 'border-blue-500',
  },
  miss: {
    icon: X,
    panel: 'border-orange-400 ring-4 ring-orange-400/15',
    chip: 'bg-orange-500',
    target: 'border-orange-400',
  },
  done: {
    icon: Check,
    panel: 'border-emerald-500 ring-4 ring-emerald-500/15',
    chip: 'bg-emerald-600',
    target: 'border-emerald-500',
  },
  error: {
    icon: X,
    panel: 'border-red-500 ring-4 ring-red-500/15',
    chip: 'bg-red-600',
    target: 'border-red-500',
  },
}

const NET_ROWS = 6
const NET_COLS = 6

/** A knot of the net: `row` runs 0..NET_ROWS down, `col` 0..NET_COLS across. */
function netPoint(row: number, col: number) {
  const t = row / NET_ROWS
  const u = (col / NET_COLS) * 2 - 1
  const half = (RIM_HALF - 3) * (1 - t ** 0.8) + 27 * t ** 0.8
  const sag = RIM_DEPTH * (1 - 0.45 * t) * Math.sqrt(1 - u * u)
  const x = RIM_HALF + half * u
  const y = t * (NET_H - RIM_DEPTH) + sag
  return `${x.toFixed(1)} ${y.toFixed(1)}`
}

const NET_MESH = (() => {
  const d: string[] = []
  for (let row = 0; row < NET_ROWS; row++) {
    const shift = row % 2 ? 0.5 : 0
    for (let col = shift; col <= NET_COLS - shift; col++) {
      for (const next of [col - 0.5, col + 0.5]) {
        if (next < 0 || next > NET_COLS) continue
        d.push(`M${netPoint(row, col)}L${netPoint(row + 1, next)}`)
      }
    }
  }
  const hem = Array.from({ length: NET_COLS + 1 }, (_, col) =>
    netPoint(NET_ROWS, col),
  )
  return `${d.join('')}M${hem.join('L')}`
})()

const NET_SHAPE = (() => {
  const points: string[] = []
  for (let col = 0; col <= NET_COLS; col++) points.push(netPoint(0, col))
  for (let row = 1; row <= NET_ROWS; row++)
    points.push(netPoint(row, NET_COLS - (row % 2) / 2))
  for (let col = NET_COLS - 1; col >= 0; col--)
    points.push(netPoint(NET_ROWS, col))
  for (let row = NET_ROWS - 1; row >= 1; row--)
    points.push(netPoint(row, (row % 2) / 2))
  return `M${points.join('L')}Z`
})()

function Net({
  filled,
  className,
  style,
}: {
  filled?: boolean
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <svg
      viewBox={`0 0 ${RIM_HALF * 2} ${NET_H}`}
      className={cn('absolute inset-0 size-full overflow-visible', className)}
      style={style}
      aria-hidden="true"
    >
      {filled ? (
        <path d={NET_SHAPE} fill="currentColor" fillOpacity={0.16} />
      ) : null}
      <path
        d={NET_MESH}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Half of the rim. The far half sits behind the file, the near half in front. */
function RimArc({ front, className }: { front?: boolean; className?: string }) {
  const w = RIM_HALF + RIM_TUBE
  const h = RIM_DEPTH + RIM_TUBE
  return (
    <svg
      viewBox={`${-w} ${-h} ${w * 2} ${h * 2}`}
      className={cn('absolute overflow-visible', className)}
      style={{ left: -w, top: -h, width: w * 2, height: h * 2 }}
      aria-hidden="true"
    >
      <path
        d={`M${-RIM_HALF} 0A${RIM_HALF} ${RIM_DEPTH} 0 0 ${front ? 0 : 1} ${RIM_HALF} 0`}
        fill="none"
        stroke="currentColor"
        strokeWidth={RIM_TUBE * 1.4}
        strokeLinecap="round"
      />
    </svg>
  )
}

function badgeColor(ext: string) {
  if (ext === 'pdf') return 'fill-orange-500'
  if (/^(png|jpe?g|gif|webp|svg|avif)$/.test(ext)) return 'fill-violet-500'
  if (/^(xlsx?|csv)$/.test(ext)) return 'fill-emerald-500'
  if (/^(docx?|txt|md)$/.test(ext)) return 'fill-blue-500'
  return 'fill-slate-500'
}

function FileIcon({ name, className }: { name: string; className?: string }) {
  const ext = /\.([a-z0-9]{1,4})$/i.exec(name)?.[1].toLowerCase() ?? 'file'
  return (
    <svg
      viewBox={`0 0 ${FILE_W} ${FILE_H}`}
      className={cn('size-full drop-shadow-sm', className)}
      aria-hidden="true"
    >
      <path
        d="M7 .75h21.5L45.25 17.5V51A6.25 6.25 0 0 1 39 57.25H7A6.25 6.25 0 0 1 .75 51V7A6.25 6.25 0 0 1 7 .75Z"
        className="fill-background stroke-foreground/20"
        strokeWidth={1.5}
      />
      <path
        d="M28.5 1v10.5a6 6 0 0 0 6 6H45"
        fill="none"
        className="stroke-foreground/20"
        strokeWidth={1.5}
      />
      <rect
        x={6}
        y={33}
        width={29}
        height={15}
        rx={4}
        className={badgeColor(ext)}
      />
      <text
        x={20.5}
        y={43.6}
        textAnchor="middle"
        className="fill-white text-[8.5px] font-bold"
      >
        {ext.toUpperCase()}
      </text>
    </svg>
  )
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function accepts(file: File, accept?: string) {
  if (!accept) return true
  return accept.split(',').some((raw) => {
    const rule = raw.trim().toLowerCase()
    if (rule.startsWith('.')) return file.name.toLowerCase().endsWith(rule)
    if (rule.endsWith('/*')) return file.type.startsWith(rule.slice(0, -1))
    return file.type === rule
  })
}

function simulateUpload(_file: File, report: (progress: number) => void) {
  return new Promise<void>((resolve) => {
    const started = performance.now()
    const tick = () => {
      const progress = Math.min(1, (performance.now() - started) / 1400)
      report(progress)
      if (progress < 1) requestAnimationFrame(tick)
      else resolve()
    }
    requestAnimationFrame(tick)
  })
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

let nextId = 0

export const BasketballUpload = React.forwardRef<
  BasketballUploadHandle,
  BasketballUploadProps
>(function BasketballUpload(
  {
    value,
    onValueChange,
    onUpload,
    accept,
    maxSize,
    multiple = false,
    disabled = false,
    title = 'Upload a file',
    description,
    className,
  },
  ref,
) {
  const courtRef = React.useRef<HTMLDivElement>(null)
  const boardRef = React.useRef<HTMLDivElement>(null)
  const rimRef = React.useRef<HTMLDivElement>(null)
  const netRef = React.useRef<HTMLDivElement>(null)
  const ballRef = React.useRef<HTMLButtonElement>(null)
  const shadowRef = React.useRef<HTMLDivElement>(null)
  const labelRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const dotRefs = React.useRef<(HTMLSpanElement | null)[]>([])

  const [queue, setQueue] = React.useState<Queued[]>([])
  const [inner, setInner] = React.useState<File[]>([])
  const [mood, setMood] = React.useState<Mood>('idle')
  const [notice, setNotice] = React.useState({ title: '', text: '' })
  const [progress, setProgress] = React.useState(0)
  const [phase, setPhase] = React.useState<'away' | 'resting' | 'aiming'>(
    'away',
  )
  const [hot, setHot] = React.useState(false)
  const [dropping, setDropping] = React.useState(false)
  const [hint, setHint] = React.useState(false)
  const [attempts, setAttempts] = React.useState(0)
  const [tally, setTally] = React.useState({ made: 0, shots: 0 })

  const files = value ?? inner
  const active = queue[0]

  // The flight runs outside React; state is set only when something visible changes.
  const geo = React.useRef<Geometry | null>(null)
  const frame = React.useRef(0)
  const alive = React.useRef(true)
  const timers = React.useRef(new Set<ReturnType<typeof setTimeout>>())
  const moodTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  const sim = React.useRef({
    mode: 'hidden' as 'hidden' | 'rest' | 'aim' | 'fly' | 'net',
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    rot: 0,
    spin: 0,
    anchorX: 0,
    anchorY: 0,
    grabX: 0,
    grabY: 0,
    pullX: 0,
    pullY: 0,
    stretch: 0,
    live: false, // this flight is a shot, not a file dropping in
    above: false,
    rimHit: false,
    judged: false,
    hot: false,
    behind: false,
  })
  const snapshot = {
    active,
    files,
    value,
    onValueChange,
    onUpload,
    accept,
    maxSize,
    multiple,
    mood,
    attempts,
  }
  const latest = React.useRef(snapshot)
  React.useEffect(() => {
    latest.current = snapshot
  })

  const later = (fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      timers.current.delete(id)
      fn()
    }, ms)
    timers.current.add(id)
    return id
  }

  /** Shows a mood for a while, then goes back to idle. */
  const flash = (next: Mood, ms: number) => {
    clearTimeout(moodTimer.current)
    setMood(next)
    moodTimer.current = later(
      () => setMood((current) => (current === next ? 'idle' : current)),
      ms,
    )
  }

  const commit = (next: File[]) => {
    if (latest.current.value === undefined) setInner(next)
    latest.current.onValueChange?.(next)
  }

  // Divided by any ancestor CSS scale, so the court works inside a scaled preview.
  const measure = () => {
    const court = courtRef.current
    const rim = rimRef.current
    const board = boardRef.current
    if (!court || !rim || !board) return geo.current
    const box = court.getBoundingClientRect()
    const k = box.width / court.offsetWidth || 1
    const at = (el: Element) => {
      const r = el.getBoundingClientRect()
      return {
        left: (r.left - box.left) / k,
        top: (r.top - box.top) / k,
        right: (r.right - box.left) / k,
        bottom: (r.bottom - box.top) / k,
      }
    }
    const hoop = at(rim)
    const width = court.offsetWidth
    geo.current = {
      width,
      floorY: court.offsetHeight - FLOOR_GAP - FILE_H / 2,
      homeX: Math.max(BALL_R + 8, hoop.left - DEAD_ZONE - 6),
      rimX: hoop.left,
      rimY: hoop.top,
      dead: Math.min(DEAD_ZONE, hoop.left - BALL_R - 6),
      board: at(board),
    }
    return geo.current
  }

  const toLocal = (event: { clientX: number; clientY: number }) => {
    const court = courtRef.current
    if (!court) return { x: 0, y: 0 }
    const box = court.getBoundingClientRect()
    const k = box.width / court.offsetWidth || 1
    return {
      x: (event.clientX - box.left) / k,
      y: (event.clientY - box.top) / k,
    }
  }

  const paint = () => {
    const s = sim.current
    const g = geo.current
    if (!g) return
    const ball = ballRef.current
    if (ball) {
      const pull =
        s.mode === 'aim' ? Math.hypot(s.pullX, s.pullY) / MAX_PULL : 0
      ball.style.visibility = s.mode === 'hidden' ? 'hidden' : 'visible'
      ball.style.zIndex = s.behind ? '20' : '40'
      ball.style.transform = `translate3d(${s.x - FILE_W / 2}px,${s.y - FILE_H / 2}px,0) rotate(${s.rot}deg) scale(${1 + pull * 0.08},${1 - pull * 0.12})`
    }
    const lift = clamp((g.floorY - s.y) / 240, 0, 1)
    if (shadowRef.current) {
      const shown = s.mode !== 'hidden' && s.mode !== 'net'
      shadowRef.current.style.opacity = shown ? String(1 - lift * 0.85) : '0'
      shadowRef.current.style.transform = `translate3d(${s.x - 22}px,0,0) scale(${1 - lift * 0.5})`
    }
    if (labelRef.current) {
      labelRef.current.style.transform = `translate3d(${clamp(s.x - 70, 4, g.width - 144)}px,0,0)`
    }
    if (netRef.current) {
      netRef.current.style.transform = `scaleY(${1 + s.stretch})`
    }
  }

  /** Draws the first half second of where the shot would go. */
  const paintAim = () => {
    const s = sim.current
    const armed = s.mode === 'aim' && Math.hypot(s.pullX, s.pullY) >= MIN_PULL
    dotRefs.current.forEach((dot, i) => {
      if (!dot) return
      const t = (i + 1) * 0.06
      const x = s.x - s.pullX * POWER * t
      const y = s.y - s.pullY * POWER * t + 0.5 * GRAVITY * t * t
      dot.style.opacity = armed ? String(0.9 - i * 0.1) : '0'
      dot.style.transform = `translate3d(${x - 3}px,${y - 3}px,0) scale(${1 - i * 0.07})`
    })
  }

  const cool = () => {
    if (!sim.current.hot) return
    sim.current.hot = false
    setHot(false)
  }

  const upload = async (entry: Queued) => {
    clearTimeout(moodTimer.current)
    setMood('uploading')
    setProgress(0)
    const send = latest.current.onUpload ?? simulateUpload
    // Thinned out: a report every frame restarts the fill transition before it moves.
    let shownAt = 0
    try {
      await send(entry.file, (amount) => {
        const now = performance.now()
        if (!alive.current || (amount < 1 && now - shownAt < 150)) return
        shownAt = now
        setProgress(clamp(amount, 0, 1))
      })
    } catch (error) {
      if (!alive.current) return
      // Hand it back: the file falls out of the net.
      Object.assign(sim.current, {
        mode: 'fly',
        behind: false,
        stretch: 0,
        vx: 260,
        vy: 60,
        spin: 320,
      })
      setNotice({
        title: 'Rejected at the rim',
        text:
          error instanceof Error && error.message
            ? error.message
            : 'The upload failed. Shoot again.',
      })
      flash('error', 2600)
      run()
      return
    }
    if (!alive.current) return
    setMood('done')
    commit(
      latest.current.multiple
        ? [...latest.current.files, entry.file]
        : [entry.file],
    )
    later(() => {
      setQueue((items) => items.filter((item) => item.id !== entry.id))
      setMood('idle')
    }, 1500)
  }

  const score = () => {
    const s = sim.current
    const dunked = s.live ? 0 : 1 // dropped straight in, without a shot
    setTally((t) => ({ made: t.made + 1, shots: t.shots + dunked }))
    Object.assign(s, { mode: 'net', behind: true, live: false })
    cool()
    if (latest.current.active) void upload(latest.current.active)
  }

  const miss = () => {
    const s = sim.current
    s.judged = true
    cool()
    const lines = s.rimHit
      ? ['Brick!', 'Off the rim']
      : s.above
        ? ['Airball!', 'Not even the rim']
        : ['Way short', 'That barely left the floor']
    setNotice({
      title: lines[latest.current.attempts % lines.length],
      text: 'Grab the rebound and shoot again.',
    })
    flash('miss', 1500)
  }

  /** Advances the file by `dt` seconds. Returns false once nothing moves. */
  const step = (dt: number): boolean => {
    const s = sim.current
    const g = geo.current
    if (!g) return false
    const upright = Math.round(s.rot / 360) * 360

    if (s.mode === 'rest') {
      s.rot += (upright - s.rot) * Math.min(1, dt * 12)
      if (Math.abs(upright - s.rot) > 0.4) return true
      s.rot = 0
      return false
    }

    if (s.mode === 'net') {
      // Caught: the file hangs on a spring in the pocket of the net.
      const pocket = g.rimY + NET_H * 0.48
      s.vx += (-(s.x - g.rimX) * 220 - s.vx * 18) * dt
      s.vy += (-(s.y - pocket) * 220 - s.vy * 15) * dt
      s.x += s.vx * dt
      s.y += s.vy * dt
      s.rot += (upright - s.rot) * Math.min(1, dt * 6)
      s.stretch = clamp((s.y - pocket) / NET_H, 0, 0.3)
      return Math.abs(s.vx) + Math.abs(s.vy) > 4 || Math.abs(s.y - pocket) > 0.5
    }

    if (s.mode !== 'fly') return false

    const prevY = s.y
    s.vy += GRAVITY * dt
    s.x += s.vx * dt
    s.y += s.vy * dt
    s.rot += s.spin * dt

    if (s.x < BALL_R) {
      s.x = BALL_R
      s.vx = Math.abs(s.vx) * 0.55
      s.spin *= -0.5
    } else if (s.x > g.width - BALL_R) {
      s.x = g.width - BALL_R
      s.vx = -Math.abs(s.vx) * 0.55
      s.spin *= -0.5
    }

    // The two ends of the rim are the only solid parts of the hoop.
    for (const side of [-1, 1]) {
      const dx = s.x - (g.rimX + side * RIM_HALF)
      const dy = s.y - g.rimY
      const dist = Math.hypot(dx, dy)
      const reach = BALL_R + RIM_TUBE
      if (dist >= reach) continue
      const nx = dist ? dx / dist : side
      const ny = dist ? dy / dist : 0
      s.x += nx * (reach - dist)
      s.y += ny * (reach - dist)
      const into = s.vx * nx + s.vy * ny
      if (into < 0) {
        s.vx -= 1.5 * into * nx
        s.vy -= 1.5 * into * ny
      }
      s.vx += Math.sign(dx || side) * 12 // never balances on the rim
      s.spin = s.vx * 1.4
      if (s.live) s.rimHit = true
    }

    const dx = s.x - g.rimX
    const inside = Math.abs(dx) < RIM_HALF - RIM_TUBE

    // The net stops anything coming up from underneath.
    if (
      s.vy < 0 &&
      s.y > g.rimY &&
      s.y - BALL_R < g.rimY + NET_H &&
      Math.abs(dx) < RIM_HALF - 14
    ) {
      s.vy = Math.abs(s.vy) * 0.3
      s.vx *= 0.6
    }

    if (s.y < g.rimY) s.above = true
    s.behind = s.vy > 0 && inside && s.y < g.rimY + BALL_R

    if (prevY < g.rimY && s.y >= g.rimY) {
      if (inside) {
        score()
        return true
      }
      if (s.live && !s.judged) miss()
    }

    const overBoard =
      s.live &&
      !s.judged &&
      s.x > g.board.left &&
      s.x < g.board.right &&
      s.y > g.board.top &&
      s.y < g.board.bottom
    if (overBoard !== s.hot) {
      s.hot = overBoard
      setHot(overBoard)
    }

    // A pulled-back file starts below the floor line, so only landings count.
    if (s.y >= g.floorY && s.vy >= 0) {
      s.y = g.floorY
      if (s.live && !s.judged) miss()
      if (s.vy > 160) {
        s.vy *= -0.4
        s.vx *= 0.8
        s.spin = s.vx * 1.2
      } else {
        s.vy = 0
        // The floor slopes away from under the hoop, where no shot can start.
        const stuck = Math.abs(dx) < g.dead
        if (stuck) s.vx += (dx < 0 ? -1 : 1) * 700 * dt
        else s.vx *= Math.max(0, 1 - 7 * dt)
        s.spin = s.vx * 2
        if (!stuck && Math.abs(s.vx) < 12) {
          Object.assign(s, { mode: 'rest', vx: 0, spin: 0, live: false })
          setPhase('resting')
        }
      }
    }
    return true
  }

  const run = () => {
    if (frame.current) return
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000)
      last = now
      let moving = true
      for (let i = 0; i < 8 && moving; i++) moving = step(dt / 8)
      paint()
      frame.current = moving ? requestAnimationFrame(tick) : 0
    }
    frame.current = requestAnimationFrame(tick)
  }

  const launch = (vx: number, vy: number) => {
    const s = sim.current
    const g = measure()
    if (!g) return
    clearTimeout(moodTimer.current)
    setMood('idle')
    setHint(false)
    setPhase('away')
    setAttempts((n) => n + 1)
    setTally((t) => ({ ...t, shots: t.shots + 1 }))
    Object.assign(s, {
      live: true,
      above: false,
      rimHit: false,
      judged: false,
      pullX: 0,
      pullY: 0,
    })
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // No flight: the file simply goes in.
      Object.assign(s, {
        x: g.rimX,
        y: g.rimY + NET_H * 0.48,
        vx: 0,
        vy: 0,
        rot: 0,
      })
      score()
      paint()
      return
    }
    Object.assign(s, { mode: 'fly', vx, vy, spin: clamp(vx * 1.4, -540, 540) })
    run()
  }

  const shoot = (options?: { miss?: boolean }) => {
    const s = sim.current
    const g = measure()
    if (!g || disabled || s.mode !== 'rest') return false
    const apex = g.rimY - 110
    const vy = -Math.sqrt(2 * GRAVITY * (s.y - apex))
    const time = -vy / GRAVITY + Math.sqrt((2 * (g.rimY - apex)) / GRAVITY)
    launch(((g.rimX - s.x) / time) * (options?.miss ? 1.5 : 1), vy)
    return true
  }

  const add = (incoming: File[], at?: { x: number; y: number }) => {
    const accepted: Queued[] = []
    for (const file of incoming) {
      const { accept, maxSize, mood } = latest.current
      const problem = !accepts(file, accept)
        ? 'is not a file type this hoop takes.'
        : maxSize && file.size > maxSize
          ? `is over the ${formatBytes(maxSize)} limit.`
          : null
      if (!problem) {
        accepted.push({ id: nextId++, file, at })
      } else if (mood !== 'uploading' && mood !== 'done') {
        setNotice({
          title: 'Not on the roster',
          text: `${file.name} ${problem}`,
        })
        flash('error', 2600)
      }
    }
    if (accepted.length === 0) return
    const many = latest.current.multiple
    const inNet = sim.current.mode === 'net'
    setQueue((items) => {
      if (many) return [...items, ...accepted]
      // One file at a time: a new pick replaces the one still on the floor.
      return inNet && items.length > 0 ? [items[0], accepted[0]] : [accepted[0]]
    })
  }

  React.useImperativeHandle(ref, () => ({ shoot, add }))

  React.useEffect(() => {
    alive.current = true
    const pending = timers.current
    return () => {
      alive.current = false
      cancelAnimationFrame(frame.current)
      frame.current = 0
      pending.forEach(clearTimeout)
      pending.clear()
    }
  }, [])

  // A new file at the head of the queue drops onto the floor.
  const activeId = active?.id
  React.useEffect(() => {
    const s = sim.current
    const entry = latest.current.active
    setAttempts(0)
    setPhase('away')
    if (!entry) {
      s.mode = 'hidden'
      return
    }
    const g = measure()
    if (!g) return
    Object.assign(s, {
      mode: 'fly',
      x: entry.at ? clamp(entry.at.x, BALL_R, g.width - BALL_R) : g.homeX,
      y: entry.at ? Math.min(entry.at.y, g.floorY) : g.floorY - 80,
      vx: 0,
      vy: 0,
      rot: entry.at ? 0 : -10,
      spin: entry.at ? 0 : 60,
      stretch: 0,
      live: false,
      hot: false,
      behind: false,
    })
    paint()
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId])

  React.useEffect(() => {
    const court = courtRef.current
    if (!court) return
    const observer = new ResizeObserver(() => {
      const s = sim.current
      const g = measure()
      if (g && s.mode === 'rest') {
        if (Math.abs(s.x - g.rimX) < g.dead) s.x = g.homeX
        s.x = clamp(s.x, BALL_R, g.width - BALL_R)
        s.y = g.floorY
      }
      paint()
    })
    observer.observe(court)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const release = () => {
    const s = sim.current
    if (s.mode !== 'aim') return
    const pulled = Math.hypot(s.pullX, s.pullY) >= MIN_PULL
    const vx = -s.pullX * POWER
    const vy = -s.pullY * POWER
    s.mode = 'rest'
    if (!pulled) {
      Object.assign(s, { x: s.anchorX, y: s.anchorY, pullX: 0, pullY: 0 })
      setPhase('resting')
      setHint(true)
      later(() => setHint(false), 2200)
    }
    paintAim()
    paint()
    if (pulled) launch(vx, vy)
  }

  const browse = () => inputRef.current?.click()

  let heading = title
  let text =
    description ??
    (active
      ? 'Pull the file back and let go to shoot.'
      : 'Drop a file on the court, or pick one.')
  const name = active?.file.name ?? 'The file'
  if (mood === 'miss' || mood === 'error') {
    heading = notice.title
    text = notice.text
  } else if (mood === 'uploading') {
    heading = 'Swish!'
    text = `Uploading ${name}`
  } else if (mood === 'done') {
    heading = 'Nothing but net'
    text =
      attempts > 1
        ? `${name} went in on attempt ${attempts}.`
        : attempts === 1
          ? `${name} went in on the first try.`
          : `${name} was dunked. Bold.`
  } else if (dropping) {
    text = 'Drop it. You still have to make the shot.'
  } else if (phase === 'aiming') {
    text = 'Aim above the rim, then let go.'
  } else if (hint) {
    text = 'Pull it back first, like a slingshot.'
  }

  const tone: Tone =
    mood === 'uploading' || (mood === 'idle' && (hot || dropping))
      ? 'active'
      : mood
  const Chip = TONES[tone].icon
  const filled = mood === 'uploading' ? progress : mood === 'done' ? 1 : 0
  const hoopColor = mood === 'done' ? 'text-emerald-600' : 'text-blue-600'

  return (
    <div
      data-slot="basketball-upload"
      className={cn(
        'w-full max-w-[400px]',
        disabled && 'pointer-events-none opacity-60',
        className,
      )}
    >
      <div
        ref={courtRef}
        data-slot="basketball-upload-court"
        className="relative isolate h-[440px] select-none overflow-hidden"
        onDragOver={(event) => {
          if (disabled || !event.dataTransfer.types.includes('Files')) return
          event.preventDefault()
          setDropping(true)
        }}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null))
            setDropping(false)
        }}
        onDrop={(event) => {
          if (disabled) return
          event.preventDefault()
          setDropping(false)
          add(Array.from(event.dataTransfer.files), toLocal(event))
        }}
      >
        {/* No transform or z-index here: rim and net must layer against the file, a sibling. */}
        <div
          ref={boardRef}
          className="absolute inset-x-0 top-4 mx-auto w-[272px] max-w-[calc(100%-2rem)] rounded-[22px] bg-muted p-1 pb-6"
        >
          <div
            className={cn(
              'rounded-[18px] border bg-background px-4 pt-4 transition-[border-color,box-shadow] duration-200',
              TONES[tone].panel,
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  'mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-[10px] text-white transition-colors duration-200',
                  TONES[tone].chip,
                )}
              >
                <Chip className="size-4" strokeWidth={2.5} aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1" aria-live="polite">
                <div className="truncate text-sm font-semibold leading-5">
                  {heading}
                </div>
                <div className="line-clamp-2 h-8 text-xs leading-4 text-muted-foreground">
                  {text}
                  {mood === 'uploading' ? (
                    <span aria-hidden="true" className="tabular-nums">
                      {` · ${Math.round(progress * 100)}%`}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
            <div
              className={cn(
                'mx-auto mt-4 h-14 w-[76px] rounded-t-md border-2 border-b-0 transition-colors duration-200',
                TONES[tone].target,
              )}
            />
          </div>

          <div ref={rimRef} className="absolute bottom-3 left-1/2 size-0">
            <RimArc
              className={cn('z-10 brightness-75 transition-colors', hoopColor)}
            />
            <div
              ref={netRef}
              className="absolute z-30 origin-top"
              style={{
                left: -RIM_HALF,
                top: 0,
                width: RIM_HALF * 2,
                height: NET_H,
              }}
            >
              <Net className="text-muted-foreground/45" />
              <Net
                filled
                className={cn(
                  'transition-[clip-path,color] duration-150 ease-linear',
                  hoopColor,
                )}
                style={{
                  clipPath: `inset(${(1 - filled) * 100}% -6px -6px -6px)`,
                }}
              />
            </div>
            <RimArc front className={cn('z-30 transition-colors', hoopColor)} />
          </div>
        </div>

        {active ? (
          <>
            <div
              ref={shadowRef}
              className="pointer-events-none absolute left-0 h-2 w-11 rounded-[100%] bg-foreground/20 opacity-0 blur-[3px]"
              style={{ bottom: FLOOR_GAP - 5 }}
              aria-hidden="true"
            />
            <button
              key={active.id}
              ref={ballRef}
              type="button"
              disabled={disabled}
              aria-label={`Shoot ${active.file.name}. Drag it back and release, or press Enter for an assisted shot.`}
              className={cn(
                'invisible absolute left-0 top-0 z-40 touch-none rounded-md outline-offset-4 outline-blue-600 will-change-transform focus-visible:outline-2',
                phase === 'resting' && 'cursor-grab',
                phase === 'aiming' && 'cursor-grabbing',
                phase === 'away' && 'pointer-events-none',
              )}
              style={{ width: FILE_W, height: FILE_H }}
              onPointerDown={(event) => {
                const s = sim.current
                if (s.mode !== 'rest' || event.button !== 0 || !measure())
                  return
                event.currentTarget.setPointerCapture(event.pointerId)
                const point = toLocal(event)
                Object.assign(s, {
                  mode: 'aim',
                  rot: 0,
                  anchorX: s.x,
                  anchorY: s.y,
                  grabX: point.x,
                  grabY: point.y,
                  pullX: 0,
                  pullY: 0,
                })
                setPhase('aiming')
              }}
              onPointerMove={(event) => {
                const s = sim.current
                if (s.mode !== 'aim') return
                const point = toLocal(event)
                let pullX = point.x - s.grabX
                let pullY = point.y - s.grabY
                const length = Math.hypot(pullX, pullY)
                if (length > MAX_PULL) {
                  pullX *= MAX_PULL / length
                  pullY *= MAX_PULL / length
                }
                Object.assign(s, {
                  pullX,
                  pullY,
                  x: s.anchorX + pullX * 0.3,
                  y: s.anchorY + pullY * 0.3,
                })
                paint()
                paintAim()
              }}
              onPointerUp={release}
              onPointerCancel={() => {
                sim.current.pullX = 0
                sim.current.pullY = 0
                release()
              }}
              onKeyDown={(event) => {
                if (event.key !== 'Enter' && event.key !== ' ') return
                event.preventDefault()
                shoot()
              }}
            >
              <FileIcon
                name={active.file.name}
                className={cn(
                  'transition-[scale,opacity] duration-500',
                  mood === 'uploading' && 'scale-75',
                  mood === 'done' && 'scale-50 opacity-0',
                )}
              />
            </button>
            <div
              ref={labelRef}
              className={cn(
                'pointer-events-none absolute bottom-2 left-0 w-[140px] text-center transition-opacity duration-200',
                phase === 'resting' ? 'opacity-100' : 'opacity-0',
              )}
            >
              <div className="truncate text-xs font-medium">
                {active.file.name}
              </div>
              <div className="text-[10px] text-muted-foreground">
                {formatBytes(active.file.size)}
                {queue.length > 1 ? ` · ${queue.length - 1} more waiting` : ''}
              </div>
            </div>
            {Array.from({ length: AIM_DOTS }, (_, i) => (
              <span
                key={i}
                ref={(el) => {
                  dotRefs.current[i] = el
                }}
                className="pointer-events-none absolute left-0 top-0 z-40 size-1.5 rounded-full bg-blue-600 opacity-0"
                aria-hidden="true"
              />
            ))}
          </>
        ) : (
          <button
            type="button"
            onClick={browse}
            disabled={disabled}
            className="absolute flex -translate-x-1/2 flex-col items-center gap-2 rounded-md text-muted-foreground outline-offset-4 outline-blue-600 transition-colors hover:text-foreground focus-visible:outline-2"
            style={{
              left: `max(${BALL_R + 8}px, calc(50% - ${DEAD_ZONE + 6}px))`,
              bottom: FLOOR_GAP - 24,
            }}
          >
            <span
              className="flex items-center justify-center rounded-lg border-2 border-dashed border-current/40"
              style={{ width: FILE_W, height: FILE_H }}
            >
              <Plus className="size-4" aria-hidden="true" />
            </span>
            <span className="text-xs font-medium leading-4">Pick a file</span>
          </button>
        )}
      </div>

      <div
        data-slot="basketball-upload-footer"
        className="flex items-center justify-between gap-3 px-1 text-xs text-muted-foreground"
      >
        <span className="tabular-nums">
          {tally.shots > 0
            ? `${tally.made}/${tally.shots} from the field`
            : 'No shots yet'}
        </span>
        <span className="flex items-center gap-3">
          {attempts >= 3 && phase === 'resting' ? (
            <button
              type="button"
              onClick={() => shoot()}
              className="underline underline-offset-4 hover:text-foreground"
            >
              Let a pro shoot
            </button>
          ) : null}
          {active ? (
            <button
              type="button"
              onClick={browse}
              className="underline underline-offset-4 hover:text-foreground"
            >
              {multiple ? 'Add files' : 'Change file'}
            </button>
          ) : null}
        </span>
      </div>

      {files.length > 0 ? (
        <ul data-slot="basketball-upload-list" className="mt-3 space-y-1.5">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center gap-2 rounded-lg border bg-background py-1.5 pl-3 pr-1.5 text-sm"
            >
              <Check
                className="size-4 shrink-0 text-emerald-600"
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1 truncate">{file.name}</span>
              <span className="shrink-0 text-xs text-muted-foreground">
                {formatBytes(file.size)}
              </span>
              <button
                type="button"
                aria-label={`Remove ${file.name}`}
                onClick={() => commit(files.filter((_, i) => i !== index))}
                className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={(event) => {
          add(Array.from(event.target.files ?? []))
          event.target.value = ''
        }}
      />
    </div>
  )
})
