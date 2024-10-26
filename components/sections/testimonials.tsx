'use client'

import Marquee from '@/components/magicui/marquee'
import Section from '@/components/section'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import Image from 'next/image'

export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <span
      className={cn(
        'bg-primary/20 p-1 py-0.5 font-bold text-primary dark:bg-primary/20 dark:text-primary',
        className,
      )}
    >
      {children}
    </span>
  )
}

export interface TestimonialCardProps {
  name: string
  username: string
  img?: string
  description: React.ReactNode
  className?: string
  [key: string]: any
}

export const TestimonialCard = ({
  description,
  name,
  username,
  img,
  className,
  ...props // Capture the rest of the props
}: TestimonialCardProps) => (
  <div
    className={cn(
      'mb-4 flex w-full cursor-pointer break-inside-avoid flex-col justify-between gap-6 rounded-xl p-4',
      // light styles
      ' border border-neutral-200 bg-white',
      // dark styles
      'dark:bg-black dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]',
      className,
    )}
    {...props} // Spread the rest of the props here
  >
    <div className="select-none text-sm font-normal text-neutral-700 dark:text-neutral-400">
      {description}
      {/* <div className="flex flex-row py-1">
        <Star className="size-4 text-yellow-500 fill-yellow-500" />
        <Star className="size-4 text-yellow-500 fill-yellow-500" />
        <Star className="size-4 text-yellow-500 fill-yellow-500" />
        <Star className="size-4 text-yellow-500 fill-yellow-500" />
        <Star className="size-4 text-yellow-500 fill-yellow-500" />
      </div> */}
    </div>

    <div className="flex w-full select-none items-center justify-start gap-5">
      <Image
        width={40}
        height={40}
        src={img || ''}
        alt={name}
        className="h-10 w-10 rounded-full ring-1 ring-border ring-offset-4"
      />

      <div>
        <p className="font-medium text-neutral-500">{name}</p>
        <p className="text-xs font-normal text-neutral-400">{username}</p>
      </div>
    </div>
  </div>
)

const testimonials = [
  {
    name: 'Alan M',
    username: '@alanxmat',
    img: 'https://pbs.twimg.com/profile_images/1753392030493904896/AHEhpDwQ_400x400.jpg',
    description: (
      <p>
        sick product, makes working with shadcn forms much faster. starred it on
        github :)
      </p>
    ),
  },
  {
    name: 'Ali H',
    username: '@AliHussein_20',
    img: 'https://pbs.twimg.com/profile_images/1784381287895113728/HuT4x-kn_400x400.jpg',
    description: <p>It looks pretty cool</p>,
  },
  {
    name: 'PARMJEET Mishra',
    username: '@iamparmjeet',
    img: 'https://pbs.twimg.com/profile_images/1539627835811307520/Rctd8LhC_400x400.jpg',
    description: <p>Oh yes bro.. Amazing product 😁</p>,
  },
  {
    name: 'Uttam Likhiya',
    username: '@L1KH1YAUTTAM',
    img: 'https://pbs.twimg.com/profile_images/1822603710796615680/jPGb4Gv-_400x400.jpg',
    description: <p>used it, worth it</p>,
  },
  {
    name: 'Ritesh',
    username: '@Riteshk_007',
    img: 'https://pbs.twimg.com/profile_images/1743172574337798144/XnOtDGda_400x400.jpg',
    description: (
      <p>
        You have made it very well but it is not responsive properly, please fix
        it for the small screen. By the way, it is very good, I will use it
        myself in my work.
      </p>
    ),
  },
  {
    name: 'Linda Wu',
    username: 'VP of Operations at LogiChain Solutions',
    img: 'https://randomuser.me/api/portraits/women/5.jpg',
    description: (
      <p>
        #LogiTech&apos;s supply chain optimization tools have drastically
        reduced our operational costs.
        <Highlight>
          Efficiency and accuracy in logistics have never been better.
        </Highlight>{' '}
      </p>
    ),
  },
  {
    name: 'goodhawk',
    username: '@goodhawk2',
    img: 'https://pbs.twimg.com/profile_images/1824811661280391168/PN1rpGCJ_400x400.jpg',
    description: (
      <p>
        Thanks, I will definitely try it out. I have similar experience and have
        to build various types of forms every day. Thank you very much for your
        efforts.
      </p>
    ),
  },
  {
    name: 'Pavel Svitek 🇨🇭',
    username: '@pavelsvitek_',
    img: 'https://pbs.twimg.com/profile_images/1632440743804428290/EUnmpz5l_400x400.jpg',
    description: <p>really good first version, keep it up!</p>,
  },
  {
    name: 'Matt',
    username: '@uixmat',
    img: 'https://pbs.twimg.com/profile_images/1816722074292899840/nsnPz-xI_400x400.jpg',
    description: <p>Oooo awesome 🙌🏼</p>,
  },
  {
    name: 'Idan 🚀',
    username: '@IdanP70',
    img: 'https://pbs.twimg.com/profile_images/1291133311432228867/yyVYd_O-_400x400.jpg',
    description: <p>Very cool sir!</p>,
  },
  {
    name: 'Sparkˎˊ Design ✪',
    username: '@SparkDesign001',
    img: 'https://pbs.twimg.com/profile_images/1705145078937681920/o7-eZKwQ_400x400.jpg',
    description: (
      <p>
        Wow, that&apos;s awesome! How about adding a feature that allows users
        to customize the design of their forms with different themes and colors?
        It would take the user experience to the next level! 🚀🎨
      </p>
    ),
  },
  {
    name: 'Aidan Sunbury',
    username: '@aidansunbury',
    img: 'https://pbs.twimg.com/profile_images/1833678724170186752/gDRGWrM5_400x400.png',
    description: (
      <p>
        The initial version works great! Can&apos;t wait to see where it goes.
      </p>
    ),
  },
  {
    name: 'Dilshara Hasanka',
    username: '@DilsharaHA',
    img: 'https://pbs.twimg.com/profile_images/1744746056997588992/8N0zXnv__400x400.jpg',
    description: <p>Thank you for this</p>,
  },
  {
    name: 'sayed',
    username: '@SayedDileri',
    img: 'https://pbs.twimg.com/profile_images/1828461075916038146/3VPIg5lj_400x400.jpg',
    description: <p>Sickkkkk!!</p>,
  },
  {
    name: 'joao_goncalos',
    username: '@joaogveloso',
    img: 'https://pbs.twimg.com/profile_images/1286968929307561984/b1povrl2_400x400.jpg',
    description: <p>Damn, really useful! Thanks so much!</p>,
  },
  {
    name: 'Bylka',
    username: '@BylkaYf',
    img: 'https://pbs.twimg.com/profile_images/1574177524254384129/nMQ3eP2n_400x400.jpg',
    description: <p>A cool new tool in the ecosystem, nice work✨</p>,
  },
  {
    name: 'Rahul Patni',
    username: '@iAmRahulPatni',
    img: 'https://pbs.twimg.com/profile_images/1834435516823138304/SUO8hQrJ_400x400.jpg',
    description: <p>This is amazing!</p>,
  },
  {
    name: 'Masood ahmad',
    username: '@i_am_Masood_',
    img: 'https://pbs.twimg.com/profile_images/1815490341421674497/08A9d0xB_400x400.jpg',
    description: <p>Great work man!!</p>,
  },
  {
    name: 'Web3 Jobs',
    username: '@WEB3_JOBot',
    img: 'https://pbs.twimg.com/profile_images/1710606587331567616/_oZDwag0_400x400.jpg',
    description: (
      <p>hunter, you crushed it web3 needs more builders like you</p>
    ),
  },
  {
    name: 'Mason',
    username: '@masonyekta',
    img: 'https://pbs.twimg.com/profile_images/1250571678402392072/JIOObc5I_400x400.jpg',
    description: <p>Looks great, awesome job 👏</p>,
  },
]

export default function Testimonials() {
  return (
    <Section
      title="Testimonials"
      subtitle="What people says"
      className="max-w-8xl"
    >
      <div className="relative mt-6 max-h-screen overflow-hidden">
        <div className="gap-4 md:columns-2 xl:columns-3 2xl:columns-4">
          {Array(Math.ceil(testimonials.length / 3))
            .fill(0)
            .map((_, i) => (
              <Marquee
                vertical
                key={i}
                className={cn({
                  '[--duration:60s]': i === 1,
                  '[--duration:30s]': i === 2,
                  '[--duration:70s]': i === 3,
                })}
              >
                {testimonials.slice(i * 3, (i + 1) * 3).map((card, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: Math.random() * 0.8,
                      duration: 1.2,
                    }}
                  >
                    <TestimonialCard {...card} />
                  </motion.div>
                ))}
              </Marquee>
            ))}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 w-full bg-gradient-to-t from-background from-20%"></div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 w-full bg-gradient-to-b from-background from-20%"></div>
      </div>
    </Section>
  )
}
