'use client'

import React from 'react'
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { z } from 'zod'
import { Field, FieldLabel, FieldDescription, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function FieldTestTanStackForm() {
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      message: '',
      terms: false,
    },
    onSubmit: async ({ value }) => {
      console.log('TanStack Form values:', value)
      toast.success('Form submitted successfully!')
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-6 w-full max-w-md"
    >
      <form.Field
        name="name"
        validators={{
          onChange: z.string().min(2, 'Name must be at least 2 characters'),
        }}
      >
        {(field) => (
          <Field>
            <FieldLabel htmlFor="name">Full Name</FieldLabel>
            <Input
              id="name"
              placeholder="Evil Rabbit"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
            <FieldDescription>Enter your full legal name.</FieldDescription>
            <FieldError>
              {field.state.meta.errors.length > 0 && 
                (typeof field.state.meta.errors[0] === 'string'
                  ? field.state.meta.errors[0]
                  : field.state.meta.errors[0]?.message || 'Validation error')}
            </FieldError>
          </Field>
        )}
      </form.Field>

      <form.Field
        name="email"
        validators={{
          onChange: z.string().email('Invalid email address'),
        }}
      >
        {(field) => (
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="evil@rabbit.com"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
            <FieldDescription>We&apos;ll never share your email.</FieldDescription>
            <FieldError>
              {field.state.meta.errors.length > 0 && 
                (typeof field.state.meta.errors[0] === 'string'
                  ? field.state.meta.errors[0]
                  : field.state.meta.errors[0]?.message || 'Validation error')}
            </FieldError>
          </Field>
        )}
      </form.Field>

      <form.Field
        name="message"
        validators={{
          onChange: z.string().min(10, 'Message must be at least 10 characters'),
        }}
      >
        {(field) => (
          <Field>
            <FieldLabel htmlFor="message">Message</FieldLabel>
            <Textarea
              id="message"
              placeholder="Your message here..."
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
            <FieldDescription>Tell us what you think.</FieldDescription>
            <FieldError>
              {field.state.meta.errors.length > 0 && 
                (typeof field.state.meta.errors[0] === 'string'
                  ? field.state.meta.errors[0]
                  : field.state.meta.errors[0]?.message || 'Validation error')}
            </FieldError>
          </Field>
        )}
      </form.Field>

      <form.Field
        name="terms"
        validators={{
          onChange: z.boolean().refine((val) => val === true, 'You must accept the terms'),
        }}
      >
        {(field) => (
          <Field className="flex flex-row items-start space-x-3 space-y-0">
            <Checkbox
              id="terms"
              checked={field.state.value}
              onCheckedChange={(checked) => field.handleChange(checked as boolean)}
            />
            <div className="space-y-1 leading-none">
              <FieldLabel htmlFor="terms">Accept terms and conditions</FieldLabel>
              <FieldDescription>
                You agree to our Terms of Service and Privacy Policy.
              </FieldDescription>
              <FieldError>
                {field.state.meta.errors.length > 0 && 
                  (typeof field.state.meta.errors[0] === 'string'
                    ? field.state.meta.errors[0]
                    : field.state.meta.errors[0]?.message || 'Validation error')}
              </FieldError>
            </div>
          </Field>
        )}
      </form.Field>

      <Button type="submit">Submit</Button>
    </form>
  )
}
