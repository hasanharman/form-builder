import { useRef } from 'react'
import { Link } from 'next-view-transitions'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import Code from '@/components/code'
import SignatureInput from '@/components/ui/signature-input'
import { SignatureForm } from '@/components/components/signature-form'

const code = `<SignatureInput
  canvasRef={canvasRef}
  onSignatureChange={field.onChange}
/>`

const installationCode = `npx shadcn@latest add https://www.shadcn-form.com/registry/signature-input.json`

const installationManuel = `'use client'

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
`
const usageCode1 = `'use client'

import SignatureInput from '@/components/ui/signature-input'`
const usageCode2 = `<SignatureInput
  canvasRef={canvasRef}
  onSignatureChange={field.onChange}
/>`
const formCode = ``

export default function Component() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="text-xl font-semibold capitalize">Signature Input</h1>
        <p className="text-md text-muted-foreground">
          Signature form element that saves canvas area as PNG image
        </p>
      </div>

      <Tabs defaultValue="preview">
        <TabsList className="grid w-fit grid-cols-2">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="Code">Code</TabsTrigger>
        </TabsList>
        <TabsContent value="preview">
          <Card className="flex justify-center items-center h-[300px]">
            <SignatureInput
              canvasRef={canvasRef}
              onSignatureChange={() => console.log('Signed')}
            />
          </Card>
        </TabsContent>
        <TabsContent value="Code">
          <Card>
            <Code code={code} />
          </Card>
        </TabsContent>
      </Tabs>
      {/* Installation */}
      <div className="space-y-3">
        <h1 className="text-xl font-semibold capitalize">Installation</h1>
        <Tabs defaultValue="cli">
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="cli">CLI</TabsTrigger>
            <TabsTrigger value="manual">Manual</TabsTrigger>
          </TabsList>
          <TabsContent value="cli">
            <Code code={installationCode} />
          </TabsContent>
          <TabsContent value="manual">
            <div className="p-6 sm:p-10">
              <div className="after:absolute after:inset-y-0 after:w-px after:bg-gray-500/20 relative pl-5  after:left-0 grid gap-10 dark:after:bg-gray-400/20">
                <div className="grid gap-1 text-sm relative">
                  <div className="flex justify-center items-center aspect-square w-6 h-6 bg-gray-200 rounded-full absolute left-0 translate-x-[-31.5px] z-10 top-0 dark:bg-gray-50">
                    1
                  </div>
                  <div className="text-lg font-bold">
                    Copy and paste the following code into your project.
                  </div>

                  <Code code={installationManuel} customStyle="h-[300px]" />
                </div>
                <div className="grid gap-1 text-sm relative">
                  <div className="flex justify-center items-center aspect-square w-6 h-6 bg-gray-200 rounded-full absolute left-0 translate-x-[-31.5px] z-10 top-1 dark:bg-gray-50">
                    2
                  </div>
                  <div className="text-lg font-bold">
                    Update the import paths to match your project setup.
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <p className="text-muted-foreground">
          Once the component is installed successfully, add the following JSON
          files to your project. <code>/data/</code> folder is recommended for
          better organization.
        </p>
        <ul className="list-disc text-muted-foreground ml-4">
          <li>
            <Link
              href="https://github.com/hasanharman/form-builder/blob/main/data/countries.json"
              target="_blank"
              className="hover:underline"
            >
              Countries JSON
            </Link>
          </li>
          <li>
            <Link
              href="https://github.com/hasanharman/form-builder/blob/main/data/states.json"
              target="_blank"
              className="hover:underline"
            >
              States JSON
            </Link>
          </li>
        </ul>
      </div>
      {/* Usage */}
      <div className="space-y-3">
        <h1 className="text-xl font-semibold capitalize">Usage</h1>
        <Code code={usageCode1} />
        <Code code={usageCode2} />
      </div>
      {/* Form */}
      <div className="space-y-3">
        <h1 className="text-xl font-semibold capitalize">Form</h1>
        <Tabs defaultValue="preview">
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="Code">Code</TabsTrigger>
          </TabsList>
          <TabsContent value="preview">
            <Card className="flex justify-center items-center h-[400px]">
              <SignatureForm />
            </Card>
          </TabsContent>
          <TabsContent value="Code">
            <Card>
              <Code code={formCode} customStyle="h-[500px]" />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
