'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Field, FieldLabel, FieldDescription, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  terms: z.boolean().refine((val) => val === true, 'You must accept the terms'),
})

type FormData = z.infer<typeof formSchema>

export function FieldTestReactHookForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
      terms: false,
    },
  })

  function onSubmit(values: FormData) {
    console.log('React Hook Form values:', values)
    toast.success('Form submitted successfully!')
    form.reset()
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full max-w-md">
      <Field>
        <FieldLabel htmlFor="name">Full Name</FieldLabel>
        <Input 
          id="name" 
          placeholder="Evil Rabbit" 
          {...form.register('name')}
          aria-invalid={!!form.formState.errors.name}
        />
        <FieldDescription>Enter your full legal name.</FieldDescription>
        <FieldError>{form.formState.errors.name?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input 
          id="email" 
          type="email" 
          placeholder="evil@rabbit.com" 
          {...form.register('email')}
          aria-invalid={!!form.formState.errors.email}
        />
        <FieldDescription>We&apos;ll never share your email.</FieldDescription>
        <FieldError>{form.formState.errors.email?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel htmlFor="message">Message</FieldLabel>
        <Textarea 
          id="message" 
          placeholder="Your message here..." 
          {...form.register('message')}
          aria-invalid={!!form.formState.errors.message}
        />
        <FieldDescription>Tell us what you think.</FieldDescription>
        <FieldError>{form.formState.errors.message?.message}</FieldError>
      </Field>

      <Field className="flex flex-row items-start space-x-3 space-y-0">
        <Checkbox 
          id="terms" 
          {...form.register('terms')}
          aria-invalid={!!form.formState.errors.terms}
        />
        <div className="space-y-1 leading-none">
          <FieldLabel htmlFor="terms">Accept terms and conditions</FieldLabel>
          <FieldDescription>
            You agree to our Terms of Service and Privacy Policy.
          </FieldDescription>
          <FieldError>{form.formState.errors.terms?.message}</FieldError>
        </div>
      </Field>

      <Button type="submit">Submit</Button>
    </form>
  )
}
