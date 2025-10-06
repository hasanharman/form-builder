'use client'

import React from 'react'
import { Field, FieldLabel, FieldDescription, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function FieldTestServerActions() {
  async function handleSubmit(formData: FormData) {
    const data = Object.fromEntries(formData)
    console.log('Server Actions form data:', data)
    toast.success('Form submitted successfully!')
  }

  return (
    <form action={handleSubmit} className="space-y-6 w-full max-w-md">
      <Field>
        <FieldLabel htmlFor="name">Full Name</FieldLabel>
        <Input id="name" name="name" placeholder="Evil Rabbit" required />
        <FieldDescription>Enter your full legal name.</FieldDescription>
      </Field>

      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input id="email" name="email" type="email" placeholder="evil@rabbit.com" required />
        <FieldDescription>We&apos;ll never share your email.</FieldDescription>
      </Field>

      <Field>
        <FieldLabel htmlFor="message">Message</FieldLabel>
        <Textarea id="message" name="message" placeholder="Your message here..." />
        <FieldDescription>Tell us what you think.</FieldDescription>
      </Field>

      <Field className="flex flex-row items-start space-x-3 space-y-0">
        <Checkbox id="terms" name="terms" />
        <div className="space-y-1 leading-none">
          <FieldLabel htmlFor="terms">Accept terms and conditions</FieldLabel>
          <FieldDescription>
            You agree to our Terms of Service and Privacy Policy.
          </FieldDescription>
        </div>
      </Field>

      <Button type="submit">Submit</Button>
    </form>
  )
}
