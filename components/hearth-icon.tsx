'use client'

import { motion, useAnimation } from 'framer-motion'

const heartPathTransition = {
  duration: 0.7,
  delay: 0.1,
}

const HeartIcon = () => {
  const controls = useAnimation()

  return (
    <div
      className="cursor-pointer select-none rounded-md mr-1 transition-colors hover:text-red-500 duration-200 flex items-center justify-center"
      onMouseEnter={() => controls.start('animate')}
      onMouseLeave={() => controls.start('normal')}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.path
          d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
          variants={{
            normal: {
              pathLength: 1,
              opacity: 1,
              pathOffset: 0,
            },
            animate: {
              pathLength: [0, 1],
              opacity: [0, 1],
              pathOffset: [0.2, 0],
            },
          }}
          initial="normal"
          animate={controls}
          transition={heartPathTransition}
        />
      </svg>
    </div>
  )
}

export default HeartIcon
