import { execFileSync } from 'node:child_process'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import { fieldVariants } from '@/components/field-variants'
import { createField, type FormFieldOrGroup } from '@/components/field-variants/form'
import { formatCode } from '@/lib/format-code'
import {
  FORM_LIBRARIES,
  formInstallCommand,
  generateFormCode,
  type FormLibrary,
} from '@/lib/form-code'
import type { FormFieldType } from '@/types'

const libraries = Object.values(FORM_LIBRARIES)

const field = (variant: string, overrides: Partial<FormFieldType> = {}): FormFieldType => ({
  ...createField(variant),
  name: variant.toLowerCase().replace(/\W+/g, '_'),
  ...overrides,
})

/** Every variant, required and optional, plus a two-column row and odd names. */
const kitchenSink: FormFieldOrGroup[] = [
  ...fieldVariants.map((variant) => field(variant.name)),
  ...fieldVariants.map((variant) =>
    field(variant.name, { name: `optional_${variant.name.toLowerCase().replace(/\W+/g, '_')}`, required: false }),
  ),
  field('Input', { name: 'email', type: 'email' }),
  field('Input', { name: 'age', type: 'number', min: 18, max: 99 }),
  field('Smart Datetime Input', { name: 'meeting', locale: 'fr', hour12: true }),
  field('Textarea', { name: 'quote', placeholder: 'Say "hi" {now}', description: 'Use <b> & {braces}' }),
  [field('Input', { name: 'first-name' }), field('Input', { name: 'last-name', label: 'Last {name}' })],
]

describe.each(libraries)('%s', (library) => {
  it('generates syntactically valid TSX for every variant', async () => {
    await expect(formatCode(generateFormCode(kitchenSink, library))).resolves.toContain(
      'export default function MyForm()',
    )
  })

  it('imports each component once and only what it renders', () => {
    const code = generateFormCode([field('Checkbox'), field('Input')], library)
    expect(code).toContain('import { Checkbox } from "@/components/ui/checkbox"')
    expect(code).toContain('import { Input } from "@/components/ui/input"')
    expect(code).not.toContain('@/components/ui/select')
    expect(code.match(/import \{ Input \}/g)).toHaveLength(1)
  })

  it('renders a bound control for every field (no <Input> fallbacks)', () => {
    const code = generateFormCode([field('Phone'), field('Rating')], library)
    expect(code).toContain('<PhoneInput')
    expect(code).toContain('<Rating')
    expect(code).not.toContain('<Input')
  })
})

describe('generated code', () => {
  it('starts with the command that installs its components', () => {
    const fields = [field('Input'), field('Phone')]
    expect(generateFormCode(fields, 'react-hook-form')).toMatch(/^\/\/ npx shadcn@latest add /)
    expect(formInstallCommand(fields)).toBe(
      'npx shadcn@latest add button field sonner input https://www.shadcn-form.com/r/phone-input.json',
    )
  })

  it('binds Radix-only controls through the library, not register()', () => {
    const code = generateFormCode([field('Switch'), field('Select')], 'react-hook-form')
    expect(code).not.toContain('register(')
    expect(code).toContain('onCheckedChange={(checked) => field.onChange(checked === true)}')
  })

  it('validates TanStack forms with the schema through Standard Schema', () => {
    const code = generateFormCode([field('Input')], 'tanstack-form')
    expect(code).toContain('onSubmit: formSchema')
    expect(code).not.toContain('zod-form-adapter')
  })

  // Writes the kitchen-sink form for each library next to the app and
  // typechecks it against the app's own components and packages.
  it('typechecks for every library', () => {
    const dir = resolve(process.cwd(), '__tests__/.generated')
    rmSync(dir, { recursive: true, force: true })
    mkdirSync(dir, { recursive: true })
    for (const library of libraries as FormLibrary[]) {
      writeFileSync(resolve(dir, `${library}.tsx`), generateFormCode(kitchenSink, library))
    }
    let output = ''
    try {
      execFileSync(resolve(process.cwd(), 'node_modules/.bin/tsc'), ['-p', '__tests__/generated.tsconfig.json'], {
        encoding: 'utf8',
      })
    } catch (error) {
      output = (error as { stdout?: string }).stdout ?? String(error)
    }
    // Only the generated files; the app's own components are linted elsewhere.
    const errors = output.split('\n').filter((line) => line.startsWith('__tests__/.generated/'))
    expect(errors).toEqual([])
  }, 60_000)
})
