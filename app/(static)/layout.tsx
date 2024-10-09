import { Footer } from '@/components/footer'
import Header from '@/components/header'

interface StaticLayoutProps {
  children: React.ReactNode
}

export default async function Layout({ children }: StaticLayoutProps) {
  return (
    <main className="">
      <Header />
      <div className="min-h-[calc(100vh-250.5px)] px-5 lg:px-0">{children}</div>
      <Footer />
    </main>
  )
}
