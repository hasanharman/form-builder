import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'

import { listRegistryItems, type RegistryItem } from '@/lib/registry-catalog'

/** Registry items shown in the /funny gallery instead of the Components sidebar. */
type FunnyComponent = {
  /** Docs page, shown at /funny/<name>. */
  doc: ComponentType
  /** Small self-playing demo for the gallery card. */
  teaser: ComponentType<{ playing: boolean }>
  isNew?: boolean
}

export const funnyComponents: Record<string, FunnyComponent> = {
  'basketball-upload': {
    doc: dynamic(() => import('./basketball-upload')),
    teaser: dynamic(() => import('./basketball-upload-teaser')),
    isNew: true,
  },
  'penalty-upload': {
    doc: dynamic(() => import('./penalty-upload')),
    teaser: dynamic(() => import('./penalty-upload-teaser')),
    isNew: true,
  },
}

/** Gallery sections in display order, each fed by one registry category. */
const sections = [{ title: 'Uploads', category: 'upload' }]

/** Registry items with a funny docs page, in catalog order. */
export function listFunnyComponents() {
  return listRegistryItems('registry:ui').filter(
    (item) => item.name in funnyComponents,
  )
}

export function funnySections(): { title: string; items: RegistryItem[] }[] {
  const items = listFunnyComponents()
  return [
    {
      title: 'New releases',
      items: items.filter((item) => funnyComponents[item.name].isNew),
    },
    ...sections.map(({ title, category }) => ({
      title,
      items: items.filter((item) => item.categories?.includes(category)),
    })),
  ].filter((section) => section.items.length > 0)
}
