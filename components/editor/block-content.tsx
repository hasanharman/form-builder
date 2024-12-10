'use client'

import { Input } from '@/components/ui/input'
import { EditorBlock, EditorColumn } from '@/types'
import { ColumnManager } from './column-manager'

interface BlockContentProps {
  block: EditorBlock
  onChange: (content: string) => void
  onKeyDown?: (
    e: React.KeyboardEvent<HTMLInputElement>,
    columnId?: string,
  ) => void
  onColumnChange?: (columns: EditorColumn[]) => void
}

export function BlockContent({
  block,
  onChange,
  onKeyDown,
  onColumnChange,
}: BlockContentProps) {
  if (block.type === 'columns' && block.columns) {
    return (
      <ColumnManager
        blockId={block.id}
        columns={block.columns}
        onColumnChange={onColumnChange}
        onKeyDown={onKeyDown}
      />
    )
  }

  return (
    <Input
      value={block.content}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder="Type '/' for commands..."
      className="border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
    />
  )
}
