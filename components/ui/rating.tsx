'use client'

import * as React from 'react'
import { Star, Heart, ThumbsUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface RatingProps {
  value: number
  onChange?: (value: number) => void
  max?: number
  icon?: 'star' | 'heart' | 'thumbsUp'
  size?: 'sm' | 'md' | 'lg'
  readOnly?: boolean
  className?: string
  style?: React.CSSProperties
}

const iconMap = {
  star: Star,
  heart: Heart,
  thumbsUp: ThumbsUp,
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
}

export const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      value,
      onChange,
      max = 5,
      icon = 'star',
      size = 'md',
      readOnly = false,
      className,
      ...props
    },
    ref,
  ) => {
    const [hoverValue, setHoverValue] = React.useState<number | null>(null)
    const Icon = iconMap[icon]

    const handleMouseEnter = (index: number) => {
      if (!readOnly) {
        setHoverValue(index)
      }
    }

    const handleMouseLeave = () => {
      setHoverValue(null)
    }

    const handleClick = (index: number) => {
      if (!readOnly && onChange) {
        onChange(index)
      }
    }

    return (
      <div ref={ref} className={cn('flex items-center', className)} {...props}>
        {[...Array(max)].map((_, index) => {
          const filled = (hoverValue !== null ? hoverValue : value) > index

          return (
            <Icon
              key={index}
              className={cn(
                sizeMap[size],
                'cursor-pointer transition-colors',
                filled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300',
                readOnly && 'cursor-default',
              )}
              onMouseEnter={() => handleMouseEnter(index + 1)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(index + 1)}
              aria-hidden={readOnly}
              role={readOnly ? undefined : 'button'}
              tabIndex={readOnly ? -1 : 0}
              aria-label={`Rate ${index + 1} out of ${max}`}
            />
          )
        })}
      </div>
    )
  },
)

Rating.displayName = 'Rating'
