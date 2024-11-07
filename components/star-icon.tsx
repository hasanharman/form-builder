'use client'

import { motion, useAnimation } from 'framer-motion'

const starPathTransition = {
  duration: 0.7,
  delay: 0.1,
}

const StarIcon = () => {
  const controls = useAnimation()

  return (
    <div
      className="cursor-pointer select-none  hover:text-yellow-500 rounded-md transition-colors duration-200 flex items-center justify-center"
      onMouseEnter={() => controls.start('animate')}
      onMouseLeave={() => controls.start('normal')}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.path
          d="M12 3l2.45 5.256 5.55.808-4 4.135.944 5.801L12 16.145 7.056 19 8 13.199l-4-4.135 5.55-.808z"
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
          transition={starPathTransition}
        />
      </svg>
    </div>
  )
}

export default StarIcon
