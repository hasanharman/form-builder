import { funnySections } from '@/components/funny'
import { FunnyCard } from '@/components/funny/funny-card'

function Bracketed({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span className="text-orange-600 dark:text-orange-400">[</span>
      {children}
      <span className="text-orange-600 dark:text-orange-400">]</span>
    </>
  )
}

export default function FunnyPage() {
  return (
    <div className="mx-auto w-full max-w-5xl pb-16 pt-10 md:pt-16">
      <header className="flex flex-col items-center gap-3 text-center">
        <h1 className="max-w-2xl text-balance text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
          Form components nobody asked for
        </h1>
        <p className="max-w-lg text-balance text-sm font-medium text-muted-foreground sm:text-base">
          The serious inputs live under Components. These make a form harder to
          fill in, on purpose. Each one is a single file you own, added with the
          shadcn CLI.{' '}
          <span className="hidden [@media(hover:hover)]:inline">
            <Bracketed>Hover to play</Bracketed>
          </span>
        </p>
      </header>

      {funnySections().map((section) => (
        <section key={section.title} className="mt-14 first-of-type:mt-10">
          <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
            {section.title}{' '}
            <span className="text-muted-foreground">
              <Bracketed>{section.items.length}</Bracketed>
            </span>
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {section.items.map((item) => (
              <FunnyCard key={item.name} name={item.name} title={item.title} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
