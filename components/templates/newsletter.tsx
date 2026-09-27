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

import { emailSchema } from '@/lib/validation-schemas'

// Schema for newsletter form validation
const formSchema = z.object({
  email: emailSchema,
})

export default function NewsletterFormPreview() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Simulate a successful newsletter form submission
      console.log(values)
      toast.success(
        'You have been subscribed to our newsletter successfully! (Simulated)',
      )
    } catch (error) {
      console.error('Error submitting newsletter form', error)
      toast.error('Failed to subscribe to our newsletter. Please try again.')
    }
  }

  return (
    <div className="flex min-h-[50vh] h-full w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">
            Subscribe to our newsletter
          </CardTitle>
          <CardDescription>
            Please fill out the form below and you will be subscribed to our
            newsletter.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-4">
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

              <Button type="submit" className="w-full">
                Subscribe
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
