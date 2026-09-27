'use client'

import Link from 'next/link'
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
} from '@/components/ui/field'
import { PasswordInput } from '@/components/ui/password-input'
import { BaseAuthShell } from '@/components/templates/base-auth-shell'
import { ClerkInstallHint } from '@/components/templates/clerk-install-hint'
import { passwordSchema } from '@/lib/validation-schemas'

const clerkResetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z
      .string()
      .min(6, { message: 'Please confirm your password' }),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

export default function ClerkResetPasswordPreview() {
  const form = useForm<z.infer<typeof clerkResetPasswordSchema>>({
    resolver: zodResolver(clerkResetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit() {
    await new Promise((resolve) => setTimeout(resolve, 900))
    toast.success('Clerk reset flow is ready to connect to complete reset.')
  }

  return (
    <BaseAuthShell
      title="Set new password"
      description="Use this screen after verification to complete reset_password_email_code."
      footer={
        <>
          Need another code?{' '}
          <Link href="/forgot-password">
            Restart reset
          </Link>
          .
        </>
      }
    >
      <div className="space-y-4">
        <ClerkInstallHint />

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field data-invalid={!!form.formState.errors.password}>
              <FieldLabel htmlFor="clerk-new-password">New password</FieldLabel>
              <PasswordInput
                id="clerk-new-password"
                autoComplete="new-password"
                placeholder="Enter new password"
                aria-invalid={!!form.formState.errors.password}
                {...form.register('password')}
              />
              <FieldError errors={[form.formState.errors.password]} />
            </Field>

            <Field data-invalid={!!form.formState.errors.confirmPassword}>
              <FieldLabel htmlFor="clerk-confirm-new-password">
                Confirm new password
              </FieldLabel>
              <PasswordInput
                id="clerk-confirm-new-password"
                autoComplete="new-password"
                placeholder="Confirm new password"
                aria-invalid={!!form.formState.errors.confirmPassword}
                {...form.register('confirmPassword')}
              />
              <FieldError errors={[form.formState.errors.confirmPassword]} />
            </Field>

            <input
              type="hidden"
              name="strategy"
              value="reset_password_email_code"
            />

            <Field>
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="size-4 animate-spin" />
                )}
                Update password
              </Button>
            </Field>

            <FieldDescription className="text-center">
              Back to{' '}
              <Link href="/sign-in">
                sign in
              </Link>
            </FieldDescription>
          </FieldGroup>
        </form>
      </div>
    </BaseAuthShell>
  )
}
