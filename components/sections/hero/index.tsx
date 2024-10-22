'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'

import HeroVideoDialog from '@/components/sections/hero/hero-video'
import { NumberTicker } from '@/components/number-ticker'

import { LuStar, LuHeart } from 'react-icons/lu'

const ease = [0.16, 1, 0.3, 1]

function HeroPill() {
  const [stars, setStars] = useState<number>(0)
  const [forks, setForks] = useState<number>(0)

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        const response = await fetch(
          'https://api.github.com/repos/hasanharman/form-builder',
        )
        const data = await response.json()
        setStars(data.stargazers_count)
        setForks(data.forks_count)
      } catch (error) {
        console.error('Error fetching GitHub data:', error)
      }
    }
    fetchGitHubData()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease }}
      className="flex items-center"
    >
      <div className={cn('z-10 flex -space-x-12 rtl:space-x-reverse')}>
        <Link
          href="https://github.com/sponsors/hasanharman"
          target="_blank"
          className="group"
        >
          <Button className="h-10 w-36 flex justify-start rounded-full border-2 border-white dark:border-gray-800 shadow">
            <LuHeart className="mr-1 group-hover:text-red-500" />
            Sponsor
          </Button>
        </Link>
        <Link
          href="https://github.com/hasanharman/form-builder"
          target="_blank"
          className="h-10 cursor-pointer flex w-auto items-center space-x-1 rounded-full bg-muted px-3 group border-2 border-white whitespace-pre shadow hover:shadow-lg"
        >
          <p className="font-medium text-primary  text-sm">
            Star Project on GitHub
          </p>
          <div className="flex items-center rounded-full px-2 py-1 text-center font-medium text-sm ">
            <LuStar className="group-hover:text-yellow-500" />
            <NumberTicker className="ml-1" value={stars} />
          </div>
        </Link>
        {/* <Link href={'url'} target="_blank">
          <Button className="h-10 rounded-full border-2 border-white dark:border-gray-800">
            Hello
          </Button>
        </Link>
        <Link href={'url'} target="_blank">
          <Button className="h-10 rounded-full border-2 border-white dark:border-gray-800">
            Hello
          </Button>
        </Link> */}
      </div>
    </motion.div>
  )
}

function HeroTitles() {
  return (
    <div className="flex w-full max-w-2xl flex-col space-y-4 overflow-hidden pt-8">
      <motion.h1
        className="text-center text-4xl font-medium leading-tight text-foreground sm:text-5xl md:text-6xl"
        initial={{ filter: 'blur(10px)', opacity: 0, y: 50 }}
        animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          ease,
          staggerChildren: 0.2,
        }}
      >
        {['Build', 'your', 'Forms', 'Faster'].map((text, index) => (
          <motion.span
            key={index}
            className="inline-block px-1 md:px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: index * 0.2,
              ease,
            }}
          >
            {text}
          </motion.span>
        ))}
      </motion.h1>
      <motion.p
        className="mx-auto max-w-xl text-center leading-7 text-muted-foreground"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.6,
          duration: 0.8,
          ease,
        }}
      >
        Create forms with{' '}
        <Link
          href="https://ui.shadcn.com/"
          target="_blank"
          className="hover:underline"
        >
          Shadcn
        </Link>
        ,{' '}
        <Link
          href="https://react-hook-form.com/"
          target="_blank"
          className="hover:underline"
        >
          react-hook-form
        </Link>{' '}
        and{' '}
        <Link
          href="https://zod.dev/"
          target="_blank"
          className="hover:underline"
        >
          zod
        </Link>{' '}
        within minutes.
      </motion.p>
    </div>
  )
}

function HeroCTA() {
  return (
    <>
      <motion.div
        className="mx-auto mt-3 flex w-full max-w-2xl flex-col items-center justify-center space-y-4 sm:mt-6 sm:flex-row sm:space-x-4 sm:space-y-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8, ease }}
      >
        <Link
          href="/playground"
          className={cn(
            buttonVariants({ variant: 'default' }),
            'w-full sm:w-auto text-background flex gap-2 rounded-full',
          )}
        >
          {/* <Icons.logo className="h-6 w-6" /> */}
          Go to Playground
        </Link>
      </motion.div>
      {/* <motion.p
        className="mt-5 text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.8 }}
      >
        7 day free trial. No credit card required.
      </motion.p> */}
    </>
  )
}

function HeroImage() {
  return (
    <motion.div
      className="relative mx-auto flex w-full items-center justify-center"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 1, ease }}
    >
      <HeroVideoDialog
        animationStyle="from-center"
        videoSrc="https://www.youtube.com/embed/25IzTkU3En4"
        thumbnailSrc="/demo.png"
        thumbnailAlt="Thumbnail"
        className="border rounded-lg shadow-lg max-w-screen-lg mt-16"
      />
    </motion.div>
  )
}

export default function HeroSection() {
  return (
    <section id="hero">
      <div className="relative flex w-full flex-col items-center justify-start px-4 pt-16 sm:px-6 sm:pt-24 md:pt-32 lg:px-8">
        <HeroPill />
        <HeroTitles />
        <HeroCTA />
        <HeroImage />
        <div className="pointer-events-none absolute inset-x-0 -bottom-12 h-1/3 bg-gradient-to-t from-background via-background to-transparent lg:h-1/4"></div>
      </div>
    </section>
  )
}
