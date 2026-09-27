import { redirect } from 'next/navigation'

import { documentedComponents } from '@/components/components'

export default function ComponentsPage() {
  const first = documentedComponents()[0]
  redirect(first ? `/components/${first.name}` : '/')
}
