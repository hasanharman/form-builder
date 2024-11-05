'use client'

import { motion, Transition, useAnimation, Variants } from 'framer-motion'

const defaultTransition: Transition = {
  duration: 0.6,
  opacity: { duration: 0.2 },
}

const pathVariants: Variants = {
  normal: {
    pathLength: 1,
    opacity: 1,
  },
  animate: {
    opacity: [0, 1],
    pathLength: [0, 1],
  },
}

const SmileIcon = () => {
  const controls = useAnimation()

  return (
    <div
      className="cursor-pointer select-none p-1 transition-colors duration-200"
      onMouseEnter={() => controls.start('animate')}
      onMouseLeave={() => controls.start('normal')}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <motion.path
          d="M8 14s1.5 2 4 2 4-2 4-2"
          variants={pathVariants}
          transition={defaultTransition}
          animate={controls}
        />
        <line x1="9" x2="9.01" y1="9" y2="9" />
        <line x1="15" x2="15.01" y1="9" y2="9" />
      </svg>
    </div>
  )
}

export { SmileIcon }
