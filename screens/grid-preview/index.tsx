import React from 'react'
import { Highlight, themes } from 'prism-react-renderer'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { js_beautify } from 'js-beautify'

import { renderFormField } from '@/screens/render-form-field'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormDescription,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import If from '@/components/ui/if'
import { FormFieldType } from '@/types'
import { generateCodeSnippet } from '../generate-code-field'

import { Files } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

export type FormPreviewProps = {
  formFields: FormFieldType[]
  layout: any
}

const generateZodSchema = (formFields: FormFieldType[]) => {
  const schemaObject: Record<string, any> = {}

  formFields.forEach((field) => {
    if (field.type !== 'Label') {
      let fieldSchema
      switch (field.type) {
        case 'Checkbox':
        case 'Switch':
          fieldSchema = z.boolean()
          if (field.required) {
            fieldSchema = fieldSchema.refine((value) => value === true, {
              message: `${field.label} is required`,
            })
          }
          break
        case 'Slider':
          fieldSchema = z.coerce.number()
          if (field.required) {
            fieldSchema = fieldSchema.min(1, {
              message: `${field.label} is required`,
            })
          }
          break
        case 'Number':
          fieldSchema = z.coerce.number()
          if (field.required) {
            fieldSchema = fieldSchema.min(1, {
              message: `${field.label} is required`,
            })
          }
          break
        case 'Date':
          fieldSchema = z.date()
          if (field.required) {
            fieldSchema = fieldSchema.refine((date) => !isNaN(date.getTime()), {
              message: `${field.label} is required`,
            })
          }
          break
        default:
          fieldSchema = z.string()
          if (field.required) {
            fieldSchema = fieldSchema.min(1, {
              message: `${field.label} is required`,
            })
          }
          break
      }

      schemaObject[field.name] = fieldSchema
    }
  })

  const schema = z.object(schemaObject)

  // Debugging: Log the generated schema
  return schema
}

const getZodSchema = (formFields: FormFieldType[]) => {
  const schemaObject: Record<string, z.ZodTypeAny> = {}

  formFields.forEach((field) => {
    if (field.type !== 'Label') {
      let fieldSchema: z.ZodTypeAny
      switch (field.type) {
        case 'Checkbox':
        case 'Switch':
          fieldSchema = field.required
            ? z.boolean().refine((value) => value === true, {
                message: `${field.label} is required`,
              })
            : z.boolean()
          break
        case 'Slider':
          fieldSchema = field.required
            ? z.number().min(1, { message: `${field.label} is required` })
            : z.number()
          break
        case 'Number':
          fieldSchema = field.required
            ? z.number().min(1, { message: `${field.label} is required` })
            : z.number()
          break
        case 'Date':
          fieldSchema = field.required
            ? z.date().refine((date) => !isNaN(date.getTime()), {
                message: `${field.label} is required`,
              })
            : z.date()
          break
        default:
          fieldSchema = field.required
            ? z.string().min(1, { message: `${field.label} is required` })
            : z.string()
          break
      }
      schemaObject[field.name] = fieldSchema
    }
  })

  return schemaObject
}

const zodSchemaToString = (schema: z.ZodTypeAny): string => {
  if (schema instanceof z.ZodBoolean) {
    return 'z.boolean()'
  } else if (schema instanceof z.ZodNumber) {
    return 'z.number()'
  } else if (schema instanceof z.ZodString) {
    return 'z.string()'
  } else if (schema instanceof z.ZodDate) {
    return 'z.date()'
  } else if (schema instanceof z.ZodEffects) {
    const baseSchema = zodSchemaToString(schema._def.schema)
    return `${baseSchema}`
  }
  // Add more cases as needed for other Zod types
  return 'z.unknown()' // fallback
}

const getZodSchemaString = (formFields: FormFieldType[]) => {
  const schemaObject = getZodSchema(formFields)
  const schemaEntries = Object.entries(schemaObject)
    .map(([key, value]) => {
      return `  ${key}: ${zodSchemaToString(value)}`
    })
    .join(',\n')

  return `const formSchema = z.object({\n${schemaEntries}\n});`
}

const generateFormCode = (formFields: FormFieldType[]) => {
  // Create a Set to store unique import statements
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

  const schema = getZodSchemaString(formFields)

  const constantSet: Set<string> = new Set() // Define type for constantSet

  formFields.forEach((field) => {
    switch (field.type) {
      case 'Combobox':
        importSet.add(
          'import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command"',
        )
        importSet.add(
          'import { Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"',
        )
        importSet.add('import { Check, ChevronsUpDown } from "lucide-react"')
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
        break
      case 'Date Picker':
        importSet.add('import { format } from "date-fns"')
        importSet.add(
          'import { Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"',
        )
        importSet.add('import { Calendar } from "@/components/ui/calendar"')
        importSet.add('import { Calendar as CalendarIcon } from "lucide-react"')
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
      case 'File Input':
        importSet.add('import { CloudUpload, Paperclip } from "lucide-react"')
        importSet.add(
          'import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from "@/components/ui/file-upload"',
        )
        constantSet.add(`
            const [files, setFiles] = useState<File[] | null>(null); 

            const dropZoneConfig = {
              maxFiles: 5,
              maxSize: 1024 * 1024 * 4,
              multiple: true,
            };`)
        break
      case 'Phone':
        importSet.add(
          'import { PhoneInput } from "@/components/ui/phone-input";',
        )
        break
      case 'Password':
        importSet.add(
          'import { PasswordInput } from "@/components/ui/password-input"',
        )
        break
      default:
        importSet.add(
          `import { ${
            field.type
          } } from "@/components/ui/${field.type.toLowerCase()}"`,
        )
        break
    }
  })

  const imports = Array.from(importSet).join('\n')

  const constants = Array.from(constantSet).join('\n') // Convert Set to string

  const component = `
export default function MyForm() {
  ${constants} // Insert constants here
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
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
        ${formFields
          .map((field) => `${generateCodeSnippet(field)}`)
          .join('\n        ')}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
  `

  return imports + '\n' + '\n' + schema + '\n' + component
}

const exampleLayout = [
  {
    w: 6,
    h: 2,
    x: 0,
    y: 0,
    i: 'name_1727777513190',
    minW: 3,
    maxW: 12,
    moved: false,
    static: false,
  },
  {
    w: 6,
    h: 2,
    x: 6,
    y: 0,
    i: 'name_1727777513557',
    minW: 3,
    maxW: 12,
    moved: false,
    static: false,
  },
  {
    w: 12,
    h: 2,
    x: 0,
    y: 2,
    i: 'name_1727777779856',
    minW: 3,
    maxW: 12,
    moved: false,
    static: false,
  },
]

export const GridPreview: React.FC<FormPreviewProps> = ({
  formFields,
  layout,
}) => {
  const formSchema = generateZodSchema(formFields)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  function onSubmit(data: any) {
    try {
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>,
      )
    } catch (error) {
      console.error('Form submission error', error)
      toast.error('Failed to submit the form. Please try again.')
    }
  }

  function formatJSXCode(code: string): string {
    return js_beautify(code, {
      indent_size: 2,
      indent_char: ' ',
      max_preserve_newlines: 2,
      preserve_newlines: true,
      keep_array_indentation: false,
      break_chained_methods: false,
      // indent_scripts: "normal",
      // brace_style: "collapse,preserve-inline",
      space_before_conditional: true,
      unescape_strings: false,
      jslint_happy: false,
      end_with_newline: false,
      wrap_line_length: 0,
      // indent_inner_html: false,
      comma_first: false,
      e4x: true,
      indent_empty_lines: false,
    })
  }

  // const renderGridItems = (formFields: FormFieldType[]) => {
  //   return layout.map((item: any) => {
  //     const field = formFields.find((field) => field.name === item.i)
  //     // Ensure field is found and valid before rendering
  //     if (field) {
  //       return (
  //         <div key={item.i} className={`col-span-${item.w} bg-muted border`}>
  //           {item.i} {/* Display the item identifier */}
  //         </div>
  //       )
  //     }
  //     return null // Return null if field is not found
  //   })
  // }

  const renderFormFields = () => {
    // const maxY = Math.max(...layout.map((item: any) => item.y + item.h))
    const gridStyle = {
      display: 'grid',
      gridTemplateColumns: 'repeat(12, 1fr)',
      // gridTemplateRows: `repeat(${maxY}, minmax(50px, auto))`,
      gap: '8px',
    }

    layout.sort((a: { y: number }, b: { y: number }) => a.y - b.y)

    return (
      <div style={gridStyle}>
        {layout.map((item: any) => {
          const field = formFields.find((field) => field.name === item.i)
          if (field) {
            const itemStyle = {
              gridColumn: `span ${item.w}`,
              // gridRow: `${item.y + 1} / span ${item.h}`,
            }
            return (
              <div key={item.i} style={itemStyle}>
                <FormField
                  control={form.control}
                  name={field.name}
                  render={() => <> {renderFormField(field)}</>}
                />
              </div>
            )
          }
          return null
        })}
      </div>
    )
  }

  const generatedCode = generateFormCode(formFields)

  const formattedCode = formatJSXCode(generatedCode)

  return (
    <div className="w-full h-full col-span-1 rounded-xl flex justify-center">
      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="flex justify-center w-fit mx-auto">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="json">JSON</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <TabsContent
          value="preview"
          className="space-y-4 h-full md:max-h-[70vh] overflow-auto"
        >
          <If
            condition={formFields.length > 0}
            render={() => (
              <div className="max-w-4xl mx-auto">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    {renderFormFields()}
                    <Button type="submit">Submit</Button>
                  </form>
                </Form>
              </div>
            )}
            otherwise={() => (
              <div className="h-[50vh] flex justify-center items-center">
                <p>No form element selected yet.</p>
              </div>
            )}
          />
        </TabsContent>
        <TabsContent value="json">
          <If
            condition={formFields.length > 0}
            render={() => (
              <pre className="p-4 text-sm bg-gray-100 rounded-lg h-full md:max-h-[70vh] overflow-auto">
                {JSON.stringify(formFields, null, 2)}
              </pre>
            )}
            otherwise={() => (
              <div className="h-[50vh] flex justify-center items-center">
                <p>No form element selected yet.</p>
              </div>
            )}
          />
        </TabsContent>
        <TabsContent value="code">
          <If
            condition={formFields.length > 0}
            render={() => (
              <div className="relative">
                <Button
                  className="absolute right-2 top-2"
                  variant="secondary"
                  size="icon"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedCode)
                    toast.success('Code copied to clipboard!')
                  }}
                >
                  <Files />
                </Button>
                <Highlight
                  code={formattedCode}
                  language="tsx"
                  theme={themes.oneDark}
                >
                  {({
                    className,
                    style,
                    tokens,
                    getLineProps,
                    getTokenProps,
                  }: any) => (
                    <pre
                      className={`${className} p-4 text-sm bg-gray-100 rounded-lg 
                      h-full md:max-h-[70vh] overflow-auto`}
                      style={style}
                    >
                      {tokens.map((line: any, i: number) => (
                        <div {...getLineProps({ line, key: i })}>
                          {line.map((token: any, key: any) => (
                            <span {...getTokenProps({ token, key })} />
                          ))}
                        </div>
                      ))}
                    </pre>
                  )}
                </Highlight>
              </div>
            )}
            otherwise={() => (
              <div className="h-[50vh] flex justify-center items-center">
                <p>No form element selected yet.</p>
              </div>
            )}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
