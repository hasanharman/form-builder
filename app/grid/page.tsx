'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'next-view-transitions'
import GridLayout from 'react-grid-layout'
import { Reorder } from 'framer-motion'

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

import { FormFieldType } from '@/types'
import { Separator } from '@/components/ui/separator'
import { FieldSelector } from '@/screens/field-selector'
import { FormPreview } from '@/screens/form-preview'
import { EditFieldDialog } from '@/screens/edit-field-dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { useMediaQuery } from '@/hooks/use-media-query'
import { LuGrip, LuPencil, LuTrash2 } from 'react-icons/lu'
import { GridPreview } from '@/screens/grid-preview'

const GridItem = ({
  field,
  updateFormField,
  openEditDialog,
  removeFormField,
}: any) => {
  const [isEditing, setIsEditing] = useState(false)

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormField(field.name, { label: e.target.value })
  }

  const handleLabelBlur = () => {
    setIsEditing(false)
  }

  return (
    <div className="flex items-center gap-1 border rounded-xl px-3 py-1.5 w-full h-full">
      <div className="cursor-grab mr-2">
        <LuGrip />
      </div>
      {isEditing ? (
        <Input
          value={field.label}
          onChange={handleLabelChange}
          onBlur={handleLabelBlur}
          placeholder="Enter label"
          className="flex-grow"
          autoFocus
        />
      ) : (
        <div
          className="flex-grow cursor-text"
          onClick={() => setIsEditing(true)}
        >
          {field.label}
        </div>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation()
          openEditDialog(field)
        }}
        className="ml-1"
      >
        <LuPencil />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation()
          removeFormField(field.name)
        }}
        className="ml-1"
      >
        <LuTrash2 />
      </Button>
    </div>
  )
}

export default function FormBuilder() {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const [formFields, setFormFields] = useState<FormFieldType[]>([])
  const [selectedField, setSelectedField] = useState<FormFieldType | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [layout, setLayout] = useState<GridLayout.Layout[]>([])

  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize() // Set initial width

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [containerRef])

  useEffect(() => {
    const newLayout = formFields.map((field, index) => {
      const existingLayout = layout.find((item) => item.i === field.name)
      if (existingLayout) {
        return existingLayout
      }
      return {
        i: field.name,
        x: 0,
        y: index,
        w: 12,
        h: 2,
        minH: 2,
        maxH: 2,
        minW: 3,
        maxW: 12,
      }
    })
    setLayout(newLayout)
  }, [formFields, layout])

  const addFormField = (type: string) => {
    const newField: FormFieldType = {
      type,
      label: `New ${type}`,
      value: '',
      checked: true,
      name: `name_${Date.now()}`,
      placeholder: 'Enter Placeholder',
      description: '',
      required: true,
      disabled: false,
      onChange: () => {},
      setValue: () => {},
      onSelect: () => {},
      rowIndex: 0,
    }
    setFormFields((prevFields) => [...prevFields, newField])
  }

  const addRowField = (type: string) => {
    const newField: FormFieldType = {
      type,
      label: `New ${type}`,
      value: '',
      checked: true,
      name: `name_${Date.now()}`,
      placeholder: 'Enter Placeholder',
      description: '',
      required: true,
      disabled: false,
      onChange: () => {},
      setValue: () => {},
      onSelect: () => {},
      rowIndex: 0,
    }
    setFormFields((prevFields) => [...prevFields, newField])
  }

  const updateFormField = (name: string, updates: Partial<FormFieldType>) => {
    setFormFields((prevFields) =>
      prevFields.map((field) =>
        field.name === name ? { ...field, ...updates } : field,
      ),
    )
  }

  const removeFormField = (name: string) => {
    setFormFields((prevFields) =>
      prevFields.filter((field) => field.name !== name),
    )
    setLayout((prevLayout) => prevLayout.filter((item) => item.i !== name))
  }

  const openEditDialog = (field: FormFieldType) => {
    setSelectedField(field)
    setIsDialogOpen(true)
  }

  const handleSaveField = (updatedField: FormFieldType) => {
    setFormFields((prevFields) =>
      prevFields.map((field) =>
        field.name === selectedField?.name ? updatedField : field,
      ),
    )
    setIsDialogOpen(false)
  }

  const onLayoutChange = (newLayout: GridLayout.Layout[]) => {
    setLayout(newLayout)
  }

  return (
    <section className="max-h-screen space-y-8">
      <div className="max-w-5xl mx-auto space-y-4">
        <h1 className="text-2xl font-semibold">Playground</h1>
        <p className="text-muted-foreground">
          If you&apos;ve successfully installed Shadcn, you can directly copy and
          paste the generated forms. Some components may require additional
          packages, so be sure to check their documentation in the{' '}
          <Link href="/readme" className="underline text-slate-800">
            readme
          </Link>
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-8 md:px-5">
        <div className="w-full h-full col-span-1 md:space-x-3 md:max-h-[75vh] flex flex-col md:flex-row">
          <div className="flex flex-col md:flex-row gap-3">
            <FieldSelector
              addFormField={addFormField}
              // addRowField={addRowField}
            />
            <Separator orientation={isDesktop ? 'vertical' : 'horizontal'} />
          </div>
          <div ref={containerRef} className="overflow-y-auto flex-1 my-2">
            <div className="grid grid-cols-12 gap-1 px-2.5">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center col-span-1 h-10 bg-slate-100 rounded"
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <GridLayout
              className="layout"
              // autoSize={true}
              layout={layout}
              cols={12}
              rowHeight={20}
              width={containerWidth}
              onLayoutChange={onLayoutChange}
              useCSSTransforms={true}
              draggableHandle=".cursor-grab"
              compactType={null} // Disable automatic compacting and shifting
              preventCollision={true} // Prevent collisions but still allow free reordering
            >
              {formFields.map((field) => (
                <div key={field.name}>
                  <GridItem
                    field={field}
                    updateFormField={updateFormField}
                    openEditDialog={openEditDialog}
                    removeFormField={removeFormField}
                  />
                </div>
              ))}
            </GridLayout>
          </div>
        </div>
        <div className="w-full h-full col-span-1">
          <GridPreview formFields={formFields} layout={layout} />
        </div>
      </div>
      <EditFieldDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        field={selectedField}
        onSave={handleSaveField}
      />
    </section>
  )
}
