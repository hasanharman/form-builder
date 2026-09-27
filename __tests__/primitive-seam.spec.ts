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
          ':!components/ui/**',
          ':!__tests__/**',
        ],
        { encoding: 'utf8' },
      )
    } catch {
      // git grep exits 1 when nothing matches
    }
    expect(output).toBe('')
  })
})
