import { FormFieldType } from '@/types'
import { generateCodeSnippetWithField } from './field-snippets'
import { generateZodSchema, generateConstants, generateDefaultValuesString, getZodSchemaString } from './index'

type FormFieldOrGroup = FormFieldType | FormFieldType[]

export const generateReactHookFormCode = (formFields: FormFieldOrGroup[]): string => {
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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
${componentImports.join('\n')}`

  const constants = Array.from(generateConstants(formFields)).join('\n')
  const schema = getZodSchemaString(formFields)

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
            ${generateCodeSnippetWithField(field, 'react-hook-form')}
          </div>
          `,
            )
            .join('')}
        </div>`
        } else {
          return generateCodeSnippetWithField(fieldOrGroup, 'react-hook-form')
        }
      })
      .join('\n        ')
  }

  const defaultValuesString = generateDefaultValuesString(formFields)

  const component = `
export default function MyForm() {
  ${constants}
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
     ${defaultValuesString}
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">
        ${renderFields(formFields)}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
  `
  return imports + '\n\n' + schema + '\n' + component
}
