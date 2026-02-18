'use client'

import { Link } from 'next-view-transitions'

import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { BaseAuthShell } from '@/components/templates/base-auth-shell'

export default function ShadcnAuthPreview() {
  return (
    <BaseAuthShell
      title="Welcome to Acme Inc."
      description={
        <>
          Shadcn starter. <Link href="/templates/authentication/sign-up">Create an account</Link>.
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
      <form>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" type="email" placeholder="m@example.com" required />
          </Field>

          <Field>
            <div className="flex items-center justify-between gap-2">
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Link href="/templates/authentication/forgot-password" className="text-sm underline">
                Forgot password?
              </Link>
            </div>
            <PasswordInput id="password" placeholder="******" autoComplete="current-password" required />
          </Field>

          <Field>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </Field>

          <FieldSeparator>Or</FieldSeparator>

          <FieldDescription className="text-center">
            Don&apos;t have an account? <Link href="/templates/authentication/sign-up">Sign up</Link>
          </FieldDescription>
        </FieldGroup>
      </form>
    </BaseAuthShell>
  )
}
