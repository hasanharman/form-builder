'use client'

import * as React from 'react'
import { GripVertical, Plus, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type SortableListInputProps = {
  value: string[]
  onChange: (items: string[]) => void
}

function reorder<T>(list: T[], from: number, to: number) {
  const next = [...list]
  const [moved] = next.splice(from, 1)
  next.splice(to, 0, moved)
  return next
}

export function SortableListInput({ value, onChange }: SortableListInputProps) {
  const [draft, setDraft] = React.useState('')
  const [dragIndex, setDragIndex] = React.useState<number | null>(null)

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Add item"
          onKeyDown={(event) => {
            if (event.key === 'Enter' && draft.trim()) {
              onChange([...value, draft.trim()])
              setDraft('')
            }
          }}
        />
        <Button
          type="button"
          onClick={() => {
            if (!draft.trim()) return
            onChange([...value, draft.trim()])
            setDraft('')
          }}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {value.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="flex items-center gap-2 rounded border p-2"
            draggable
            onDragStart={() => setDragIndex(index)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => {
              if (dragIndex === null || dragIndex === index) return
              onChange(reorder(value, dragIndex, index))
              setDragIndex(null)
            }}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
            <span className="flex-1 text-sm">{item}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onChange(value.filter((_, i) => i !== index))}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
