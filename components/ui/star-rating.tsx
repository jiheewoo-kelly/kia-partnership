'use client'

import * as React from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  onChange?: (rating: number) => void
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function StarRating({ rating, onChange, readonly = false, size = 'md' }: StarRatingProps) {
  const [hoverRating, setHoverRating] = React.useState(0)

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = (hoverRating || rating) >= star
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            className={cn(
              'transition-colors',
              readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
            )}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => !readonly && setHoverRating(star)}
            onMouseLeave={() => !readonly && setHoverRating(0)}
          >
            <Star
              className={cn(
                sizeClasses[size],
                filled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
              )}
            />
          </button>
        )
      })}
    </div>
  )
}
