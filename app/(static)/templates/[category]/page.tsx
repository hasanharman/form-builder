import { redirect } from 'next/navigation'

import { templates } from '@/constants/templates'

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params

  const matchingTemplate = templates.find((template) =>
    template.path.endsWith(`/${category}`),
  )

  const defaultTemplatePath = matchingTemplate?.sub?.[0]?.path
  redirect(defaultTemplatePath ?? '/templates')
}
