'use client'

import * as React from 'react'
import { ImagePlus, Upload } from 'lucide-react'

import { Button } from '@/components/ui/button'

type ImageUploadDropzoneProps = {
  value?: string | null
  onChange?: (value: string | null) => void
}

function cropCenterSquare(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const side = Math.min(img.width, img.height)
      const sx = (img.width - side) / 2
      const sy = (img.height - side) / 2
      const canvas = document.createElement('canvas')
      canvas.width = side
      canvas.height = side
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        reject(new Error('Unable to crop image'))
        return
      }

      ctx.drawImage(img, sx, sy, side, side, 0, 0, side, side)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = dataUrl
  })
}

export function ImageUploadDropzone({ value, onChange }: ImageUploadDropzoneProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const [preview, setPreview] = React.useState<string | null>(value ?? null)
  const [progress, setProgress] = React.useState(0)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    setPreview(value ?? null)
  }, [value])

  const readFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      const data = reader.result as string
      setPreview(data)
      onChange?.(data)

      setProgress(0)
      const timer = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            window.clearInterval(timer)
            return 100
          }
          return prev + 20
        })
      }, 120)
    }
    reader.readAsDataURL(file)
  }

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    readFile(file)
  }

  return (
    <div className="space-y-3">
      <div
        className={`rounded-lg border-2 border-dashed p-6 text-center ${isDragging ? 'border-primary bg-muted' : 'border-muted-foreground/30'}`}
        onDragOver={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setIsDragging(false)
          handleFiles(event.dataTransfer.files)
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => handleFiles(event.target.files)}
        />
        <div className="mb-2 flex justify-center">
          <ImagePlus className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">Drop image here or click to upload</p>
        <Button type="button" variant="outline" className="mt-3" onClick={() => inputRef.current?.click()}>
          <Upload className="mr-2 h-4 w-4" />
          Choose Image
        </Button>
      </div>

      {progress > 0 && progress < 100 ? (
        <div className="rounded border p-2 text-sm">Uploading... {progress}%</div>
      ) : null}

      {preview ? (
        <div className="space-y-2 rounded border p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Preview" className="max-h-56 w-full rounded object-contain" />
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                const cropped = await cropCenterSquare(preview)
                setPreview(cropped)
                onChange?.(cropped)
              }}
            >
              Crop Center Square
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                setPreview(null)
                setProgress(0)
                onChange?.(null)
              }}
            >
              Remove
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
