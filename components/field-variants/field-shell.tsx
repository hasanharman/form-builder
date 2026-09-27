'use client'

import type { ReactNode } from 'react'

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import type { FormFieldType } from '@/types'
import { getFieldVariant } from './index'

/**
 * How a field's label, control, description and error are arranged. The
 * preview renders `FieldShell`; the generator prints `fieldShellSource`.
 * Keep the two in step.
 */

type ShellProps = {
  field: FormFieldType
  id: string
  invalid: boolean
  error?: { message?: string }
  children: ReactNode
}

export function FieldShell({ field, id, invalid, error, children }: ShellProps) {
  const layout = getFieldVariant(field.variant).layout ?? 'stacked'
  const label = (
    <FieldLabel htmlFor={id}>
      {field.label}
      {field.required && <span aria-hidden> *</span>}
    </FieldLabel>
  )
  const description = field.description ? <FieldDescription>{field.description}</FieldDescription> : null
  const message = invalid ? <FieldError errors={[error]} /> : null

  if (layout === 'stacked') {
    return (
      <Field data-invalid={invalid} className={field.className}>
        {label}
        {children}
        {description}
        {message}
      </Field>
    )
  }

  const content = (
    <FieldContent>
      {label}
      {description}
      {message}
    </FieldContent>
  )
  return (
    <Field
      orientation="horizontal"
      data-invalid={invalid}
      className={layout === 'control-last' ? 'rounded-lg border p-4' : field.className}
    >
      {layout === 'control-first' ? children : content}
      {layout === 'control-first' ? content : children}
    </Field>
  )
}

type ShellSource = {
  /** Expressions the form library provides. */
  id: string
  invalid: string
  /** The `<FieldError />` element, rendered only when invalid. */
  error: string
}

const indent = (source: string, spaces: number) =>
  source
    .split('\n')
    .map((line) => (line ? ' '.repeat(spaces) + line : line))
    .join('\n')

export function fieldShellSource(field: FormFieldType, s: ShellSource, control: string): string {
  const layout = getFieldVariant(field.variant).layout ?? 'stacked'
  const label = `<FieldLabel htmlFor={${s.id}}>${escapeText(field.label)}</FieldLabel>`
  const description = field.description
    ? `<FieldDescription>${escapeText(field.description)}</FieldDescription>`
    : ''
  const message = `{${s.invalid} && ${s.error}}`

  if (layout === 'stacked') {
    return [
      `<Field data-invalid={${s.invalid}}>`,
      indent([label, control, description, message].filter(Boolean).join('\n'), 2),
      '</Field>',
    ].join('\n')
  }

  const content = [
    '<FieldContent>',
    indent([label, description, message].filter(Boolean).join('\n'), 2),
    '</FieldContent>',
  ].join('\n')
  const parts = layout === 'control-first' ? [control, content] : [content, control]
  const className = layout === 'control-last' ? ' className="rounded-lg border p-4"' : ''
  return [
    `<Field orientation="horizontal" data-invalid={${s.invalid}}${className}>`,
    indent(parts.join('\n'), 2),
    '</Field>',
  ].join('\n')
}

/** Text placed between JSX tags, with the characters JSX treats specially escaped. */
function escapeText(text: string) {
  return /[{}<>]/.test(text) ? `{${JSON.stringify(text)}}` : text
}
