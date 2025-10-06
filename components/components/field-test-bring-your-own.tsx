'use client'

import React, { useState } from 'react'
import { Field, FieldLabel, FieldDescription, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function FieldTestBringYourOwn() {
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
      toast.success('Form submitted successfully!')
      setFormData({ name: '', email: '', message: '', terms: false })
      setErrors({})
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
      <Field>
        <FieldLabel htmlFor="name">Full Name</FieldLabel>
        <Input
          id="name"
          placeholder="Evil Rabbit"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <FieldDescription>Enter your full legal name.</FieldDescription>
        {errors.name && <FieldError>{errors.name}</FieldError>}
      </Field>

      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input
          id="email"
          type="email"
          placeholder="evil@rabbit.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <FieldDescription>We&apos;ll never share your email.</FieldDescription>
        {errors.email && <FieldError>{errors.email}</FieldError>}
      </Field>

      <Field>
        <FieldLabel htmlFor="message">Message</FieldLabel>
        <Textarea
          id="message"
          placeholder="Your message here..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        />
        <FieldDescription>Tell us what you think.</FieldDescription>
        {errors.message && <FieldError>{errors.message}</FieldError>}
      </Field>

      <Field className="flex flex-row items-start space-x-3 space-y-0">
        <Checkbox
          id="terms"
          checked={formData.terms}
          onCheckedChange={(checked) => setFormData({ ...formData, terms: checked as boolean })}
        />
        <div className="space-y-1 leading-none">
          <FieldLabel htmlFor="terms">Accept terms and conditions</FieldLabel>
          <FieldDescription>
            You agree to our Terms of Service and Privacy Policy.
          </FieldDescription>
          {errors.terms && <FieldError>{errors.terms}</FieldError>}
        </div>
      </Field>

      <Button type="submit">Submit</Button>
    </form>
  )
}
