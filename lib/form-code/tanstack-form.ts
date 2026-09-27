import type { FormLibraryAdapter } from './types'

export const tanstackForm: FormLibraryAdapter = {
  imports: ['import { useForm } from "@tanstack/react-form"'],
  setup: (defaultValues) => `const form = useForm({
  defaultValues: ${defaultValues} as z.input<typeof formSchema>,
  validators: {
    onSubmit: formSchema,
  },
  onSubmit: async ({ value }) => {
    try {
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(value, null, 2)}</code>
        </pre>
      )
    } catch (error) {
      console.error("Form submission error", error)
      toast.error("Failed to submit the form. Please try again.")
    }
  },
})`,
  form: (fields) => `<form
  onSubmit={(event) => {
    event.preventDefault()
    form.handleSubmit()
  }}
  className="mx-auto max-w-3xl py-10"
>
  <FieldGroup>
${fields}
    <Button type="submit">Submit</Button>
  </FieldGroup>
</form>`,
  field: (name, shell) => `<form.Field
  name=${JSON.stringify(name)}
  children={(field) => {
    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
    return (
${shell({
  id: 'field.name',
  name: 'field.name',
  value: 'field.state.value',
  onChange: (value) => `field.handleChange(${value})`,
  onBlur: 'field.handleBlur',
  invalid: 'isInvalid',
  error: '<FieldError errors={field.state.meta.errors} />',
})}
    )
  }}
/>`,
}
