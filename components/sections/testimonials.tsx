'use client'
import { motion } from 'framer-motion'

import { cn } from '@/lib/utils'
import Marquee from '@/components/magicui/marquee'
import Section from '@/components/section'
import ClientTweetCard from '@/components/magicui/tweet-client'

const tweets = [
  '1840127364975771749',
  '1840061599286956093',
  '1840057079442149612',
  '1840092207367204903',
  '1840052060680548531',
  '1840093281683943651',
  '1840077368385237165',
  '1840063343903814013',
  '1840107553201791323',
  '1840059551925592462',
  '1840462574212768097',
  '1840333065887109509',
  '1840682463540002841',
  '1840550739308941750',
  '1840421239262990507',
  '1840304996946194459',
  '1855769875970449626',
  '1840060084740673765',
  '1840101276505252093',
  '1840077252610142656',
  '1840106619981508939',
  '1840168638889795797',
  '1840171016066347034',
  '1840226349434151193',
  '1840186397380227521',
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
          {Array(Math.ceil(tweets.length / 3))
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
                {tweets.slice(i * 3, (i + 1) * 3).map((tweet, idx) => (
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
                    {/* <TestimonialCard {...card} /> */}
                    <ClientTweetCard id={tweet} />
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
