'use client'

import { Input } from '@/components/ui/input'
import { Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import * as React from 'react'
import { EditorColumn } from '@/types'

interface ColumnManagerProps {
  blockId: string
  columns: EditorColumn[]
  onColumnChange?: (columns: EditorColumn[]) => void
  onKeyDown?: (
    e: React.KeyboardEvent<HTMLInputElement>,
    columnId: string,
  ) => void
}

export function ColumnManager({
  blockId,
  columns,
  onColumnChange,
  onKeyDown,
}: ColumnManagerProps) {
  const totalWidth = React.useMemo(
    () => columns.reduce((acc, col) => acc + col.width, 0),
    [columns],
  )

  const handleColumnChange = (newColumns: EditorColumn[]) => {
    if (onColumnChange) {
      onColumnChange(newColumns)
    }
  }

  const addColumn = () => {
    if (totalWidth >= 12) return
    const newColumn: EditorColumn = {
      id: Math.random().toString(36).substr(2, 9),
      content: '',
      width: Math.min(12 - totalWidth, 6),
    }
    handleColumnChange([...columns, newColumn])
  }

  const removeColumn = (id: string) => {
    if (columns.length <= 1) return
    handleColumnChange(columns.filter((col) => col.id !== id))
  }

  const adjustWidth = (id: string, increment: boolean) => {
    const newColumns = columns.map((col) => {
      if (col.id === id) {
        const newWidth = increment ? col.width + 1 : col.width - 1
        if (newWidth < 1 || newWidth > 12) return col

        const potentialTotalWidth = columns.reduce(
          (acc, c) => (c.id === id ? acc + newWidth : acc + c.width),
          0,
        )

        if (potentialTotalWidth > 12) return col

        return { ...col, width: newWidth }
      }
      return col
    })

    handleColumnChange(newColumns)
  }

  const updateColumnContent = (id: string, content: string) => {
    const newColumns = columns.map((col) =>
      col.id === id ? { ...col, content } : col,
    )
    handleColumnChange(newColumns)
  }

  return (
    <div className="w-full space-y-2">
      <div className="grid grid-cols-12 gap-2">
        {columns.map((column) => (
          <div
            key={column.id}
            className="relative group"
            style={{
              gridColumn: `span ${column.width} / span ${column.width}`,
            }}
          >
            <div className="absolute -top-2 right-0 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <div className="flex items-center gap-1 bg-white shadow-sm rounded-md p-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => adjustWidth(column.id, false)}
                  disabled={column.width <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="text-xs text-gray-500">{column.width}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => adjustWidth(column.id, true)}
                  disabled={totalWidth >= 12}
                >
                  <Plus className="h-3 w-3" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-red-500"
                  onClick={() => removeColumn(column.id)}
                  disabled={columns.length <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <Input
              value={column.content}
              onChange={(e) => updateColumnContent(column.id, e.target.value)}
              onKeyDown={(e) => onKeyDown && onKeyDown(e, column.id)}
              placeholder="Type '/' for commands..."
              className="border-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        ))}
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addColumn}
              disabled={totalWidth >= 12}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Column ({12 - totalWidth} width remaining)
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Maximum 12 columns width total</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
