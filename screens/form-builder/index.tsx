'use client'

import React, { useState } from 'react'
import { Separator } from '@/components/ui/separator'
import { FieldSelector } from '../field-selector'
import { FormFieldList } from '../form-field-list'
import { FormPreview } from '../form-preview'
import { EditFieldDialog } from '../edit-field-dialog'
import { FormFieldType } from '@/types'
import { Link } from 'next-view-transitions'

export default function FormBuilder() {
  const [formFields, setFormFields] = useState<FormFieldType[]>([])
  const [selectedField, setSelectedField] = useState<FormFieldType | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const addFormField = (type: string) => {
    const newField: FormFieldType = {
      type,
      label: `New ${type}`,
      value: '',
      checked: true,
      name: `name_${formFields.length + 1}`, // Set default name
      placeholder: 'Enter Placeholder',
      description: '',
      required: true,
      disabled: false,
      onChange: handleChange,
      setValue: () => {},
      onSelect: () => {},
    }
    setFormFields([...formFields, newField])
  }

  const updateFormField = (index: number, updates: Partial<FormFieldType>) => {
    const updatedFields = [...formFields]
    updatedFields[index] = { ...updatedFields[index], ...updates }
    setFormFields(updatedFields)
  }

  const openEditDialog = (field: FormFieldType) => {
    setSelectedField(field)
    setIsDialogOpen(true)
  }

  const handleSaveField = (updatedField: FormFieldType) => {
    const index = formFields.findIndex(
      (field) => field.label === selectedField?.label,
    )
    if (index !== -1) {
      updateFormField(index, updatedField)
    }
    setIsDialogOpen(false)
  }

  // Define the handleChange function
  const handleChange = (event: any) => {
    // Your onChange logic here
  }

  return (
    <section className="max-h-screen px-8 space-y-8">
      <div className="max-w-5xl mx-auto space-y-4">
        <h1 className="text-2xl font-semibold">Playground</h1>
        <p className="text-muted-foreground">
          If you've successfully installed Shadcn, you can directly copy and
          paste the generated forms. Some components may require additional
          packages, so be sure to check their documentation in the{' '}
          <Link href="/readme" className="underline text-slate-800">
            readme
          </Link>
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-8">
        <div className="w-full h-full col-span-1 space-x-3 md:max-h-[75vh] flex">
          <div className="flex space-x-3">
            <FieldSelector addFormField={addFormField} />
            <Separator orientation="vertical" />
          </div>
          <div className="overflow-y-auto flex-1">
            <FormFieldList
              formFields={formFields}
              setFormFields={setFormFields}
              updateFormField={updateFormField}
              openEditDialog={openEditDialog}
            />
          </div>
        </div>
        <div className="w-full h-full col-span-1">
          <FormPreview formFields={formFields} />
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
