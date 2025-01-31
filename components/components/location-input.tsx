import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import LocationSelector from '@/components/ui/location-input'
import Code from '@/components/code'
import { LocationForm } from '@/components/components/location-form'
import { Link } from 'next-view-transitions'

import installationManual from '@/components/ui/location-input?raw'
import formCode from '@/components/components/location-form?raw'

const code = `<LocationSelector
  onCountryChange={(country) => {
    console.log('country')
  }}
  onStateChange={(state) => {
    console.log('state')
  }}
/>`

const installationCode = `npx shadcn@latest add https://www.shadcn-form.com/registry/location-input.json`

const usageCode1 = `'use client'

import { useState } from 'react'

import LocationSelector from '@/components/ui/location-input'
`
const usageCode2 = `const [countryName, setCountryName] = useState<string>('')
const [stateName, setStateName] = useState<string>('')`

const usageCode3 = `<LocationSelector
  onCountryChange={(country) => {
    setCountryName(country?.name || '')
    form.setValue(field.name, [country?.name || '', stateName || ''])
  }}
  onStateChange={(state) => {
    setStateName(state?.name || '')
    form.setValue(field.name, [countryName || '', state?.name || ''])
  }}
/>`

export default function LocationInput() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="text-xl font-semibold capitalize">Location Input</h1>
        <p className="text-md text-muted-foreground">
          A dropdown components which contains all countries and their states.
        </p>
      </div>

      <Tabs defaultValue="preview">
        <TabsList className="grid w-fit grid-cols-2">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="Code">Code</TabsTrigger>
        </TabsList>
        <TabsContent value="preview">
          <Card className="flex justify-center items-center h-[200px]">
            <LocationSelector
              onCountryChange={(country) => {
                console.log('country')
              }}
              onStateChange={(state) => {
                console.log('state')
              }}
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

                  <Code code={installationManual} customStyle="h-[300px]" />
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
        <Code code={usageCode3} />
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
            <Card className="flex justify-center items-center h-[200px]">
              <LocationForm />
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
