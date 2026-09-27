'use client'

import * as React from 'react'

import { ComponentDocShell } from '@/components/components/component-doc-shell'
import { Rating } from '@/components/ui/rating'

const previewCode = `<Rating value={rating} onChange={setRating} />
<Rating value={rating} onChange={setRating} icon="heart" size="lg" />`

const usageCode = `import { Rating } from '@/components/ui/rating'

const [rating, setRating] = React.useState(3)

<Rating value={rating} onChange={setRating} max={5} icon="star" size="md" />`

export default function RatingPreview() {
  const [rating, setRating] = React.useState(3)

  return (
    <ComponentDocShell
      name="rating"
      preview={
        <div className="space-y-3">
          <Rating value={rating} onChange={setRating} />
          <Rating value={rating} onChange={setRating} icon="heart" size="lg" />
        </div>
      }
      previewCode={previewCode}
      usageCode={usageCode}
      features={['Star, heart and thumbs-up icons.', 'sm, md and lg sizes.', 'Read-only mode for display.']}
    />
  )
}
