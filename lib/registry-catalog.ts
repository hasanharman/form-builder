import registry from '@/registry.json'

/**
 * The Registry catalog: the one place that knows which registry items this
 * site publishes and how users install them. Everything else (docs pages,
 * sidebars, playground notices, generated code) asks the catalog instead of
 * repeating names, descriptions, dependencies or URLs.
 *
 * `registry.json` is the source of truth; `shadcn build` turns it into
 * `public/r/<name>.json`.
 */

export const REGISTRY_ORIGIN = 'https://www.shadcn-form.com'
export const REGISTRY_NAMESPACE = '@shadcn-form'

export type RegistryItemType =
  | 'registry:ui'
  | 'registry:block'
  | 'registry:component'
  | 'registry:lib'
  | 'registry:hook'
  | 'registry:file'
  | 'registry:page'

export type RegistryItemFile = {
  path: string
  type: string
  target?: string
}

export type RegistryItem = {
  name: string
  type: RegistryItemType
  title: string
  description: string
  categories?: string[]
  dependencies?: string[]
  devDependencies?: string[]
  registryDependencies?: string[]
  envVars?: Record<string, string>
  docs?: string
  files: RegistryItemFile[]
}

const items = registry.items as RegistryItem[]
const byName = new Map(items.map((item) => [item.name, item]))

export function listRegistryItems(type?: RegistryItemType): RegistryItem[] {
  return type ? items.filter((item) => item.type === type) : items
}

export function getRegistryItem(name: string): RegistryItem | undefined {
  return byName.get(name)
}

export function isRegistryItem(name: string): boolean {
  return byName.has(name)
}

export function registryItemUrl(name: string): string {
  return `${REGISTRY_ORIGIN}/r/${name}.json`
}

/**
 * The command that installs one or more items. Items are addressed by URL so
 * the command works without any `registries` entry in the user's
 * components.json. Unknown names are treated as official shadcn items.
 */
export function installCommand(names: string | string[]): string {
  const list = (Array.isArray(names) ? names : [names]).map((name) =>
    isRegistryItem(name) ? registryItemUrl(name) : name,
  )
  return `npx shadcn@latest add ${list.join(' ')}`
}
