'use client'

import * as React from 'react'

import { Button } from '@/components/ui/button'

type TransferItem = {
  id: string
  label: string
}

type TransferListProps = {
  available: TransferItem[]
  selected: TransferItem[]
  onChange: (next: { available: TransferItem[]; selected: TransferItem[] }) => void
}

function pick(list: TransferItem[], ids: Set<string>) {
  return list.filter((item) => ids.has(item.id))
}

function omit(list: TransferItem[], ids: Set<string>) {
  return list.filter((item) => !ids.has(item.id))
}

function Panel({
  title,
  items,
  active,
  toggle,
}: {
  title: string
  items: TransferItem[]
  active: Set<string>
  toggle: (id: string) => void
}) {
  return (
    <div className="flex-1 rounded border">
      <div className="border-b px-3 py-2 text-sm font-medium">{title}</div>
      <div className="max-h-60 space-y-1 overflow-y-auto p-2">
        {items.map((item) => (
          <label key={item.id} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-muted">
            <input
              type="checkbox"
              checked={active.has(item.id)}
              onChange={() => toggle(item.id)}
            />
            <span className="text-sm">{item.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

export function TransferList({ available, selected, onChange }: TransferListProps) {
  const [activeAvailable, setActiveAvailable] = React.useState<Set<string>>(new Set())
  const [activeSelected, setActiveSelected] = React.useState<Set<string>>(new Set())

  const moveRight = () => {
    const moveItems = pick(available, activeAvailable)
    onChange({
      available: omit(available, activeAvailable),
      selected: [...selected, ...moveItems],
    })
    setActiveAvailable(new Set())
  }

  const moveLeft = () => {
    const moveItems = pick(selected, activeSelected)
    onChange({
      available: [...available, ...moveItems],
      selected: omit(selected, activeSelected),
    })
    setActiveSelected(new Set())
  }

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      <Panel
        title="Available"
        items={available}
        active={activeAvailable}
        toggle={(id) => {
          setActiveAvailable((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
          })
        }}
      />
      <div className="flex flex-row gap-2 self-center md:flex-col">
        <Button type="button" onClick={moveRight} disabled={activeAvailable.size === 0}>
          Add
        </Button>
        <Button type="button" variant="outline" onClick={moveLeft} disabled={activeSelected.size === 0}>
          Remove
        </Button>
      </div>
      <Panel
        title="Selected"
        items={selected}
        active={activeSelected}
        toggle={(id) => {
          setActiveSelected((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
          })
        }}
      />
    </div>
  )
}
