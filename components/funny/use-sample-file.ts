import * as React from 'react'

type Adder = { add: (files: File[]) => void }

export const sampleFile = () =>
  new File(['Nothing but net.'], 'resume.pdf', { type: 'application/pdf' })

/** Puts a sample file into a funny upload once, so its demo has something to play with. */
export function useSampleFile(ref: React.RefObject<Adder | null>) {
  const seeded = React.useRef(false)
  React.useEffect(() => {
    if (seeded.current) return // StrictMode runs effects twice
    seeded.current = true
    ref.current?.add([sampleFile()])
  }, [ref])
}
