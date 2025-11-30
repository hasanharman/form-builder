import React, { useRef } from 'react'
import { Highlight, themes } from 'prism-react-renderer'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { renderFormField } from '@/screens/render-form-field'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import If from '@/components/ui/if'
import { FormFieldType } from '@/types'
import { FormLibrary } from '@/constants'

import { Code, Eye, Files } from 'lucide-react'
import {
  generateZodSchema,
  generateFormCode,
  generateDefaultValues,
  generateFormCodeForLibrary,
} from '@/screens/generate-code-parts'
import { formatJSXCode } from '@/lib/utils'
import { VscJson } from 'react-icons/vsc'
import { SiReacthookform, SiReactquery } from 'react-icons/si'
import { FaReact } from 'react-icons/fa'

export type FormFieldOrGroup = FormFieldType | FormFieldType[]

export type FormPreviewProps = {
  formFields: FormFieldOrGroup[]
  selectedLibrary: FormLibrary
  onLibraryChange: (library: FormLibrary) => void
}

const renderFormFields = (fields: FormFieldOrGroup[], form: any) => {
  return fields.map((fieldOrGroup, index) => {
    if (Array.isArray(fieldOrGroup)) {
      // Calculate column span based on number of fields in the group
      const getColSpan = (totalFields: number) => {
        switch (totalFields) {
          case 2:
            return 6 // Two columns
          case 3:
            return 4 // Three columns
          default:
            return 12 // Single column or fallback
        }
      }

      return (
        <div key={index} className="grid grid-cols-12 gap-4">
          {fieldOrGroup.map((field, subIndex) => (
            <FormField
              key={field.name}
              control={form.control}
              name={field.name}
              render={({ field: formField }) => (
                <FormItem
                  className={`col-span-${getColSpan(fieldOrGroup.length)}`}
                >
                  <FormControl>
                    {React.cloneElement(
                      renderFormField(field, form) as React.ReactElement,
                      {
                        ...formField,
                      },
                    )}
                  </FormControl>
                </FormItem>
              )}
            />
          ))}
        </div>
      )
    } else {
      return (
        <FormField
          key={index}
          control={form.control}
          name={fieldOrGroup.name}
          render={({ field: formField }) => (
            <FormItem className="col-span-12">
              <FormControl>
                {React.cloneElement(
                  renderFormField(fieldOrGroup, form) as React.ReactElement,
                  {
                    ...formField,
                  },
                )}
              </FormControl>
            </FormItem>
          )}
        />
      )
    }
  })
}

export const FormPreview: React.FC<FormPreviewProps> = ({
  formFields,
  selectedLibrary,
  onLibraryChange,
}) => {
  const formSchema = generateZodSchema(formFields)

  const defaultVals = generateDefaultValues(formFields)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultVals,
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

  const generatedCode = generateFormCodeForLibrary(formFields, selectedLibrary)
  const formattedCode = formatJSXCode(generatedCode)

  return (
    <div className="w-full h-full col-span-1 rounded-xl flex justify-center">
      <Tabs defaultValue="preview" className="w-full">
        <div className='flex items-center justify-between'>
          <TabsList >
            <TabsTrigger value="preview">
              <div className="flex items-center gap-1">
                <Eye className='size-4' /> <span className='text-sm'>Preview</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="json">
              <div className="flex items-center gap-1">
                <VscJson />
                <span className='text-sm'>JSON</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="code">
              <div className="flex items-center gap-1">
                <Code className='size-4' />
                <span className='text-sm'>Code</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <Select
            value={selectedLibrary}
            onValueChange={(value) => onLibraryChange(value as FormLibrary)}
          >
            <SelectTrigger className="w-auto px-2 gap-2">
              <SelectValue placeholder="Select library">
                {selectedLibrary === 'react-hook-form' && (
                  <SiReacthookform className="size-5 text-[#EC5990]" />
                )}
                {selectedLibrary === 'tanstack-form' && (
                  <SiReactquery className="size-5" />
                )}
                {selectedLibrary === 'server-actions' && (
                  <FaReact className="size-5 text-blue-500" />
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Form Libraries</SelectLabel>
                <SelectItem value="react-hook-form">
                  <div className="flex items-center gap-2">
                    <SiReacthookform className="size-4 text-[#EC5990]" />
                    <span>React Hook Form</span>
                  </div>
                </SelectItem>
                <SelectItem value="tanstack-form">
                  <div className="flex items-center gap-2">
                    <SiReactquery className="size-4" />
                    <span>TanStack Form</span>
                  </div>
                </SelectItem>
                <SelectItem value="server-actions" disabled>
                  <div className="flex items-center gap-2">
                    <FaReact className="size-4 text-blue-500" />
                    <span>Server Actions (Coming Soon)</span>
                  </div>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <TabsContent
          value="preview"
          className="space-y-4 h-full md:max-h-[70vh] overflow-auto"
        >
          <If
            condition={formFields.length > 0}
            render={() => (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4 py-5 max-w-lg mx-auto"
                >
                  {renderFormFields(formFields, form)}
                  <Button type="submit">Submit</Button>
                </form>
              </Form>
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
              <pre className="p-4 text-sm bg-secondary rounded-lg h-full md:max-h-[70vh] overflow-auto">
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
                    navigator.clipboard.writeText(formattedCode)
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
                        <div key={i} {...getLineProps({ line, key: i })}>
                          {line.map((token: any, key: any) => (
                            <span key={key} {...getTokenProps({ token, key })} />
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
