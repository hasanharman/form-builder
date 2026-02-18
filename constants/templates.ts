export interface TemplateEntry {
  title: string
  path: string
  description: string
  icon: 'shield' | 'key' | 'database' | 'flame' | 'sparkles' | 'mail' | 'message'
  logoLabel: string
}

export interface Templates {
  title: string
  description: string
  path: string
  sub: TemplateEntry[]
}

export const templates: Templates[] = [
  {
    title: 'Authentication',
    description:
      'Production-ready authentication patterns from base shadcn to provider-integrated variants.',
    path: '/templates/authentication',
    sub: [
      {
        title: 'Shadcn',
        path: '/templates/authentication/shadcn-auth',
        description: 'Authentication starter with login, signup, and recovery flows.',
        icon: 'shield',
        logoLabel: 'shadcn/ui',
      },
      {
        title: 'Clerk Elements Auth',
        path: '/templates/authentication/clerk-auth',
        description: 'Sign-in form layout adapted for Clerk Elements flows.',
        icon: 'key',
        logoLabel: 'Clerk',
      },
      {
        title: 'Supabase Ready Auth',
        path: '/templates/authentication/supabase-auth',
        description: 'Email/password auth UI prepared for Supabase actions.',
        icon: 'database',
        logoLabel: 'Supabase',
      },
      {
        title: 'Firebase Ready Auth',
        path: '/templates/authentication/firebase-auth',
        description: 'Firebase-focused sign-in design with provider actions.',
        icon: 'flame',
        logoLabel: 'Firebase',
      },
      {
        title: 'Better Auth Ready',
        path: '/templates/authentication/better-auth',
        description: 'Composable auth screen structure for Better Auth stacks.',
        icon: 'sparkles',
        logoLabel: 'Better Auth',
      },
    ],
  },
  {
    title: 'Contact & Growth',
    description:
      'High-conversion forms for inbound contact, newsletter signup, and lead capture.',
    path: '/templates/contact',
    sub: [
      {
        title: 'Contact Form',
        path: '/templates/contact/contact',
        description: 'General inquiry form for support and sales conversations.',
        icon: 'message',
        logoLabel: 'Contact',
      },
      {
        title: 'Newsletter Form',
        path: '/templates/contact/newsletter',
        description: 'Minimal email capture form for product updates.',
        icon: 'mail',
        logoLabel: 'Newsletter',
      },
    ],
  },
]
