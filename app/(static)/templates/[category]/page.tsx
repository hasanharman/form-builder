import { redirect } from 'next/navigation'

import { templateCategories } from '@/constants/templates'

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params
  const first = templateCategories.find((entry) => entry.id === category)?.templates[0]
  redirect(first?.path ?? '/templates')
}
