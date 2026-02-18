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
import { PasswordInput } from '@/components/ui/password-input'
import { BaseAuthShell } from '@/components/templates/base-auth-shell'
import { emailSchema, nameSchema, passwordSchema } from '@/lib/validation-schemas'

const signUpSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(6, { message: 'Please confirm your password' }),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

export default function SignUpPreview() {
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    await new Promise((resolve) => setTimeout(resolve, 900))
    toast.success(`Account setup ready for ${values.email}`)
  }

  return (
    <BaseAuthShell
      title="Create account"
      description={
        <>
          Already have an account? <Link href="/templates/authentication/sign-in">Sign in</Link>
        </>
      }
      showOauth
      footer={
        <>
          By creating an account, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
        </>
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Field data-invalid={!!form.formState.errors.name}>
            <FieldLabel htmlFor="sign-up-name">Full name</FieldLabel>
            <Input
              id="sign-up-name"
              type="text"
              placeholder="John Doe"
              aria-invalid={!!form.formState.errors.name}
              {...form.register('name')}
            />
            <FieldError errors={[form.formState.errors.name]} />
          </Field>
          <Field data-invalid={!!form.formState.errors.email}>
            <FieldLabel htmlFor="sign-up-email">Email</FieldLabel>
            <Input
              id="sign-up-email"
              type="email"
              placeholder="m@example.com"
              aria-invalid={!!form.formState.errors.email}
              {...form.register('email')}
            />
            <FieldError errors={[form.formState.errors.email]} />
          </Field>
          <Field data-invalid={!!form.formState.errors.password}>
            <FieldLabel htmlFor="sign-up-password">Password</FieldLabel>
            <PasswordInput
              id="sign-up-password"
              placeholder="Create a password"
              autoComplete="new-password"
              aria-invalid={!!form.formState.errors.password}
              {...form.register('password')}
            />
            <FieldError errors={[form.formState.errors.password]} />
          </Field>
          <Field data-invalid={!!form.formState.errors.confirmPassword}>
            <FieldLabel htmlFor="sign-up-confirm-password">Confirm password</FieldLabel>
            <PasswordInput
              id="sign-up-confirm-password"
              placeholder="Confirm your password"
              autoComplete="new-password"
              aria-invalid={!!form.formState.errors.confirmPassword}
              {...form.register('confirmPassword')}
            />
            <FieldError errors={[form.formState.errors.confirmPassword]} />
          </Field>
          <Field>
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="size-4 animate-spin" />}
              Create account
            </Button>
          </Field>
          <FieldSeparator>Or</FieldSeparator>
          <FieldDescription className="text-center">
            Need account access help? <Link href="/templates/authentication/forgot-password">Reset here</Link>
          </FieldDescription>
        </FieldGroup>
      </form>
    </BaseAuthShell>
  )
}
