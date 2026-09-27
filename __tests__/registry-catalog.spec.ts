import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import { SPECIAL_COMPONENTS } from '@/constants/special-components'
import {
  getRegistryItem,
  installCommand,
  listRegistryItems,
  registryItemUrl,
  type RegistryItem,
} from '@/lib/registry-catalog'

const root = process.cwd()
const read = (path: string) => readFileSync(resolve(root, path), 'utf8')

/** Module specifiers imported by a source file. */
function importsOf(source: string): string[] {
  return [...source.matchAll(/(?:from|import)\s*['"]([^'"]+)['"]/g)].map((m) => m[1])
}

/** npm package name for a bare specifier (`react-phone-number-input/flags` -> `react-phone-number-input`). */
function packageName(spec: string) {
  const parts = spec.split('/')
  return spec.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0]
}

const PROVIDED_BY_PROJECT = new Set(['react', 'react-dom'])

/** Files an item ships plus those of the items from this registry it depends on. */
function filesWithOwnDependencies(item: RegistryItem, seen = new Set<string>()): string[] {
  if (seen.has(item.name)) return []
  seen.add(item.name)
  const own = (item.registryDependencies ?? [])
    .filter((dep) => dep.startsWith('http'))
    .map((dep) => getRegistryItem(basename(dep, '.json')))
    .filter((dep): dep is RegistryItem => Boolean(dep))
  return [...item.files.map((file) => file.path), ...own.flatMap((dep) => filesWithOwnDependencies(dep, seen))]
}

describe('registry catalog', () => {
  const items = listRegistryItems()

  it('has unique item names', () => {
    const names = items.map((item) => item.name)
    expect(new Set(names).size).toBe(names.length)
  })

  describe.each(items.map((item) => [item.name, item] as const))('%s', (name, item) => {
    const sources = item.files
      .filter((file) => /\.tsx?$/.test(file.path))
      .map((file) => ({ path: file.path, code: read(file.path) }))
    const specs = sources.flatMap((source) => importsOf(source.code))
    const shipped = new Set(item.files.map((file) => file.path))
    const available = new Set(filesWithOwnDependencies(item))

    it('ships files that exist', () => {
      for (const file of item.files) expect(existsSync(resolve(root, file.path)), file.path).toBe(true)
    })

    it('declares every npm package it imports', () => {
      const packages = specs
        .filter((spec) => !spec.startsWith('.') && !spec.startsWith('@/'))
        .map(packageName)
        .filter((pkg) => !PROVIDED_BY_PROJECT.has(pkg))
      for (const pkg of packages) expect(item.dependencies ?? [], `${name} imports ${pkg}`).toContain(pkg)
    })

    it('declares exactly the ui items it imports', () => {
      const uiImports = new Set(
        specs
          .filter((spec) => spec.startsWith('@/components/ui/'))
          .map((spec) => spec.replace('@/components/ui/', ''))
          .filter((dep) => !shipped.has(`components/ui/${dep}.tsx`)),
      )
      const declared = new Set(
        (item.registryDependencies ?? [])
          .map((dep) => (dep.startsWith('http') ? basename(dep, '.json') : dep))
          .filter((dep) => (getRegistryItem(dep)?.type ?? 'registry:ui') === 'registry:ui'),
      )
      expect([...declared].sort()).toEqual([...uiImports].sort())
    })

    it('ships every project-local module it imports', () => {
      const local = specs.filter(
        (spec) => spec.startsWith('@/') && !spec.startsWith('@/components/ui/') && spec !== '@/lib/utils',
      )
      for (const spec of local) {
        const path = spec.slice(2)
        const candidates = [path, `${path}.ts`, `${path}.tsx`]
        expect(candidates.some((c) => available.has(c)), `${name} imports ${spec}`).toBe(true)
      }
    })

    // Items must install cleanly into radix-*, base-* and legacy styles alike,
    // so they may only use props every shadcn wrapper shares.
    it('uses no primitive-library-specific API', () => {
      const forbidden: [RegExp, string][] = [
        [/['"](@radix-ui\/[^'"]+|radix-ui|@base-ui\/[^'"]+)['"]/, 'imports a primitive library directly'],
        [/\basChild\b/, 'uses Radix asChild; style the trigger with buttonVariants instead'],
        [/\srender=\{\s*</, 'uses Base UI render; style the trigger with buttonVariants instead'],
        [/data-\[state|data-state|data-\[open|data-open/, 'styles a primitive state attribute'],
        [/\b(InputProps|CalendarProps)\b/, 'imports a type the stock wrappers do not export'],
        [/<style jsx/, 'uses styled-jsx, which only exists in Next.js'],
      ]
      for (const source of sources) {
        for (const [pattern, reason] of forbidden) {
          expect(pattern.test(source.code), `${source.path} ${reason}`).toBe(false)
        }
      }
    })

    it('depends on its own registry items by URL', () => {
      for (const dep of item.registryDependencies ?? []) {
        if (getRegistryItem(dep)) throw new Error(`${name}: use ${registryItemUrl(dep)} instead of "${dep}"`)
        if (dep.startsWith('http')) expect(getRegistryItem(basename(dep, '.json')), dep).toBeDefined()
      }
    })
  })

  it('has a registry item for every component docs page', () => {
    const pages = readdirSync(resolve(root, 'components/components'))
      .filter((file) => file.endsWith('.tsx'))
      .map((file) => basename(file, '.tsx'))
      .filter((page) => !['component-doc-shell', 'components-sidebar'].includes(page))
    for (const page of pages) expect(getRegistryItem(page), page).toBeDefined()
  })

  it('can install every component the playground renders', () => {
    for (const { item } of SPECIAL_COMPONENTS) expect(getRegistryItem(item), item).toBeDefined()
  })

  it('builds install commands from item URLs', () => {
    expect(installCommand(['credit-card', 'button'])).toBe(
      'npx shadcn@latest add https://www.shadcn-form.com/r/credit-card.json button',
    )
  })
})
