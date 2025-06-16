import React from 'react'
import {
  useForm,
  UseFormReturn,
  FieldValues,
  DefaultValues,
  Path,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form'
import { isNotEmpty } from '@/lib/utils'

interface FormWrapperProps<TFieldValues extends FieldValues> {
  schema: z.ZodType<TFieldValues>
  defaultValues: DefaultValues<TFieldValues>
  onSubmit: (values: TFieldValues) => void
  children: (form: UseFormReturn<TFieldValues>) => React.ReactNode
}

export function FormWrapper<TFieldValues extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  children,
}: FormWrapperProps<TFieldValues>) {
  const form = useForm<TFieldValues>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>{children(form)}</form>
    </Form>
  )
}

interface FormFieldWrapperProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>
  name: keyof TFieldValues
  label: string
  description?: string
  children: React.ReactNode
}

export function FormFieldWrapper<TFieldValues extends FieldValues>({
  form,
  name,
  label,
  description,
  children,
}: FormFieldWrapperProps<TFieldValues>) {
  return (
    <FormField
      control={form.control}
      name={name as Path<TFieldValues>}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {React.cloneElement(children as React.ReactElement, { ...field })}
          </FormControl>
          {isNotEmpty(description) && (
            <FormDescription>{description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
