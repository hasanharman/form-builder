import Header from '@/components/header'
import SponsorsSection from '@/components/sections/sponsors'
import { Footer } from '@/components/footer'

export const metadata = {
  title: 'Sponsors – Shadcn Form Builder',
  description: 'Our amazing sponsors who support the project',
}

export default function SponsorsPage() {
  return (
    <main>
      <Header />
      <SponsorsSection />
      <Footer />
    </main>
  )
}
