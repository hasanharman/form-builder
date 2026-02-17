import { redirect } from 'next/navigation'

import { templates } from '@/constants/templates'

export default function TemplatesPage() {
  const firstTemplatePath = templates[0]?.sub?.[0]?.path
  redirect(firstTemplatePath ?? '/')
}
