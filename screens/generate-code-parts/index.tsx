import { z, ZodTypeAny } from 'zod'
import { FormFieldType } from '@/types'
import { generateCodeSnippet } from '@/screens/generate-code-field'

type FormFieldOrGroup = FormFieldType | FormFieldType[]

export const generateZodSchema = (
  formFields: FormFieldOrGroup[],
): z.ZodObject<any> => {
  const schemaObject: Record<string, z.ZodTypeAny> = {}

  const processField = (field: FormFieldType): void => {
    if (field.type === 'Label') return

    let fieldSchema: z.ZodTypeAny

    switch (field.type) {
      case 'Checkbox':
      case 'Date Picker':
        fieldSchema = z.date()
        break
      case 'Slider':
        fieldSchema = z.coerce.number()
      case 'Switch':
        fieldSchema = z.boolean()
        break
      case 'Tags Input':
        fieldSchema = z.array(z.string()).nonempty('Please at least one item')
        break
      case 'Multi Select':
        fieldSchema = z.array(z.string())
        break
      case 'Number':
        fieldSchema = z.array(z.string()).nonempty('Please at least one item')
        break
      default:
        fieldSchema = z.string()
    }

    if (field.required) {
      fieldSchema = fieldSchema.refine(
        (value) => {
          if (typeof value === 'string') return value.trim().length > 0
          if (typeof value === 'number') return value > 0
          if (value instanceof Date) return !isNaN(value.getTime())
          return !!value
        },
        {
          message: `${field.label} is required`,
        },
      )
    } else {
      fieldSchema = fieldSchema.optional()
    }

    schemaObject[field.name] = fieldSchema
  }

  formFields.flat().forEach(processField)

  return z.object(schemaObject)
}

export const zodSchemaToString = (schema: z.ZodTypeAny): string => {
  if (schema instanceof z.ZodBoolean) {
    return 'z.boolean()'
  } else if (schema instanceof z.ZodNumber) {
    return 'z.number()'
  } else if (schema instanceof z.ZodString) {
    return 'z.string()'
  } else if (schema instanceof z.ZodDate) {
    return 'z.date()'
  } else if (schema instanceof z.ZodArray) {
    return 'z.array(z.string())'
  } else if (schema instanceof z.ZodEffects) {
    const baseSchema = zodSchemaToString(schema._def.schema)
    return `${baseSchema}`
  }
  return 'z.unknown()'
}

export const getZodSchemaString = (formFields: FormFieldOrGroup[]): string => {
  const schema = generateZodSchema(formFields)
  const schemaEntries = Object.entries(schema.shape)
    .map(([key, value]) => {
      return `  ${key}: ${zodSchemaToString(value as ZodTypeAny)}`
    })
    .join(',\n')

  return `const formSchema = z.object({\n${schemaEntries}\n});`
}

export const generateImports = (
  formFields: FormFieldOrGroup[],
): Set<string> => {
  const importSet = new Set([
    '"use client"',
    'import { useState } from "react"',
    'import {toast} from "sonner"',
    'import { useForm } from "react-hook-form"',
    'import { zodResolver } from "@hookform/resolvers/zod"',
    'import * as z from "zod"',
    'import { cn } from "@/lib/utils"',
    'import { Button } from "@/components/ui/button"',
    'import {\n  Form,\n  FormControl,\n  FormDescription,\n  FormField,\n  FormItem,\n  FormLabel,\n  FormMessage,\n} from "@/components/ui/form"',
  ])

  const processField = (field: FormFieldType) => {
    switch (field.type) {
      case 'Combobox':
        importSet.add(
          'import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command"',
        )
        importSet.add(
          'import { Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"',
        )
        importSet.add('import { Check, ChevronsUpDown } from "lucide-react"')
        break
      case 'Date Picker':
        importSet.add('import { format } from "date-fns"')
        importSet.add(
          'import { Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"',
        )
        importSet.add('import { Calendar } from "@/components/ui/calendar"')
        importSet.add('import { Calendar as CalendarIcon } from "lucide-react"')
        break
      case 'File Input':
        importSet.add('import { CloudUpload, Paperclip } from "lucide-react"')
        importSet.add(
          'import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from "@/components/ui/file-upload"',
        )
        break
      case 'Input OTP':
        importSet.add(
          'import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot} from "@/components/ui/input-otp"',
        )
        break
      case 'Select':
        importSet.add(
          'import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"',
        )
        break
      case 'Tags Input':
        importSet.add('import { TagsInput } from "@/components/ui/tags-input"')
        break
      case 'Multi Select':
        importSet.add(
          'import { MultiSelector, MultiSelectorContent, MultiSelectorInput, MultiSelectorItem, MultiSelectorList, MultiSelectorTrigger} from "@/components/ui/multi-select"',
        )
        break
      case 'Password':
        importSet.add(
          'import { PasswordInput } from "@/components/ui/password-input"',
        )
        break
      case 'Phone':
        importSet.add(
          'import { PhoneInput } from "@/components/ui/phone-input";',
        )
        break
      default:
        importSet.add(
          `import { ${field.type} } from "@/components/ui/${field.type.toLowerCase()}"`,
        )
        break
    }
  }

  formFields.flat().forEach(processField)

  return importSet
}

export const generateConstants = (
  formFields: FormFieldOrGroup[],
): Set<string> => {
  const constantSet: Set<string> = new Set()

  formFields.flat().forEach((field) => {
    if (field.type === 'Combobox') {
      constantSet.add(`const languages = [
        { label: "English", value: "en" },
        { label: "French", value: "fr" },
        { label: "German", value: "de" },
        { label: "Spanish", value: "es" },
        { label: "Portuguese", value: "pt" },
        { label: "Russian", value: "ru" },
        { label: "Japanese", value: "ja" },
        { label: "Korean", value: "ko" },
        { label: "Chinese", value: "zh" },
      ] as const;`)
    } else if (field.type === 'File Input') {
      constantSet.add(`
        const [files, setFiles] = useState<File[] | null>(null); 

        const dropZoneConfig = {
          maxFiles: 5,
          maxSize: 1024 * 1024 * 4,
          multiple: true,
        };`)
    }
  })

  return constantSet
}

export const generateFormCode = (formFields: FormFieldOrGroup[]): string => {
  const imports = Array.from(generateImports(formFields)).join('\n')
  const constants = Array.from(generateConstants(formFields)).join('\n')
  const schema = getZodSchemaString(formFields)

  const renderFields = (fields: FormFieldOrGroup[]) => {
    return fields
      .map((fieldOrGroup, index) => {
        if (Array.isArray(fieldOrGroup)) {
          const colSpan = fieldOrGroup.length === 2 ? 6 : 4
          return `
        <div className="grid grid-cols-12 gap-4">
          ${fieldOrGroup
            .map(
              (field) => `
          <div className="col-span-${colSpan}">
            ${generateCodeSnippet(field)}
          </div>
          `,
            )
            .join('')}
        </div>`
        } else {
          return generateCodeSnippet(fieldOrGroup)
        }
      })
      .join('\n        ')
  }

  // New function to generate defaultValues
  const generateDefaultValues = (fields: FormFieldOrGroup[]): string => {
    const defaultValues: Record<string, any> = {}

    fields.flat().forEach((field) => {
      if (field.type === 'Multi Select') {
        defaultValues[field.name] = ['React']
      } else if (field.type === 'Tags Input') {
        defaultValues[field.name] = ['']
      }
    })

    if (Object.keys(defaultValues).length > 0) {
      return `defaultValues: ${JSON.stringify(defaultValues)},`
    }
    return ''
  }

  const defaultValuesString = generateDefaultValues(formFields)

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
