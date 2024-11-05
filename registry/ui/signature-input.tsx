'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Eraser } from 'lucide-react'

type SignatureInputProps = {
  canvasRef: React.RefObject<HTMLCanvasElement>
  onSignatureChange: (signature: string | null) => void
}

export default function SignatureInput({
  canvasRef,
  onSignatureChange,
}: SignatureInputProps) {
  const [isDrawing, setIsDrawing] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.strokeStyle = 'black'
      }
    }
  }, [canvasRef])

  const startDrawing = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    setIsDrawing(true)
    draw(e)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    const canvas = canvasRef.current
    if (canvas) {
      const dataUrl = canvas.toDataURL()
      onSignatureChange(dataUrl) // Pass data URL to the form's onChange
    }
  }

  const draw = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (canvas && ctx) {
      const rect = canvas.getBoundingClientRect()
      const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left
      const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top

      ctx.lineTo(x, y)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(x, y)
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

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden relative">
      <canvas
        ref={canvasRef}
        width={400}
        height={200}
        className="w-full"
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
