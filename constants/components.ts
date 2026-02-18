export interface Components {
  title: string
  description: string
  path: string
  sub: any[]
}

export const components: Components[] = [
  {
    title: 'Components',
    description: 'Extra unofficial components for shadcn ui',
    path: '/components',
    sub: [
      {
        title: 'Autocomplete',
        path: '/components/autocomplete',
        description: 'Autocomplete',
      },
      {
        title: 'Location Input',
        path: '/components/location-input',
        description: 'Location Input',
      },
      {
        title: 'Signature Input',
        path: '/components/signature-input',
        description: 'Signature Input',
      },
      {
        title: 'Signature Pad',
        path: '/components/signature-pad',
        description: 'Signature Pad with Dialog',
      },
      {
        title: 'Credit Card',
        path: '/components/credit-card',
        description: 'Credit Card Input',
      },
      {
        title: 'Masked Input',
        path: '/components/masked-input',
        description: 'Masked Input',
      },
      {
        title: 'Color Picker',
        path: '/components/color-picker',
        description: 'Color Picker',
      },
      {
        title: 'Token Input',
        path: '/components/token-input',
        description: 'Tag/Token Input',
      },
      {
        title: 'Emoji Picker',
        path: '/components/emoji-picker',
        description: 'Emoji Picker',
      },
      {
        title: 'Transfer List',
        path: '/components/transfer-list',
        description: 'Transfer List',
      },
      {
        title: 'Tree Select',
        path: '/components/tree-select',
        description: 'Tree Select',
      },
      {
        title: 'Image Upload Dropzone',
        path: '/components/image-upload-dropzone',
        description: 'Image Upload / Dropzone',
      },
      {
        title: 'Cron Expression Builder',
        path: '/components/cron-expression-builder',
        description: 'Cron Expression Builder',
      },
      {
        title: 'Inline Editable Field',
        path: '/components/inline-editable-field',
        description: 'Inline Editable Field',
      },
      {
        title: 'Sortable List Input',
        path: '/components/sortable-list-input',
        description: 'Sortable List Input',
      },
      {
        title: 'Availability Picker',
        path: '/components/availability-picker',
        description: 'Schedule / Availability Picker',
      },
    ],
  },
]
