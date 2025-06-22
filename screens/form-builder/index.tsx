'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Link } from 'next-view-transitions'

import { FormFieldType } from '@/types'
import { defaultFieldConfig, fieldTypes } from '@/constants'
import { useMediaQuery } from '@/hooks/use-media-query'
import { Separator } from '@/components/ui/separator'
import { FieldSelector } from '@/screens/field-selector'
import { FormFieldList } from '@/screens/form-field-list'
import { FormPreview } from '@/screens/form-preview'
import { EditFieldDialog } from '@/screens/edit-field-dialog'

import { Header } from '@/screens/form-builder/components/header'
import { AppSidebar } from '@/screens/form-builder/components/sidebar'

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Badge } from '@/components/ui/badge'

export type FormFieldOrGroup = FormFieldType | FormFieldType[]

export default function FormBuilder() {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const [formFields, setFormFields] = useState<FormFieldOrGroup[]>([])
  const [selectedField, setSelectedField] = useState<FormFieldType | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const addFormField = (variant: string, index: number) => {
    const { label, description, placeholder } = defaultFieldConfig[variant] || {
      label: '',
      description: '',
      placeholder: '',
    }

    const newFieldName = `${label}_${Date.now().toString().slice(-10)}`

    const newField: FormFieldType = {
      checked: true,
      description: description || '',
      disabled: false,
      label: label || newFieldName,
      name: newFieldName,
      onChange: () => {},
      onSelect: () => {},
      placeholder: placeholder || 'Placeholder',
      required: true,
      rowIndex: index,
      setValue: () => {},
      type: '',
      value: '',
      variant,
    }
    setFormFields([...formFields, newField])
  }

  const findFieldPath = (
    fields: FormFieldOrGroup[],
    name: string,
  ): number[] | null => {
    const search = (
      currentFields: FormFieldOrGroup[],
      currentPath: number[],
    ): number[] | null => {
      for (let i = 0; i < currentFields.length; i++) {
        const field = currentFields[i]
        if (Array.isArray(field)) {
          const result = search(field, [...currentPath, i])
          if (result) return result
        } else if (field.name === name) {
          return [...currentPath, i]
        }
      }
      return null
    }
    return search(fields, [])
  }

  const updateFormField = (path: number[], updates: Partial<FormFieldType>) => {
    const updatedFields = JSON.parse(JSON.stringify(formFields)) // Deep clone
    let current: any = updatedFields
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]]
    }
    current[path[path.length - 1]] = {
      ...current[path[path.length - 1]],
      ...updates,
    }
    setFormFields(updatedFields)
  }

  const openEditDialog = (field: FormFieldType) => {
    setSelectedField(field)
    setIsDialogOpen(true)
  }

  const handleSaveField = (updatedField: FormFieldType) => {
    if (selectedField) {
      const path = findFieldPath(formFields, selectedField.name)
      if (path) {
        updateFormField(path, updatedField)
      }
    }
    setIsDialogOpen(false)
  }

  const FieldSelectorWithSeparator = ({
    addFormField,
  }: {
    addFormField: (variant: string, index?: number) => void
  }) => (
    <div className="flex flex-col md:flex-row gap-3">
      <FieldSelector addFormField={addFormField} />
      <Separator orientation={isDesktop ? 'vertical' : 'horizontal'} />
    </div>
  )

  return (
    <section className="space-y-8">
      <div className="container">
        <SidebarProvider
          style={
            {
              '--sidebar-width': 'calc(var(--spacing) * 72)',
              '--header-height': 'calc(var(--spacing) * 12)',
            } as React.CSSProperties
          }
          className="h-[calc(100vh-225px)] min-h-0 drop-shadow-lg rounded-2xl border"
        >
          <AppSidebar
            variant="inset"
            className="relative h-[calc(100vh-225px)]"
            items={[
              {
                title: 'Add Field',
                items: fieldTypes.map((field) => ({
                  title: (
                    <div className="flex items-center gap-2">
                      {field.isNew && (
                        <Badge variant="outline" className="text-[10px]">
                          New
                        </Badge>
                      )}
                      <span>{field.name}</span>
                    </div>
                  ),
                  onClick: () => addFormField(field.name, field.index || 0),
                })),
              },
            ]}
          />
          <SidebarInset>
            <Header />
            <div className="flex flex-1 flex-col h-[calc(100%-50px)]">
              <div className="@container/main flex h-full">
                <div className="overflow-y-auto w-1/2 border-r p-4">
                  <FormFieldList
                    formFields={formFields}
                    setFormFields={setFormFields}
                    updateFormField={updateFormField}
                    openEditDialog={openEditDialog}
                  />
                </div>
                <div className="h-full w-1/2 space-y-3">
                  <FormPreview
                    key={JSON.stringify(formFields)}
                    formFields={formFields}
                  />
                </div>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
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
