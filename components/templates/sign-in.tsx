'use client'

import { Link } from 'next-view-transitions'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { BaseAuthShell } from '@/components/templates/base-auth-shell'
import { emailSchema } from '@/lib/validation-schemas'

const signInSchema = z.object({
  email: emailSchema,
})

export default function SignInPreview() {
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    await new Promise((resolve) => setTimeout(resolve, 900))
    toast.success(`Login ready for ${values.email}`)
  }

  return (
    <BaseAuthShell
      title="Welcome to Acme Inc."
      description={
        <>
          Don&apos;t have an account? <Link href="/templates/authentication/sign-up">Sign up</Link>
        </>
      }
      showOauth
      footer={
        <>
          By clicking continue, you agree to our <a href="#">Terms of Service</a> and{' '}
          <a href="#">Privacy Policy</a>.
        </>
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Field data-invalid={!!form.formState.errors.email}>
            <FieldLabel htmlFor="sign-in-email">Email</FieldLabel>
            <Input
              id="sign-in-email"
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
              Login
            </Button>
          </Field>
          <FieldSeparator>Or</FieldSeparator>
          <FieldDescription className="text-center">
            Need help signing in?{' '}
            <Link href="/templates/authentication/forgot-password">Reset password</Link>
          </FieldDescription>
        </FieldGroup>
      </form>
    </BaseAuthShell>
  )
}
