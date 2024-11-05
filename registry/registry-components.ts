import { Registry } from './schema'

export const ui: Registry = [
  {
    name: 'location-input',
    type: 'registry:ui',
    registryDependencies: ['button', 'popover', 'scroll-area', 'command'],
    files: ['ui/location-input.tsx'],
  },
  {
    name: 'signature-input',
    type: 'registry:ui',
    registryDependencies: ['button'],
    files: ['ui/signature-input.tsx'],
  },
]
