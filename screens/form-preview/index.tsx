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
import If from '@/components/ui/if'
import { FormFieldType } from '@/types'

import { Files } from 'lucide-react'
import {
  generateZodSchema,
  generateFormCode,
  generateDefaultValues,
} from '@/screens/generate-code-parts'
import { formatJSXCode } from '@/lib/utils'

export type FormFieldOrGroup = FormFieldType | FormFieldType[]

export type FormPreviewProps = {
  formFields: FormFieldOrGroup[]
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

export const FormPreview: React.FC<FormPreviewProps> = ({ formFields }) => {
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

  const generatedCode = generateFormCode(formFields)
  const formattedCode = formatJSXCode(generatedCode)

  return (
    <div className="w-full h-full col-span-1 rounded-xl flex justify-center relative">
      <Tabs defaultValue="preview" className="w-full relative">
        <TabsList className="absolute top-2 left-1/2 -translate-x-1/2 flex justify-center w-fit mx-auto z-10">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="json">JSON</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <TabsContent
          value="preview"
          className="space-y-4 h-full overflow-y-auto mt-0 pt-10"
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
        <TabsContent value="json" className="mt-0 h-full">
          <If
            condition={formFields.length > 0}
            render={() => (
              <pre className="p-4 text-sm bg-secondary h-full rounded-br-xl overflow-auto">
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
        <TabsContent value="code" className="mt-0 h-full">
          <If
            condition={formFields.length > 0}
            render={() => (
              <div className="relative w-full h-full">
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
                <div className="w-full h-full overflow-y-auto rounded-br-xl bg-gray-100">
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
                        className={`${className} p-4 text-sm bg-gray-100`}
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
