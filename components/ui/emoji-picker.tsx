'use client'

import * as React from 'react'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'

const EMOJI_GROUPS = {
  Smileys: ['😀', '😁', '😂', '🤣', '😍', '🥳', '🤔', '😭', '😴', '😎'],
  Gestures: ['👍', '👎', '👏', '🙏', '🔥', '💯', '✅', '❌', '👀', '🤝'],
  Nature: ['🌱', '🌳', '🌸', '🌞', '🌙', '⭐', '🌊', '🐶', '🐱', '🦊'],
  Objects: ['📦', '📌', '🧩', '🎯', '🛠️', '📅', '📚', '💡', '🔒', '🔔'],
} as const

type EmojiPickerProps = {
  value?: string
  onChange?: (value: string) => void
}

export function EmojiPicker({ value = '', onChange }: EmojiPickerProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')

  const allGroups = Object.entries(EMOJI_GROUPS)
  const filteredGroups = allGroups
    .map(([group, emojis]) => ({
      group,
      emojis: emojis.filter((emoji) => emoji.includes(query.trim())),
    }))
    .filter((entry) => entry.emojis.length > 0)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        type="button"
        className={cn(buttonVariants({ variant: 'outline' }), 'w-full justify-start')}
      >
        {value || 'Pick an emoji'}
      </PopoverTrigger>
      <PopoverContent className="w-[320px] space-y-2 p-3">
        <Input
          placeholder="Filter emojis"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <ScrollArea className="h-64">
          <div className="space-y-3">
            {filteredGroups.map(({ group, emojis }) => (
              <div key={group} className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground">
                  {group}
                </div>
                <div className="grid grid-cols-8 gap-1">
                  {emojis.map((emoji) => (
                    <button
                      key={`${group}-${emoji}`}
                      type="button"
                      className="rounded p-1 text-lg hover:bg-muted"
                      onClick={() => {
                        onChange?.(emoji)
                        setOpen(false)
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
