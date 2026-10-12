'use client'

import * as React from 'react'
import { Check, Plus, Upload, X } from 'lucide-react'

import { cn } from '@/lib/utils'

const FILE_W = 46
const FILE_H = 58
// The goal mouth: left and width in % of the pitch, top and height in px.
const GOAL = { left: 24, width: 52, top: 140, height: 130 }
const GOAL_LINE = GOAL.top + GOAL.height

// Markings are projected from one camera, CAMERA yards behind the goal line.
// Depths are real (six-yard box, spot at 12, area at 18); widths are squeezed to fit.
const CAMERA = 96
const VANISH_Y = -330
const near = (depth: number) => CAMERA / (CAMERA - depth)
/** Screen y of a point on the grass `depth` yards out from the goal line. */
const groundY = (depth: number) =>
  VANISH_Y + (GOAL_LINE - VANISH_Y) * near(depth)
/** A box `half` wide (% of the pitch, at the goal line) and `depth` yards deep. */
const box = (half: number, depth: number) => {
  const y = (groundY(depth) - GOAL_LINE).toFixed(1)
  const reach = half * near(depth)
  return `M${50 - half} 0 ${(50 - reach).toFixed(1)} ${y}H${(50 + reach).toFixed(1)}L${50 + half} 0`
}
const AREA_H = groundY(18) - GOAL_LINE
const AREA_HALF = 40 // the six-yard box starts at the posts, the area well outside
const MARKINGS = `M${50 - AREA_HALF} 0H${50 + AREA_HALF}${box(GOAL.width / 2, 6)}${box(AREA_HALF, 18)}`
const MARK_Y = groundY(12) // the penalty spot
const MARK = { width: 96, height: 26 } // a circle on the grass, seen at this angle

const SPOT = { x: 50, y: MARK_Y - FILE_H / 2 + 6, scale: 1, turn: 0, ms: 450 }
const KEEPER_HOME = { x: 50, y: GOAL_LINE - 44, tilt: 0 }
const SWAY_MS = 650
const FLIGHT_MS = 420
const READ_CHANCE = 0.42 // how often the keeper dives the right way

export type PenaltyUploadHandle = {
  /** Takes a kick that scores; false if no file was ready. `miss` has it saved. */
  shoot: (options?: { miss?: boolean }) => boolean
  /** Puts files on the spot, as if the user had picked them. */
  add: (files: File[]) => void
}

export type PenaltyUploadProps = {
  /** Files that ended up in the back of the net. */
  value?: File[]
  onValueChange?: (files: File[]) => void
  /** Uploads a scored file. `report(0..1)` fills the goal; reject to rule it out. */
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

type Queued = { id: number; file: File }
type Mood = 'idle' | 'miss' | 'uploading' | 'done' | 'error'
type Tone = 'idle' | 'active' | 'miss' | 'done' | 'error'
type Outcome = 'goal' | 'saved' | 'wide' | 'over' | 'post' | 'bar'

const TONES: Record<
  Tone,
  { icon: typeof Upload; panel: string; chip: string }
> = {
  idle: { icon: Upload, panel: 'border-border', chip: 'bg-blue-600' },
  active: {
    icon: Upload,
    panel: 'border-blue-500 ring-4 ring-blue-500/10',
    chip: 'bg-blue-600',
  },
  miss: {
    icon: X,
    panel: 'border-orange-400 ring-4 ring-orange-400/15',
    chip: 'bg-orange-500',
  },
  done: {
    icon: Check,
    panel: 'border-emerald-500 ring-4 ring-emerald-500/15',
    chip: 'bg-emerald-600',
  },
  error: {
    icon: X,
    panel: 'border-red-500 ring-4 ring-red-500/15',
    chip: 'bg-red-600',
  },
}

const CALLS: Record<Exclude<Outcome, 'goal'>, [string[], string]> = {
  saved: [
    ['Saved!', 'Denied!', 'Not today'],
    'The keeper kept it out. Take it again.',
  ],
  wide: [['Wide!', 'Row Z'], 'That missed the goal. Take it again.'],
  over: [['Over the bar!', 'Into orbit'], 'Keep it down. Take it again.'],
  post: [['Off the post!'], 'So close. Take it again.'],
  bar: [['Off the bar!'], 'So close. Take it again.'],
}

/** Where a shot at (u, v) ends up: u runs 0..1 post to post, v 0..1 bar to ground. */
function judge(
  u: number,
  v: number,
): Exclude<Outcome, 'goal' | 'saved'> | 'target' {
  if (v < -0.05) return 'over'
  if (u < -0.02 || u > 1.02) return 'wide'
  if (u < 0.02 || u > 0.98) return 'post'
  if (v < 0.05) return 'bar'
  return 'target'
}

function Keeper({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 88" className={className} aria-hidden="true">
      {/* legs apart, socks, boots on the bottom edge (the goal line) */}
      <path
        d="M28 60 24 72M36 60l4 12"
        className="stroke-orange-200"
        strokeWidth={6.5}
        strokeLinecap="round"
      />
      <path
        d="M24 72 23 82M40 72l1 10"
        className="stroke-yellow-400"
        strokeWidth={6.5}
        strokeLinecap="round"
      />
      <path
        d="M21 76.5h5.5M38.5 76.5H44"
        className="stroke-yellow-600"
        strokeWidth={1.5}
      />
      <rect
        x={13}
        y={81}
        width={14}
        height={7}
        rx={3.5}
        className="fill-foreground"
      />
      <rect
        x={37}
        y={81}
        width={14}
        height={7}
        rx={3.5}
        className="fill-foreground"
      />
      <path
        d="M21 50h22l3 14H34l-2-6-2 6H18Z"
        className="fill-foreground/85"
        strokeLinejoin="round"
      />
      {/* bent arms, hands up */}
      <path
        d="M22 32 11 25 9 13M42 32l11-7 2-12"
        fill="none"
        className="stroke-yellow-400"
        strokeWidth={7.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 17.5h7.5M51 17.5h7.5"
        className="stroke-yellow-600"
        strokeWidth={1.5}
      />
      <rect
        x={2.75}
        y={0.75}
        width={13}
        height={15}
        rx={5.5}
        className="fill-background stroke-foreground/70"
        strokeWidth={1.5}
      />
      <rect
        x={48.25}
        y={0.75}
        width={13}
        height={15}
        rx={5.5}
        className="fill-background stroke-foreground/70"
        strokeWidth={1.5}
      />
      <path
        d="M6 5.5h6.5M51.5 5.5H58"
        className="stroke-foreground/40"
        strokeWidth={1}
        strokeLinecap="round"
      />
      {/* neck, jersey, collar, number */}
      <rect x={29.5} y={19} width={5} height={8} className="fill-orange-300" />
      <path
        d="M20 31q12-6 24 0l-1.5 22q-10.5 3-21 0Z"
        className="fill-yellow-400"
      />
      <path
        d="M27.5 27.5 32 32l4.5-4.5"
        fill="none"
        className="stroke-yellow-600"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x={32}
        y={47}
        textAnchor="middle"
        className="fill-yellow-950 text-[12px] font-bold"
      >
        1
      </text>
      {/* head */}
      <circle cx={32} cy={13} r={8} className="fill-orange-200" />
      <path
        d="M24 12.5a8 8 0 0 1 16 0c-3-3.5-13-3.5-16 0Z"
        className="fill-amber-900"
      />
      <circle cx={29} cy={14.5} r={0.9} className="fill-neutral-800" />
      <circle cx={35} cy={14.5} r={0.9} className="fill-neutral-800" />
      <path
        d="M30 17.8q2 1 4 0"
        fill="none"
        className="stroke-neutral-800"
        strokeWidth={0.8}
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

export const PenaltyUpload = React.forwardRef<
  PenaltyUploadHandle,
  PenaltyUploadProps
>(function PenaltyUpload(
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
  const pitchRef = React.useRef<HTMLDivElement>(null)
  const aimRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const netId = React.useId()

  const [queue, setQueue] = React.useState<Queued[]>([])
  const [inner, setInner] = React.useState<File[]>([])
  const [mood, setMood] = React.useState<Mood>('idle')
  const [notice, setNotice] = React.useState({ title: '', text: '' })
  const [progress, setProgress] = React.useState(0)
  const [stage, setStage] = React.useState<'ready' | 'flying' | 'net'>('ready')
  const [ball, setBall] = React.useState(SPOT)
  const [keeper, setKeeper] = React.useState(KEEPER_HOME)
  const [keeperGone, setKeeperGone] = React.useState(false)
  const [sway, setSway] = React.useState(1)
  const [dropping, setDropping] = React.useState(false)
  const [attempts, setAttempts] = React.useState(0)
  const [results, setResults] = React.useState<boolean[]>([])

  const files = value ?? inner
  const active = queue[0]

  const alive = React.useRef(true)
  const timers = React.useRef(new Set<ReturnType<typeof setTimeout>>())
  const moodTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined)
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
    stage,
    attempts,
    keeperGone,
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

  const respot = () => {
    setBall(SPOT)
    setKeeper(KEEPER_HOME)
    setStage('ready')
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
      setNotice({
        title: 'Ruled out by VAR',
        text:
          error instanceof Error && error.message
            ? error.message
            : 'The upload failed. Take it again.',
      })
      flash('error', 2600)
      respot()
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

  /** Kicks at (u, v) of the goal mouth; see judge(). */
  const kick = (u: number, v: number, rigged?: 'goal' | 'save') => {
    const { active: entry, stage, keeperGone, attempts } = latest.current
    if (!entry || stage !== 'ready' || disabled) return false
    latest.current.stage = 'flying' // a second click must not kick again
    if (!rigged) {
      // Nobody hits exactly what they aim at.
      u += (Math.random() - 0.5) * 0.07
      v += (Math.random() - 0.5) * 0.14
    }
    v = Math.min(v, 0.92)

    const landing = judge(u, v)
    const side = u < 0.36 ? -1 : u > 0.64 ? 1 : 0
    const elsewhere = [-1, 0, 1].filter((s) => s !== side)
    const readsIt = rigged ? rigged === 'save' : Math.random() < READ_CHANCE
    const dive = keeperGone
      ? null
      : readsIt
        ? side
        : elsewhere[Math.floor(Math.random() * elsewhere.length)]
    // Even a keeper who guesses right cannot reach the top corners.
    const topCorner = v < 0.26 && Math.abs(u - 0.5) > 0.34
    const outcome: Outcome =
      landing !== 'target'
        ? landing
        : dive === side && !topCorner
          ? 'saved'
          : 'goal'

    const x = GOAL.left + u * GOAL.width
    const y = GOAL.top + v * GOAL.height
    clearTimeout(moodTimer.current)
    setMood('idle')
    setStage('flying')
    setAttempts((n) => n + 1)
    setBall({ x, y, scale: 0.5, turn: 320, ms: FLIGHT_MS })

    if (dive !== null) {
      later(() => {
        if (dive === 0) {
          setKeeper({ ...KEEPER_HOME, y: KEEPER_HOME.y - (v < 0.4 ? 18 : 0) })
        } else if (dive === side) {
          setKeeper({ x: x - dive * 9, y: clamp(y, 168, 250), tilt: dive * 72 })
        } else {
          setKeeper({
            x: 50 + dive * GOAL.width * 0.3,
            y: 240,
            tilt: dive * 72,
          })
        }
      }, 70)
    }

    later(() => {
      setResults((list) => [...list, outcome === 'goal'])
      if (outcome === 'goal') {
        setStage('net')
        void upload(entry)
        return
      }
      const [titles, text] = CALLS[outcome]
      setNotice({ title: titles[attempts % titles.length], text })
      flash('miss', 1700)
      const inward = u < 0.5 ? 1 : -1
      const rebound = { y: 326, scale: 0.8, turn: 560, ms: 500 }
      setBall(
        {
          over: { x, y: -70, scale: 0.35, turn: 640, ms: 500 },
          wide: {
            x: x - inward * 34,
            y: y - 30,
            scale: 0.4,
            turn: 640,
            ms: 500,
          },
          saved: { ...rebound, x: x - inward * 12, y: 318 },
          post: { ...rebound, x: x + inward * 12 },
          bar: { ...rebound, x: x + inward * 12 },
        }[outcome],
      )
      later(respot, 1100)
    }, FLIGHT_MS)
    return true
  }

  const add = (incoming: File[]) => {
    const accepted: Queued[] = []
    for (const file of incoming) {
      const { accept, maxSize, mood } = latest.current
      const problem = !accepts(file, accept)
        ? 'is not a file type this goal takes.'
        : maxSize && file.size > maxSize
          ? `is over the ${formatBytes(maxSize)} limit.`
          : null
      if (!problem) {
        accepted.push({ id: nextId++, file })
      } else if (mood !== 'uploading' && mood !== 'done') {
        setNotice({
          title: 'Not in the squad',
          text: `${file.name} ${problem}`,
        })
        flash('error', 2600)
      }
    }
    if (accepted.length === 0) return
    const many = latest.current.multiple
    const inNet = latest.current.stage === 'net'
    setQueue((items) => {
      if (many) return [...items, ...accepted]
      // One file at a time: a new pick replaces the one still on the spot.
      return inNet && items.length > 0 ? [items[0], accepted[0]] : [accepted[0]]
    })
  }

  React.useImperativeHandle(ref, () => ({
    shoot: (options) =>
      options?.miss ? kick(0.78, 0.6, 'save') : kick(0.86, 0.22, 'goal'),
    add,
  }))

  React.useEffect(() => {
    alive.current = true
    const pending = timers.current
    return () => {
      alive.current = false
      pending.forEach(clearTimeout)
      pending.clear()
    }
  }, [])

  // A new file at the head of the queue goes on the spot, keeper back in goal.
  const activeId = active?.id
  React.useEffect(() => {
    respot()
    setKeeperGone(false)
    setAttempts(0)
  }, [activeId])

  // The keeper shuffles along the line while waiting.
  const waiting = stage === 'ready' && activeId !== undefined && !keeperGone
  React.useEffect(() => {
    if (!waiting) return
    const id = setInterval(() => setSway((s) => -s), SWAY_MS)
    return () => clearInterval(id)
  }, [waiting])

  const toPitch = (event: { clientX: number; clientY: number }) => {
    const pitch = pitchRef.current
    if (!pitch) return { x: 50, y: 0 }
    const box = pitch.getBoundingClientRect()
    return {
      x: ((event.clientX - box.left) / box.width) * 100,
      y: ((event.clientY - box.top) / box.height) * pitch.offsetHeight,
    }
  }

  const browse = () => inputRef.current?.click()

  const canKick = Boolean(active) && stage === 'ready' && !disabled
  const name = active?.file.name ?? 'The file'
  let heading = title
  let text =
    description ??
    (active ? 'Click a spot in the goal to shoot.' : 'Drop a file or pick one.')
  if (mood === 'miss' || mood === 'error') {
    heading = notice.title
    text = notice.text
  } else if (mood === 'uploading') {
    heading = 'GOAL!'
    text = `Uploading ${name}`
  } else if (mood === 'done') {
    heading = 'Back of the net'
    text =
      attempts > 1
        ? `${name} went in on kick ${attempts}.`
        : `${name} went in with the first kick.`
  } else if (dropping) {
    text = 'Drop it, then beat the keeper.'
  } else if (keeperGone && active) {
    text = 'The keeper went home. Open goal.'
  }

  const tone: Tone =
    mood === 'uploading' || (mood === 'idle' && dropping) ? 'active' : mood
  const Chip = TONES[tone].icon
  const filled = mood === 'uploading' ? progress : mood === 'done' ? 1 : 0
  const made = results.filter(Boolean).length
  const lastFive = results.slice(-5)
  const keeperX = keeperGone ? 124 : waiting ? 50 + sway * 5 : keeper.x

  return (
    <div
      data-slot="penalty-upload"
      className={cn(
        'w-full max-w-[400px]',
        disabled && 'pointer-events-none opacity-60',
        className,
      )}
    >
      <div
        ref={pitchRef}
        data-slot="penalty-upload-pitch"
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
          add(Array.from(event.dataTransfer.files))
        }}
      >
        <div className="absolute inset-x-0 top-4 mx-auto w-[304px] max-w-[calc(100%-2rem)] rounded-[22px] bg-muted p-1">
          <div
            className={cn(
              'flex items-center gap-3 rounded-[18px] border bg-background p-3 transition-[border-color,box-shadow] duration-200',
              TONES[tone].panel,
            )}
          >
            <div
              className={cn(
                'flex size-9 shrink-0 items-center justify-center rounded-[10px] text-white transition-colors duration-200',
                TONES[tone].chip,
              )}
            >
              <Chip className="size-4" strokeWidth={2.5} aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <div
                  className="truncate text-sm font-semibold leading-5"
                  aria-live="polite"
                >
                  {heading}
                </div>
                <div
                  className="flex shrink-0 gap-1"
                  role="img"
                  aria-label={`${made} of ${results.length} kicks scored`}
                >
                  {Array.from({ length: 5 }, (_, i) => (
                    <span
                      key={i}
                      className={cn(
                        'size-2 rounded-full transition-colors',
                        lastFive[i] === undefined
                          ? 'border border-muted-foreground/40'
                          : lastFive[i]
                            ? 'bg-emerald-500'
                            : 'bg-red-500',
                      )}
                    />
                  ))}
                </div>
              </div>
              <div
                className="truncate text-xs leading-4 text-muted-foreground"
                aria-live="polite"
              >
                {text}
                {mood === 'uploading' ? (
                  <span aria-hidden="true" className="tabular-nums">
                    {` · ${Math.round(progress * 100)}%`}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Goal: net, progress fill, then posts and bar on top. */}
        <div
          className="absolute"
          style={{
            left: `${GOAL.left}%`,
            width: `${GOAL.width}%`,
            top: GOAL.top,
            height: GOAL.height,
          }}
        >
          <svg
            className="absolute inset-0 size-full text-muted-foreground/30"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id={netId}
                width={13}
                height={13}
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M13 0H0V13"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1}
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${netId})`} />
          </svg>
          <div
            className={cn(
              'absolute inset-x-0 bottom-0 transition-[height,background-color] duration-150 ease-linear',
              mood === 'done' ? 'bg-emerald-500/25' : 'bg-blue-500/25',
            )}
            style={{ height: `${filled * 100}%` }}
          />
          <div
            className={cn(
              'absolute -inset-x-[5px] -top-[5px] bottom-0 rounded-t-lg border-[5px] border-b-0 transition-colors duration-200',
              mood === 'done' ? 'border-emerald-600' : 'border-foreground/75',
            )}
          />
        </div>

        {/* Goal line, six-yard box and penalty area. */}
        <svg
          viewBox={`0 0 100 ${AREA_H}`}
          preserveAspectRatio="none"
          className="absolute inset-x-0 w-full text-muted-foreground/40"
          style={{ top: GOAL_LINE, height: AREA_H }}
          aria-hidden="true"
        >
          <path
            d={MARKINGS}
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {active ? (
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-[100%] border border-muted-foreground/40"
            style={{ left: '50%', top: MARK_Y, ...MARK }}
            aria-hidden="true"
          />
        ) : null}

        <div
          className={cn(
            'pointer-events-none absolute z-10 h-[88px] w-16 ease-out motion-reduce:transition-none',
            waiting && 'ease-in-out',
            keeperGone ? 'opacity-0' : 'opacity-100',
          )}
          style={{
            left: `${keeperX}%`,
            top: keeper.y,
            transform: `translate(-50%, -50%) rotate(${keeper.tilt}deg)`,
            transitionProperty: 'left, top, transform, opacity',
            transitionDuration: `${waiting ? SWAY_MS : 360}ms`,
          }}
        >
          <Keeper className="size-full" />
        </div>

        {/* Where the pointer can aim: the goal plus room to miss. */}
        <div
          role="presentation"
          className={cn(
            'absolute inset-x-0 z-20',
            canKick ? 'cursor-crosshair' : 'pointer-events-none',
          )}
          style={{ top: GOAL.top - 28, height: GOAL.height + 46 }}
          onPointerMove={(event) => {
            const aim = aimRef.current
            if (!aim || event.pointerType === 'touch') return
            const point = toPitch(event)
            aim.style.left = `${point.x}%`
            aim.style.top = `${point.y}px`
            aim.style.opacity = '1'
          }}
          onPointerLeave={() => {
            if (aimRef.current) aimRef.current.style.opacity = '0'
          }}
          onClick={(event) => {
            const point = toPitch(event)
            if (aimRef.current) aimRef.current.style.opacity = '0'
            kick(
              (point.x - GOAL.left) / GOAL.width,
              (point.y - GOAL.top) / GOAL.height,
            )
          }}
        />
        <div
          ref={aimRef}
          className={cn(
            'pointer-events-none absolute z-20 flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-blue-600 opacity-0 transition-opacity duration-150',
            !canKick && 'hidden',
          )}
          aria-hidden="true"
        >
          <span className="size-1 rounded-full bg-blue-600" />
        </div>

        {active ? (
          <>
            <div
              className={cn(
                'pointer-events-none absolute h-2 w-11 -translate-x-1/2 rounded-[100%] bg-foreground/20 blur-[3px] transition-opacity duration-200',
                stage === 'ready' ? 'opacity-100' : 'opacity-0',
              )}
              style={{ left: `${SPOT.x}%`, top: SPOT.y + FILE_H / 2 - 4 }}
              aria-hidden="true"
            />
            <button
              key={active.id}
              type="button"
              disabled={disabled}
              aria-label={`Take the penalty with ${active.file.name}. Click a spot in the goal to aim, or press Enter to pick a corner at random.`}
              onClick={() =>
                kick(
                  Math.random() < 0.5 ? 0.14 : 0.86,
                  0.3 + Math.random() * 0.5,
                )
              }
              className="absolute z-30 rounded-md outline-offset-4 outline-blue-600 ease-out focus-visible:outline-2 motion-reduce:transition-none"
              style={{
                width: FILE_W,
                height: FILE_H,
                left: `${ball.x}%`,
                top: ball.y,
                transform: `translate(-50%, -50%) scale(${ball.scale}) rotate(${ball.turn}deg)`,
                transitionProperty: 'left, top, transform',
                transitionDuration: `${ball.ms}ms`,
              }}
            >
              <FileIcon
                name={active.file.name}
                className={cn(
                  'transition-[scale,opacity] duration-500',
                  mood === 'done' && 'scale-50 opacity-0',
                )}
              />
            </button>
            <div
              className={cn(
                'pointer-events-none absolute inset-x-0 mx-auto w-[160px] text-center transition-opacity duration-200',
                stage === 'ready' ? 'opacity-100' : 'opacity-0',
              )}
              style={{ top: GOAL_LINE + AREA_H + 3 }}
            >
              <div className="truncate text-xs font-medium">
                {active.file.name}
              </div>
              <div className="text-[10px] text-muted-foreground">
                {formatBytes(active.file.size)}
                {queue.length > 1 ? ` · ${queue.length - 1} more waiting` : ''}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* The picker is the penalty spot itself, with the + on its centre. */}
            <button
              type="button"
              onClick={browse}
              disabled={disabled}
              aria-label="Pick a file"
              className="group/spot absolute flex h-12 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[100%] text-muted-foreground outline-offset-2 outline-blue-600 transition-colors hover:text-foreground focus-visible:outline-2"
              style={{ left: '50%', top: MARK_Y }}
            >
              <span
                className="flex items-center justify-center rounded-[100%] border border-dashed border-muted-foreground/60 transition-colors group-hover/spot:border-foreground/70"
                style={MARK}
              >
                <Plus className="size-4" aria-hidden="true" />
              </span>
            </button>
            <div
              className="pointer-events-none absolute inset-x-0 text-center text-xs font-medium leading-4 text-muted-foreground"
              style={{ top: GOAL_LINE + AREA_H + 6 }}
            >
              Pick a file
            </div>
          </>
        )}
      </div>

      <div
        data-slot="penalty-upload-footer"
        className="flex items-center justify-between gap-3 px-1 text-xs text-muted-foreground"
      >
        <span className="tabular-nums">
          {results.length > 0
            ? `${made}/${results.length} scored`
            : 'No kicks yet'}
        </span>
        <span className="flex items-center gap-3">
          {attempts >= 3 && canKick && !keeperGone ? (
            <button
              type="button"
              onClick={() => setKeeperGone(true)}
              className="underline underline-offset-4 hover:text-foreground"
            >
              Send the keeper home
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
        <ul data-slot="penalty-upload-list" className="mt-3 space-y-1.5">
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
