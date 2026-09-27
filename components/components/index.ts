import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'

import { listRegistryItems } from '@/lib/registry-catalog'

/**
 * Docs page for each registry item that has one, keyed by registry item name.
 * Title, description and install command live in registry.json, not here.
 */
export const componentDocs: Record<string, ComponentType> = {
  autocomplete: dynamic(() => import('./autocomplete')),
  'availability-picker': dynamic(() => import('./availability-picker')),
  'color-picker': dynamic(() => import('./color-picker')),
  'credit-card': dynamic(() => import('./credit-card')),
  'cron-expression-builder': dynamic(() => import('./cron-expression-builder')),
  'emoji-picker': dynamic(() => import('./emoji-picker')),
  'image-upload-dropzone': dynamic(() => import('./image-upload-dropzone')),
  'inline-editable-field': dynamic(() => import('./inline-editable-field')),
  'location-input': dynamic(() => import('./location-input')),
  'masked-input': dynamic(() => import('./masked-input')),
  'signature-input': dynamic(() => import('./signature-input')),
  'signature-pad': dynamic(() => import('./signature-pad')),
  'sortable-list-input': dynamic(() => import('./sortable-list-input')),
  'token-input': dynamic(() => import('./token-input')),
  'transfer-list': dynamic(() => import('./transfer-list')),
  'tree-select': dynamic(() => import('./tree-select')),
}

/** Registry items with a docs page, in catalog order. */
export function documentedComponents() {
  return listRegistryItems('registry:ui').filter((item) => item.name in componentDocs)
}
