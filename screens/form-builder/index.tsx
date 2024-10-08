'use client'

import React, { useState } from 'react'
import { Link } from 'next-view-transitions'

import { FormFieldType } from '@/types'
import { Separator } from '@/components/ui/separator'
import { FieldSelector } from '@/screens/field-selector'
import { FormFieldList } from '@/screens/form-field-list'
import { FormPreview } from '@/screens/form-preview'
import { EditFieldDialog } from '@/screens/edit-field-dialog'

import { useMediaQuery } from '@/hooks/use-media-query'

import EmptyListImage from '@/assets/oc-thinking.png'
import If from '@/components/ui/if'
import Image from 'next/image'

export type FormFieldOrGroup = FormFieldType | FormFieldType[]

export default function FormBuilder() {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const [formFields, setFormFields] = useState<FormFieldOrGroup[]>([])
  const [selectedField, setSelectedField] = useState<FormFieldType | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const addFormField = (type: string, index: number) => {
    const uniqueId = Math.random().toString().slice(-10)

    const newField: FormFieldType = {
      type,
      label: `name_${uniqueId}`,
      value: '',
      checked: true,
      name: `name_${uniqueId}`, // Set default name
      placeholder: 'Enter Placeholder',
      description: '',
      required: true,
      disabled: false,
      onChange: () => {},
      setValue: () => {},
      onSelect: () => {},
      rowIndex: index,
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
    addFormField: (type: string, index?: number) => void
  }) => (
    <div className="flex flex-col md:flex-row gap-3">
      <FieldSelector addFormField={addFormField} />
      <Separator orientation={isDesktop ? 'vertical' : 'horizontal'} />
    </div>
  )

  return (
    <section className="md:max-h-screen space-y-8">
      <div className="max-w-5xl mx-auto space-y-4">
        <h1 className="text-2xl font-semibold">Playground</h1>
        <p className="text-sm text-muted-foreground">
          After successfully installing Shadcn, you can simply copy and paste
          the generated form components to get started. Some components may have
          additional dependencies, so make sure to review their documentation in
          the{' '}
          <Link href="/readme" className="underline text-slate-800">
            README
          </Link>{' '}
          for further instructions.
        </p>
      </div>
      <If
        condition={formFields.length > 0}
        render={() => (
          <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-8 md:px-5 h-full">
            <div className="w-full h-full col-span-1 md:space-x-3 md:max-h-[75vh] flex flex-col md:flex-row ">
              <FieldSelectorWithSeparator
                addFormField={(type: string, index: number = 0) =>
                  addFormField(type, index)
                }
              />
              <div className="overflow-y-auto flex-1">
                <FormFieldList
                  formFields={formFields}
                  setFormFields={setFormFields}
                  updateFormField={updateFormField}
                  openEditDialog={openEditDialog}
                />
              </div>
            </div>
            <div className="col-span-1 w-full h-full">
              <FormPreview formFields={formFields} />
            </div>
          </div>
        )}
        otherwise={() => (
          <div className="flex flex-col md:flex-row items-center gap-3 md:px-5">
            <FieldSelectorWithSeparator
              addFormField={(type: string, index: number = 0) =>
                addFormField(type, index)
              }
            />
            <Image
              src={EmptyListImage}
              width={585}
              height={502}
              alt="Empty Image"
              className="object-contain mx-auto p-5 md:p-20"
            />
          </div>
        )}
      />

      <EditFieldDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        field={selectedField}
        onSave={handleSaveField}
      />
    </section>
  )
}
