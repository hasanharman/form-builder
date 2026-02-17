import { redirect } from 'next/navigation'

import { components } from '@/constants/components'

export default function ComponentsPage() {
  const firstComponentPath = components[0]?.sub?.[0]?.path
  redirect(firstComponentPath ?? '/')
}
