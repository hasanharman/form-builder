'use client'

import { motion, useInView } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'
import Safari from './safari'
import { Card, CardContent } from './ui/card'

export type FeaturesDataProps = {
  id: number
  title: string
  content: string
  image?: string
  video?: string
  icon?: React.ReactNode
}

export type FeaturesProps = {
  collapseDelay?: number
  data: FeaturesDataProps[]
}

export default function Features({
  collapseDelay = 5000,
  data = [],
}: FeaturesProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(-1)
  const carouselRef = useRef<HTMLDivElement>(null)
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once: true,
    amount: 0.5,
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isInView) {
        setCurrentIndex(0)
      } else {
        setCurrentIndex(-1)
      }
    }, 100)
    return () => clearTimeout(timer)
  }, [isInView])

  const scrollToIndex = (index: number) => {
    if (carouselRef.current) {
      const card = carouselRef.current.querySelectorAll('.card')[index]
      if (card) {
        const cardRect = card.getBoundingClientRect()
        const carouselRect = carouselRef.current.getBoundingClientRect()
        const offset =
          cardRect.left -
          carouselRect.left -
          (carouselRect.width - cardRect.width) / 2

        carouselRef.current.scrollTo({
          left: carouselRef.current.scrollLeft + offset,
          behavior: 'smooth',
        })
      }
    }
  }

  useEffect(() => {
    if (data.length <= currentIndex) { // Only the case when you change data.length at runtime and you data.length goes <= currentIndex then we should reset our carousel.
      setCurrentIndex(0);
      return;
    }
    const handleAutoScroll = () => {
      const nextIndex =
        (currentIndex !== undefined ? currentIndex + 1 : 0) % data.length
      setCurrentIndex(nextIndex)
      scrollToIndex(nextIndex)
    }
    const autoScrollTimer = setInterval(handleAutoScroll, collapseDelay)
    return () => clearInterval(autoScrollTimer)
  }, [currentIndex, collapseDelay, data.length])

  return (
    <section ref={ref} id="features" className="flex justify-center">
      <div className="container">
        <div className="mx-auto my-12 h-full grid grid-rows-auto lg:grid-rows-1 grid-cols-1 lg:grid-cols-2 lg:gap-10 items-center grid-flow-dense">
          <div ref={carouselRef} className="overflow-x-auto flex lg:flex-col gap-8 lg:gap-0 snap-x order-2 lg:order-1 [-ms-overflow-style:none]  [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-mandatory">
            {data.map((item, index) => (
              <Card key={item.id} className="card bg-background border-none shadow-none min-w-64" onClick={() => setCurrentIndex(index)}>
                <CardContent className="relative p-0 pt-6 lg:pt-0 lg:mb-6 overflow-visible">
                  <div
                    className={`absolute left-0 top-0 right-0 lg:bottom-0 w-full lg:w-0.5 h-0.5 lg:h-full rounded-lg bg-neutral-300/50 dark:bg-neutral-300/30`}
                  >
                    <div
                      className={`absolute left-0 right-0 lg:bottom-0 lg:top-0 ${currentIndex === index ? 'w-full h-full' : 'w-0 h-0'
                        } origin-left bg-primary transition-all ease-linear dark:bg-white`}
                      style={{
                        transitionDuration:
                          currentIndex === index
                            ? `${collapseDelay}ms`
                            : '0s',
                      }}
                    ></div>
                  </div>
                  <div className='flex lg:items-center'>
                    <div className="hidden lg:flex item-box w-12 h-12 bg-primary/10 rounded-full sm:mx-6 mx-2 shrink-0 items-center justify-center">
                      {item.icon}
                    </div>
                    <div className='px-5'>
                      <h3 className="text-xl font-semibold">{item.title}</h3>
                      <p className="text-base font-sans leading-6 text-muted-foreground">{item.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div
            className={`lg:h-[350px] lg:min-h-[150px] w-auto flex justify-center order-1 lg:order-2`}
          >
            {data[currentIndex]?.image ? (
              // <motion.img
              //   key={currentIndex}
              //   src={data[currentIndex].image}
              //   alt="feature"
              //   className="aspect-auto h-full w-full rounded-xl border border-neutral-300/50 object-cover object-left-top p-1 shadow-lg"
              //   initial={{ opacity: 0, scale: 0.98 }}
              //   animate={{ opacity: 1, scale: 1 }}
              //   exit={{ opacity: 0, scale: 0.98 }}
              //   transition={{ duration: 0.25, ease: "easeOut" }}
              // />
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className='w-auto h-fit'
              >
                <Safari
                  key={currentIndex}
                  src={data[currentIndex].image}
                  url="https://acme.ai"
                  className="aspect-auto h-full w-full rounded-xl border border-neutral-300/50 object-cover object-left-top p-1 shadow-lg"
                />
              </motion.div>
            ) : data[currentIndex]?.video ? (
              <video
                preload="auto"
                src={data[currentIndex].video}
                className="aspect-auto h-full w-full rounded-lg object-cover shadow-lg"
                autoPlay
                loop
                muted
              />
            ) : (
              <div className="aspect-auto h-full w-full rounded-xl border border-neutral-300/50 bg-gray-200 p-1"></div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
