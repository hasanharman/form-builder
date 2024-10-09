import Marquee from '@/components/magicui/marquee'
import Image from 'next/image'

const companies = [
  {
    img: '139895814',
    link: 'shadcn/ui',
    name: 'shadcn/ui',
    author: 'shadcn',
  },
  {
    img: '53986236',
    link: 'React Hook Forms',
    name: 'react-hook-form',
    author: 'react-hook-form',
  },
  {
    img: '3084745',
    link: 'Zod',
    name: 'zod',
    author: 'colinhacks',
  },
  {
    img: '106016365',
    link: 'Shadcn Extensions',
    name: 'shadcn-extensions',
    author: 'shadcn',
  },
  {
    img: '19254700',
    link: 'shadcn-Phone-Input',
    name: 'shadcn-phone-input',
    author: 'shadcn',
  },
  {
    img: '339286',
    link: 'Yup',
    name: 'yup',
    author: 'yup',
  },
]

export default function Logos() {
  return (
    <section id="logos">
      <div className="container mx-auto px-4 md:px-8 py-12">
        <h3 className="text-center text-sm font-semibold text-gray-500">
          BUILD WITH USING
        </h3>
        <div className="relative mt-6">
          <Marquee className="max-w-full [--duration:40s]">
            {companies.map((item) => (
              <div
                key={item.name}
                className="h-10 w-40 dark:brightness-0 dark:invert grayscale opacity-30 flex items-center gap-1"
              >
                <Image
                  width={112}
                  height={40}
                  src={`https://avatars.githubusercontent.com/u/${item.img}`}
                  className="h-8 w-8 rounded"
                  alt={item.name}
                />
                <p className="text-sm whitespace-nowrap">{item.name}</p>
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
