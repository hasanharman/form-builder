import { FormFieldType } from '@/types'
import { generateCodeSnippetWithField } from './field-snippets'

type FormFieldOrGroup = FormFieldType | FormFieldType[]

export const generateBringYourOwnCode = (formFields: FormFieldOrGroup[]): string => {
  const fieldImports = new Set<string>()
  
  formFields.flat().forEach((field) => {
    switch (field.variant) {
      case 'Input':
        fieldImports.add('Input')
        break
      case 'Textarea':
        fieldImports.add('Textarea')
        break
      case 'Checkbox':
        fieldImports.add('Checkbox')
        break
      case 'Select':
        fieldImports.add('Select')
        fieldImports.add('SelectContent')
        fieldImports.add('SelectItem')
        fieldImports.add('SelectTrigger')
        fieldImports.add('SelectValue')
        break
      case 'Switch':
        fieldImports.add('Switch')
        break
      case 'Slider':
        fieldImports.add('Slider')
        break
      case 'Radio':
        fieldImports.add('RadioGroup')
        fieldImports.add('RadioGroupItem')
        fieldImports.add('Label')
        break
    }
  })

  const componentImports = Array.from(fieldImports).map(comp => {
    if (['Select', 'SelectContent', 'SelectItem', 'SelectTrigger', 'SelectValue'].includes(comp)) {
      return null
    }
    if (['RadioGroup', 'RadioGroupItem'].includes(comp)) {
      return null
    }
    return `import { ${comp} } from "@/components/ui/${comp.toLowerCase()}"`
  }).filter(Boolean)

  if (fieldImports.has('Select')) {
    componentImports.push('import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"')
  }
  if (fieldImports.has('RadioGroup')) {
    componentImports.push('import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"')
    componentImports.push('import { Label } from "@/components/ui/label"')
  }

  const imports = `"use client"
import { useState } from "react"
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
${componentImports.join('\n')}`

  const renderFields = (fields: FormFieldOrGroup[]) => {
    return fields
      .map((fieldOrGroup) => {
        if (Array.isArray(fieldOrGroup)) {
          const colSpan = fieldOrGroup.length === 2 ? 6 : 4
          return `
        <div className="grid grid-cols-12 gap-4">
          ${fieldOrGroup
            .map(
              (field) => `
          <div className="col-span-${colSpan}">
            ${generateCodeSnippetWithField(field, 'bring-your-own')}
          </div>
          `,
            )
            .join('')}
        </div>`
        } else {
          return generateCodeSnippetWithField(fieldOrGroup, 'bring-your-own')
        }
      })
      .join('\n        ')
  }

  const component = `
export default function MyForm() {
  const [formData, setFormData] = useState({
${formFields.flat().map(field => `    ${field.name}: ${field.variant === 'Checkbox' || field.variant === 'Switch' ? 'false' : '""'},`).join('\n')}
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto py-10">
        ${renderFields(formFields)}
        <Button type="submit">Submit</Button>
    </form>
  )
}
  `
  return imports + '\n\n' + component
}
