'use client'

import { UploadTeaser } from '@/components/funny/upload-teaser'
import { PenaltyUpload } from '@/components/ui/penalty-upload'

export default function PenaltyUploadTeaser({ playing }: { playing: boolean }) {
  return <UploadTeaser game={PenaltyUpload} playing={playing} />
}
