'use client'

import * as React from 'react'

import { useSampleFile } from '@/components/funny/use-sample-file'
import { ComponentDocShell } from '@/components/components/component-doc-shell'
import {
  PenaltyUpload,
  type PenaltyUploadHandle,
} from '@/components/ui/penalty-upload'

const previewCode = `<PenaltyUpload
  value={files}
  onValueChange={setFiles}
  accept="image/*,.pdf"
  maxSize={4 * 1024 * 1024}
  onUpload={async (file, report) => {
    // Send the file; call report(0..1) as it goes and the goal fills up.
    await upload(file, report)
  }}
/>`

const usageCode = `import { PenaltyUpload } from '@/components/ui/penalty-upload'

const [files, setFiles] = React.useState<File[]>([])

${previewCode}`

export default function PenaltyUploadPreview() {
  const goal = React.useRef<PenaltyUploadHandle>(null)
  const [files, setFiles] = React.useState<File[]>([])

  useSampleFile(goal)

  return (
    <ComponentDocShell
      name="penalty-upload"
      preview={
        <div className="flex justify-center">
          <PenaltyUpload
            ref={goal}
            value={files}
            onValueChange={setFiles}
            multiple
          />
        </div>
      }
      previewCode={previewCode}
      usageCode={usageCode}
      features={[
        'Click a spot in the goal to shoot there. Kicks drift a little, so aiming at the post is a risk.',
        'The keeper guesses a side on every kick. Guess right and the file is saved, unless it is in the top corner.',
        'Wide, over the bar, off the post: every miss gets its own call, and the file goes back on the spot.',
        'The goal is the progress bar. It fills as onUpload reports progress and turns green when the file is in.',
        'A five-dot shootout tracker shows your last kicks. Three failed kicks unlock "Send the keeper home".',
        'Enter or Space on the file picks a corner at random. accept, maxSize and multiple work like a normal file input.',
      ]}
    />
  )
}
