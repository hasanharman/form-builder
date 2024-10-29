'use client'

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { cn, lowerCase } from '@/lib/utils'
import countries from '@/data/countries.json'
import { useDropdown } from '@/context/DropdownContext'

interface Timezone {
  zoneName: string
  gmtOffset: number
  gmtOffsetName: string
  abbreviation: string
  tzName: string
}

export interface CountryProps {
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

interface CountryDropdownProps {
  disabled?: boolean
}

const CountryDropdown = ({ disabled }: CountryDropdownProps) => {
  const {
    countryValue,
    setCountryValue,
    openCountryDropdown,
    setOpenCountryDropdown,
  } = useDropdown()

  const C = (countries as CountryProps[]) || []

  return (
    <Popover open={openCountryDropdown} onOpenChange={setOpenCountryDropdown}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={openCountryDropdown}
          disabled={disabled}
        >
          <span>
            {countryValue ? (
              <div className="flex items-end gap-2">
                <span>
                  {
                    C.find(
                      (country) => lowerCase(country.name) === countryValue,
                    )?.emoji
                  }
                </span>
                <span>
                  {
                    C.find(
                      (country) => lowerCase(country.name) === countryValue,
                    )?.name
                  }
                </span>
              </div>
            ) : (
              <span>Select Country...</span>
            )}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] rounded-[6px] border border-[#27272a] p-0">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="h-[300px] w-full">
                {C.map((country) => (
                  <CommandItem
                    key={country.id}
                    value={country.name}
                    onSelect={(currentValue) => {
                      setCountryValue(
                        currentValue === lowerCase(country.name)
                          ? currentValue
                          : '',
                      )
                      setOpenCountryDropdown(false)
                    }}
                    className="flex cursor-pointer items-center justify-between text-xs hover:!bg-[#27272a] hover:!text-white"
                  >
                    <div className="flex items-end gap-2">
                      <span>{country.emoji}</span>
                      <span className="">{country.name}</span>
                    </div>
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        countryValue === lowerCase(country.name)
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
  )
}

export default CountryDropdown
