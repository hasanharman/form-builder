'use client'

import * as React from 'react'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem as CommandListItem,
  CommandList,
} from '@/components/ui/command'
import { GripVertical, MoreVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Reorder, useDragControls } from 'framer-motion'
import { BlockContent } from './block-content'
import { EditorBlock, EditorColumn } from '@/types'
import {
  labelCommands,
  layoutCommands,
  componentCommands,
} from '@/constants/menu'

const iconSize = 'h-4 w-4'

export default function Editor() {
  const [blocks, setBlocks] = React.useState<EditorBlock[]>([
    { id: '1', type: 'text', content: '' },
  ])
  const [showCommand, setShowCommand] = React.useState(false)
  const [activeBlockId, setActiveBlockId] = React.useState<string>('1')
  const dragControls = useDragControls()

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    blockId: string,
    columnId?: string,
  ) => {
    if (e.key === '/' && !showCommand) {
      e.preventDefault()
      setShowCommand(true)
      setActiveBlockId(blockId)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const newBlock: EditorBlock = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'text',
        content: '',
      }

      setBlocks((prev) => {
        const currentIndex = prev.findIndex((block) => block.id === blockId)
        const newBlocks = [...prev]
        newBlocks.splice(currentIndex + 1, 0, newBlock)
        return newBlocks
      })
    }
  }

  const handleCommandSelect = (value: string) => {
    const newBlock: EditorBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type: value as EditorBlock['type'],
      content: '',
      ...(value === 'columns'
        ? {
            columns: [
              {
                id: Math.random().toString(36).substr(2, 9),
                content: '',
                width: 6,
              },
              {
                id: Math.random().toString(36).substr(2, 9),
                content: '',
                width: 6,
              },
            ],
          }
        : {}),
    }

    setBlocks((prev) => {
      const activeBlockIndex = prev.findIndex(
        (block) => block.id === activeBlockId,
      )
      const newBlocks = [...prev]
      newBlocks.splice(activeBlockIndex + 1, 0, newBlock)
      return newBlocks
    })

    setShowCommand(false)
  }

  const handleContentChange = (id: string, content: string) => {
    setBlocks((prev) =>
      prev.map((block) => (block.id === id ? { ...block, content } : block)),
    )
  }

  const handleColumnChange = (blockId: string, columns: EditorColumn[]) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === blockId ? { ...block, columns } : block,
      ),
    )
  }

  const duplicateBlock = (id: string) => {
    const blockToDuplicate = blocks.find((block) => block.id === id)
    if (!blockToDuplicate) return

    const newBlock: EditorBlock = {
      ...blockToDuplicate,
      id: Math.random().toString(36).substr(2, 9),
      ...(blockToDuplicate.columns
        ? {
            columns: blockToDuplicate.columns.map((col) => ({
              ...col,
              id: Math.random().toString(36).substr(2, 9),
            })),
          }
        : {}),
    }

    setBlocks((prev) => {
      const index = prev.findIndex((block) => block.id === id)
      const newBlocks = [...prev]
      newBlocks.splice(index + 1, 0, newBlock)
      return newBlocks
    })
  }

  const removeBlock = (id: string) => {
    setBlocks((prev) => {
      if (prev.length <= 1) return prev
      return prev.filter((block) => block.id !== id)
    })
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Reorder.Group
        axis="y"
        values={blocks}
        onReorder={setBlocks}
        className="space-y-2"
      >
        {blocks.map((block) => (
          <Reorder.Item
            key={block.id}
            value={block}
            dragListener={false} // Disable default drag listener
            dragControls={dragControls} // Use custom drag controls
            className="flex items-center gap-2 group relative"
          >
            <div
              className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
              style={{ cursor: 'grab' }}
              onPointerDown={(e) => dragControls.start(e)} // Start dragging from the icon
            >
              <GripVertical className="h-4 w-4 text-gray-600 hover:text-gray-800" />
            </div>
            <div className="flex-1">
              <BlockContent
                block={block}
                onChange={(content) => handleContentChange(block.id, content)}
                onKeyDown={(e, columnId) =>
                  handleKeyDown(e, block.id, columnId)
                }
                onColumnChange={(newColumns) =>
                  handleColumnChange(block.id, newColumns)
                }
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
                >
                  <MoreVertical className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => duplicateBlock(block.id)}
                  className="flex items-center gap-2"
                >
                  <span>Duplicate</span>
                  <span className="text-xs text-gray-400">⌘D</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => removeBlock(block.id)}
                  className="flex items-center gap-2 text-red-600"
                >
                  <span>Remove</span>
                  <span className="text-xs text-gray-400">⌫</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <CommandDialog open={showCommand} onOpenChange={setShowCommand}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Labels">
            {labelCommands.map((command) => (
              <CommandListItem
                key={command.value}
                onSelect={() => handleCommandSelect(command.value)}
              >
                <span className={`mr-2 ${iconSize}`}>{command.icon}</span>
                {command.title}
              </CommandListItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Layout">
            {layoutCommands.map((command) => (
              <CommandListItem
                key={command.value}
                onSelect={() => handleCommandSelect(command.value)}
              >
                <span className={`mr-2 ${iconSize}`}>{command.icon}</span>
                {command.title}
              </CommandListItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Components">
            {componentCommands.map((component) => (
              <CommandListItem
                key={component.title}
                onSelect={() => handleCommandSelect(component.value)}
                className={component.isNew ? 'font-bold' : ''}
              >
                <span className={`mr-2 ${iconSize}`}>{component.icon}</span>
                {component.title}
                {component.isNew && (
                  <span className="ml-2 text-xs text-blue-500">New</span>
                )}
              </CommandListItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  )
}
