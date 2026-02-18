import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

describe('generateReactHookFormCode', () => {
  it('includes Form import when using <Form {...form}> wrapper', () => {
    const filePath = resolve(
      process.cwd(),
      'screens/generate-code-parts/react-hook-form.tsx',
    )
    const code = readFileSync(filePath, 'utf8')

    expect(code).toContain('import { Form } from "@/components/ui/form"')
    expect(code).toContain('<Form {...form}>')
  })
})
