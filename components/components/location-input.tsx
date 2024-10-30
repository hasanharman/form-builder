import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import LocationSelector from '@/components/ui/location-input'
import Code from '@/components/code'
import { LocationForm } from '@/components/components/location-form'
import { Link } from 'next-view-transitions'

const code = `<LocationSelector
  onCountryChange={(country) => {
    console.log('country')
  }}
  onStateChange={(state) => {
    console.log('state')
  }}
/>`

const installationCode = `npx shadcn@latest add https://www.shadcn-form.com/registry/location-input.json`

const installationManuel = `import React, { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Command,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

// Import JSON data directly
import countries from '@/data/countries.json'
import states from '@/data/states.json'

interface Timezone {
  zoneName: string
  gmtOffset: number
  gmtOffsetName: string
  abbreviation: string
  tzName: string
}

interface CountryProps {
  id: number
  name: string
  iso3: string
  iso2: string
  numeric_code: string
  phone_code: string
  capital: string
  currency: string
  currency_name: string
  currency_symbol: string
  tld: string
  native: string
  region: string
  region_id: string
  subregion: string
  subregion_id: string
  nationality: string
  timezones: Timezone[]
  translations: Record<string, string>
  latitude: string
  longitude: string
  emoji: string
  emojiU: string
}

interface StateProps {
  id: number
  name: string
  country_id: number
  country_code: string
  country_name: string
  state_code: string
  type: string | null
  latitude: string
  longitude: string
}

interface LocationSelectorProps {
  disabled?: boolean
  onCountryChange?: (country: CountryProps | null) => void
  onStateChange?: (state: StateProps | null) => void
}

const LocationSelector = ({
  disabled,
  onCountryChange,
  onStateChange,
}: LocationSelectorProps) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryProps | null>(
    null,
  )
  const [selectedState, setSelectedState] = useState<StateProps | null>(null)
  const [openCountryDropdown, setOpenCountryDropdown] = useState(false)
  const [openStateDropdown, setOpenStateDropdown] = useState(false)

  // Cast imported JSON data to their respective types
  const countriesData = countries as CountryProps[]
  const statesData = states as StateProps[]

  // Filter states for selected country
  const availableStates = statesData.filter(
    (state) => state.country_id === selectedCountry?.id,
  )

  const handleCountrySelect = (country: CountryProps | null) => {
    setSelectedCountry(country)
    setSelectedState(null) // Reset state when country changes
    onCountryChange?.(country)
    onStateChange?.(null)
  }

  const handleStateSelect = (state: StateProps | null) => {
    setSelectedState(state)
    onStateChange?.(state)
  }

  return (
    <div className="flex gap-4">
      {/* Country Selector */}
      <Popover open={openCountryDropdown} onOpenChange={setOpenCountryDropdown}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openCountryDropdown}
            disabled={disabled}
            className="w-full justify-between"
          >
            {selectedCountry ? (
              <div className="flex items-center gap-2">
                <span>{selectedCountry.emoji}</span>
                <span>{selectedCountry.name}</span>
              </div>
            ) : (
              <span>Select Country...</span>
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search country..." />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                <ScrollArea className="h-[300px]">
                  {countriesData.map((country) => (
                    <CommandItem
                      key={country.id}
                      value={country.name}
                      onSelect={() => {
                        handleCountrySelect(country)
                        setOpenCountryDropdown(false)
                      }}
                      className="flex cursor-pointer items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span>{country.emoji}</span>
                        <span>{country.name}</span>
                      </div>
                      <Check
                        className={cn(
                          'h-4 w-4',
                          selectedCountry?.id === country.id
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                    </CommandItem>
                  ))}
                  <ScrollBar orientation="vertical" />
                </ScrollArea>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* State Selector - Only shown if selected country has states */}
      {availableStates.length > 0 && (
        <Popover open={openStateDropdown} onOpenChange={setOpenStateDropdown}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openStateDropdown}
              disabled={!selectedCountry}
              className="w-full justify-between"
            >
              {selectedState ? (
                <span>{selectedState.name}</span>
              ) : (
                <span>Select State...</span>
              )}
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput placeholder="Search state..." />
              <CommandList>
                <CommandEmpty>No state found.</CommandEmpty>
                <CommandGroup>
                  <ScrollArea className="h-[300px]">
                    {availableStates.map((state) => (
                      <CommandItem
                        key={state.id}
                        value={state.name}
                        onSelect={() => {
                          handleStateSelect(state)
                          setOpenStateDropdown(false)
                        }}
                        className="flex cursor-pointer items-center justify-between text-sm"
                      >
                        <span>{state.name}</span>
                        <Check
                          className={cn(
                            'h-4 w-4',
                            selectedState?.id === state.id
                              ? 'opacity-100'
                              : 'opacity-0',
                          )}
                        />
                      </CommandItem>
                    ))}
                    <ScrollBar orientation="vertical" />
                  </ScrollArea>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}

export default LocationSelector
`

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

const formCode = `
'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import LocationSelector from '@/components/ui/location-input'

const FormSchema = z.object({
  location: z.tuple([
    z.string({
      required_error: 'Country is required',
    }),
    z.string().optional(), // State name, optional
  ]),
})

export function LocationForm() {
  const [countryName, setCountryName] = useState<string>('')
  const [stateName, setStateName] = useState<string>('')

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast(
      <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        <code className="text-white">{JSON.stringify(data, null, 2)}</code>
      </pre>,
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <div>
                <FormLabel>Country Selector</FormLabel>
              </div>
              <LocationSelector
                onCountryChange={(country) => {
                  setCountryName(country?.name || '')
                  form.setValue(field.name, [
                    country?.name || '',
                    stateName || '',
                  ])
                }}
                onStateChange={(state) => {
                  setStateName(state?.name || '')
                  form.setValue(field.name, [
                    countryName || '',
                    state?.name || '',
                  ])
                }}
              />
              <FormDescription>
                Please select state after selecting your country
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
`

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
