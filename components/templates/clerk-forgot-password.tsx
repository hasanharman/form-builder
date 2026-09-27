'use client'

import { useState } from 'react'
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
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { BaseAuthShell } from '@/components/templates/base-auth-shell'
import { ClerkInstallHint } from '@/components/templates/clerk-install-hint'
import { emailSchema, passwordSchema } from '@/lib/validation-schemas'

const clerkForgotPasswordSchema = z.object({
  emailAddress: emailSchema,
})

const clerkResetStrategySchema = z.object({
  code: z
    .string()
    .length(6, { message: 'Enter the 6-digit verification code' }),
  password: passwordSchema,
})

export default function ClerkForgotPasswordPreview() {
  const [step, setStep] = useState<'request' | 'reset'>('request')
  const requestForm = useForm<z.infer<typeof clerkForgotPasswordSchema>>({
    resolver: zodResolver(clerkForgotPasswordSchema),
    defaultValues: {
      emailAddress: '',
    },
  })
  const resetForm = useForm<z.infer<typeof clerkResetStrategySchema>>({
    resolver: zodResolver(clerkResetStrategySchema),
    defaultValues: {
      code: '',
      password: '',
    },
  })

  async function onRequest(values: z.infer<typeof clerkForgotPasswordSchema>) {
    await new Promise((resolve) => setTimeout(resolve, 900))
    toast.success(`Verification code sent to ${values.emailAddress}`)
    setStep('reset')
  }

  async function onReset() {
    await new Promise((resolve) => setTimeout(resolve, 900))
    toast.success('Password reset strategy is ready to connect to Clerk.')
  }

  return (
    <BaseAuthShell
      title="Forgot password"
      description={
        step === 'request'
          ? 'Enter your account email to start reset_password_email_code.'
          : 'Enter the code from your email and set a new password.'
      }
      footer={
        <>
          Back to{' '}
          <Link href="/sign-in">
            sign in
          </Link>
          .
        </>
      }
    >
      {step === 'request' ? (
        <div className="space-y-4">
          <ClerkInstallHint />

          <form onSubmit={requestForm.handleSubmit(onRequest)}>
            <FieldGroup>
              <Field data-invalid={!!requestForm.formState.errors.emailAddress}>
                <FieldLabel htmlFor="clerk-forgot-email">Email</FieldLabel>
                <Input
                  id="clerk-forgot-email"
                  type="email"
                  placeholder="m@example.com"
                  autoComplete="email"
                  aria-invalid={!!requestForm.formState.errors.emailAddress}
                  {...requestForm.register('emailAddress')}
                />
                <FieldError
                  errors={[requestForm.formState.errors.emailAddress]}
                />
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
                  disabled={requestForm.formState.isSubmitting}
                >
                  {requestForm.formState.isSubmitting && (
                    <Loader2 className="size-4 animate-spin" />
                  )}
                  Send verification code
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Need a new account?{' '}
                <Link href="/sign-up">
                  Create one
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          <ClerkInstallHint />

          <form onSubmit={resetForm.handleSubmit(onReset)}>
            <FieldGroup>
              <Field data-invalid={!!resetForm.formState.errors.code}>
                <FieldLabel htmlFor="clerk-reset-code">
                  Verification code
                </FieldLabel>
                <Input
                  id="clerk-reset-code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="123456"
                  aria-invalid={!!resetForm.formState.errors.code}
                  {...resetForm.register('code')}
                />
                <FieldError errors={[resetForm.formState.errors.code]} />
              </Field>

              <Field data-invalid={!!resetForm.formState.errors.password}>
                <FieldLabel htmlFor="clerk-reset-password">
                  New password
                </FieldLabel>
                <PasswordInput
                  id="clerk-reset-password"
                  autoComplete="new-password"
                  placeholder="Enter new password"
                  aria-invalid={!!resetForm.formState.errors.password}
                  {...resetForm.register('password')}
                />
                <FieldError errors={[resetForm.formState.errors.password]} />
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
                  disabled={resetForm.formState.isSubmitting}
                >
                  {resetForm.formState.isSubmitting && (
                    <Loader2 className="size-4 animate-spin" />
                  )}
                  Reset password
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Didn&apos;t receive a code?{' '}
                <button
                  type="button"
                  className="underline underline-offset-4"
                  onClick={() => toast.success('New code request prepared.')}
                >
                  Resend
                </button>
              </FieldDescription>
            </FieldGroup>
          </form>
        </div>
      )}
    </BaseAuthShell>
  )
}
