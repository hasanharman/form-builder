'use client'

import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Eraser } from 'lucide-react'

type SignatureInputProps = {
  canvasRef?: React.RefObject<HTMLCanvasElement | null>
  onSignatureChange: (signature: string | null) => void
}

const disableTouchScroll = (canvas: HTMLCanvasElement) => {
  const preventScroll = (e: TouchEvent) => {
    e.preventDefault() // Disable scroll
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

export default function SignatureInput({
  canvasRef: externalCanvasRef,
  onSignatureChange,
}: SignatureInputProps) {
  const internalCanvasRef = useRef<HTMLCanvasElement>(null)
  const canvasRef = externalCanvasRef ?? internalCanvasRef
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastPosition, setLastPosition] = useState<{
    x: number
    y: number
  } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Setup canvas context
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
    }

    const updateStrokeColor = () => {
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const isDarkClass = document.documentElement.classList.contains('dark')
      const isLightClass = document.documentElement.classList.contains('light')

      const systemPrefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches

      const isDarkMode = isDarkClass || (!isLightClass && systemPrefersDark)

      ctx.strokeStyle = isDarkMode ? '#ffffff' : '#000000'
    }

    updateStrokeColor()

    // Disable touch scrolling while drawing
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
  }, [canvasRef])

  const startDrawing = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    e.preventDefault()
    setIsDrawing(true)
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
      const dataUrl = canvas.toDataURL()
      onSignatureChange(dataUrl) // Pass data URL to the form's onChange
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
      const rect = canvas.getBoundingClientRect()
      const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left
      const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top

      if (lastPosition) {
        const midX = (lastPosition.x + x) / 2
        const midY = (lastPosition.y + y) / 2

        ctx.beginPath()
        ctx.moveTo(lastPosition.x, lastPosition.y)
        ctx.quadraticCurveTo(midX, midY, x, y) // Smooth transition
        ctx.stroke()
      } else {
        // For the first point, simply move to the position without a stroke
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
      onSignatureChange(null) // Clear signature in the form as well
    }
  }

  // Callback ref to sync both internal and external refs
  const setCanvasRef = (element: HTMLCanvasElement | null) => {
    // Update internal ref
    ;(
      internalCanvasRef as React.MutableRefObject<HTMLCanvasElement | null>
    ).current = element
    // Update external ref if provided
    if (externalCanvasRef) {
      ;(
        externalCanvasRef as React.MutableRefObject<HTMLCanvasElement | null>
      ).current = element
    }
  }

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden relative w-[400px] h-[200px]">
      <canvas
        ref={setCanvasRef}
        width={400}
        height={200}
        className="w-full h-full"
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
        className="absolute left-1 bottom-1 z-10 rounded-full"
        onClick={clearSignature}
      >
        <Eraser className="w-4 h-4 text-muted-foreground hover:text-primary" />
      </Button>
    </div>
  )
}
