'use client'

import * as React from 'react'

import ClientTweetCard from '@/components/magicui/tweet-client'
import { useSampleFile } from '@/components/funny/use-sample-file'
import { ComponentDocShell } from '@/components/components/component-doc-shell'
import {
  BasketballUpload,
  type BasketballUploadHandle,
} from '@/components/ui/basketball-upload'

const INSPIRATION_TWEET_ID = '2109179709703504284'
const INSPIRATION_URL = `https://x.com/RaminNasibov/status/${INSPIRATION_TWEET_ID}`

const previewCode = `<BasketballUpload
  value={files}
  onValueChange={setFiles}
  accept="image/*,.pdf"
  maxSize={4 * 1024 * 1024}
  onUpload={async (file, report) => {
    // Send the file; call report(0..1) as it goes and the net fills up.
    await upload(file, report)
  }}
/>`

const usageCode = `import { BasketballUpload } from '@/components/ui/basketball-upload'

const [files, setFiles] = React.useState<File[]>([])

${previewCode}`

export default function BasketballUploadPreview() {
  const hoop = React.useRef<BasketballUploadHandle>(null)
  const [files, setFiles] = React.useState<File[]>([])

  useSampleFile(hoop)

  return (
    <ComponentDocShell
      name="basketball-upload"
      preview={
        <div className="flex justify-center">
          <BasketballUpload
            ref={hoop}
            value={files}
            onValueChange={setFiles}
            multiple
          />
        </div>
      }
      previewCode={previewCode}
      usageCode={usageCode}
      features={[
        'Pull the file back and let go to shoot. A dotted arc shows the first half second of the flight.',
        'Real misses: bricks off the rim, airballs and shots that never leave the floor. The file stays where it lands.',
        'The net is the progress bar. It fills as onUpload reports progress and turns green when the file is in.',
        'Dropping a file from your desktop puts it on the court. Dropping it straight into the hoop counts as a dunk.',
        'Enter or Space takes an assisted shot, three misses unlock "Let a pro shoot", and reduced motion skips the flight.',
        'accept, maxSize and multiple work like a normal file input. Reject the onUpload promise to drop the file back out.',
      ]}
      notes={
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">Inspiration</h3>
          <p>
            Based on{' '}
            <a
              href={INSPIRATION_URL}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4 hover:text-foreground"
            >
              &ldquo;File upload, basketball style&rdquo; by Ramin Nasibov
            </a>
            .
          </p>
          <div className="max-w-md">
            <ClientTweetCard id={INSPIRATION_TWEET_ID} />
          </div>
        </div>
      }
    />
  )
}
