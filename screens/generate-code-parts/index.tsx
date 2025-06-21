import { z, ZodTypeAny } from 'zod'
import { FormFieldType, FormStep } from '@/types'
import { generateFormJsonSchema } from '@/lib/json-schema-generator'
import { generateCodeSnippet } from '@/screens/generate-code-field'

type FormFieldOrGroup = FormFieldType | FormFieldType[]

export const generateZodSchema = (
  formFields: FormFieldOrGroup[],
): z.ZodObject<any> => {
  const schemaObject: Record<string, z.ZodTypeAny> = {}

  const processField = (field: FormFieldType): void => {
    if (field.variant === 'Label') return

    let fieldSchema: z.ZodTypeAny

    switch (field.variant) {
      case 'Checkbox':
        if (field.required === true) {
          fieldSchema = z.boolean().refine((value) => value === true, {
            message: 'Required',
          })
        } else {
          fieldSchema = z.boolean().default(true)
        }
        break
      case 'Date Picker':
        fieldSchema = z.coerce.date()
        break
      case 'Datetime Picker':
        fieldSchema = z.coerce.date()
        break
      case 'Input':
        if (field.type === 'email') {
          fieldSchema = z.string().email()
          break
        } else if (field.type === 'number') {
          fieldSchema = z.coerce.number()
          break
        } else {
          fieldSchema = z.string().min(1, { message: 'Required' })
          break
        }
      case 'Location Input':
        fieldSchema = z.tuple([
          z.string().min(1, { message: 'Country is required' }),
          z.string().optional(),
        ])
        break
      case 'Slider':
        fieldSchema = z.coerce.number()
        break
      case 'Signature Input':
        fieldSchema = z.string().min(1, { message: 'Signature is required' })
        break
      case 'Smart Datetime Input':
        fieldSchema = z.union([z.string(), z.date()])
        break
      case 'Number':
        fieldSchema = z.coerce.number()
        break
      case 'Switch':
        fieldSchema = z.boolean()
        break
      case 'Tags Input':
        fieldSchema = z
          .array(z.string())
          .min(1, { message: 'Please enter at least one item' })
        break
      case 'Multi Select':
        fieldSchema = z
          .array(z.string())
          .min(1, { message: 'Please select at least one item' })
          break
      case 'Rating':
        fieldSchema = z.coerce.number().min(1, { message: 'Rating is required' })
        break
      case 'Credit Card':
        fieldSchema = z.string().min(1, { message: 'Credit card information is required' }).refine((value: string) => {
          try {
            const parsed = JSON.parse(value)
            const isValid = !!(
              parsed.cardholderName?.trim() && 
              parsed.cardNumber?.trim() && 
              parsed.expiryMonth?.trim() && 
              parsed.expiryYear?.trim() && 
              parsed.cvv?.trim()
            )
            return isValid
          } catch {
            return false
          }
        }, {
          message: 'Please fill in all credit card fields',
        })
        break
      default:
        fieldSchema = z.string()
    }

    if (field.min !== undefined && 'min' in fieldSchema) {
      fieldSchema = (fieldSchema as any).min(
        field.min,
        { message: `Must be at least ${field.min}` },
      )
    }
    if (field.max !== undefined && 'max' in fieldSchema) {
      fieldSchema = (fieldSchema as any).max(
        field.max,
        { message: `Must be at most ${field.max}` },
      )
    }

    if (field.required !== true) {
      fieldSchema = fieldSchema.optional()
    }
    // if field name contains - then i add quotes around it to fix zod schema generation issue
    let fieldName = field.name
    if (field.name.includes('-')) {
      fieldName = `'${field.name}'`
    }
    schemaObject[fieldName] = fieldSchema as ZodTypeAny // Ensure fieldSchema is of type ZodTypeAny
  }

  formFields.flat().forEach(processField)

  return z.object(schemaObject)
}

export const zodSchemaToString = (schema: z.ZodTypeAny): string => {
  if (schema instanceof z.ZodDefault) {
    const defaultValue = (schema._def as any).defaultValue
    return `${zodSchemaToString(schema._def.innerType as z.ZodTypeAny)}.default(${JSON.stringify(typeof defaultValue === 'function' ? defaultValue() : defaultValue)})`
  }

  if (schema instanceof z.ZodBoolean) {
    return `z.boolean()`
  }

  if (schema instanceof z.ZodNumber) {
    let result = 'z.number()'
    if ('checks' in schema._def && schema._def.checks) {
      schema._def.checks.forEach((check: any) => {
        if (check.kind === 'min') {
          result += `.min(${check.value})`
        } else if (check.kind === 'max') {
          result += `.max(${check.value})`
        }
      })
    }
    return result
  }

  if (schema instanceof z.ZodString) {
    let result = 'z.string()'
    if ('checks' in schema._def && schema._def.checks) {
      schema._def.checks.forEach((check: any) => {
        if (check.kind === 'min') {
          result += `.min(${check.value})`
        } else if (check.kind === 'max') {
          result += `.max(${check.value})`
        }
      })
    }
    return result
  }

  if (schema instanceof z.ZodDate) {
    return `z.coerce.date()`
  }

  if (schema instanceof z.ZodArray) {
    return `z.array(${zodSchemaToString(schema.element as z.ZodTypeAny)}).min(1, { error: "Please select at least one item" })`
  }

  if (schema instanceof z.ZodTuple) {
    return `z.tuple([${(schema._def.items as z.ZodTypeAny[]).map((item: z.ZodTypeAny) => zodSchemaToString(item)).join(', ')}])`
  }

  if (schema instanceof z.ZodObject) {
    const shape = schema.shape
    const shapeStrs = Object.entries(shape).map(
      ([key, value]) => `${key}: ${zodSchemaToString(value as ZodTypeAny)}`,
    )
    return `z.object({
  ${shapeStrs.join(',\n  ')}
})`
  }

  if (schema instanceof z.ZodOptional) {
    return `${zodSchemaToString(schema.unwrap() as z.ZodTypeAny)}.optional()`
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
    'import { z } from "zod"',
    'import { cn } from "@/lib/utils"',
    'import { Button } from "@/components/ui/button"',
    'import {\n  Form,\n  FormControl,\n  FormDescription,\n  FormField,\n  FormItem,\n  FormLabel,\n  FormMessage,\n} from "@/components/ui/form"',
  ])

  const processField = (field: FormFieldType) => {
    switch (field.variant) {
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
          'import { Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"',
        )
        importSet.add('import { Calendar } from "@/components/ui/calendar"')
        importSet.add('import { Calendar as CalendarIcon } from "lucide-react"')
        break
      case 'Datetime Picker':
        importSet.add(
          'import { DatetimePicker } from "@/components/ui/datetime-picker"',
        )
        break
      case 'Smart Datetime Input':
        importSet.add(
          'import { SmartDatetimeInput } from "@/components/ui/smart-datetime-input"',
        )
        field.locale &&
          importSet.add(`import { ${field.locale} } from "date-fns/locale"`)
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
      case 'Location Input':
        importSet.add(
          'import LocationSelector from "@/components/ui/location-input"',
        )
        break
      case 'Select':
        importSet.add(
          'import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"',
        )
        break
      case 'Signature Input':
        importSet.add('import { useRef } from "react"')
        importSet.add(
          "import SignatureInput from '@/components/ui/signature-input'",
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
      case 'Credit Card':
        importSet.add(
          'import { CreditCard } from "@/components/ui/credit-card"',
        )
        break
      default:
        importSet.add(
          `import { ${field.variant} } from "@/components/ui/${field.variant.toLowerCase()}"`,
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
    if (field.variant === 'Combobox') {
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
    } else if (field.variant === 'File Input') {
      constantSet.add(`
        const [files, setFiles] = useState<File[] | null>(null); 

        const dropZoneConfig = {
          maxFiles: 5,
          maxSize: 1024 * 1024 * 4,
          multiple: true,
        };`)
    } else if (field.variant === 'Location Input') {
      constantSet.add(`
        const [countryName, setCountryName] = useState<string>('')
        const [stateName, setStateName] = useState<string>('')
        `)
    } else if (field.variant === 'Signature Input') {
      constantSet.add(`const canvasRef = useRef<HTMLCanvasElement>(null)`)
    } else if (field.variant === 'Credit Card') {
      constantSet.add(`const [creditCard, setCreditCard] = useState({
        cardholderName: '',
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        cvvLabel: 'CVC' as const
      })`)
    }
  })

  return constantSet
}

// New function to generate defaultValues
export const generateDefaultValues = (
  fields: FormFieldOrGroup[],
  existingDefaultValues: Record<string, any> = {},
): Record<string, any> => {
  const defaultValues: Record<string, any> = { ...existingDefaultValues }

  fields.flat().forEach((field) => {
    // Skip if field already has a default value
    if (defaultValues[field.name]) return

    // Handle field variants
    switch (field.variant) {
      case 'Checkbox':
      case 'Switch':
        defaultValues[field.name] = true
        break
      case 'Multi Select':
        defaultValues[field.name] = ['React']
        break
      case 'Tags Input':
        defaultValues[field.name] = []
        break
      case 'Datetime Picker':
      case 'Date Picker':
        defaultValues[field.name] = new Date()
        break
      case 'Rating':
        defaultValues[field.name] = '0'
        break
      case 'Slider':
        defaultValues[field.name] = 5
        break
      case 'Credit Card':
        defaultValues[field.name] = JSON.stringify({
          cardholderName: '',
          cardNumber: '',
          expiryMonth: '',
          expiryYear: '',
          cvv: '',
          cvvLabel: 'CVC'
        })
        break
    }
  })

  return defaultValues
}

export const generateDefaultValuesString = (
  fields: FormFieldOrGroup[],
): string => {
  const defaultValues: Record<string, any> = {}
  const dateFields: string[] = []

  fields.flat().forEach((field) => {
    if (field.variant === 'Multi Select') {
      defaultValues[field.name] = ['React']
    } else if (field.variant === 'Tags Input') {
      defaultValues[field.name] = ['test']
    } else if (
      field.variant === 'Datetime Picker' ||
      field.variant === 'Smart Datetime Input' ||
      field.variant === 'Date Picker'
    ) {
      dateFields.push(field.name)
      delete defaultValues[field.name]
    }
  })

  if (Object.keys(defaultValues).length === 0 && dateFields.length === 0) {
    return ''
  }

  // Convert defaultValues to string, handling both regular values and date fields
  const regularValuesString =
    Object.keys(defaultValues).length > 0
      ? JSON.stringify(defaultValues).slice(1, -1) // Remove the outer {}
      : ''

  const dateFieldsString = dateFields
    .map((fieldName) => `"${fieldName}": new Date()`)
    .join(',')

  const combinedString = [regularValuesString, dateFieldsString]
    .filter(Boolean)
    .join(',')

  return `defaultValues: {${combinedString}},`
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

export const generateMultiStepFormCode = (steps: FormStep[]): string => {
  const imports = new Set([
    '"use client"',
    'import { useState } from "react"',
    'import { useForm } from "react-hook-form"',
    'import { zodResolver } from "@hookform/resolvers/zod"',
    'import * as z from "zod"',
    'import { Button } from "@/components/ui/button"',
    'import { Progress } from "@/components/ui/progress"',
    'import { Form } from "@/components/ui/form"',
    'import { MultiStepForm } from "@/components/ui/multi-step-form"',
    'import { toast } from "sonner"'
  ])

  steps.forEach(step => {
    const stepImports = generateImports(step.fields)
    stepImports.forEach(imp => imports.add(imp))
  })

  const stepsConfig = steps.map(step => ({
    id: step.id,
    title: step.title,
    description: step.description,
    fields: step.fields,
    validation: step.validation
  }))

  const component = `
export default function MultiStepFormComponent() {
  const config = {
    steps: ${JSON.stringify(stepsConfig, null, 2)},
    currentStep: 0,
    allowStepSkipping: false,
    showProgress: true,
    saveProgress: true,
    onComplete: (data) => {
      console.log('Form completed:', data);
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      );
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <MultiStepForm config={config} />
    </div>
  )
}
  `

  return Array.from(imports).join('\n') + '\n\n' + component
}

export const generateJsonSchemaCode = (formFields: FormFieldOrGroup[]): string => {
  const jsonSchema = generateFormJsonSchema(formFields.flat(), {
    title: 'Generated Form Schema',
    description: 'JSON Schema generated from form builder'
  })
  return JSON.stringify(jsonSchema, null, 2)
}
