import React from 'react'
import { Highlight, themes } from 'prism-react-renderer'
import { Controller, useForm, type Control } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FieldGroup } from '@/components/ui/field'
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
import { getFieldVariant } from '@/components/field-variants'
import { FieldShell } from '@/components/field-variants/field-shell'
import {
  buildFormSchema,
  formDefaultValues,
  type FormFieldOrGroup,
} from '@/components/field-variants/form'

import { Code, Eye, Files } from 'lucide-react'
import { generateFormCode, type FormLibrary } from '@/lib/form-code'
import { formatCode } from '@/lib/format-code'
import { VscJson } from 'react-icons/vsc'
import { SiReacthookform, SiReactquery } from 'react-icons/si'

export type FormPreviewProps = {
  formFields: FormFieldOrGroup[]
  selectedLibrary: FormLibrary
  onLibraryChange: (library: FormLibrary) => void
}

const COL_SPAN: Record<number, string> = { 2: 'col-span-6', 3: 'col-span-4' }

function FieldPreview({ field, control }: { field: FormFieldType; control: Control }) {
  const { Control: VariantControl } = getFieldVariant(field.variant)
  const id = `preview-${field.name}`
  return (
    <Controller
      name={field.name}
      control={control}
      render={({ field: bound, fieldState }) => (
        <FieldShell field={field} id={id} invalid={fieldState.invalid} error={fieldState.error}>
          <VariantControl
            field={field}
            id={id}
            value={bound.value}
            onChange={bound.onChange}
            onBlur={bound.onBlur}
            invalid={fieldState.invalid}
          />
        </FieldShell>
      )}
    />
  )
}

const renderFormFields = (fields: FormFieldOrGroup[], control: Control) =>
  fields.map((fieldOrGroup, index) =>
    Array.isArray(fieldOrGroup) ? (
      <div key={index} className="grid grid-cols-12 gap-4">
        {fieldOrGroup.map((field) => (
          <div key={field.name} className={COL_SPAN[fieldOrGroup.length] ?? 'col-span-12'}>
            <FieldPreview field={field} control={control} />
          </div>
        ))}
      </div>
    ) : (
      <FieldPreview key={fieldOrGroup.name} field={fieldOrGroup} control={control} />
    ),
  )

export const FormPreview: React.FC<FormPreviewProps> = ({
  formFields,
  selectedLibrary,
  onLibraryChange,
}) => {
  const form = useForm({
    resolver: zodResolver(buildFormSchema(formFields)),
    defaultValues: formDefaultValues(formFields),
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

  const generatedCode = React.useMemo(
    () => generateFormCode(formFields, selectedLibrary),
    [formFields, selectedLibrary],
  )
  const [formattedCode, setFormattedCode] = React.useState(generatedCode)
  React.useEffect(() => {
    let current = true
    formatCode(generatedCode)
      .then((code) => current && setFormattedCode(code))
      .catch(() => current && setFormattedCode(generatedCode))
    return () => {
      current = false
    }
  }, [generatedCode])

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
            onValueChange={(value) => value && onLibraryChange(value as FormLibrary)}
          >
            <SelectTrigger className="w-auto px-2 gap-2">
              <SelectValue placeholder="Select library">
                {selectedLibrary === 'react-hook-form' && (
                  <SiReacthookform className="size-5 text-[#EC5990]" />
                )}
                {selectedLibrary === 'tanstack-form' && (
                  <SiReactquery className="size-5" />
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
              <form onSubmit={form.handleSubmit(onSubmit)} className="py-5 max-w-lg">
                <FieldGroup>
                  {renderFormFields(formFields, form.control)}
                  <Button type="submit" className="w-fit">
                    Submit
                  </Button>
                </FieldGroup>
              </form>
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
