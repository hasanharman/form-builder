import Marquee from '@/components/magicui/marquee'

const companies = [
  {
    id: 'iR63Ac2hum0',
    title: 'Create Forms 500% Faster With This Shadcn Tool',
  },
  {
    id: '2q6GCUzJ6fc',
    title: 'Build Forms 10x Faster with This Shadcn Tool',
  },
  {
    id: 'v6-722-GOyU',
    title: 'Build SHADCN Forms SUPER FAST with THIS TOOL!',
  },
  {
    id: 'uEiK91I4q9A',
    title: '🚀 Supercharge Your Forms with This Shadcn Tool',
  },
]

export default function Logos() {
  return (
    <section id="logos">
      <div className="container mx-auto px-4 md:px-8 py-12">
        <h3 className="text-center text-sm font-semibold text-gray-500">
          FEATURED IN
        </h3>
        <div className="relative mt-6">
          <Marquee className="max-w-full [--duration:40s] ">
            {companies.map((item) => (
              <div key={item.id} className="h-40 w-64 flex items-center gap-1">
                <iframe
                  width="256"
                  height="144"
                  src={`https://www.youtube.com/embed/${item.id}`}
                  title={item.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded"
                />
              </div>
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 h-full w-1/3 bg-gradient-to-r from-background"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 h-full w-1/3 bg-gradient-to-l from-background"></div>
        </div>
      </div>
    </section>
  )
}
