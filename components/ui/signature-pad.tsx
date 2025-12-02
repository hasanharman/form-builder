'use client'

import * as React from 'react'
import { useEffect, useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
// Progress is now inline in the button
import { cn } from '@/lib/utils'
import { Eraser, Pen, Check, Pencil, RotateCcw } from 'lucide-react'

type SignaturePadProps = {
  value?: string | null
  onChange: (signature: string | null) => void
  disabled?: boolean
  className?: string
  holdToSignDuration?: number // Duration in ms to hold for confirming signature
}

const CANVAS_WIDTH = 400
const CANVAS_HEIGHT = 200
const DEFAULT_HOLD_DURATION = 1500 // 1.5 seconds

const disableTouchScroll = (canvas: HTMLCanvasElement) => {
  const preventScroll = (e: TouchEvent) => {
    e.preventDefault()
  }

  canvas.addEventListener('touchstart', preventScroll, { passive: false })
  canvas.addEventListener('touchmove', preventScroll, { passive: false })
  canvas.addEventListener('touchend', preventScroll, { passive: false })

  return () => {
    canvas.removeEventListener('touchstart', preventScroll)
    canvas.removeEventListener('touchmove', preventScroll)
    canvas.removeEventListener('touchend', preventScroll)
  }
}

export default function SignaturePad({
  value,
  onChange,
  disabled = false,
  className,
  holdToSignDuration = DEFAULT_HOLD_DURATION,
}: SignaturePadProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastPosition, setLastPosition] = useState<{
    x: number
    y: number
  } | null>(null)
  const [hasDrawn, setHasDrawn] = useState(false)
  const [holdProgress, setHoldProgress] = useState(0)
  const [isHolding, setIsHolding] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null)
  const holdStartRef = useRef<number | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  // Helper function to get the correct stroke color based on theme
  const getStrokeColor = () => {
    const isDarkClass = document.documentElement.classList.contains('dark')
    const isLightClass = document.documentElement.classList.contains('light')
    const systemPrefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches

    const isDarkMode = isDarkClass || (!isLightClass && systemPrefersDark)
    return isDarkMode ? '#ffffff' : '#000000'
  }

  // Setup canvas when dialog opens
  useEffect(() => {
    if (!isDialogOpen) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.strokeStyle = getStrokeColor()
    }

    const updateStrokeColor = () => {
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.strokeStyle = getStrokeColor()
    }

    const cleanupTouchScroll = disableTouchScroll(canvas)

    const observer = new MutationObserver(updateStrokeColor)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', updateStrokeColor)

    return () => {
      cleanupTouchScroll()
      observer.disconnect()
      mediaQuery.removeEventListener('change', updateStrokeColor)
    }
  }, [isDialogOpen])

  // Reset canvas state when dialog opens
  useEffect(() => {
    if (isDialogOpen) {
      setHasDrawn(false)
      setHoldProgress(0)
      setIsHolding(false)
      // Clear canvas on open
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }
  }, [isDialogOpen])

  const startDrawing = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    e.preventDefault()
    setIsDrawing(true)
    setHasDrawn(true)
    draw(e)
  }

  const stopDrawing = () => {
    if (!isDrawing) return
    setIsDrawing(false)
    setLastPosition(null)
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (canvas && ctx) {
      ctx.beginPath()
    }
  }

  const draw = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    e.preventDefault()
    if (!isDrawing) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (canvas && ctx) {
      // Ensure correct stroke color before drawing
      ctx.strokeStyle = getStrokeColor()
      
      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height
      const x =
        (('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left) *
        scaleX
      const y =
        (('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top) *
        scaleY

      if (lastPosition) {
        const midX = (lastPosition.x + x) / 2
        const midY = (lastPosition.y + y) / 2

        ctx.beginPath()
        ctx.moveTo(lastPosition.x, lastPosition.y)
        ctx.quadraticCurveTo(midX, midY, x, y)
        ctx.stroke()
      } else {
        ctx.beginPath()
        ctx.moveTo(x, y)
      }

      setLastPosition({ x, y })
    }
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      setHasDrawn(false)
      setHoldProgress(0)
    }
  }

  const updateHoldProgress = useCallback(() => {
    if (!holdStartRef.current) return

    const elapsed = Date.now() - holdStartRef.current
    const progress = Math.min((elapsed / holdToSignDuration) * 100, 100)
    setHoldProgress(progress)

    if (progress < 100) {
      animationFrameRef.current = requestAnimationFrame(updateHoldProgress)
    }
  }, [holdToSignDuration])

  const handleHoldStart = useCallback(
    (e: React.PointerEvent) => {
      if (!hasDrawn) return

      e.preventDefault()
      setIsHolding(true)
      holdStartRef.current = Date.now()
      setHoldProgress(0)

      // Start progress animation
      animationFrameRef.current = requestAnimationFrame(updateHoldProgress)

      // Set timer for completion
      holdTimerRef.current = setTimeout(() => {
        const canvas = canvasRef.current
        if (canvas) {
          const dataUrl = canvas.toDataURL('image/png')
          onChange(dataUrl)
          setIsDialogOpen(false)
        }
        setIsHolding(false)
        setHoldProgress(0)
      }, holdToSignDuration)
    },
    [hasDrawn, holdToSignDuration, onChange, updateHoldProgress],
  )

  const handleHoldEnd = useCallback(() => {
    setIsHolding(false)
    holdStartRef.current = null

    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current)
      holdTimerRef.current = null
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    setHoldProgress(0)
  }, [])

  const handleClearValue = () => {
    onChange(null)
  }

  const handleReset = () => {
    onChange(null)
    setIsDialogOpen(false)
  }

  const handleEditSignature = () => {
    setIsDialogOpen(true)
  }

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current)
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  // If we have a signature value, show the signature image
  if (value) {
    return (
      <div
        className={cn(
          'relative inline-flex items-center justify-start mt-2',
          className,
        )}
      >
        <div className="relative border border-input rounded-md overflow-hidden bg-white dark:bg-zinc-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Signature"
            className="w-[200px] h-[100px] object-contain"
          />
          <div className="absolute bottom-1 right-1 flex gap-1">
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="h-7 w-7 rounded-full bg-background/80 backdrop-blur-sm"
              onClick={handleEditSignature}
              disabled={disabled}
            >
              <Pencil className="w-3 h-3 text-muted-foreground hover:text-primary" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="h-7 w-7 rounded-full bg-background/80 backdrop-blur-sm"
              onClick={handleClearValue}
              disabled={disabled}
            >
              <Eraser className="w-3 h-3 text-muted-foreground hover:text-primary" />
            </Button>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Pen className="w-4 h-4" />
                Draw Signature
              </DialogTitle>
              <DialogDescription>
                Draw your signature below, then hold the confirm button to sign.
              </DialogDescription>
            </DialogHeader>

            <div className="border border-input rounded-md overflow-hidden relative bg-background">
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="w-full h-[200px] cursor-crosshair touch-none"
                onMouseDown={startDrawing}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
                onMouseMove={draw}
                onTouchStart={startDrawing}
                onTouchEnd={stopDrawing}
                onTouchMove={draw}
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="absolute left-2 bottom-2 rounded-full h-8 w-8"
                onClick={clearSignature}
              >
                <Eraser className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>

            <DialogFooter className="flex-row gap-2 sm:flex-row">
              <Button
                type="button"
                variant="destructive"
                className="flex-shrink-0"
                onClick={handleReset}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button
                type="button"
                className={cn(
                  'flex-1 relative overflow-hidden transition-all border-2 border-transparent',
                  hasDrawn
                    ? 'bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300'
                    : 'bg-muted text-muted-foreground cursor-not-allowed',
                )}
                disabled={!hasDrawn}
                onPointerDown={handleHoldStart}
                onPointerUp={handleHoldEnd}
                onPointerLeave={handleHoldEnd}
                onPointerCancel={handleHoldEnd}
              >
                {/* Progress fill background */}
                <span
                  className="absolute left-0 top-0 bottom-0 bg-emerald-500 transition-none"
                  style={{ width: `${holdProgress}%` }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  <Check className={cn('w-4 h-4', isHolding && 'animate-pulse')} />
                  {isHolding ? 'Keep holding...' : 'Hold to confirm'}
                </span>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // Initial state: show pen button
  return (
    <div className={cn('inline-flex mt-2', className)}>
      <Button
        type="button"
        size="icon"
        variant="outline"
        className="rounded-full"
        onClick={() => setIsDialogOpen(true)}
        disabled={disabled}
      >
        <Pen className="w-4 h-4" />
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pen className="w-4 h-4" />
              Draw Signature
            </DialogTitle>
            <DialogDescription>
              Draw your signature below, then hold the confirm button to sign.
            </DialogDescription>
          </DialogHeader>

          <div className="border border-input rounded-md overflow-hidden relative bg-background">
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="w-full h-[200px] cursor-crosshair touch-none"
              onMouseDown={startDrawing}
              onMouseUp={stopDrawing}
              onMouseOut={stopDrawing}
              onMouseMove={draw}
              onTouchStart={startDrawing}
              onTouchEnd={stopDrawing}
              onTouchMove={draw}
            />
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="absolute left-2 bottom-2 rounded-full h-8 w-8"
              onClick={clearSignature}
            >
              <Eraser className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>

          <DialogFooter className="flex-row gap-2 sm:flex-row">
            <Button
              type="button"
              className={cn(
                'flex-1 relative overflow-hidden transition-all border-2 border-transparent',
                hasDrawn
                  ? 'bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300'
                  : 'bg-muted text-muted-foreground cursor-not-allowed',
              )}
              disabled={!hasDrawn}
              onPointerDown={handleHoldStart}
              onPointerUp={handleHoldEnd}
              onPointerLeave={handleHoldEnd}
              onPointerCancel={handleHoldEnd}
            >
              {/* Progress fill background */}
              <span
                className="absolute left-0 top-0 bottom-0 bg-emerald-500 transition-none"
                style={{ width: `${holdProgress}%` }}
              />
              <span className="relative z-10 flex items-center gap-2">
                <Check className={cn('w-4 h-4', isHolding && 'animate-pulse')} />
                {isHolding ? 'Keep holding...' : 'Hold to confirm'}
              </span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
