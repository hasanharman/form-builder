'use client'

import { Link } from 'next-view-transitions'

import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { BaseAuthShell } from '@/components/templates/base-auth-shell'

export default function SignInPreview() {
  return (
    <BaseAuthShell
      title="Sign in"
      description={
        <>
          Don&apos;t have an account? <Link href="/templates/authentication/sign-up">Sign up</Link>
        </>
      }
      showOauth
      footer={
        <>
          By clicking continue, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
        </>
      }
    >
      <form>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="sign-in-email">Email</FieldLabel>
            <Input id="sign-in-email" type="email" placeholder="m@example.com" required />
          </Field>
          <Field>
            <div className="flex items-center justify-between gap-2">
              <FieldLabel htmlFor="sign-in-password">Password</FieldLabel>
              <Link href="/templates/authentication/forgot-password" className="text-sm underline">
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              id="sign-in-password"
              placeholder="******"
              autoComplete="current-password"
              required
            />
          </Field>
          <Field>
            <Button type="submit" className="w-full">
              Continue
            </Button>
          </Field>
          <FieldSeparator>Or</FieldSeparator>
        </FieldGroup>
      </form>
    </BaseAuthShell>
  )
}
