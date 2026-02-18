'use client'

import * as React from 'react'
import { Pipette } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type PickerFormat = 'hex' | 'rgb' | 'hsl'

type Rgb = { r: number; g: number; b: number }
type Hsv = { h: number; s: number; v: number }

type ColorPickerProps = {
  value?: string
  onChange?: (value: string) => void
  swatches?: string[]
}

type EyeDropperAPI = {
  open: () => Promise<{ sRGBHex: string }>
}

declare global {
  interface Window {
    EyeDropper?: new () => EyeDropperAPI
  }
}

const DEFAULT_SWATCHES = [
  '#000000',
  '#6b7280',
  '#d1d5db',
  '#93c5fd',
  '#818cf8',
  '#ec4899',
]

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

const round = (value: number, digits = 0) => {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

function parseHex(hex: string): { rgb: Rgb; a: number } | null {
  const raw = hex.trim().replace('#', '')

  if (!/^[0-9A-Fa-f]{3,4}$|^[0-9A-Fa-f]{6}$|^[0-9A-Fa-f]{8}$/.test(raw)) {
    return null
  }

  const normalized =
    raw.length <= 4
      ? raw
          .split('')
          .map((char) => `${char}${char}`)
          .join('')
      : raw

  const hasAlpha = normalized.length === 8
  const r = Number.parseInt(normalized.slice(0, 2), 16)
  const g = Number.parseInt(normalized.slice(2, 4), 16)
  const b = Number.parseInt(normalized.slice(4, 6), 16)
  const a = hasAlpha ? Number.parseInt(normalized.slice(6, 8), 16) / 255 : 1

  return { rgb: { r, g, b }, a }
}

function rgbToHex(rgb: Rgb, alpha = 1) {
  const base = [rgb.r, rgb.g, rgb.b]
    .map((value) => clamp(Math.round(value), 0, 255).toString(16).padStart(2, '0'))
    .join('')

  if (alpha >= 1) return `#${base}`

  const a = clamp(Math.round(alpha * 255), 0, 255)
    .toString(16)
    .padStart(2, '0')

  return `#${base}${a}`
}

function rgbToHsv({ r, g, b }: Rgb): Hsv {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const diff = max - min

  let h = 0
  if (diff !== 0) {
    if (max === rn) h = ((gn - bn) / diff) % 6
    else if (max === gn) h = (bn - rn) / diff + 2
    else h = (rn - gn) / diff + 4
  }

  h = Math.round(h * 60)
  if (h < 0) h += 360

  const s = max === 0 ? 0 : diff / max
  const v = max

  return { h, s: round(s * 100, 1), v: round(v * 100, 1) }
}

function hsvToRgb({ h, s, v }: Hsv): Rgb {
  const hue = ((h % 360) + 360) % 360
  const sat = clamp(s, 0, 100) / 100
  const val = clamp(v, 0, 100) / 100

  const c = val * sat
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1))
  const m = val - c

  let r = 0
  let g = 0
  let b = 0

  if (hue < 60) {
    r = c
    g = x
  } else if (hue < 120) {
    r = x
    g = c
  } else if (hue < 180) {
    g = c
    b = x
  } else if (hue < 240) {
    g = x
    b = c
  } else if (hue < 300) {
    r = x
    b = c
  } else {
    r = c
    b = x
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  }
}

function rgbToHsl({ r, g, b }: Rgb) {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  const d = max - min

  let h = 0
  let s = 0

  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1))

    switch (max) {
      case rn:
        h = ((gn - bn) / d) % 6
        break
      case gn:
        h = (bn - rn) / d + 2
        break
      default:
        h = (rn - gn) / d + 4
        break
    }

    h *= 60
    if (h < 0) h += 360
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

function hueToRgb(p: number, q: number, t: number) {
  let tt = t
  if (tt < 0) tt += 1
  if (tt > 1) tt -= 1
  if (tt < 1 / 6) return p + (q - p) * 6 * tt
  if (tt < 1 / 2) return q
  if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6
  return p
}

function hslToRgb(h: number, s: number, l: number): Rgb {
  const hn = (((h % 360) + 360) % 360) / 360
  const sn = clamp(s, 0, 100) / 100
  const ln = clamp(l, 0, 100) / 100

  if (sn === 0) {
    const value = Math.round(ln * 255)
    return { r: value, g: value, b: value }
  }

  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn
  const p = 2 * ln - q

  return {
    r: Math.round(hueToRgb(p, q, hn + 1 / 3) * 255),
    g: Math.round(hueToRgb(p, q, hn) * 255),
    b: Math.round(hueToRgb(p, q, hn - 1 / 3) * 255),
  }
}

function toRgbaString(rgb: Rgb, alpha: number) {
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${round(alpha, 2)})`
}

export function ColorPicker({
  value = '#7c3aed',
  onChange,
  swatches = DEFAULT_SWATCHES,
}: ColorPickerProps) {
  const parsed = parseHex(value) ?? { rgb: { r: 124, g: 58, b: 237 }, a: 1 }
  const [hsv, setHsv] = React.useState<Hsv>(() => rgbToHsv(parsed.rgb))
  const [alpha, setAlpha] = React.useState(parsed.a)
  const [format, setFormat] = React.useState<PickerFormat>('hex')

  React.useEffect(() => {
    const next = parseHex(value)
    if (!next) return

    setHsv(rgbToHsv(next.rgb))
    setAlpha(next.a)
  }, [value])

  const rgb = hsvToRgb(hsv)
  const hsl = rgbToHsl(rgb)
  const hex = rgbToHex(rgb, alpha)

  const emit = React.useCallback(
    (nextHsv: Hsv, nextAlpha: number) => {
      const nextRgb = hsvToRgb(nextHsv)
      onChange?.(rgbToHex(nextRgb, nextAlpha))
    },
    [onChange],
  )

  const updatePlane = (clientX: number, clientY: number, el: HTMLElement) => {
    const rect = el.getBoundingClientRect()
    const s = clamp(((clientX - rect.left) / rect.width) * 100, 0, 100)
    const v = clamp(100 - ((clientY - rect.top) / rect.height) * 100, 0, 100)

    const next = { ...hsv, s: round(s, 1), v: round(v, 1) }
    setHsv(next)
    emit(next, alpha)
  }

  const handlePlanePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const target = event.currentTarget
    target.setPointerCapture(event.pointerId)
    updatePlane(event.clientX, event.clientY, target)
  }

  const handlePlanePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if ((event.buttons & 1) !== 1) return
    updatePlane(event.clientX, event.clientY, event.currentTarget)
  }

  const pickFromScreen = async () => {
    if (typeof window === 'undefined' || !window.EyeDropper) return

    const eyeDropper = new window.EyeDropper()
    try {
      const result = await eyeDropper.open()
      const parsedColor = parseHex(result.sRGBHex)
      if (!parsedColor) return

      const nextHsv = rgbToHsv(parsedColor.rgb)
      setHsv(nextHsv)
      setAlpha(1)
      emit(nextHsv, 1)
    } catch {
      // User cancelled eyedropper.
    }
  }

  const checkerboard = {
    backgroundImage:
      'linear-gradient(45deg, #d4d4d8 25%, transparent 25%), linear-gradient(-45deg, #d4d4d8 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #d4d4d8 75%), linear-gradient(-45deg, transparent 75%, #d4d4d8 75%)',
    backgroundSize: '10px 10px',
    backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px',
  } as const

  return (
    <div className="w-full max-w-[320px] space-y-3 rounded-xl border bg-background p-3 shadow-sm">
      <div className="relative h-56 w-full overflow-hidden rounded-lg border" style={checkerboard}>
        <div
          className="absolute inset-0"
          style={{ backgroundColor: `hsl(${hsv.h} 100% 50%)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />

        <div
          className="absolute inset-0 cursor-crosshair touch-none"
          onPointerDown={handlePlanePointerDown}
          onPointerMove={handlePlanePointerMove}
        >
          <div
            className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
            style={{
              left: `${hsv.s}%`,
              top: `${100 - hsv.v}%`,
              backgroundColor: toRgbaString(rgb, alpha),
            }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="relative h-4 overflow-hidden rounded-full border" style={checkerboard}>
          <input
            type="range"
            min={0}
            max={360}
            value={hsv.h}
            onChange={(event) => {
              const h = Number(event.target.value)
              const next = { ...hsv, h }
              setHsv(next)
              emit(next, alpha)
            }}
            className="figma-range absolute inset-0 m-0 h-full w-full cursor-pointer appearance-none rounded-full p-0"
            style={{
              background:
                'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
            }}
          />
        </div>

        <div className="relative h-4 overflow-hidden rounded-full border" style={checkerboard}>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(alpha * 100)}
            onChange={(event) => {
              const nextAlpha = Number(event.target.value) / 100
              setAlpha(nextAlpha)
              emit(hsv, nextAlpha)
            }}
            className="figma-range absolute inset-0 m-0 h-full w-full cursor-pointer appearance-none rounded-full p-0"
            style={{
              background: `linear-gradient(to right, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0), rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1))`,
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={pickFromScreen}
          disabled={typeof window === 'undefined' || !window.EyeDropper}
          title="Eyedropper"
        >
          <Pipette className="h-4 w-4" />
        </Button>

        <Input
          value={format === 'hex' ? hex.toUpperCase() : format === 'rgb' ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : `${hsl.h}, ${hsl.s}%, ${hsl.l}%`}
          onChange={(event) => {
            const raw = event.target.value.trim()

            if (format === 'hex') {
              const parsedHex = parseHex(raw)
              if (!parsedHex) return
              const next = rgbToHsv(parsedHex.rgb)
              setHsv(next)
              setAlpha(parsedHex.a)
              emit(next, parsedHex.a)
              return
            }

            if (format === 'rgb') {
              const parts = raw.split(',').map((part) => Number(part.trim()))
              if (parts.length !== 3 || parts.some((value) => Number.isNaN(value))) return
              const nextRgb = {
                r: clamp(parts[0], 0, 255),
                g: clamp(parts[1], 0, 255),
                b: clamp(parts[2], 0, 255),
              }
              const next = rgbToHsv(nextRgb)
              setHsv(next)
              emit(next, alpha)
              return
            }

            const parts = raw
              .replaceAll('%', '')
              .split(',')
              .map((part) => Number(part.trim()))
            if (parts.length !== 3 || parts.some((value) => Number.isNaN(value))) return

            const nextRgb = hslToRgb(parts[0], parts[1], parts[2])
            const next = rgbToHsv(nextRgb)
            setHsv(next)
            emit(next, alpha)
          }}
        />

        <Select value={format} onValueChange={(value) => setFormat(value as PickerFormat)}>
          <SelectTrigger className="w-[78px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hex">Hex</SelectItem>
            <SelectItem value="rgb">RGB</SelectItem>
            <SelectItem value="hsl">HSL</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-2">
        {swatches.map((swatch) => (
          <button
            key={swatch}
            type="button"
            className="h-6 w-6 rounded-md border"
            style={{ backgroundColor: swatch }}
            onClick={() => {
              const parsedSwatch = parseHex(swatch)
              if (!parsedSwatch) return
              const next = rgbToHsv(parsedSwatch.rgb)
              setHsv(next)
              setAlpha(parsedSwatch.a)
              emit(next, parsedSwatch.a)
            }}
            aria-label={`Select ${swatch}`}
          />
        ))}
      </div>

      <style jsx global>{`
        .figma-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 9999px;
          border: 2px solid #ffffff;
          background: #2563eb;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
          margin-top: -2px;
        }
        .figma-range::-webkit-slider-runnable-track {
          height: 100%;
          border-radius: 9999px;
        }
        .figma-range::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 9999px;
          border: 2px solid #ffffff;
          background: #2563eb;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
        }
        .figma-range::-moz-range-track {
          height: 100%;
          border-radius: 9999px;
        }
      `}</style>
    </div>
  )
}
