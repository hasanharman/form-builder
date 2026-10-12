import { execFileSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

/**
 * The primitive library (Base UI, formerly Radix) lives behind the
 * components/ui wrappers. App code talks to the wrappers only, so swapping
 * or upgrading the library touches components/ui and nothing else.
 */
describe('primitive seam', () => {
  it('keeps primitive-library imports inside components/ui', () => {
    let output = ''
    try {
      output = execFileSync(
        'git',
        [
          'grep',
          '-nE',
          `from ['"](@radix-ui/|radix-ui['"]|@base-ui/)`,
          '--',
          '*.ts',
          '*.tsx',
          ':(exclude)components/ui/**',
          ':(exclude)__tests__/**',
        ],
        { encoding: 'utf8' },
      )
    } catch (error) {
      // git grep exits 1 when nothing matches; anything else is a real failure
      if ((error as { status?: number }).status !== 1) throw error
    }
    expect(output).toBe('')
  })
})
