'use client'

import { Link } from 'next-view-transitions'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { PasswordInput } from '@/components/ui/password-input'
import { BaseAuthShell } from '@/components/templates/base-auth-shell'
import { passwordSchema } from '@/lib/validation-schemas'

const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(6, { message: 'Please confirm your password' }),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

export default function ResetPasswordPreview() {
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit() {
    await new Promise((resolve) => setTimeout(resolve, 900))
    toast.success('Password update ready to integrate.')
  }

  return (
    <BaseAuthShell
      title="Reset password"
      description="Create a new secure password for your account."
      footer={
        <>
          Need to start over? <Link href="/templates/authentication/forgot-password">Request another link</Link>
        </>
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Field data-invalid={!!form.formState.errors.password}>
            <FieldLabel htmlFor="new-password">New password</FieldLabel>
            <PasswordInput
              id="new-password"
              placeholder="Enter new password"
              autoComplete="new-password"
              aria-invalid={!!form.formState.errors.password}
              {...form.register('password')}
            />
            <FieldError errors={[form.formState.errors.password]} />
          </Field>
          <Field data-invalid={!!form.formState.errors.confirmPassword}>
            <FieldLabel htmlFor="confirm-new-password">Confirm new password</FieldLabel>
            <PasswordInput
              id="confirm-new-password"
              placeholder="Confirm new password"
              autoComplete="new-password"
              aria-invalid={!!form.formState.errors.confirmPassword}
              {...form.register('confirmPassword')}
            />
            <FieldError errors={[form.formState.errors.confirmPassword]} />
          </Field>
          <Field>
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="size-4 animate-spin" />}
              Update password
            </Button>
          </Field>
          <FieldDescription className="text-center">
            Back to <Link href="/templates/authentication/sign-in">sign in</Link>
          </FieldDescription>
        </FieldGroup>
      </form>
    </BaseAuthShell>
  )
}
