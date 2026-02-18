'use client'

import { Link } from 'next-view-transitions'

import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { PasswordInput } from '@/components/ui/password-input'
import { BaseAuthShell } from '@/components/templates/base-auth-shell'

export default function ResetPasswordPreview() {
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
      <form>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="new-password">New password</FieldLabel>
            <PasswordInput
              id="new-password"
              placeholder="Enter new password"
              autoComplete="new-password"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="confirm-new-password">Confirm new password</FieldLabel>
            <PasswordInput
              id="confirm-new-password"
              placeholder="Confirm new password"
              autoComplete="new-password"
              required
            />
          </Field>
          <Field>
            <Button type="submit" className="w-full">
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
