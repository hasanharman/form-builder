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
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { cn, lowerCase, sentenceCase } from '@/lib/utils'
import states from '@/data/states.json'
import { useDropdown } from '@/context/DropdownContext'

export interface StateProps {
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

const StateDropdown = () => {
  const {
    countryValue,
    stateValue,
    openStateDropdown,
    setOpenStateDropdown,
    setStateValue,
  } = useDropdown()

  const SD = states as StateProps[]
  const S = SD.filter(
    (state) => state.country_name === sentenceCase(countryValue),
  )

  return (
    <Popover open={openStateDropdown} onOpenChange={setOpenStateDropdown}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={openStateDropdown}
          disabled={!countryValue || S.length === 0}
        >
          {stateValue ? (
            <div className="flex items-end gap-2">
              <span>
                {S.find((state) => lowerCase(state.name) === stateValue)?.name}
              </span>
            </div>
          ) : (
            <span>Select State...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] rounded-[6px] border border-[#27272a] p-0">
        <Command>
          <CommandInput placeholder="Search state..." />
          <CommandEmpty>No state found.</CommandEmpty>
          <CommandGroup>
            <ScrollArea className="h-[300px] w-full">
              {S.map((state) => (
                <CommandItem
                  key={state.id}
                  value={state.name}
                  onSelect={(currentValue) => {
                    setStateValue(
                      currentValue === lowerCase(state.name)
                        ? currentValue
                        : '',
                    )
                    setOpenStateDropdown(false)
                  }}
                  className="flex cursor-pointer items-center justify-between text-xs hover:!bg-[#27272a] hover:!text-white"
                >
                  <div className="flex items-end gap-2">
                    <span className="">{state.name}</span>
                  </div>
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      stateValue === lowerCase(state.name)
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default StateDropdown
