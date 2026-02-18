'use client'

import * as React from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'

export type TreeOption = {
  id: string
  label: string
  children?: TreeOption[]
}

type TreeSelectProps = {
  options: TreeOption[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
}

function flatten(options: TreeOption[]): TreeOption[] {
  return options.flatMap((option) => [option, ...(option.children ? flatten(option.children) : [])])
}

function TreeNode({
  node,
  depth,
  expanded,
  selected,
  toggleExpand,
  toggleSelect,
}: {
  node: TreeOption
  depth: number
  expanded: Set<string>
  selected: Set<string>
  toggleExpand: (id: string) => void
  toggleSelect: (id: string) => void
}) {
  const hasChildren = Boolean(node.children?.length)
  const isExpanded = expanded.has(node.id)

  return (
    <div>
      <div className="flex items-center gap-2 rounded px-2 py-1 hover:bg-muted" style={{ paddingLeft: `${depth * 14 + 8}px` }}>
        {hasChildren ? (
          <button type="button" onClick={() => toggleExpand(node.id)}>
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        ) : (
          <span className="inline-block w-4" />
        )}
        <input type="checkbox" checked={selected.has(node.id)} onChange={() => toggleSelect(node.id)} />
        <span className="text-sm">{node.label}</span>
      </div>
      {hasChildren && isExpanded && (
        <div className="space-y-1">
          {node.children?.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              expanded={expanded}
              selected={selected}
              toggleExpand={toggleExpand}
              toggleSelect={toggleSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function TreeSelect({
  options,
  value,
  onChange,
  placeholder = 'Select items',
}: TreeSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set())

  const selected = new Set(value)
  const allNodes = flatten(options)
  const selectedLabels = allNodes.filter((node) => selected.has(node.id)).map((node) => node.label)

  const toggleSelect = (id: string) => {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    onChange([...next])
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" className="w-full justify-between">
          <span className="truncate">
            {selectedLabels.length ? selectedLabels.join(', ') : placeholder}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[340px] p-2">
        <ScrollArea className="h-64">
          <div className="space-y-1">
            {options.map((option) => (
              <TreeNode
                key={option.id}
                node={option}
                depth={0}
                expanded={expanded}
                selected={selected}
                toggleExpand={(id) => {
                  setExpanded((prev) => {
                    const next = new Set(prev)
                    if (next.has(id)) next.delete(id)
                    else next.add(id)
                    return next
                  })
                }}
                toggleSelect={toggleSelect}
              />
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
