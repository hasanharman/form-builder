'use client'

import * as React from 'react'
import { Pencil } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type InlineEditableFieldProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function InlineEditableField({
  value,
  onChange,
  placeholder = 'Click to edit',
}: InlineEditableFieldProps) {
  const [editing, setEditing] = React.useState(false)
  const [draft, setDraft] = React.useState(value)

  React.useEffect(() => {
    setDraft(value)
  }, [value])

  const save = () => {
    onChange(draft)
    setEditing(false)
  }

  if (editing) {
    return (
      <Input
        autoFocus
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={save}
        onKeyDown={(event) => {
          if (event.key === 'Enter') save()
          if (event.key === 'Escape') {
            setDraft(value)
            setEditing(false)
          }
        }}
      />
    )
  }

  return (
    <Button
      type="button"
      variant="ghost"
      className="h-auto w-full justify-start px-2"
      onClick={() => setEditing(true)}
    >
      <span className="truncate text-left">{value || placeholder}</span>
      <Pencil className="ml-2 h-4 w-4" />
    </Button>
  )
}
