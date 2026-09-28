'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { contactFormSchema } from '@/lib/validation-schemas'

const formSchema = contactFormSchema

export default function ContactFormPreview() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Simulate a successful contact form submission
      console.log(values)
      toast.success('Your message has been sent successfully!')
    } catch (error) {
      console.error('Error submitting contact form', error)
      toast.error('Failed to send your message. Please try again.')
    }
  }

  return (
    <div className="flex min-h-[60vh] h-full w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Contact Us</CardTitle>
          <CardDescription>
            Please fill out the form below and we will get back to you shortly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-4">
              {/* Name Field */}
              <Field
                className="grid gap-2"
                data-invalid={!!form.formState.errors.name}
              >
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  placeholder="John Doe"
                  type="text"
                  autoComplete="name"
                  aria-invalid={!!form.formState.errors.name}
                  {...form.register('name')}
                />
                <FieldError errors={[form.formState.errors.name]} />
              </Field>

              {/* Email Field */}
              <Field
                className="grid gap-2"
                data-invalid={!!form.formState.errors.email}
              >
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  placeholder="johndoe@mail.com"
                  type="email"
                  autoComplete="email"
                  aria-invalid={!!form.formState.errors.email}
                  {...form.register('email')}
                />
                <FieldError errors={[form.formState.errors.email]} />
              </Field>

              {/* Message Field */}
              <Field
                className="grid gap-2"
                data-invalid={!!form.formState.errors.message}
              >
                <FieldLabel htmlFor="message">Message</FieldLabel>
                <Textarea
                  id="message"
                  placeholder="Your message..."
                  autoComplete="off"
                  aria-invalid={!!form.formState.errors.message}
                  {...form.register('message')}
                />
                <FieldError errors={[form.formState.errors.message]} />
              </Field>

              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
