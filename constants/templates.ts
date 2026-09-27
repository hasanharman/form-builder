import { getRegistryItem, type RegistryItem } from '@/lib/registry-catalog'

/**
 * How templates are grouped and branded on the site. Title, description,
 * features, files and install command come from each template's registry
 * block in registry.json.
 */

export type TemplateIcon =
  | 'shield'
  | 'key'
  | 'database'
  | 'flame'
  | 'sparkles'
  | 'mail'
  | 'message'

/** A page of a multi-page template, at the route its links point to. */
export type TemplateFlow = {
  id: string
  title: string
  route: string
}

export const AUTH_FLOWS: TemplateFlow[] = [
  { id: 'sign-in', title: 'Login', route: '/sign-in' },
  { id: 'sign-up', title: 'Sign Up', route: '/sign-up' },
  { id: 'forgot-password', title: 'Forgot Password', route: '/forgot-password' },
  { id: 'reset-password', title: 'Reset Password', route: '/reset-password' },
]

type TemplateConfig = {
  /** Registry block name. */
  name: string
  icon: TemplateIcon
  logoLabel: string
  flows?: TemplateFlow[]
}

export type Template = TemplateConfig &
  Pick<RegistryItem, 'title' | 'description'> & {
    category: string
    path: string
    features: string[]
  }

export type TemplateCategory = {
  id: string
  title: string
  description: string
  path: string
  templates: Template[]
}

const categories: {
  id: string
  title: string
  description: string
  templates: TemplateConfig[]
}[] = [
  {
    id: 'authentication',
    title: 'Authentication',
    description:
      'Production-ready authentication patterns from base shadcn to provider-integrated variants.',
    templates: [
      { name: 'shadcn-auth', icon: 'shield', logoLabel: 'shadcn/ui', flows: AUTH_FLOWS },
      { name: 'clerk-auth', icon: 'key', logoLabel: 'Clerk', flows: AUTH_FLOWS },
      { name: 'supabase-auth', icon: 'database', logoLabel: 'Supabase' },
      { name: 'firebase-auth', icon: 'flame', logoLabel: 'Firebase' },
      { name: 'better-auth', icon: 'sparkles', logoLabel: 'Better Auth' },
    ],
  },
  {
    id: 'contact',
    title: 'Contact & Growth',
    description:
      'High-conversion forms for inbound contact, newsletter signup, and lead capture.',
    templates: [
      { name: 'contact', icon: 'message', logoLabel: 'Contact' },
      { name: 'newsletter', icon: 'mail', logoLabel: 'Newsletter' },
    ],
  },
]

export const templateCategories: TemplateCategory[] = categories.map((category) => ({
  id: category.id,
  title: category.title,
  description: category.description,
  path: `/templates/${category.id}`,
  templates: category.templates.map((config) => {
    const item = getRegistryItem(config.name)
    if (!item) throw new Error(`Template ${config.name} is missing from registry.json`)
    return {
      ...config,
      category: category.id,
      path: `/templates/${category.id}/${config.name}`,
      title: item.title,
      description: item.description,
      features: item.meta?.features ?? [],
    }
  }),
}))

export function findTemplate(categoryId: string, name: string): Template | undefined {
  return templateCategories
    .find((category) => category.id === categoryId)
    ?.templates.find((template) => template.name === name)
}

/** The flow shown for a `?flow=` value, defaulting to the first. */
export function resolveFlow(template: Template, flowId?: string): TemplateFlow | undefined {
  return template.flows?.find((flow) => flow.id === flowId) ?? template.flows?.[0]
}
