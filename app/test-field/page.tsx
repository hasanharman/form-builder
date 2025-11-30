'use client'

import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm as useTanStackForm } from '@tanstack/react-form'
import { z } from 'zod'
import { Field, FieldLabel, FieldDescription, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Card } from '@/components/ui/card'

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  terms: z.boolean().refine((val) => val === true, 'You must accept the terms'),
})

type FormValues = z.infer<typeof formSchema>

function ServerActionsForm() {
  async function handleSubmit(formData: globalThis.FormData) {
    const data = Object.fromEntries(formData)
    console.log('Server Actions form data:', data)
    toast.success('Server Actions: Form submitted successfully!')
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Server Actions</h2>
      <form action={handleSubmit} className="space-y-6 max-w-md">
        <Field>
          <FieldLabel htmlFor="sa-name">Full Name</FieldLabel>
          <Input id="sa-name" name="name" placeholder="Evil Rabbit" required />
          <FieldDescription>Enter your full legal name.</FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="sa-email">Email</FieldLabel>
          <Input id="sa-email" name="email" type="email" placeholder="evil@rabbit.com" required />
          <FieldDescription>We&apos;ll never share your email.</FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="sa-message">Message</FieldLabel>
          <Textarea id="sa-message" name="message" placeholder="Your message here..." />
          <FieldDescription>Tell us what you think.</FieldDescription>
        </Field>

        <Field className="flex flex-row items-start space-x-3 space-y-0">
          <Checkbox id="sa-terms" name="terms" />
          <div className="space-y-1 leading-none">
            <FieldLabel htmlFor="sa-terms">Accept terms and conditions</FieldLabel>
            <FieldDescription>
              You agree to our Terms of Service and Privacy Policy.
            </FieldDescription>
          </div>
        </Field>

        <Button type="submit">Submit</Button>
      </form>
    </Card>
  )
}

function ReactHookFormForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
      terms: false,
    },
  })

  function onSubmit(values: FormValues) {
    console.log('React Hook Form values:', values)
    toast.success('React Hook Form: Form submitted successfully!')
    form.reset()
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">React Hook Form</h2>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md">
        <Field>
          <FieldLabel htmlFor="rhf-name">Full Name</FieldLabel>
          <Input 
            id="rhf-name" 
            placeholder="Evil Rabbit" 
            {...form.register('name')}
            aria-invalid={!!form.formState.errors.name}
          />
          <FieldDescription>Enter your full legal name.</FieldDescription>
          <FieldError>{form.formState.errors.name?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="rhf-email">Email</FieldLabel>
          <Input 
            id="rhf-email" 
            type="email" 
            placeholder="evil@rabbit.com" 
            {...form.register('email')}
            aria-invalid={!!form.formState.errors.email}
          />
          <FieldDescription>We&apos;ll never share your email.</FieldDescription>
          <FieldError>{form.formState.errors.email?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="rhf-message">Message</FieldLabel>
          <Textarea 
            id="rhf-message" 
            placeholder="Your message here..." 
            {...form.register('message')}
            aria-invalid={!!form.formState.errors.message}
          />
          <FieldDescription>Tell us what you think.</FieldDescription>
          <FieldError>{form.formState.errors.message?.message}</FieldError>
        </Field>

        <Field className="flex flex-row items-start space-x-3 space-y-0">
          <Controller
            name="terms"
            control={form.control}
            render={({ field }) => (
              <Checkbox 
                id="rhf-terms" 
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-invalid={!!form.formState.errors.terms}
              />
            )}
          />
          <div className="space-y-1 leading-none">
            <FieldLabel htmlFor="rhf-terms">Accept terms and conditions</FieldLabel>
            <FieldDescription>
              You agree to our Terms of Service and Privacy Policy.
            </FieldDescription>
            <FieldError>{form.formState.errors.terms?.message}</FieldError>
          </div>
        </Field>

        <Button type="submit">Submit</Button>
      </form>
    </Card>
  )
}

function TanStackFormForm() {
  const form = useTanStackForm({
    defaultValues: {
      name: '',
      email: '',
      message: '',
      terms: false,
    },
    onSubmit: async ({ value }) => {
      console.log('TanStack Form values:', value)
      toast.success('TanStack Form: Form submitted successfully!')
    },
  })

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">TanStack Form</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-6 max-w-md"
      >
        <form.Field
          name="name"
          validators={{
            onChange: z.string().min(2, 'Name must be at least 2 characters'),
          }}
        >
          {(field) => (
            <Field>
              <FieldLabel htmlFor="ts-name">Full Name</FieldLabel>
              <Input
                id="ts-name"
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
              <FieldLabel htmlFor="ts-email">Email</FieldLabel>
              <Input
                id="ts-email"
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
              <FieldLabel htmlFor="ts-message">Message</FieldLabel>
              <Textarea
                id="ts-message"
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
                id="ts-terms"
                checked={field.state.value}
                onCheckedChange={(checked) => field.handleChange(checked as boolean)}
              />
              <div className="space-y-1 leading-none">
                <FieldLabel htmlFor="ts-terms">Accept terms and conditions</FieldLabel>
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
    </Card>
  )
}

function BringYourOwnForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    terms: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  function validateForm() {
    const newErrors: Record<string, string> = {}

    if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    if (!formData.email.includes('@')) {
      newErrors.email = 'Invalid email address'
    }

    if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }

    if (!formData.terms) {
      newErrors.terms = 'You must accept the terms'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (validateForm()) {
      console.log('Bring Your Own Form data:', formData)
      toast.success('Bring Your Own Form: Form submitted successfully!')
      setFormData({ name: '', email: '', message: '', terms: false })
      setErrors({})
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Bring Your Own Form</h2>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        <Field>
          <FieldLabel htmlFor="byo-name">Full Name</FieldLabel>
          <Input
            id="byo-name"
            placeholder="Evil Rabbit"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <FieldDescription>Enter your full legal name.</FieldDescription>
          {errors.name && <FieldError>{errors.name}</FieldError>}
        </Field>

        <Field>
          <FieldLabel htmlFor="byo-email">Email</FieldLabel>
          <Input
            id="byo-email"
            type="email"
            placeholder="evil@rabbit.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <FieldDescription>We&apos;ll never share your email.</FieldDescription>
          {errors.email && <FieldError>{errors.email}</FieldError>}
        </Field>

        <Field>
          <FieldLabel htmlFor="byo-message">Message</FieldLabel>
          <Textarea
            id="byo-message"
            placeholder="Your message here..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />
          <FieldDescription>Tell us what you think.</FieldDescription>
          {errors.message && <FieldError>{errors.message}</FieldError>}
        </Field>

        <Field className="flex flex-row items-start space-x-3 space-y-0">
          <Checkbox
            id="byo-terms"
            checked={formData.terms}
            onCheckedChange={(checked) => setFormData({ ...formData, terms: checked as boolean })}
          />
          <div className="space-y-1 leading-none">
            <FieldLabel htmlFor="byo-terms">Accept terms and conditions</FieldLabel>
            <FieldDescription>
              You agree to our Terms of Service and Privacy Policy.
            </FieldDescription>
            {errors.terms && <FieldError>{errors.terms}</FieldError>}
          </div>
        </Field>

        <Button type="submit">Submit</Button>
      </form>
    </Card>
  )
}

export default function TestFieldPage() {
  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Field Component Test Page</h1>
        <p className="text-muted-foreground">
          Test all 4 form library integrations with the Field component
        </p>
      </div>

      <div className="grid gap-8">
        <ServerActionsForm />
        <ReactHookFormForm />
        <TanStackFormForm />
        <BringYourOwnForm />
      </div>
    </div>
  )
}
