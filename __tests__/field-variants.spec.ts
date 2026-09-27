import { isValidPhoneNumber } from 'react-phone-number-input'
import { z } from 'zod'
import { describe, expect, it } from 'vitest'

import { fieldVariants, getFieldVariant } from '@/components/field-variants'
import {
  buildFormSchema,
  createField,
  formDefaultValues,
  formSchemaSource,
} from '@/components/field-variants/form'
import { code, printValue, toSource, toZod, zx } from '@/components/field-variants/schema-expr'
import type { FormFieldType } from '@/types'

/** Evaluates generated schema source with the identifiers generated code imports. */
function evaluate(source: string) {
  const js = source.replace(/<\w+>\(/g, '(') // drop TypeScript type arguments
  return new Function('z', 'isValidPhoneNumber', 'File', `return ${js}`)(z, isValidPhoneNumber, File)
}

const jsonSchema = (schema: z.ZodType) =>
  z.toJSONSchema(schema, { unrepresentable: 'any', io: 'input' })

describe('schema expressions', () => {
  it('prints and builds the same chain', () => {
    const expr = zx.string().min(3, { message: 'Too short' }).max(10)
    expect(toSource(expr)).toBe('z.string().min(3, { message: "Too short" }).max(10)')
    expect(toZod(expr).safeParse('ab').success).toBe(false)
    expect(toZod(expr).safeParse('abcd').success).toBe(true)
  })

  it('prints code() values by their source and runs them by their value', () => {
    const expr = zx.boolean().refine(code((value: boolean) => value, '(value) => value'))
    expect(toSource(expr)).toBe('z.boolean().refine((value) => value)')
    expect(toZod(expr).safeParse(false).success).toBe(false)
  })

  it('drops type arguments at runtime but keeps them in source', () => {
    const expr = (zx.coerce as any)['number<string>']()
    expect(toSource(expr)).toBe('z.coerce.number<string>()')
    expect(toZod(expr).parse('4')).toBe(4)
  })

  it('refuses functions without a source form', () => {
    expect(() => toSource(zx.instanceof(File))).toThrow(/code\(\)/)
  })

  it('prints nested schemas, dates and quoted keys', () => {
    expect(printValue({ 'a-b': new Date(), c: [1, 'x'] })).toBe('{ "a-b": new Date(), c: [1, "x"] }')
    expect(toSource(zx.object({ a: zx.string() }))).toBe('z.object({ a: z.string() })')
  })
})

const fieldOf = (variant: string, overrides: Partial<FormFieldType> = {}): FormFieldType => ({
  ...createField(variant),
  name: 'value',
  ...overrides,
})

describe.each(fieldVariants.map((variant) => [variant.name]))('%s variant', (name) => {
  const variant = getFieldVariant(name)

  it.each([true, false])('generates the schema it validates with (required: %s)', (required) => {
    const field = fieldOf(name, { required })
    const runtime = toZod(variant.schema(field))
    const generated = evaluate(toSource(variant.schema(field)))
    expect(jsonSchema(generated)).toEqual(jsonSchema(runtime))
  })

  it('accepts its default value when the field is optional', () => {
    const field = fieldOf(name, { required: false })
    const result = toZod(variant.schema(field)).safeParse(variant.defaultValue(field))
    expect(result.error?.issues ?? []).toEqual([])
  })

  it('creates new fields from its defaults', () => {
    const field = createField(name)
    expect(field.label).toBe(variant.defaults.label)
    expect(field.variant).toBe(name)
  })

  it('imports what its generated control uses', () => {
    const field = fieldOf(name)
    const control = variant.control(field, {
      id: 'field.name',
      name: 'field.name',
      value: 'field.value',
      onChange: (value) => `field.onChange(${value})`,
      onBlur: 'field.onBlur',
      invalid: 'invalid',
    })
    const imported = new Set(
      variant
        .imports(field)
        .flatMap((line) => line.match(/import\s+(?:\{([^}]*)\}|(\w+))/)?.slice(1) ?? [])
        .filter(Boolean)
        .flatMap((names) => names.split(',').map((n) => n.trim()))
        .filter(Boolean),
    )
    const components = [...control.matchAll(/<([A-Z]\w*)/g)].map((m) => m[1])
    for (const component of components) {
      if (component === 'FieldLabel') continue // provided by every form's Field imports
      expect(imported, `${name} renders <${component}>`).toContain(component)
    }
  })
})

describe.each([['email'], ['number']])('Input of type %s', (type) => {
  it.each([true, false])('generates the schema it validates with (required: %s)', (required) => {
    const field = fieldOf('Input', { type, required, min: 1, max: 9 })
    const expr = getFieldVariant('Input').schema(field)
    expect(jsonSchema(evaluate(toSource(expr)))).toEqual(jsonSchema(toZod(expr)))
  })
})

describe('form schema', () => {
  it('keeps zod checks in generated source (zod v4 regression)', () => {
    const fields = [fieldOf('Input', { name: 'username', min: 3, max: 20 })]
    expect(formSchemaSource(fields)).toContain(
      'username: z.string().min(3, { message: "Must be at least 3 characters" }).max(20',
    )
  })

  it('quotes field names that are not identifiers', () => {
    const fields = [fieldOf('Input', { name: 'first-name' })]
    expect(formSchemaSource(fields)).toContain('"first-name": z.string()')
    expect(Object.keys(buildFormSchema(fields).shape)).toEqual(['first-name'])
  })

  it('flattens rows into one schema and default values object', () => {
    const fields = [fieldOf('Input', { name: 'a' }), [fieldOf('Switch', { name: 'b' }), fieldOf('Slider', { name: 'c' })]]
    expect(Object.keys(buildFormSchema(fields).shape)).toEqual(['a', 'b', 'c'])
    expect(formDefaultValues(fields)).toEqual({ a: '', b: false, c: 0 })
  })
})
