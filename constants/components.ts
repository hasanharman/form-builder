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
    ],
  },
]
