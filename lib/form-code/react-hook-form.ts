import type { FormLibraryAdapter } from './types'

const submitToast = `toast(
      <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        <code className="text-white">{JSON.stringify(values, null, 2)}</code>
      </pre>
    )`

export const reactHookForm: FormLibraryAdapter = {
  imports: [
    'import { Controller, useForm } from "react-hook-form"',
    'import { zodResolver } from "@hookform/resolvers/zod"',
  ],
  setup: (defaultValues) => `const form = useForm<z.input<typeof formSchema>, unknown, z.output<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: ${defaultValues},
})

function onSubmit(values: z.output<typeof formSchema>) {
  try {
    ${submitToast}
  } catch (error) {
    console.error("Form submission error", error)
    toast.error("Failed to submit the form. Please try again.")
  }
}`,
  form: (fields) => `<form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto max-w-3xl py-10">
  <FieldGroup>
${fields}
    <Button type="submit">Submit</Button>
  </FieldGroup>
</form>`,
  field: (name, shell) => `<Controller
  name=${JSON.stringify(name)}
  control={form.control}
  render={({ field, fieldState }) => (
${shell({
  id: 'field.name',
  name: 'field.name',
  value: 'field.value',
  onChange: (value) => `field.onChange(${value})`,
  onBlur: 'field.onBlur',
  invalid: 'fieldState.invalid',
  error: '<FieldError errors={[fieldState.error]} />',
})}
  )}
/>`,
}
