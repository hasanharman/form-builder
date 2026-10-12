'use client'

import * as React from 'react'

import { sampleFile, useSampleFile } from '@/components/funny/use-sample-file'
import type { BasketballUploadHandle } from '@/components/ui/basketball-upload'

const STAGE_W = 400
const STAGE_H = 440

type GameHandle = BasketballUploadHandle

type Game = React.ComponentType<{
  ref?: React.Ref<GameHandle>
  value?: File[]
  onValueChange?: (files: File[]) => void
}>

/** A funny upload scaled to its card that plays itself (miss, then make) while `playing`. */
export function UploadTeaser({
  game: Game,
  playing,
}: {
  game: Game
  playing: boolean
}) {
  const frame = React.useRef<HTMLDivElement>(null)
  const handle = React.useRef<GameHandle>(null)
  const shots = React.useRef(0)
  const [scale, setScale] = React.useState(0.5)

  React.useEffect(() => {
    const el = frame.current
    if (!el) return
    const fit = () =>
      setScale(
        Math.min(el.clientWidth / STAGE_W, el.clientHeight / STAGE_H) * 0.94,
      )
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useSampleFile(handle)

  // shoot() is a no-op until the file is ready again, so a steady timer is enough.
  React.useEffect(() => {
    if (!playing) return
    const shoot = () => {
      const taken = handle.current?.shoot({ miss: shots.current % 2 === 0 })
      if (taken) shots.current++
    }
    shoot()
    const id = setInterval(shoot, 900)
    return () => clearInterval(id)
  }, [playing])

  return (
    <div ref={frame} className="absolute inset-0 overflow-hidden" inert>
      <div
        className="absolute left-1/2 top-1/2 [&_[data-slot$=-footer]]:hidden"
        style={{
          width: STAGE_W,
          height: STAGE_H,
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
      >
        <Game
          ref={handle}
          value={[]}
          onValueChange={() => handle.current?.add([sampleFile()])}
        />
      </div>
    </div>
  )
}
