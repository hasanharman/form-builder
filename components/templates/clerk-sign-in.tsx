'use client'

import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Icons } from '@/components/templates/oauth-icons'
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
import { ClerkInstallHint } from '@/components/templates/clerk-install-hint'
import { emailSchema, passwordSchema } from '@/lib/validation-schemas'

const clerkSignInSchema = z.object({
  identifier: emailSchema,
  password: passwordSchema,
})

export default function ClerkSignInPreview() {
  const form = useForm<z.infer<typeof clerkSignInSchema>>({
    resolver: zodResolver(clerkSignInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof clerkSignInSchema>) {
    await new Promise((resolve) => setTimeout(resolve, 900))
    toast.success(`Clerk sign-in ready for ${values.identifier}`)
  }

  function onSocialSignIn(provider: 'oauth_google' | 'oauth_apple') {
    toast.success(`Clerk social strategy: ${provider}`)
  }

  return (
    <BaseAuthShell
      title="Welcome to Acme Inc."
      description={
        <>
          Clerk Elements style sign in.{' '}
          <Link href="/sign-up">
            Create an account
          </Link>
          .
        </>
      }
      footer={
        <>
          By continuing, you agree to our <a href="#">Terms</a> and{' '}
          <a href="#">Privacy Policy</a>.
        </>
      }
    >
      <div className="space-y-4">
        <ClerkInstallHint />

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field data-invalid={!!form.formState.errors.identifier}>
              <FieldLabel htmlFor="clerk-sign-in-email">Email</FieldLabel>
              <Input
                id="clerk-sign-in-email"
                type="email"
                autoComplete="username"
                placeholder="m@example.com"
                aria-invalid={!!form.formState.errors.identifier}
                {...form.register('identifier')}
              />
              <FieldError errors={[form.formState.errors.identifier]} />
            </Field>

            <Field data-invalid={!!form.formState.errors.password}>
              <div className="flex items-center justify-between gap-2">
                <FieldLabel htmlFor="clerk-sign-in-password">
                  Password
                </FieldLabel>
                <Link
                  href="/forgot-password"
                  className="text-sm underline"
                >
                  Forgot password?
                </Link>
              </div>
              <PasswordInput
                id="clerk-sign-in-password"
                autoComplete="current-password"
                placeholder="******"
                aria-invalid={!!form.formState.errors.password}
                {...form.register('password')}
              />
              <FieldError errors={[form.formState.errors.password]} />
            </Field>

            <input type="hidden" name="strategy" value="password" />

            <Field>
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="size-4 animate-spin" />
                )}
                Continue
              </Button>
            </Field>

            <FieldSeparator>Or</FieldSeparator>

            <Field className="grid gap-3 sm:grid-cols-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onSocialSignIn('oauth_apple')}
                className="w-full"
              >
                <Icons.apple className="size-4" />
                Apple
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onSocialSignIn('oauth_google')}
                className="w-full"
              >
                <Icons.google className="size-4" />
                Google
              </Button>
            </Field>

            <FieldDescription className="text-center">
              Don&apos;t have an account?{' '}
              <Link href="/sign-up">
                Sign up
              </Link>
            </FieldDescription>
          </FieldGroup>
        </form>
      </div>
    </BaseAuthShell>
  )
}
