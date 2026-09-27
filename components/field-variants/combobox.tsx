'use client'

import { Check, ChevronsUpDown } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { stringSchema } from './helpers'
import type { FieldVariant } from './types'

const languages = [
  { label: 'English', value: 'en' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Spanish', value: 'es' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Russian', value: 'ru' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Korean', value: 'ko' },
  { label: 'Chinese', value: 'zh' },
] as const

export const comboboxVariant: FieldVariant = {
  name: 'Combobox',
  defaults: {
    label: 'Language',
    description: 'This is the language that will be used in the dashboard.',
  },
  registryItems: ['button', 'command', 'popover'],
  imports: () => [
    'import { Check, ChevronsUpDown } from "lucide-react"',
    'import { cn } from "@/lib/utils"',
    'import { buttonVariants } from "@/components/ui/button"',
    'import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"',
    'import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"',
  ],
  declarations: [
    `const languages = [
${languages.map((language) => `  { label: "${language.label}", value: "${language.value}" },`).join('\n')}
] as const`,
  ],
  schema: (field) => stringSchema(field, 'Please select a language'),
  defaultValue: () => '',
  Control: ({ field, id, value, onChange, invalid }) => (
    <Popover>
      <PopoverTrigger
        id={id}
        type="button"
        role="combobox"
        disabled={field.disabled}
        aria-invalid={invalid}
        className={cn(
          buttonVariants({ variant: 'outline' }),
          'w-full justify-between font-normal',
          !value && 'text-muted-foreground',
        )}
      >
        {languages.find((language) => language.value === value)?.label ?? 'Select language'}
        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search language..." />
          <CommandList>
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup>
              {languages.map((language) => (
                <CommandItem
                  key={language.value}
                  value={language.label}
                  onSelect={() => onChange(language.value)}
                >
                  <Check
                    className={cn('mr-2 size-4', language.value === value ? 'opacity-100' : 'opacity-0')}
                  />
                  {language.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  ),
  control: (field, b) => `<Popover>
  <PopoverTrigger
    id={${b.id}}
    type="button"
    role="combobox"${field.disabled ? '\n    disabled' : ''}
    aria-invalid={${b.invalid}}
    className={cn(
      buttonVariants({ variant: "outline" }),
      "w-full justify-between font-normal",
      !${b.value} && "text-muted-foreground"
    )}
  >
    {languages.find((language) => language.value === ${b.value})?.label ?? "Select language"}
    <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
  </PopoverTrigger>
  <PopoverContent className="p-0">
    <Command>
      <CommandInput placeholder="Search language..." />
      <CommandList>
        <CommandEmpty>No language found.</CommandEmpty>
        <CommandGroup>
          {languages.map((language) => (
            <CommandItem
              key={language.value}
              value={language.label}
              onSelect={() => ${b.onChange('language.value')}}
            >
              <Check
                className={cn("mr-2 size-4", language.value === ${b.value} ? "opacity-100" : "opacity-0")}
              />
              {language.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  </PopoverContent>
</Popover>`,
}
