'use client'

import { Link } from 'next-view-transitions'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { BaseAuthShell } from '@/components/templates/base-auth-shell'
import { emailSchema } from '@/lib/validation-schemas'

const forgotPasswordSchema = z.object({
  email: emailSchema,
})

export default function ForgotPasswordPreview() {
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    await new Promise((resolve) => setTimeout(resolve, 900))
    toast.success(`Reset link ready for ${values.email}`)
  }

  return (
    <BaseAuthShell
      title="Forgot password"
      description="Enter your email and we will send you a reset link."
      footer={
        <>
          Remembered your password? <Link href="/templates/authentication/sign-in">Back to sign in</Link>
        </>
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Field data-invalid={!!form.formState.errors.email}>
            <FieldLabel htmlFor="forgot-password-email">Email</FieldLabel>
            <Input
              id="forgot-password-email"
              type="email"
              placeholder="m@example.com"
              aria-invalid={!!form.formState.errors.email}
              {...form.register('email')}
            />
            <FieldError errors={[form.formState.errors.email]} />
          </Field>
          <Field>
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="size-4 animate-spin" />}
              Send reset link
            </Button>
          </Field>
          <FieldDescription className="text-center">
            Need a new account? <Link href="/templates/authentication/sign-up">Create account</Link>
          </FieldDescription>
        </FieldGroup>
      </form>
    </BaseAuthShell>
  )
}
