'use client'

import { UploadTeaser } from '@/components/funny/upload-teaser'
import { BasketballUpload } from '@/components/ui/basketball-upload'

export default function BasketballUploadTeaser({
  playing,
}: {
  playing: boolean
}) {
  return <UploadTeaser game={BasketballUpload} playing={playing} />
}
