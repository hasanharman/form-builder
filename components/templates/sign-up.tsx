'use client'

import { Link } from 'next-view-transitions'

import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { BaseAuthShell } from '@/components/templates/base-auth-shell'

export default function SignUpPreview() {
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
      <form>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="sign-up-name">Full name</FieldLabel>
            <Input id="sign-up-name" type="text" placeholder="John Doe" required />
          </Field>
          <Field>
            <FieldLabel htmlFor="sign-up-email">Email</FieldLabel>
            <Input id="sign-up-email" type="email" placeholder="m@example.com" required />
          </Field>
          <Field>
            <FieldLabel htmlFor="sign-up-password">Password</FieldLabel>
            <PasswordInput
              id="sign-up-password"
              placeholder="Create a password"
              autoComplete="new-password"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="sign-up-confirm-password">Confirm password</FieldLabel>
            <PasswordInput
              id="sign-up-confirm-password"
              placeholder="Confirm your password"
              autoComplete="new-password"
              required
            />
          </Field>
          <Field>
            <Button type="submit" className="w-full">
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
