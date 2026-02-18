import { Registry } from './schema'

export const ui: Registry = [
  {
    name: 'autocomplete',
    type: 'registry:ui',
    dependencies: ['use-debounce'],
    registryDependencies: ['input', 'button'],
    files: ['ui/autocomplete.tsx'],
  },
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
  {
    name: 'signature-pad',
    type: 'registry:ui',
    registryDependencies: ['button', 'dialog', 'progress'],
    files: ['ui/signature-pad.tsx'],
  },
  {
    name: 'credit-card',
    type: 'registry:ui',
    dependencies: ['framer-motion'],
    registryDependencies: ['card', 'input', 'select'],
    files: ['ui/credit-card.tsx'],
  },
  {
    name: 'masked-input',
    type: 'registry:ui',
    registryDependencies: ['input'],
    files: ['ui/masked-input.tsx'],
  },
  {
    name: 'color-picker',
    type: 'registry:ui',
    registryDependencies: ['button', 'input', 'select'],
    files: ['ui/color-picker.tsx'],
  },
  {
    name: 'token-input',
    type: 'registry:ui',
    registryDependencies: ['badge', 'input'],
    files: ['ui/token-input.tsx'],
  },
  {
    name: 'emoji-picker',
    type: 'registry:ui',
    registryDependencies: ['button', 'input', 'popover', 'scroll-area'],
    files: ['ui/emoji-picker.tsx'],
  },
  {
    name: 'transfer-list',
    type: 'registry:ui',
    registryDependencies: ['button'],
    files: ['ui/transfer-list.tsx'],
  },
  {
    name: 'tree-select',
    type: 'registry:ui',
    registryDependencies: ['button', 'popover', 'scroll-area'],
    files: ['ui/tree-select.tsx'],
  },
  {
    name: 'image-upload-dropzone',
    type: 'registry:ui',
    registryDependencies: ['button'],
    files: ['ui/image-upload-dropzone.tsx'],
  },
  {
    name: 'cron-expression-builder',
    type: 'registry:ui',
    registryDependencies: ['label', 'select'],
    files: ['ui/cron-expression-builder.tsx'],
  },
  {
    name: 'inline-editable-field',
    type: 'registry:ui',
    registryDependencies: ['button', 'input'],
    files: ['ui/inline-editable-field.tsx'],
  },
  {
    name: 'sortable-list-input',
    type: 'registry:ui',
    registryDependencies: ['button', 'input'],
    files: ['ui/sortable-list-input.tsx'],
  },
  {
    name: 'availability-picker',
    type: 'registry:ui',
    files: ['ui/availability-picker.tsx'],
  },
]
