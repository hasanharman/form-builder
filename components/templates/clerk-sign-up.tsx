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
import {
  emailSchema,
  nameSchema,
  passwordSchema,
} from '@/lib/validation-schemas'

const clerkSignUpSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  emailAddress: emailSchema,
  password: passwordSchema,
})

export default function ClerkSignUpPreview() {
  const form = useForm<z.infer<typeof clerkSignUpSchema>>({
    resolver: zodResolver(clerkSignUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      emailAddress: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof clerkSignUpSchema>) {
    await new Promise((resolve) => setTimeout(resolve, 900))
    toast.success(`Clerk signup payload ready for ${values.emailAddress}`)
  }

  function onSocialSignUp(provider: 'oauth_google' | 'oauth_apple') {
    toast.success(`Clerk social strategy: ${provider}`)
  }

  return (
    <BaseAuthShell
      title="Create account"
      description={
        <>
          Already have an account?{' '}
          <Link href="/sign-in">
            Sign in
          </Link>
          .
        </>
      }
      footer={
        <>
          By creating an account, you agree to our <a href="#">Terms</a> and{' '}
          <a href="#">Privacy Policy</a>.
        </>
      }
    >
      <div className="space-y-4">
        <ClerkInstallHint />

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field data-invalid={!!form.formState.errors.firstName}>
              <FieldLabel htmlFor="clerk-sign-up-first-name">
                First name
              </FieldLabel>
              <Input
                id="clerk-sign-up-first-name"
                placeholder="John"
                autoComplete="given-name"
                aria-invalid={!!form.formState.errors.firstName}
                {...form.register('firstName')}
              />
              <FieldError errors={[form.formState.errors.firstName]} />
            </Field>

            <Field data-invalid={!!form.formState.errors.lastName}>
              <FieldLabel htmlFor="clerk-sign-up-last-name">
                Last name
              </FieldLabel>
              <Input
                id="clerk-sign-up-last-name"
                placeholder="Doe"
                autoComplete="family-name"
                aria-invalid={!!form.formState.errors.lastName}
                {...form.register('lastName')}
              />
              <FieldError errors={[form.formState.errors.lastName]} />
            </Field>

            <Field data-invalid={!!form.formState.errors.emailAddress}>
              <FieldLabel htmlFor="clerk-sign-up-email">Email</FieldLabel>
              <Input
                id="clerk-sign-up-email"
                type="email"
                placeholder="m@example.com"
                autoComplete="email"
                aria-invalid={!!form.formState.errors.emailAddress}
                {...form.register('emailAddress')}
              />
              <FieldError errors={[form.formState.errors.emailAddress]} />
            </Field>

            <Field data-invalid={!!form.formState.errors.password}>
              <FieldLabel htmlFor="clerk-sign-up-password">Password</FieldLabel>
              <PasswordInput
                id="clerk-sign-up-password"
                placeholder="Create a password"
                autoComplete="new-password"
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
                onClick={() => onSocialSignUp('oauth_apple')}
                className="w-full"
              >
                <Icons.apple className="size-4" />
                Apple
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onSocialSignUp('oauth_google')}
                className="w-full"
              >
                <Icons.google className="size-4" />
                Google
              </Button>
            </Field>

            <FieldDescription className="text-center">
              Need to recover access?{' '}
              <Link href="/forgot-password">
                Reset password
              </Link>
            </FieldDescription>
          </FieldGroup>
        </form>
      </div>
    </BaseAuthShell>
  )
}
