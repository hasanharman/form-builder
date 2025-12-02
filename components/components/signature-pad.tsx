'use client'

import { useState } from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import Code from '@/components/code'
import SignaturePad from '@/components/ui/signature-pad'
import { SignaturePadForm } from '@/components/components/signature-pad-form'

import installationManual from '@/components/ui/signature-pad?raw'
import formCode from '@/components/components/signature-pad-form?raw'

const code = `<SignaturePad
  value={signature}
  onChange={setSignature}
/>`

const installationCode = `npx shadcn@latest add https://www.shadcn-form.com/registry/signature-pad.json`

const usageCode1 = `'use client'

import SignaturePad from '@/components/ui/signature-pad'`
const usageCode2 = `const [signature, setSignature] = useState<string | null>(null)

<SignaturePad
  value={signature}
  onChange={setSignature}
/>`

export default function Component() {
  const [signature, setSignature] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="text-xl font-semibold capitalize">Signature Pad</h1>
        <p className="text-md text-muted-foreground">
          Signature pad with dialog interface, hold-to-confirm, and image
          preview. Click the pen button to open the signing pad.
        </p>
      </div>

      <Tabs defaultValue="preview">
        <TabsList className="grid w-fit grid-cols-2">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="Code">Code</TabsTrigger>
        </TabsList>
        <TabsContent value="preview">
          <Card className="flex justify-center items-center h-[300px]">
            <SignaturePad value={signature} onChange={setSignature} />
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

                  <Code code={installationManual} customStyle="h-[300px] max-w-[calc(100vw-8rem)] overflow-x-auto" />
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
              <SignaturePadForm />
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
