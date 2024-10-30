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
        title: 'Location Input',
        path: '/components/location-input',
        description: 'Location Inpute',
      },
    ],
  },
]
