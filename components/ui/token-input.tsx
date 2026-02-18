'use client'

import * as React from 'react'
import { X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

type TokenInputProps = {
  value: string[]
  onChange: (tokens: string[]) => void
  placeholder?: string
}

export function TokenInput({ value, onChange, placeholder }: TokenInputProps) {
  const [draft, setDraft] = React.useState('')

  const addToken = (raw: string) => {
    const next = raw.trim()
    if (!next || value.includes(next)) return
    onChange([...value, next])
  }

  const removeToken = (token: string) => {
    onChange(value.filter((item) => item !== token))
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      addToken(draft)
      setDraft('')
    }

    if (event.key === 'Backspace' && !draft && value.length > 0) {
      removeToken(value[value.length - 1])
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 rounded-md border p-2">
        {value.map((token) => (
          <Badge key={token} variant="secondary" className="gap-1">
            {token}
            <button
              type="button"
              onClick={() => removeToken(token)}
              aria-label={`Remove ${token}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <Input
          className="h-8 border-0 p-0 shadow-none focus-visible:ring-0"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (draft.trim()) {
              addToken(draft)
              setDraft('')
            }
          }}
          placeholder={placeholder ?? 'Type and press Enter'}
        />
      </div>
    </div>
  )
}
